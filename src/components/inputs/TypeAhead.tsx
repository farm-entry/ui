import * as React from "react";
import { Autocomplete, TextField, FormControl, FormHelperText } from "@mui/material";

export interface TypeAheadOption {
  label: string;
  value: string | number;
}

export interface TypeAheadProps {
  label: string;
  options: TypeAheadOption[];
  value: TypeAheadOption | null;
  onChange: (value: TypeAheadOption | null) => void;
  helperText?: string;
  placeholder?: string;
  freeSolo?: boolean /* Allow custom text input */;
}

export const TypeAhead = React.forwardRef<HTMLDivElement, TypeAheadProps>((props, ref) => {
  const { label, options, value, onChange, helperText, placeholder, freeSolo = false } = props;

  const handleChange = (_: any, newValue: string | TypeAheadOption | null) => {
    if (typeof newValue === "string") {
      // Handle free solo text input
      onChange({ label: newValue, value: newValue });
    } else {
      // Handle option selection
      onChange(newValue);
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        ref={ref}
        options={options}
        value={value}
        onChange={handleChange}
        freeSolo={freeSolo}
        renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} variant="outlined" />}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});
