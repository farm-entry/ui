/**
 * Converts a Date object to yyyy-MM-dd format string
 * @param date - The Date object to format
 * @returns Formatted date string in yyyy-MM-dd format, or empty string if date is null/undefined
 */
export const formatDateToYYYYMMDD = (date: Date | null | undefined): string => {
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/**
 * Converts a Date object to yyyy-MM-dd format and removes timestamp
 * @param date - The Date object to format
 * @returns Formatted date string in yyyy-MM-dd format with no timestamp
 */
export const formatDateToYYYYMMDDNoTimestamp = (date: Date | null | undefined): string => {
    if (!date) return '';
    const dateOnly = new Date(date);
    return formatDateToYYYYMMDD(dateOnly);
};

/**
 * Creates a Date object from yyyy-MM-dd string format
 * @param dateString - String in yyyy-MM-dd format
 * @returns Date object or null if invalid
 */
export const parseYYYYMMDDToLocalDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Create date in local timezone, not UTC
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
};