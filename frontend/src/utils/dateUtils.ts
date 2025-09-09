// src/utils/dateUtils.ts

/**
 * Safely parses a date string and returns a Date object or null if invalid
 * @param dateString - The date string to parse
 * @returns Date object or null if the string is invalid
 */
export const safeParseDate = (dateString: string | undefined | null): Date | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

/**
 * Formats a date string for use in HTML date inputs (YYYY-MM-DD)
 * @param dateString - The date string to format
 * @returns Formatted date string or empty string if invalid
 */
export const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';

    const date = safeParseDate(dateString);
    if (!date) return '';

    return date.toISOString().split('T')[0];
};