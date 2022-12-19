import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import Select from "../components/Select";
import { useCategories } from "../hooks/categories";
import {
	useProduct,
	useRemoveProduct,
	useUpdateProduct,
} from "../hooks/products";
import { FullPageSpinner } from "../components/Spinner";

function Product() {
	const { id } = useParams();
	const navigate = useNavigate();
	const {
		data: product,
		isSuccess,
		isError,
		isLoading,
		error,
	} = useProduct(id);
	const categories = useCategories();
	const { mutate: removeProduct } = useRemoveProduct();
	const { mutate: updateProduct } = useUpdateProduct();

	const removeProductPermanently = () => {
		removeProduct(product._id);
		toast.success("Product Removed", {
			position: "bottom-center",
			theme: "colored",
		});
		navigate("/view-inventory");
	};

	const updateProductDetails = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const updates = { _id: product._id };
		for (const [name, value] of formData) {
			updates[name] = value;
		}

		updateProduct(updates);
		toast.success("Changes Saved", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	if (isLoading) {
		return <FullPageSpinner size={12} />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (isSuccess) {
		return (
			<div className="prose w-5/6 md:w-4/6 lg:w-5/6 mx-auto">
				<h2 className="text-center mt-10 mb-0">Edit Product</h2>
				<form onSubmit={updateProductDetails}>
					{/* Row 1 */}
					<Input
						label="Name"
						defaultValue={product.name}
						name="name"
						required
					/>
					{/* Row 2 */}
					<div className="md:grid md:grid-cols-2 md:gap-2">
						<Input
							type="number"
							label="Quantity"
							defaultValue={product.quantity}
							name="quantity"
							required
						/>
						<Select
							label="Category"
							name="category"
							defaultValue={product.category._id}
							required
						>
							<option disabled>Select One</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</Select>
					</div>
					{/* Row 3 */}
					<div className="md:grid md:grid-cols-2 md:gap-2">
						<Input
							label="Purchase Link"
							defaultValue={product?.purchaseLink ?? ""}
							name="purchaseLink"
						/>
						<Select label="Status" name="status" defaultValue={product.status}>
							<option disabled>Select One</option>
							<option value="None">None</option>
							<option value="Requested">Requested</option>
							<option value="Ordered">Ordered</option>
						</Select>
					</div>
					{/* Row 4 */}
					<div className="md:grid md:grid-cols-2 md:gap-2">
						<Input
							type="number"
							label="Low Quantity"
							defaultValue={product?.lowQuantity ?? ""}
							name="lowQuantity"
						/>
						<Input
							type="number"
							label="Reorder Quantity"
							defaultValue={product?.reorderQuantity ?? ""}
							name="reorderQuantity"
						/>
					</div>
					{/* Row 5 */}
					<div className="md:grid md:grid-cols-2 md:gap-2">
						<Input
							type="number"
							label="Units Per Container"
							defaultValue={product?.unitsPerContainer ?? ""}
							name="unitsPerContainer"
						/>
						<Input
							label="Unit of Measure"
							defaultValue={product?.unitOfMeasure ?? ""}
							name="unitOfMeasure"
						/>
					</div>
					<button type="submit" className="btn btn-primary w-48 mt-5">
						Save Changes
					</button>
				</form>

				<p className="mt-12 mb-3">Would you like to delete this product?</p>
				<Modal>
					<ModalOpenButton>
						<button className="btn btn-error w-48">Remove Product</button>
					</ModalOpenButton>
					<ModalContent title="Confirm">
						<ModalDismissButton />
						<p className="mt-0">
							Are you sure you want to remove <br />{" "}
							<span className="font-bold text-primary">{product.name}</span>?
						</p>
						<button
							className="btn btn-error btn-block"
							onClick={removeProductPermanently}
						>
							Remove
						</button>
					</ModalContent>
				</Modal>
			</div>
		);
	}
}

export default Product;
