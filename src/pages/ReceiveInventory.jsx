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
										<ReceiveProductModal product={product} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</ProductTable>
			)}
		</div>
	);
}

function ReceiveProductModal({ product }) {
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
