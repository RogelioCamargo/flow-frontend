import React from "react";
import EmptyList from "../components/EmptyList";
import Table from "../components/Table";
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

	const handleMarkAsOrdered = (product) => {
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

	const handleMarkAllAsOrdered = () => {
		markAllAsOrdered();
		toast.success("Marked All As Ordered", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const notifyManager = () => {};

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
					onClick={handleMarkAllAsOrdered}
				>
					Mark All As Ordered
				</button>
			</div>
			{requestedProducts.length === 0 ? (
				<EmptyList message="No requested products to show." />
			) : (
				<Table>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Date Requested</th>
							<th>Action</th>
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
										<div className="w-48 md:min-w-full break-words-and-wrap">
											{product.name}
										</div>
										<div className="text-sm opacity-50">
											{product.category.name}
										</div>
									</td>
									<td>{lastRequestedDate ?? "--"}</td>
									<td>
										<button
											className="btn btn-primary btn-sm"
											onClick={() => handleMarkAsOrdered(product)}
										>
											Mark as Ordered
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}

			<h2 className="text-center mb-0">Ordered Products</h2>
			{orderedProducts.length === 0 ? (
				<EmptyList message="No ordered products to show." />
			) : (
				<Table>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Date Ordered</th>
							{/* <th>Action</th> */}
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
										<div className="w-48 md:min-w-full break-words-and-wrap">
											{product.name}
										</div>
										<div className="text-sm opacity-50">
											{product.category.name}
										</div>
									</td>
									<td>{lastOrderedDate ?? "--"}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
		</div>
	);
};

export default Dashboard;
