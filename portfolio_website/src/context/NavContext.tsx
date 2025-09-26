// src/context/NavContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NavItem = { href: string; label: string };

type NavContextType = {
  navItems: NavItem[];
  setNavItems: (items: NavItem[]) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  return (
    <NavContext.Provider value={{ navItems, setNavItems }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
}
