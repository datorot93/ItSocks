export const wishInitialState = JSON.parse(window.localStorage.getItem('wish')) || []

export const WISH_ACTION_TYPES = {
  ADD_TO_WISH: 'ADD_TO_WISH',
  REMOVE_FROM_WISH: 'REMOVE_FROM_WISH',
  ADD_ONE_TO_WISH: 'ADD_ONE_TO_WISH',
  SUBTRACT_ONE_TO_WISH: 'SUBTRACT_ONE_TO_WISH',
  CLEAR_WISH: 'CLEAR_WISH'
}

// update localStorage with state for wish
export const updateLocalStorage = state => {
  window.localStorage.setItem('wish', JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {
  [WISH_ACTION_TYPES.ADD_TO_WISH]: (state, action) => {
    const { id, name } = action.payload
    const productInWishIndex = state.findIndex(item => item.name === name && item.id === id)

    if (productInWishIndex > 0) {
      const newState = [
        ...state.slice(0, productInWishIndex),
        { ...state[productInWishIndex], cantidad: state[productInWishIndex].cantidad + action.payload.cantidad },
        ...state.slice(productInWishIndex + 1)
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

  [WISH_ACTION_TYPES.ADD_ONE_TO_WISH]: (state, action) => {
    const { id } = action.payload
    const productInWishIndex = state.findIndex(item => item.id === id)

    if (productInWishIndex >= 0) {
      const newState = [
        ...state.slice(0, productInWishIndex),
        { ...state[productInWishIndex], cantidad: state[productInWishIndex].cantidad + 1 },
        ...state.slice(productInWishIndex + 1)
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
  
  [WISH_ACTION_TYPES.SUBTRACT_ONE_TO_WISH]: (state, action) => {
    console.log(action.payload)
    const { id, name } = action.payload
    const productInWishIndex = state.findIndex(item => item.id === id && item.name === name)

    if (productInWishIndex !== -1) {
      if ( state[productInWishIndex].cantidad > 1){
        const newState = [
          ...state.slice(0, productInWishIndex),
          { ...state[productInWishIndex], cantidad: state[productInWishIndex].cantidad - 1 },
          ...state.slice(productInWishIndex + 1)
        ]
        updateLocalStorage(newState)
        return newState
      } 
    }
    return state
  },

  [WISH_ACTION_TYPES.REMOVE_FROM_WISH]: (state, action) => {

    // console.log('PRODUCTO')
    // console.log(action.payload)

    const { id, name, subcategory, price } = action.payload
    // console.log('ESTADO')
    // console.log(state)
    // console.log('FILTRO')
    // console.log(state.filter(
    //   item => item.id !== id
    // ))
    const newState = state.filter(
      item => item.id !== id
    )
    updateLocalStorage(newState)
    return newState
  },
  [WISH_ACTION_TYPES.CLEAR_WISH]: () => {
    updateLocalStorage([])
    return []
  }
}

export const wishReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
}
