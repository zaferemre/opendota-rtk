import React from "react";
import styled from "styled-components";
import TeamFightParticipation from "../TeamFightParticipation";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedTeamfight,
  setHoveredTeamfightIndex,
} from "../../features/counter/matchSlice";
import {
  CardContainer,
  Card,
  HeroRow,
  DeltaRow,
  TimeLabel,
  Label,
} from "./TeamfightsCard.styled";

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
