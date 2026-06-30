import { createContext } from "react";
import  User  from "../features/auth/types";

export const AuthContext = createContext(
  
null as {user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>>} | null
)