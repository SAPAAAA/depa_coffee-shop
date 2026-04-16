import CategoryShelf from "@/features/drinks/components/CategoryShelf";
import "./Menu.css";
import menuLoader from "@/features/drinks/loaders/menuLoader";
import { useLoaderData } from "react-router";
import { useState } from "react";
import ViewDrinkModal from "@/features/drinks/components/ViewDrinkModal";
import { getDrinkCompleteInfo, type DrinkCompleteInfo } from "@/services/drink";

export const clientLoader = menuLoader;


const Menu = () => {
  const { menu } = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;
  const [drinkPromise, setDrinkPromise] = useState<Promise<DrinkCompleteInfo> | null>(null);
  const handleDrinkClick = (drinkId: string) => {
    const promise = getDrinkCompleteInfo(drinkId);
    setDrinkPromise(promise);    
  }
  const categories = menu.categories;

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
          onClose={() => setDrinkPromise(null)}
        />
      )}
    </main>
  );
};

export default Menu;