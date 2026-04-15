import useCartSidebar from "@/hooks/useCartSidebar";
import "./CartSidebar.css";
import type { CSSProperties } from "react";

const Sidebar = () => {
  const { isOpen, closeSidebar } = useCartSidebar();

  return (
    <>
      {isOpen && <div className="cart-drawer-backdrop" />}
      <aside
        className="cart-drawer"
        style={
          {
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
          } as CSSProperties
        }
      >
        <header className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Shopping Basket</h2>
          <button
            className="cart-drawer-close-btn"
            type="button"
            aria-label="Close cart"
            onClick={() => closeSidebar()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </header>
        <div className="cart-drawer-content">
          {/* Cart items will go here */}
        </div>
        <footer className="cart-drawer-footer">
          <div className="cart-subtotal">
            <span className="subtotal-label">Subtotal:</span>
            <output className="subtotal-amount">$0.00</output>
          </div>
          <button className="checkout-button" type="button">
            Proceed to Checkout
          </button>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
