import React from "react";
import { useRemoveTicket, useTicket, useUpdateTicket } from "../hooks/tickets";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import {
	Modal,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import { toast } from "react-toastify";

function Ticket() {
	const { ticketId } = useParams();
	const navigate = useNavigate();
	const {
		data: ticket,
		isSuccess,
		isError,
		isLoading,
		error,
	} = useTicket(ticketId);
	const { mutate: updateTicket } = useUpdateTicket();
	const { mutate: removeTicket } = useRemoveTicket();

	const updateTicketDetails = (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const updates = { _id: ticket._id };
		for (const [name, value] of formData) {
			updates[name] = value;
		}

		updateTicket(updates);
		toast.success("Changes Saved", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const removeTicketPermanently = () => {
		removeTicket(ticket._id);
		toast.success("Product Removed", {
			position: "bottom-center",
			theme: "colored",
		});
		navigate("/tickets");
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (isSuccess) {
		return (
			<div className="prose w-5/6 md:w-4/6 lg:w-5/6 mx-auto">
				<h2 className="text-center mt-10 mb-0">Edit Ticket</h2>
				<form onSubmit={updateTicketDetails}>
					<Input
						label="Tracking Number"
						defaultValue={ticket.trackingNumber}
						name="trackingNumber"
						required
					/>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Notes</span>
						</label>
						<textarea
							className="textarea textarea-bordered h-24"
							defaultValue={ticket.notes}
							name="notes"
						></textarea>
					</div>
					<button type="submit" className="btn btn-primary w-48 mt-5">
						Save Changes
					</button>
				</form>

				<p className="mt-12 mb-3">Would you like to delete this product?</p>
				<Modal>
					<ModalOpenButton>
						<button className="btn btn-error w-48">Remove Product</button>
					</ModalOpenButton>
					<ModalContent title="Confirm">
						<ModalDismissButton />
						<p className="mt-0">Are you sure you want to delete this ticket?</p>
						<button
							className="btn btn-error btn-block"
							onClick={removeTicketPermanently}
						>
							Remove
						</button>
					</ModalContent>
				</Modal>
			</div>
		);
	}
}

export default Ticket;
