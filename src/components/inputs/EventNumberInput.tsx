import * as React from "react";
import { useContext } from "react";
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from "@mui/material";
import { FormAnalyticsContext, trackInputFocus } from "../../analytics";
import { useConfirmationStore } from "../../store/confirmationStore";

export interface EventNumberInputProps extends Omit<MuiTextFieldProps, "variant"> {
  placeholder: string;
  helperText?: string;
  codeRegistration: any;
  quantityRegistration: any;
  allowNegative?: true | "ask";
}

export const EventNumberInput = React.forwardRef<HTMLInputElement, EventNumberInputProps>(
  (props, ref) => {
    const { placeholder, helperText, codeRegistration, quantityRegistration, allowNegative, ...rest } = props;
    const { formName } = useContext(FormAnalyticsContext);
    const showConfirmation = useConfirmationStore((state) => state.showConfirmation);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseFloat(e.target.value);
      const isNegative = !isNaN(numValue) && numValue < 0;

      if (isNegative && !allowNegative) {
        return;
      }

      if (isNegative && allowNegative === "ask") {
        showConfirmation(
          "Entered Negative Quantity",
          "Are you sure?",
          () => quantityRegistration.onChange(e)
        );
        return;
      }

      quantityRegistration.onChange(e);
    };

    return (
      <>
        <input aria-hidden="true" type="hidden" {...codeRegistration} />
        <MuiTextField
          ref={ref}
          {...quantityRegistration}
          variant="outlined"
          placeholder={placeholder}
          helperText={helperText}
          fullWidth
          onFocus={() => trackInputFocus(quantityRegistration.name ?? "unknown", formName, "event-number")}
          {...rest}
          onChange={handleChange}
        />
      </>
    );
  }
);
