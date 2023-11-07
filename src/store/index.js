import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import authenticationReducer from "./slices/AuthenticationSlice";
import commonReducer from "./slices/commonSlice";
import currenyReducer from "./slices/currencySlice";
import notificationReducer from "./slices/notificationSlice";
import userReducer from "./slices/UserSlice";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  notificationReducer,
  currenyReducer,
  authenticationReducer,
  userReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
