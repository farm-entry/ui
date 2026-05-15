import * as React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem, FormHelperText } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  onClear?: () => void;
  onC?: () => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { label, options, helperText, onClear, value, ...rest } = props;
  const labelId = `${label}-label`;

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        ref={ref}
        labelId={labelId}
        label={label}
        variant="outlined"
        value={value ?? ""}
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                }}
                size="small"
                sx={{ marginRight: 1 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});