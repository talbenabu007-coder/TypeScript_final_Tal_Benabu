import { Link, useLocation } from "react-router-dom";
import type { Ticket } from "../types/ticket";

interface ConfirmationState {
    ticket: Ticket;
}

export default function ConfirmationPage() {
    const location = useLocation();
    const state = location.state as ConfirmationState | null;

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Ticket Submitted
                </h1>

                <p className="mt-3 text-slate-600">
                    Your support ticket was submitted successfully.
                </p>

                {state !== null && (
                    <p className="mt-2 text-sm text-slate-500">
                        Ticket ID: {state.ticket.id}
                    </p>
                )}

                <Link to="/" className="mt-6 inline-block rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700">Open Another Ticket</Link>
            </div>
        </div>
    );
}