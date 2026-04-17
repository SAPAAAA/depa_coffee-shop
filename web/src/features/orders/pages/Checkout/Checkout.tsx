import "./Checkout.css";

interface CheckoutItemProps {
  name: string;
  variantName: string;
  iceLevel: string;
  sugarLevel: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const CheckoutItem = ({
  name,
  variantName,
  iceLevel,
  sugarLevel,
  price,
  quantity,
  imageUrl,
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
      </div>

      <div className="checkout-item-price-wrap">
        <span className="checkout-item-price">${price.toFixed(2)}</span>
      </div>
    </div>
  );
};

const Checkout = () => {
  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        
        {/* LEFT COLUMN: Customer Information & Payment */}
        <div className="checkout-main">
          
          {/* Contact Information */}
          <section className="checkout-card">
            <h2 className="checkout-section-title">Contact Information</h2>
            <div className="form-grid">
              <div className="form-group-full">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-input" placeholder="Enter your email" />
              </div>
              <div className="form-group-full">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" className="form-input" placeholder="Enter your phone number" />
              </div>
            </div>
          </section>

          {/* Delivery/Shipping Address */}
          <section className="checkout-card">
            <h2 className="checkout-section-title">Delivery Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" className="form-input" placeholder="First Name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" className="form-input" placeholder="Last Name" />
              </div>
              <div className="form-group-full">
                <label className="form-label" htmlFor="address">Address</label>
                <input type="text" id="address" className="form-input" placeholder="Street address or P.O. Box" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="city">City</label>
                <input type="text" id="city" className="form-input" placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="zipcode">ZIP Code</label>
                <input type="text" id="zipcode" className="form-input" placeholder="ZIP Code" />
              </div>
              <div className="form-group-full">
                <label className="form-label" htmlFor="notes">Delivery Instructions (Optional)</label>
                <input type="text" id="notes" className="form-input" placeholder="E.g. Leave at the front door" />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="checkout-card">
            <h2 className="checkout-section-title">Payment Method</h2>
            <div className="payment-options">
              <label className="payment-radio-label">
                <input type="radio" name="paymentMethod" value="credit_card" className="payment-radio-input" defaultChecked />
                <span className="payment-radio-text">Credit / Debit Card</span>
              </label>
              
              {/* Fake Credit Card Form fields */}
              <div className="form-grid pl-8 pr-4 pb-4">
                <div className="form-group-full">
                  <input type="text" className="form-input" placeholder="Card Number" />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="MM/YY" />
                </div>
                <div className="form-group">
                  <input type="text" className="form-input" placeholder="CVC" />
                </div>
              </div>

              <label className="payment-radio-label">
                <input type="radio" name="paymentMethod" value="paypal" className="payment-radio-input" />
                <span className="payment-radio-text">PayPal</span>
              </label>
              <label className="payment-radio-label">
                <input type="radio" name="paymentMethod" value="cash" className="payment-radio-input" />
                <span className="payment-radio-text">Cash on Delivery</span>
              </label>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-card">
            <h2 className="checkout-section-title">Order Summary</h2>
            
            {/* Hardcoded Items for Display */}
            <div className="flex flex-col mb-6">
              <CheckoutItem 
                name="Caramel Macchiato"
                variantName="Large"
                iceLevel="Normal"
                sugarLevel="75%"
                price={5.50}
                quantity={2}
                imageUrl="https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=150&q=80"
              />
              <CheckoutItem 
                name="Matcha Latte"
                variantName="Medium"
                iceLevel="Less Ice"
                sugarLevel="50%"
                price={4.75}
                quantity={1}
                imageUrl="https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=150&q=80"
              />
            </div>

            {/* Price Calculations */}
            <div className="checkout-summary-section">
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span className="font-medium text-default-font">$15.75</span>
              </div>
              <div className="checkout-summary-row">
                <span>Tax (8%)</span>
                <span className="font-medium text-default-font">$1.26</span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className="font-medium text-default-font">$2.50</span>
              </div>
              
              <div className="checkout-summary-total">
                <span>Total</span>
                <span className="text-brand-600">$19.51</span>
              </div>
            </div>

            <button type="button" className="checkout-submit-btn">
              Place Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;