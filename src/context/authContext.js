import * as React from "react";

import * as auth from "../utils/authProvider";
import { client } from "../utils/apiClient";
import useAsync from "../hooks/useAsync";
import { useQueryClient } from "@tanstack/react-query";

async function getUser() {
	let user = null;

	const token = await auth.getToken();
	if (token) {
		const data = await client("auth/me", { token });
		user = { ...data, token };
	}
	return user;
}

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
	const {
		data: user,
		status,
		error,
		isLoading,
		isIdle,
		isError,
		isSuccess,
		run,
		setData,
	} = useAsync();

	const queryClient = useQueryClient();

	React.useEffect(() => {
		const getUserPromise = getUser();
		run(getUserPromise);
	}, [run]);

	const login = React.useCallback(
		(form) => auth.login(form).then((user) => setData(user)),
		[setData]
	);
	const register = React.useCallback(
		(form) => auth.register(form).then((user) => setData(user)),
		[setData]
	);
	const logout = React.useCallback(() => {
		auth.logout();
		queryClient.clear();
		setData(null);
	}, [setData, queryClient]);

	const value = React.useMemo(
		() => ({ user, login, logout, register }),
		[login, logout, register, user]
	);

	if (isLoading || isIdle) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (isSuccess) {
		return <AuthContext.Provider value={value} {...props} />;
	}

	throw new Error(`Unhandled Status: ${status}`);
}

function useAuth() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error(`useAuth must be used within a AuthProvider`);
	}
	return context;
}

function useClient() {
	const { user } = useAuth();

	const token = user?.token;

	return React.useCallback(
		(endpoint, config) => client(endpoint, { ...config, token }),
		[token]
	);
}

export { AuthProvider, useAuth, useClient };
