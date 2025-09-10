import { ActivityTypeConfig } from './types';

export const mortalityConfig: ActivityTypeConfig = {
  code: 'MORTALITY',
  label: 'Mortality',
  description: 'Record livestock mortality events',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Select Group'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Mortality Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Total Deaths',
        type: 'number',
        required: true,
        validation: { min: 1 }
      },
      {
        name: 'smallLivestockQuantity',
        label: 'Small Livestock Deaths',
        type: 'number',
        validation: { maxValue: 'quantity' },
        helperText: 'Number of small animals that died'
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'textarea',
        helperText: 'Optional details about the mortality event'
      }
    ],
    dynamicQuantities: true
  }
};
