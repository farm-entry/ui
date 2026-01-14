import {
  Chip,
  Slider as MUISlider,
  SliderProps as MUISliderProps,
  Stack,
  TextField
} from "@mui/material";
import { forwardRef } from "react";

interface SliderProps extends Omit<MUISliderProps, "value" | "onChange"> {
  withInput?: boolean;
  valueChip?: boolean;
  value?: number;
  onChange?: (event: Event, value: number | number[]) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      withInput = false,
      valueChip = false,
      value = 0,
      onChange,
      min = 0,
      max = 100,
      ...sliderProps
    },
    ref
  ) => {
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
      onChange?.(event, newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (/^\d*$/.test(newValue)) {
        const numValue = Math.min(Math.max(Number(newValue) || 0, min), max);
        onChange?.(event as any, numValue);
      }
    };

    return (
      <Stack direction="row" spacing={2} alignItems="center">
        {valueChip && <Chip label={value} />}
        {withInput && (
          <TextField
            value={value}
            onChange={handleInputChange}
            size="small"
            inputProps={{
              maxLength: 3,
              inputMode: "numeric",
              style: { textAlign: "center" }
            }}
            sx={{ width: 60 }}
          />
        )}
        <MUISlider
          {...sliderProps}
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          sx={{ flexGrow: 1, ...sliderProps.sx }}
        />
      </Stack>
    );
  }
);
