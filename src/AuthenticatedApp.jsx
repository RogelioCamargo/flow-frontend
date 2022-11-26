import CountInventory from "./pages/CountInventory";
import ReceiveInventory from "./pages/ReceiveInventory";
import Header from "./components/Header";
import ViewInventory from "./pages/ViewInventory";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AsideMenu from "./components/AsideMenu";
import Product from "./pages/Product";

function AuthenticatedApp() {
	return (
		<>
			<Header />
			<main>
				<AsideMenu />
				<AppRoutes />
			</main>
		</>
	);
}

function AppRoutes() {
	return (
		<div className="md:ml-52 mt-20 md:mt-0 mb-24">
			<Routes>
				<Route path="/" element={<ViewInventory />} />
				<Route path="/view-inventory" element={<ViewInventory />} />
				<Route path="/count-inventory" element={<CountInventory />} />
				<Route path="/receive-inventory" element={<ReceiveInventory />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/product/:id" element={<Product />} />
			</Routes>
		</div>
	);
}

export default AuthenticatedApp;
