import React, { useEffect } from "react";
import { Box, FormControl, FormLabel, FormHelperText } from "@mui/material";
import { TypeAhead } from "../../../components/inputs";
import { useFormContext, Controller } from "react-hook-form";

export interface ScorecardSupervisorProps {
  label: string;
  id: string;
}

const ScorecardSupervisor: React.FC<ScorecardSupervisorProps> = ({
  label,
  id
}) => {
  // const { data } = useScorecardUsersQuery();
  // const { job, formState } = useScorecard();
  const { control, watch, formState: { errors } } = useFormContext();

  const name = `${id}.stringValue`;
  // const { stringValue } = formState[id] || {};

  // useEffect(() => {
  //   if (!stringValue && job?.projectManager) {
  //     control._defaultValues[name] = job.projectManager;
  //   }
  // }, [job, name, stringValue]);

  // const users = ((data && data.users) || [])
  //   .filter((person: any) => person.name.length > 0)
  //   .map((user: any) => ({
  //     label: user.name || (user.username || "").split("/")[1] || user.username,
  //     value: user.username
  //   }));
  const users: any[] = [];

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TypeAhead
            {...field}
            watch={watch}
            fieldName={name}
            valueList={users}
            options={users}
            labelKey="label"
            valueKey="value"
            placeholder="Select supervisor"
            handleChange={(option) => field.onChange(option?.value)}
          />
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

export const isComplete = ({ stringValue }: FormValue) => !!stringValue;

export default ScorecardSupervisor;
