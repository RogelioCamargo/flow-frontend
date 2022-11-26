import React, { createContext, useState, useContext } from "react";

const callAll =
	(...fns) =>
	(...args) =>
		fns.forEach((fn) => fn && fn(...args));

const ModalContext = createContext();

const Modal = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />;
};

const ModalDismissButton = ({ onClick: secondaryOnClick }) => {
	const [, setIsOpen] = useContext(ModalContext);

	const closeModal = () => setIsOpen(false);
	const onClick = secondaryOnClick
		? callAll(closeModal, secondaryOnClick)
		: closeModal;

	return (
		<div className="absolute right-7">
			<button onClick={onClick}>
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
	);
};

const ModalOpenButton = ({ children: child }) => {
	const [, setIsOpen] = useContext(ModalContext);

	return React.cloneElement(child, {
		onClick: callAll(() => setIsOpen(true), child.props.onClick),
	});
};

const ModalContentsBase = ({ children, props }) => {
	const [isOpen] = useContext(ModalContext);

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

export { Modal, ModalContent, ModalDismissButton, ModalOpenButton };
