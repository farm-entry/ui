import { ActivityTypeConfig } from './types';
import { weanConfig } from './wean';
import { mortalityConfig } from './mortality';
import { moveConfig } from './move';
import { gradeoffConfig } from './gradeoff';
import { qtyadjConfig } from './qtyadj';
import { purchaseConfig } from './purchase';
import { shipmentConfig } from './shipment';

export * from './types';

export const activityConfigs: Record<string, ActivityTypeConfig> = {
  WEAN: weanConfig,
  MORTALITY: mortalityConfig,
  MOVE: moveConfig,
  GRADEOFF: gradeoffConfig,
  QTYADJ: qtyadjConfig,
  PURCHASE: purchaseConfig,
  SHIPMENT: shipmentConfig,
};

export const activityTypeOptions = Object.values(activityConfigs).map(config => ({
  value: config.code,
  label: config.label
}));
