import { Button, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import CustomFormsLayout from "../../layouts/forms";
import { scorecardApi } from "../../services/scorecardApi";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { usePostingGroupsStore } from "../../store/postingGroupsStore";
import { useScorecardStore } from "../../store/scorecardStore";
import { FormData } from "../../store/types/forms";
import { ScorecardPage } from "../../store/types/scorecards";
import ScorecardElementRenderer from "./components/ScorecardElementRenderer";
import ScorecardReview from "./components/ScorecardReview";
import ScorecardSetup from "./components/ScorecardSetup";
import { transformScorecardFormData } from "./helpers";

export interface ScorecardFormData extends FormData {
  job: string | null;
  postingGroup: string | null;
  data: Array<{
    elementId: string;
    numericValue?: number;
    stringValue?: string;
  }>;
}

export default function ScorecardsPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { getPostingGroups, postingGroups } = usePostingGroupsStore();
  const { setAlert, clearAlert } = useGlobalAlertStore();
  const [initLoading, setInitLoading] = useState(true);

  const {
    clearScorecardConfig,
    scorecardConfig,
    getScorecardConfig,
    isLoading: scorecardLoading,
    currentJob,
    currentPostingGroup
  } = useScorecardStore();

  const pages: ScorecardPage[] = scorecardConfig?.pages || [];

  const methods = useForm<ScorecardFormData>({
    mode: "onChange",
    defaultValues: { form: "SCORECARDS" }
  });

  const { handleSubmit, trigger, reset, watch, setValue } = methods;

  const job = watch("job");
  const scorecardType = watch("postingGroup");

  // Review step is always the last step, after all scorecard pages
  const reviewStepIndex = pages.length + 1;
  const isReviewStep = activeStep === reviewStepIndex;

  useEffect(() => {
    if (!scorecardType || !job) {
      console.log(
        `Job (${job}) or scorecard type (${scorecardType}) not selected, skipping config fetch`
      );
    } else {
      getScorecardConfig(job, scorecardType);
    }
  }, [scorecardType]);

  useEffect(() => {
    console.log("Scorecard config updated, resetting form values");
    reset({ job, postingGroup: scorecardType });
    if (!scorecardConfig) return;
    for (const page of scorecardConfig.pages) {
      for (const element of page.elements) {
        if (element.min !== undefined) {
          setValue(`${element.id}.numericValue` as any, element.min);
        }
      }
    }
  }, [scorecardConfig]);

  const handleNext = async () => {
    const isStepValid = await trigger(["postingGroup"]);

    if (isStepValid && activeStep < reviewStepIndex) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleFormSubmit = async (formData: ScorecardFormData) => {
    clearAlert();
    setInitLoading(true);
    const state = {
      formData: { Job: formData.job, Type: formData.postingGroup, form: "SCORECARDS" },
      section: "scorecards"
    };
    await scorecardApi
      .postScorecard(formData.job!, transformScorecardFormData(formData))
      .then(() => {
        handleReset();
        navigate("/post-success", { state });
      })
      .catch((error: Error) => {
        console.error("Unable to post form.");
        const errorMessage = error.message || "Unable to submit form. Please try again.";
        const errorTitle = (error as any).code || formData.form + "_SUBMISSION_ERROR";
        setAlert("error", errorMessage, errorTitle);
      })
      .finally(() => {
        setInitLoading(false);
      });
  };

  useEffect(() => {
    setInitLoading(true);
    const promises = [];
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).finally(() => {
      if (scorecardConfig && currentJob && currentPostingGroup) {
        setValue("job", currentJob);
        setValue("postingGroup", currentPostingGroup);
        setActiveStep(1);
      }
      setInitLoading(false);
    });
  }, []);

  const headerTitle = () => {
    if (activeStep === 0) return "Scorecard Setup";
    if (isReviewStep) return "Review";
    return pages[activeStep - 1]?.title ?? "";
  };

  const handleReset = () => {
    setActiveStep(0);
    clearScorecardConfig();
    setValue("job", null);
    setValue("postingGroup", null);
  };

  return (
    <CustomFormsLayout headerOptions={{ button: { label: "reset", onClick: handleReset } }}>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <Stepper activeStep={activeStep} sx={{ mb: 4, justifyContent: "center" }}>
            <Step>
              <StepLabel>Setup</StepLabel>
            </Step>
            {pages.map((_, index) => (
              <Step key={index}>
                <StepLabel />
              </Step>
            ))}
            <Step>
              <StepLabel
                onClick={() => setActiveStep(reviewStepIndex)}
                sx={{
                  cursor: "pointer",
                  "& .MuiStepLabel-label": {
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" }
                  }
                }}
              >
                Review
              </StepLabel>
            </Step>
          </Stepper>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack>
                {activeStep === 0 && <ScorecardSetup />}

                {activeStep > 0 && activeStep <= pages.length && pages[activeStep - 1] && (
                  <>
                    {pages[activeStep - 1].elements.map((element, index) => (
                      <Stack key={element.id} spacing={2} mb={2}>
                        <ScorecardElementRenderer element={element} elementIndex={index} />
                      </Stack>
                    ))}
                  </>
                )}

                {isReviewStep && <ScorecardReview onGoToStep={setActiveStep} />}
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || initLoading}
                  variant="text"
                  size="large"
                  fullWidth
                >
                  Back
                </Button>

                {isReviewStep ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                    disabled={initLoading}
                    loading={initLoading}
                  >
                    {initLoading ? "Submitting..." : "Submit"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    variant="outlined"
                    size="large"
                    disabled={scorecardLoading || initLoading}
                    fullWidth
                    loading={scorecardLoading}
                  >
                    Next
                  </Button>
                )}
              </Stack>
            </form>
          </FormProvider>
        </>
      )}
    </CustomFormsLayout>
  );
}
