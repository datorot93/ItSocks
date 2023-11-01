import { useContext } from 'react'
import { ShippingContext } from '../context/shipping'

export const useShipping = () => {
    const context = useContext(ShippingContext)

    if (context === undefined){
        throw new Error('shippingCart must be used within a ShippingProvider')
    }

    return context
}