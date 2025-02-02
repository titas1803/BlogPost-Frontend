import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/slices/loginSlice";
export type AppDispatch = typeof store.dispatch;
export const store = configureStore({
  reducer: {
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});
