import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const queryClient = new QueryClient();

function AppProviders({ children }) {
	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<AuthProvider>{children}</AuthProvider>
			</Router>
			<ToastContainer />
		</QueryClientProvider>
	);
}

export { AppProviders };
