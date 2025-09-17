import { ActivityTypeConfig } from './types';

export const shipmentConfig: ActivityTypeConfig = {
  code: 'SHIPMENT',
  label: 'Shipment',
  description: 'Record livestock shipments',
  sections: {
    jobSelection: {
      showFromJob: false,
      showToJob: false,
      jobLabel: 'Group to Ship'
    },
    fields: [
      {
        name: 'postingDate',
        label: 'Shipment Date',
        type: 'date',
        required: true
      },
      {
        name: 'quantity',
        label: 'Quantity Shipped',
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
        name: 'deadsOnArrivalQuantity',
        label: 'Deaths on Arrival',
        type: 'number',
        helperText: 'Optional - number of deaths on arrival at destination'
      },
      {
        name: 'dimensionPacker',
        label: 'Dimension Packer',
        type: 'select',
        required: true,
        helperText: 'Select the dimension packer for this shipment'
      },
      {
        name: 'comments',
        label: 'Comments',
        type: 'textarea',
        helperText: 'Optional comments about this shipment'
      }
    ],
    dynamicQuantities: false
  }
};
