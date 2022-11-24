import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const AsideMenu = () => {
	const { logout } = useAuth();
	const location = useLocation();

	return (
		<aside className="hidden md:block w-52 bg-base-200 prose-sm">
			<ul className="menu h-screen text-white font-bold p-0 relative">
				<li className="flex items-center">
					<Link to="/">
						<div className="flex items-center text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M.696 8c1.649-4.66 6.08-8 11.304-8 6.627 0 12 5.373 12 12 0 .683-.07 1.348-.18 2h-1.523c-1.137 0-1.316-.507-1.932-2.461-.445-1.414-1.184-3.551-2.811-3.551-1.656 0-2.297 2.215-2.893 4.006-.325.973-.521 1.561-.812 1.561-.279 0-.411-.588-.74-1.563-.616-1.822-1.319-4.003-2.965-4.003-1.705 0-2.436 2.387-2.925 3.908-.354 1.105-.466 1.659-.78 1.659-.267 0-.352-.449-.66-1.344-.701-2.041-.925-4.212-4.06-4.212h-1.023zm21.458 8c-2.297 0-2.845-1.101-3.703-3.563-.531-1.528-.588-2.074-.896-2.074-.301 0-.387.627-.979 2.312-.519 1.475-1.231 3.311-2.727 3.311-1.664 0-2.371-2.225-2.983-4.076-.339-1.024-.425-1.491-.722-1.491-.275 0-.35.42-.696 1.436-.636 1.872-1.341 4.132-3.009 4.132-1.646 0-2.399-2.223-2.809-3.551-.605-1.965-.712-2.436-1.811-2.436h-1.639c-.11.652-.18 1.317-.18 2 0 6.627 5.373 12 12 12 5.223 0 9.653-3.342 11.303-8h-1.149z" />
							</svg>
							<span className="ml-1 text-xl">flow</span>
						</div>
					</Link>
				</li>
				<li
					className={`flex items-center ${
						location.pathname === "/dashboard" || location.pathname === "/"
							? "bg-secondary"
							: ""
					}`}
				>
					<Link className="no-underline bg-transparent py-2" to="/dashboard">
						<div className="flex items-center w-28">
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
								<path
									d="m11.6 11c0-.552-.448-1-1-1-1.655 0-4.945 0-6.6 0-.552 0-1 .448-1 1v9c0 .552.448 1 1 1h6.6c.552 0 1-.448 1-1 0-2.092 0-6.908 0-9zm9.4 6c0-.552-.448-1-1-1h-6c-.538 0-1 .477-1 1v3c0 .552.448 1 1 1h6c.552 0 1-.448 1-1zm-1.5.5v2h-5v-2zm-9.4-6v8h-5.6v-8zm10.9-7.5c0-.552-.448-1-1-1-1.537 0-4.463 0-6 0-.552 0-1 .448-1 1v9.6c0 .552.448 1 1 1h6c.552 0 1-.448 1-1 0-2.194 0-7.406 0-9.6zm-1.5.5v8.6h-5v-8.6zm-7.9-.5c0-.552-.448-1-1-1-1.655 0-4.945 0-6.6 0-.552 0-1 .448-1 1v3.6c0 .552.448 1 1 1h6.6c.552 0 1-.448 1-1 0-1.017 0-2.583 0-3.6zm-1.5.5v2.6h-5.6v-2.6z"
									fillRule="nonzero"
								/>
							</svg>
							<span className="ml-3">Dashboard</span>
						</div>
					</Link>
				</li>
				<li
					className={`flex items-center ${
						location.pathname === "/view-inventory" ? "bg-secondary" : ""
					}`}
				>
					<Link
						className="no-underline bg-transparent py-2"
						to="/view-inventory"
					>
						<div className="flex items-center w-28">
							<svg
								clipRule="evenodd"
								fillRule="evenodd"
								width="24"
								height="24"
								fill="currentColor"
								strokeLinejoin="round"
								strokeMiterlimit="2"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="m11.998 5c-4.078 0-7.742 3.093-9.853 6.483-.096.159-.145.338-.145.517s.048.358.144.517c2.112 3.39 5.776 6.483 9.854 6.483 4.143 0 7.796-3.09 9.864-6.493.092-.156.138-.332.138-.507s-.046-.351-.138-.507c-2.068-3.403-5.721-6.493-9.864-6.493zm.002 3c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4zm0 1.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5z"
									fillRule="nonzero"
								/>
							</svg>
							<span className="ml-3">
								View <br /> Inventory
							</span>
						</div>
					</Link>
				</li>
				<li
					className={`flex items-center ${
						location.pathname === "/count-inventory" ? "bg-secondary" : ""
					}`}
				>
					<Link
						className="no-underline bg-transparent py-2"
						to="/count-inventory"
					>
						<div className="flex items-center w-28">
							<svg
								width="24"
								height="24"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M21 2v20h-18v-20h18zm2-2h-22v24h22v-24zm-3 3h-16v5h16v-5zm-13 7h-3v3h3v-3zm4 0h-3v3h3v-3zm4 0h-3v3h3v-3zm5 0h-3v3h3v-3zm-13 4h-3v3h3v-3zm4 0h-3v3h3v-3zm4 0h-3v3h3v-3zm5 0h-3v7h3v-7zm-13 4h-3v3h3v-3zm4 0h-3v3h3v-3zm4 0h-3v3h3v-3z" />
							</svg>
							<span className="ml-3">
								Count <br /> Inventory
							</span>
						</div>
					</Link>
				</li>
				<li
					className={`flex items-center ${
						location.pathname === "/receive-inventory" ? "bg-secondary" : ""
					}`}
				>
					<Link
						className="no-underline bg-transparent py-2"
						to="receive-inventory"
					>
						<div className="flex items-center w-28">
							<svg
								width="24"
								height="24"
								xmlns="http://www.w3.org/2000/svg"
								fillRule="evenodd"
								clipRule="evenodd"
								fill="currentColor"
							>
								<path d="M13.403 24h-13.403v-22h3c1.231 0 2.181-1.084 3-2h8c.821.916 1.772 2 3 2h3v9.15c-.485-.098-.987-.15-1.5-.15l-.5.016v-7.016h-4l-2 2h-3.897l-2.103-2h-4v18h9.866c.397.751.919 1.427 1.537 2zm5.097-11c3.035 0 5.5 2.464 5.5 5.5s-2.465 5.5-5.5 5.5c-3.036 0-5.5-2.464-5.5-5.5s2.464-5.5 5.5-5.5zm0 2c1.931 0 3.5 1.568 3.5 3.5s-1.569 3.5-3.5 3.5c-1.932 0-3.5-1.568-3.5-3.5s1.568-3.5 3.5-3.5zm2.5 4h-3v-3h1v2h2v1zm-15.151-4.052l-1.049-.984-.8.823 1.864 1.776 3.136-3.192-.815-.808-2.336 2.385zm6.151 1.052h-2v-1h2v1zm2-2h-4v-1h4v1zm-8.151-4.025l-1.049-.983-.8.823 1.864 1.776 3.136-3.192-.815-.808-2.336 2.384zm8.151 1.025h-4v-1h4v1zm0-2h-4v-1h4v1zm-5-6c0 .552.449 1 1 1 .553 0 1-.448 1-1s-.447-1-1-1c-.551 0-1 .448-1 1z" />
							</svg>
							<span className="ml-3">
								Receive <br /> Inventory
							</span>
						</div>
					</Link>
				</li>
				<li className="absolute left-0 bottom-0 w-full flex items-center">
					<button className="bg-base-200" onClick={logout}>
						<div className="flex items-center w-28">
							<svg
								width="24"
								height="24"
								xmlns="http://www.w3.org/2000/svg"
								fillRule="evenodd"
								clipRule="evenodd"
								fill="currentColor"
							>
								<path d="M16 2v7h-2v-5h-12v16h12v-5h2v7h-16v-20h16zm2 9v-4l6 5-6 5v-4h-10v-2h10z" />
							</svg>
							<span className="ml-3">Logout</span>
						</div>
					</button>
				</li>
			</ul>
		</aside>
	);
};

export default AsideMenu;
