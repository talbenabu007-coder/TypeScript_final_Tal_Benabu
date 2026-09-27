import { Collection, Db, MongoClient } from "mongodb";
import { TicketDocument } from "../type/ticket";
import { AdminDocument } from "../type/admin";
const uri = process.env.MONGODB_URI;

if(!uri) {
    throw new Error("MONGODB_URI is not defined")
}

const client = new MongoClient(uri);
const db: Db = client.db("help_desk");

export const ticketsCollection: Collection<TicketDocument> = db.collection<TicketDocument>("tickets");
export const adminsCollection: Collection<AdminDocument> = db.collection<AdminDocument>("admins");

export async function connectDB(): Promise<void> {
    await client.connect();
    console.log("Connected to MongoDB");
}

export async function closeDB(): Promise<void> {
    await client.close();
}
