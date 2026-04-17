import SidebarContext from "@/contexts/CartSidebarContext";
import { useContext } from "react";

const useCartSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useCartSidebar must be used within a CartSidebarProvider");
  }
  return context;
};

export default useCartSidebar;