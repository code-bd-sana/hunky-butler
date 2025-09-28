import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth";
import usersTabReducer from "../features/userTab";
import adminToolTabReducer from "../features/AdminToolTab";
import sidebarReducer from "../features/sidebarSlice";
import { blogApi } from "@/features/blogApi";
import { servicesApi } from "@/features/services/servicesApi";
import { bookingApi } from "@/features/booking";


export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,

    // UI slices
    usersTab: usersTabReducer,
    adminToolTab: adminToolTabReducer,
    sidebar: sidebarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      blogApi.middleware,
      servicesApi.middleware,
      bookingApi.middleware
    ),
});
