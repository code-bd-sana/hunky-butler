import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth";
import usersTabReducer from "../features/userTab";
import adminToolTabReducer from "../features/AdminToolTab";
import sidebarReducer from "../features/sidebarSlice";
import { blogApi } from "@/features/blogApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    usersTab: usersTabReducer,
    adminToolTab: adminToolTabReducer,
    sidebar: sidebarReducer,
    [blogApi.reducerPath]: blogApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(blogApi.middleware),
});
