import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../types/ticket";
import { getTickets } from "../services/ticketsApi";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Dashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (token === null) {
            setError("Unauthorized");
            setIsLoading(false);
            return;
        }

        getTickets(token)
            .then((data) => setTickets(data))
            .catch(() => setError("Failed to load tickets"))
            .finally(() => setIsLoading(false));
    }, []);

    const openTickets = tickets.filter((ticket) => ticket.status === "Open").length;
    const inProgressTickets = tickets.filter((ticket) => ticket.status === "In Progress").length;
    const resolvedTickets = tickets.filter((ticket) => ticket.status === "Resolved").length;
    const highPriorityTickets = tickets.filter((ticket) => ticket.priority === "High").length;

    if (isLoading) {
        return <Loading text="Loading dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">                    <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

                    <button onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Logout</button>
                </div>
                {error !== null && <ErrorMessage message={error} />}

                {error === null && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Total Tickets</p>
                            <p className="text-3xl font-bold text-slate-900">{tickets.length}</p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Open</p>
                            <p className="text-3xl font-bold text-slate-900">{openTickets}</p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">In Progress</p>
                            <p className="text-3xl font-bold text-slate-900">{inProgressTickets}</p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Resolved</p>
                            <p className="text-3xl font-bold text-slate-900">{resolvedTickets}</p>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">High Priority</p>
                            <p className="text-3xl font-bold text-slate-900">{highPriorityTickets}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}