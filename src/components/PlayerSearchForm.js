import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerId } from "../features/counter/playerSlice";
import PlayerCard from "./PlayerCard";
import MatchCard from "./MatchCard";

const PlayerSearchForm = () => {
  const [inputId, setInputId] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputId) return;
    dispatch(setPlayerId(inputId)); // Update Redux store
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96">
      <h2 className="text-xl font-semibold mb-4">Search Dota Player</h2>
      <h5>Neptune ID: 112456116</h5>
      <h5>MERTKD ID: 133349867</h5>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="112456116"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>
      <PlayerCard />
      <MatchCard />
    </div>
  );
};

export default PlayerSearchForm;
