import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMatchId: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedMatchId: (state, action) => {
      state.selectedMatchId = action.payload;
    },
  },
});

export const { setSelectedMatchId } = matchSlice.actions;
export default matchSlice.reducer;
