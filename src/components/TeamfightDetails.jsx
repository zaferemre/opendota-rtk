import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { clearSelectedTeamfight } from "../features/counter/matchSlice";

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  background: #f44336;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
`;

const Section = styled.div`
  margin-bottom: 12px;
`;

const FieldLabel = styled.span`
  font-weight: bold;
`;

const PlayerCard = styled.div`
  border: 1px solid #eee;
  background: #fafafa;
  padding: 8px;
  margin-bottom: 12px;
  border-radius: 4px;
`;

const Preformatted = styled.pre`
  font-size: 0.85rem;
  overflow-x: auto;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
`;

const TeamfightDetails = () => {
  const dispatch = useDispatch();
  const selectedTeamfight = useSelector(
    (state) => state.match.selectedTeamfight
  );

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

  // Helper function to render an object as formatted JSON
  const renderObject = (obj) => {
    return <Preformatted>{JSON.stringify(obj, null, 2)}</Preformatted>;
  };

  return (
    <Container>
      <CloseButton onClick={() => dispatch(clearSelectedTeamfight())}>
        Close Details
      </CloseButton>
      <h2>Teamfight Details</h2>
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
      <Section>
        <h3>Players Involved</h3>
        {players.map((player, index) => (
          <PlayerCard key={index}>
            <h4>Player {index + 1}</h4>
            <Section>
              <FieldLabel>Death Positions:</FieldLabel>
              {player.deaths_pos && Object.keys(player.deaths_pos).length > 0
                ? renderObject(player.deaths_pos)
                : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Ability Uses:</FieldLabel>
              {player.ability_uses &&
              Object.keys(player.ability_uses).length > 0
                ? renderObject(player.ability_uses)
                : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Ability Targets:</FieldLabel>
              {player.ability_targets &&
              Object.keys(player.ability_targets).length > 0
                ? renderObject(player.ability_targets)
                : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Item Uses:</FieldLabel>
              {player.item_uses && Object.keys(player.item_uses).length > 0
                ? renderObject(player.item_uses)
                : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Killed:</FieldLabel>
              {player.killed && Object.keys(player.killed).length > 0
                ? renderObject(player.killed)
                : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Deaths:</FieldLabel>{" "}
              {player.deaths != null ? player.deaths : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Buybacks:</FieldLabel>{" "}
              {player.buybacks != null ? player.buybacks : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Damage:</FieldLabel>{" "}
              {player.damage != null ? player.damage : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Healing:</FieldLabel>{" "}
              {player.healing != null ? player.healing : "N/A"}
            </Section>
            <Section>
              <FieldLabel>Gold Delta:</FieldLabel>{" "}
              {player.gold_delta != null ? player.gold_delta : "N/A"}
            </Section>
            <Section>
              <FieldLabel>XP Delta:</FieldLabel>{" "}
              {player.xp_delta != null ? player.xp_delta : "N/A"}
            </Section>
            <Section>
              <FieldLabel>XP Start:</FieldLabel>{" "}
              {player.xp_start != null ? player.xp_start : "N/A"}
            </Section>
            <Section>
              <FieldLabel>XP End:</FieldLabel>{" "}
              {player.xp_end != null ? player.xp_end : "N/A"}
            </Section>
          </PlayerCard>
        ))}
      </Section>
    </Container>
  );
};

export default TeamfightDetails;
