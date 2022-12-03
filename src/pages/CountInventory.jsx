import React, { useState } from "react";
import EmptyList from "../components/EmptyList";
import Input from "../components/Input";
import { ProductName, ProductTable } from "../components/ProductTable";
import { useProducts, useUpdateProduct } from "../utils/products";
import { sortByProductCategory, sortByProductName } from "../utils/sortter";

const CountInventory = () => {
	const products = useProducts();
	const productsSortedByCategory = sortByProductCategory(products);
	const { mutate } = useUpdateProduct();
	const [quantity, setQuantity] = useState("");
	const [index, setIndex] = useState(0);

	const restartCounts = () => {
		setIndex(0);
	};

	const isEndOfList = index === products.length;
	const product = productsSortedByCategory[index];
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

	const requestProduct = () => {
		const updates = {
			...product,
			status: "Requested",
			lastRequestedDate: new Date(),
		};

		mutate(updates);
	};

	const confirmQuantity = () => {
		const updates = {
			...product,
			quantity: Number(quantity),
		};

		mutate(updates);
		setQuantity("");
	};

	const removeProductFromRequested = (productToRemove) => {
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
					<div className="card w-96 bg-neutral text-neutral-content h-80">
						<div className="card-body items-center text-center">
							<h3 className="card-title">End of Inventory Counts!</h3>
							<p className="py-3">
								You're all done! Click the "Start Over" button and you'll be
								brought to the first item in the list!
							</p>
							<div className="card-actions justify-end">
								<button className="btn btn-primary" onClick={restartCounts}>
									Start over
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="card bg-gray-800 w-96 h-80">
						<div className="card-body">
							<h3 className="card-title h-14 mt-3">{product.name}</h3>
							<Input
								type="number"
								label="Quantity"
								sublabel={`Current Quantity: ${product.quantity}`}
								value={quantity}
								onChange={({ target }) => setQuantity(target.value)}
							/>
							<div className="card-actions justify-end">
								<button
									className={`btn btn-secondary ${
										product.status !== "None" ? "btn-disabled" : ""
									}`}
									onClick={requestProduct}
								>
									{product.status !== "None" ? product.status : "Request"}
								</button>
								<button
									className={`btn btn-success ${
										isConfirmDisabled ? "btn-disabled" : ""
									}`}
									onClick={confirmQuantity}
								>
									Confirm
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className="flex justify-center">
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
			</div>

			<h2 className="text-center mb-0">Requesting</h2>
			{requestedProducts.length === 0 ? (
				<EmptyList message="Products you request will be displayed here." />
			) : (
				<ProductTable>
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{sortByProductName(requestedProducts).map(
							(requestedProduct, index) => {
								return (
									<tr key={requestedProduct._id}>
										<td>{index + 1}</td>
										<td>
											<ProductName product={requestedProduct} />
										</td>
										<td>
											<button
												className="btn btn-error btn-sm"
												onClick={() =>
													removeProductFromRequested(requestedProduct)
												}
											>
												Unrequest
											</button>
										</td>
									</tr>
								);
							}
						)}
					</tbody>
				</ProductTable>
			)}
		</div>
	);
};

export default CountInventory;
