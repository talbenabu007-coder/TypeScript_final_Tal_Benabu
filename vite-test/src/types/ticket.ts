export type Category = "Hardware" | "Software" | "Network" | "Account" | "Other";
export type Priority = "Low" | "Medium" | "High";
export type Status = "Open" | "In Progress" | "Resolved";

export interface CreateTicketInput {
    customerName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: Category;
    priority: Priority;
}

export interface UpdateTicketInput {
    status?: Status;
    priority?: Priority;
}

export interface Ticket {
    id: string;
    customerName: string;
    email: string;
    phone: string;
    title: string;
    description: string;
    category: Category;
    priority: Priority;
    status: Status;
    createdAt: string;
    updatedAt: string;
}