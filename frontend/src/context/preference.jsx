import React, { createContext } from 'react'
import { usePreferenceReducer } from '../hooks/usePreferenceReducer'

export const PreferenceContext = createContext()

export const PreferenceProvider = ({ children }) => {
    const { state, addToPreference, removeFromPreference } = usePreferenceReducer()
    return (
        <PreferenceContext.Provider value={{
            preference: state,
            addToPreference,
            removeFromPreference
        }}>
            { children }
        </PreferenceContext.Provider>
    )
}
