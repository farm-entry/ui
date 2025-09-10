import { ActivityTypeConfig } from './types';

export const qtyadjConfig: ActivityTypeConfig = {
  code: 'QTYADJ',
  label: 'Quantity Adjustment',
  description: 'Adjust livestock quantities',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Select Group to Adjust'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Adjustment Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Adjustment Quantity',
        type: 'number',
        required: true,
        helperText: 'Use positive numbers for increases, negative for decreases'
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'textarea',
        required: true,
        helperText: 'Explanation for the quantity adjustment is required'
      }
    ],
    dynamicQuantities: false
  }
};
