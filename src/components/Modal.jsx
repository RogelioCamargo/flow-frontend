import React from "react";

const Modal = ({ children }) => {
	return (
		<div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full">
			<div className="relative top-40 mx-auto max-w-sm">
				<div className="card w-96 bg-neutral text-neutral-content">
					<div className="card-body">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
