export const orderInitialState = 
  JSON.parse(window.localStorage.getItem("order")) ?  JSON.parse(window.localStorage.getItem("order")) : {};

// console.log(orderInitialState)

export const ORDER_ACTION_TYPES = {
  ADD_TO_ORDER: "ADD_TO_ORDER",
  REMOVE_FROM_ORDER: "REMOVE_FROM_ORDER",
  ADD_ONE_TO_ORDER: "ADD_ONE_TO_ORDER",
  SUBTRACT_ONE_TO_ORDER: "SUBTRACT_ONE_TO_ORDER",
  SUBSTRACT_PRODUCT_FROM_ORDER: "SUBSTRACT_PRODUCT_FROM_ORDER",
  CLEAR_ORDER: "CLEAR_ORDER",
  CREATE_ORDER: "CREATE_ORDER",
  UPDATE_ORDER: 'UDATE_ORDER'
};

// update localStorage with state for order
export const updateLocalStorage = (state) => {
  window.localStorage.setItem("order", JSON.stringify(state));
};


const UPDATE_STATE_BY_ACTION = {


  [ORDER_ACTION_TYPES.ADD_TO_ORDER]: (state, action) => {

    const newState = action.payload;

    return newState;
  },


  [ORDER_ACTION_TYPES.CLEAR_ORDER]: () => {
    updateLocalStorage({});
    return {};
  },


  [ORDER_ACTION_TYPES.CREATE_ORDER]: (state, action) => {

    updateLocalStorage(action.payload);

    return action.payload;
    
  },


  [ORDER_ACTION_TYPES.SUBSTRACT_PRODUCT_FROM_ORDER]: (state, action) => {
    
    if ( state.prductos.length > 0) {
      const newState = {
        ...state,
        prductos: state.prductos.filter((item) => item.id !== action.payload.id)
      }
      updateLocalStorage(newState);
      return newState;
    }
  },

  [ORDER_ACTION_TYPES.UPDATE_ORDER]: (state) => {

    updateLocalStorage(state);
    return state;
  }
};

export const orderReducer = (state, action) => {
  const { type: actionType } = action
  const updateState = UPDATE_STATE_BY_ACTION[actionType]
  return updateState ? updateState(state, action) : state
};
