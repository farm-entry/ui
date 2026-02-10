import { FormHelperText, Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardSupervisorProps {
  element: ScorecardElement;
}

export default function ScorecardSupervisor({ element }: ScorecardSupervisorProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext();

  return (
    <Stack spacing={2}>
      <TypeAhead
        {...register(`${element.id}.stringValue`, { required: "Supervisor is required" })}
        handleChange={(v) => setValue(`${element.id}.stringValue`, v?.value ?? null)}
        watch={watch}
        fieldName={`${element.id}.stringValue`}
        valueList={[]}
        labelKey="label"
        valueKey="value"
        placeholder="Select supervisor"
      />
      {errors[`${element.id}.stringValue`] && (
        <FormHelperText error>
          {String(errors[`${element.id}.stringValue`]?.message)}
        </FormHelperText>
      )}
    </Stack>
  );
}
