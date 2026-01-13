import React, { useEffect } from "react";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { TypeAhead } from "../../../components/inputs";
import { useFormContext, Controller } from "react-hook-form";
import { UserAbbreviatedType } from "../../../store/types/user";

export interface ScorecardCaretakerProps {
  label: string;
  id: string;
}

const ScorecardCaretaker: React.FC<ScorecardCaretakerProps> = ({ label, id }) => {
  // const { job, formState } = useScorecard();
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext();
  // const { data } = useScorecardPeopleQuery();
  const name = `${id}.stringValue`;
  // const { stringValue } = formState[id] || {};

  // useEffect(() => {
  //   if (!stringValue && job?.caretaker) {
  //     control._defaultValues[name] = job.caretaker;
  //   }
  // }, [job, name, stringValue]);

  // const people = ((data && data.people) || []).map((person: UserAbbreviatedType) => ({
  //   label: person.User_Name,
  //   value: person.User_Security_ID
  // }));
  const people: any[] = [];

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
            valueList={people}
            options={people}
            labelKey="label"
            valueKey="value"
            placeholder="Select caretaker"
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

export default ScorecardCaretaker;
