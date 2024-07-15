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

    // Get formatted date and time separately
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });

    // Combine them into the desired format
    return formattedDate;
}

export function formatDateTime(datetimeString) {
    const date = new Date(datetimeString);

    // Custom format parts
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
    const year = date.getFullYear();

    // Combine parts into the desired format: HH:mm:ss dd/mm/yyyy
    return `${day}/${month}/${year} | ${hours}:${minutes}:${seconds}`;
}

export const formatDate = (date) => {
    if (!date) return '';
    const isoString = new Date(date).toISOString();
    return isoString; // Extracts the date part only
};
