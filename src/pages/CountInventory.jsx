import React, { useState } from "react";
import EmptyList from "../components/EmptyList";
import Table from "../components/Table";
import { useProducts, useUpdateProduct } from "../utils/products";

const CountInventory = () => {
	const products = useProducts();
	const { mutate } = useUpdateProduct();
	const [quantity, setQuantity] = useState("");
	const [index, setIndex] = useState(0);

	const redoOnClick = () => {
		setIndex(0);
	};
	const isEndOfList = index === products.length;

	const product = products[index];
	const isPrevousDisabled = index <= 0;
	const isNextDisabled = index >= products.length;
	const isConfirmDisabled = quantity === "";
	const requestedProducts = products.filter(
		(product) => product.status === "Requested"
	);

	const previousOnClick = () => {
		setIndex((previousIndex) => previousIndex - 1);
	};

	const nextOnClick = () => {
		setIndex((previousIndex) => previousIndex + 1);
	};

	const requestOnClick = () => {
		const updates = {
			...product,
			status: "Requested",
			lastRequestedDate: new Date(),
		};

		mutate(updates);
	};

	const confirmOnClick = () => {
		const updates = {
			...product,
			quantity: Number(quantity),
		};

		mutate(updates);
		setQuantity("");
	};

	const removeOnClick = (productToRemove) => {
		const updates = {
			...productToRemove,
			status: "None",
		};

		mutate(updates);
	};

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<h2 className="text-center mt-10">Inventory Counts</h2>

			<div className="flex flex-col items-center">
				{isEndOfList ? (
					<div className="card w-96 bg-neutral text-neutral-content">
						<div className="card-body items-center text-center">
							<h2 className="card-title">End of Inventory Counts</h2>
							<p className="py-3">You're all done!</p>
							<div className="card-actions justify-end">
								<button className="btn btn-primary" onClick={redoOnClick}>
									Start again
								</button>
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="card bg-gray-800 w-96">
							<div className="card-body">
								<h3 className="card-title">{product.name}</h3>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Quantity</span>
									</label>
									<input
										type="number"
										className="input input-bordered w-full max-w-xs"
										value={quantity}
										onChange={({ target }) => setQuantity(target.value)}
									/>
									<label className="label">
										<span className="label-text-alt">
											Current Quantity: {product.quantity}
										</span>
									</label>
								</div>
								<div className="card-actions justify-end">
									<button
										className={`btn btn-secondary ${
											product.status !== "None" ? "btn-disabled" : ""
										}`}
										onClick={requestOnClick}
									>
										{product.status !== "None" ? product.status : "Request"}
									</button>
									<button
										className={`btn btn-success ${
											isConfirmDisabled ? "btn-disabled" : ""
										}`}
										onClick={confirmOnClick}
									>
										Confirm
									</button>
								</div>
							</div>
						</div>
						<div className="btn-group grid grid-cols-3 w-96 mt-3">
							<button
								className={`btn btn-outline ${
									isPrevousDisabled ? "btn-disabled" : ""
								}`}
								onClick={previousOnClick}
							>
								«
							</button>
							<button className="btn btn-outline">
								{products.length - index} Remaining
							</button>
							<button
								className={`btn btn-outline ${
									isNextDisabled ? "btn-disabled" : ""
								}`}
								onClick={nextOnClick}
							>
								»
							</button>
						</div>
					</>
				)}
			</div>

			<h2 className="text-center mb-0">Requesting</h2>
			{requestedProducts.length === 0 ? (
				<EmptyList message="Products you request will be displayed here." />
			) : (
				<Table>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{requestedProducts.map((requestedProduct, index) => {
							return (
								<tr key={requestedProduct._id}>
									<td>{index + 1}</td>
									<td>
										<div className="w-42 md:min-w-full break-words-and-wrap">{requestedProduct.name}</div>
										<div className="text-sm opacity-50">
											{requestedProduct.category.name}
										</div>
									</td>
									<td>
										<button
											className="btn btn-error btn-sm"
											onClick={() => removeOnClick(requestedProduct)}
										>
											Unrequest
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
			{/* <div className="toast toast-center">
				<div className="alert alert-success">
					<div className="w-80">
						<span>Message sent successfully.</span>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default CountInventory;
