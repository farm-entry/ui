import { ActivityType, DimensionPacker, EventType, FormData, HealthStatus, Job } from '../store/livestockActivityStore';
import { delay } from './localConfig';

// Mock data based on farm-entry GraphQL schema
const mockJobs: Job[] = [
    {
        number: '2401',
        description: 'Nursery Group 2401',
        healthStatus: { code: 'HEALTHY', description: 'Healthy', color: 'green' },
        inventory: 450,
        deadQuantity: 5,
        startQuantity: 455,
    },
    {
        number: '2402',
        description: 'Nursery Group 2402',
        healthStatus: { code: 'TREATMENT', description: 'Treatment', color: 'yellow' },
        inventory: 380,
        deadQuantity: 8,
        startQuantity: 388,
    },
    {
        number: '2403',
        description: 'Finisher Group 2403',
        healthStatus: { code: 'HEALTHY', description: 'Healthy', color: 'green' },
        inventory: 220,
        deadQuantity: 2,
        startQuantity: 222,
    },
    {
        number: '2404',
        description: 'Finisher Group 2404',
        healthStatus: { code: 'SICK', description: 'Sick', color: 'red' },
        inventory: 195,
        deadQuantity: 15,
        startQuantity: 210,
    },
];

const mockEventTypes: EventType[] = [
    { code: 'WEAN_STD', description: 'Standard Wean' },
    { code: 'WEAN_EARLY', description: 'Early Wean' },
    { code: 'MORT_STD', description: 'Standard Mortality' },
    { code: 'MOVE_STD', description: 'Standard Move' },
    { code: 'MOVE_TREATMENT', description: 'Move to Treatment' },
    { code: 'GRADE_MARKET', description: 'Grade to Market' },
    { code: 'ADJ_POS', description: 'Positive Adjustment' },
    { code: 'ADJ_NEG', description: 'Negative Adjustment' },
    { code: 'PURCH_STD', description: 'Standard Purchase' },
    { code: 'PURCH_REPLACEMENT', description: 'Replacement Purchase' },
    { code: 'SHIP_MARKET', description: 'Ship to Market' },
    { code: 'SHIP_PROCESSOR', description: 'Ship to Processor' },
];

const mockHealthStatuses: HealthStatus[] = [
    { code: 'HEALTHY', description: 'Healthy', color: 'green' },
    { code: 'TREATMENT', description: 'Treatment', color: 'yellow' },
    { code: 'SICK', description: 'Sick', color: 'red' },
    { code: 'QUARANTINE', description: 'Quarantine', color: 'orange' },
];

const mockDimensionPackers: DimensionPacker[] = [
    { code: 'TYSON', description: 'Tyson Foods' },
    { code: 'JBS', description: 'JBS USA' },
    { code: 'SMITHFIELD', description: 'Smithfield Foods' },
    { code: 'HORMEL', description: 'Hormel Foods' },
];

class LivestockActivityApi {
    async fetchJobs(): Promise<Job[]> {
        await delay(500); // Simulate API delay
        return mockJobs;
    }

    async fetchEventTypes(): Promise<EventType[]> {
        await delay(300);
        return mockEventTypes;
    }

    async fetchHealthStatuses(): Promise<HealthStatus[]> {
        await delay(200);
        return mockHealthStatuses;
    }

    async fetchDimensionPackers(): Promise<DimensionPacker[]> {
        await delay(200);
        return mockDimensionPackers;
    }

    async saveFormData(data: FormData): Promise<{ success: boolean; message: string }> {
        await delay(800);

        // Simulate occasional failure for testing
        if (Math.random() < 0.1) {
            throw new Error('Failed to save form data - please try again');
        }

        console.log('Saving form data:', data);

        return {
            success: true,
            message: 'Form data saved successfully',
        };
    }

    // REST endpoints that would connect to farm-entry backend
    async submitToFarmEntry(data: FormData): Promise<{ success: boolean; message: string }> {
        // This would be the actual REST call to farm-entry backend
        // For now, just simulate the API call
        await delay(1000);

        console.log('Submitting to farm-entry backend:', data);

        return {
            success: true,
            message: `${data.activityType} activity submitted successfully`,
        };
    }
}

export const livestockActivityApi = new LivestockActivityApi();
