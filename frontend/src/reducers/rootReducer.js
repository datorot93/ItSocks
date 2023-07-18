import { combineReducers } from 'redux';

// import { authReducer } from './authReducer';
// import { messageReducer } from './messageReducer';
import { productReducer } from './productReducer';

export const rootReducer = combineReducers({
    product: productReducer,
});