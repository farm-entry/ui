import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText, Button, ButtonGroup } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardYesNoProps {
  label: string;
  id: string;
}

const ScorecardYesNo: React.FC<ScorecardYesNoProps> = ({ label, id }) => {
  // const { formState } = useScorecard();
  const { setValue } = useFormContext();
  const name = `${id}.numericValue`;
  // const { numericValue } = formState[id] || {};

  useEffect(() => {
    setValue(name, 0);
  }, [name, setValue]);

  const { control, formState: { errors } } = useFormContext();

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
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
              Yes
            </Button>
            <Button
              variant={field.value === -1 ? "contained" : "outlined"}
              onClick={() => field.onChange(-1)}
            >
              No
            </Button>
          </ButtonGroup>
        )}
      />
      {errors[name] && <FormHelperText error>{String(errors[name]?.message)}</FormHelperText>}
    </FormControl>
  );
};

export interface FormValue {
  stringValue?: string;
  numericValue?: number;
}

export const isComplete = ({ numericValue }: FormValue) =>
  typeof numericValue === "number";

export default ScorecardYesNo;
