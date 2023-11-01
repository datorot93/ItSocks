
import React, { createContext, useReducer } from 'react'
import { packReducer, packInitialState } from '../reducers/packReducer'
// console.log(packInitialState)

// console.log('PACK REDUCER')
// console.log(packInitialState)

export const usePackReducer = () => {

  const [ state, dispatch ] = useReducer(packReducer, packInitialState)

  const addToPack = product => dispatch({
    type: 'ADD_TO_PACK',
    payload: product
  })

  const addOneToPack = product => dispatch({
    type: 'ADD_ONE_TO_PACk',
    payload: product
  })

  const subtractOneToPack = product => dispatch({
    type: 'SUBTRACT_ONE_TO_PACk',
    payload: product
  })

  const removeFromPack = product => dispatch({
    type: 'REMOVE_FROM_PACk',
    payload: product
  })

  return { state, addToPack, removeFromPack, addOneToPack, subtractOneToPack}
}