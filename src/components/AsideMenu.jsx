import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { CountIcon, DashboardIcon, LogoIcon, LogoutIcon, ReceiveIcon, ViewIcon } from "../icons";

const items = [
	{
		name: "Dashboard",
		to: ["/", "/dashboard"],
		Logo: DashboardIcon,
	},
	{
		name: "View Inventory",
		to: "/view-inventory",
		Logo: ViewIcon,
	},
	{
		name: "Count Inventory",
		to: "/count-inventory",
		Logo: CountIcon,
	},
	{
		name: "Receive Inventory",
		to: "/receive-inventory",
		Logo: ReceiveIcon,
	},
];

const AsideMenuItem = ({ name, to, Logo }) => {
	const location = useLocation();

	let isCurrentMenuItem;
	let linkTo;
	if (Array.isArray(to)) {
		isCurrentMenuItem = to.includes(location.pathname);
		linkTo = to[1];
	} else {
		isCurrentMenuItem = location.pathname === to;
		linkTo = to;
	}

	return (
		<li
			className={`flex items-center ${isCurrentMenuItem ? "bg-secondary" : ""}`}
		>
			<Link className="no-underline bg-transparent py-2" to={linkTo}>
				<div className="flex items-center w-28">
					<Logo />
					<span className="ml-3">
						{name.split(" ").map((word) => (
							<div key={word}>
								{word}
								<br />
							</div>
						))}
					</span>
				</div>
			</Link>
		</li>
	);
};

const AsideMenu = () => {
	const { logout } = useAuth();

	return (
		<aside className="hidden md:block fixed top-0 w-52 bg-base-200 prose-sm h-screen">
			<ul className="menu h-screen text-white font-bold p-0 relative">
				{/* Logo Button */}
				<li className="flex items-center">
					<Link to="/">
						<div className="flex items-center text-primary">
							<LogoIcon />
							<span className="ml-1 text-xl">flow</span>
						</div>
					</Link>
				</li>
				{/* Menu Buttons */}
				{items.map((item) => (
					<AsideMenuItem key={item.name} {...item} />
				))}
				{/* Logout Button */}
				<li className="absolute left-0 bottom-0 w-full flex items-center">
					<button className="bg-base-200" onClick={logout}>
						<div className="flex items-center w-28">
							<LogoutIcon />
							<span className="ml-3">Logout</span>
						</div>
					</button>
				</li>
			</ul>
		</aside>
	);
};

export default AsideMenu;
