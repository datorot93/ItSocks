import React, { createContext, useReducer } from 'react'
import { preferenceReducer, preferenceInitialState } from '../reducers/preferenceReducer'

export const usePreferenceReducer = () => {

  const [ state, dispatch ] = useReducer(preferenceReducer, preferenceInitialState)
  
  const addToPreference = preference => dispatch({
    type: 'ADD_TO_PREFERENCE',
    payload: preference
  })

  const removeFromPreference = preference => dispatch({
    type: 'REMOVE_FROM_PREFERENCE',
    payload: preference
  })

  return { state, addToPreference, removeFromPreference}
}