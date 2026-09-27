import type { ApiResponse } from "../types/api";
import type { AdminLoginInput, AdminLoginResponse } from "../types/admin";

const API_URL: string = import.meta.env.VITE_API_URL;

export async function loginAdmin(input: AdminLoginInput): Promise<AdminLoginResponse> {
    const response = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    const body: ApiResponse<AdminLoginResponse> = await response.json();

    if (!body.success) {
        throw new Error(body.error);
    }

    return body.data;
}