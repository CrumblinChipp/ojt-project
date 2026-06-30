interface AuthTabsProps {
    activeTab: "login" | "register";
    setActiveTab: React.Dispatch<
        React.SetStateAction<"login" | "register">
    >;
}

export default function AuthTabs({
    activeTab,
    setActiveTab,
}: AuthTabsProps) {

  return(
    <div>
      <div className="flex w-full">

          <button className={`w-1/2 mb-6 py-3 font-semibold rounded-l-lg cursor-pointer ${
                  activeTab === "login"
                      ? "bg-gray-500 text-black"
                      : "bg-gray-900 text-white"
                    }`}
                  type="button"
                  onClick={() => setActiveTab("login")}>
            Login
          </button>

          <button className={`w-1/2 mb-6 py-3 font-semibold rounded-r-lg cursor-pointer ${
                  activeTab === "register"
                      ? "bg-gray-500 text-black"
                      : "bg-gray-900 text-white"
                    }`}
              type="button"
              onClick={() => setActiveTab("register")}> 
            Register
          </button>
      </div>
    </div>
  )
}