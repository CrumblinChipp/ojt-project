import {
    createContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../features/auth/types";
import { getCurrentUser } from "../features/auth/services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: React.Dispatch<
    React.SetStateAction<User | null>
    >;
}

export const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
        setLoading(false);
        return;
    }

    async function loadUser() {
        try {

            const currentUser = await getCurrentUser();

            setUser(currentUser);

        } catch (error) {

            localStorage.removeItem("token");

            setUser(null);

        } finally {

            setLoading(false);

        }
    }

    loadUser();
  }, []);

  return (
      <AuthContext.Provider
          value={{
              user,
              loading,
              setUser,
          }}
      >
          {children}
      </AuthContext.Provider>
  );

}