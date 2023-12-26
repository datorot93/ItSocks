import React, { createContext } from "react";
import { usePackReducer } from "../hooks/usePackReducer";

export const PackContext = createContext();
export const PackProvider = ({ children }) => {
  const { state, addToPack, clearPack, createPack } = usePackReducer();
  return (
    <PackContext.Provider
      value={{
        pack: state,
        addToPack,
        clearPack,
        createPack,
      }}
    >
      {children}
    </PackContext.Provider>
  );
};
