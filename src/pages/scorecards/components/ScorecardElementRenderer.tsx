import {
  Button,
  ButtonGroup,
  FormHelperText,
  FormLabel,
  Stack,
  TextField
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { Slider, TextArea, TypeAhead } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardElementRendererProps {
  element: ScorecardElement;
  elementIndex: number;
}

export default function ScorecardElementRenderer({ element }: ScorecardElementRendererProps) {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useFormContext();

  // Parse the code to determine component type and parameters
  const parseElementCode = (code: string) => {
    const codeArray = code.split("-");
    return {
      type: codeArray[0],
      min: parseInt(codeArray[1]) || 0,
      max: parseInt(codeArray[2]) || element.max,
      step: parseInt(codeArray[3]) || 1
    };
  };

  const codeConfig = parseElementCode(element.code);

  // Render different input types based on the element code
  const renderInputComponent = () => {
    switch (codeConfig.type) {
      case "SLIDER":
        return (
          <Stack spacing={2}>
            <Slider
              {...register(`${element.id}.numericValue`, { required: "This field is required" })}
              min={codeConfig.min}
              max={codeConfig.max}
              step={codeConfig.step}
              valueChip
              marks
            />
            <TextField
              {...register(`${element.id}.stringValue`)}
              placeholder="Comments..."
              fullWidth
            />
          </Stack>
        );

      case "SUPERVISOR":
        return (
          <Stack spacing={2}>
            <TypeAhead
              {...register(`${element.id}.stringValue`, { required: "Supervisor is required" })}
              handleChange={(v) => setValue(`${element.id}.stringValue`, v?.value ?? null)}
              watch={watch}
              fieldName={`${element.id}.stringValue`}
              valueList={[]}
              labelKey="label"
              valueKey="value"
              placeholder="Select supervisor"
            />
            {errors[`${element.id}.stringValue`] && (
              <FormHelperText error>
                {String(errors[`${element.id}.stringValue`]?.message)}
              </FormHelperText>
            )}
          </Stack>
        );

      case "YN":
        return (
          <Stack spacing={2}>
            <Controller
              name={`${element.id}.numericValue`}
              control={control}
              defaultValue={0}
              rules={{ required: "Please make a selection" }}
              render={({ field }) => (
                <ButtonGroup orientation="horizontal" fullWidth>
                  <Button
                    variant={field.value === 1 ? "contained" : "outlined"}
                    onClick={() => field.onChange(1)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={field.value === -1 ? "contained" : "outlined"}
                    onClick={() => field.onChange(-1)}
                  >
                    No
                  </Button>
                </ButtonGroup>
              )}
            />
            {errors[`${element.id}.numericValue`] && (
              <FormHelperText error>
                {String(errors[`${element.id}.numericValue`]?.message)}
              </FormHelperText>
            )}
          </Stack>
        );

      case "PASSFAIL":
        return (
          <Stack spacing={2}>
            <Controller
              name={`${element.id}.numericValue`}
              control={control}
              rules={{ required: "Please make a selection" }}
              render={({ field }) => (
                <ButtonGroup orientation="horizontal" fullWidth>
                  <Button
                    variant={field.value === 1 ? "contained" : "outlined"}
                    onClick={() => field.onChange(1)}
                  >
                    Pass
                  </Button>
                  <Button
                    variant={field.value === -1 ? "contained" : "outlined"}
                    onClick={() => field.onChange(-1)}
                  >
                    Fail
                  </Button>
                </ButtonGroup>
              )}
            />
            {errors[`${element.id}.numericValue`] && (
              <FormHelperText error>
                {String(errors[`${element.id}.numericValue`]?.message)}
              </FormHelperText>
            )}
            <TextArea
              {...register(`${element.id}.stringValue`)}
              rows={2}
              placeholder="Comments..."
            />
          </Stack>
        );

      case "SCORE5":
      case "SCORE10":
        const scoreMax = codeConfig.type === "SCORE5" ? 5 : 10;
        return (
          <Stack spacing={2}>
            <Slider
              {...register(`${element.id}.numericValue`, { required: "This field is required" })}
              min={0}
              max={scoreMax}
              step={1}
              marks
            />
            <TextArea
              {...register(`${element.id}.stringValue`)}
              rows={2}
              placeholder="Comments..."
            />
          </Stack>
        );

      case "HEALTH":
        return (
          <Stack spacing={2}>
            <TextField
              {...register(`${element.id}.numericValue`, {
                required: "This field is required",
                min: { value: 0, message: "Must be at least 0." },
                max: { value: 100, message: "Must be at most 100." },
                valueAsNumber: true
              })}
              type="number"
              placeholder="Enter percentage (0-100)"
              error={!!errors[`${element.id}.numericValue`]}
              helperText={
                errors[`${element.id}.numericValue`]
                  ? String(errors[`${element.id}.numericValue`]?.message)
                  : ""
              }
              fullWidth
            />
            <TextArea
              {...register(`${element.id}.stringValue`)}
              rows={2}
              placeholder="Comments..."
            />
          </Stack>
        );

      case "RANGE":
        return (
          <Stack spacing={2}>
            <TextField
              {...register(`${element.id}.numericValue`, {
                required: "This field is required",
                min: {
                  value: codeConfig.min,
                  message: `Must be at least ${codeConfig.min}.`
                },
                max: {
                  value: codeConfig.max,
                  message: `Must be at most ${codeConfig.max}.`
                },
                valueAsNumber: true
              })}
              type="number"
              placeholder={`Enter value (${codeConfig.min}-${codeConfig.max})`}
              error={!!errors[`${element.id}.numericValue`]}
              helperText={
                errors[`${element.id}.numericValue`]
                  ? String(errors[`${element.id}.numericValue`]?.message)
                  : ""
              }
              fullWidth
            />
            <TextArea
              {...register(`${element.id}.stringValue`)}
              rows={2}
              placeholder="Comments..."
            />
          </Stack>
        );

      default:
        // For any unrecognized codes, render a text input
        return (
          <TextField
            {...register(element.id, { required: "This field is required" })}
            fullWidth
            variant="outlined"
            error={!!errors[element.id]}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <Stack spacing={2}>
      <FormLabel component="legend" sx={{ fontWeight: 600, color: "text.primary" }}>
        {element.label}
      </FormLabel>
      {renderInputComponent()}
    </Stack>
  );
}
