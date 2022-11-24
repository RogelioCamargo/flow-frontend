import React, { useState } from "react";
import { toast } from "react-toastify";
import EmptyList from "../components/EmptyList";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { useProducts, useUpdateProduct } from "../utils/products";

const ReceiveInventory = () => {
	const products = useProducts();
	const { mutate } = useUpdateProduct();
	const [modalVisible, setModalVisible] = useState(false);
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState("");

	const orderedProducts = products.filter(
		(product) => product.status === "Ordered"
	);

	const receiveOnClick = (orderedProduct) => {
		setModalVisible(true);
		setProduct(orderedProduct);
	};

	const confirmOnClick = () => {
		const updates = {
			...product,
			quantity: product.quantity + Number(quantity),
			status: "None",
			lastReceivedDate: new Date(),
		};

		mutate(updates);
		setModalVisible(false);
		toast.success("Product Received", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const isConfirmDisabled = quantity === "";

	return (
		<div className="prose md:w-2/3 mx-auto">
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
										<button
											className="btn btn-primary btn-sm"
											onClick={() => receiveOnClick(product)}
										>
											Receive
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}

			{modalVisible ? (
				<Modal>
					<h2 className="card-title my-2 justify-center">{product.name}</h2>
					<div className="form-control w-full max-w-xs mb-3">
						<label className="label">
							<span className="label-text">Quantity Received:</span>
						</label>
						<input
							type="number"
							className="input input-bordered w-full max-w-xs"
							value={quantity}
							onChange={({ target }) => setQuantity(target.value)}
						/>
					</div>

					<div className="card-actions justify-end">
						<button className="btn" onClick={() => setModalVisible(false)}>
							Cancel
						</button>
						<button
							className={`btn btn-primary ${
								isConfirmDisabled ? "btn-disabled" : ""
							}`}
							onClick={confirmOnClick}
						>
							Confirm
						</button>
					</div>
				</Modal>
			) : null}
		</div>
	);
};

export default ReceiveInventory;
