import { useState } from "react";
import AuthCard from "../components/AuthCard";

export default function Landing() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex w-full max-w-6xl items-center gap-16 px-8">

            <div className="flex-1 gap-8 mb-4">
              <h1 className="text-6xl font-bold">
                  Inventory
                  <br />
                  Management
                  <br />
                  System
              </h1>
            </div>
            <AuthCard
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
                
        </div>
      </div>
    );
}