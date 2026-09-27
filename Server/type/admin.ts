export interface AdminLoginInput {
    username: string;
    password: string;
}

export interface AdminDocument {
    username: string;
    passwordHash: string;
}

export interface AdminLoginResponse {
    token: string;
}