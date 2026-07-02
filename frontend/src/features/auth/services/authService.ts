import api from "../../../lib/api.ts";

import type {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    User,
} from "../types";

export async function register(
    data: RegisterRequest
): Promise<User> {

    const response = await api.post(
        "/auth/register",
        data
    );

    return response.data;
}

export async function login(
    data: LoginRequest
): Promise<LoginResponse> {

    const form = new URLSearchParams();

    form.append("username", data.email);

    form.append("password", data.password);

    const response = await api.post(
        "/auth/login",
        form,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
}

export async function getCurrentUser(): Promise<User> {

    const response = await api.get("/users/me");

    return response.data;
}

export const logout = () => {
    localStorage.removeItem("token");
};