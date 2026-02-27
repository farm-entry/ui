import { Box, Divider, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useScorecardStore } from "../../../store/scorecardStore";
import { ScorecardElement } from "../../../store/types/scorecards";

function formatValue(code: string, value: any): string {
  if (value === null || value === undefined) return "—";
  switch (code) {
    case "YN":
      return value.numericValue === 1 ? "Yes" : value.numericValue === -1 ? "No" : "—";
    case "PASSFAIL":
      return value.numericValue === 1 ? "Pass" : value.numericValue === -1 ? "Fail" : "—";
    case "SUPERVISOR":
      return value.stringValue ?? "—";
    case "SLIDER":
    case "SCORE5":
    case "SCORE10":
    case "HEALTH":
    case "RANGE":
      return value.numericValue !== undefined ? String(value.numericValue) : "—";
    default:
      return String(value);
  }
}

function hasComment(code: string): boolean {
  return ["SLIDER", "SCORE5", "SCORE10", "HEALTH", "RANGE", "PASSFAIL"].includes(code);
}

interface ReviewRowProps {
  label: string;
  value: string;
  comment?: string;
}

function ReviewRow({ label, value, comment }: ReviewRowProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Stack alignItems="flex-end">
        <Typography fontWeight={500}>{value}</Typography>
        {comment && (
          <Typography variant="caption" color="text.secondary">
            {comment}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
}

function ReviewSection({ title, children }: ReviewSectionProps) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1.5}>{children}</Stack>
    </Box>
  );
}

export default function ScorecardReview() {
  const { getValues } = useFormContext();
  const { scorecardConfig, scorecardTypes } = useScorecardStore();
  const { postingGroups } = usePostingGroupsStore();

  const formValues = getValues();
  const { job, scorecardType } = formValues;

  const jobLabel = postingGroups.find((g: any) => g.number === job)?.description ?? job;
  const typeLabel = scorecardTypes.find((t) => t.code === scorecardType)?.description ?? scorecardType;

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      <ReviewSection title="Setup">
        <ReviewRow label="Job" value={jobLabel ?? "—"} />
        <ReviewRow label="Scorecard Type" value={typeLabel ?? "—"} />
      </ReviewSection>

      {scorecardConfig?.pages.map((page) => (
        <ReviewSection key={page.title} title={page.title}>
          {page.elements.map((element: ScorecardElement) => {
            const val = formValues[element.id];
            const comment = hasComment(element.code) ? val?.stringValue : undefined;
            return (
              <ReviewRow
                key={element.id}
                label={element.label}
                value={formatValue(element.code, val)}
                comment={comment}
              />
            );
          })}
        </ReviewSection>
      ))}
    </Stack>
  );
}
