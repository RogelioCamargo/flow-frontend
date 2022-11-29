import React from "react";

const Input = ({
	label = null,
	sublabel = null,
	type = "text",
	...props
} = {}) => {
	return (
		<div className="form-control w-full">
			{label ? (
				<label className="label">
					<span className="label-text">{label}</span>
				</label>
			) : null}
			<input
				type={type}
				className="input input-bordered w-full"
				{...props}
			/>
			{sublabel ? (
				<label className="label">
					<span className="label-text-alt">{sublabel}</span>
				</label>
			) : null}
		</div>
	);
};

export { Input };
