import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetUserQuery,
  useGetLastMatchesQuery,
} from "../services/playerProfile";
import { setSelectedMatchId } from "../features/counter/matchSlice";

const CardContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  background: white;
`;

const MatchesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const MatchItem = styled.li`
  font-size: 0.85rem;
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
  cursor: pointer;
  color: blue;
  text-decoration: underline;
  &:hover {
    color: darkblue;
  }
`;

const PlayerCard = () => {
  const dispatch = useDispatch();
  const playerId = useSelector((state) => state.player?.playerId || "");
  const { data, error, isLoading } = useGetUserQuery(playerId, {
    skip: !playerId,
  });
  const {
    data: lastMatches,
    error: errorMatches,
    isLoading: isLoadingMatches,
  } = useGetLastMatchesQuery(playerId, {
    skip: !playerId,
  });

  const handleMatchClick = (matchId) => {
    dispatch(setSelectedMatchId(matchId)); // Dispatch match ID to Redux store
  };

  return (
    <CardContainer>
      <h2>Player Profile</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error loading data.</p>}
      {data && (
        <div>
          <h3>{data.profile?.personaname || "Unknown Player"}</h3>
          <h4>Last Matches</h4>
          {isLoadingMatches && <p>Loading Matches...</p>}
          {errorMatches && (
            <p style={{ color: "red" }}>Error loading matches.</p>
          )}
          {lastMatches?.length > 0 ? (
            <MatchesList>
              {lastMatches.slice(0, 10).map((match, index) => (
                <MatchItem
                  key={index}
                  onClick={() => handleMatchClick(match.match_id)}
                >
                  Match ID: {match.match_id}, KDA: {match.kills}/{match.deaths}/
                  {match.assists}
                </MatchItem>
              ))}
            </MatchesList>
          ) : (
            <p>No recent matches found</p>
          )}
        </div>
      )}
    </CardContainer>
  );
};

export default PlayerCard;
