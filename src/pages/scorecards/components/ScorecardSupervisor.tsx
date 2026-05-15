import { FormHelperText, Stack } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { TypeAhead } from "../../../components/inputs";
import { useScorecardStore } from "../../../store/scorecardStore";
import { ScorecardElement } from "../../../store/types/scorecards";
import { useUserStore } from "../../../store/userStore";

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

  const { username, firstName, lastName } = useUserStore();
  const name = [firstName, lastName].filter(Boolean).join(" ");

  const { users, getResources } = useScorecardStore();

  useEffect(() => {
    if (users.length === 0) getResources();
  }, []);

  return (
    <Stack spacing={2}>
      <TypeAhead
        {...register(`${element.id}.stringValue`, { required: "Supervisor is required" })}
        handleChange={(v) => setValue(`${element.id}.stringValue`, v?.value ?? null)}
        watch={watch}
        label="Supervisor"
        fieldName={`${element.id}.stringValue`}
        defaultValue={{ value: username, label: name }}
        valueList={users}
        labelKey="name"
        valueKey="username"
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
