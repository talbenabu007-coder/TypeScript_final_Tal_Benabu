import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { AdminLoginInput } from "../types/admin";
import { loginAdmin } from "../services/adminApi";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const emptyForm: AdminLoginInput = {
    username: "",
    password: ""
};

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState<AdminLoginInput>(emptyForm);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name;
        const value = event.target.value;
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginAdmin(form);
            localStorage.setItem("adminToken", result.token);
            navigate("/admin/dashboard")
        } catch {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500";
    const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

    return (
        <div className="mx-auto mt-16 max-w-md px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>

                <label className={labelClass}>
                    Username
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </label>

                <label className={labelClass}>
                    Password
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className={inputClass}
                        required
                    />
                </label>

                {error !== null && <ErrorMessage message={error} />}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}