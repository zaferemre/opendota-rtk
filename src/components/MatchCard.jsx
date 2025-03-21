import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import itemIdtoName from "../utils/item_ids.json";
import itemNametoImage from "../utils/items.json";
import heroIdtoImg from "../utils/heroes.json";
import LaneHeatmap from "./LaneHeatmap";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const CardContainer = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const InfoRow = styled.div`
  margin-bottom: 12px;
  font-size: 1rem;
  color: #444;
`;

const TeamsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
`;

const TeamView = styled.div`
  flex: 1;
  padding: 16px;
  border-radius: 12px;
  background-color: ${(props) =>
    props.team === "radiant" ? "#e8f5e9" : "#ffebee"};
  border: 2px solid
    ${(props) => (props.team === "radiant" ? "#4caf50" : "#f44336")};
`;

const TeamTitle = styled.h4`
  text-align: center;
  margin-bottom: 12px;
  color: ${(props) => (props.team === "radiant" ? "#2e7d32" : "#c62828")};
  font-size: 1.1rem;
`;

const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerItem = styled.li`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const HeroIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-right: 12px;
  border-radius: 50%;
  object-fit: cover;
`;

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  strong {
    font-size: 1rem;
    margin-bottom: 4px;
  }

  span {
    font-size: 0.85rem;
    color: #555;
  }
`;

const PlayerInventory = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;

  img {
    width: 28px;
    height: 28px;
    object-fit: scale-down;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const MatchCard = () => {
  const matchId = useSelector((state) => state.match?.selectedMatchId || "");
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  const radiantPlayers = data
    ? data.players.filter((p) => p.player_slot >= 0 && p.player_slot <= 4)
    : [];

  const direPlayers = data
    ? data.players.filter((p) => p.player_slot >= 128 && p.player_slot <= 132)
    : [];

  return (
    <CardContainer>
      <h2>Match Summary</h2>
      {isLoading && <InfoRow>Loading...</InfoRow>}
      {error && <InfoRow style={{ color: "red" }}>Failed to load data</InfoRow>}
      {!data && !isLoading && <InfoRow>Select a match to view details</InfoRow>}
      {data && (
        <>
          <InfoRow>
            <strong>Match ID:</strong> {data.match_id}
          </InfoRow>
          <InfoRow>
            <strong>Duration:</strong> {formatDuration(data.duration)}
          </InfoRow>
          <InfoRow>
            <strong>Game Mode:</strong> {data.game_mode}
          </InfoRow>
          <InfoRow>
            <strong>Winner:</strong> {data.radiant_win ? "Radiant" : "Dire"}
          </InfoRow>

          <TeamsContainer>
            <TeamView team="radiant">
              <TeamTitle team="radiant">Radiant</TeamTitle>
              <PlayersList>
                {radiantPlayers.map((p, idx) => (
                  <PlayerItem key={idx}>
                    <HeroIcon
                      src={`${cdnBase}${heroIdtoImg[p.hero_id]?.img}`}
                      alt={`Hero ${p.hero_id}`}
                    />
                    <PlayerInfo>
                      <strong>{p.personaname || "Unknown"}</strong>
                      <span>
                        KDA: {p.kills}/{p.deaths}/{p.assists}
                      </span>
                      <span>Level: {p.level}</span>
                      <span>TF participation: {p.teamfight_participation}</span>
                      <span>Lane Efficiency: {p.lane_efficiency}</span>
                      <span>Lane: {p.lane}</span>
                      <span>GPM: {p.gold_per_min}</span>
                      <span>XPM: {p.xp_per_min}</span>
                    </PlayerInfo>
                    <PlayerInventory>
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const itemId = p[`item_${i}`];
                        if (!itemId) return null;
                        const itemName = itemIdtoName[itemId];
                        const itemData = itemName && itemNametoImage[itemName];
                        return (
                          itemData && (
                            <img
                              key={i}
                              src={`${cdnBase}${itemData.img}`}
                              alt={itemName}
                              title={itemName}
                            />
                          )
                        );
                      })}
                    </PlayerInventory>
                  </PlayerItem>
                ))}
              </PlayersList>
            </TeamView>

            <TeamView team="dire">
              <TeamTitle team="dire">Dire</TeamTitle>
              <PlayersList>
                {direPlayers.map((p, idx) => (
                  <PlayerItem key={idx}>
                    <HeroIcon
                      src={`${cdnBase}${heroIdtoImg[p.hero_id]?.img}`}
                      alt={`Hero ${p.hero_id}`}
                    />
                    <PlayerInfo>
                      <strong>{p.personaname || "Unknown"}</strong>
                      <span>
                        KDA: {p.kills}/{p.deaths}/{p.assists}
                      </span>
                      <span>Level: {p.level}</span>
                      <span>TF participation: {p.teamfight_participation}</span>
                      <span>Lane Efficiency: {p.lane_efficiency}</span>
                      <span>Lane: {p.lane}</span>
                      <span>GPM: {p.gold_per_min}</span>
                      <span>XPM: {p.xp_per_min}</span>
                    </PlayerInfo>
                    <PlayerInventory>
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const itemId = p[`item_${i}`];
                        if (!itemId) return null;
                        const itemName = itemIdtoName[itemId];
                        const itemData = itemName && itemNametoImage[itemName];
                        return (
                          itemData && (
                            <img
                              key={i}
                              src={`${cdnBase}${itemData.img}`}
                              alt={itemName}
                              title={itemName}
                            />
                          )
                        );
                      })}
                    </PlayerInventory>
                  </PlayerItem>
                ))}
              </PlayersList>
            </TeamView>
          </TeamsContainer>
        </>
      )}
    </CardContainer>
  );
};

export default MatchCard;
