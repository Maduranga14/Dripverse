import React, { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/api";


export interface CartItem {
  id: number;
  product: any;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  addToCart: (productId: number, quantity: number, size: string, color: string) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQty: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  loading: boolean;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const items = cart?.items || [];
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [token]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth("/cart");
      setCart(data);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number, size: string, color: string) => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const data = await fetchWithAuth("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity, size, color })
      });
      setCart(data);
      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const data = await fetchWithAuth(`/cart/items/${itemId}`, {
        method: "DELETE"
      });
      setCart(data);
      toast.info("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const updateQty = async (itemId: number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);
    try {
      const data = await fetchWithAuth(`/cart/items/${itemId}?quantity=${quantity}`, {
        method: "PUT"
      });
      setCart(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const clearCart = () => {
    setCart(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{ cart, items, addToCart, removeFromCart, updateQty, clearCart, totalItems, cartTotal, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
