import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextField } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardTempProps {
  element: ScorecardElement;
}

export default function ScorecardTemp({ element }: ScorecardTempProps) {
  const {
    register,
    watch,
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
        label={element.label}
        placeholder="Enter temperature (-30 to 110ºF)"
        value={watch(`${element.id}.numericValue`)}
        type="number"
        error={!!errors[`${element.id}.numericValue`]}
        helperText={
          errors[`${element.id}.numericValue`]
            ? String(errors[`${element.id}.numericValue`]?.message)
            : ""
        }
      />
    </Stack>
  );
}
