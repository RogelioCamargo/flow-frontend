import React, { useState } from "react";
import { useCreateProduct } from "../utils/products";
import { useCategories } from "../utils/categories";
import { useProducts } from "../utils/products";
import { formatDate } from "../utils/formatter";
import { ProductName, ProductTable } from "../components/ProductTable";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import { LinkIcon } from "../icons";
import { sortByProductName } from "../utils/sortter";

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
	const [search, setSearch] = useState("");

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

	const productsFilteredByCategory =
		category === "All"
			? products
			: products.filter((product) => category === product.category.name);

	const productsFilteredBySearch = productsFilteredByCategory.filter(
		(product) => product.name.toLowerCase().includes(search)
	);

	return (
		<div className="prose md:max-w-lg lg:max-w-4xl mx-auto">
			<h2 className="text-center mt-10">View Inventory</h2>
			<div className="px-1 md:grid md:grid-cols-2 md:gap-2">
				<Input
					placeholder="Search"
					value={search}
					onChange={(e) => setSearch(e.target.value.toLowerCase())}
					className="mb-3 md:mb-0"
				/>
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
			<ProductTable>
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
					{sortByProductName(productsFilteredBySearch).map((product, index) => {
						const lastOrderedDate =
							formatDate(product?.lastOrderedDate) ?? "--";

						const lastReceivedDate =
							formatDate(product?.lastReceivedDate) ?? "--";

						return (
							<tr key={product._id}>
								<td>{index + 1}</td>
								<td>
									<ProductName product={product} />
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
											<LinkIcon />
										</a>
									) : (
										"--"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</ProductTable>

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
