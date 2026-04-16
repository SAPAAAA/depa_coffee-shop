import { createContext } from "react";
import type { IceLevel, SugarLevel } from "@api-types/sales/orders/order.model";
import type { Drink } from "@api-types/catalog/drinks/drink.model";
import type { DrinkVariant } from "@api-types/catalog/variants/variant.model";
import type { Topping } from "@api-types/catalog/toppings/topping.model";

export interface CartItem {
  id: string;
  drink: Drink;
  variant: DrinkVariant;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  quantity: number;
  toppings: Topping[];
  calculatedPrice: number;
}

interface CartSidebarContextValue {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  addItem: (item: Omit<CartItem, "id" | "calculatedPrice">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, updatedFields: Partial<Omit<CartItem, "id">>) => void;
  addTopping: (itemId: string, topping: Topping) => void;
  removeTopping: (itemId: string, toppingId: string) => void;
  items: CartItem[];
}

const SidebarContext = createContext<CartSidebarContextValue | null>(null);

export default SidebarContext;
