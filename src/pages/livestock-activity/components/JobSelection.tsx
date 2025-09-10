import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { TypeAhead, TypeAheadOption } from "../../../components/inputs";
import { ActivityTypeConfig } from "../configs";
import { FormData, Job } from "../../../store/livestockActivityStore";

interface JobSelectionProps {
  config: ActivityTypeConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  jobs: Job[];
  selectedJob?: any;
  watchedJob?: string;
  watchedFromJob?: string;
  watchedToJob?: string;
}

export const JobSelection: React.FC<JobSelectionProps> = ({
  config,
  control,
  errors,
  jobs,
  selectedJob,
}) => {
  const jobOptions = jobs.map((job) => ({
    value: job.number,
    label: `${job.number} - ${job.description}`,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        2. Job/Group Selection
      </Typography>

      {config.sections.jobSelection.showFromJob &&
      config.sections.jobSelection.showToJob ? (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Controller
            name="fromJob"
            control={control}
            rules={{ required: "From job is required" }}
            render={({ field, fieldState }) => {
              const selectedValue =
                jobs.find((job) => job.number === field.value) || null;
              const valueAsOption: TypeAheadOption | null = selectedValue
                ? {
                    value: selectedValue.number,
                    label: `${selectedValue.number} - ${selectedValue.description}`,
                  }
                : null;
              return (
                <TypeAhead
                  label={
                    config.sections.jobSelection.fromJobLabel || "From Group"
                  }
                  options={jobOptions}
                  value={valueAsOption}
                  onChange={(value) => field.onChange(value?.value || "")}
                  helperText={fieldState.error?.message}
                />
              );
            }}
          />
        </Stack>
      ) : (
        <Controller
          name="job"
          control={control}
          rules={{ required: "Job is required" }}
          render={({ field, fieldState }) => {
            const selectedValue =
              jobs.find((job) => job.number === field.value) || null;
            const valueAsOption: TypeAheadOption | null = selectedValue
              ? {
                  value: selectedValue.number,
                  label: `${selectedValue.number} - ${selectedValue.description}`,
                }
              : null;
            return (
              <TypeAhead
                label={
                  config.sections.jobSelection.jobLabel || "Select Job/Group"
                }
                options={jobOptions}
                value={valueAsOption}
                onChange={(value) => field.onChange(value?.value || "")}
                helperText={fieldState.error?.message}
              />
            );
          }}
        />
      )}

      {/* Job Information Display */}
      {selectedJob && (
        <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="subtitle2" gutterBottom>
            Job Information
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Typography variant="body2" color="textSecondary">
              Inventory: {selectedJob.inventory}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Dead: {selectedJob.deadQuantity}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Start: {selectedJob.startQuantity}
            </Typography>
            {selectedJob.healthStatus && (
              <Chip
                label={selectedJob.healthStatus.description}
                size="small"
                color={
                  selectedJob.healthStatus.color === "green"
                    ? "success"
                    : selectedJob.healthStatus.color === "red"
                      ? "error"
                      : "warning"
                }
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
