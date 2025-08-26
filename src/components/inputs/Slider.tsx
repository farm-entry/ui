import React from "react";
import { Slider as MuiSlider, FormControl, FormHelperText, Typography } from "@mui/material";

export interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  showMarks?: boolean;
}

export function Slider({ label, onChange, min = 0, max = 100, value, step = 1, helperText, showMarks = false }: SliderProps) {
  // Generate marks if showMarks is true
  const marks = showMarks
    ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => {
        const value = min + i * step;
        return { value, label: value.toString() };
      })
    : undefined;

  return (
    <FormControl fullWidth>
      {label && (
        <Typography gutterBottom>
          {label}: {value}
        </Typography>
      )}
      <MuiSlider value={value} onChange={(_, newValue) => onChange(newValue as number)} valueLabelDisplay="auto" min={min} max={max} step={step} marks={marks} />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
