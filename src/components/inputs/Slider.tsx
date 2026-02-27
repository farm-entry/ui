import {
  Input as MuiInput,
  Slider as MUISlider,
  SliderProps as MUISliderProps,
  Stack,
  styled,
  TextField
} from "@mui/material";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

const Input = styled(MuiInput)`
  width: 56px;
`;

export interface SliderProps extends Omit<MUISliderProps, "onChange"> {
  showInput?: boolean;
  name?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ showInput = true, name, onChange, onBlur, min = 0, max = 100, step, ...sliderProps }, ref) => {
    const { watch } = useFormContext();

    const value: number = name ? (watch(name) ?? min) : (min as number);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
      const numValue = Array.isArray(newValue) ? newValue[0] : newValue;
      onChange?.({ target: { name, value: numValue } });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = e.target.value === "" ? (min as number) : Number(e.target.value);
      onChange?.({ target: { name, value: parsed } });
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const clamped = Math.min(Math.max(value, min as number), max as number);
      if (clamped !== value) {
        onChange?.({ target: { name, value: clamped } });
      }
      onBlur?.(e);
    };

    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <input type="hidden" ref={ref} name={name} value={value} readOnly />
        <MUISlider
          {...sliderProps}
          value={value}
          onChange={handleSliderChange}
          onBlur={onBlur}
          min={min}
          marks
          valueLabelDisplay="auto"
          max={max}
          step={step}
          sx={{ flexGrow: 1, ...sliderProps.sx }}
        />
        {showInput && (
          <TextField
            value={value}
            size="small"
            variant="outlined"
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            sx={{ width: 75 }}
            slotProps={{
              htmlInput: {
                step,
                min,
                max,
                type: "number",
                "aria-labelledby": sliderProps["aria-labelledby"]
              }
            }}
          />
        )}
      </Stack>
    );
  }
);
