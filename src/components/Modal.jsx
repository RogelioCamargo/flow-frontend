import React, { createContext, useState, useContext } from "react";
import { CloseIcon } from "../icons";
import { useEffect } from "react";

const callAll =
	(...fns) =>
	(...args) =>
		fns.forEach((fn) => fn && fn(...args));

const ModalContext = createContext();

const Modal = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
};

const ModalDismissButton = ({ onClick }) => {
	const [, setIsOpen] = useContext(ModalContext);

	const closeModal = () => setIsOpen(false);
	const handleClick = onClick ? callAll(onClick, closeModal) : closeModal;

	return (
		<div className="absolute right-7">
			<button onClick={handleClick}>
				<CloseIcon />
			</button>
		</div>
	);
};

const ModalOpenButton = ({ children: child }) => {
	const [, setIsOpen] = useContext(ModalContext);

	return React.cloneElement(child, {
		onClick: callAll(() => setIsOpen(true), child.props.onClick),
	});
};

const ModalConfirmButton = ({ className, children, onClick }) => {
	const [, setIsOpen] = useContext(ModalContext);

	const closeModal = () => setIsOpen(false);
	const handleClick = onClick ? callAll(onClick, closeModal) : closeModal;

	return (
		<button
			className={`btn btn-primary btn-block mt-3 ${className}`}
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

const ModalContentsBase = ({ children, props, focusOnInput = null } = {}) => {
	const [isOpen] = useContext(ModalContext);

	useEffect(() => {
		if (isOpen && focusOnInput) {
			focusOnInput();
		}
	}, [isOpen, focusOnInput]);

	return (
		<div
			className={`fixed z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full ${
				isOpen ? "block" : "hidden"
			}`}
		>
			<div className="relative top-40 mx-auto max-w-sm">
				<div className="card w-96 bg-neutral text-neutral-content">
					<div className="card-body" {...props}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

const ModalContent = ({ title, children, ...props }) => {
	return (
		<ModalContentsBase {...props}>
			<h2 className="card-title font-bold my-2 justify-center">{title}</h2>
			{children}
		</ModalContentsBase>
	);
};

export {
	Modal,
	ModalConfirmButton,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
};
