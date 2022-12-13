import React, { useState } from "react";
import EmptyList from "../components/EmptyList";
import { ProductName, ProductTable } from "../components/ProductTable";
import { formatDate } from "../utils/formatter";
import {
	useProducts,
	useUpdateProduct,
	useMarkAllAsOrdered,
	useDecrementSupplyCounts,
} from "../hooks/products";
import { toast } from "react-toastify";
import { sortByProductName } from "../utils/sortter";
import Input from "../components/Input";

function Dashboard() {
	const products = useProducts();

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<DailyOrderCount />
			<RequestedList products={products} />
			<OrderedList products={products} />
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

function RequestedList({ products }) {
	const { mutate: updateProduct } = useUpdateProduct();
	const { mutate: markAllAsOrdered } = useMarkAllAsOrdered();

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
		markAllAsOrdered();
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
			{requestedProducts.length === 0 ? (
				<EmptyList message="No requested products to show." />
			) : (
				<ProductTable>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Action</th>
							<th>Date Requested</th>
						</tr>
					</thead>
					<tbody>
						{sortByProductName(requestedProducts).map((product, index) => {
							let lastRequestedDate =
								formatDate(product?.lastRequestedDate) ?? null;

							return (
								<tr key={product._id}>
									<td>{index + 1}</td>
									<td>
										<ProductName product={product} />
									</td>
									<td>
										<button
											className="btn btn-primary btn-sm"
											onClick={() => markProductAsOrdered(product)}
										>
											Mark as Ordered
										</button>
									</td>
									<td>{lastRequestedDate ?? "--"}</td>
								</tr>
							);
						})}
					</tbody>
				</ProductTable>
			)}
		</>
	);
}

function OrderedList({ products }) {
	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

	return (
		<>
			<h2 className="text-center mb-0">Ordered Products</h2>
			{orderedProducts.length === 0 ? (
				<EmptyList message="No ordered products to show." />
			) : (
				<ProductTable>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Date Ordered</th>
						</tr>
					</thead>
					<tbody>
						{sortByProductName(orderedProducts).map((product, index) => {
							let lastOrderedDate =
								formatDate(product?.lastOrderedDate) ?? null;

							return (
								<tr key={product._id}>
									<td>{index + 1}</td>
									<td>
										<ProductName product={product} />
									</td>
									<td>{lastOrderedDate ?? "--"}</td>
								</tr>
							);
						})}
					</tbody>
				</ProductTable>
			)}
		</>
	);
}

export default Dashboard;
