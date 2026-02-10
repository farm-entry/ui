import { Assignment } from "@mui/icons-material";
import { Alert, Button, Snackbar, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomHeader from "../../components/framework/CustomHeader";
import LoadingSpinner from "../../components/framework/LoadingSpinner";
import CustomFormsLayout from "../../layouts/forms";
import { scorecardPages } from "../../mock";
import { usePostingGroupsStore } from "../../store/postingGroupsStore";
import { ScorecardPages } from "../../store/types/scorecards";
import ScorecardElementRenderer from "./ScorecardElementRenderer";
import ScorecardSetup from "./components/ScorecardSetup";
import { transformScorecardFormData } from "./helpers";

export default function ScorecardsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    getPostingGroups,
    postingGroups,
    isLoading: postingGroupsLoading
  } = usePostingGroupsStore();
  const [submitStatus, setSubmitStatus] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [initLoading, setInitLoading] = useState(true);

  const scorecardData = scorecardPages as ScorecardPages;
  const pages = scorecardData;

  const methods = useForm<Record<string, any>>({
    mode: "onChange",
    defaultValues: {}
  });

  const {
    handleSubmit,
    trigger,
    getValues,
    register,
    setValue,
    watch,
    formState: { errors }
  } = methods;

  const handleNext = async () => {
    let fieldsToValidate: string[];
    if (activeStep === 0) {
      fieldsToValidate = ["postingGroup", "scorecardType"];
    } else {
      const currentPageElements = pages[activeStep - 1]?.elements || [];
      fieldsToValidate = currentPageElements.map((element) => element.id);
      console.log("Fields to validate:", fieldsToValidate);
    }

    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true });

    console.log("Fields to validate:", isStepValid);

    if (isStepValid && activeStep < pages.length) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const { postingGroup, scorecardType, ...scorecardData } = formData;
      const payload = transformScorecardFormData(scorecardData, postingGroup, scorecardType);

      console.log("Submitting scorecard data:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        open: true,
        message: "Scorecard submitted successfully!",
        severity: "success"
      });
    } catch (error) {
      console.error("Error submitting scorecard:", error);
      setSubmitStatus({
        open: true,
        message: "Failed to submit scorecard. Please try again.",
        severity: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitStatus((prev) => ({ ...prev, open: false }));
  };

  const isLastStep = activeStep === pages.length;

  useEffect(() => {
    setInitLoading(true);
    const promises = [];
    if (!(postingGroups.length > 0)) promises.push(getPostingGroups());

    Promise.all(promises).finally(() => {
      setInitLoading(false);
    });
  }, []);

  return (
    <>
      {initLoading && <LoadingSpinner />}
      {!initLoading && (
        <CustomFormsLayout>
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            <Step>
              <StepLabel>Setup</StepLabel>
            </Step>
            {pages.map((_, index) => (
              <Step key={index}>
                <StepLabel />
              </Step>
            ))}
          </Stepper>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack>
                {activeStep === 0 && (
                  <ScorecardSetup
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    postingGroups={postingGroups}
                    postingGroupsLoading={postingGroupsLoading}
                  />
                )}

                {activeStep > 0 && pages[activeStep - 1] && (
                  <PageContainer
                    slots={{
                      header: () => (
                        <CustomHeader
                          icon={Assignment}
                          title={activeStep === 0 ? "Scorecard Setup" : pages[activeStep - 1].title}
                        />
                      )
                    }}
                  >
                    {pages[activeStep - 1].elements.map((element, index) => (
                      <Stack key={element.id} spacing={2} mb={2}>
                        <ScorecardElementRenderer element={element} elementIndex={index} />
                      </Stack>
                    ))}
                  </PageContainer>
                )}
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0 || isSubmitting}
                  variant="outlined"
                  size="large"
                  fullWidth
                >
                  Back
                </Button>

                <Button type="submit" variant="contained" size="large" color="primary" fullWidth>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>

                <Button
                  onClick={handleNext}
                  variant="contained"
                  size="large"
                  disabled={isLastStep}
                  fullWidth
                >
                  Next
                </Button>
              </Stack>
            </form>
          </FormProvider>
          <Snackbar
            open={submitStatus.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={submitStatus.severity}
              sx={{ width: "100%" }}
            >
              {submitStatus.message}
            </Alert>
          </Snackbar>
        </CustomFormsLayout>
      )}
    </>
  );
}
