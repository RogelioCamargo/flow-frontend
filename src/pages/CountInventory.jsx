import React, { useState } from "react";
import EmptyList from "../components/EmptyList";
import Input from "../components/Input";
import { ProductName, ProductTable } from "../components/ProductTable";
import { useProducts, useUpdateProduct } from "../hooks/products";
import { sortByProductCategory, sortByProductName } from "../utils/sortter";

function CountInventory() {
	const products = useProducts();

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<Counts products={products} />
			<Requesting products={products} />
		</div>
	);
}

function Counts({ products }) {
	const [quantity, setQuantity] = useState("");
	const [index, setIndex] = useState(0);
	const { mutate } = useUpdateProduct();

	const productsSortedByCategory = sortByProductCategory(products);
	const product = productsSortedByCategory[index];
	const isEndOfList = index === products.length;

	const restartCounts = () => {
		setIndex(0);
	};

	const confirmQuantity = () => {
		const updates = {
			...product,
			quantity: Number(quantity),
		};

		mutate(updates);
		setQuantity("");
	};

	const requestProduct = () => {
		const updates = {
			...product,
			status: "Requested",
			lastRequestedDate: new Date(),
		};

		mutate(updates);
	};

	const previous = () => {
		setIndex((previousIndex) => previousIndex - 1);
		setQuantity("");
	};

	const next = () => {
		setIndex((previousIndex) => previousIndex + 1);
		setQuantity("");
	};

	return (
		<>
			<h2 className="text-center mt-10">Count Inventory</h2>
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
										quantity === "" ? "btn-disabled" : ""
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
						className={`btn btn-outline ${index <= 0 ? "btn-disabled" : ""}`}
						onClick={previous}
					>
						«
					</button>
					<button className="btn btn-outline">
						{products.length - index} Remaining
					</button>
					<button
						className={`btn btn-outline ${
							index >= products.length ? "btn-disabled" : ""
						}`}
						onClick={next}
					>
						»
					</button>
				</div>
			</div>
		</>
	);
}

function Requesting({ products }) {
	const { mutate } = useUpdateProduct();

	const requestedProducts = products.filter(
		(product) => product.status === "Requested"
	);

	const unrequestProduct = (productToRemove) => {
		const updates = {
			...productToRemove,
			status: "None",
		};

		mutate(updates);
	};

	return (
		<>
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
												onClick={() => unrequestProduct(requestedProduct)}
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
		</>
	);
}

export default CountInventory;
