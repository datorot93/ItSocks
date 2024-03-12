export const packInitialState = 
  JSON.parse(window.localStorage.getItem("pack")) ?  JSON.parse(window.localStorage.getItem("pack")) : {};

// console.log(packInitialState)

export const PACK_ACTION_TYPES = {
  ADD_TO_PACK: "ADD_TO_PACK",
  REMOVE_FROM_PACK: "REMOVE_FROM_PACK",
  ADD_ONE_TO_PACK: "ADD_ONE_TO_PACK",
  SUBTRACT_ONE_TO_PACK: "SUBTRACT_ONE_TO_PACK",
  SUBSTRACT_PRODUCT_FROM_PACK: "SUBSTRACT_PRODUCT_FROM_PACK",
  CLEAR_PACK: "CLEAR_PACK",
  CREATE_PACK: "CREATE_PACK",
  UPDATE_PACK: 'UDATE_PACK'
};

// update localStorage with state for pack
export const updateLocalStorage = (state) => {
  window.localStorage.setItem("pack", JSON.stringify(state));
};


const UPDATE_STATE_BY_ACTION = {


  [PACK_ACTION_TYPES.ADD_TO_PACK]: (state, action) => {

    
    if ( state.prductos.length < state.product_quantity) {
      
      const newState = 
        {
          ...state,
          prductos: [...state.prductos, action.payload]
        }

      updateLocalStorage(newState);
      return newState;
    }

    return state;
  },


  [PACK_ACTION_TYPES.CLEAR_PACK]: () => {
    updateLocalStorage({});
    return {};
  },


  [PACK_ACTION_TYPES.CREATE_PACK]: (state, action) => {

    updateLocalStorage(action.payload);

    return action.payload;
    
  },


  [PACK_ACTION_TYPES.SUBSTRACT_PRODUCT_FROM_PACK]: (state, action) => {
    
    if ( state.prductos.length > 0) {
      const newState = {
        ...state,
        prductos: state.prductos.filter((item) => item.id !== action.payload.id)
      }
      updateLocalStorage(newState);
      return newState;
    }
  },

  [PACK_ACTION_TYPES.UPDATE_PACK]: (state) => {

    updateLocalStorage(state);
    return state;
  }

  // [PACK_ACTION_TYPES.ADD_ONE_TO_PACK]: (state, action) => {
  //   const { id } = action.payload;
  //   const productInPackIndex = state.findIndex((item) => item.id === id);

  //   if (productInPackIndex >= 0) {
  //     const newState = [
  //       ...state.slice(0, productInPackIndex),
  //       {
  //         ...state[productInPackIndex],
  //         cantidad: state[productInPackIndex].cantidad + 1,
  //       },
  //       ...state.slice(productInPackIndex + 1),
  //     ];

  //     updateLocalStorage(newState);
  //     return newState;
  //   }

  //   const newState = [
  //     ...state,
  //     {
  //       ...action.payload, // product
  //       quantity: 1,
  //     },
  //   ];

  //   updateLocalStorage(newState);
  //   return newState;
  // },

  // [PACK_ACTION_TYPES.SUBTRACT_ONE_TO_PACK]: (state, action) => {
  //   const { id } = action.payload;
  //   const productInPackIndex = state.findIndex((item) => item.id === id);

  //   if (productInPackIndex >= 0) {
  //     if (state[productInPackIndex].cantidad > 0) {
  //       const newState = [
  //         ...state.slice(0, productInPackIndex),
  //         {
  //           ...state[productInPackIndex],
  //           cantidad: state[productInPackIndex].cantidad - 1,
  //         },
  //         ...state.slice(productInPackIndex + 1),
  //       ];
  //       updateLocalStorage(newState);
  //       return newState;
  //     }
  //   }
  //   return state;
  // },

  // [PACK_ACTION_TYPES.REMOVE_FROM_PACK]: (state, action) => {
  //   const { id } = action.payload;
  //   const newState = state.filter((item) => item.id !== id);
  //   updateLocalStorage(newState);
  //   return newState;
  // },
  
  
};

export const packReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
};
