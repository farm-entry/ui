import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardMortalityProps {
  element: ScorecardElement;
}

export default function ScorecardMortality({ element }: ScorecardMortalityProps) {
  const { setValue, register, watch } = useFormContext();
  const fieldName = `${element.id}.numericValue`;
  const deadQuantity = watch(fieldName);

  useEffect(() => {
    // TODO: Replace this with actual livestock job data when available
    // For now, using a placeholder value
    const mockDeadQuantity = 0; // Replace with: livestockJob?.deadQuantity

    if (mockDeadQuantity && mockDeadQuantity > 0) {
      setValue(fieldName, mockDeadQuantity);
    } else {
      setValue(fieldName, null);
    }
  }, [setValue, fieldName]);

  const displayValue = typeof deadQuantity === "number" ? `${deadQuantity} deads` : "None";

  return (
    <Stack direction="row" spacing={1} alignItems="end">
      <Typography>{displayValue}</Typography>
      <input type="hidden" {...register(fieldName, { valueAsNumber: true })} />
    </Stack>
  );
}
