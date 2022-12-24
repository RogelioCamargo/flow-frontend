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
import Input from "../components/Form/Input";
import Select from "../components/Form/Select";
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
				<div className="px-1 grid grid-cols-5 gap-2">
					<div className="mb-0 col-span-2">
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
					<div className="mb-0 col-span-2">
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
						<span className="hidden md:block">Reset</span>
						<span className="md:hidden">
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 24 24"
								height="1em"
								width="1em"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="none"
									stroke="#000"
									strokeWidth="2"
									d="M20,8 C18.5974037,5.04031171 15.536972,3 12,3 C7.02943725,3 3,7.02943725 3,12 C3,16.9705627 7.02943725,21 12,21 L12,21 C16.9705627,21 21,16.9705627 21,12 M21,3 L21,9 L15,9"
								></path>
							</svg>
						</span>
					</button>
				</div>
				<List>
					<HeaderListItem className="grid-cols-7" style={{ minWidth: "800px" }}>
						<div className="col-span-3">Name</div>
						<div>Quantity</div>
						<div>Details</div>
						<div className="col-span-2">Timestamps</div>
					</HeaderListItem>

					{sortByProductName(productsFilteredBySearch).map((product, index) => {
						const lastOrderedDate = formatDate(product?.lastOrderedDate);
						const lastReceivedDate = formatDate(product?.lastReceivedDate);

						return (
							<ListItem
								className="grid-cols-7"
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
										product?.unitOfMeasure ?? ""
									}`}</div>
									{/* {product?.unitsPerContainer ? (
										<div className="text-sm opacity-50">
											{`${product.unitsPerContainer} / 
												${product?.unitOfMeasure ?? "Container"}`}
										</div>
									) : null} */}
									{product.quantity <= product?.lowQuantity ? (
										<div className="badge badge-error badge-sm">Low</div>
									) : null}
								</div>
								<div className="flex items-center">
									{product?.purchaseLink ? (
										<div className="mr-2">
											<a
												className="no-underline"
												target="_blank"
												rel="noreferrer"
												href={`${product.purchaseLink}`}
											>
												<LinkIcon />
											</a>
										</div>
									) : null}
									{product.status !== "None" ? (
										<div
											className={`badge badge-${
												product.status === "Requested" ? "primary" : "secondary"
											} badge-sm mr-2`}
										>
											{product.status}
										</div>
									) : null}
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
