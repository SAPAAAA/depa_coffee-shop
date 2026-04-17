import { useLoaderData, Link } from "react-router";
import "./Confirmation.css";
import type { CompleteOrder } from "@api-types/sales/orders/order.model";
import { useEffect, useState } from "react";
import { getOrderById } from "@/services/order";

export { default as clientLoader } from "@/features/orders/loaders/orderLoader";

const Confirmation = () => {
  const { data } = useLoaderData() as { data: { order: CompleteOrder } };
  const initialOrder = data.order;
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (order.status === 'completed') return; // Stop polling if done

    const intervalId = setInterval(async () => {
      try {
        const updatedOrder = await getOrderById(order.id);
        setOrder(updatedOrder);
      } catch (error) {
        console.error("Failed to fetch order status", error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [order.id, order.status]);

  const renderStatusBadge = () => {
    switch (order.status) {
      case "pending":
        return (
          <span className="status-badge bg-warning-100 text-warning-800">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="status-badge bg-brand-100 text-brand-800">
            Barista is making it!
          </span>
        );
      case "completed":
        return (
          <span className="status-badge bg-success-100 text-success-800">
            Ready for Pickup!
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon-wrapper">
          <svg
            className="success-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="confirmation-title">Order Confirmed!</h1>

        {/* Dynamic Status Display */}
        <div className="mt-4 mb-6">{renderStatusBadge()}</div>

        <p className="confirmation-message">
          {order.status === "completed"
            ? "Your order is ready! Please head to the counter."
            : "Thank you for your purchase. We are processing your order right now."}
        </p>

        <div className="order-number-badge">
          Order #{order.id.split("-")[0]}
        </div>

        <div className="confirmation-actions">
          <Link to="/menu" className="back-to-menu-btn">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
