import React, { createContext } from 'react'
import { useWishReducer } from '../hooks/useWishReducer'

export const WishContext = createContext()

export const WishProvider = ({ children }) => {
    const { state, addToWish, removeFromWish, addOneToWish, subtractOneToWish } = useWishReducer()
    return (
        <WishContext.Provider value={{
            wish: state,
            addToWish,
            removeFromWish,
            addOneToWish,
            subtractOneToWish
        }}>
            { children }
        </WishContext.Provider>
    )
}
