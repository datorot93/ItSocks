import React, { createContext } from 'react'
import { useDiscountReducer } from '../hooks/useDiscountReducer'

export const DiscountContext = createContext()

export const DiscountProvider = ({ children }) => {
    const { state, addToDiscount, removeFromDiscount } = useDiscountReducer()
    return (
        <DiscountContext.Provider value={{
            discount: state,
            addToDiscount,
            removeFromDiscount
        }}>
            { children }
        </DiscountContext.Provider>
    )
}
