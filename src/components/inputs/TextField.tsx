import * as React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  placeholder: string;
  helperText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { placeholder, helperText, ...rest } = props;

  return (
    <MuiTextField
      ref={ref}
      variant="outlined"
      placeholder={placeholder}
      helperText={helperText}
      fullWidth
      {...rest}
    />
  );
});