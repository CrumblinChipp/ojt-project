export interface RegisterRequest {
    email: string;
    name: string;
    organization: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    organization: string;
    is_admin: boolean;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}