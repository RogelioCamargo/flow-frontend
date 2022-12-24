import React from "react";
import { Label, SubLabel } from "./Label";

const Input = React.forwardRef(
	(
		{
			label = null,
			sublabel = null,
			type = "text",
			className = "",
			...props
		} = {},
		ref
	) => {
		return (
			<div className="form-control w-full">
				{label ? <Label text={label} /> : null}
				<input
					type={type}
					className={`input input-bordered w-full ${className}`}
					{...props}
					ref={ref}
				/>
				{sublabel ? <SubLabel text={sublabel} /> : null}
			</div>
		);
	}
);

export default Input;
