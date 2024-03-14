import { useContext } from 'react'
import { WishContext } from '../context/wish'

export const useWish = () => {
    const context = useContext(WishContext)
    if (context === undefined){
        throw new Error('useWish must be used within a WishProvider')
    }

    return context
}