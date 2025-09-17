import AgricultureIcon from "@mui/icons-material/Agriculture";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button, Select } from "../../components/inputs";
import { livestockActivityApi } from "../../services/livestockActivityApi";
import {
  FormData,
  useLivestockActivityStore,
} from "../../store/livestockActivityStore";
import { activityConfigs, activityTypeOptions } from "./configs";
import { JobSelection, ActivityFormFields } from "./components";
import CustomFormsLayout from "../../layouts/forms";

interface FormInputs extends FormData {}

export default function LivestockActivityPage() {
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    formData,
    updateFormData,
    jobs,
    eventTypes,
    healthStatuses,
    dimensionPackers,
    setJobs,
    setEventTypes,
    setHealthStatuses,
    setDimensionPackers,
    isLoading,
    setLoading,
    error,
    setError,
    clearForm,
    validateForm,
  } = useLivestockActivityStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({ defaultValues: formData });

  const watchedActivityType = watch("activityType");
  const watchedJob = watch("job");
  const watchedEvent = watch("event");
  const watchedQuantity = watch("quantity");

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [jobsData, healthStatusesData, dimensionPackersData] =
          await Promise.all([
            livestockActivityApi.fetchJobs(),
            livestockActivityApi.fetchHealthStatuses(),
            livestockActivityApi.fetchDimensionPackers(),
          ]);

        setJobs(jobsData);
        setHealthStatuses(healthStatusesData);
        setDimensionPackers(dimensionPackersData);
      } catch (err) {
        setError("Failed to load reference data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [setJobs, setHealthStatuses, setDimensionPackers, setLoading, setError]);

  // Load event types when activity type changes
  useEffect(() => {
    const loadEventTypes = async () => {
      if (watchedActivityType) {
        setLoading(true);
        try {
          const eventTypesData =
            await livestockActivityApi.fetchEventTypes(watchedActivityType);
          setEventTypes(eventTypesData);

          // Auto-select event if only one option
          if (eventTypesData.length === 1) {
            setValue("event", eventTypesData[0].code);
            updateFormData({ event: eventTypesData[0].code });
          }
        } catch (err) {
          setError("Failed to load event types");
        } finally {
          setLoading(false);
        }
      }
    };

    loadEventTypes();
  }, [
    watchedActivityType,
    setEventTypes,
    setLoading,
    setError,
    setValue,
    updateFormData,
  ]);

  // Update store when form values change
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value as Partial<FormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  const selectedJob = jobs.find((job) => job.number === watchedJob);
  const selectedEvent = eventTypes.find((event) => event.code === watchedEvent);
  const currentConfig = watchedActivityType
    ? activityConfigs[watchedActivityType]
    : null;

  const onSubmit = async (data: FormInputs) => {
    setSubmitMessage(null);

    const validation = validateForm();
    if (!validation.isValid) {
      setSubmitMessage({
        type: "error",
        message: validation.errors.join(", "),
      });
      return;
    }

    setLoading(true);
    try {
      await livestockActivityApi.saveFormData(data);
      setSubmitMessage({
        type: "success",
        message: "Livestock activity saved successfully!",
      });
    } catch (err) {
      setSubmitMessage({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    clearForm();
    reset();
    setSubmitMessage(null);
  };

  return (
    <CustomFormsLayout>
      <Box display="flex" alignItems="center" mb={3}>
        <AgricultureIcon sx={{ fontSize: 32, mr: 2 }} color="primary" />
        <Typography variant="h4">Livestock Activity</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {submitMessage && (
        <Alert severity={submitMessage.type} sx={{ mb: 3 }}>
          {submitMessage.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* Activity Type Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>
              1. Select Activity Type
            </Typography>
            <Controller
              name="activityType"
              control={control}
              rules={{ required: "Activity type is required" }}
              render={({ field, fieldState }) => (
                <Select
                  label="Activity Type"
                  options={activityTypeOptions}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          <Divider />

          {/* Job Selection and Activity Fields */}
          {watchedActivityType && currentConfig && (
            <>
              <JobSelection
                config={currentConfig}
                control={control}
                errors={errors}
                jobs={jobs}
                selectedJob={selectedJob}
                watchedJob={watchedJob}
              />

              <Divider />

              {/* Event Selection */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  3. Event Selection
                </Typography>
                <Controller
                  name="event"
                  control={control}
                  rules={{ required: "Event is required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Event Type"
                      options={eventTypes.map((event) => ({
                        value: event.code,
                        label: event.description,
                      }))}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>

              <Divider />

              <ActivityFormFields
                config={currentConfig}
                control={control}
                errors={errors}
                watchedQuantity={watchedQuantity}
                selectedEvent={selectedEvent}
                dimensionPackers={dimensionPackers}
              />

              <Divider />

              {/* Submit Buttons */}
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearForm}
                  disabled={isLoading}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Activity"}
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </form>
    </CustomFormsLayout>
  );
}
