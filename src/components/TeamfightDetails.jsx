import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { clearSelectedTeamfight } from "../features/counter/matchSlice";
import AbilityUsesSection from "./AbilityUsesSection";
import ItemUsesSection from "./ItemUsesSection";
import heroIdtoImg from "../utils/heroes.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const Container = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 24px;
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 12px;
`;

const CloseButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  font-weight: bold;
  transition: background 0.3s;
  &:hover {
    background: #d32f2f;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const FieldLabel = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
`;

const PlayerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const PlayerCard = styled.div`
  flex: 1 1 300px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border: 1px solid #ddd;
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const HeroImg = styled.img`
  height: 50px;
  margin-right: 12px;
  border-radius: 6px;
  border: 1px solid #aaa;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.div`
  font-weight: bold;
  font-size: 1rem;
`;

const Preformatted = styled.pre`
  font-size: 0.85rem;
  overflow-x: auto;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;
const DeathIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1rem;
  color: red;
`;

const BuybackBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.85rem;
  background-color: ${({ used }) => (used ? "#4caf50" : "#bbb")};
  color: white;
  font-weight: bold;
`;

const TeamfightDetails = () => {
  const dispatch = useDispatch();
  const selectedTeamfight = useSelector(
    (state) => state.match.selectedTeamfight
  );
  const matchData = useSelector((state) => state.match.matchData); // ⬅️ make sure to store full matchData in Redux

  if (!selectedTeamfight) {
    return (
      <Container>
        <p>
          No teamfight selected. Please click on a teamfight to see its details.
        </p>
      </Container>
    );
  }

  const { start, end, last_death, deaths, players } = selectedTeamfight;
  const allPlayers = matchData?.players || [];

  const renderKilledHeroes = (killedObj) => {
    if (!killedObj || Object.keys(killedObj).length === 0) return "N/A";

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {Object.entries(killedObj).map(([heroName, count], idx) => {
          const matchedHero = Object.values(heroIdtoImg).find(
            (hero) => hero.name === heroName
          );

          if (!matchedHero) {
            return (
              <div key={idx}>
                ❓ {heroName} ×{count}
              </div>
            );
          }

          return (
            <div
              key={idx}
              style={{
                position: "relative",

                height: "40px",
              }}
            >
              <img
                src={`${cdnBase}${matchedHero.img}`}
                alt={heroName}
                title={heroName
                  .replace("npc_dota_hero_", "")
                  .replace(/_/g, " ")}
                style={{
                  height: "100%",

                  border: "1px solid #ccc",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  background: "#222",
                  color: "#fff",
                  fontSize: "0.75rem",
                  padding: "2px 5px",
                  borderRadius: "6px",
                }}
              >
                ×{count}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderObject = (obj) => (
    <Preformatted>{JSON.stringify(obj, null, 2)}</Preformatted>
  );

  return (
    <Container>
      <CloseButton onClick={() => dispatch(clearSelectedTeamfight())}>
        Close Details
      </CloseButton>

      <h2>Teamfight Summary</h2>
      <Section>
        <FieldLabel>Start Time:</FieldLabel> {start}s
      </Section>
      <Section>
        <FieldLabel>End Time:</FieldLabel> {end}s
      </Section>
      <Section>
        <FieldLabel>Last Death Time:</FieldLabel> {last_death}s
      </Section>
      <Section>
        <FieldLabel>Total Deaths:</FieldLabel> {deaths}
      </Section>

      <h3>Players Involved</h3>
      <PlayerGrid>
        {players.map((player, index) => {
          const matchPlayer = allPlayers[index];
          const heroId = matchPlayer?.hero_id;
          const heroImg = heroId && heroIdtoImg[heroId]?.img;
          const heroUrl = heroImg ? `${cdnBase}${heroImg}` : null;
          const playerName = matchPlayer?.personaname || "Unknown";

          return (
            <PlayerCard key={index}>
              <PlayerHeader>
                {heroUrl && <HeroImg src={heroUrl} alt={`Hero ${heroId}`} />}
                <PlayerInfo>
                  <PlayerName>{playerName}</PlayerName>
                  <div>Hero ID: {heroId}</div>
                </PlayerInfo>
              </PlayerHeader>

              <Section>
                <FieldLabel>Death Positions:</FieldLabel>
                {player.deaths_pos && Object.keys(player.deaths_pos).length > 0
                  ? renderObject(player.deaths_pos)
                  : "N/A"}
              </Section>

              <Section>
                <FieldLabel>Ability Uses:</FieldLabel>
                <AbilityUsesSection ability_uses={player.ability_uses} />
              </Section>

              <Section>
                <FieldLabel>Item Uses:</FieldLabel>
                <ItemUsesSection item_uses={player.item_uses} />
              </Section>

              <Section>
                <FieldLabel>Killed:</FieldLabel>
                {renderKilledHeroes(player.killed)}
              </Section>
              <Section>
                <FieldLabel>Deaths:</FieldLabel>
                <DeathIcons title={`${player.deaths ?? 0} death(s)`}>
                  {Array.from({ length: player.deaths ?? 0 }).map((_, i) => (
                    <span key={i}>💀</span>
                  ))}
                  {player.deaths === 0 && "No Deaths"}
                </DeathIcons>
              </Section>

              <Section>
                <FieldLabel>Buybacks:</FieldLabel>
                <BuybackBadge used={player.buybacks === 1}>
                  {player.buybacks === 1 ? "↩ Buyback Used" : "No Buyback"}
                </BuybackBadge>
              </Section>

              <Section>
                <FieldLabel>Damage:</FieldLabel> {player.damage ?? "N/A"}
              </Section>
              <Section>
                <FieldLabel>Healing:</FieldLabel> {player.healing ?? "N/A"}
              </Section>
              <Section>
                <FieldLabel>Gold Delta:</FieldLabel>{" "}
                {player.gold_delta ?? "N/A"}
              </Section>
              <Section>
                <FieldLabel>XP Delta:</FieldLabel> {player.xp_delta ?? "N/A"}
              </Section>
            </PlayerCard>
          );
        })}
      </PlayerGrid>
    </Container>
  );
};

export default TeamfightDetails;
