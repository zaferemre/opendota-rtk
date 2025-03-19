import React from "react";
import styled from "styled-components";

// Container for all teamfight cards
const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 20px 0;
`;

// Styled card for each teamfight
const Card = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer; /* Indicates the card is clickable */
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const CardHeader = styled.h3`
  margin: 0 0 8px;
`;

const CardInfo = styled.p`
  margin: 4px 0;
  font-size: 0.9rem;
`;

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const TeamfightCard = ({ teamfight, onTeamfightClick }) => {
  const { start, end, deaths, players } = teamfight;
  const location = computeTeamfightLocation(players);

  return (
    <Card onClick={() => onTeamfightClick(teamfight)}>
      <CardHeader>Teamfight</CardHeader>
      <CardInfo>
        <strong>Time:</strong> {formatDuration(start)} - {formatDuration(end)}
      </CardInfo>
      <CardInfo>
        <strong>Deaths:</strong> {deaths}
      </CardInfo>
      <CardInfo>
        <strong>Location:</strong>{" "}
        {location ? `X: ${location.x}, Y: ${location.y}` : "Unknown"}
      </CardInfo>
    </Card>
  );
};

// Utility function to compute the average location from players' death positions.
// The deaths_pos field is expected to be an object with X coordinates as keys and values
// as objects where keys are Y coordinates and values are occurrence counts.
const computeTeamfightLocation = (players) => {
  let sumX = 0,
    sumY = 0,
    count = 0;
  players.forEach((player) => {
    if (player.deaths_pos) {
      Object.keys(player.deaths_pos).forEach((xStr) => {
        const positions = player.deaths_pos[xStr];
        Object.keys(positions).forEach((yStr) => {
          const occurrences = positions[yStr];
          sumX += parseFloat(xStr) * occurrences;
          sumY += parseFloat(yStr) * occurrences;
          count += occurrences;
        });
      });
    }
  });
  if (count === 0) return null;
  return { x: (sumX / count).toFixed(1), y: (sumY / count).toFixed(1) };
};

const TeamfightsCard = ({ teamfights, onTeamfightClick }) => {
  return (
    <CardContainer>
      {teamfights.map((tf, index) => (
        <TeamfightCard
          key={index}
          teamfight={tf}
          onTeamfightClick={onTeamfightClick}
        />
      ))}
    </CardContainer>
  );
};

export default TeamfightsCard;
