import CountInventory from "./pages/CountInventory";
import ReceiveInventory from "./pages/ReceiveInventory";
import Header from "./components/Header";
import ViewInventory from "./pages/ViewInventory";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AsideMenu from "./components/AsideMenu";
import Product from "./pages/Product";
import { ErrorBoundary } from "react-error-boundary";

function FullPageErrorFallback({ error }) {
	return (
		<div
			role="alert"
			className="h-screen w-screen flex flex-col justify-center items-center"
		>
			<div className="text-center w-3/4">
				<p className="mb-3">
					Uh oh... There's a problem. Try refreshing the app.
				</p>
				<pre className="break-words-and-wrap">{error.message}</pre>
			</div>
		</div>
	);
}

function AuthenticatedApp() {
	return (
		<ErrorBoundary FallbackComponent={FullPageErrorFallback}>
			<div>
				<Header />
				<main>
					<AsideMenu />
					<AppRoutes />
				</main>
			</div>
		</ErrorBoundary>
	);
}

function AppRoutes() {
	return (
		<div className="md:ml-52 mt-20 md:mt-0 mb-24">
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/view-inventory" element={<ViewInventory />} />
				<Route path="/count-inventory" element={<CountInventory />} />
				<Route path="/receive-inventory" element={<ReceiveInventory />} />
				<Route path="/product/:id" element={<Product />} />
			</Routes>
		</div>
	);
}

export default AuthenticatedApp;
