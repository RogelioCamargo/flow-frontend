import React, { useState } from "react";
import { formatDate } from "../utils/formatter";
import {
	useProducts,
	useUpdateProduct,
	useOrderAllProducts,
	useDecrementSupplyCounts,
} from "../hooks/products";
import { toast } from "react-toastify";
import { sortByProductName } from "../utils/sortter";
import Input from "../components/Form/Input";
import ProductActionList from "../components/ProductActionList";
import { EmptyList, HeaderListItem, List, ListItem } from "../components/List";
import { Link } from "react-router-dom";

function Dashboard() {
	const products = useProducts();
	const productsSortedByName = sortByProductName(products);

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<DailyOrderCount />
			<RequestedProducts products={productsSortedByName} />
			<OrderedProducts products={productsSortedByName} />
		</div>
	);
}

function DailyOrderCount() {
	const [quantity, setQuantity] = useState("");
	const { mutate: decrementSupplyCounts } = useDecrementSupplyCounts();

	const confirmQuantity = () => {
		decrementSupplyCounts({ orders: quantity });

		toast.success("Operation Supply Quantities Updated", {
			position: "bottom-center",
			theme: "colored",
		});

		setQuantity("");
	};

	return (
		<>
			<h2 className="text-center mt-10">Dashboard</h2>
			<div className="flex flex-col items-center">
				<div className="card bg-gray-800 w-96 h-72">
					<div className="card-body">
						<h3 className="card-title h-12">
							How many jewelry orders were completed today?
						</h3>
						<Input
							type="number"
							value={quantity}
							onChange={({ target }) => setQuantity(target.value)}
						/>
						<div className="card-actions justify-end">
							<button
								className={`btn btn-primary mt-3 ${
									quantity === "" ? "btn-disabled" : ""
								}`}
								onClick={confirmQuantity}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function RequestedProducts({ products }) {
	const { mutate: updateProduct } = useUpdateProduct();
	const { mutate: orderAllProducts } = useOrderAllProducts();

	const requestedProducts = products.filter(
		(product) => product.status === "Requested"
	);

	const disableButtonIfEmpty =
		requestedProducts.length === 0 ? "btn-disabled" : "";

	const markProductAsOrdered = (product) => {
		const updates = {
			...product,
			status: "Ordered",
			lastOrderedDate: new Date(),
		};

		updateProduct(updates);
		toast.success("Marked As Ordered", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const markAllProductsAsOrdered = () => {
		orderAllProducts();
		toast.success("Marked All As Ordered", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const notifyManager = () => {
		const blocks = [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `*New Request - ${formatDate(new Date())}*`,
				},
			},
			{
				type: "divider",
			},
		];

		requestedProducts.forEach((product) => {
			let productName;
			if (product?.purchaseLink)
				productName = `<${product.purchaseLink}|*${product.name}*>`;
			else productName = `*${product.name}*`;

			const newBlock = {
				type: "section",
				text: {
					type: "mrkdwn",
					text: `${productName}\nQuantity: ${product.quantity}`,
				},
			};

			blocks.push(newBlock, { type: "divider" });
		});

		blocks.push(
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `<https://flow-switch.netlify.app/|Open App>`,
				},
			},
			{ type: "divider" }
		);

		fetch(process.env.REACT_APP_SLACK_WEBHOOK_API, {
			method: "POST",
			body: JSON.stringify({ blocks }),
		});

		toast.success("Manager Notified", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	return (
		<>
			<h2 className="text-center mt-10">Requested Products</h2>
			<div className="text-center">
				<button
					className={`btn btn-secondary btn-sm ${disableButtonIfEmpty}`}
					onClick={notifyManager}
				>
					Notify Manager
				</button>
				<button
					className={`btn btn-sm ml-3 ${disableButtonIfEmpty}`}
					onClick={markAllProductsAsOrdered}
				>
					Mark All As Ordered
				</button>
			</div>
			<ProductActionList
				products={requestedProducts}
				ActionButton={({ product }) => (
					<button
						className="btn btn-primary btn-xs md:btn-sm"
						onClick={() => markProductAsOrdered(product)}
					>
						Mark Ordered
					</button>
				)}
			/>
		</>
	);
}

function OrderedProducts({ products }) {
	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

	if (orderedProducts.length === 0) {
		return <EmptyList message="No tickets to display" />;
	}

	return (
		<>
			<h2 className="text-center mb-0">Ordered Products</h2>
			<List>
				<HeaderListItem className="grid-cols-3">
					<div className="col-span-2">Name</div>
					<div>Date Ordered</div>
				</HeaderListItem>
				{orderedProducts.map((product, index) => (
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
							<div className="font-bold break-words-and-wrap">
								{product.name}
							</div>
							<div className="text-sm opacity-50">{product.category.name}</div>
						</Link>
						<div>{formatDate(product?.lastOrderedDate) ?? "--"}</div>
					</ListItem>
				))}
			</List>
		</>
	);
}

export default Dashboard;
