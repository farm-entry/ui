import * as React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface TextAreaProps extends Omit<TextFieldProps, 'variant' | 'multiline' | 'rows'> {
  label: string;
  rows?: number;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLInputElement, TextAreaProps>((props, ref) => {
  const { label, rows = 4, helperText, ...rest } = props;

  return (
    <TextField
      ref={ref}
      variant="outlined"
      label={label}
      multiline
      rows={rows}
      helperText={helperText}
      fullWidth
      {...rest}
    />
  );
});