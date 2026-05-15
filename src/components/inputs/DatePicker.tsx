import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { useContext } from "react";
import { FormAnalyticsContext, trackInputFocus } from "../../analytics";

// Add noTimestamp to the interface
export interface CustomDatePickerProps extends Omit<MuiDatePickerProps, "variant"> {
  label?: string;
  value?: Date | null;
  onChange: (value: Date | null) => void;
  helperText?: string;
  error?: boolean;
  noTimestamp?: boolean;
  name?: string;
}

export const DatePicker = React.forwardRef<HTMLDivElement, CustomDatePickerProps>((props, ref) => {
  const { noTimestamp = false, name, onOpen, slotProps, ...other } = props;
  const { formName } = useContext(FormAnalyticsContext);

  const handleOpen = () => {
    trackInputFocus(name ?? "datepicker", formName, "datepicker");
    onOpen?.();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        {...other}
        ref={ref}
        onOpen={handleOpen}
        slotProps={{
          ...slotProps,
          textField: {
            InputLabelProps: { shrink: true },
            ...(typeof slotProps?.textField === "object" && slotProps.textField !== null
              ? slotProps.textField
              : {}),
          },
        }}
      />
    </LocalizationProvider>
  );
});
