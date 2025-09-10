import { ActivityTypeConfig } from './types';

export const purchaseConfig: ActivityTypeConfig = {
  code: 'PURCHASE',
  label: 'Purchase',
  description: 'Record livestock purchases',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Destination Group'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Purchase Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Quantity Purchased',
        type: 'number',
        required: true,
        validation: { min: 1 }
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
        helperText: 'Optional details about the purchase'
      }
    ],
    dynamicQuantities: false
  }
};
