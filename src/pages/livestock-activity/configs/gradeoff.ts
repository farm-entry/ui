import { ActivityTypeConfig } from './types';

export const gradeoffConfig: ActivityTypeConfig = {
  code: 'GRADEOFF',
  label: 'Grade Off',
  description: 'Grade off livestock for processing',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Select Group to Grade Off'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Grade Off Date',
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
        name: 'livestockWeight',
        label: 'Avg. Weight per Head (lbs)',
        type: 'number',
        required: true,
        validation: { min: 0.1 }
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'textarea',
        helperText: 'Optional comments about this grade off'
      }
    ],
    dynamicQuantities: true
  }
};
