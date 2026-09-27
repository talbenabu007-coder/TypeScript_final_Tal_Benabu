import { useNavigate } from "react-router-dom";
import type { Ticket } from "../types/ticket";
import TicketForm from "../components/TicketForm";

export default function TicketFormPage() {
    const navigate = useNavigate();

    const handleTicketCreated = (ticket: Ticket) => {
        navigate("/confirmation", { state: { ticket } });
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto w-full max-w-2xl px-4">
                <TicketForm onTicketCreated={handleTicketCreated} />
            </div>
        </div>
    );
}