import React from "react";
import styled from "styled-components";
import TeamFightParticipation from "./TeamFightParticipation";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedTeamfight,
  setHoveredTeamfightIndex,
} from "../features/counter/matchSlice";

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
`;

const Card = styled.div`
  background: #fdfdfd;
  border-radius: 10px;
  padding: 14px 12px;
  width: 200px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  &.highlight {
    border-color: #ff5733;
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 0 10px rgba(255, 87, 51, 0.4);
  }
`;

const HeroRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
`;

const DeltaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #333;
  margin-top: 6px;
`;

const TimeLabel = styled.div`
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 4px;
`;

const Label = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const formatDuration = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

const TeamfightCard = ({ teamfight, allPlayers, onTeamfightClick, index }) => {
  const dispatch = useDispatch();
  const hoveredIdx = useSelector((state) => state.match.hoveredTeamfightIndex);
  const { start, end, players } = teamfight;
  const totalGold = players.reduce((acc, p) => acc + (p.gold_delta || 0), 0);
  const totalXp = players.reduce((acc, p) => acc + (p.xp_delta || 0), 0);

  const isHovered = hoveredIdx === index;

  return (
    <Card
      className={isHovered ? "highlight" : ""}
      onClick={() => onTeamfightClick(teamfight)}
      onMouseEnter={() => dispatch(setHoveredTeamfightIndex(index))}
      onMouseLeave={() => dispatch(setHoveredTeamfightIndex(null))}
    >
      <HeroRow>
        <TeamFightParticipation
          players={players}
          allPlayers={allPlayers}
          showDeathsHue
        />
      </HeroRow>
      <TimeLabel>
        ⏱ {formatDuration(start)} – {formatDuration(end)}
      </TimeLabel>
      <DeltaRow>
        <Label>🪙 {totalGold}</Label>
        <Label>✨ {totalXp}</Label>
      </DeltaRow>
    </Card>
  );
};

const TeamfightsCard = ({ teamfights, allPlayers, onTeamfightClick }) => (
  <CardContainer>
    {teamfights.map((tf, i) => (
      <TeamfightCard
        key={i}
        index={i}
        teamfight={tf}
        allPlayers={allPlayers}
        onTeamfightClick={onTeamfightClick}
      />
    ))}
  </CardContainer>
);

export default TeamfightsCard;
