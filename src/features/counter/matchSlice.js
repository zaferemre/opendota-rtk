import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMatchId: null,
  selectedTeamfight: null,
  hoveredTeamfightIndex: null,
  matchData: null,
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setSelectedMatchId: (state, action) => {
      state.selectedMatchId = action.payload;
    },
    setSelectedTeamfight: (state, action) => {
      state.selectedTeamfight = action.payload;
    },
    setHoveredTeamfightIndex: (state, action) => {
      state.hoveredTeamfightIndex = action.payload;
    },
    clearSelectedTeamfight: (state) => {
      state.selectedTeamfight = null;
    },
    setMatchData: (state, action) => {
      state.matchData = action.payload;
    },
  },
});

export const {
  setSelectedMatchId,
  setSelectedTeamfight,
  setHoveredTeamfightIndex,
  clearSelectedTeamfight,
  setMatchData,
} = matchSlice.actions;

export default matchSlice.reducer; // ✅ Default export the reducer
