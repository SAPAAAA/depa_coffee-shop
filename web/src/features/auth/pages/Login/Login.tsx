import { useEffect } from "react";
import { Form, useActionData, useNavigate, useNavigation } from "react-router";
import "./Login.css";

export { default as clientAction } from "@/features/auth/actions/loginAction";

const Login = () => {
  const { success, error } = useActionData() || {};
  const navigation = useNavigation();
  const navigate = useNavigate();

  const isPending = navigation.state === "submitting";

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="login-form-container">
      <Form method="post" className="login-form">
        {error && (
          <div className="login-error-message">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="role" className="login-label">
            Login as
          </label>
          <select
            disabled={isPending || success === true}
            id="role"
            name="role"
            defaultValue="customer"
            className="login-input"
          >
            <option value="customer">Customer</option>
            <option value="barista">Barista</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <label htmlFor="username" className="login-label">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={isPending || success === true}
            className="login-input"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label htmlFor="password" className="login-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            disabled={isPending || success === true}
            className="login-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || success === true}
          className="login-submit-button"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </Form>

      <div className="login-footer">
        <p className="login-footer-text">
          Don't have an account?{" "}
          <a href="/signup" className="login-footer-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;