import { Link } from "react-router-dom";
import { HeaderListItem, List, ListItem } from "./List";

function ProductActionList({ ActionButton, products }) {
	if (products.length === 0) {
		return <div className="text-center">No products to display.</div>;
	}

	return (
		<List>
			<HeaderListItem className="grid-cols-3" style={{ minWidth: "350px" }}>
				<div className="col-span-2">Name</div>
				<div>Action</div>
			</HeaderListItem>
			{products.map((product, index) => (
				<ListItem
					className="grid-cols-3"
					key={product._id}
					index={index}
					style={{ minWidth: "350px" }}
				>
					<Link
						className="no-underline col-span-2"
						to={`/product/${product._id}`}
					>
						<div className="font-bold break-words-and-wrap">{product.name}</div>
						<div className="text-sm opacity-50">{product.category.name}</div>
					</Link>
					<div>
						<ActionButton product={product} />
					</div>
				</ListItem>
			))}
		</List>
	);
}

export default ProductActionList;
