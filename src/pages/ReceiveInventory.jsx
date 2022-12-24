import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "../components/Form/Input";
import {
	Modal,
	ModalConfirmButton,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { useProducts, useUpdateProduct } from "../hooks/products";
import { sortByProductName } from "../utils/sortter";
import ProductActionList from "../components/ProductActionList";
import useFocusInput from "../hooks/useFocusInput";

function ReceiveInventory() {
	const products = useProducts();
	const productsSortedByName = sortByProductName(products);

	const orderedProducts = productsSortedByName.filter(
		(product) => product.status === "Ordered"
	);

	return (
		<>
			<div className="prose md:max-w-lg lg:max-w-3xl mx-auto">
				<h2 className="text-center mt-10 mb-0">Receive Inventory</h2>
				<ProductActionList
					products={orderedProducts}
					ActionButton={ReceiveSelectedProductModal}
				/>
			</div>
			<ReceiveProductModal products={products} />
		</>
	);
}

function ReceiveProductModal({ products }) {
	const [search, setSearch] = useState("");
	const [quantity, setQuantity] = useState("");
	const { mutate: updateProduct } = useUpdateProduct();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [inputRef, focusOnInput] = useFocusInput();

	const results = products.filter((product) =>
		product.name.toLowerCase().includes(search.toLocaleLowerCase())
	);

	const confirmQuantity = () => {
		const updates = {
			...selectedProduct,
			quantity: selectedProduct.quantity + Number(quantity),
			status: "None",
			lastReceivedDate: new Date(),
		};

		updateProduct(updates);
		toast.success("Product Received", {
			position: "bottom-center",
			theme: "colored",
		});
		setQuantity("");
		setSearch("");
		setSelectedProduct(null);
	};

	return (
		<Modal>
			<ModalOpenButton>
				<button className="btn btn-primary fixed bottom-5 right-5 text-3xl flex justify-center items-center text-white rounded-full w-12 h-12">
					+
				</button>
			</ModalOpenButton>
			<ModalContent title="Receive" focusOnInput={focusOnInput}>
				<ModalDismissButton onClick={() => setSearch("")} />
				<Input
					placeholder="i.e. Poly Bags"
					label="Name"
					value={search}
					ref={inputRef}
					onChange={({ target }) => setSearch(target.value)}
					className="mb-3 md:mb-0"
				/>
				{search === "" ? null : results.length === 0 ? (
					<p className="text-center">No results found</p>
				) : !selectedProduct ? (
					<ul className="list-none p-0 my-0 text-base overflow-y-scroll max-h-60">
						{results.map((product) => (
							<li
								key={product._id}
								className="hover:bg-primary py-2 hover:text-white hover:rounded-md"
								onClick={() => {
									setSearch(product.name);
									setSelectedProduct(product);
								}}
							>
								{product.name}
							</li>
						))}
					</ul>
				) : null}
				<Input
					type="number"
					value={quantity}
					label="Quantity"
					onChange={({ target }) => setQuantity(target.value)}
				/>
				<ModalConfirmButton
					className={search === "" || quantity === "" ? "btn-disabled" : ""}
					onClick={confirmQuantity}
				>
					Confirm
				</ModalConfirmButton>
			</ModalContent>
		</Modal>
	);
}

function ReceiveSelectedProductModal({ product }) {
	const { mutate: updateProduct } = useUpdateProduct();
	const [quantity, setQuantity] = useState("");
	const [inputRef, focusOnInput] = useFocusInput();

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
				<button className="btn btn-primary btn-xs md:btn-sm">Receive</button>
			</ModalOpenButton>
			<ModalContent title="Confirm" focusOnInput={focusOnInput}>
				<ModalDismissButton onClick={() => setQuantity("")} />
				<p className="break-words-and-wrap mt-0 mb-3">
					How many{" "}
					<span className="font-bold text-secondary">{product.name}</span> did
					we receive?
				</p>
				<Input
					type="number"
					value={quantity}
					ref={inputRef}
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
