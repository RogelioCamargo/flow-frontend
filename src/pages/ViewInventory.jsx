import React, { useState } from "react";
import { useCreateProduct } from "../utils/products";
import { useCategories } from "../utils/categories";
import { useProducts } from "../utils/products";
import formatDate from "../utils/formatter";
import Table from "../components/Table";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../components/Input";
import Select from "../components/Select";

const initialNewProductDetails = {
	name: "",
	quantity: "",
	category: "",
};

const ViewInventory = () => {
	const products = useProducts();
	const { mutate } = useCreateProduct();
	const categories = useCategories();
	const [newProduct, setNewProduct] = useState(initialNewProductDetails);
	const [category, setCategory] = useState("All");

	const resetNewProduct = () => setNewProduct(initialNewProductDetails);

	const createOnClick = () => {
		mutate({
			...newProduct,
			quantity: Number(newProduct.quantity),
		});
		resetNewProduct();
		toast.success("New Product Created", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const isConfirmDisabled = Object.values(newProduct).some(
		(input) => input === ""
	);

	const filteredProducts =
		category === "All"
			? products
			: products.filter((product) => category === product.category.name);

	return (
		<div className="prose md:max-w-lg lg:max-w-4xl mx-auto">
			<h2 className="text-center mt-10">View Inventory</h2>
			<div className="px-1">
				<Select
					value={category}
					onChange={({ target }) => setCategory(target.value)}
				>
					<option value="All">All</option>
					{categories.map((category) => (
						<option key={category._id} value={category.name}>
							{category.name}
						</option>
					))}
				</Select>
			</div>
			<Table>
				<thead>
					<tr>
						<td></td>
						<th>Name</th>
						<th>Quantity</th>
						<th>Status</th>
						<th>Last Ordered</th>
						<th>Last Received</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>
					{filteredProducts.map((product, index) => {
						const lastOrderedDate =
							formatDate(product?.lastOrderedDate) ?? "--";

						const lastReceivedDate =
							formatDate(product?.lastReceivedDate) ?? "--";

						return (
							<tr key={product._id}>
								<td>{index + 1}</td>
								<td>
									<div className="w-44 font-bold md:w-full break-words-and-wrap">
										<Link
											className="no-underline"
											to={`/product/${product._id}`}
										>
											{product.name}
										</Link>
									</div>
									<div className="text-sm opacity-50">
										{product.category.name}
									</div>
								</td>
								<td>
									<div>{`${product.quantity} ${product?.unitOfMeasure ?? ""}${
										product.quantity > 1 && product?.unitOfMeasure ? "s" : ""
									}`}</div>
									{product?.unitsPerContainer ? (
										<div className="text-sm opacity-50">
											{`${product.unitsPerContainer} / 
												${product?.unitOfMeasure ?? "Container"}`}
										</div>
									) : null}
									{product.quantity < product?.lowQuantity ? (
										<div className="badge badge-error badge-xs">Low</div>
									) : null}
								</td>
								<td>{product.status === "None" ? "--" : product.status}</td>
								<td>{lastOrderedDate}</td>
								<td>{lastReceivedDate}</td>
								<td>
									{product?.purchaseLink ? (
										<a
											className="no-underline"
											target="_blank"
											rel="noreferrer"
											href={`${product.purchaseLink}`}
										>
											<svg
												width="24"
												height="24"
												xmlns="http://www.w3.org/2000/svg"
												fillRule="evenodd"
												clipRule="evenodd"
												fill="currentColor"
											>
												<path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z" />
											</svg>
										</a>
									) : (
										"--"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>

			<Modal>
				<ModalOpenButton>
					<button className="btn btn-primary fixed bottom-5 right-5 text-3xl flex justify-center items-center text-white rounded-full w-12 h-12">
						+
					</button>
				</ModalOpenButton>
				<ModalContent title="New Product Details">
					<ModalDismissButton onClick={resetNewProduct} />
					<form>
						<Input
							label="Name"
							value={newProduct.name}
							onChange={(event) =>
								setNewProduct({
									...newProduct,
									name: event.target.value,
								})
							}
						/>
						<Input
							type="number"
							label="Quantity"
							value={newProduct.quantity}
							onChange={(event) =>
								setNewProduct({
									...newProduct,
									quantity: event.target.value,
								})
							}
						/>
						<Select
							label="Category"
							value={newProduct.category}
							onChange={(event) =>
								setNewProduct({
									...newProduct,
									category: event.target.value,
								})
							}
							required
						>
							<option disabled value="">
								Select One
							</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</Select>
					</form>
					<button
						className={`btn btn-primary btn-block mt-3 ${
							isConfirmDisabled ? "btn-disabled" : ""
						}`}
						onClick={createOnClick}
					>
						Create
					</button>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default ViewInventory;
