import { useContext } from 'react'
import { PackContext } from '../context/pack'

export const usePack = () => {
    const context = useContext(PackContext)
    if (context === undefined){
        throw new Error('usePack must be used within a PackProvider')
    }

    return context
}