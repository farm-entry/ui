import { Button, ButtonGroup, FormHelperText, Stack } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardYNProps {
  element: ScorecardElement;
}

export default function ScorecardYN({ element }: ScorecardYNProps) {
  const {
    control,
    formState: { errors }
  } = useFormContext();

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
}
