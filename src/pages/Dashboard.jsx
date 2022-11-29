import React from "react";
import EmptyList from "../components/EmptyList";
import { ProductName, ProductTable } from "../components/ProductTable";
import formatDate from "../utils/formatter";
import {
	useProducts,
	useUpdateProduct,
	useMarkAllAsOrdered,
} from "../utils/products";
import { toast } from "react-toastify";

const Dashboard = () => {
	const products = useProducts();
	const { mutate: updateProduct } = useUpdateProduct();
	const { mutate: markAllAsOrdered } = useMarkAllAsOrdered();

	const requestedProducts = products.filter(
		(product) => product.status === "Requested"
	);
	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

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
					text: `\n\n\n*New Request - ${formatDate(new Date())}*`,
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

		blocks.push({
			type: "section",
			text: {
				type: "mrkdwn",
				text: `<https://flow-switch.netlify.app/|Open App>\n\n`,
			},
		});

		fetch(process.env.REACT_APP_SLACK_WEBHOOK_API, {
			method: "POST",
			body: JSON.stringify({ blocks }),
		});

		toast.success("Manager Notified", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const disableButtonIfEmpty =
		requestedProducts.length === 0 ? "btn-disabled" : "";

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
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
						{requestedProducts.map((product, index) => {
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
						{orderedProducts.map((product, index) => {
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
		</div>
	);
};

export default Dashboard;
