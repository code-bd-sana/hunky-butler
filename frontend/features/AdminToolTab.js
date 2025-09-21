import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "notification", 
};

const adminToolTabSlice = createSlice({
  name: "adminToolTab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.activeTab = action.payload; 
    },
  },
});

export const { setTab } = adminToolTabSlice.actions;
export default adminToolTabSlice.reducer;
