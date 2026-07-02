import { useState } from "react";
import { useNavigate } from "react-router-dom";


import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../hooks/useAuth";


import { login, getCurrentUser } from "../services/authService";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {

            const response = await login(formData);
            localStorage.setItem(
                "token",
                response.access_token   
            );

            const currentUser = await getCurrentUser();

            setUser(currentUser);
            
            alert("Login successful!");

            navigate("/home/dashboard");

        } catch (err: any) {

            setError(
                err.response?.data?.detail ??
                "Login failed."
            );

        } finally {

            setLoading(false);

        }
    }
    return (
            <Card>
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Login
                </h1>

                <form className="space-y-4"
                    onSubmit={handleSubmit}>

                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}
                    <Button
                        type="submit"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </Button>
                </form>
            </Card>
    );
}