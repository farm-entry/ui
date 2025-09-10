# Livestock Activity Form - Modular Refactoring

## Overview
Successfully refactored the livestock activity form from a single monolithic file into a modular, configuration-driven architecture.

## Project Structure

```
src/pages/livestock-activity/
├── index.tsx                    # Main simplified form component (150 lines vs 549 lines)
├── components/                  # Reusable components
│   ├── index.ts                # Component exports
│   ├── JobSelection.tsx        # Handles job/group selection logic
│   ├── ActivityFormFields.tsx  # Renders activity-specific fields
│   ├── DynamicField.tsx        # Generic field renderer
│   └── DynamicQuantities.tsx   # Handles reason-based quantities
└── configs/                    # Activity type configurations
    ├── index.ts               # Configuration exports
    ├── types.ts               # TypeScript interfaces
    ├── wean.ts                # Wean activity configuration
    ├── mortality.ts           # Mortality activity configuration
    ├── move.ts                # Move activity configuration
    ├── gradeoff.ts            # Grade off activity configuration
    ├── qtyadj.ts              # Quantity adjustment configuration
    ├── purchase.ts            # Purchase activity configuration
    └── shipment.ts            # Shipment activity configuration
```

## Key Benefits

### 1. **Maintainability**
- Each activity type has its own configuration file
- Changes to one activity type don't affect others
- Clear separation of concerns

### 2. **Reusability**
- Components can be reused across different activity types
- Configuration-driven field rendering
- Consistent UI patterns

### 3. **Scalability**
- Easy to add new activity types by creating new config files
- No need to modify the main component for new activities
- Field types can be extended easily

### 4. **Code Quality**
- Reduced code duplication
- Cleaner, more focused components
- Better TypeScript type safety

## Configuration-Driven Architecture

Each activity type is defined by a configuration object that specifies:

```typescript
interface ActivityTypeConfig {
  code: string;              // Activity type code (WEAN, MORTALITY, etc.)
  label: string;             // Display label
  description: string;       // Help text
  sections: {
    jobSelection: {          // Job selection behavior
      showFromJob: boolean;
      showToJob: boolean;
      jobLabel?: string;
    };
    fields: FieldConfig[];   // Form fields specific to this activity
    dynamicQuantities: boolean; // Whether to show reason quantities
  };
}
```

## Component Responsibilities

### 1. **Main Index Component (`index.tsx`)**
- Activity type selection
- Form state management
- API calls and loading states
- Form submission

### 2. **JobSelection Component**
- Handles job/group selection based on activity type
- Shows single job selector or from/to job selectors
- Displays job information panel

### 3. **ActivityFormFields Component**
- Renders activity-specific fields based on configuration
- Handles conditional field visibility
- Manages dynamic quantities section

### 4. **DynamicField Component**
- Generic field renderer that supports multiple field types
- Handles validation rules from configuration
- Type-safe field rendering

## Activity Type Configurations

### WEAN
- Single job selection
- Fields: date, quantity, small livestock quantity, total weight, comments
- No dynamic quantities

### MORTALITY
- Single job selection  
- Fields: date, quantity, small livestock quantity, comments
- Dynamic quantities based on mortality reasons

### MOVE
- From/To job selection
- Fields: date, quantity, small livestock quantity, total weight, comments
- No dynamic quantities

### GRADEOFF
- Single job selection
- Fields: date, quantity, livestock weight, comments
- Dynamic quantities based on grade off reasons

### QTYADJ (Quantity Adjustment)
- Single job selection
- Fields: date, quantity, comments (required)
- No dynamic quantities

### PURCHASE
- Single job selection
- Fields: date, quantity, total weight, comments
- No dynamic quantities

### SHIPMENT
- Single job selection
- Fields: date, quantity, total weight, deaths on arrival, dimension packer, comments
- No dynamic quantities

## Migration Benefits

1. **Reduced Complexity**: Main component went from 549 lines to ~150 lines
2. **Better Testing**: Each component can be tested in isolation
3. **Enhanced Developer Experience**: Clear structure makes it easier to understand and modify
4. **Future-Proof**: Easy to extend with new activity types or field types
5. **Type Safety**: Strong TypeScript typing throughout the architecture

## Usage

The form now automatically adapts based on the selected activity type:
1. User selects activity type from dropdown
2. Configuration is loaded for that activity type
3. Form fields are rendered based on configuration
4. Job selection behavior changes based on configuration
5. Validation rules are applied based on field configuration

This modular approach makes the codebase more maintainable, testable, and extensible while providing the same functionality as the original monolithic implementation.
