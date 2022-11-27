import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useClient } from "../context/authContext";

function useProducts() {
	const client = useClient();
	const { data } = useQuery({
		queryKey: ["products"],
		queryFn: () => client("api/products"),
	});

	return data ?? [];
}

function useProduct(productId) {
	const client = useClient();
	const { data } = useQuery({
		queryKey: ["product", { productId }],
		queryFn: () => client(`api/products/${productId}`),
	});

	return (
		data ?? {
			name: "",
			quantity: "",
			category: {
				_id: "",
				name: "",
			},
			status: "",
		}
	);
}

function useCreateProduct() {
	const client = useClient();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => client(`api/products`, { data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

function useMarkAllAsOrdered() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () =>
			client(`api/products/order-all`, { method: "POST" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

function useUpdateProduct() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (updates) =>
			client(`api/products/${updates._id}`, { method: "PUT", data: updates }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

function useRemoveProduct() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productId) =>
			client(`api/products/${productId}`, { method: "DELETE" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

export {
	useProducts,
	useProduct,
	useUpdateProduct,
	useMarkAllAsOrdered,
	useCreateProduct,
	useRemoveProduct,
};
