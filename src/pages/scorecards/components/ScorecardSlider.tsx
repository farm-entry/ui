import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText } from "@mui/material";
import { Slider } from "../../../components/inputs";
import { TextArea } from "../../../components/inputs";
import { FormValue, useScorecard } from "../contexts/scorecard";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardSliderProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
}

const ScorecardSlider: React.FC<ScorecardSliderProps> = ({
  label,
  id,
  min,
  max,
  step
}) => {
  const { formState } = useScorecard();
  const { setValue } = useFormContext();
  const scoreName = `${id}.numericValue`;
  const commentsName = `${id}.stringValue`;
  const { stringValue, numericValue } = formState[id] || {};

  useEffect(() => {
    setValue(scoreName, numericValue ? numericValue : min);
  }, [min, numericValue, scoreName, setValue]);

  useEffect(() => {
    setValue(commentsName, stringValue ? stringValue : undefined);
  }, [commentsName, setValue, stringValue]);

  const { control, formState: { errors } } = useFormContext();

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
              showMarks
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

export const isComplete = ({ numericValue }: FormValue) =>
  typeof numericValue === "number";

export default ScorecardSlider;
