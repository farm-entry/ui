import { Autocomplete, AutocompleteProps, FormControl, TextField } from "@mui/material";
import * as React from "react";
import { useContext, useMemo, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormAnalyticsContext, trackInputFocus, trackTypeAheadSelection } from "../../analytics";

export interface TypeAheadOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface TypeAheadProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends Omit<
    AutocompleteProps<TypeAheadOption, false, false, false>,
    "onChange" | "renderInput" | "options"
  > {
  label?: string;
  handleChange: (value: TypeAheadOption | null) => void;
  placeholder?: string;
  watch: UseFormWatch<any>;
  fieldName: string;
  options?: T[];
  valueList: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  defaultValue?: TypeAheadOption | null;
  labelFormatter?: (item: any) => string;
}

// Memoize the selected group value
const useTypeAheadValue = (props: TypeAheadProps): TypeAheadOption | null => {
  const { watch, fieldName, valueList, labelKey, valueKey, defaultValue, labelFormatter } = props;
  const fieldValue = watch(fieldName);

  return useMemo(() => {
    if (!fieldValue) {
      return defaultValue || null;
    }

    const option = valueList && valueList.find((item) => item[valueKey] === fieldValue);
    return option
      ? ({
          label: labelFormatter ? labelFormatter(option) : String(option[labelKey]),
          value: option[valueKey]
        } as TypeAheadOption)
      : null;
  }, [fieldValue, valueList, defaultValue, labelKey, valueKey, labelFormatter]);
};

export const TypeAhead = React.forwardRef<HTMLDivElement, TypeAheadProps>((props, ref) => {
  const {
    watch,
    fieldName,
    valueList,
    options,
    labelKey,
    valueKey,
    defaultValue,
    handleChange,
    placeholder,
    labelFormatter,
    ...other
  } = props;

  const { formName } = useContext(FormAnalyticsContext);
  const userHasTyped = useRef(false);

  const customChange = (
    _event: React.SyntheticEvent,
    newValue: TypeAheadOption | string | null
  ) => {
    if (typeof newValue === "string") {
      // Handle free solo text input
      if (process.env.NODE_ENV === "development") {
        console.log("Free solo input:", newValue);
      }
      handleChange({ label: newValue, value: newValue });
    } else {
      // Handle option selection
      handleChange(newValue || null);
    }
    trackTypeAheadSelection(fieldName, formName, userHasTyped.current ? "typed" : "scrolled");
    userHasTyped.current = false;
  };

  const useValue = useTypeAheadValue(props);

  return (
    <FormControl fullWidth>
      <Autocomplete
        {...other}
        ref={ref}
        value={useValue}
        onChange={customChange}
        onInputChange={(_e, _val, reason) => {
          if (reason === "input") userHasTyped.current = true;
          if (reason === "clear") userHasTyped.current = false;
        }}
        options={(valueList || []).map((event, index) => ({
          label: labelFormatter ? labelFormatter(event) : (String(event[labelKey]) ||  String(event[valueKey])),
          value: event[valueKey] as string | number
        }))}
        getOptionKey={(option) =>
          `${option.value}-${(valueList || []).findIndex((item) => item[valueKey] === option.value)}`
        }
        renderInput={(params) => (
          <TextField
            placeholder={placeholder}
            {...params}
            variant="outlined"
            label={props.label}
            onFocus={() => trackInputFocus(fieldName, formName, "typeahead")}
          />
        )}
      />
    </FormControl>
  );
});
