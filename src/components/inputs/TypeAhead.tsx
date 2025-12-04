import { Autocomplete, AutocompleteProps, FormControl, TextField } from "@mui/material";
import * as React from "react";
import { UseFormWatch } from "react-hook-form";
import useTypeAheadValue from "../../hooks/useMemoTypeahead";

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
  options: T extends { [key: string]: any } ? T[] : any[];
  valueList: T extends { [key: string]: any } ? T[] : any[];
  labelKey: keyof T;
  valueKey: keyof T;
  defaultValue?: TypeAheadOption | null;
}

export const TypeAhead = React.forwardRef<HTMLDivElement, TypeAheadProps>((props, ref) => {
  // const { label, defaultValue, onChange, helperText, placeholder, freeSolo = false } = props;
  const { watch, fieldName, valueList, options, labelKey, valueKey, defaultValue, handleChange, placeholder, ...other } = props;

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

  const useValue = useTypeAheadValue(watch, fieldName, valueList, labelKey, valueKey, defaultValue);

  return (
    <FormControl fullWidth>
      <Autocomplete
        {...other}
        ref={ref}
        value={useValue}
        onChange={customChange}
        options={options}
        renderInput={(params) => <TextField placeholder={placeholder} {...params} variant="outlined" label={props.label} />}
      />
    </FormControl>
  );
});
