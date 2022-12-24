import React, { useState } from "react";
import Input from "../components/Input";
import { useProducts, useUpdateProduct } from "../hooks/products";
import { sortByProductCategory, sortByProductName } from "../utils/sortter";
import ProductActionList from "../components/ProductActionList";

function CountInventory() {
	const products = useProducts();
	const productsSortedByCategory = sortByProductCategory(products);
	const productsSortedByName = sortByProductName(products);

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<InventoryCounts products={productsSortedByCategory} />
			<ProductsRequesting products={productsSortedByName} />
		</div>
	);
}

function InventoryCounts({ products }) {
	const [quantity, setQuantity] = useState("");
	const [index, setIndex] = useState(0);
	const { mutate: updateProduct } = useUpdateProduct();
	const product = products[index];

	const restartCounts = () => {
		setIndex(0);
	};

	const confirmQuantity = () => {
		const updates = {
			...product,
			quantity: Number(quantity),
		};

		updateProduct(updates);
		setQuantity("");
	};

	const requestProduct = () => {
		const updates = {
			...product,
			status: "Requested",
			lastRequestedDate: new Date(),
		};

		updateProduct(updates);
	};

	const previousProduct = () => {
		setIndex((previousIndex) => previousIndex - 1);
		setQuantity("");
	};

	const nextProduct = () => {
		setIndex((previousIndex) => previousIndex + 1);
		setQuantity("");
	};

	return (
		<>
			<h2 className="text-center mt-10">Count Inventory</h2>
			<div className="flex flex-col items-center">
				{index === products.length ? (
					<div className="card w-96 bg-neutral text-neutral-content h-80">
						{/* Display End of List Message */}
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
						{/* Display Product */}
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
			{/* Controls */}
			<div className="flex justify-center">
				<div className="btn-group grid grid-cols-3 w-96 mt-3">
					<button
						className={`btn btn-outline ${index <= 0 ? "btn-disabled" : ""}`}
						onClick={previousProduct}
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
						onClick={nextProduct}
					>
						»
					</button>
				</div>
			</div>
		</>
	);
}

function ProductsRequesting({ products }) {
	const { mutate: updateProduct } = useUpdateProduct();

	const requestedProducts = products.filter(
		(product) => product.status === "Requested"
	);

	const unrequestProduct = (product) => {
		const updates = {
			...product,
			status: "None",
		};

		updateProduct(updates);
	};

	return (
		<>
			<h2 className="text-center mb-0">Requesting</h2>
			<ProductActionList
				products={requestedProducts}
				ActionButton={({ product }) => (
					<button
						className="btn btn-error btn-xs md:btn-sm"
						onClick={() => unrequestProduct(product)}
					>
						Unrequest
					</button>
				)}
			/>
		</>
	);
}

export default CountInventory;
