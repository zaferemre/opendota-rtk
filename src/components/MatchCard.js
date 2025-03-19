import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import itemIdtoName from "../utils/item_ids.json";
import itemNametoImage from "../utils/items.json";
import heroIdtoImg from "../utils/heroes.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const CardContainer = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const TeamsContainer = styled.div`
  display: flex;
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
  margin-bottom: 16px;
  color: ${(props) => (props.team === "radiant" ? "#2e7d32" : "#c62828")};
`;

const PlayersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlayerItem = styled.li`
  display: flex;
  flex-direction: column;
  background: #fafafa;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  .player-info {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    img.hero {
      width: 60px;
      height: 60px;
      margin-right: 12px;
      object-fit:
      border-radius: 50%;
    }

    .details {
      flex: 1;
      text-align: left;
      strong {
        font-size: 1.1rem;
      }
      div {
        font-size: 0.9rem;
        margin-top: 4px;
      }
    }
  }
`;

const PlayerInventory = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: scale-down;
    border: 1px solid #ddd;
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

  // Filter players for each team
  const radiantPlayers = data
    ? data.players.filter(
        (player) => player.player_slot >= 0 && player.player_slot <= 4
      )
    : [];
  const direPlayers = data
    ? data.players.filter(
        (player) => player.player_slot >= 128 && player.player_slot <= 132
      )
    : [];

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
          <InfoText>Duration: {formatDuration(data.duration)}</InfoText>
          <InfoText>Game Mode: {data.game_mode}</InfoText>
          <InfoText>Winner: {data.radiant_win ? "Radiant" : "Dire"}</InfoText>
          <TeamsContainer>
            <TeamView team="radiant">
              <TeamTitle team="radiant">Radiant Players</TeamTitle>
              <PlayersList>
                {radiantPlayers.map((player, index) => (
                  <PlayerItem key={index}>
                    <div className="player-info">
                      <img
                        className="hero"
                        src={`${cdnBase}${heroIdtoImg[player.hero_id].img}`}
                        alt={`Hero ${player.hero_id}`}
                      />
                      <div className="details">
                        <strong>
                          {player.personaname || "Unknown Player"}
                        </strong>
                        <div>
                          KDA: {player.kills}/{player.deaths}/{player.assists}
                        </div>
                        <div>Level: {player.level}</div>
                      </div>
                    </div>
                    <PlayerInventory>
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const itemId = player[`item_${i}`];
                        if (!itemId) return null;
                        const itemName = itemIdtoName[itemId];
                        const imageData = itemName && itemNametoImage[itemName];
                        if (!imageData) return null;
                        return (
                          <img
                            key={i}
                            src={`${cdnBase}${imageData.img}`}
                            alt={`Item ${i}`}
                          />
                        );
                      })}
                    </PlayerInventory>
                  </PlayerItem>
                ))}
              </PlayersList>
            </TeamView>
            <TeamView team="dire">
              <TeamTitle team="dire">Dire Players</TeamTitle>
              <PlayersList>
                {direPlayers.map((player, index) => (
                  <PlayerItem key={index}>
                    <div className="player-info">
                      <img
                        className="hero"
                        src={`${cdnBase}${heroIdtoImg[player.hero_id].img}`}
                        alt={`Hero ${player.hero_id}`}
                      />
                      <div className="details">
                        <strong>
                          {player.personaname || "Unknown Player"}
                        </strong>
                        <div>
                          KDA: {player.kills}/{player.deaths}/{player.assists}
                        </div>
                        <div>Level: {player.level}</div>
                      </div>
                    </div>
                    <PlayerInventory>
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const itemId = player[`item_${i}`];
                        if (!itemId) return null;
                        const itemName = itemIdtoName[itemId];
                        const imageData = itemName && itemNametoImage[itemName];
                        if (!imageData) return null;
                        return (
                          <img
                            key={i}
                            src={`${cdnBase}${imageData.img}`}
                            alt={`Item ${i}`}
                          />
                        );
                      })}
                    </PlayerInventory>
                  </PlayerItem>
                ))}
              </PlayersList>
            </TeamView>
          </TeamsContainer>
        </div>
      )}
    </CardContainer>
  );
};

export default MatchCard;
