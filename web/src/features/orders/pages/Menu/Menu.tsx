import CategoryShelf from "@/features/orders/components/CategoryShelf";
import "./Menu.css";
import menuLoader from "@/features/orders/loaders/menuLoader";
import { useLoaderData } from "react-router";

export const clientLoader = menuLoader;

const Menu = () => {
  const { menuItems } = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;

  return (
    <main className="menu-container">
      {menuItems.map((category) => (
        <CategoryShelf
          key={category.id}
          categoryHeader={{
            name: category.name,
            position: "left",
          }}
          items={category.items}
        />
      ))}
    </main>
  );
};

export default Menu;