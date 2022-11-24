import React from "react";

const Table = ({ children }) => {
	return (
		<div className="overflow-x-auto mt-0">
			<table className="table w-full">{children}</table>
		</div>
	);
};

export default Table;
