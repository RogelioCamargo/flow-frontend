import React from "react";

const Select = ({ label, children, ...props }) => {
	return (
		<div className="form-control w-full">
			<label className="label">
				<span className="label-text">{label}</span>
			</label>
			<select className="select select-bordered" {...props}>
				{children}
			</select>
		</div>
	);
};

export default Select;
