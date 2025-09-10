import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Box, Typography, Stack } from '@mui/material';
import { TextField } from '../../../components/inputs';
import { FormData } from '../../../store/livestockActivityStore';

interface DynamicQuantitiesProps {
  control: Control<FormData>;
  selectedEvent?: {
    code: string;
    description: string;
    reasons?: Array<{
      code: string;
      description: string;
    }>;
  };
}

export const DynamicQuantities: React.FC<DynamicQuantitiesProps> = ({
  control,
  selectedEvent,
}) => {
  if (!selectedEvent?.reasons) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        5. Reason Quantities
      </Typography>
      <Stack spacing={2}>
        {selectedEvent.reasons.map((reason) => (
          <Controller
            key={reason.code}
            name={`quantities.${reason.code}` as any}
            control={control}
            render={({ field }) => (
              <TextField
                label={reason.description}
                type="number"
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                helperText={`Quantity for ${reason.description.toLowerCase()}`}
              />
            )}
          />
        ))}
      </Stack>
    </Box>
  );
};
