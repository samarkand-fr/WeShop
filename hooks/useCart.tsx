"use client";

import { CartProductType } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleQtyIncrease: (product: CartProductType) => void;
  handleQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

const isSameCartItem = (first: CartProductType, second: CartProductType) =>
  first.id === second.id &&
  first.selectedImg?.color === second.selectedImg?.color;

export const CartContextProvider = ({ children }: Props) => {
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(
    null
  );
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read browser storage only after mounting, and recover gracefully if it is invalid.
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("eShopCartItems");
      const parsedCart = storedCart ? JSON.parse(storedCart) : null;
      setCartProducts(Array.isArray(parsedCart) ? parsedCart : null);

      const storedPaymentIntent = localStorage.getItem("eShopPaymentIntent");
      setPaymentIntent(
        storedPaymentIntent ? JSON.parse(storedPaymentIntent) : null
      );
    } catch {
      setCartProducts(null);
      setPaymentIntent(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Keep storage in sync after the initial read, without overwriting it during hydration.
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("eShopCartItems", JSON.stringify(cartProducts));
    localStorage.setItem("eShopPaymentIntent", JSON.stringify(paymentIntent));
  }, [cartProducts, paymentIntent, isHydrated]);

  const cartTotalQty = useMemo(
    () => (cartProducts ?? []).reduce((total, item) => total + item.quantity, 0),
    [cartProducts]
  );

  const cartTotalAmount = useMemo(
    () =>
      (cartProducts ?? []).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartProducts]
  );

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((current) => {
      const items = current ?? [];
      const existingItem = items.find((item) => isSameCartItem(item, product));

      if (!existingItem) return [...items, product];

      return items.map((item) =>
        isSameCartItem(item, product)
          ? { ...item, quantity: Math.min(99, item.quantity + product.quantity) }
          : item
      );
    });
    toast.success("Product added to cart");
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      setCartProducts((current) => {
        const updated = (current ?? []).filter(
          (item) => !isSameCartItem(item, product)
        );
        return updated.length ? updated : null;
      });
      toast.success("Product removed from cart");
    },
    []
  );

  const handleQtyIncrease = useCallback((product: CartProductType) => {
    setCartProducts((current) => {
      const items = current ?? [];
      const existingItem = items.find((item) => isSameCartItem(item, product));
      if (!existingItem || existingItem.quantity >= 99) {
        toast.error("Maximum quantity reached");
        return current;
      }
      return items.map((item) =>
        isSameCartItem(item, product)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  }, []);

  const handleQtyDecrease = useCallback((product: CartProductType) => {
    setCartProducts((current) => {
      const items = current ?? [];
      const existingItem = items.find((item) => isSameCartItem(item, product));
      if (!existingItem || existingItem.quantity <= 1) {
        toast.error("Minimum quantity reached");
        return current;
      }
      return items.map((item) =>
        isSameCartItem(item, product)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
  }, []);

  const handleSetPaymentIntent = useCallback((value: string | null) => {
    setPaymentIntent(value);
  }, []);

  const value: CartContextType = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleQtyIncrease,
    handleQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
