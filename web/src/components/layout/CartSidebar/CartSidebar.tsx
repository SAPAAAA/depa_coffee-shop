import useCartSidebar from "@/hooks/useCartSidebar";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import type { CartItem } from "@/contexts/CartSidebarContext";
import "./CartSidebar.css";
import ViewDrinkModal from "@/features/drinks/components/ViewDrinkModal";
import { getDrinkCompleteInfo, type DrinkCompleteInfo } from "@/services/drink";
import { useNavigate } from "react-router";

interface CartItemProps {
  item: CartItem;
  updateQuantity: (itemId: string, quantity: number) => void;
  onItemClick: (itemId: string) => void;
}

const CartSidebarItem = ({
  item,
  updateQuantity,
  onItemClick: onDrinkClick,
}: CartItemProps) => {
  const variant = item.variant;

  // For display purposes, convert "NO_ICE" to "No Ice", etc.
  const formatIceLevel = (level: string) =>
    level
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="cart-item">
      <div className="cart-item-layout">
        <button
          className="cart-item-image-container"
          onClick={() => onDrinkClick(item.id)}
          aria-label={`View details for ${item.drink.name}`}
        >
          <img
            src={item.drink.imageUrl || "https://via.placeholder.com/80"}
            alt={item.drink.name}
            className="cart-item-image"
          />
        </button>

        <div className="cart-item-content">
          <h3 className="cart-item-name">{item.drink.name}</h3>

          <div className="cart-item-body">
            {/* Left Side: Specs */}
            <div className="cart-item-specs">
              <p className="cart-item-spec-text">{variant.name}</p>
              <p className="cart-item-spec-text">
                Ice: {formatIceLevel(item.iceLevel)}
              </p>
              <p className="cart-item-spec-text">Sugar: {item.sugarLevel}</p>
            </div>

            {/* Right Side: Actions */}
            <div className="cart-item-actions">
              <p className="cart-item-price">
                ${item.calculatedPrice.toFixed(2)}
              </p>

              <div className="cart-item-quantity-controls">
                <button
                  type="button"
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, item.quantity - 1);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                  </svg>
                </button>
                <input
                  className="quantity-display"
                  type="text"
                  id={`quantity-${item.id}`}
                  value={item.quantity}
                  aria-live="polite"
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value, 10);
                    if (!Number.isNaN(val)) {
                      updateQuantity(item.id, val);
                    }
                  }}
                />
                <button
                  type="button"
                  className="quantity-btn"
                  aria-label="Increase quantity"
                  disabled={item.quantity >= variant.stockQuantity}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(item.id, item.quantity + 1);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  const { isOpen, closeSidebar, items, updateQuantity, updateItem } =
    useCartSidebar();
  const [drinkPromise, setDrinkPromise] =
    useState<Promise<DrinkCompleteInfo> | null>(null);
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.calculatedPrice, 0),
    [items],
  );

  const clickedItemSelectedOptions = useMemo(() => {
    if (!clickedItemId) return undefined;

    const item = items.find((i) => i.id === clickedItemId);
    if (!item) return undefined;

    return {
      variantId: item.variant.id,
      iceLevel: item.iceLevel,
      sugarLevel: item.sugarLevel,
      quantity: item.quantity,
      toppings: item.toppings,
    };
  }, [clickedItemId, items]);

  const handleDrinkClick = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      const drinkId = item.drink.id;
      const promise = getDrinkCompleteInfo(drinkId);
      setDrinkPromise(promise);
      setClickedItemId(itemId);
    },
    [items],
  );

  const handleOnCloseModal = useCallback(() => {
    setDrinkPromise(null);
    setClickedItemId(null);
  }, []);

  const handleOnUpdateCartItem = (
    item: Omit<CartItem, "id" | "calculatedPrice">,
  ) => {
    if (clickedItemId) {
      updateItem(clickedItemId, item);
      handleOnCloseModal();
    }
  };

  const handleOnCheckout = useCallback(() => {
    handleOnCloseModal();
    closeSidebar();
    navigate("/checkout");
  }, [items, navigate]);

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
          {items.length === 0 ? (
            <p className="empty-cart-message">Your cart is currently empty.</p>
          ) : (
            items.map((item) => (
              <CartSidebarItem
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                onItemClick={handleDrinkClick}
              />
            ))
          )}
        </div>
        <hr className="cart-drawer-divider" />
        <footer className="cart-drawer-footer">
          <div className="cart-subtotal">
            <span className="subtotal-label">Subtotal:</span>
            <output className="subtotal-value">${subtotal.toFixed(2)}</output>
          </div>
          <button
            className="checkout-button"
            type="button"
            disabled={items.length === 0}
            onClick={handleOnCheckout}
          >
            Proceed to Checkout
          </button>
        </footer>
      </aside>
      {drinkPromise && (
        <ViewDrinkModal
          drinkPromise={drinkPromise}
          onClose={() => setDrinkPromise(null)}
          preSelectedOptions={clickedItemSelectedOptions}
          onAddToCart={handleOnUpdateCartItem}
        />
      )}
    </>
  );
};

export default Sidebar;
