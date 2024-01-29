export const cartInitialState = JSON.parse(window.localStorage.getItem('cart')) || []

export const CART_ACTION_TYPES = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  ADD_ONE_TO_CART: 'ADD_ONE_TO_CART',
  SUBTRACT_ONE_TO_CART: 'SUBTRACT_ONE_TO_CART',
  CLEAR_CART: 'CLEAR_CART'
}

// update localStorage with state for cart
export const updateLocalStorage = state => {
  window.localStorage.setItem('cart', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {
  [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
    const { id, name } = action.payload
    const productInCartIndex = state.findIndex(item => item.name === name && item.id === id)

    if (productInCartIndex > 0) {
      const newState = [
        ...state.slice(0, productInCartIndex),
        { ...state[productInCartIndex], cantidad: state[productInCartIndex].cantidad + action.payload.cantidad },
        ...state.slice(productInCartIndex + 1)
      ]
      
      updateLocalStorage(newState)
      return newState
    }

    const newState = [
      ...state,
      {
        ...action.payload
      }
    ]

    updateLocalStorage(newState)
    return newState
  },

  [CART_ACTION_TYPES.ADD_ONE_TO_CART]: (state, action) => {
    const { id } = action.payload
    const productInCartIndex = state.findIndex(item => item.id === id)

    if (productInCartIndex >= 0) {
      const newState = [
        ...state.slice(0, productInCartIndex),
        { ...state[productInCartIndex], cantidad: state[productInCartIndex].cantidad + 1 },
        ...state.slice(productInCartIndex + 1)
      ]
      
      updateLocalStorage(newState)
      return newState
    }

    const newState = [
      ...state,
      {
        ...action.payload, // product
        quantity: 1
      }
    ]

    updateLocalStorage(newState)
    return newState
  },
  
  [CART_ACTION_TYPES.SUBTRACT_ONE_TO_CART]: (state, action) => {
    console.log(action.payload)
    const { id, name } = action.payload
    const productInCartIndex = state.findIndex(item => item.id === id && item.name === name)

    if (productInCartIndex !== -1) {
      if ( state[productInCartIndex].cantidad > 1){
        const newState = [
          ...state.slice(0, productInCartIndex),
          { ...state[productInCartIndex], cantidad: state[productInCartIndex].cantidad - 1 },
          ...state.slice(productInCartIndex + 1)
        ]
        updateLocalStorage(newState)
        return newState
      } 
    }
    return state
  },

  [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {

    const { id, name, subcategory, price } = action.payload
    const newState = state.filter(
      item => item.id !== id && item.name !== name && item.subcategory !== subcategory && item.price !== price
    )
    updateLocalStorage(newState)
    return newState
  },
  [CART_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([])
    return []
  }
}

export const cartReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
