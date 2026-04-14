import type { Route } from "./+types/loginAction";
import { login } from "@/services/auth";

export const loginAction = async ({ request }: Readonly<Route.ActionArgs>) => {
  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    await login(username, password, role);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Login failed" };
  }
}

export default loginAction;