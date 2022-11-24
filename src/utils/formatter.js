const formatDate = (date) => {
	if (date == null) return null;

	let safeDate = date;
	if (typeof date === "string") {
		safeDate = new Date(date);
	}

	return safeDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

export default formatDate;
