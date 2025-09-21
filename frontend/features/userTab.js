import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "customer", 
};

const usersTabSlice = createSlice({
  name: "usersTab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.activeTab = action.payload; 
    },
  },
});

export const { setTab } = usersTabSlice.actions;
export default usersTabSlice.reducer;
