import React from "react";

function Card({ children, className, ...props }) {
	return (
		<div className="card bg-neutral text-neutral-content">
			<div className={`card-body ${className}`} {...props}>
				{children}
			</div>
		</div>
	);
}

function CardTitle({ children, className, ...props }) {
	return (
		<h3 className={`card-title h-14 mt-3 ${className}`} {...props}>
			{children}
		</h3>
	);
}

export { Card, CardTitle };
