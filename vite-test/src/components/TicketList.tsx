import type { Ticket } from "../types/ticket";
import TicketCard from "./TicketCard";

interface TicketListProps {
    tickets: Ticket[];
    onTicketDeleted: (id: string) => void;
    onTicketUpdated: (ticket: Ticket) => void;
}

export default function TicketList({ tickets, onTicketDeleted, onTicketUpdated }: TicketListProps) {
    if (tickets.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No tickets found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} onTicketDeleted={onTicketDeleted} onTicketUpdated={onTicketUpdated} />
            ))}
        </div>
    );
}