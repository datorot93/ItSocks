import React, { createContext } from 'react'
import { useShippingReducer } from '../hooks/useShippingReducer'

export const ShippingContext = createContext()

export const ShippingProvider = ({ children }) => {
    const { state, addShipping, modifyShipping } = useShippingReducer()
    return (
        <ShippingContext.Provider value={{
            shipping: state,
            addShipping,
            modifyShipping
        }}>
            { children }
        </ShippingContext.Provider>
    )
}
