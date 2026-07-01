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

export interface Product {
    id: number;
    name: string;
    is_consumable: boolean;
    sub_category: string;
    max_stock: number;
    current_stock: number;
    status: string;
    description: string;
    created_at: string;
}

export interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}