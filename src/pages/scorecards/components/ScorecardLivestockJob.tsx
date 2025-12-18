import React, { useEffect } from "react";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { useScorecardLivestockJobsLazyQuery } from "../graphql/index";
import { TypeAhead } from "../../../components/inputs";
import { useScorecard, FormValue } from "../contexts/scorecard";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardLivestockJobProps {
  label: string;
  id: string;
}

const ScorecardLivestockJob: React.FC<ScorecardLivestockJobProps> = ({
  label,
  id
}) => {
  const { job, formState } = useScorecard();
  const { control, watch, formState: { errors } } = useFormContext();
  const [loadJobs, { data }] = useScorecardLivestockJobsLazyQuery();
  const name = `${id}.stringValue`;
  const { stringValue } = formState[id] || {};

  useEffect(() => {
    if (job) {
      loadJobs({ variables: { location: job.location } });
    }
  }, [job, loadJobs]);

  const jobs = ((data && data.jobs) || []).map(job => ({
    label: `${job.number} ${job.description}`,
    value: job.number
  }));

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TypeAhead
            {...field}
            watch={watch}
            fieldName={name}
            valueList={jobs}
            options={jobs}
            labelKey="label"
            valueKey="value"
            placeholder="Select livestock job"
            handleChange={(option) => field.onChange(option?.value)}
          />
        )}
      />
      {errors[name] && <FormHelperText error>{String(errors[name]?.message)}</FormHelperText>}
    </FormControl>
  );
};

export const isComplete = ({ stringValue }: FormValue) => !!stringValue;

export default ScorecardLivestockJob;
