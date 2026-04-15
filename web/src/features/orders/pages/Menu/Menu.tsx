import CategoryShelf from "@/features/orders/components/CategoryShelf";
import "./Menu.css";
import menuLoader from "@/features/orders/loaders/menuLoader";
import { useLoaderData } from "react-router";

export const clientLoader = menuLoader;

const Menu = () => {
  const { menu } = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;
  const categories = menu.categories;
  console.log("Menu:", menu);

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
        />
      ))}
    </main>
  );
};

export default Menu;