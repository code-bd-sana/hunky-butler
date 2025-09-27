import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth";
import usersTabReducer from "../features/userTab";
import adminToolTabReducer from "../features/AdminToolTab";
import sidebarReducer from "../features/sidebarSlice";
import { servicesApi } from "@/features/services/servicesApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    usersTab: usersTabReducer,
    adminToolTab: adminToolTabReducer,
    sidebar: sidebarReducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, servicesApi.middleware),
});
