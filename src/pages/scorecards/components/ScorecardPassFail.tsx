import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText, Button, ButtonGroup } from "@mui/material";
import { TextArea } from "../../../components/inputs";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardPassFailProps {
  label: string;
  id: string;
}

const ScorecardPassFail: React.FC<ScorecardPassFailProps> = ({ label, id }) => {
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
          render={({ field }) => (
            <ButtonGroup orientation="horizontal" fullWidth sx={{ mt: 1 }}>
              <Button
                variant={field.value === 1 ? "contained" : "outlined"}
                onClick={() => field.onChange(1)}
              >
                Pass
              </Button>
              <Button
                variant={field.value === -1 ? "contained" : "outlined"}
                onClick={() => field.onChange(-1)}
              >
                Fail
              </Button>
            </ButtonGroup>
          )}
        />
        {errors[name] && <FormHelperText error>{String(errors[name]?.message)}</FormHelperText>}
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

export default ScorecardPassFail;
