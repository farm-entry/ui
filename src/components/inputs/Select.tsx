import * as React from 'react';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  type SelectProps as MuiSelectProps,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

export interface SelectOption {
  value: string | number;
  label: string;
  group?: string;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  label: string;
  options: SelectOption[];
  helperText?: string;
  onClear?: () => void;
  multiselect?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { label, options, helperText, onClear, value, multiselect, size, ...rest } = props;
  const labelId = `${label}-label`;

  const renderMenuItems = (isMulti: boolean) => {
    const hasGroups = options.some(o => o.group);
    const selectedArr = isMulti ? (value as Array<string | number> ?? []) : [];

    if (!hasGroups) {
      return options.map(option => (
        <MenuItem key={option.value} value={option.value}>
          {isMulti && (
            <Checkbox checked={selectedArr.includes(option.value)} size="small" />
          )}
          <ListItemText primary={option.label} />
        </MenuItem>
      ));
    }

    const items: React.ReactNode[] = [];
    let lastGroup: string | undefined;
    for (const option of options) {
      if (option.group !== lastGroup) {
        lastGroup = option.group;
        if (option.group) {
          items.push(
            <ListSubheader key={`grp-${option.group}`}>{option.group}</ListSubheader>
          );
        }
      }
      items.push(
        <MenuItem key={option.value} value={option.value}>
          {isMulti && (
            <Checkbox checked={selectedArr.includes(option.value)} size="small" />
          )}
          <ListItemText primary={option.label} />
        </MenuItem>
      );
    }
    return items;
  };

  if (multiselect) {
    const selected = (value ?? []) as Array<string | number>;
    return (
      <FormControl fullWidth size={size ?? 'small'}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <MuiSelect
          ref={ref}
          labelId={labelId}
          label={label}
          variant="outlined"
          multiple
          value={selected}
          renderValue={(sel) => {
            const arr = sel as Array<string | number>;
            if (arr.length === 0) return '';
            if (arr.length <= 2) {
              return arr.map(v => options.find(o => o.value === v)?.label ?? v).join(', ');
            }
            return `${arr.length} selected`;
          }}
          {...rest}
        >
          {renderMenuItems(true)}
        </MuiSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <FormControl fullWidth size={size}>
      <InputLabel id={labelId} shrink={!!value || undefined}>{label}</InputLabel>
      <MuiSelect
        ref={ref}
        labelId={labelId}
        label={label}
        variant="outlined"
        notched={!!value || undefined}
        value={value ?? ''}
        endAdornment={
          value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                }}
                size="small"
                sx={{ marginRight: 1 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
        {...rest}
      >
        {renderMenuItems(false)}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});
