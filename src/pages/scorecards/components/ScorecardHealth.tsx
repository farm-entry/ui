import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextArea } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardHealthProps {
  element: ScorecardElement;
}

export default function ScorecardHealth({ element }: ScorecardHealthProps) {
  const {
    register,
    formState: { errors }
  } = useFormContext();

  return (
    <Stack spacing={2}>
      <TextField
        {...register(`${element.id}.numericValue`, {
          required: "This field is required",
          min: { value: 0, message: "Must be at least 0." },
          max: { value: 100, message: "Must be at most 100." },
          valueAsNumber: true
        })}
        type="number"
        placeholder="Enter percentage (0-100)"
        error={!!errors[`${element.id}.numericValue`]}
        helperText={
          errors[`${element.id}.numericValue`]
            ? String(errors[`${element.id}.numericValue`]?.message)
            : ""
        }
        fullWidth
      />
      <TextArea
        {...register(`${element.id}.stringValue`)}
        rows={2}
        placeholder="Comments..."
      />
    </Stack>
  );
}
