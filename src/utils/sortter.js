const sortByProductName = (products) => {
	return products.sort((a, b) =>
		a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
	);
};

export { sortByProductName };
