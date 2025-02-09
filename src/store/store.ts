import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/slices/loginSlice";
import userReducer from "@/slices/userSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false });
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
