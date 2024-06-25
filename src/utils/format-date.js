export function formatISODate(isoDateString) {
    const date = new Date(isoDateString);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour time format
        timeZone: 'UTC', // Use a specific time zone if needed
    };

    return date.toLocaleString('en-US', options);
}
export const formatDate = (date) => {
    if (!date) return '';
    const isoString = new Date(date).toISOString();
    return isoString; // Extracts the date part only
};
