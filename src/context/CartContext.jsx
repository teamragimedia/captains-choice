import { createContext, useCallback, useEffect, useState } from "react";
import API from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    if (!token || !customerId) {
      setCartCount(0);
      return;
    }

    try {
      const response = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
          customerid: customerId,
        },
      });

      const items = Array.isArray(response.data?.cart)
        ? response.data.cart
        : [];

      const count = items.reduce(
        (total, item) => total + Math.max(0, Number(item.quantity) || 0),
        0,
      );

      setCartCount(count);
    } catch (error) {
      console.error(
        "Unable to refresh cart count:",
        error.response?.data || error.message,
      );
    }
  }, []);

  useEffect(() => {
    fetchCart();

    const handleCartUpdated = () => {
      fetchCart();
    };

    const handleStorage = (event) => {
      if (
        !event ||
        event.key === "token" ||
        event.key === "customerId" ||
        event.key === null
      ) {
        fetchCart();
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
