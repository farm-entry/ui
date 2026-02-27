import { Box, Divider, Link, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { usePostingGroupsStore } from "../../../store/postingGroupsStore";
import { useScorecardStore } from "../../../store/scorecardStore";
import { ScorecardElement } from "../../../store/types/scorecards";

const COMMENT_TYPES = new Set(["SLIDER", "SCORE5", "SCORE10", "RANGE", "HEALTH", "PASSFAIL"]);

function formatValue(code: string, val: any): string {
  if (val === null || val === undefined) return "—";
  switch (code) {
    case "YN":
      return val.numericValue === 1 ? "Yes" : val.numericValue === -1 ? "No" : "—";
    case "PASSFAIL":
      return val.numericValue === 1 ? "Pass" : val.numericValue === -1 ? "Fail" : "—";
    case "SUPERVISOR":
    case "CARETAKER":
    case "JOB":
    case "POSTDATE":
      return val.stringValue ?? "—";
    default:
      return val.numericValue !== undefined ? String(val.numericValue) : "—";
  }
}

interface ReviewRowProps {
  label: string;
  value: string;
  comment?: string;
}

function ReviewRow({ label, value, comment, max }: ReviewRowProps & { max?: number }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Stack alignItems="flex-end">
        <Typography fontWeight={500}>
          {value}
          {max && (
            <Typography fontWeight={500} variant="caption" color="text.secondary">
              /{max}
            </Typography>
          )}
        </Typography>

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
  onEdit?: () => void;
  children: React.ReactNode;
  totals?: {
    scoreSum: number;
    scoreMax: number;
  };
}

function ReviewSection({ title, onEdit, children, totals }: ReviewSectionProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1, width: "100%" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        {onEdit && (
          <Link component="button" variant="caption" onClick={onEdit} underline="hover">
            edit
          </Link>
        )}
        {totals && (
          <Stack direction="row" flex="1" justifyContent="flex-end">
            <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
              {`${totals.scoreSum}/${totals.scoreMax}`}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1.5}>{children}</Stack>
    </Box>
  );
}

interface ScorecardReviewProps {
  onGoToStep: (step: number) => void;
}

export default function ScorecardReview({ onGoToStep }: ScorecardReviewProps) {
  const { getValues } = useFormContext();
  const { scorecardConfig, scorecardTypes } = useScorecardStore();
  const { postingGroups } = usePostingGroupsStore();

  const formValues = getValues();
  const { job, postingGroup } = formValues;

  const jobLabel = postingGroups.find((g: any) => g.number === job)?.description ?? job;
  const typeLabel =
    scorecardTypes.find((t) => t.code === postingGroup)?.description ?? postingGroup;

  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {/* not editable, so no onEdit prop */}
      <ReviewSection title="Setup">
        <ReviewRow label="Job" value={jobLabel ?? "—"} />
        <ReviewRow label="Scorecard Type" value={typeLabel ?? "—"} />
      </ReviewSection>

      {scorecardConfig?.pages.map((page, index) => {
        const scoreMax = page.elements.reduce((sum, el) => sum + (el.max ?? 0), 0);
        const scoreSum = page.elements.reduce((sum, el) => sum + (formValues[el.id]?.numericValue ?? 0), 0);
        return (
          <ReviewSection
            key={page.title}
            title={page.title}
            onEdit={() => onGoToStep(index + 1)}
            totals={{ scoreSum, scoreMax }}
          >
            {page.elements.map((element: ScorecardElement) => {
              const val = formValues[element.id];
              return (
                <ReviewRow
                  key={element.id}
                  label={element.label}
                  max={element.max > 1 ? element.max : undefined}
                  value={formatValue(element.code, val)}
                  comment={COMMENT_TYPES.has(element.code) ? val?.stringValue : undefined}
                />
              );
            })}
          </ReviewSection>
        );
      })}
    </Stack>
  );
}
