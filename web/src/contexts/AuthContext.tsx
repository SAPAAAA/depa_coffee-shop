import { createContext } from "react";
import type { Customer } from "@api-types/users/customers/customer.model";

export type User = Customer;

export interface AuthContextValues {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValues | null>(null);

export default AuthContext;
