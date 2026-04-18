import { useEffect, useMemo, useState } from "react";
import "./Checkout.css";
import useCartSidebar from "@/hooks/useCartSidebar";
import { Form, useActionData, useNavigate } from "react-router";
import type { DeliveryMethod } from "@api-types/sales/orders/order.model";

export { default as clientAction } from "@/features/orders/actions/createOrderAction";

interface CheckoutItemProps {
  name: string;
  variantName: string;
  iceLevel: string;
  sugarLevel: string;
  price: number;
  quantity: number;
  imageUrl: string;
  toppings?: Array<{ topping: { name: string }; quantity: number }>;
}

const CheckoutItem = ({
  name,
  variantName,
  iceLevel,
  sugarLevel,
  price,
  quantity,
  imageUrl,
  toppings,
}: CheckoutItemProps) => {
  return (
    <div className="checkout-item">
      <div className="relative">
        <div className="checkout-item-img-wrap">
          <img src={imageUrl} alt={name} className="checkout-item-img" />
        </div>
        <span className="checkout-item-qty-badge">{quantity}</span>
      </div>

      <div className="checkout-item-info">
        <h3 className="checkout-item-name">{name}</h3>
        <p className="checkout-item-meta">
          {variantName} • Ice: {iceLevel} • Sugar: {sugarLevel}
        </p>

        {toppings && toppings.length > 0 && (
          <div className="mt-1">
            {toppings.map((t, index) => (
              <p key={index} className="text-caption text-neutral-500 m-0">
                + {t.topping.name} x{t.quantity}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="checkout-item-price-wrap flex flex-col items-end">
        <span className="checkout-item-price">${price.toFixed(2)}</span>

        {quantity > 1 && (
          <span className="text-caption text-neutral-500 mt-1">
            (${(price / quantity).toFixed(2)} each)
          </span>
        )}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { items, resetCart } = useCartSidebar();
  const { data, success } = useActionData() || {};
  const order = data?.order;
  const navigate = useNavigate();

  // Local state to track selected delivery method
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("pickup");

  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0);
  const taxRate = 0.08; // 8% tax
  const shippingFee = useMemo(
    () => (deliveryMethod === "delivery" ? 15 : 0),
    [deliveryMethod],
  );
  const total = useMemo(
    () =>
      subtotal * (1 + taxRate) +
      (deliveryMethod === "delivery" ? shippingFee : 0),
    [subtotal, deliveryMethod],
  );

  useEffect(() => {
    if (success && order) {
      resetCart();
      navigate(`/orders/confirmation/${order.id}`, { replace: true });
    }
  }, [success, order, navigate]);

  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate("/menu", { replace: true });
    }
  }, [items, success]);

  return (
    <div className="checkout-page">
      <Form className="checkout-layout" method="post">
        <div className="checkout-main">
          {/* Delivery Method */}
          <section className="checkout-card">
            <h2 className="checkout-section-title">Delivery Method</h2>
            <div className="payment-options">
              <label className="payment-radio-label">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  className="payment-radio-input"
                  defaultChecked
                  onChange={() => setDeliveryMethod("pickup")}
                />
                <span className="payment-radio-text">Store Pickup</span>
              </label>
              <label className="payment-radio-label">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  className="payment-radio-input"
                  onChange={() => setDeliveryMethod("delivery")}
                />
                <span className="payment-radio-text">Home Delivery</span>
              </label>
            </div>
          </section>

          {/* Delivery/Shipping Address */}
          {deliveryMethod === "delivery" && (
            <section className="checkout-card">
              <h2 className="checkout-section-title">Delivery Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    placeholder="First Name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    placeholder="Last Name"
                  />
                </div>
                <div className="form-group-full">
                  <label className="form-label" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    placeholder="Street address or P.O. Box"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="zipcode">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipcode"
                    name="zipcode"
                    className="form-input"
                    placeholder="ZIP Code"
                  />
                </div>
                <div className="form-group-full">
                  <label className="form-label" htmlFor="notes">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    id="notes"
                    name="notes"
                    className="form-input"
                    placeholder="E.g. Leave at the front door"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Payment Method */}
          <section className="checkout-card">
            <h2 className="checkout-section-title">Payment Method</h2>
            <div className="payment-options">
              <label className="payment-radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  className="payment-radio-input"
                  defaultChecked
                />
                <span className="payment-radio-text">Credit / Debit Card</span>
              </label>

              {/* Fake Credit Card Form fields */}
              <div className="form-grid pl-8 pr-4 pb-4">
                <div className="form-group-full">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Card Number"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="CVC" />
                </div>
              </div>

              <label className="payment-radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  className="payment-radio-input"
                />
                <span className="payment-radio-text">PayPal</span>
              </label>
              <label className="payment-radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  className="payment-radio-input"
                />
                <span className="payment-radio-text">Cash on Delivery</span>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-card">
            <h2 className="checkout-section-title">Order Summary</h2>

            <div className="flex flex-col mb-6">
              {items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <CheckoutItem
                    key={item.id}
                    name={item.drink.name || "Unnamed Drink"}
                    variantName={item.variant.name || "Default Variant"}
                    iceLevel={item.iceLevel || "Regular"}
                    sugarLevel={item.sugarLevel || "Regular"}
                    toppings={item.toppings}
                    price={item.calculatedPrice}
                    quantity={item.quantity}
                    imageUrl={item.drink.imageUrl || "/placeholder-drink.png"}
                  />
                ))
              )}
            </div>

            {/* Price Calculations */}
            <div className="checkout-summary-section">
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span className="font-medium text-default-font">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span>Tax (8%)</span>
                <span className="font-medium text-default-font">
                  ${(subtotal * taxRate).toFixed(2)}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="font-medium text-default-font">
                  ${shippingFee.toFixed(2)}
                </span>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span className="text-brand-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button type="submit" className="checkout-submit-btn">
              Place Order
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Checkout;
