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

export interface DeletePreview {
    product: Product;
    audit_log_count: number;
    active_borrowing_count: number;
}

export interface AuditLog {
    id: number;
    user_id: number;
    product_id: number;
    recipient: string;
    organization: string;
    quantity: number;
    action: string;
    date: string;
    description: string;

    user: {
        id: number;
        name: string;
    };
}

export interface ActiveBorrowing {
    id: number;
    user_id: number;
    product_id: number;
    recipient: string;
    quantity: number;
    borrow_date: string;
    due_date: string;

    status: string;

    user: {
        id: number;
        name: string;
    };
}

export interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}