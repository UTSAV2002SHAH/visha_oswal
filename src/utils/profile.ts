// Utility functions for profile data formatting

/**
 * Formats a date string to different display formats
 * @param dateString - ISO date string
 * @param format - Output format type
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string,
    format: 'monthYear' | 'full' | 'api' = 'monthYear'
): string => {
    if (!dateString) return 'Select a date';

    const date = new Date(dateString);

    if (format === 'monthYear') {
        return date.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
    }

    if (format === 'api') {
        return date.toISOString().split('T')[0];
    }

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC'
    });
};

/**
 * Generates a duration string for experience/education items
 * @param item - Object with startDate, endDate, and isCurrent
 * @returns Duration string (e.g., "January 2020 - Present")
 */
export const getDurationString = (item: {
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
}): string => {
    if (!item.startDate) return '';

    const start = formatDate(item.startDate, 'monthYear');
    const end = item.isCurrent
        ? 'Present'
        : (item.endDate ? formatDate(item.endDate, 'monthYear') : 'N/A');

    return `${start} - ${end}`;
};
