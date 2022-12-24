import React from "react";
import { Label } from "./Label";

const Select = ({ label = null, children, ...props } = {}) => {
	return (
		<div className="form-control w-full">
			{label ? <Label text={label} /> : null}
			<select className="select select-bordered" {...props}>
				{children}
			</select>
		</div>
	);
};

export default Select;
