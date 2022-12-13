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
	return useQuery({
		queryKey: ["product", { productId }],
		queryFn: () => client(`api/products/${productId}`),
	});
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
		mutationFn: () => client("api/products/order-all", { method: "POST" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

function useDecrementSupplyCounts() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data) =>
			client("api/products/decrement-supply-counts", { data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

function useUpdateProduct() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productUpdates) =>
			client(`api/products/${productUpdates._id}`, {
				method: "PUT",
				data: productUpdates,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries();
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
	useDecrementSupplyCounts,
	useCreateProduct,
	useRemoveProduct,
};
