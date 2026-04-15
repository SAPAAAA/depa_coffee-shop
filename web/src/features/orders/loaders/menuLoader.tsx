import type { Route } from "./+types/menuLoader";

export const menuLoader = async ({ params }: Route.LoaderArgs) => {
  const menuData = [
    {
      id: "1",
      name: "Coffee",
      items: [
        {
          id: "1",
          name: "Espresso",
          description: "Strong and bold",
          price: 2.5,
          imageUrl: "/images/espresso.jpg",
        },
        {
          id: "2",
          name: "Latte",
          description: "Smooth and creamy",
          price: 3.5,
          imageUrl: "/images/latte.jpg",
        },
        {
          id: "5",
          name: "Cappuccino",
          description: "Rich and frothy",
          price: 3,
          imageUrl: "/images/latte.jpg",
        },
        {
          id: "6",
          name: "Americano",
          description: "Espresso with hot water",
          price: 2,
          imageUrl: "/images/espresso.jpg",
        },
        {
          id: "7",
          name: "Mocha",
          description: "Chocolate-flavored coffee",
          price: 4,
          imageUrl: "/images/latte.jpg",
        },
        {
          id: "8",
          name: "Macchiato",
          description: "Espresso with a dash of milk",
          price: 2.5,
          imageUrl: "/images/espresso.jpg",
        },
        {
          id: "9",
          name: "Flat White",
          description: "Espresso with steamed milk",
          price: 3,
          imageUrl: "/images/latte.jpg",
        },
        {
          id: "10",
          name: "Iced Coffee",
          description: "Chilled coffee over ice",
          price: 3,
          imageUrl: "/images/espresso.jpg",
        },
        {
          id: "11",
          name: "Cold Brew",
          description: "Slow-steeped cold coffee",
          price: 3.5,
          imageUrl: "/images/latte.jpg",
        },
      ],
    },
    {
      id: "2",
      name: "Tea",
      items: [
        {
          id: "3",
          name: "Green Tea",
          description: "Fresh and light",
          price: 2,
          imageUrl: "/images/green-tea.jpg",
        },
        {
          id: "4",
          name: "Black Tea",
          description: "Rich and robust",
          price: 2,
          imageUrl: "/images/black-tea.jpg",
        },
      ],
    },
  ];

  return { menuItems: menuData };
};


export default menuLoader;