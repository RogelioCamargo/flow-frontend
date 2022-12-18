const formatDate = (date) => {
	if (date == null) return null;

	let safeDate = new Date(date);

	return safeDate.toLocaleDateString();
};

const formatDateWithTime = (date) => {
	if (date == null) return null;

	let safeDate = new Date(date);

	return safeDate.toLocaleString();
};

export { formatDate, formatDateWithTime };
