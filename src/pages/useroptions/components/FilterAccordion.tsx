import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Chip,
  Stack,
  TextField as MuiTextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import type { FilterCategory, InclusivityMode } from "../../../store/types/user";

// ── Filter Accordion helpers ─────────────────────────────────────────────────

export interface FilterAccordionProps<TItem extends object> {
  title: string;
  icon: React.ReactNode;
  category: FilterCategory<TItem>;
  availableOptions: TItem[];
  getLabel: (item: TItem) => string;
  getKey: (item: TItem) => string;
  defaultExpanded?: boolean;
  onModeChange: (mode: InclusivityMode) => void;
  onAdd: (item: TItem) => void;
  onRemove: (key: string) => void;
  isMobile: boolean;
}

export function FilterAccordion<TItem extends object>({
  title,
  icon,
  category,
  availableOptions,
  getLabel,
  getKey,
  defaultExpanded = false,
  onModeChange,
  onAdd,
  onRemove,
  isMobile
}: FilterAccordionProps<TItem>) {
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const selectedKeys = new Set(category.list.map(getKey));
  const unselectedOptions = availableOptions.filter((opt) => !selectedKeys.has(getKey(opt)));

  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%", pr: 1 }}>
          {icon}
          <Typography sx={{ flexGrow: 1 }}>{title}</Typography>
          <Chip
            label={category.mode}
            size="small"
            color={category.mode === "INCLUDE" ? "success" : "warning"}
            sx={{ mr: 0.5 }}
          />
          {category.list.length > 0 && <Chip label={category.list.length} size="small" />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={category.mode}
            exclusive
            onChange={(_, newMode) => {
              if (newMode !== null) onModeChange(newMode as InclusivityMode);
            }}
            aria-label={`${title} filter mode`}
            sx={isMobile ? { width: "100%" } : undefined}
          >
            <ToggleButton value="INCLUDE" color="success">
              Include
            </ToggleButton>
            <ToggleButton value="EXCLUDE" color="warning">
              Exclude
            </ToggleButton>
          </ToggleButtonGroup>

          <Autocomplete
            key={autocompleteKey}
            options={unselectedOptions}
            getOptionLabel={getLabel}
            value={null}
            onChange={(_, selected) => {
              if (selected) {
                onAdd(selected);
                setAutocompleteKey((k) => k + 1);
              }
            }}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                size="small"
                placeholder={`Search ${title}`}
                label={`Add ${title}`}
              />
            )}
            isOptionEqualToValue={(opt, val) => getKey(opt) === getKey(val)}
            noOptionsText={
              availableOptions.length === 0 ? "No options available" : "All options selected"
            }
          />

          {category.list.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {category.list.map((item) => (
                <Chip
                  key={getKey(item)}
                  label={getLabel(item)}
                  onDelete={() => onRemove(getKey(item))}
                  size="small"
                />
              ))}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
