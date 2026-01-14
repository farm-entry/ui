import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText } from "@mui/material";
import { Slider, TextArea } from "../../../components/inputs";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardScoresProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
}

const ScorecardScores: React.FC<ScorecardScoresProps> = ({
  label,
  id,
  min,
  max,
  step
}) => {
  const { control, formState: { errors } } = useFormContext();
  const scoreName = `${id}.numericValue`;
  const commentsName = `${id}.stringValue`;

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>{label}</FormLabel>
        <Controller
          name={scoreName}
          control={control}
          render={({ field }) => (
            <Slider
              value={field.value || min}
              onChange={field.onChange}
              min={min}
              max={max}
              step={step}
              marks
            />
          )}
        />
        {errors[scoreName] && <FormHelperText error>{String(errors[scoreName]?.message)}</FormHelperText>}
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Comments</FormLabel>
        <Controller
          name={commentsName}
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={2}
              placeholder="Enter comments"
            />
          )}
        />
      </FormControl>
    </Box>
  );
};

export interface FormValue {
  stringValue?: string;
  numericValue?: number;
}

export const isComplete = ({ numericValue }: FormValue) =>
  typeof numericValue === "number";

export default ScorecardScores;
