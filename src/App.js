import * as React from "react";
import { useAuth } from "./context/authContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

function App() {
	const { user } = useAuth();
	return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default App;
