import React from "react";

const Select = ({ label = null, children, ...props } = {}) => {
	return (
		<div className="form-control w-full">
			{label ? (
				<label className="label">
					<span className="label-text">{label}</span>
				</label>
			) : null}
			<select className="select select-bordered" {...props}>
				{children}
			</select>
		</div>
	);
};

export default Select;
