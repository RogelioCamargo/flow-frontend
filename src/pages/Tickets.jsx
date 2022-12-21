import React, { useRef, useState, useCallback } from "react";
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
import { Link } from "react-router-dom";

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
		<div className="prose md:max-w-lg lg:max-w-4xl mx-auto">
			<h2 className="text-center mt-10">Tickets</h2>
			<div className="px-1 md:px-0 grid grid-cols-4 gap-2">
				<div className="col-span-3">
					<Input
						placeholder="Search Tracking Number"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>
				<CreateTicketModal />
			</div>
			{ticketResults.length === 0 ? (
				<div className="text-center mt-5">
					No results found. Try a different tracking number.
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
							<tr>
								<th>Tracking Number</th>
								<td>Timestamp</td>
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
											<th>
												<Link
													to={`/tickets/${ticket._id}`}
													className="no-underline"
												>
													{ticket.trackingNumber}
												</Link>
											</th>
											<td>{timestamp}</td>
											<td className="max-w-xs truncate">
												{ticket.notes === "" ? "--" : ticket.notes}
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>
				</div>
			)}
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
	const trackingInputRef = useRef();

	const createNewTicket = () => {
		createTicket(newTicket);

		resetNewTicket();
		toast.success("New Ticket Created", {
			position: "bottom-center",
			theme: "colored",
		});
	};

	const focusInput = useCallback(() => {
		trackingInputRef.current.focus();
	}, []);

	return (
		<Modal>
			<ModalOpenButton>
				<button className="btn btn-primary">+ Ticket</button>
			</ModalOpenButton>
			<ModalContent title="New Ticket" focusInput={focusInput}>
				<ModalDismissButton onClick={resetNewTicket} />
				<form>
					<div className="form-control w-full">
						<label className="label">
							<span className="label-text">Tracking Number</span>
						</label>
						<input
							type="text"
							className={`input input-bordered w-full`}
							value={newTicket.trackingNumber}
							ref={trackingInputRef}
							required
							onChange={(event) =>
								setNewTicket({
									...newTicket,
									trackingNumber: event.target.value,
								})
							}
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Notes</span>
						</label>
						<textarea
							className="textarea textarea-bordered h-24"
							value={newTicket.notes}
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
