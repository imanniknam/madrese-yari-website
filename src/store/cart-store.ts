"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  qty: number;
  unitPriceToman: number;
  unitTokenPrice?: number;
};

export type CartState = {
  buyerType: "donor" | "student" | "school";
  lines: CartLine[];
  setBuyerType: (buyerType: CartState["buyerType"]) => void;
  addLine: (line: CartLine) => void;
  removeLine: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

// Client-side cart state only — this is a UX convenience. The server always re-validates
// price/stock from the database at checkout (see src/lib/domain/place-order.ts); nothing
// here is treated as a source of truth for money.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      buyerType: "donor",
      lines: [],
      setBuyerType: (buyerType) => set({ buyerType }),
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === line.productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === line.productId ? { ...l, qty: l.qty + line.qty } : l
              ),
            };
          }
          return { lines: [...state.lines, line] };
        }),
      removeLine: (productId) => set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      setQty: (productId, qty) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "madrese-yari-cart" }
  )
);

// The persisted cart is only readable after the store rehydrates from localStorage on the
// client, which happens after the first render. Pages that make decisions based on cart
// contents (e.g. redirecting when empty) must wait for this, or they'll briefly see an
// empty cart and act on stale/default state.
export function useCartHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false
  );
}
