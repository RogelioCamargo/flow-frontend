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
	const ticketsSortedByCreatedAt = tickets.sort((a, b) =>
		a.createdAt > b.createdAt ? -1 : 1
	);

	const ticketResults =
		search === ""
			? ticketsSortedByCreatedAt
			: ticketsSortedByCreatedAt.filter((ticket) =>
					ticket.trackingNumber.includes(search.trim())
			  );

	return (
		<div className="prose md:max-w-lg lg:max-w-4xl mx-auto">
			<h2 className="text-center mt-10">Tickets</h2>
			<div className="px-1 md:px-0 grid grid-cols-4 gap-2 mb-5">
				<div className="col-span-3">
					<Input
						placeholder="Search Tracking Number"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</div>
				<CreateTicketModal />
			</div>
			<TicketList tickets={ticketResults} />
		</div>
	);
}

function TicketList({ tickets }) {
	if (tickets.length === 0) {
		return <div className="text-center">No tickets.</div>;
	}

	return (
		<div className="overflow-x-auto">
			<div className="w-full">
				{/* Header */}
				<ul
					className="list-none mx-0 my-2 py-1 grid grid-cols-2 font-bold bg-base-300 border-b border-gray-500"
					style={{ minWidth: "750px" }}
				>
					<li>Tracking Number</li>
					<li>Notes</li>
				</ul>
				{/* Tickets */}
				<div>
					{tickets.map((ticket, index) => (
						<Link className="no-underline" to={`/tickets/${ticket._id}`}>
							<ul
								key={ticket._id}
								className={`mx-0 my-3 list-none grid grid-cols-2 grid-col text-sm min-w-full font-normal ${
									index % 2 !== 0 ? "bg-base-300" : ""
								}`}
								style={{ minWidth: "750px" }}
							>
								<li>
									<div className="font-bold">{ticket.trackingNumber}</div>
									<div className="opacity-50 mt-1">
										{formatDateWithTime(ticket.createdAt)}
									</div>
								</li>

								<li className="two-lines pr-3">
									{ticket.notes === "" ? "--" : ticket.notes}
								</li>
							</ul>
						</Link>
					))}
				</div>
			</div>
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
					<Input
						label="Tracking Number"
						value={newTicket.trackingNumber}
						onChange={(event) =>
							setNewTicket({
								...newTicket,
								trackingNumber: event.target.value,
							})
						}
						ref={trackingInputRef}
						required
					/>
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
