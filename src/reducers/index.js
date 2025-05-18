// import { combineReducers } from "redux";
// // import cartReducer from "./cart";

// export const allReducers = combineReducers({
//     // cartReducer,

// });


// reducers/index.js
import { combineReducers } from 'redux';
import someReducer from './someReducer';

const allReducers = combineReducers({
    some: someReducer,
});

export default allReducers; // <- cần dòng này
