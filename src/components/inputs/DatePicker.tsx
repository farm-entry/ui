import * as React from "react";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";

export type CustomDatePickerProps = Omit<MuiDatePickerProps, "variant"> & {
  error?: boolean;
  helperText?: string;
};

export const DatePicker = React.forwardRef<HTMLDivElement, CustomDatePickerProps>((props, ref) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        ref={ref}
        slotProps={{
          textField: {
            variant: "outlined",
            fullWidth: true,
            helperText: props.helperText,
            error: !!props.error,
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
});
