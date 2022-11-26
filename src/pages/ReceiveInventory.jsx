import React, { useState } from "react";
import { toast } from "react-toastify";
import EmptyList from "../components/EmptyList";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import Table from "../components/Table";
import { useProducts, useUpdateProduct } from "../utils/products";

const ReceiveInventory = () => {
	const products = useProducts();
	const { mutate } = useUpdateProduct();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState("");

	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

	const confirmReceivedQuantity = () => {
		const updates = {
			...product,
			quantity: product.quantity + Number(quantity),
			status: "None",
			lastReceivedDate: new Date(),
		};

		mutate(updates);
		toast.success("Product Received", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const isConfirmDisabled = quantity === "";

	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<h2 className="text-center mt-10 mb-0">Receive Inventory</h2>
			{orderedProducts.length === 0 ? (
				<EmptyList message="No ordered products to receive." />
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
						{orderedProducts.map((product, index) => {
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
									<td>
										<Modal>
											<ModalOpenButton>
												<button
													className="btn btn-primary btn-sm"
													onClick={() => setProduct(product)}
												>
													Receive
												</button>
											</ModalOpenButton>
											<ModalContent title="Confirm">
												<ModalDismissButton />
												<p className="break-words-and-wrap mt-0 mb-3">
													How many{" "}
													<span className="font-bold text-secondary">
														{product.name}
													</span>{" "}
													did we receive?
												</p>
												<div className="form-control w-full max-w-xs mb-3">
													<input
														type="number"
														className="input input-bordered w-full max-w-xs"
														value={quantity}
														onChange={({ target }) => setQuantity(target.value)}
													/>
												</div>
												<div className="card-actions">
													<button
														className={`btn btn-primary btn-block ${
															isConfirmDisabled ? "btn-disabled" : ""
														}`}
														onClick={confirmReceivedQuantity}
													>
														Receive
													</button>
												</div>
											</ModalContent>
										</Modal>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
		</div>
	);
};

export default ReceiveInventory;
