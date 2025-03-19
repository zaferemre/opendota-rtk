import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import itemIdtoName from "../utils/item_ids.json";
import itemNametoImage from "../utils/items.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const CardContainer = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  right: 0;
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
const PlayerInventory = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: scale-down;
  }
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
                {player.deaths}/{player.assists} - Level: {player.level} -
                <PlayerInventory>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const itemId = player[`item_${i}`];
                    // If there is no item, you can return null or a placeholder.
                    if (!itemId) return null;
                    const itemName = itemIdtoName[itemId];
                    const imageData = itemName && itemNametoImage[itemName];

                    // If imageData is not available, skip rendering this image.
                    if (!imageData) return null;

                    return (
                      <img
                        key={i}
                        src={`${cdnBase}${imageData.img}`}
                        alt={`item ${i}`}
                      />
                    );
                  })}
                </PlayerInventory>
              </PlayerItem>
            ))}
          </PlayersList>
        </div>
      )}
    </CardContainer>
  );
};

export default MatchCard;
