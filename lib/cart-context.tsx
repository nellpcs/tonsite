"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/mock-data";

export interface CartItem {
  id: string;
  product: Product;
  color: string | null;
  size: string | null;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  city: string;
  quartier: string;
  deliveryMethod: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: Product,
    color: string | null,
    size: string | null,
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  comment: string;
  setComment: (comment: string) => void;
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tonsite-cart";

interface StoredCart {
  items: CartItem[];
  comment: string;
  customerInfo: CustomerInfo | null;
}

function buildItemId(
  productId: string,
  color: string | null,
  size: string | null
) {
  return [productId, color ?? "", size ?? ""].join("::");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [comment, setComment] = useState("");
  const [customerInfo, setCustomerInfoState] = useState<CustomerInfo | null>(
    null
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredCart = JSON.parse(stored);
        setItems(parsed.items ?? []);
        setComment(parsed.comment ?? "");
        setCustomerInfoState(parsed.customerInfo ?? null);
      }
    } catch {
      // ignore malformed storage
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const payload: StoredCart = { items, comment, customerInfo };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [items, comment, customerInfo, isHydrated]);

  function addItem(
    product: Product,
    color: string | null,
    size: string | null,
    quantity = 1
  ) {
    const id = buildItemId(product.id, color, size);
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id, product, color, size, quantity }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }

  function clearCart() {
    setItems([]);
    setComment("");
    setCustomerInfoState(null);
  }

  function setCustomerInfo(info: CustomerInfo) {
    setCustomerInfoState(info);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        comment,
        setComment,
        customerInfo,
        setCustomerInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
