import { useMemo, useState, type ReactNode } from "react";
import SidebarContext, { type CartItem } from "@/contexts/CartSidebarContext";
import type { Topping } from "@api-types/catalog/toppings/topping.model";

const CartSidebarProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const calculateItemPrice = (
    item: Pick<CartItem, "variant" | "quantity" | "toppings">,
  ): number => {
    const variantPrice = item.variant.price;
    const toppingsPrice = item.toppings.reduce(
      (sum, topping) => sum + (topping.unitPrice || 0),
      0,
    );

    return (variantPrice + toppingsPrice) * item.quantity;
  };

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const addItem = (item: Omit<CartItem, "id" | "calculatedPrice">) => {
    const newItem: CartItem = {
      ...item,
      id: crypto.randomUUID(),
      calculatedPrice: calculateItemPrice(item),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (itemId: string) =>
    setItems((prev) => prev.filter((item) => item.id !== itemId));

  const updateQuantity = (itemId: string, quantity: number) =>
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (quantity < 1) removeItem(itemId);
          if (quantity > item.variant.stockQuantity) {
            quantity = item.variant.stockQuantity;
          }
          const updatedItem = { ...item, quantity };
          return {
            ...updatedItem,
            calculatedPrice: calculateItemPrice(updatedItem),
          };
        }
        return item;
      }),
    );

  const addTopping = (itemId: string, topping: Topping) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, toppings: [...item.toppings, topping] }
          : item,
      ),
    );

  const removeTopping = (itemId: string, toppingId: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              toppings: item.toppings.filter(
                (topping) => topping.id !== toppingId,
              ),
            }
          : item,
      ),
    );

  const updateItem = (
    itemId: string,
    updatedFields: Partial<Omit<CartItem, "id">>,
  ) =>
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const quantity = updatedFields.quantity ?? item.quantity;
          const variant = updatedFields.variant ?? item.variant;
          const stockQuantity = variant.stockQuantity;

          const updatedItem = {
            ...item,
            ...updatedFields,
            quantity: Math.max(1, Math.min(stockQuantity, quantity)),
          };

          return {
            ...updatedItem,
            calculatedPrice: calculateItemPrice(updatedItem),
          };
        }
        return item;
      }),
    );

  const values = useMemo(
    () => ({
      isOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      addTopping,
      removeTopping,
      items,
    }),
    [isOpen, items],
  );

  return (
    <SidebarContext.Provider value={values}>{children}</SidebarContext.Provider>
  );
};

export default CartSidebarProvider;
