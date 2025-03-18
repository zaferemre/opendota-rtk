import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";

const CardContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
  background: white;
  margin-top: 20px;
`;

const InfoText = styled.p`
  color: gray;
  font-size: 0.9rem;
`;

const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const PlayerItem = styled.li`
  font-size: 0.85rem;
  border-bottom: 1px solid #ddd;
  padding: 5px 0;
`;

const MatchCard = () => {
  const matchId = useSelector((state) => state.match?.selectedMatchId || ""); // Get selected match ID
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  return (
    <CardContainer>
      <h2>Match Info</h2>
      {isLoading && <InfoText>Loading...</InfoText>}
      {error && (
        <InfoText style={{ color: "red" }}>Error loading match data.</InfoText>
      )}
      {!data && !isLoading && <InfoText>Select a match to view Info</InfoText>}
      {data && (
        <div>
          <h3>Match ID: {data.match_id}</h3>
          <InfoText>Duration: {data.duration} seconds</InfoText>
          <InfoText>Game Mode: {data.game_mode}</InfoText>
          <InfoText>Winner: {data.radiant_win ? "Radiant" : "Dire"}</InfoText>
          <h4>Players</h4>
          <PlayersList>
            {data.players?.map((player, index) => (
              <PlayerItem key={index}>
                {player.personaname || "Unknown Player"} - KDA: {player.kills}/
                {player.deaths}/{player.assists}
              </PlayerItem>
            ))}
          </PlayersList>
        </div>
      )}
    </CardContainer>
  );
};

export default MatchCard;
