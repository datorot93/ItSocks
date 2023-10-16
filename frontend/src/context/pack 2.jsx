import React, { createContext } from "react";
import { usePackReducer } from "../hooks/usePackReducer";

export const PackContext = createContext();
export const PackProvider = ({ children }) => {
  const { state, addToPack } = usePackReducer();
  return (
    <PackContext.Provider
      value={{
        pack: state,
        addToPack,
      }}
    >
      {children}
    </PackContext.Provider>
  );
};
