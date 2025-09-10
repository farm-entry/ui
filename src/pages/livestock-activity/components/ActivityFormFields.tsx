import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { ActivityTypeConfig } from '../configs';
import { FormData } from '../../../store/livestockActivityStore';
import { DynamicField } from './DynamicField';
import { DynamicQuantities } from './DynamicQuantities';

interface ActivityFormFieldsProps {
  config: ActivityTypeConfig;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  watchedQuantity?: number | null;
  selectedEvent?: {
    code: string;
    description: string;
    reasons?: Array<{
      code: string;
      description: string;
    }>;
  };
  dimensionPackers?: Array<{ code: string; description: string }>;
}

export const ActivityFormFields: React.FC<ActivityFormFieldsProps> = ({
  config,
  control,
  errors,
  watchedQuantity,
  selectedEvent,
  dimensionPackers,
}) => {
  return (
    <>
      {/* Activity Details */}
      <Box>
        <Typography variant="h6" gutterBottom>
          4. Activity Details
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {config.description}
        </Typography>
        
        <Stack spacing={2}>
          {config.sections.fields.map((field, index) => (
            <DynamicField
              key={field.name}
              field={field}
              control={control}
              errors={errors}
              watchedQuantity={watchedQuantity}
              dimensionPackers={dimensionPackers}
            />
          ))}
        </Stack>
      </Box>

      {/* Dynamic Quantities for Mortality/GradeOff */}
      {config.sections.dynamicQuantities && selectedEvent?.reasons && (
        <>
          <Divider />
          <DynamicQuantities
            control={control}
            selectedEvent={selectedEvent}
          />
        </>
      )}
    </>
  );
};
