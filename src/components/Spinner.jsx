function Spinner({ size, color = "primary" } = {}) {
	return (
		<div className={`w-${size} text-${color}`}>
			<div
				style={{ borderTopColor: "transparent" }}
				className={`w-${size} h-${size} border-4 border-current border-solid rounded-full animate-spin`}
			/>
		</div>
	);
}

function FullPageSpinner({ size = 16 } = {}) {
	return (
		<div className="absolute top-0 right-0 z-50 h-screen w-screen flex justify-center items-center">
			<Spinner size={size} />
		</div>
	);
}

export { Spinner, FullPageSpinner };
