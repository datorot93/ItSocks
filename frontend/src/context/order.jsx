import React, { createContext } from "react";
import { useOrderReducer } from "../hooks/useOrder";

export const OrderContext = createContext();
export const OrderProvider = ({ children }) => {
  const { state, addToOrder, clearOrder, createOrder, substrackProductFromOrder, updateOrder } = useOrderReducer();
  return (
    <OrderContext.Provider
      value={{
        order: state,
        addToOrder,
        substrackProductFromOrder,
        clearOrder,
        createOrder,
        updateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
