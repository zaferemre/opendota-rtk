import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { clearSelectedTeamfight } from "../../features/counter/matchSlice";
import heroIdtoImg from "../../utils/heroes.json";
import itemNametoImage from "../../utils/items.json";
import abilityNametoImage from "../../utils/abilities.json";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const Container = styled.div`
  max-width: 1300px;
  margin: 24px auto;
  padding: 32px;
  background: #121212;
  border-radius: 16px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
  color: #fff;
  font-family: "Segoe UI", sans-serif;
`;

const CloseButton = styled.button`
  background: #ff4c4c;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 24px;

  &:hover {
    background: #ff1f1f;
  }
`;

const Section = styled.div`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const TeamsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
`;

const TeamColumn = styled.div`
  flex: 1;
  min-width: 300px;
`;

const PlayerCard = styled.div`
  background: #1e1e1e;
  border: 2px solid
    ${({ died, buyback }) =>
      died ? "#ef5350" : buyback ? "#ffd740" : "#2e2e2e"};
  border-radius: 10px;
  padding: 10px 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
`;

const HeroImg = styled.img`
  height: 48px;
  border-radius: 6px;
  background: #000;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: #999;
`;

const IconRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const IconImg = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: contain;
`;

const CountBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #444;
  color: #fff;
  font-size: 0.65rem;
  padding: 1px 4px;
  border-radius: 6px;
`;

const ChartWrapper = styled.div`
  margin-bottom: 32px;
`;

const TeamfightDetails = () => {
  const dispatch = useDispatch();
  const selectedTeamfight = useSelector(
    (state) => state.match.selectedTeamfight
  );
  const matchData = useSelector((state) => state.match.matchData);

  if (!selectedTeamfight) {
    return (
      <Container>
        <p>
          No teamfight selected. Please click on a teamfight to see its details.
        </p>
      </Container>
    );
  }

  const { start, end, deaths, players } = selectedTeamfight;
  const allPlayers = matchData?.players || [];

  const buildGoldXPChart = () => {
    const labels = allPlayers.map(
      (p, i) => heroIdtoImg[p?.hero_id]?.localized_name || `P${i + 1}`
    );
    return {
      labels,
      datasets: [
        {
          label: "Gold Delta",
          data: players.map((p) => p.gold_delta || 0),
          backgroundColor: players.map((_, i) =>
            allPlayers[i]?.player_slot < 128 ? "#66bb6a" : "#ef5350"
          ),
        },
        {
          label: "XP Delta",
          data: players.map((p) => p.xp_delta || 0),
          backgroundColor: players.map((_, i) =>
            allPlayers[i]?.player_slot < 128 ? "#a5d6a7" : "#ef9a9a"
          ),
        },
        {
          label: "Healing",
          data: players.map((p) => p.healing || 0),
          backgroundColor: players.map((_, i) =>
            allPlayers[i]?.player_slot < 128 ? "#4db6ac" : "#ce93d8"
          ),
        },
        {
          label: "Damage",
          data: players.map((p) => p.damage || 0),
          backgroundColor: players.map((_, i) =>
            allPlayers[i]?.player_slot < 128 ? "#ff7043" : "#9575cd"
          ),
        },
      ],
    };
  };

  const renderIcons = (obj, map, keyPrefix = "", isHero = false) => {
    return Object.entries(obj).map(([key, value], i) => {
      const data = isHero
        ? Object.values(heroIdtoImg).find((h) => h.name === key)
        : map[key];
      if (!data) return null;
      const imgSrc = isHero
        ? `${cdnBase}${data.icon}`
        : `${cdnBase}${data.img}`;
      return (
        <IconImg key={keyPrefix + i}>
          <Img src={imgSrc} title={key} alt={key} />
          {value > 1 && <CountBadge>x{value}</CountBadge>}
        </IconImg>
      );
    });
  };

  const renderPlayerCards = (teamPlayers, offset = 0) => (
    <>
      {teamPlayers.map((player, index) => {
        const matchPlayer = allPlayers[offset + index];
        const heroId = matchPlayer?.hero_id;
        const heroUrl =
          heroId && heroIdtoImg[heroId]?.img
            ? `${cdnBase}${heroIdtoImg[heroId].img}`
            : null;
        const playerName = matchPlayer?.personaname || "Unknown";
        const died = player.deaths > 0;
        const buyback = player.buybacks > 0;

        return (
          <PlayerCard key={index} died={died} buyback={buyback}>
            {heroUrl && <HeroImg src={heroUrl} alt={`Hero ${heroId}`} />}
            <PlayerInfo>
              <PlayerName>{playerName}</PlayerName>
            </PlayerInfo>
            <InfoSection>
              <LabelRow>
                <span>Abilities</span>
                <span>Items</span>
                <span>Killed</span>
              </LabelRow>
              <IconRow>
                <IconGroup>
                  {renderIcons(
                    player.ability_uses || {},
                    abilityNametoImage,
                    "a"
                  )}
                </IconGroup>
                <IconGroup>
                  {renderIcons(player.item_uses || {}, itemNametoImage, "i")}
                </IconGroup>
                <IconGroup>
                  {renderIcons(player.killed || {}, heroIdtoImg, "k", true)}
                </IconGroup>
              </IconRow>
            </InfoSection>
          </PlayerCard>
        );
      })}
    </>
  );

  const radiant = players.filter((_, i) => allPlayers[i]?.player_slot < 128);
  const dire = players.filter((_, i) => allPlayers[i]?.player_slot >= 128);

  return (
    <Container>
      <CloseButton onClick={() => dispatch(clearSelectedTeamfight())}>
        Close Details
      </CloseButton>

      <h2 style={{ marginBottom: "16px" }}>Teamfight Summary</h2>
      <Section>
        <strong>Start:</strong> {start}s — <strong>End:</strong> {end}s —{" "}
        <strong>Deaths:</strong> {deaths}
      </Section>

      <ChartWrapper>
        <Bar
          data={buildGoldXPChart()}
          height={160}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </ChartWrapper>

      <TeamsWrapper>
        <TeamColumn>
          <h3 style={{ borderBottom: "2px solid #66bb6a", paddingBottom: 4 }}>
            Radiant
          </h3>
          {renderPlayerCards(radiant, 0)}
        </TeamColumn>
        <TeamColumn>
          <h3 style={{ borderBottom: "2px solid #ef5350", paddingBottom: 4 }}>
            Dire
          </h3>
          {renderPlayerCards(dire, radiant.length)}
        </TeamColumn>
      </TeamsWrapper>
    </Container>
  );
};

export default TeamfightDetails;
