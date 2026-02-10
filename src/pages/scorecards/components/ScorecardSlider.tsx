import { Stack, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Slider } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardSliderProps {
  element: ScorecardElement;
  min: number;
  max: number;
  step: number;
  marks: Array<{ value: number; label: string }>;
}

export default function ScorecardSlider({ element, min, max, step, marks }: ScorecardSliderProps) {
  const { register } = useFormContext();

  return (
    <Stack spacing={5}>
      <Slider
        {...register(`${element.id}.numericValue`, { required: "This field is required" })}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        marks={marks}
        withInput
      />
      <TextField {...register(`${element.id}.stringValue`)} placeholder="Comments..." fullWidth />
    </Stack>
  );
}
