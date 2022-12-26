import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatter";
import { LinkIcon } from "../icons";

function ProductName({ product, className }) {
	return (
		<Link
			className={`no-underline pr-3 ${className}`}
			to={`/product/${product._id}`}
		>
			<div className="font-bold break-words-and-wrap">{product.name}</div>
			<div className="text-sm opacity-50">{product.category.name}</div>
		</Link>
	);
}

function ProductQuantity({ product, className }) {
	return (
		<div className={className}>
			<div>{`${product.quantity} ${product?.unitOfMeasure ?? ""}`}</div>
			{/* {product?.unitsPerContainer ? (
										<div className="text-sm opacity-50">
											{`${product.unitsPerContainer} / 
												${product?.unitOfMeasure ?? "Container"}`}
										</div>
									) : null} */}
			{product.quantity <= product?.lowQuantity ? (
				<div className="badge badge-error badge-xs">Low</div>
			) : null}
		</div>
	);
}

function ProductDetails({ product, className }) {
	return (
		<div className={`flex items-center ${className}`}>
			{product?.purchaseLink ? (
				<div className="mr-2">
					<a
						className="no-underline"
						target="_blank"
						rel="noreferrer"
						href={`${product.purchaseLink}`}
					>
						<LinkIcon />
					</a>
				</div>
			) : null}
			{product.status !== "None" ? (
				<div
					className={`badge ${
						product.status === "Requested" ? "badge-primary" : "badge-secondary"
					} badge-sm mr-2`}
				>
					{product.status}
				</div>
			) : null}
		</div>
	);
}

function ProductTimestamps({ product, className }) {
	const lastOrderedDate = formatDate(product?.lastOrderedDate);
	const lastReceivedDate = formatDate(product?.lastReceivedDate);

	return (
		<div className={className}>
			{lastOrderedDate ? (
				<div className="flex">
					<div className="w-24 mr-1">Last Ordered:</div>
					<div>{lastOrderedDate}</div>
				</div>
			) : null}

			{lastReceivedDate ? (
				<div className="flex">
					<div className="w-24 mr-1">Last Received:</div>
					<div>{lastReceivedDate}</div>
				</div>
			) : null}
		</div>
	);
}

function ProductActionButton({ color = "primary", ...props } = {}) {
	return <button className={`btn btn-${color} btn-xs md:btn-sm`} {...props} />;
}

export {
	ProductName,
	ProductQuantity,
	ProductDetails,
	ProductTimestamps,
	ProductActionButton,
};
