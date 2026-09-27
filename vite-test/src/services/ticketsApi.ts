import type { ApiResponse } from "../types/api";
import type { CreateTicketInput, Ticket, UpdateTicketInput } from "../types/ticket";

const API_URL: string = import.meta.env.VITE_API_URL;

async function sendRequest<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, options);
    const body: ApiResponse<T> = await response.json();

    if (!body.success) {
        throw new Error(body.error);
    }

    return body.data;
}

export async function createTicket(ticket: CreateTicketInput): Promise<Ticket> {
    return sendRequest<Ticket>("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket)
    });
}

export async function getTickets(token: string): Promise<Ticket[]> {
    return sendRequest<Ticket[]>("/tickets", {
        headers: { "Authorization": `Bearer ${token}` }
    });
}

export async function getTicketById(id: string, token: string): Promise<Ticket> {
    return sendRequest<Ticket>(`/tickets/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
}

export async function updateTicket(id: string, input: UpdateTicketInput, token: string): Promise<Ticket> {
    return sendRequest<Ticket>(`/tickets/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(input)
    });
}

export async function deleteTicket(id: string, token: string): Promise<void> {
    await sendRequest<{ id: string }>(`/tickets/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
}

export async function exportTicketsCsv(token: string): Promise<Blob> {
    const response = await fetch(`${API_URL}/tickets/export/csv`, {
        headers: {Authorization: `Bearer ${token}`}
    });

    if (!response.ok) {
        throw new Error("Failed to export tickets");
    }

    return response.blob();
}