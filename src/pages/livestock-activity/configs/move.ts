import { ActivityTypeConfig } from './types';

export const moveConfig: ActivityTypeConfig = {
  code: 'MOVE',
  label: 'Move',
  description: 'Move livestock between groups/jobs',
  sections: {
    jobSelection: {
      showFromJob: true,
      showToJob: true,
      fromJobLabel: 'From Group',
      toJobLabel: 'To Group'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Move Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Quantity to Move',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        name: 'smallLivestockQuantity',
        label: 'Small Livestock Quantity',
        type: 'number',
        validation: { maxValue: 'quantity' },
        helperText: 'Number of small animals being moved'
      },
      {
        name: 'totalWeight',
        label: 'Total Weight (lbs)',
        type: 'number',
        required: true,
        validation: { min: 0.1 }
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'textarea',
        helperText: 'Optional comments about this move'
      }
    ],
    dynamicQuantities: false
  }
};
