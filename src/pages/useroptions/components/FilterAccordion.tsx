import { ExpandMore } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import type { SelectOption } from "../../../components/inputs";
import { Select } from "../../../components/inputs";
import type { FilterCategory, InclusivityMode } from "../../../store/types/user";

export interface FilterAccordionProps<TItem extends object> {
  title: string;
  icon: React.ReactNode;
  category: FilterCategory<TItem>;
  availableOptions: TItem[];
  getLabel: (item: TItem) => string;
  getKey: (item: TItem) => string;
  getGroup?: (item: TItem) => string | undefined;
  defaultExpanded?: boolean;
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
  defaultExpanded = false,
  onModeChange,
  onChange,
  isMobile
}: FilterAccordionProps<TItem>) {
  const options: SelectOption[] = availableOptions.map((item) => ({
    value: getKey(item),
    label: getLabel(item),
    group: getGroup?.(item)
  }));

  const selectedKeys = category.list.map(getKey);

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    const keys = e.target.value as string[];
    const newList = keys
      .map((key) => availableOptions.find((opt) => getKey(opt) === key))
      .filter(Boolean) as TItem[];
    onChange(newList);
  };

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

          <Select
            label={title}
            options={options}
            multiselect
            value={selectedKeys}
            onChange={handleChange}
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
