import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { DatePicker } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";
import { formatDateToYYYYMMDDNoTimestamp, parseYYYYMMDDToLocalDate } from "../../../utils/date";

interface ScorecardPostDateProps {
  element: ScorecardElement;
}

export default function ScorecardPostDate({ element }: ScorecardPostDateProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext();
  const fieldName = `${element.id}.stringValue`;
  const dateValue = watch(fieldName);

  useEffect(() => {
    // Set default to today's date if not already set
    if (!dateValue) {
      setValue(fieldName, formatDateToYYYYMMDDNoTimestamp(new Date()));
    }
  }, [dateValue, fieldName, setValue]);

  return (
    <Stack spacing={2}>
      <DatePicker
        {...register(fieldName, {
          required: "Posting date is required"
        })}
        value={parseYYYYMMDDToLocalDate(dateValue || "")}
        onChange={(v) => setValue(fieldName, formatDateToYYYYMMDDNoTimestamp(v))}
        // label="Posting Date"
        error={!!errors[fieldName]}
        helperText={errors[fieldName] ? String(errors[fieldName]?.message) : ""}
      />
    </Stack>
  );
}
