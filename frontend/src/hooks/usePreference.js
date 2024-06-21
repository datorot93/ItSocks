import { useContext } from 'react'
import { PreferenceContext } from '../context/preference'

export const usePreference = () => {
    const context = useContext(PreferenceContext)

    if (context === undefined){
        throw new Error('Preference must be used within a PreferenceProvider')
    }

    return context
}