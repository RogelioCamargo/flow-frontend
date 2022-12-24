function Label({ text }) {
	return (
		<label className="label">
			<span className="label-text">{text}</span>
		</label>
	);
}

function SubLabel({ text }) {
	return (
		<label className="label">
			<span className="label-text-alt">{text}</span>
		</label>
	);
}

export { Label, SubLabel };
