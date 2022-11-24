import React from "react";
import { useAuth } from "./context/authContext";
import { useAsync } from "./utils/hooks";
import Modal from "./components/Modal";
import Logo from "./logo.png";

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
					isLoading ? <div>Loading...</div> : null
				)}
			</div>
			{isError ? <div>{error.message}</div> : null}
		</form>
	);
}

function UnauthenticatedApp() {
	const { login, register } = useAuth();
	const [loginModal, setLoginModal] = React.useState(false);
	const [registerModal, setRegisterModal] = React.useState(false);

	return (
		<div className="flex flex-col mx-auto relative top-72">
			<div className="flex items-center justify-center text-primary mb-7">
				<div className="w-12 h-12">
					<img src={Logo} alt="Logo" />
				</div>
				<span className="ml-1 font-bold text-4xl">flow</span>
			</div>
			<div className="flex justify-center">
				<button
					className="btn btn-primary w-40"
					onClick={() => setLoginModal(true)}
				>
					Login
				</button>
				<button
					className="btn btn-secondary w-40 ml-2"
					onClick={() => setRegisterModal(true)}
				>
					Register
				</button>
			</div>
			{loginModal ? (
				<Modal>
					<div className="absolute right-7">
						<button onClick={() => setLoginModal(false)}>
							<svg
								height="24"
								width="24"
								clipRule="evenodd"
								fillRule="evenodd"
								strokeLinejoin="round"
								strokeMiterlimit="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
							>
								<path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
							</svg>
						</button>
					</div>
					<h2 className="card-title font-bold my-2 justify-center">Login</h2>
					<LoginForm
						onSubmit={login}
						submitButton={
							<button className="btn btn-primary btn-block mt-3">Login</button>
						}
					/>
				</Modal>
			) : null}
			{registerModal ? (
				<Modal>
					<div className="absolute right-7">
						<button onClick={() => setRegisterModal(false)}>
							<svg
								height="24"
								width="24"
								clipRule="evenodd"
								fillRule="evenodd"
								strokeLinejoin="round"
								strokeMiterlimit="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
							>
								<path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
							</svg>
						</button>
					</div>
					<h2 className="card-title my-2 justify-center">Register</h2>
					<LoginForm
						onSubmit={register}
						submitButton={
							<button className="btn btn-primary btn-block mt-3">
								Register
							</button>
						}
					/>
				</Modal>
			) : null}
		</div>
	);
}

export default UnauthenticatedApp;
