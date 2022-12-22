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
import { Link } from "react-router-dom";
import useFocusInput from "../hooks/useFocusInput";

function Tickets() {
	const [search, setSearch] = useState("");
	const tickets = useTickets();
	const ticketsSortedByCreatedDate = tickets.sort((a, b) =>
		a.createdAt > b.createdAt ? -1 : 1
	);

	const ticketResults =
		search === ""
			? ticketsSortedByCreatedDate
			: ticketsSortedByCreatedDate.filter((ticket) =>
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
		return <div className="text-center">No tickets to display.</div>;
	}

	return (
		<div className="overflow-x-auto">
			<div className="w-full">
				{/* Tickets */}
				<ul className="list-none p-0">
					<li
						className="px-5 h-14 items-center grid grid-cols-2 font-bold bg-base-300 border-b border-gray-500"
						style={{ minWidth: "750px" }}
					>
						<div>Tracking Number</div>
						<div>Notes</div>
					</li>
					{tickets.map((ticket, index) => (
						<li
							key={ticket._id}
							className={`px-5 ${index % 2 !== 0 ? "bg-base-300" : ""}`}
							style={{ minWidth: "750px" }}
						>
							<Link
								className="h-20 no-underline text-sm grid grid-cols-2 items-center"
								to={`/tickets/${ticket._id}`}
							>
								<div>
									<div className="font-bold">{ticket.trackingNumber}</div>
									<div className="opacity-50 mt-1">
										{formatDateWithTime(ticket.createdAt)}
									</div>
								</div>
								<div className="two-lines pr-3">
									{ticket.notes === "" ? "--" : ticket.notes}
								</div>
							</Link>
						</li>
					))}
				</ul>
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
	const [inputRef, focusOnInput] = useFocusInput();

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
				<button className="btn btn-primary">+ Ticket</button>
			</ModalOpenButton>
			<ModalContent title="New Ticket" focusOnInput={focusOnInput}>
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
						ref={inputRef}
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
