import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import { apiSlice } from "../slice/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
