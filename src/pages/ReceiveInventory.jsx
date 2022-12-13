import React, { useState } from "react";
import { toast } from "react-toastify";
import EmptyList from "../components/EmptyList";
import Input from "../components/Input";
import {
	Modal,
	ModalConfirmButton,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { ProductName, ProductTable } from "../components/ProductTable";
import { useProducts, useUpdateProduct } from "../hooks/products";
import { sortByProductName } from "../utils/sortter";

function ReceiveInventory() {
	const products = useProducts();

	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<h2 className="text-center mt-10 mb-0">Receive Inventory</h2>
			{orderedProducts.length === 0 ? (
				<EmptyList message="No ordered products to receive." />
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
						{sortByProductName(orderedProducts).map((product, index) => {
							return (
								<tr key={product._id}>
									<td>{index + 1}</td>
									<td>
										<ProductName product={product} />
									</td>
									<td>
										<ReceiveSelectedProductModal product={product} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</ProductTable>
			)}

			<ReceiveProductModal products={products} />
		</div>
	);
}

function ReceiveProductModal({ products }) {
	const [search, setSearch] = useState("");
	const [quantity, setQuantity] = useState("");
	const { mutate: updateProduct } = useUpdateProduct();
	const [selectedProduct, setSelectedProduct] = useState(null);

	const results = products.filter((product) =>
		product.name.toLowerCase().includes(search.toLocaleLowerCase())
	);

	const confirmQuantity = () => {
		const updates = {
			...selectedProduct,
			quantity: selectedProduct.quantity + Number(quantity),
			status: "None",
			lastReceivedDate: new Date(),
		};

		updateProduct(updates);
		toast.success("Product Received", {
			position: "bottom-center",
			theme: "colored",
		});
		setQuantity("");
	};

	return (
		<Modal>
			<ModalOpenButton>
				<button className="btn btn-primary fixed bottom-5 right-5 text-3xl flex justify-center items-center text-white rounded-full w-12 h-12">
					+
				</button>
			</ModalOpenButton>
			<ModalContent title="Receive">
				<ModalDismissButton onClick={() => setSearch("")} />
				<Input
					placeholder="i.e. Poly Bags"
					label="Name"
					value={search}
					onChange={(e) => setSearch(e.target.value.toLowerCase())}
					className="mb-3 md:mb-0"
				/>
				{search === "" ? null : results.length === 0 ? (
					<p className="text-center">No results found</p>
				) : !selectedProduct ? (
					<ul className="list-none p-0 my-0 text-base overflow-y-scroll max-h-60">
						{results.map((product) => (
							<li
								key={product._id}
								className="hover:bg-primary py-2 hover:text-white hover:rounded-md"
								onClick={() => {
									setSearch(product.name);
									setSelectedProduct(product);
								}}
							>
								{product.name}
							</li>
						))}
					</ul>
				) : null}
				<Input
					type="number"
					value={quantity}
					label="Quantity"
					onChange={({ target }) => setQuantity(target.value)}
				/>
				<ModalConfirmButton
					className={search === "" || quantity === "" ? "btn-disabled" : ""}
					onClick={confirmQuantity}
				>
					Confirm
				</ModalConfirmButton>
			</ModalContent>
		</Modal>
	);
}

function ReceiveSelectedProductModal({ product }) {
	const { mutate: updateProduct } = useUpdateProduct();
	const [quantity, setQuantity] = useState("");

	const confirmQuantity = () => {
		const updates = {
			...product,
			quantity: product.quantity + Number(quantity),
			status: "None",
			lastReceivedDate: new Date(),
		};

		updateProduct(updates);
		toast.success("Product Received", {
			position: "bottom-center",
			theme: "colored",
		});
		setQuantity("");
	};

	return (
		<Modal>
			<ModalOpenButton>
				<button className="btn btn-primary btn-sm">Receive</button>
			</ModalOpenButton>
			<ModalContent title="Confirm">
				<ModalDismissButton onClick={() => setQuantity("")} />
				<p className="break-words-and-wrap mt-0 mb-3">
					How many{" "}
					<span className="font-bold text-secondary">{product.name}</span> did
					we receive?
				</p>
				<Input
					type="number"
					value={quantity}
					onChange={({ target }) => setQuantity(target.value)}
				/>
				<ModalConfirmButton
					className={quantity === "" ? "btn-disabled" : ""}
					onClick={confirmQuantity}
				>
					Receive
				</ModalConfirmButton>
			</ModalContent>
		</Modal>
	);
}

export default ReceiveInventory;
