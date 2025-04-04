import React, { createContext } from 'react'
import { useCartReducer } from '../hooks/useCartReducer'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const { state, addToCart, addPackToCart, removeFromCart, addOneToCart, subtractOneToCart, clearCart, modifyCartProduct } = useCartReducer()
    return (
        <CartContext.Provider value={{
            cart: state,
            addToCart,
            addPackToCart,
            removeFromCart,
            addOneToCart,
            subtractOneToCart,
            clearCart,
            modifyCartProduct
        }}>
            { children }
        </CartContext.Provider>
    )
}
