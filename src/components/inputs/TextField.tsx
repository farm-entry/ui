import * as React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  label: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { label, helperText, ...rest } = props;

  return (
    <MuiTextField
      ref={ref}
      variant="outlined"
      label={label}
      helperText={helperText}
      fullWidth
      {...rest}
    />
  );
});