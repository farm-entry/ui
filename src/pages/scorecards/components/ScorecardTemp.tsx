import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardTempProps {
  element: ScorecardElement;
}

export default function ScorecardTemp({ element }: ScorecardTempProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <Stack spacing={2}>
      <TextField
        {...register(`${element.id}.numericValue`, {
          required: "Temperature is required",
          min: {
            value: -30,
            message: "Must be at least -30ºF."
          },
          max: {
            value: 110,
            message: "Must be at most 110ºF."
          },
          valueAsNumber: true
        })}
        type="number"
        placeholder="Enter temperature (-30 to 110ºF)"
        error={!!errors[`${element.id}.numericValue`]}
        helperText={
          errors[`${element.id}.numericValue`]
            ? String(errors[`${element.id}.numericValue`]?.message)
            : ""
        }
        fullWidth
      />
    </Stack>
  );
}
