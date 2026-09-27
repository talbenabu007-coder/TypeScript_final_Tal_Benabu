export interface AdminLoginInput {
    username: string;
    password: string;
}

export interface AdminLoginResponse {
    token: string;
}