import React, { createContext } from "react";
import { usePackReducer } from "../hooks/usePackReducer";

export const PackContext = createContext();
export const PackProvider = ({ children }) => {
  const { state, addToPack, clearPack, createPack, substrackProductFromPack, updatePack } = usePackReducer();
  return (
    <PackContext.Provider
      value={{
        pack: state,
        addToPack,
        substrackProductFromPack,
        clearPack,
        createPack,
        updatePack,
      }}
    >
      {children}
    </PackContext.Provider>
  );
};
