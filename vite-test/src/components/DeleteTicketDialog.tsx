import { useState } from "react";
import { AlertDialog } from "radix-ui";
import type { Ticket } from "../types/ticket";
import { deleteTicket } from "../services/ticketsApi";
import ErrorMessage from "./ErrorMessage";

interface DeleteTicketDialogProps {
    ticket: Ticket;
    onTicketDeleted: (id: string) => void;
}

export default function DeleteTicketDialog({ ticket, onTicketDeleted }: DeleteTicketDialogProps) {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        const token = localStorage.getItem("adminToken");

        if (token === null) {
            setError("Unauthorized");
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await deleteTicket(ticket.id, token);
            onTicketDeleted(ticket.id);
        } catch {
            setError("Failed to delete ticket");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger className="rounded-lg border border-red-300 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
                Delete
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />

                <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                    <AlertDialog.Title className="text-lg font-semibold text-slate-900">
                        Delete Ticket
                    </AlertDialog.Title>

                    <AlertDialog.Description className="mt-2 text-slate-600">
                        Are you sure you want to delete {ticket.title}?
                    </AlertDialog.Description>

                    {error !== null && <ErrorMessage message={error} />}

                    <div className="mt-6 flex justify-end gap-3">
                        <AlertDialog.Cancel className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            Cancel
                        </AlertDialog.Cancel>

                        <AlertDialog.Action
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}