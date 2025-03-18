import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playerId: "112456116",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerId: (state, action) => {
      state.playerId = action.payload;
    },
  },
});

export const { setPlayerId } = playerSlice.actions;
export default playerSlice.reducer;
