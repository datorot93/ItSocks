import React, { createContext } from 'react'
import { useCartReducer } from '../hooks/useCartReducer'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const { state, addToCart, removeFromCart, addOneToCart, subtractOneToCart } = useCartReducer()
    return (
        <CartContext.Provider value={{
            cart: state,
            addToCart,
            removeFromCart,
            addOneToCart,
            subtractOneToCart
        }}>
            { children }
        </CartContext.Provider>
    )
}
