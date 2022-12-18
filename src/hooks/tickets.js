import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useClient } from "../context/authContext";

function useTickets() {
	const client = useClient();
	const { data } = useQuery({
		queryKey: ["tickets"],
		queryFn: () => client("api/tickets"),
	});

	return data ?? [];
}

function useTicket(ticketId) {
	const client = useClient();
	return useQuery({
		queryKey: ["product", { ticketId }],
		queryFn: () => client(`api/tickets/${ticketId}`),
	});
}

function useCreateTicket() {
	const client = useClient();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data) => client(`api/tickets`, { data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});
}

function useUpdateProduct() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (updates) =>
			client(`api/tickets/${updates._id}`, {
				method: "PUT",
				data: updates,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});
}

function useRemoveTicket() {
	const client = useClient();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ticketId) =>
			client(`api/tickets/${ticketId}`, { method: "DELETE" }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});
}

export {
	useTickets,
	useTicket,
	useUpdateProduct,
	useCreateTicket,
	useRemoveTicket,
};
