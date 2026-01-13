import { isMatch } from "date-fns";
import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { DatePicker } from "../../../components/inputs";

export interface ScorecardPostingDateProps {
  label: string;
  id: string;
}

const DATEFORMAT = "MM/dd/yyyy";

const ScorecardPostingDate: React.FC<ScorecardPostingDateProps> = ({
  label,
  id
}) => {
  // const { formState } = useScorecard();
  const { control, formState: { errors } } = useFormContext();
  const name = `${id}.stringValue`;
  // const { stringValue } = formState[id] || {};

  // useEffect(() => {
  //   if (!stringValue) {
  //     control._defaultValues[name] = formInputDate(dateInputDate(new Date()));
  //   }
  // }, [name, stringValue]);

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: {
            isDate: (value: string) =>
              !value ||
              isMatch(value, DATEFORMAT) ||
              "Date must be in format MM/DD/YYYY"
          }
        }}
        render={({ field }) => (
          <DatePicker
            {...field}
            label=""
            value={field.value ? new Date(field.value) : new Date()}
            onChange={(date) => field.onChange(date ? date.toISOString() : "")}
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

export default ScorecardPostingDate;
