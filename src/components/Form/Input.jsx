import React from "react";

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
				{label ? (
					<label className="label">
						<span className="label-text">{label}</span>
					</label>
				) : null}
				<input
					type={type}
					className={`input input-bordered w-full ${className}`}
					{...props}
					ref={ref}
				/>
				{sublabel ? (
					<label className="label">
						<span className="label-text-alt">{sublabel}</span>
					</label>
				) : null}
			</div>
		);
	}
);

export default Input;
