import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextArea, TextField } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardRangeProps {
  element: ScorecardElement;
  min: number;
  max: number;
}

export default function ScorecardRange({ element, min, max }: ScorecardRangeProps) {
  const {
    register,
    watch,
    formState: { errors }
  } = useFormContext();

  return (
    <Stack spacing={2}>
      <TextField
        {...register(`${element.id}.numericValue`, {
          required: "This field is required",
          min: {
            value: min,
            message: `Must be at least ${min}.`
          },
          max: {
            value: max,
            message: `Must be at most ${max}.`
          },
          valueAsNumber: true
        })}
        label={element.description}
        placeholder={`Enter value (${min}-${max})`}
        value={watch(`${element.id}.numericValue`)}
        type="number"
        error={!!errors[`${element.id}.numericValue`]}
        helperText={
          errors[`${element.id}.numericValue`]
            ? String(errors[`${element.id}.numericValue`]?.message)
            : ""
        }
      />
      <TextArea
        {...register(`${element.id}.stringValue`)}
        rows={2}
        placeholder="Comments..."
      />
    </Stack>
  );
}
