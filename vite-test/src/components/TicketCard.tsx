import type { Ticket } from "../types/ticket";
import TicketDetailsDialog from "./TicketDetailDialog";
import DeleteTicketDialog from "./DeleteTicketDialog";

interface TicketCardProps {
    ticket: Ticket;
    onTicketDeleted: (id: string) => void;
    onTicketUpdated: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, onTicketDeleted, onTicketUpdated }: TicketCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
                <p className="text-sm text-slate-500">Customer: {ticket.customerName}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                <p>Category: {ticket.category}</p>
                <p>Priority: {ticket.priority}</p>
                <p>Status: {ticket.status}</p>
                <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="mt-auto flex flex-col gap-2 sm:flex-row">                <TicketDetailsDialog ticketId={ticket.id} onTicketUpdated={onTicketUpdated} />
                <DeleteTicketDialog ticket={ticket} onTicketDeleted={onTicketDeleted} />
            </div>
        </div>
    );
}