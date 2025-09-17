import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Stack } from '@mui/material';
import { TextField, TextArea, Select, DatePicker } from '../../../components/inputs';
import { FieldConfig } from '../configs';
import { FormData } from '../../../store/livestockActivityStore';

interface DynamicFieldProps {
  field: FieldConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  watchedQuantity?: number | null;
  dimensionPackers?: Array<{ code: string; description: string }>;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  control,
  errors,
  watchedQuantity,
  dimensionPackers = [],
}) => {
  const getValidationRules = () => {
    const rules: any = {};
    
    if (field.required) {
      rules.required = `${field.label} is required`;
    }
    
    if (field.validation?.min !== undefined) {
      rules.min = {
        value: field.validation.min,
        message: `${field.label} must be at least ${field.validation.min}`
      };
    }
    
    if (field.validation?.maxValue === 'quantity' && watchedQuantity) {
      rules.max = {
        value: watchedQuantity,
        message: 'Cannot exceed total quantity'
      };
    }
    
    return rules;
  };

  const renderField = () => {
    const commonProps = {
      label: field.label,
      helperText: field.helperText,
    };

    switch (field.type) {
      case 'date':
        return (
          <Controller
            name={field.name as keyof FormData}
            control={control}
            rules={getValidationRules()}
            render={({ field: controllerField, fieldState }) => (
              <DatePicker
                {...commonProps}
                value={controllerField.value as Date | null}
                onChange={controllerField.onChange}
                helperText={fieldState.error?.message || field.helperText}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={field.name as keyof FormData}
            control={control}
            rules={getValidationRules()}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...commonProps}
                type="number"
                value={controllerField.value || ''}
                onChange={(e) => controllerField.onChange(Number(e.target.value))}
                helperText={fieldState.error?.message || field.helperText}
              />
            )}
          />
        );

      case 'select':
        const selectOptions = field.name === 'dimensionPacker' 
          ? dimensionPackers.map(packer => ({
              value: packer.code,
              label: packer.description,
            }))
          : field.options || [];

        return (
          <Controller
            name={field.name as keyof FormData}
            control={control}
            rules={getValidationRules()}
            render={({ field: controllerField, fieldState }) => (
              <Select
                {...commonProps}
                options={selectOptions}
                value={controllerField.value || ''}
                onChange={(e) => controllerField.onChange(e.target.value)}
                helperText={fieldState.error?.message || field.helperText}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={field.name as keyof FormData}
            control={control}
            rules={getValidationRules()}
            render={({ field: controllerField, fieldState }) => (
              <TextArea
                {...commonProps}
                rows={4}
                value={controllerField.value || ''}
                onChange={controllerField.onChange}
                helperText={fieldState.error?.message || field.helperText}
              />
            )}
          />
        );

      case 'text':
      default:
        return (
          <Controller
            name={field.name as keyof FormData}
            control={control}
            rules={getValidationRules()}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...commonProps}
                value={controllerField.value || ''}
                onChange={(e) => controllerField.onChange(e.target.value)}
                helperText={fieldState.error?.message || field.helperText}
              />
            )}
          />
        );
    }
  };

  return renderField();
};
