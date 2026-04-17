import "./ViewDrinkModal.css";
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import type { DrinkCompleteInfo } from "@/services/drink";
import type { IceLevel, SugarLevel } from "@api-types/sales/orders/order.model";
import type { CartItem } from "@/contexts/CartSidebarContext";
import type { Drink } from "@api-types/catalog/drinks/drink.model";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";

interface ViewDrinkModalProps {
  drinkPromise: Promise<DrinkCompleteInfo>;
  onClose: () => void;
  preSelectedOptions?: {
    variantId: string;
    iceLevel: IceLevel;
    sugarLevel: SugarLevel;
    quantity: number;
  };
  onAddToCart: (item: Omit<CartItem, "id" | "calculatedPrice">) => void;
}

const ICE_LEVEL_OPTIONS: { value: IceLevel; label: string }[] = [
  { value: "no_ice", label: "No Ice" },
  { value: "less_ice", label: "Less Ice" },
  { value: "normal_ice", label: "Normal Ice" },
  { value: "extra_ice", label: "Extra Ice" },
];

const SUGAR_LEVEL_OPTIONS: { value: SugarLevel; label: string }[] = [
  { value: "0%", label: "0%" },
  { value: "25%", label: "25%" },
  { value: "50%", label: "50%" },
  { value: "75%", label: "75%" },
  { value: "100%", label: "100%" },
];

const DrinkDetails = ({
  drinkPromise,
  onClose,
  preSelectedOptions,
  onAddToCart,
}: ViewDrinkModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const drink = use(drinkPromise);

  const variantOptions = drink.variants.toSorted(
    (a, b) => a.volumeMl - b.volumeMl,
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    preSelectedOptions?.variantId ||
      variantOptions.find((variant) => variant.isDefault)?.id ||
      variantOptions[0]?.id ||
      null,
  );
  const [selectedIceLevel, setSelectedIceLevel] = useState<IceLevel>(
    preSelectedOptions?.iceLevel || "normal_ice",
  );
  const [selectedSugarLevel, setSelectedSugarLevel] = useState<SugarLevel>(
    preSelectedOptions?.sugarLevel || "100%",
  );
  const [quantity, setQuantity] = useState(preSelectedOptions?.quantity || 1);

  const selectedVariant = variantOptions.find(
    (variant) => variant.id === selectedVariantId,
  );

  const totalPrice = selectedVariant?.price
    ? selectedVariant.price * quantity
    : 0;

  const item = useMemo(() => {
    if (!selectedVariant) return null;

    return {
      drink: {
        id: drink.id,
        name: drink.name,
        imageUrl: drink.imageUrl,
        categoryId: drink.category.id,
        description: drink.description,
      } as Drink,
      variant: selectedVariant,
      sugarLevel: selectedSugarLevel,
      iceLevel: selectedIceLevel,
      quantity,
      toppings: [],
    };
  }, [drink, selectedVariant, selectedSugarLevel, selectedIceLevel, quantity]);

  return (
    <>
      <div className="modal-backdrop" />
      <dialog className="modal" aria-modal="true" open>
        <header className="modal-header">
          <h2 className="modal-title">{drink.name}</h2>
          <button
            className="modal-close-btn"
            type="button"
            aria-label="Close modal"
            onClick={onClose}
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

        <div className="modal-content">
          <div className="drink-view-layout">
            <div className="drink-view-image-container">
              <img
                src={drink.imageUrl || ""}
                alt={drink.name}
                className="drink-view-image"
              />
            </div>

            <div className="drink-view-info-container">
              <p className="drink-view-description">{drink.description}</p>

              <section className="variants-section">
                <label className="variants-label" htmlFor="variant">
                  Select Variant
                </label>
                <select
                  id="variant"
                  className="variants-options-list"
                  value={selectedVariantId || undefined}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                >
                  {variantOptions.map((variant) => (
                    <option
                      key={variant.id}
                      value={variant.id}
                      className="variant-option-btn"
                    >
                      {variant.name} - ${variant.price.toFixed(2)} (
                      {variant.volumeMl}ml)
                    </option>
                  ))}
                </select>
              </section>

              <section className="ice-level-section">
                <span className="ice-level-label">Ice Level</span>
                <div
                  className="ice-level-options"
                  role="radiogroup"
                  aria-labelledby="ice-level-label"
                >
                  {ICE_LEVEL_OPTIONS.map((option) => (
                    <label key={option.value} className="ice-radio-label">
                      <input
                        type="radio"
                        name="iceLevel"
                        value={option.value}
                        checked={selectedIceLevel === option.value}
                        onChange={() => setSelectedIceLevel(option.value)}
                        className="ice-radio-input"
                      />
                      <span className="ice-radio-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="sugar-level-section">
                <span className="sugar-level-label">Sugar Level</span>
                <div
                  className="sugar-level-options"
                  role="radiogroup"
                  aria-labelledby="sugar-level-label"
                >
                  {SUGAR_LEVEL_OPTIONS.map((option) => (
                    <label key={option.value} className="sugar-radio-label">
                      <input
                        type="radio"
                        name="sugarLevel"
                        value={option.value}
                        checked={selectedSugarLevel === option.value}
                        onChange={() => setSelectedSugarLevel(option.value)}
                        className="sugar-radio-input"
                      />
                      <span className="sugar-radio-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="quantity-section">
                <label htmlFor="quantity" className="quantity-label">
                  Quantity
                </label>
                <div className="quantity-controls">
                  <button
                    type="button"
                    className="quantity-btn"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                  </button>
                  <input
                    className="quantity-display"
                    type="text"
                    id="quantity"
                    value={quantity}
                    aria-live="polite"
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value, 10);
                      if (!Number.isNaN(val)) {
                        setQuantity(
                          Math.min(
                            Math.max(1, val),
                            selectedVariant?.stockQuantity || 0,
                          ),
                        );
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="quantity-btn"
                    aria-label="Increase quantity"
                    disabled={quantity >= (selectedVariant?.stockQuantity || 0)}
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(selectedVariant?.stockQuantity || 0, prev + 1),
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <div className="price-display">
            <span>Total:</span>
            <output>${totalPrice.toFixed(2)}</output>
          </div>
          <button
            type="submit"
            className="add-to-cart-btn"
            onClick={() => {
              if (user) {
                if (item) {
                  onAddToCart(item);
                  onClose();
                }
              } else {
                navigate("/login", {
                  state: {
                    from: location.pathname,
                    preSelectedOptions: {
                      drinkId: drink.id,
                      variantId: selectedVariantId,
                      iceLevel: selectedIceLevel,
                      sugarLevel: selectedSugarLevel,
                      quantity,
                      toppings: [],
                    },
                  },
                });
              }
            }}
            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
          >
            {preSelectedOptions ? "Update Cart" : "Add to Cart"}
          </button>
        </footer>
      </dialog>
    </>
  );
};

const ViewDrinkModal = ({
  drinkPromise,
  onClose,
  preSelectedOptions,
  onAddToCart,
}: ViewDrinkModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogEl = dialogRef.current;
    if (dialogEl && !dialogEl.open) {
      dialogEl.showModal();
    }

    const handleClose = () => {
      onClose();
    };

    dialogEl?.addEventListener("close", handleClose);

    return () => {
      dialogEl?.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  return (
    <Suspense
      fallback={<div className="modal-loading-state">Loading details...</div>}
    >
      <DrinkDetails
        drinkPromise={drinkPromise}
        onClose={onClose}
        preSelectedOptions={preSelectedOptions}
        onAddToCart={onAddToCart}
      />
    </Suspense>
  );
};

export default ViewDrinkModal;
