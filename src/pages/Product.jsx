import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { useCategories } from "../utils/categories";
import {
	useProduct,
	useRemoveProduct,
	useUpdateProduct,
} from "../utils/products";

const Product = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const product = useProduct(id);
	const categories = useCategories();
	const [updatedProduct, setUpdatedProduct] = useState({
		...product,
		category: product.category._id,
	});
	const [modalVisible, setModalVisible] = useState(false);
	const { mutate: removeProduct } = useRemoveProduct();
	const { mutate: updateProduct } = useUpdateProduct();

	useEffect(() => {
		setUpdatedProduct({ ...product, category: product.category._id });
	}, [product]);

	const onChange = (event) => {
		let { name, value } = event.target;

		setUpdatedProduct({
			...updatedProduct,
			[name]: value,
		});
	};

	const handleRemoveProduct = () => {
		removeProduct(product._id);
		toast.success("Product Removed", {
			position: "bottom-center",
			theme: "colored",
		});
		navigate("/view-inventory");
	};

	const handleSaveChanges = () => {
		const updates = {};
		for (const [key, value] of Object.entries(updatedProduct)) {
			if (
				value &&
				[
					"quantity",
					"lowQuantity",
					"reorderQuantity",
					"unitsPerContainer",
				].includes(key)
			)
				updates[key] = Number(value);
			else if (value) updates[key] = value;
		}

		updateProduct(updates);
		toast.success("Changes Saved", {
			position: "bottom-center",
			theme: "colored",
		});
	};
	return (
		<div className="prose w-5/6 md:w-4/6 lg:w-5/6 mx-auto">
			<h2 className="text-center mt-10 mb-0">Edit Product</h2>
			{/* Row 1 */}
			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Name</span>
				</label>
				<input
					type="text"
					value={updatedProduct.name}
					name="name"
					onChange={onChange}
					className="input input-bordered w-full"
				/>
			</div>
			{/* Row 2 */}
			<div className="md:flex md:justify-between">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Quantity</span>
					</label>
					<input
						type="number"
						value={updatedProduct.quantity}
						name="quantity"
						onChange={onChange}
						className="input input-bordered w-full"
					/>
				</div>
				<div className="form-control w-full md:ml-3">
					<label className="label">
						<span className="label-text">Category</span>
					</label>
					<select
						className="select select-bordered"
						name="category"
						value={updatedProduct.category}
						onChange={onChange}
					>
						<option disabled>Select One</option>
						{categories.map((category) => (
							<option key={category._id} value={category._id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
			</div>
			{/* Row 3 */}
			<div className="form-control w-full">
				<label className="label">
					<span className="label-text">Purchase Link</span>
				</label>
				<input
					type="text"
					value={updatedProduct?.purchaseLink ?? ""}
					name="purchaseLink"
					onChange={onChange}
					className="input input-bordered w-full"
				/>
			</div>
			{/* Row 4 */}
			<div className="md:flex md:justify-between">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Low Quantity</span>
					</label>
					<input
						type="number"
						value={updatedProduct?.lowQuantity ?? ""}
						name="lowQuantity"
						onChange={onChange}
						className="input input-bordered w-full"
					/>
				</div>
				<div className="form-control w-full md:ml-3">
					<label className="label">
						<span className="label-text">Reorder Quantity</span>
					</label>
					<input
						type="number"
						value={updatedProduct?.reorderQuantity ?? ""}
						name="reorderQuantity"
						onChange={onChange}
						className="input input-bordered w-full"
					/>
				</div>
			</div>
			{/* Row 5 */}
			<div className="md:flex md:justify-between">
				<div className="form-control w-full">
					<label className="label">
						<span className="label-text">Units Per Container</span>
					</label>
					<input
						type="number"
						value={updatedProduct?.unitsPerContainer ?? ""}
						name="unitsPerContainer"
						onChange={onChange}
						className="input input-bordered w-full"
					/>
				</div>
				<div className="form-control w-full md:ml-3">
					<label className="label">
						<span className="label-text">Unit of Measure</span>
					</label>
					<input
						type="text"
						value={updatedProduct?.unitOfMeasure ?? ""}
						name="unitOfMeasure"
						onChange={onChange}
						className="input input-bordered w-full"
					/>
				</div>
			</div>
			<div className="flex justify-between mt-5 mb-36">
				<button className="btn btn-error" onClick={() => setModalVisible(true)}>
					Remove Product
				</button>
				<button className="btn btn-primary" onClick={handleSaveChanges}>
					Save Changes
				</button>
			</div>

			{modalVisible ? (
				<Modal>
					<p>
						Are you sure you want to remove <br />{" "}
						<span className="font-bold text-primary">{product.name}</span>?
					</p>
					<div className="card-actions justify-end">
						<button className="btn" onClick={() => setModalVisible(false)}>
							Cancel
						</button>
						<button className="btn btn-error" onClick={handleRemoveProduct}>
							Remove
						</button>
					</div>
				</Modal>
			) : null}
		</div>
	);
};

export default Product;
