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

const getListItemStyles = ({ className }) =>
	`px-5 grid items-center text-xs ${className}`;

function HeaderListItem({ children, className = "", ...props } = {}) {
	return (
		<li
			className={`${getListItemStyles({
				className,
			})} h-14 font-bold bg-base-300 border-b border-gray-500 uppercase`}
			{...props}
		>
			{children}
		</li>
	);
}

function ListItem({ children, className = "", index, ...props } = {}) {
	return (
		<li
			className={`${getListItemStyles({ className })} ${
				index % 2 !== 0 ? "bg-base-300" : ""
			} h-20 md:text-sm`}
			{...props}
		>
			{children}
		</li>
	);
}

export { EmptyList, List, HeaderListItem, ListItem };
