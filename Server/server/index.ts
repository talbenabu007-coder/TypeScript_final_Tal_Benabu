import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../db/index";
import { createTicket, deleteTicket, getTicketById, getTickets, updateTicket, getAdminByUsername, createAdminIfNotExists } from "../db/actions";
import { Category, CreateTicketInput, Priority, Ticket, UpdateTicketInput, Status } from "../type/ticket";
import { ApiResponse } from "../type/api";
import { AdminLoginInput, AdminLoginResponse } from "../type/admin";


const app = express();
const PORT = 3000;
const jwtSecret: string = process.env.JWT_SECRET ?? "";

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
}

const adminUsername: string = process.env.ADMIN_USERNAME ?? "";
const adminPassword: string = process.env.ADMIN_PASSWORD ?? "";

if (!adminUsername || !adminPassword) {
    throw new Error("Admin credentials are not defined");
}

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3005"] }));
app.use(express.json());

interface TicketIdParams {

    id: string;
}

function isFilledString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isCategory(value: unknown): value is Category {
    return value === "Hardware" || value === "Software" || value === "Network" || value === "Account" || value === "Other";
}

function isPriority(value: unknown): value is Priority {
    return value === "Low" || value === "Medium" || value === "High";
}

function isStatus(value: unknown): value is Status {
    return value === "Open" || value === "In Progress" || value === "Resolved";
}

function parseCreateTicketInput(body: unknown): CreateTicketInput | null {
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const { customerName, email, phone, title, description, category, priority } = body as Record<string, unknown>;

    if (!isFilledString(customerName) || !isFilledString(email) || !isFilledString(phone) || !isFilledString(title) || !isFilledString(description)) {
        return null;
    }
    if (!email.includes("@") || !email.includes(".")) {
        return null;
    }

    if (phone.trim().length < 7 || !/[0-9]/.test(phone)) {
        return null;
    }

    if (title.trim().length < 2) {
        return null;
    }

    if (description.trim().length < 5) {
        return null;
    }

    if (!isCategory(category) || !isPriority(priority)) {
        return null;
    }

    return { customerName, email, phone, title, description, category, priority };
}

function parseUpdateTicketInput(body: unknown): UpdateTicketInput | null {
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const { status, priority } = body as Record<string, unknown>;

    if (status === undefined && priority === undefined) {
        return null;
    }

    if (status !== undefined && !isStatus(status)) {
        return null;
    }

    if (priority !== undefined && !isPriority(priority)) {
        return null;
    }

    return { status, priority };
}

function parseAdminLoginInput(body: unknown): AdminLoginInput | null {
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const { username, password } = body as Record<string, unknown>;

    if (!isFilledString(username) || !isFilledString(password)) {
        return null;
    }

    return { username, password };
}

function requireAdmin<P>(req: Request<P>, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
    }
    const token = authHeader.substring(7);

    try {
        jwt.verify(token, jwtSecret);
        next();
    } catch {
        res.status(401).json({ success: false, error: "Unauthorized" });
    }
}

app.post("/tickets", async (req: Request, res: Response<ApiResponse<Ticket>>) => {
    const input = parseCreateTicketInput(req.body);

    if (input === null) {
        res.status(400).json({ success: false, error: "Invalid ticket data" });
        return;
    }

    try {
        const ticket = await createTicket(input);
        res.status(201).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to create ticket" });
    }
});

app.get("/tickets", requireAdmin, async (_req: Request, res: Response<ApiResponse<Ticket[]>>) => {
    try {
        const tickets = await getTickets();
        res.status(200).json({ success: true, data: tickets });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load tickets" });
    }
});

app.get("/tickets/export/csv", requireAdmin, async (_req: Request, res: Response) => {
    try {
        const tickets = await getTickets();

        const headers = "Ticket ID,Title,Customer Name,Email,Phone,Category,Priority,Status,Description,Created At,Updated At";

        const rows = tickets.map((ticket) => {
            return `${ticket.id},${ticket.title},${ticket.customerName},${ticket.email},${ticket.phone},${ticket.category},${ticket.priority},${ticket.status},${ticket.description},${ticket.createdAt},${ticket.updatedAt}`;
        });

        const csv = [headers, ...rows].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=tickets.csv");
        res.status(200).send(csv);
    } catch {
        res.status(500).json({
            success: false,
            error: "Failed to export tickets"
        });
    }
});

app.get("/tickets/:id", requireAdmin, async (req: Request<TicketIdParams>, res: Response<ApiResponse<Ticket>>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }
    try {
        const ticket = await getTicketById(req.params.id);

        if (ticket === null) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to load ticket" });
    }
});

app.delete("/tickets/:id", requireAdmin, async (req: Request<TicketIdParams>, res: Response<ApiResponse<TicketIdParams>>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }
    try {
        const isDeleted = await deleteTicket(req.params.id);

        if (!isDeleted) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: { id: req.params.id } });
    } catch {
        res.status(500).json({ success: false, error: "Failed to delete ticket" });
    }
});

app.patch("/tickets/:id", requireAdmin, async (req: Request<TicketIdParams>, res: Response<ApiResponse<Ticket>>) => {

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ success: false, error: "Invalid ticket id" });
        return;
    }
    const input = parseUpdateTicketInput(req.body);

    if (input === null) {
        res.status(400).json({ success: false, error: "Invalid update data" });
        return;
    }

    try {
        const ticket = await updateTicket(req.params.id, input);

        if (ticket === null) {
            res.status(404).json({ success: false, error: "Ticket not found" });
            return;
        }

        res.status(200).json({ success: true, data: ticket });
    } catch {
        res.status(500).json({ success: false, error: "Failed to update ticket" });
    }
});

app.post("/admin/login", async (req: Request, res: Response<ApiResponse<AdminLoginResponse>>) => {
    const input = parseAdminLoginInput(req.body);

    if (input === null) {
        res.status(400).json({ success: false, error: "Username and password are required" });
        return;
    }

    try {
        const admin = await getAdminByUsername(input.username);

        if (admin === null) {
            res.status(401).json({ success: false, error: "Invalid username or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(input.password, admin.passwordHash);

        if (!isPasswordValid) {
            res.status(401).json({ success: false, error: "Invalid username or password" });
            return;
        }

        const token = jwt.sign(
            { adminId: admin._id.toString(), username: admin.username },
            jwtSecret,
            { expiresIn: "1h" }
        );

        res.status(200).json({ success: true, data: { token } });

    } catch {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

async function start(): Promise<void> {
    await connectDB();
    await createAdminIfNotExists(adminUsername, adminPassword);
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

start().catch((error: unknown) => {
    console.log("Failed to start the server");
    console.log(error);
});
