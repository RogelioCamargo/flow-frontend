import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { HamburgerMenuIcon, LogoIcon } from "../icons";

const items = [
	{
		to: "/dashboard",
		name: "Dashboard",
	},
	{
		to: "/view-inventory",
		name: "View Inventory",
	},
	{
		to: "/count-inventory",
		name: "Count Inventory",
	},
	{
		to: "/receive-inventory",
		name: "Receive Inventory",
	},
	{
		to: "/tickets",
		name: "Tickets",
	},
];

const DropdownMenuItem = ({ to, name }) => {
	return (
		<li>
			<Link className="no-underline" to={to}>
				{name}
			</Link>
		</li>
	);
};

const DropdownMenu = () => {
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const { logout } = useAuth();

	return (
		<div
			className="dropdown"
			onClick={() => setDropdownVisible((previousState) => !previousState)}
		>
			<label tabIndex={0} className="btn btn-ghost btn-circle">
				<HamburgerMenuIcon />
			</label>
			<ul
				tabIndex={0}
				className={`dropdown-content menu p-2 shadow bg-secondary text-white rounded-box w-52 ${
					!dropdownVisible ? "hidden" : ""
				}`}
			>
				{items.map((item) => (
					<DropdownMenuItem key={item.name} name={item.name} to={item.to} />
				))}
				<li>
					<button onClick={logout}>Logout</button>
				</li>
			</ul>
		</div>
	);
};

const Header = () => {
	return (
		<header className="navbar bg-base-200 text-primary md:hidden fixed top-0 z-50 h-12">
			<div className="navbar-start">
				<DropdownMenu />
			</div>
			<div className="navbar-center">
				<Link to="/" className="btn btn-ghost normal-case text-xl">
					<LogoIcon />
					<span className="ml-1">flow</span>
				</Link>
			</div>
			<div className="navbar-end"></div>
		</header>
	);
};

export default Header;
