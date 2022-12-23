function List({ children }) {
	return (
		<div className="overflow-x-auto">
			<div className="w-full">
				<ul className="list-none p-0">{children}</ul>
			</div>
		</div>
	);
}

function HeaderListItem({ children, className, ...props }) {
	return (
		<li
			className={`px-5 h-14 items-center grid ${className} font-bold bg-base-300 border-b border-gray-500 text-xs uppercase`}
			{...props}
		>
			{children}
		</li>
	);
}

function ListItem({ children, className, index, ...props }) {
	return (
		<li className={`px-5 ${index % 2 !== 0 ? "bg-base-300" : ""}`}>
			<div
				className={`h-20 items-center grid ${className} text-xs md:text-sm`}
				{...props}
			>
				{children}
			</div>
		</li>
	);
}

export { List, HeaderListItem, ListItem };
