"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  model: string;
  series: string;
  price: number;
  image: string;
  holeCount: number | null;
  finish: string;
  decalColor: string;
  quantity: number;
}

/** A stable key that treats different option combinations as separate lines. */
function lineKey(item: Omit<CartItem, "quantity">): string {
  return [item.id, item.holeCount ?? "-", item.finish, item.decalColor].join("|");
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  keyFor: (item: Omit<CartItem, "quantity">) => string;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lb-outlet-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage after mount to avoid SSR mismatch
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          lineKey(p) === key
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        );
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (lineKey(p) === key ? { ...p, quantity } : p))
        .filter((p) => p.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.quantity * i.price, 0);
    return {
      items,
      count,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      keyFor: lineKey,
    };
  }, [items, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
