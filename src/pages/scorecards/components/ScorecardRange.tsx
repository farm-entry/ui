import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText } from "@mui/material";
import { TextField, TextArea } from "../../../components/inputs";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardRangeInputProps {
  label: string;
  id: string;
  min: number;
  max: number;
}

const ScorecardRangeInput: React.FC<ScorecardRangeInputProps> = ({
  label,
  id,
  min,
  max
}) => {
  // const { formState } = useScorecard();
  const { control, formState: { errors } } = useFormContext();
  const name = `${id}.numericValue`;
  const commentsName = `${id}.stringValue`;
  // const { stringValue, numericValue } = formState[id] || {};

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>{label}</FormLabel>
        <Controller
          name={name}
          control={control}
          rules={{
            min: {
              value: min,
              message: `Must be at least ${min}.`
            },
            max: {
              value: max,
              message: `Must be at most ${max}.`
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              placeholder={`Enter value (${min}-${max})`}
              error={!!errors[name]}
              helperText={errors[name] ? String(errors[name]?.message) : ""}
            />
          )}
        />
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

export default ScorecardRangeInput;
