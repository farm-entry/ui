import {
  Chip,
  Slider as MUISlider,
  SliderProps as MUISliderProps,
  Stack,
  TextField
} from "@mui/material";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import NumberField from "./CustomNumberField";

interface SliderProps extends Omit<MUISliderProps, "onChange"> {
  withInput?: boolean;
  valueChip?: boolean;
  name?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      withInput = false,
      valueChip = false,
      name,
      onChange,
      onBlur,
      min = 0,
      max = 100,
      ...sliderProps
    },
    ref
  ) => {
    const { watch } = useFormContext();
    const value = name ? (watch(name) ?? 0) : 0;

    const handleChange = (_: Event, newValue: number | number[]) => {
      const numValue = Array.isArray(newValue) ? newValue[0] : newValue;
      onChange?.({ target: { name, value: numValue } });
    };

    return (
      <Stack direction="row" spacing={2} alignItems="center">
        {valueChip && <Chip label={value} />}
        {withInput && (
          <NumberField width={60} size="small" value={value} min={min} max={max} />
          // <TextField
          //   value={value}
          //   onChange={(e) => {
          //     const val = Number(e.target.value);
          //     if (!isNaN(val)) {
          //       onChange?.({ target: { name, value: Math.min(Math.max(val, min as number), max as number) } });
          //     }
          //   }}
          //   onBlur={onBlur}
          //   size="small"
          //   inputProps={{ maxLength: 3, inputMode: "numeric", style: { textAlign: "center" } }}
          //   sx={{ width: 60 }}
          // />
        )}
        <MUISlider
          {...sliderProps}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          min={min}
          max={max}
          sx={{ flexGrow: 1, ...sliderProps.sx }}
        />
        <input
          type="hidden"
          ref={ref}
          name={name}
          defaultValue={value}
          style={{ display: "none", margin: "0 !important", padding: "0 !important" }}
        />
      </Stack>
    );
  }
);
