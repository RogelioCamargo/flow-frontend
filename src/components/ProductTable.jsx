import React from "react";
import { Link } from "react-router-dom";

const ProductTable = ({ children }) => {
	return (
		<div className="overflow-x-auto">
			<table className="table w-full">{children}</table>
		</div>
	);
};

const ProductName = ({ product }) => {
	return (
		<Link className="no-underline" to={`/product/${product._id}`}>
			<div className="w-44 font-bold md:w-full break-words-and-wrap">
				{product.name}
			</div>
			<div className="text-sm opacity-50">{product.category.name}</div>
		</Link>
	);
};

export { ProductName, ProductTable };
