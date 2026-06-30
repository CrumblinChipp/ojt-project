import { register } from "./features/auth/services/authService";

import Button from "./components/ui/Button";

export default function App() {

    async function testRegister() {

        try {

            const user = await register({
                email: "test123@example.com",
                name: "Test User",
                organization: "Testing Inc.",
                password: "password123",
            });

            console.log(user);

            alert("Registration successful!");

        } catch (error) {

            console.error(error);

            alert("Registration failed.");

        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Button onClick={testRegister}>
                Test Register
            </Button>
        </div>
    );
}