import { createContext } from "react";

interface CartSidebarContextValue {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<CartSidebarContextValue | null>(null);

export default SidebarContext;