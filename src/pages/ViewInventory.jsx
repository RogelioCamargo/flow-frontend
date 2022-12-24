import React, { useState } from "react";
import { useProducts, useCreateProduct } from "../hooks/products";
import { useCategories } from "../hooks/categories";
import { formatDate } from "../utils/formatter";
import {
	Modal,
	ModalConfirmButton,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import { LinkIcon } from "../icons";
import { sortByProductName } from "../utils/sortter";
import { HeaderListItem, List, ListItem } from "../components/List";
import { Link } from "react-router-dom";

function ViewInventory({ filters, setFilters }) {
	const products = useProducts();
	const categories = useCategories();
	const { category, search } = filters;
	const productsFilteredByCategory =
		category === "All"
			? products
			: products.filter((product) => category === product.category.name);

	const productsFilteredBySearch = productsFilteredByCategory.filter(
		(product) => product.name.toLowerCase().includes(search)
	);

	return (
		<>
			<div className="prose md:max-w-lg lg:max-w-5xl mx-auto">
				<h2 className="text-center mt-10">View Inventory</h2>
				<div className="px-1 md:grid md:grid-cols-6 md:gap-2">
					<div className="mb-3 md:mb-0 md:col-span-3">
						<Input
							placeholder="Search"
							value={search}
							onChange={(e) =>
								setFilters((previousFilters) => ({
									...previousFilters,
									search: e.target.value.toLowerCase(),
								}))
							}
						/>
					</div>
					<div className="mb-3 md:mb-0 md:col-span-2">
						<Select
							value={category}
							onChange={({ target }) =>
								setFilters((previousFilters) => ({
									...previousFilters,
									category: target.value,
								}))
							}
						>
							<option value="All">All</option>
							{categories.map((category) => (
								<option key={category._id} value={category.name}>
									{category.name}
								</option>
							))}
						</Select>
					</div>
					<button
						className="btn btn-primary btn-block"
						onClick={() => setFilters({ category: "All", search: "" })}
					>
						Reset
					</button>
				</div>
				<List>
					<HeaderListItem className="grid-cols-8" style={{ minWidth: "800px" }}>
						<div className="col-span-3">Name</div>
						<div>Quantity</div>
						<div className="col-span-2">Details</div>
						<div className="col-span-2">Timestamps</div>
					</HeaderListItem>

					{sortByProductName(productsFilteredBySearch).map((product, index) => {
						const lastOrderedDate = formatDate(product?.lastOrderedDate);
						const lastReceivedDate = formatDate(product?.lastReceivedDate);

						return (
							<ListItem
								className="grid-cols-8"
								key={product._id}
								index={index}
								style={{ minWidth: "800px" }}
							>
								<Link
									className="no-underline col-span-3 pr-3"
									to={`/product/${product._id}`}
								>
									<div className="font-bold break-words-and-wrap">
										{product.name}
									</div>
									<div className="text-sm opacity-50">
										{product.category.name}
									</div>
								</Link>
								<div>
									<div>{`${product.quantity} ${
										product?.unitOfMeasure ?? null
									}`}</div>
									{/* {product?.unitsPerContainer ? (
										<div className="text-sm opacity-50">
											{`${product.unitsPerContainer} / 
												${product?.unitOfMeasure ?? "Container"}`}
										</div>
									) : null} */}
									{product.quantity < product?.lowQuantity ? (
										<div className="badge badge-error badge-xs">Low</div>
									) : null}
								</div>
								<div className="col-span-2 flex items-center">
									{product.status !== "None" ? (
										<div
											className={`badge badge-${
												product.status === "Requested" ? "primary" : "secondary"
											} badge-xs mr-2`}
										>
											{product.status}
										</div>
									) : null}

									<div>
										{product?.purchaseLink ? (
											<a
												className="no-underline"
												target="_blank"
												rel="noreferrer"
												href={`${product.purchaseLink}`}
											>
												<LinkIcon />
											</a>
										) : null}
									</div>
								</div>
								<div className="col-span-2">
									<div>
										{lastOrderedDate ? (
											<div className="flex">
												<div className="w-24 mr-1">Last Ordered:</div>
												<div>{lastOrderedDate}</div>
											</div>
										) : null}
									</div>
									<div>
										{lastReceivedDate ? (
											<div className="flex">
												<div className="w-24 mr-1">Last Received:</div>
												<div>{lastReceivedDate}</div>
											</div>
										) : null}
									</div>
								</div>
							</ListItem>
						);
					})}
				</List>
			</div>
			<CreateProductModal categories={categories} />
		</>
	);
}

const initialNewProductDetails = {
	name: "",
	quantity: "",
	category: "",
};

function CreateProductModal({ categories }) {
	const [newProduct, setNewProduct] = useState(initialNewProductDetails);
	const { mutate: createProduct } = useCreateProduct();
	const isConfirmDisabled = Object.values(newProduct).some(
		(input) => input === ""
	);

	const resetNewProduct = () => setNewProduct(initialNewProductDetails);

	const createNewProduct = () => {
		createProduct({
			...newProduct,
			quantity: Number(newProduct.quantity),
		});
		resetNewProduct();
		toast.success("New Product Created", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	return (
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
				<ModalConfirmButton
					className={isConfirmDisabled ? "btn-disabled" : ""}
					onClick={createNewProduct}
				>
					Create
				</ModalConfirmButton>
			</ModalContent>
		</Modal>
	);
}

export default ViewInventory;
