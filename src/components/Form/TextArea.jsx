import React from "react";
import { Label } from "./Label";

function TextArea({ label = null, className = "", ...props } = {}) {
	return (
		<div className="form-control w-full">
			{label ? <Label text={label} /> : null}
			<textarea
				className="textarea textarea-bordered h-24"
				{...props}
			></textarea>
		</div>
	);
}

export default TextArea;
