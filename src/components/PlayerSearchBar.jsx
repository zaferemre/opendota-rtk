// src/components/PlayerSearchBar.jsx
import React, { useState } from "react";
import { useSearchPlayersQuery } from "../services/playerProfile";
import { Link } from "react-router-dom";

export default function PlayerSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const { data: results = [], isFetching, error } = useSearchPlayersQuery(submittedTerm, {
    skip: !submittedTerm, // Skip initial query until user submits
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedTerm(searchTerm.trim());
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for player..."
          style={{ width: "100%", padding: "0.5rem", borderRadius: "4px" }}
        />
      </form>

      {isFetching && <p>Searching...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <ul>
        {[...results]
          .sort((a, b) => new Date(b.last_match_time) - new Date(a.last_match_time))
          .map((player) => (
            <li key={player.account_id}>
              <Link
                to={`/player/${player.account_id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "black",
                  marginBottom: "0.5rem",
                }}
              >
                <img
                  src={player.avatarfull}
                  alt={player.personaname}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                {player.personaname} ({player.account_id})
              </Link>
            </li>
          ))}
      </ul>

    </div>
  );
}
