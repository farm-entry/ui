import { Button, ButtonGroup, FormHelperText, Stack } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TextArea } from "../../../components/inputs";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardPassFailProps {
  element: ScorecardElement;
}

export default function ScorecardPassFail({ element }: ScorecardPassFailProps) {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext();

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
}
