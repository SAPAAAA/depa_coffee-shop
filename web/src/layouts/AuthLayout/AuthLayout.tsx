import { Outlet } from "react-router";
import "./AuthLayout.css";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <img
            src="/src/assets/logo.png"
            alt="Company Logo"
            className="auth-logo"
          />
          <h1>Welcome</h1>
          <p>Please enter your details to continue.</p>
        </header>
        <main>
          <Outlet />
        </main>
        <footer className="auth-footer">
          <p>&copy; {new Date().getFullYear()} Pepsi</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
