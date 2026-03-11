export const formatDate = (dateString: string, format: 'monthYear' | 'full' | 'api' = 'monthYear') => {
    if (!dateString) return 'Select a date';
    const date = new Date(dateString);
    if (format === 'monthYear') {
        return date.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    }
    if (format === 'api') {
        return date.toISOString().split('T')[0];
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

export const getDurationString = (item: { startDate: string, endDate?: string, isCurrent: boolean }) => {
    if (!item.startDate) return '';
    const start = formatDate(item.startDate, 'monthYear');
    const end = item.isCurrent ? 'Present' : (item.endDate ? formatDate(item.endDate, 'monthYear') : 'N/A');
    return `${start} - ${end}`;
};
