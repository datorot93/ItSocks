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

    const { id, name, selected_size, selected_color, type } = action.payload
    const productExists = state.some(
      item => item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color && item.type === type
    );

    let newState;

    if (productExists) {
      newState = state.map(item => 
        item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color && item.type === type
        ? { ...item, cantidad: item.cantidad + action.payload.cantidad }
        : item
      );
    } else {
      newState = [...state, { ...action.payload }];
    }

    updateLocalStorage(newState)
    return newState
  },

  [WISH_ACTION_TYPES.ADD_ONE_TO_WISH]: (state, action) => {
    const { id, selected_size, selected_color, subcategory } = action.payload
    const productInWishIndex = state.findIndex(
      item => item.id === id && item.selected_size === selected_size && item.selected_color === selected_color && item.subcategory === subcategory
    )

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

    const { id, name, selected_color, selected_size } = action.payload

    const productInWishIndex = state.findIndex(
      item => item.name === name && item.id === id && item.selected_size == selected_size && item.selected_color == selected_color
    )

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



    const { id, name, subcategory, type, price, selected_color, selected_size } = action.payload

    const prod_a_eliminar = state.filter(
      item => item.name === name && item.id === id && item.selected_size === selected_size && item.selected_color === selected_color && item.type === type && item.subcategory === subcategory
    )

    const newState = state.filter(
      item => item !== prod_a_eliminar[0]
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
