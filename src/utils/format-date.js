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
	return `${formattedDate} lúc ${formattedTime}`;
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

export function formatDateToVNTimeZone(dateStr) {
	const utcDate = new Date(dateStr);

	const options = {
		timeZone: 'Asia/Ho_Chi_Minh',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		fractionalSecondDigits: 3,
		hour12: false,
	};

	const formatter = new Intl.DateTimeFormat('en-GB', options);
	const vnDateParts = formatter.formatToParts(utcDate);

	const vnDateObj = vnDateParts.reduce((acc, part) => {
		acc[part.type] = part.value;
		return acc;
	}, {});

	return `${vnDateObj.year}-${vnDateObj.month}-${vnDateObj.day}T${vnDateObj.hour}:${vnDateObj.minute}:${vnDateObj.second}.${vnDateObj.fractionalSecond}+07:00`;
}

export function formatVNTimeZone(dateStr) {
	const date = new Date(dateStr);

	// Helper function to format numbers to two digits
	const padToTwoDigits = (num) => num.toString().padStart(2, '0');

	// Extract year, month, day, hours, minutes, and seconds
	const year = date.getFullYear();
	const month = padToTwoDigits(date.getMonth() + 1); // Months are zero-indexed
	const day = padToTwoDigits(date.getDate());
	const hours = padToTwoDigits(date.getHours());
	const minutes = padToTwoDigits(date.getMinutes());
	const seconds = padToTwoDigits(date.getSeconds());

	// Construct the formatted date string
	return `${day}-${month}-${year} lúc ${hours}:${minutes}:${seconds}`;
}
