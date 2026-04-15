import { useMemo, useState, type ReactNode } from "react";
import SidebarContext from "@/contexts/CartSidebarContext";

const CartSidebarProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const values = useMemo(
    () => ({
      isOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
    }),
    [isOpen],
  );

  return (
    <SidebarContext.Provider value={values}>
      {children}
    </SidebarContext.Provider>
  );
};

export default CartSidebarProvider;
