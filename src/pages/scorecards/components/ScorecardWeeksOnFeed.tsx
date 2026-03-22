import { Box, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ScorecardElement } from "../../../store/types/scorecards";

interface ScorecardWeeksOnFeedProps {
  element: ScorecardElement;
}

const MS_TO_DAYS_MULTIPLIER = 1000 * 60 * 60 * 24;

export default function ScorecardWeeksOnFeed({ element }: ScorecardWeeksOnFeedProps) {
  const { setValue, register, watch } = useFormContext();
  const fieldName = `${element.id}.numericValue`;
  const weeksOnFeed = watch(fieldName);

  useEffect(() => {
    // Calculate weeks on feed
    // TODO: Replace this with actual livestock job data when available
    let calculatedWeeks: number;

    // For now, using a placeholder calculation
    // In production, this should get groupStartDate from context or props
    const groupStartDate = new Date().getTime() - 45 * MS_TO_DAYS_MULTIPLIER; // Example: 45 days ago
    const nowDate = new Date().getTime();
    const diff = (nowDate - groupStartDate) / MS_TO_DAYS_MULTIPLIER;
    const value = Math.floor(Number(diff) / 7);

    // Defaulting 0 value to 0.5 to accommodate NAV
    calculatedWeeks = value > 0 ? value : 0.5;

    setValue(fieldName, calculatedWeeks);
  }, [setValue, fieldName]);

  const displayValue = typeof weeksOnFeed === "number" && weeksOnFeed >= 1 ? weeksOnFeed : 0;

  return (
    <Stack direction="row" spacing={1} alignItems="end">
      <Typography>{displayValue} week(s)</Typography>
      <input type="hidden" {...register(fieldName, { valueAsNumber: true })} />
    </Stack>
  );
}
