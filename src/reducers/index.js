import { combineReducers } from "redux";
import someReducer from "./someReducer";

const allReducers = combineReducers({
  some: someReducer,
});

export default allReducers; // <- cần dòng này
