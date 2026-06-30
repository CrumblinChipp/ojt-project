import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

import { register } from "../services/authService";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
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

            await register(formData);

            alert("Registration successful!");

            navigate("/");

        } catch (err: any) {

            setError(
                err.response?.data?.detail ??
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    }
    return (
            <Card>
                <h1 className="mb-2 text-3xl font-bold">
                    Create Account
                </h1>

                <p className="mb-6 text-slate-500">
                    Register to continue.
                </p>

                <form className="space-y-4"
                    onSubmit={handleSubmit}>
                    <Input
                        name="name"
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Input
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        name="organization"
                        label="Organization"
                        placeholder="ABC Company"
                        value={formData.organization}
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
                        {loading ? "Creating Account..." : "Register"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="font-semibold text-grey-900 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </Card>
    );
}