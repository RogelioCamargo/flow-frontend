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
import Input from "../components/Form/Input";
import { formatDateWithTime } from "../utils/formatter";
import { Link } from "react-router-dom";
import useFocusInput from "../hooks/useFocusInput";
import { EmptyList, HeaderListItem, List, ListItem } from "../components/List";
import TextArea from "../components/Form/TextArea";

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
			<TicketList tickets={ticketResults} />
		</div>
	);
}

function TicketList({ tickets }) {
	if (tickets.length === 0) {
		return <EmptyList message="No tickets to display" />;
	}

	return (
		<List>
			<HeaderListItem className="grid-cols-2" style={{ minWidth: "700px" }}>
				<div>Tracking Number</div>
				<div>Notes</div>
			</HeaderListItem>
			{tickets.map((ticket, index) => (
				<ListItem
					className="grid-cols-2"
					key={ticket._id}
					index={index}
					style={{ minWidth: "700px" }}
				>
					<Link className="no-underline" to={`/tickets/${ticket._id}`}>
						<div className="font-bold">{ticket.trackingNumber}</div>
						<div className="opacity-50">
							{formatDateWithTime(ticket.createdAt)}
						</div>
					</Link>
					<div className="two-lines pr-3">
						{ticket.notes === "" ? "--" : ticket.notes}
					</div>
				</ListItem>
			))}
		</List>
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
				<button className="btn btn-primary">
					+<span className="ml-1 hidden md:block">Ticket</span>
				</button>
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
					<TextArea
						label="Notes"
						value={newTicket.notes}
						onChange={(event) =>
							setNewTicket({
								...newTicket,
								notes: event.target.value,
							})
						}
					/>
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
