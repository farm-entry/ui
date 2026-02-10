import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Slider, TextArea } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardScoreProps {
  element: ScorecardElement;
  scoreMax: number;
  marks?: Array<{ value: number; label: string }>;
}

export default function ScorecardScore({ element, scoreMax, marks }: ScorecardScoreProps) {
  const { register } = useFormContext();

  return (
    <Stack spacing={5}>
      <Slider
        {...register(`${element.id}.numericValue`, { required: "This field is required" })}
        min={0}
        max={scoreMax}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        withInput
      />
      <TextArea {...register(`${element.id}.stringValue`)} rows={2} placeholder="Comments..." />
    </Stack>
  );
}
