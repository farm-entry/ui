import { ActivityTypeConfig } from './types';

export const weanConfig: ActivityTypeConfig = {
  code: 'WEAN',
  label: 'Wean',
  description: 'Record weaning activities',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Select Group to Wean'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Wean Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Total Quantity',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        name: 'smallLivestockQuantity',
        label: 'Small Livestock Quantity',
        type: 'number',
        validation: { maxValue: 'quantity' },
        helperText: 'Number of small animals weaned'
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
        helperText: 'Optional comments about this weaning activity'
      }
    ],
    dynamicQuantities: false
  }
};
