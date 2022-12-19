import React from "react";
import { useAuth } from "./context/authContext";
import useAsync from "./hooks/useAsync";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "./components/Modal";
import Logo from "./logo.png";
import { Spinner } from "./components/Spinner";

function LoginForm({ onSubmit, submitButton }) {
	const { isLoading, isError, error, run } = useAsync();

	function handleSubmit(event) {
		event.preventDefault();
		const { username, password } = event.target.elements;

		run(
			onSubmit({
				username: username.value,
				password: password.value,
			})
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Username</span>
				</label>
				<input
					type="text"
					name="username"
					className="input input-bordered w-full max-w-xs"
				/>
			</div>
			<div className="form-control w-full max-w-xs">
				<label className="label">
					<span className="label-text">Password</span>
				</label>
				<input
					type="password"
					name="password"
					className="input input-bordered w-full max-w-xs"
				/>
			</div>
			<div>
				{React.cloneElement(
					submitButton,
					{ type: "submit" },
					...(Array.isArray(submitButton.props.children)
						? submitButton.props.children
						: [submitButton.props.children]),
					isLoading ? (
						<div className="ml-1">
							<Spinner size={5} color="black" />
						</div>
					) : null
				)}
			</div>
			{isError ? <div>{error.message}</div> : null}
		</form>
	);
}

function UnauthenticatedApp() {
	const { login, register } = useAuth();

	return (
		<div className="flex flex-col mx-auto relative top-72">
			<div className="flex items-center justify-center text-primary mb-7">
				<div className="w-12 h-12">
					<img src={Logo} alt="Logo" />
				</div>
				<span className="ml-1 font-bold text-4xl">flow</span>
			</div>
			<div className="flex justify-center">
				<Modal>
					<ModalOpenButton>
						<button className="btn btn-primary w-40">Login</button>
					</ModalOpenButton>
					<ModalContent title="Login">
						<ModalDismissButton />
						<LoginForm
							onSubmit={login}
							submitButton={
								<button className="btn btn-primary btn-block mt-3">
									Login
								</button>
							}
						/>
					</ModalContent>
				</Modal>
				<Modal>
					<ModalOpenButton>
						<button className="btn btn-secondary w-40 ml-2">Register</button>
					</ModalOpenButton>
					<ModalContent title="Register">
						<ModalDismissButton />
						<LoginForm
							onSubmit={register}
							submitButton={
								<button className="btn btn-primary btn-block mt-3">
									Register
								</button>
							}
						/>
					</ModalContent>
				</Modal>
			</div>
		</div>
	);
}

export default UnauthenticatedApp;
