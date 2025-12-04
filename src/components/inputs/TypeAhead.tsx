import { Autocomplete, AutocompleteProps, FormControl, TextField } from "@mui/material";
import * as React from "react";
import { useMemo } from "react";
import { UseFormWatch } from "react-hook-form";

export interface TypeAheadOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TypeAheadProps<T = any> extends Omit<AutocompleteProps<TypeAheadOption, false, false, false>, "onChange" | "renderInput" | "options"> {
  label?: string;
  handleChange: (value: TypeAheadOption | null) => void;
  placeholder?: string;
  watch: UseFormWatch<any>;
  fieldName: any;
  options?: T extends { [key: string]: any } ? T[] : any[];
  valueList: T extends { [key: string]: any } ? T[] : any[];
  labelKey: keyof T;
  valueKey: keyof T;
  defaultValue?: TypeAheadOption | null;
  labelFormatter?: (item: T) => string;
}

// Memoize the selected group value
const useTypeAheadValue = (props: TypeAheadProps): TypeAheadOption | null => {
  const { watch, fieldName, valueList, labelKey, valueKey, defaultValue, labelFormatter } = props;
  return useMemo(() => {
    const fieldValue = watch(fieldName);

    if (!fieldValue) {
      return defaultValue || null;
    }

    const option = valueList.find((item) => item[valueKey] === fieldValue);
    return option
      ? ({
          label: labelFormatter ? labelFormatter(option) : String(option[labelKey]),
          value: option[valueKey],
        } as TypeAheadOption)
      : null;
  }, [watch(fieldName), valueList, defaultValue]);
};

export const TypeAhead = React.forwardRef<HTMLDivElement, TypeAheadProps>((props, ref) => {
  const { watch, fieldName, valueList, options, labelKey, valueKey, defaultValue, handleChange, placeholder, labelFormatter, ...other } = props;

  const customChange = (_: any, newValue: TypeAheadOption | string | null) => {
    if (typeof newValue === "string") {
      // Handle free solo text input
      console.log("Free solo input:", newValue);
      handleChange({ label: newValue, value: newValue });
    } else {
      // Handle option selection
      handleChange(newValue);
    }
  };

  const useValue = useTypeAheadValue(props);

  return (
    <FormControl fullWidth>
      <Autocomplete
        {...other}
        ref={ref}
        value={useValue}
        onChange={customChange}
        options={valueList.map((event) => ({
          label: labelFormatter ? labelFormatter(event) : String(event[labelKey]),
          value: event[valueKey],
        }))}
        renderInput={(params) => <TextField placeholder={placeholder} {...params} variant="outlined" label={props.label} />}
      />
    </FormControl>
  );
});
