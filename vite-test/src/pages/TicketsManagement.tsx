import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import type { Ticket } from "../types/ticket";
import { getTickets, exportTicketsCsv } from "../services/ticketsApi";
import TicketList from "../components/TicketList";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function TicketsManagement() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");

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

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const filteredTickets = tickets.filter((ticket) => {
        const searchValue = search.toLowerCase();

        const matchesSearch = ticket.title.toLowerCase().includes(searchValue) ||
            ticket.customerName.toLowerCase().includes(searchValue) ||
            ticket.email.toLowerCase().includes(searchValue);

        const matchesStatus = statusFilter === "" || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === "" || ticket.priority === priorityFilter;
        const matchesCategory = categoryFilter === "" || ticket.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });

    const handleTicketDeleted = (id: string) => {
        setTickets((previous) => previous.filter((ticket) => ticket.id !== id));
    };

    const handleTicketUpdated = (updatedTicket: Ticket) => {
        setTickets((previous) =>
            previous.map((ticket) =>
                ticket.id === updatedTicket.id ? updatedTicket : ticket
            )
        );
    };

    const handleExport = async () => {
        const token = localStorage.getItem("adminToken");

        if (token === null) {
            setError("Unauthorized");
            return;
        }

        try {
            const file = await exportTicketsCsv(token);
            const url = URL.createObjectURL(file);

            const link = document.createElement("a");
            link.href = url;
            link.download = "tickets.csv";
            link.click();

            URL.revokeObjectURL(url);
        } catch {
            setError("Failed to export tickets");
        }
    };

    if (isLoading) {
        return <Loading text="Loading tickets..." />;
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">                    <h1 className="text-3xl font-bold text-slate-900">Tickets Management</h1>

                    <button onClick={handleExport} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Export CSV</button>
                </div>
                {error !== null && <ErrorMessage message={error} />}

                {error === null && (
                    <>
                        <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
                            <input value={search} onChange={handleSearch} placeholder="Search title, customer or email" className="rounded-lg border border-slate-300 px-3 py-2" />

                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                                <option value="">All Statuses</option>


                                <option value="Open">Open</option>

                                <option value="In Progress">In Progress</option>


                                <option value="Resolved">Resolved</option>
                            </select>

                            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                                <option value="">All Priorities</option>

                                <option value="Low">Low</option>

                                <option value="Medium">Medium</option>

                                <option value="High">High</option>
                            </select>

                            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
                                <option value="">All Categories</option>

                                <option value="Hardware">Hardware</option>


                                <option value="Software">Software</option>

                                <option value="Network">Network</option>

                                <option value="Account">Account</option>


                                <option value="Other">Other</option>
                            </select>
                        </div>
                        {tickets.length === 0 ? (<div className="rounded-xl bg-white p-6 text-center text-slate-500">No support tickets were found</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="rounded-xl bg-white p-6 text-center text-slate-500">No matching tickets found</div>
                        ) : (
                            <TicketList tickets={filteredTickets} onTicketDeleted={handleTicketDeleted} onTicketUpdated={handleTicketUpdated} />
                        )}                    </>
                )}
            </div>
        </div>
    );
}