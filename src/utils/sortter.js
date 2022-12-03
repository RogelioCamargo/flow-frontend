const sortByProductName = (products) => {
	return products.sort((a, b) =>
		a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
	);
};

const sortByProductCategory = (products) => {
	return products.sort((a, b) => (a.category.name > b.category.name ? 1 : -1));
};

export { sortByProductName, sortByProductCategory };
