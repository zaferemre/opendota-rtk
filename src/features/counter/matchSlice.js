import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMatchId: null,
  selectedTeamfight: null,
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedMatchId: (state, action) => {
      state.selectedMatchId = action.payload;
    },
    setSelectedTeamfight: (state, action) => {
      state.selectedTeamfight = action.payload;
    },
    clearSelectedTeamfight: (state) => {
      state.selectedTeamfight = null;
    },
  },
});

export const {
  setSelectedMatchId,
  setSelectedTeamfight,
  clearSelectedTeamfight,
} = matchSlice.actions;
export default matchSlice.reducer;
