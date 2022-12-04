import { useQuery } from "@tanstack/react-query";
import { useClient } from "../context/authContext";

function useCategories() {
	const client = useClient();
	const { data } = useQuery({
		queryKey: ["categories"],
		queryFn: () => client("api/categories"),
	});

	return data ?? [];
}

export { useCategories };
