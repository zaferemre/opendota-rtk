// MatchDetails.jsx (Enhanced)
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetMatchInfoQuery } from "../../services/playerProfile";
import itemIdtoName from "../../utils/item_ids.json";
import itemNametoImage from "../../utils/items.json";
import heroIdtoImg from "../../utils/heroes.json";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

// Styled components (same as before)
const Container = styled.div`
  max-width: 1200px;
  margin: 32px auto;
  padding: 24px;
  background: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  color: #f0f0f0;
`;

const ToggleButton = styled.button`
  padding: 6px 12px;
  background: #444;
  color: white;
  border: none;
  margin: 8px 0;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #666;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: #efbf04;
  text-align: center;
`;

const TeamBlock = styled.div`
  flex: 1;
  min-width: 500px;
  background-color: #2a2a2a;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid
    ${(props) => (props.team === "radiant" ? "#66bb6a" : "#ef5350")};
`;

const TeamTablesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-top: 32px;
`;

const HeroIcon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 4px;
`;

const AbilityRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const MatchDetails = () => {
  const { id: matchId } = useParams();
  const { data, isLoading, error } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });
  const [showAbilities, setShowAbilities] = useState(true);

  if (!matchId) return <Container>Select a match.</Container>;
  if (isLoading) return <Container>Loading match...</Container>;
  if (error) return <Container>Error loading match.</Container>;

  const players = data.players;
  const radiant = players.filter((p) => p.player_slot < 128);
  const dire = players.filter((p) => p.player_slot >= 128);

  const renderAbilitySummary = (teamPlayers) =>
    teamPlayers.map((p, i) => {
      const hero = heroIdtoImg[p.hero_id];
      if (!hero || !p.ability_uses) return null;
      return (
        <AbilityRow key={i}>
          <HeroIcon
            src={`https://cdn.cloudflare.steamstatic.com${hero.img}`}
            title={hero.localized_name}
          />
          <span style={{ fontSize: "0.75rem", color: "#ccc" }}>
            {Object.entries(p.ability_uses)
              .map(([k, v]) => `${k}×${v}`)
              .join(", ")}
          </span>
        </AbilityRow>
      );
    });

  const renderItems = (teamPlayers) =>
    teamPlayers.map((p, i) => {
      const hero = heroIdtoImg[p.hero_id];
      return (
        <AbilityRow key={i}>
          <HeroIcon
            src={`https://cdn.cloudflare.steamstatic.com${hero?.img}`}
            title={hero?.localized_name}
          />
          <span style={{ fontSize: "0.75rem", color: "#ccc" }}>
            {[...Array(6).keys()].map((j) => {
              const itemId = p[`item_${j}`];
              const itemName = itemIdtoName[itemId];
              const item = itemNametoImage[itemName];
              return item ? (
                <img
                  key={j}
                  src={`https://cdn.cloudflare.steamstatic.com${item.img}`}
                  alt={itemName}
                  title={itemName}
                  style={{ width: 20, height: 20, margin: "0 2px" }}
                />
              ) : null;
            })}
          </span>
        </AbilityRow>
      );
    });

  const buildChartData = (teamPlayers, field) => {
    const labels = teamPlayers.map(
      (p) => heroIdtoImg[p.hero_id]?.localized_name || p.hero_id
    );
    const values = teamPlayers.map((p) => p[field] || 0);

    return {
      labels,
      datasets: [
        {
          label: field === "hero_damage" ? "Damage" : "Healing",
          data: values,
          backgroundColor: field === "hero_damage" ? "#f06292" : "#4fc3f7",
        },
      ],
    };
  };

  return (
    <Container>
      <SectionTitle>Match Overview: {matchId}</SectionTitle>

      <ToggleButton onClick={() => setShowAbilities(!showAbilities)}>
        Toggle to Show {showAbilities ? "Items" : "Abilities"}
      </ToggleButton>

      <TeamTablesWrapper>
        <TeamBlock team="radiant">
          <SectionTitle>Radiant</SectionTitle>
          {showAbilities ? renderAbilitySummary(radiant) : renderItems(radiant)}
          <Bar data={buildChartData(radiant, "hero_damage")} height={150} />
          <Bar data={buildChartData(radiant, "hero_healing")} height={150} />
        </TeamBlock>

        <TeamBlock team="dire">
          <SectionTitle>Dire</SectionTitle>
          {showAbilities ? renderAbilitySummary(dire) : renderItems(dire)}
          <Bar data={buildChartData(dire, "hero_damage")} height={150} />
          <Bar data={buildChartData(dire, "hero_healing")} height={150} />
        </TeamBlock>
      </TeamTablesWrapper>
    </Container>
  );
};

export default MatchDetails;
