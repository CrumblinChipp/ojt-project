import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthCardProps {
    activeTab: "login" | "register";
    setActiveTab: React.Dispatch<
        React.SetStateAction<"login" | "register">
    >;
}

export default function AuthCard({
      activeTab,
      setActiveTab,
  }: AuthCardProps) {

    return (
        <div className="w-full max-w-md rounded-lg bg-gray-500 shadow-lg">
            <AuthTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
    );
}