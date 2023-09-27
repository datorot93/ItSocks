export const packInitialState =
  JSON.parse(window.localStorage.getItem("pack")) || [];

export const PACK_ACTION_TYPES = {
  ADD_TO_PACK: "ADD_TO_PACK",
  REMOVE_FROM_PACK: "REMOVE_FROM_PACK",
  ADD_ONE_TO_PACK: "ADD_ONE_TO_PACK",
  SUBTRACT_ONE_TO_PACK: "SUBTRACT_ONE_TO_PACK",
  CLEAR_PACK: "CLEAR_PACK",
};

// update localStorage with state for pack
export const updateLocalStorage = (state) => {
  window.localStorage.setItem("pack", JSON.stringify(state));
};

const UPDATE_STATE_BY_ACTION = {
  
  [PACK_ACTION_TYPES.ADD_TO_PACK]: (state, action) => {
    const { id } = action.payload;
    const productInPackIndex = state.findIndex((item) => item.id === id);

    if (productInPackIndex >= 0) {

      const newState = [
        ...state.slice(0, productInPackIndex),
        {
          ...state[productInPackIndex],
          cantidad:
            state[productInPackIndex].cantidad + action.payload.cantidad,
        },
        ...state.slice(productInPackIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    const newState = [
      ...state,
      {
        ...action.payload, // product
        quantity: 1,
      },
    ];

    updateLocalStorage(newState);
    return newState;
  },

  [PACK_ACTION_TYPES.ADD_ONE_TO_PACK]: (state, action) => {
    const { id } = action.payload;
    const productInCartIndex = state.findIndex((item) => item.id === id);

    if (productInCartIndex >= 0) {
      const newState = [
        ...state.slice(0, productInCartIndex),
        {
          ...state[productInCartIndex],
          cantidad: state[productInCartIndex].cantidad + 1,
        },
        ...state.slice(productInCartIndex + 1),
      ];

      updateLocalStorage(newState);
      return newState;
    }

    const newState = [
      ...state,
      {
        ...action.payload, // product
        quantity: 1,
      },
    ];

    updateLocalStorage(newState);
    return newState;
  },

  [PACK_ACTION_TYPES.SUBTRACT_ONE_TO_PACK]: (state, action) => {
    const { id } = action.payload;
    const productInCartIndex = state.findIndex((item) => item.id === id);

    if (productInCartIndex >= 0) {
      if (state[productInCartIndex].cantidad > 0) {
        const newState = [
          ...state.slice(0, productInCartIndex),
          {
            ...state[productInCartIndex],
            cantidad: state[productInCartIndex].cantidad - 1,
          },
          ...state.slice(productInCartIndex + 1),
        ];
        updateLocalStorage(newState);
        return newState;
      }
    }
    return state;
  },

  [PACK_ACTION_TYPES.REMOVE_FROM_PACK]: (state, action) => {
    const { id } = action.payload;
    const newState = state.filter((item) => item.id !== id);
    updateLocalStorage(newState);
    return newState;
  },
  [PACK_ACTION_TYPES.CLEAR_CART]: () => {
    updateLocalStorage([]);
    return [];
  },
};

export const cartReducer = (state, action) => {
  const { type: actionType } = action;
  const updateState = UPDATE_STATE_BY_ACTION[actionType];
  return updateState ? updateState(state, action) : state;
};
