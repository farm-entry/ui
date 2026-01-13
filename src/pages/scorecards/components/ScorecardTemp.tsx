import React, { useEffect } from "react";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { TextField } from "../../../components/inputs";

import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardTempProps {
  label: string;
  id: string;
}

const ScorecardTempInput: React.FC<ScorecardTempProps> = ({ label, id }) => {
  // const { formState } = useScorecard();
  const { control, formState: { errors } } = useFormContext();
  const name = `${id}.numericValue`;
  // const { numericValue } = formState[id] || {};

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>{label} (ºF)</FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          min: {
            value: -30,
            message: `Must be at least -30ºF.`
          },
          max: {
            value: 110,
            message: `Must be at most 110ºF.`
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            placeholder="Temperature"
            error={!!errors[name]}
            helperText={errors[name] ? String(errors[name]?.message) : ""}
          />
        )}
      />
    </FormControl>
  );
};

export interface FormValue {
  stringValue?: string;
  numericValue?: number;
}

export const isComplete = ({ numericValue }: FormValue) =>
  typeof numericValue === "number";

export default ScorecardTempInput;
