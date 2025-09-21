import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth";
import usersTabReducer from "../features/userTab";
import adminToolTabReducer from "../features/AdminToolTab";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    usersTab: usersTabReducer,
    adminToolTab: adminToolTabReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
