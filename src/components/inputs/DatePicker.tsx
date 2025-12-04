import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";

// Add noTimestamp to the interface
export interface CustomDatePickerProps extends Omit<MuiDatePickerProps, "variant"> {
  label?: string;
  value?: Date | null;
  onChange: (value: Date | null) => void;
  helperText?: string;
  error?: boolean;
  noTimestamp?: boolean; // Add this new prop
  // ...other existing props
}

export const DatePicker = React.forwardRef<HTMLDivElement, CustomDatePickerProps>((props, ref) => {
  const { noTimestamp = false, ...other } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        {...other}
        ref={ref}
        format="yyyy-MM-dd"
        // ...rest of your existing props
      />
    </LocalizationProvider>
  );
});
