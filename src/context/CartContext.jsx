import { createContext, useEffect, useState } from "react";

import API from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const customerId = localStorage.getItem("customerId");

      // only reset if user actually logged out
      if (!token || !customerId) {
        setCartCount(0);

        return;
      }

      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,

          customerid: customerId,
        },
      });

      const items = res.data.cart || [];

      setCartCount(items.length);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();

    const updateCart = () => {
      fetchCart();
    };

    window.addEventListener("storage", fetchCart);

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("storage", fetchCart);

      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
