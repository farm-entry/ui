# Scorecard Component Migration Summary

## Overview
All scorecard form components have been updated to use the existing input components from `src/components/inputs` instead of non-existent imports. The components now use Material-UI components with react-hook-form's `Controller` for proper form integration.

## Components Updated

### ✅ Successfully Migrated Components

#### 1. **ScorecardSlider** → Uses `Slider` from inputs
- **Old**: `SliderInput` (non-existent)
- **New**: `Slider` component from `src/components/inputs`
- **Additional**: Uses `TextArea` for comments field
- **Integration**: Material-UI FormControl with react-hook-form Controller

#### 2. **ScorecardYesNo** → Uses Material-UI `ButtonGroup`
- **Old**: `StackedInput` and `StackedRadioButton` (non-existent)
- **New**: Material-UI `ButtonGroup` with `Button` components
- **Behavior**: Toggle between Yes (1) and No (-1) values

#### 3. **ScorecardPassFail** → Uses Material-UI `ButtonGroup`
- **Old**: `StackedInput` and `StackedRadioButton` (non-existent)
- **New**: Material-UI `ButtonGroup` with `Button` components
- **Additional**: Uses `TextArea` for comments field
- **Behavior**: Toggle between Pass (1) and Fail (-1) values

#### 4. **ScorecardSupervisor** → Uses `TypeAhead` from inputs
- **Old**: `TypeaheadInput` (non-existent)
- **New**: `TypeAhead` component from `src/components/inputs`
- **Data Source**: GraphQL query `useScorecardUsersQuery`
- **Default Value**: Uses job's projectManager if available

#### 5. **ScorecardCaretaker** → Uses `TypeAhead` from inputs
- **Old**: `TypeaheadInput` (non-existent)
- **New**: `TypeAhead` component from `src/components/inputs`
- **Data Source**: GraphQL query `useScorecardPeopleQuery`
- **Default Value**: Uses job's caretaker if available

#### 6. **ScorecardLivestockJob** → Uses `TypeAhead` from inputs
- **Old**: `TypeaheadInput` (non-existent)
- **New**: `TypeAhead` component from `src/components/inputs`
- **Data Source**: Lazy GraphQL query `useScorecardLivestockJobsLazyQuery`

#### 7. **ScorecardPostingDate** → Uses `DatePicker` from inputs
- **Old**: `DateInput` (non-existent)
- **New**: `DatePicker` component from `src/components/inputs`
- **Validation**: Date format validation (MM/DD/YYYY)
- **Default Value**: Current date if no value provided

#### 8. **ScorecardRange** → Uses `TextField` for number input
- **Old**: `NumberInput` (non-existent)
- **New**: `TextField` with type="number" from `src/components/inputs`
- **Additional**: Uses `TextArea` for comments field
- **Validation**: Min/max range validation

#### 9. **ScorecardHealthInput** → Uses `TextField` for number input
- **Old**: `NumberInput` (non-existent)
- **New**: `TextField` with type="number" from `src/components/inputs`
- **Additional**: Uses `TextArea` for comments field
- **Validation**: Min/max range validation
- **Display**: Shows percentage (%)

#### 10. **ScorecardTemp** → Uses `TextField` for number input
- **Old**: `NumberInput` (non-existent)
- **New**: `TextField` with type="number" from `src/components/inputs`
- **Validation**: Range validation (-30°F to 110°F)
- **Display**: Shows temperature in Fahrenheit

#### 11. **ScorecardScores** → Uses `Slider` from inputs
- **Old**: `SliderInput` (non-existent)
- **New**: `Slider` component from `src/components/inputs`
- **Additional**: Uses `TextArea` for comments field
- **Integration**: Material-UI FormControl with react-hook-form Controller

#### 12. **ScorecardMortality** → Uses Material-UI `Typography` for display
- **Old**: `StaticValue` (non-existent)
- **New**: Material-UI `Typography` within a styled `Box`
- **Type**: Read-only display component
- **Data Source**: Pulls from livestockJob.deadQuantity

#### 13. **ScorecardTargetTemp** → Uses Material-UI `Typography` for display
- **Old**: `StaticValue` (non-existent)
- **New**: Material-UI `Typography` within a styled `Box`
- **Type**: Read-only display component
- **Data Source**: GraphQL query based on weeks calculation

#### 14. **ScorecardWeeksOnFeed** → Uses Material-UI `Typography` for display
- **Old**: `StaticValue` (non-existent)
- **New**: Material-UI `Typography` within a styled `Box`
- **Type**: Read-only display component
- **Calculation**: Calculates weeks from job's groupStartDate

## Components That Don't Have Direct Input Replacements

### Read-Only Display Components
These components display calculated or fetched data and don't require input components. They use Material-UI Typography for display:

1. **ScorecardMortality** - Displays dead quantity from livestock job
2. **ScorecardTargetTemp** - Displays target temperature based on weeks calculation
3. **ScorecardWeeksOnFeed** - Displays calculated weeks on feed from start date

### Custom Form Wrapper Pattern
All components now use this pattern as a passthrough for react-hook-form:

```tsx
import { Controller } from "react-hook-form";
import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { InputComponent } from "../../../components/inputs";

<FormControl fullWidth sx={{ mb: 3 }}>
  <FormLabel>{label}</FormLabel>
  <Controller
    name={fieldName}
    control={control}
    rules={validationRules}
    render={({ field }) => (
      <InputComponent
        {...field}
        // additional props
      />
    )}
  />
  {errors[fieldName] && <FormHelperText error>{String(errors[fieldName]?.message)}</FormHelperText>}
</FormControl>
```

## Non-Existent Components Removed

The following components were referenced but don't exist in the codebase:

### Form Wrappers (Removed)
- `FormField` - Replaced with Material-UI `FormControl`
- `FormFieldInput` - Integrated directly into Controller render
- `FormFieldErrors` - Replaced with Material-UI `FormHelperText`
- `FormFieldLabel` - Replaced with Material-UI `FormLabel`

### Input Components (Replaced)
- `SliderInput` → `Slider` from `src/components/inputs`
- `TypeaheadInput` → `TypeAhead` from `src/components/inputs`
- `DateInput` → `DatePicker` from `src/components/inputs`
- `NumberInput` → `TextField` with type="number" from `src/components/inputs`
- `MultilineTextInput` → `TextArea` from `src/components/inputs`
- `StackedInput` + `StackedRadioButton` → Material-UI `ButtonGroup` + `Button`
- `StaticValue` → Material-UI `Typography` + `Box`

### Layout Components (Removed)
- `VerticalSpacer` - Replaced with Material-UI `sx={{ mb: 2 }}` spacing
- `Spacing` constants - Replaced with Material-UI spacing system

## Benefits of This Migration

1. **No More Non-Existent Imports**: All components now import from actual files
2. **Consistent UI**: Uses Material-UI components throughout
3. **Better Type Safety**: Proper TypeScript types from existing components
4. **React Hook Form Integration**: Proper integration using Controller pattern
5. **Maintainable**: Reuses existing, tested components from `src/components/inputs`
6. **Responsive**: Material-UI components provide responsive behavior out of the box

## Testing Recommendations

1. Test all form validations (min/max, required fields, date format)
2. Verify GraphQL queries load data correctly for TypeAhead components
3. Test Controller integration with form submission
4. Verify calculated values display correctly in read-only components
5. Test button group toggle behavior for Yes/No and Pass/Fail
6. Verify slider value changes update form state
7. Test default value population from job/context data

## Future Improvements

Consider creating dedicated passthrough wrapper components for common patterns:
- `FormSlider` - Wraps Slider with FormControl + Controller
- `FormTypeAhead` - Wraps TypeAhead with FormControl + Controller
- `FormTextField` - Wraps TextField with FormControl + Controller
- `FormDatePicker` - Wraps DatePicker with FormControl + Controller
- `FormButtonGroup` - Wraps ButtonGroup with FormControl + Controller

This would reduce boilerplate and maintain consistency across scorecard components.
