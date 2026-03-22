import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardTargetTempProps {
  element: ScorecardElement;
}

const MS_TO_DAYS_MULTIPLIER = 1000 * 60 * 60 * 24;

export default function ScorecardTargetTemp({ element }: ScorecardTargetTempProps) {
  const { setValue, register, watch } = useFormContext();
  const fieldName = `${element.id}.numericValue`;
  const targetTemp = watch(fieldName);

  useEffect(() => {
    // Calculate target temperature based on weeks on feed
    // TODO: Replace this with actual livestock job data and GraphQL query when available

    // Placeholder calculation - in production, this should:
    // 1. Get groupStartDate from livestock job context
    // 2. Calculate weeks on feed
    // 3. Query for resource with code like "5TARGETTEMP" based on weeks
    // 4. Get unitPrice from resource as the target temperature

    const groupStartDate = new Date().getTime() - 45 * MS_TO_DAYS_MULTIPLIER; // Example: 45 days ago
    const diff = (new Date().getTime() - groupStartDate) / MS_TO_DAYS_MULTIPLIER;
    const tempWeeks = Math.min(16, Math.floor(Math.ceil(Number(diff)) / 7));

    // Mock temperature lookup based on weeks (placeholder values)
    // In production: loadResource({ variables: { code: `${tempWeeks}TARGETTEMP` } })
    0;
    // const temperature = mockTemperatures[tempWeeks] || 70;
    // setValue(fieldName, temperature);
  }, [setValue, fieldName]);

  const displayValue = typeof targetTemp === "number" ? `${targetTemp} Degrees` : "Unknown";

  return (
    <Stack direction="row" spacing={1}>
      <Typography>{displayValue}</Typography>
      <input type="hidden" {...register(fieldName, { valueAsNumber: true })} />
    </Stack>
  );
}
