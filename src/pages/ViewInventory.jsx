import React, { useState } from "react";
import { useProducts, useCreateProduct } from "../hooks/products";
import { useCategories } from "../hooks/categories";
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
import { sortByProductName } from "../utils/sortter";
import { HeaderListItem, List, ListItem } from "../components/List";
import {
	ProductDetails,
	ProductName,
	ProductQuantity,
	ProductTimestamps,
} from "../components/ProductList";
import { RefreshIcon } from "../icons";

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
							<RefreshIcon />
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
						return (
							<ListItem
								className="grid-cols-7"
								key={product._id}
								index={index}
								style={{ minWidth: "800px" }}
							>
								<ProductName className="col-span-3" product={product} />
								<ProductQuantity product={product} />
								<ProductDetails product={product} />
								<ProductTimestamps className="col-span-2" product={product} />
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
