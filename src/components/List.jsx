function EmptyList({ message }) {
	return <div className="text-center mt-6">{message}</div>;
}

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
		<li className={`px-5 ${index % 2 !== 0 ? "bg-base-300" : ""}`} {...props}>
			<div className={`h-20 items-center grid ${className} text-xs md:text-sm`}>
				{children}
			</div>
		</li>
	);
}

export { EmptyList, List, HeaderListItem, ListItem };
