import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CreateTicketInput, Ticket } from "../types/ticket";
import { createTicket } from "../services/ticketsApi";
import ErrorMessage from "./ErrorMessage";

interface TicketFormProps {
    onTicketCreated: (ticket: Ticket) => void;
}

const emptyForm: CreateTicketInput = {
    customerName: "",
    email: "",
    phone: "",
    title: "",
    description: "",
    category: "Hardware",
    priority: "Low"
};

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
    const [form, setForm] = useState<CreateTicketInput>(emptyForm);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const field = event.target.name;
        const value = event.target.value;

        setForm((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (form.customerName.trim() === "" || form.email.trim() === "" || form.phone.trim() === "" || form.title.trim() === "" || form.description.trim() === "") {
            setError("Please fill in all fields");
            return;
        }

        if (!form.email.includes("@") || !form.email.includes(".")) {
            setError("Please enter a valid email");
            return;
        }

        if (form.phone.trim().length < 7 || !/[0-9]/.test(form.phone)) {
            setError("Please enter a valid phone number");
            return;
        }

        if (form.title.trim().length < 2) {
            setError("Please enter a valid title");
            return;
        }

        if (form.description.trim().length < 5) {
            setError("Please enter a valid description");
            return;
        }

        setIsSaving(true);

        try {
            const ticket = await createTicket(form);
            onTicketCreated(ticket);
            setForm(emptyForm);
        } catch {
            setError("Failed to create ticket");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500";
    const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">Open Support Ticket</h1>

            <label className={labelClass}>Full Name <input name="customerName" value={form.customerName} onChange={handleChange} className={inputClass} /></label>

            <label className={labelClass}>Email <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} /></label>

            <label className={labelClass}>Phone <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} /></label>

            <label className={labelClass}>Title <input name="title" value={form.title} onChange={handleChange} className={inputClass} /></label>

            <label className={labelClass}>Description <textarea name="description" value={form.description} onChange={handleChange} className={inputClass} rows={5} /></label>

            <label className={labelClass}>Category<select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Other">Other</option>
            </select>
            </label>

            <label className={labelClass}>Priority <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select></label>

            {error !== null && <ErrorMessage message={error} />}

            <button
                type="submit"
                disabled={isSaving}
                className="self-start rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
            >
                {isSaving ? "Submitting..." : "Submit Ticket"}
            </button>
        </form>
    );
}