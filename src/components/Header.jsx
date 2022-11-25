import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Header = () => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const { logout } = useAuth();
	return (
		<header className="navbar bg-base-200 text-primary md:hidden fixed top-0 z-50 h-12">
			<div className="navbar-start">
				<div
					className="dropdown"
					onClick={() => setDropdownVisible((ps) => !ps)}
				>
					<label tabIndex={0} className="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</label>

					<ul
						tabIndex={0}
						className={`dropdown-content menu p-2 shadow bg-secondary text-white rounded-box w-52 ${
							!dropdownVisible ? "hidden" : ""
						}`}
					>
						<li>
							<Link className="no-underline" to="/dashboard">
								Dashboard
							</Link>
						</li>
						<li>
							<Link className="no-underline" to="/view-inventory">
								View Inventory
							</Link>
						</li>
						<li>
							<Link className="no-underline" to="/count-inventory">
								Count Inventory
							</Link>
						</li>
						<li>
							<Link className="no-underline" to="receive-inventory">
								Receive Inventory
							</Link>
						</li>
						<li>
							<button onClick={logout}>Logout</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="navbar-center">
				<Link to="/" className="btn btn-ghost normal-case text-xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M.696 8c1.649-4.66 6.08-8 11.304-8 6.627 0 12 5.373 12 12 0 .683-.07 1.348-.18 2h-1.523c-1.137 0-1.316-.507-1.932-2.461-.445-1.414-1.184-3.551-2.811-3.551-1.656 0-2.297 2.215-2.893 4.006-.325.973-.521 1.561-.812 1.561-.279 0-.411-.588-.74-1.563-.616-1.822-1.319-4.003-2.965-4.003-1.705 0-2.436 2.387-2.925 3.908-.354 1.105-.466 1.659-.78 1.659-.267 0-.352-.449-.66-1.344-.701-2.041-.925-4.212-4.06-4.212h-1.023zm21.458 8c-2.297 0-2.845-1.101-3.703-3.563-.531-1.528-.588-2.074-.896-2.074-.301 0-.387.627-.979 2.312-.519 1.475-1.231 3.311-2.727 3.311-1.664 0-2.371-2.225-2.983-4.076-.339-1.024-.425-1.491-.722-1.491-.275 0-.35.42-.696 1.436-.636 1.872-1.341 4.132-3.009 4.132-1.646 0-2.399-2.223-2.809-3.551-.605-1.965-.712-2.436-1.811-2.436h-1.639c-.11.652-.18 1.317-.18 2 0 6.627 5.373 12 12 12 5.223 0 9.653-3.342 11.303-8h-1.149z" />
					</svg>
					<span className="ml-1">flow</span>
				</Link>
			</div>
			<div className="navbar-end"></div>
		</header>
	);
};

export default Header;
