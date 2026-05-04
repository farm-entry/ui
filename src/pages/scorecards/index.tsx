import { Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import CustomFormsLayout from "../../layouts/forms";
import { scorecardApi } from "../../services/scorecardApi";
import { useGlobalAlertStore } from "../../store/globalAlertStore";
import { usePostingGroupsStore } from "../../store/postingGroupsStore";
import { useScorecardStore } from "../../store/scorecardStore";
import { ScorecardFormData, ScorecardPage } from "../../store/types/scorecards";
import ScorecardElementRenderer from "./components/ScorecardElementRenderer";
import ScorecardReview from "./components/ScorecardReview";
import ScorecardSetup from "./components/ScorecardSetup";
import { transformScorecardFormData } from "./helpers";
import { Button } from "../../components/inputs";
import CustomHeader from "../../components/framework/CustomHeader";

export type { ScorecardFormData };

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

  const { handleSubmit, trigger, watch, setValue } = methods;

  const job = watch("job");
  const scorecardType = watch("postingGroup");

  // Review step is always the last step, after all scorecard pages
  const reviewStepIndex = pages.length + 1;
  const isReviewStep = activeStep === reviewStepIndex;

  useEffect(() => {
    if (scorecardType && job) getScorecardConfig(job, scorecardType);
  }, [scorecardType]);

  useEffect(() => {
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
      .catch((error: unknown) => {
        setAlert("error", error as Error);
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

  const handleReset = () => {
    setActiveStep(0);
    clearScorecardConfig();
    setValue("job", null);
    setValue("postingGroup", null);
  };

  return (
    <CustomFormsLayout
      headerOptions={{
        title: activeStep - 1 === pages.length ? "Review" : pages[activeStep - 1]?.title,
        button: { label: "reset", onClick: handleReset }
      }}
    >
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <>
          <Stepper activeStep={activeStep} sx={{ mb: 4, justifyContent: "center" }}>
            {/* <Step /> */}
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
            <form>
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
                  type="button"
                  onClick={handleBack}
                  disabled={activeStep === 0 || initLoading}
                  variant="text"
                  size="large"
                  fullWidth
                >
                  Back
                </Button>

                {isReviewStep && (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                    disabled={initLoading}
                    loading={initLoading}
                    onClick={handleSubmit(handleFormSubmit)}
                  >
                    {initLoading ? "Submitting..." : "Submit"}
                  </Button>
                )}
                {!isReviewStep && (
                  <Button
                    type="button"
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
