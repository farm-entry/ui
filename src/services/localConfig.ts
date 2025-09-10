export const MOCK_DELAY = true;

export function delay(ms: number): Promise<void> {
    if (!MOCK_DELAY) return Promise.resolve();
    return new Promise(resolve => setTimeout(resolve, ms));
}