import { Autocomplete, AutocompleteProps, FormControl, FormHelperText, TextField } from "@mui/material";
import * as React from "react";

export interface TypeAheadOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TypeAheadProps extends Omit<AutocompleteProps<TypeAheadOption, false, false, false>, "onChange" | "renderInput"> {
  label?: string;
  handleChange: (value: TypeAheadOption | null) => void;
  placeholder?: string;
}

export const TypeAhead = React.forwardRef<HTMLDivElement, TypeAheadProps>((props, ref) => {
  // const { label, defaultValue, onChange, helperText, placeholder, freeSolo = false } = props;
  const { handleChange, placeholder, ...other } = props;

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

  return (
    <FormControl fullWidth>
      <Autocomplete
        {...other}
        ref={ref}
        onChange={customChange}
        renderInput={(params) => <TextField placeholder={placeholder} {...params} variant="outlined" label={props.label} />}
      />
    </FormControl>
  );
});
