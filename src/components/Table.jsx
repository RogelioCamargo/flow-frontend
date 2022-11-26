import React from "react";

const Table = ({ children }) => {
	return (
		<div className="overflow-x-auto">
			<table className="table w-full">{children}</table>
		</div>
	);
};

export default Table;
