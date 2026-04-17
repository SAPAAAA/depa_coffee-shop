import CategoryShelf from "@/features/drinks/components/CategoryShelf";
import "./Menu.css";
import menuLoader from "@/features/drinks/loaders/menuLoader";
import { useLoaderData } from "react-router";
import { useCallback, useState } from "react";
import ViewDrinkModal from "@/features/drinks/components/ViewDrinkModal";
import { getDrinkCompleteInfo, type DrinkCompleteInfo } from "@/services/drink";
import useCartSidebar from "@/hooks/useCartSidebar";
import type { CartItem } from "@api-types/sales/carts/cart.model";

export const clientLoader = menuLoader;

const Menu = () => {
  const { addItem } = useCartSidebar();
  const { menu } = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;
  const [drinkPromise, setDrinkPromise] =
    useState<Promise<DrinkCompleteInfo> | null>(null);
  const handleDrinkClick = (drinkId: string) => {
    const promise = getDrinkCompleteInfo(drinkId);
    setDrinkPromise(promise);
  };
  const categories = menu.categories;

  const handleOnCloseModal = () => {
    setDrinkPromise(null);
  };

  // Add to cart logic
  const handleOnAddToCart = useCallback(
    ({
      drink,
      variant,
      sugarLevel,
      iceLevel,
      quantity,
      toppings,
    }: Omit<CartItem, "id" | "calculatedPrice">) => {
      const item = {
        drink,
        variant: variant,
        sugarLevel,
        iceLevel,
        quantity,
        toppings: toppings || [],
      };

      addItem(item);
      handleOnCloseModal();
    },
    [addItem],
  );

  return (
    <main className="menu-container">
      {categories.map((category) => (
        <CategoryShelf
          key={category.id}
          categoryHeader={{
            name: category.name,
            position: "left",
          }}
          items={category.drinks}
          onDrinkClick={(drinkId) => handleDrinkClick(drinkId)}
        />
      ))}

      {drinkPromise && (
        <ViewDrinkModal
          drinkPromise={drinkPromise}
          onClose={handleOnCloseModal}
          onAddToCart={handleOnAddToCart}
        />
      )}
    </main>
  );
};

export default Menu;
