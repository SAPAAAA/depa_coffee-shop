import { createContext } from "react";
import type { Customer } from "@api-types/users/customers/customer.model";

export type User = Customer & {
  role: "customer" | "barista" | "admin";
}

export interface AuthContextValues {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValues | null>(null);

export default AuthContext;
