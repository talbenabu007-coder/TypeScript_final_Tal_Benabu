import bcrypt from "bcrypt";
import { ObjectId, WithId } from "mongodb";
import { ticketsCollection, adminsCollection } from "./index";
import { CreateTicketInput, TicketDocument, Ticket, UpdateTicketInput } from "../type/ticket";
import { AdminDocument } from "../type/admin";

function toTicket(ticket: WithId<TicketDocument>): Ticket {
    return {
        id: ticket._id.toString(),
        customerName: ticket.customerName,
        email: ticket.email,
        phone: ticket.phone,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
    };
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
    const now = new Date();

    const result = await ticketsCollection.insertOne({
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: "Open",
        createdAt: now,
        updatedAt: now
    });

    if (!result.acknowledged) {
        throw new Error("Failed to create the ticket");
    }

    return {
        id: result.insertedId.toString(),
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: "Open",
        createdAt: now,
        updatedAt: now
    };
}

export async function getTickets(): Promise<Ticket[]> {
    const tickets = await ticketsCollection.find().toArray();
    return tickets.map(toTicket);
}

export async function getTicketById(id: string): Promise<Ticket | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }

    const ticket = await ticketsCollection.findOne({
        _id: new ObjectId(id)
    });

    if (ticket === null) {
        return null;
    }

    return toTicket(ticket);
}

export async function deleteTicket(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) {
        return false;
    }

    const result = await ticketsCollection.deleteOne({
        _id: new ObjectId(id)
    });

    return result.deletedCount === 1;
}

export async function updateTicket(id: string, input: UpdateTicketInput): Promise<Ticket | null> {

    if (!ObjectId.isValid(id)) {
        return null;
    }

    await ticketsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...input,
                updatedAt: new Date()
            }
        }
    );

    const updatedTicket = await ticketsCollection.findOne({
        _id: new ObjectId(id)
    });

    if (updatedTicket === null) {
        return null;
    }

    return toTicket(updatedTicket);
}

export async function getAdminByUsername(username: string): Promise<WithId<AdminDocument> | null> {
    return await adminsCollection.findOne({ username });
}

export async function createAdmin(username: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await adminsCollection.insertOne({
        username: username,
        passwordHash: passwordHash
    });

    if (!result.acknowledged) {
        throw new Error("Failed to create admin");
    }
}

export async function createAdminIfNotExists(username: string, password: string): Promise<void> {
    const existingAdmin = await getAdminByUsername(username);

    if (existingAdmin !== null) {
        return;
    }

    await createAdmin(username, password);
}


