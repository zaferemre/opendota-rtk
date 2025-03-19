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

  background-color: rgba(255, 255, 255, 0.8);
  margin-left: 20px;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MatchesList = styled.ul`
  text-align: center;
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const MatchItem = styled.li`
  font-size: 0.85rem;
  border: 1px solid #ddd;
  padding: 5px 0;
  cursor: pointer;
  transition: all 0.25s;
  border-radius: 5px;

  &:hover {
    background-color: #3674b5;
    transform: scale(1.05);
    color: white;
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <CardContainer>
      <h2>Player Profile</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error loading data.</p>}
      {data && (
        <div>
          <img src={data.profile?.avatarfull} alt="Player Avatar" />
          <h3>{data.profile?.personaname || "Unknown Player"}</h3>
          <h4>Last Matches</h4>
          {isLoadingMatches && <p>Loading Matches...</p>}
          {errorMatches && (
            <p style={{ color: "red" }}>Error loading matches.</p>
          )}
          {lastMatches?.length > 0 ? (
            <MatchesList>
              {lastMatches.slice(0, 20).map((match, index) => (
                <MatchItem
                  key={index}
                  onClick={() => handleMatchClick(match.match_id)}
                >
                  Hero: {match.hero_id}, Match ID: {match.match_id}, KDA:{" "}
                  {match.kills}/{match.deaths}/{match.assists}, Duration:{" "}
                  {formatDuration(match.duration)}, Match Date:{" "}
                  {new Date(match.start_time * 1000).toLocaleString()},
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
