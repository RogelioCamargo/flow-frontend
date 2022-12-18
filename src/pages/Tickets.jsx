import React, { useState } from "react";
import { useTickets, useCreateTicket } from "../hooks/tickets";
import { toast } from "react-toastify";
import {
	Modal,
	ModalConfirmButton,
	ModalContent,
	ModalDismissButton,
	ModalOpenButton,
} from "../components/Modal";
import Input from "../components/Input";
import { formatDateWithTime } from "../utils/formatter";

function Tickets() {
	const [search, setSearch] = useState("");
	const tickets = useTickets();

	const ticketResults =
		search === ""
			? tickets
			: tickets.filter((ticket) =>
					ticket.trackingNumber.includes(search.trim())
			  );
	return (
		<div className="prose md:max-w-lg lg:max-w-2xl mx-auto">
			<h2 className="text-center mt-10">Tickets</h2>
			<Input
				placeholder="Search"
				value={search}
				onChange={(event) => setSearch(event.target.value)}
			/>
			<div className="overflow-x-auto">
				<table className="table w-full">
					<thead>
						<tr>
							<th>Timestamp</th>
							<th>Tracking Number</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						{ticketResults
							.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
							.map((ticket) => {
								const timestamp = formatDateWithTime(ticket.createdAt);
								return (
									<tr key={ticket._id}>
										<td>{timestamp}</td>
										<td>{ticket.trackingNumber}</td>
										<td className="max-w-xs truncate">
											{ticket.notes === "" ? "--" : ticket.notes}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>

			<CreateTicketModal />
		</div>
	);
}

const initialNewTicketDetails = {
	trackingNumber: "",
	notes: "",
};

function CreateTicketModal() {
	const [newTicket, setNewTicket] = useState(initialNewTicketDetails);
	const { mutate: createTicket } = useCreateTicket();
	const isConfirmDisabled = newTicket.trackingNumber === "";
	const resetNewTicket = () => setNewTicket(initialNewTicketDetails);

	const createNewTicket = () => {
		createTicket(newTicket);

		resetNewTicket();
		toast.success("New Ticket Created", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	return (
		<Modal>
			<ModalOpenButton>
				<button className="btn btn-primary fixed bottom-5 right-5 text-3xl flex justify-center items-center text-white rounded-full w-12 h-12">
					+
				</button>
			</ModalOpenButton>
			<ModalContent title="New Ticket">
				<ModalDismissButton onClick={resetNewTicket} />
				<form>
					<Input
						label="Tracking Number"
						value={newTicket.trackingNumber}
						required
						onChange={(event) =>
							setNewTicket({
								...newTicket,
								trackingNumber: event.target.value,
							})
						}
					/>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Notes</span>
						</label>
						<textarea
							className="textarea textarea-bordered h-24"
							onChange={(event) =>
								setNewTicket({
									...newTicket,
									notes: event.target.value,
								})
							}
						></textarea>
					</div>
				</form>
				<ModalConfirmButton
					className={isConfirmDisabled ? "btn-disabled" : ""}
					onClick={createNewTicket}
				>
					Create
				</ModalConfirmButton>
			</ModalContent>
		</Modal>
	);
}

export default Tickets;
