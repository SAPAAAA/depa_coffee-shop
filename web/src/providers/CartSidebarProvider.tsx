// src/providers/CartSidebarProvider.tsx
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import SidebarContext, { type CartItem } from "@/contexts/CartSidebarContext";
import type { Topping } from "@api-types/catalog/toppings/topping.model";
import useAuth from "@/hooks/useAuth";
import cartService from "@/services/cart";
import drinkService from "@/services/drink";
import toppingsService from "@/services/topping";
import useDebounce from "@/hooks/useDebounce";
import type { UpdateCompleteCartItemDTO } from "@api-types/sales/carts/cart.model";

const CartSidebarProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart_items");
      if (storedCart) {
        try {
          return JSON.parse(storedCart) as CartItem[];
        } catch (error) {
          console.error("Failed to parse cart items from localStorage:", error);
          return [];
        }
      }
    }
    return [];
  });

  const { user } = useAuth();

  const calculateItemPrice = useCallback(
    (item: Pick<CartItem, "variant" | "quantity" | "toppings">): number => {
      const variantPrice = item.variant.price;
      const toppingsPrice = item.toppings.reduce((sum, toppingWithQuantity) => {
        const topping = toppingWithQuantity.topping;
        const quantity = toppingWithQuantity.quantity ?? 1;
        return sum + topping.unitPrice * quantity;
      }, 0);

      return (variantPrice + toppingsPrice) * item.quantity;
    },
    [],
  );

  // Sync cart with localStorage across tabs
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  // Fetch existing cart on login
  useEffect(() => {
    const fetchExistingCart = async () => {
      if (!user) return;

      try {
        const cart = await cartService.getCart();
        if (!cart) return;

        setCartId(cart.id);

        // Fetch all items in parallel
        const mappedItems = await Promise.all(
          cart.items.map(async (item) => {
            const variant = await drinkService.getDrinkVariantById(
              item.drinkVariantId,
            );
            const drink = await drinkService.getDrinkById(variant.drinkId);

            // Fetch all toppings for this item in parallel
            const toppings = await Promise.all(
              item.toppings.map(async (t) => {
                const topping = await toppingsService.getToppingById(t.id);
                return { topping, quantity: t.quantity };
              }),
            );

            const mappedItem = {
              id: item.id,
              drink,
              variant,
              sugarLevel: item.sugarLevel,
              iceLevel: item.iceLevel,
              quantity: item.quantity,
              toppings,
            };

            return {
              ...mappedItem,
              calculatedPrice: calculateItemPrice(mappedItem),
            };
          }),
        );

        setItems(mappedItems);
      } catch (error) {
        console.error("Failed to fetch existing cart:", error);
      }
    };

    fetchExistingCart();
  }, [user, calculateItemPrice]);

  const debouncedUpdateCart = useDebounce(
    useCallback(
      async (itemId: string, payload: UpdateCompleteCartItemDTO) => {
        if (!user || !cartId) return;
        try {
          await cartService.updateCartItem(cartId, itemId, payload);
        } catch (error) {
          console.error("Failed to sync updated quantity with server:", error);
        }
      },
      [user, cartId],
    ),
    300,
  );

  // Save to db
  // useEffect(() => {
  //   if (syncTimeoutRef.current) {
  //     clearTimeout(syncTimeoutRef.current);
  //   }

  //   if (user && (cartId || items.length > 0)) {
  //     syncTimeoutRef.current = setTimeout(async () => {
  //       try {
  //         const payload = {
  //           id: cartId,
  //           customerId: user.id,
  //           items: items.map((item) => ({
  //             id: item.id,
  //             cartId: cartId,
  //             drinkVariantId: item.variant.id,
  //             sugarLevel: item.sugarLevel,
  //             iceLevel: item.iceLevel,
  //             quantity: item.quantity,
  //             toppings: item.toppings.map((toppingWithQuantity) => ({
  //               id: toppingWithQuantity.topping.id,
  //               quantity: toppingWithQuantity.quantity,
  //             })),
  //           })),
  //         };

  //         if (cartId) {
  //           await cartService.updateCart(cartId, payload);
  //         } else {
  //           const createdCart = await cartService.saveCart(payload);
  //           setCartId(createdCart.id);
  //         }
  //       } catch (error) {
  //         console.error("Failed to sync cart with server:", error);
  //       }
  //     }, 2500);
  //   }

  //   return () => {
  //     if (syncTimeoutRef.current) {
  //       clearTimeout(syncTimeoutRef.current);
  //     }
  //   };
  // }, [user, items, cartId]);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const addItem = async (item: Omit<CartItem, "id" | "calculatedPrice">) => {
    if (!user) {
      return;
    }

    let currentCartId = cartId;

    try {
      // If there is no cart yet, create one so we have a valid cartId to save the item against
      if (!currentCartId) {
        const newCart = await cartService.saveCart({
          customerId: user.id,
          items: [],
        });
        setCartId(newCart.id);
        currentCartId = newCart.id;
      }

      const payload = {
        drinkVariantId: item.variant.id,
        sugarLevel: item.sugarLevel,
        iceLevel: item.iceLevel,
        quantity: item.quantity,
        toppings: item.toppings.map((toppingWithQuantity) => ({
          id: toppingWithQuantity.topping.id,
          quantity: toppingWithQuantity.quantity,
        })),
      };

      const createdItem = await cartService.saveCartItem(
        currentCartId,
        payload,
      );

      const [variant, drink, toppings] = await Promise.all([
        drinkService.getDrinkVariantById(createdItem.drinkVariantId),
        drinkService.getDrinkById(item.variant.drinkId),
        Promise.all(
          item.toppings.map((t) =>
            toppingsService.getToppingById(t.topping.id),
          ),
        ),
      ]);

      const newItem: CartItem = {
        id: createdItem.id, // Using the new ID returned from the server
        drink,
        variant,
        sugarLevel: item.sugarLevel,
        iceLevel: item.iceLevel,
        quantity: item.quantity,
        toppings: toppings.map((topping, index) => ({
          topping,
          quantity: item.toppings[index].quantity,
        })),
        calculatedPrice: calculateItemPrice(item),
      };
      setItems((prev) => [...prev, newItem]);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeItem = (itemId: string) =>
    setItems((prev) => prev.filter((item) => item.id !== itemId));

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!user || !cartId) return;

    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const validQuantity = Math.min(quantity, item.variant.stockQuantity);
          const updatedItem = { ...item, quantity: validQuantity };

          // Update the server with the new quantity, debounced to avoid excessive calls
          const payload: UpdateCompleteCartItemDTO = {
            id: itemId,
            cartId: cartId,
            drinkVariantId: item.variant.id,
            sugarLevel: item.sugarLevel,
            iceLevel: item.iceLevel,
            quantity: validQuantity,
            toppings: item.toppings.map((toppingWithQuantity) => ({
              id: toppingWithQuantity.topping.id,
              quantity: toppingWithQuantity.quantity,
            })),
          };
          debouncedUpdateCart(itemId, payload);

          return {
            ...updatedItem,
            calculatedPrice: calculateItemPrice(updatedItem),
          };
        }
        return item;
      }),
    );
  };

  const addTopping = (itemId: string, topping: Topping, quantity: number = 1) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, toppings: [...item.toppings, { topping, quantity }] }
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
                (toppingWithQuantity) =>
                  toppingWithQuantity.topping.id !== toppingId,
              ),
            }
          : item,
      ),
    );

  const updateItem = (
    itemId: string,
    updatedFields: Partial<Omit<CartItem, "id">>,
  ) => {
    if (!user || !cartId) return;
    
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

          const payload = {
            id: itemId,
            cartId: cartId,
            drinkVariantId: updatedItem.variant.id,
            sugarLevel: updatedItem.sugarLevel,
            iceLevel: updatedItem.iceLevel,
            quantity: updatedItem.quantity,
            toppings: updatedItem.toppings.map((toppingWithQuantity) => ({
              id: toppingWithQuantity.topping.id,
              quantity: toppingWithQuantity.quantity,
            })),
          };

          cartService.updateCartItem(cartId, itemId, payload);

          return {
            ...updatedItem,
            calculatedPrice: calculateItemPrice(updatedItem),
          };
        }
        return item;
      }),
    );
  };

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
