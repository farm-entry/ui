import { Box, Typography } from "@mui/material";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";
import { Slider } from "../../../components/inputs";

export type CodeConfigType = {
  type: string;
  min: number;
  max: number;
  step: number;
};

const ScoreCardSlider = ({
  codeConfig,
  element,
  formContext
}: {
  codeConfig: CodeConfigType;
  formContext: UseFormReturn<FieldValues, any, FieldValues>;
  element: ScorecardElement;
}) => {
  const {
    register,
    watch,
    formState: { errors }
  } = formContext || {};
  const watchValue = watch ? watch(element.id) : undefined;
  return (
    <Box>
      <Slider
        {...register(element.id, {
          required: "This field is required",
          min: { value: codeConfig.min, message: `Minimum value is ${codeConfig.min}` },
          max: { value: codeConfig.max, message: `Maximum value is ${codeConfig.max}` },
          valueAsNumber: true
        })}
        value={watchValue || codeConfig.min}
        min={codeConfig.min}
        max={codeConfig.max}
        step={codeConfig.step}
        marks
        valueChip
        // valueLabelDisplay="on"
      />
      {errors[element.id] && (
        <Typography variant="caption" color="error">
          {String(errors[element.id]?.message) ?? "Invalid value"}
        </Typography>
      )}
    </Box>
  );
};

export default ScoreCardSlider;
