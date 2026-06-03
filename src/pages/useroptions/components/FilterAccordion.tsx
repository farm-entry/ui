import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  Chip,
  ListItemText,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import type { FilterCategory, InclusivityMode } from "../../../store/types/user";

export interface FilterAccordionProps<TItem extends object> {
  title: string;
  icon: React.ReactNode;
  category: FilterCategory<TItem>;
  availableOptions: TItem[];
  getLabel: (item: TItem) => string;
  getKey: (item: TItem) => string;
  getGroup?: (item: TItem) => string | undefined;
  expanded: boolean;
  onToggle: () => void;
  onModeChange: (mode: InclusivityMode) => void;
  onChange: (newList: TItem[]) => void;
  isMobile: boolean;
}

export function FilterAccordion<TItem extends object>({
  title,
  icon,
  category,
  availableOptions,
  getLabel,
  getKey,
  getGroup,
  expanded,
  onToggle,
  onModeChange,
  onChange,
  isMobile
}: FilterAccordionProps<TItem>) {
  const sortedOptions = [...availableOptions].sort((a, b) =>
    getLabel(a).localeCompare(getLabel(b))
  );

  return (
    <Accordion expanded={expanded} onChange={onToggle} disableGutters>
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

          <Autocomplete<TItem, true>
            multiple
            disableCloseOnSelect
            options={sortedOptions}
            value={category.list}
            getOptionLabel={getLabel}
            getOptionKey={getKey}
            groupBy={getGroup ? (option) => getGroup(option) ?? "" : undefined}
            isOptionEqualToValue={(option, value) => getKey(option) === getKey(value)}
            onChange={(_, newValue) => onChange(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={title} size="small" />
            )}
            renderOption={(props, option, { selected }) => {
              const { key, ...rest } = props;
              return (
                <li key={getKey(option)} {...rest}>
                  <Checkbox checked={selected} size="small" sx={{ mr: 0.5 }} />
                  <ListItemText primary={getLabel(option)} />
                </li>
              );
            }}
            renderTags={() => null}
          />

          {category.list.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {category.list.map((item) => (
                <Chip
                  key={getKey(item)}
                  label={getLabel(item)}
                  size="small"
                  onDelete={() => onChange(category.list.filter((i) => getKey(i) !== getKey(item)))}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
