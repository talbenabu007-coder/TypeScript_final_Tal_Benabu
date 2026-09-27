import { useState } from "react";
import { Dialog } from "radix-ui";
import type { ChangeEvent } from "react";
import type { Priority, Status, Ticket } from "../types/ticket";
import { getTicketById, updateTicket } from "../services/ticketsApi";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

interface TicketDetailsDialogProps {
    ticketId: string;
    onTicketUpdated: (ticket: Ticket) => void;
}

export default function TicketDetailsDialog({ ticketId, onTicketUpdated }: TicketDetailsDialogProps) {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadTicket = async () => {
        const token = localStorage.getItem("adminToken");

        if (token === null) {
            setError("Unauthorized");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await getTicketById(ticketId, token);
            setTicket(data);
        } catch {
            setError("Failed to load ticket");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            void loadTicket();
        } else {
            setTicket(null);
            setError(null);
        }
    };

    const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (ticket === null) {
            return;
        }

        setTicket({
            ...ticket,
            status: event.target.value as Status
        });
    };

    const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (ticket === null) {
            return;
        }

        setTicket({
            ...ticket,
            priority: event.target.value as Priority
        });
    };

    const handleUpdate = async () => {
        if (ticket === null) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (token === null) {
            setError("Unauthorized");
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            const updatedTicket = await updateTicket(
                ticket.id,
                {
                    status: ticket.status,
                    priority: ticket.priority
                },
                token
            );

            setTicket(updatedTicket);
            onTicketUpdated(updatedTicket);
        } catch {
            setError("Failed to update ticket");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog.Root onOpenChange={handleOpenChange}>
            <Dialog.Trigger className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                View
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />

                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                        Ticket Details
                    </Dialog.Title>

                    <Dialog.Description className="mb-4 text-sm text-slate-500">
                        Loaded from the server by id
                    </Dialog.Description>

                    {isLoading && <Loading text="Loading ticket..." />}
                    {error !== null && <ErrorMessage message={error} />}

                    {ticket !== null && (
                        <div className="flex flex-col gap-3">
                            <p className="text-lg font-semibold text-slate-900">
                                {ticket.title}
                            </p>

                            <div>
                                <p className="text-sm text-slate-500">Customer</p>
                                <p className="text-slate-900">{ticket.customerName}</p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="text-slate-900">{ticket.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Phone</p>
                                <p className="text-slate-900">{ticket.phone}</p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Description</p>
                                <p className="text-slate-900">{ticket.description}</p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Category</p>
                                <p className="text-slate-900">{ticket.category}</p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Priority</p>

                                <select
                                    value={ticket.priority}
                                    onChange={handlePriorityChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Status</p>

                                <select
                                    value={ticket.status}
                                    onChange={handleStatusChange}
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        {ticket !== null && (
                            <button
                                onClick={handleUpdate}
                                disabled={isUpdating}
                                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
                            >
                                {isUpdating ? "Updating..." : "Update"}
                            </button>
                        )}

                        <Dialog.Close className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
                            Close
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}