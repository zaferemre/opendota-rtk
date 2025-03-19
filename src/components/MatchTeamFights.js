import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import styled from "styled-components";
import TeamfightsCard from "./TeamfightsCard";
import { setSelectedTeamfight } from "../features/counter/matchSlice";

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const MatchTeamfights = () => {
  const dispatch = useDispatch();
  // Retrieve matchId from Redux as done before
  const matchId = useSelector((state) => state.match.selectedMatchId);
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  if (!matchId) {
    return <Container>Please select a match.</Container>;
  }
  if (isLoading) {
    return <Container>Loading match details...</Container>;
  }
  if (error) {
    return <Container>Error loading match details.</Container>;
  }

  // Assume your API returns a "teamfights" array in the match data.
  const teamfights = data.teamfights || [];

  // Dispatch the clicked teamfight into Redux
  const handleTeamfightClick = (teamfight) => {
    dispatch(setSelectedTeamfight(teamfight));
  };

  return (
    <Container>
      <h2>Match {matchId} Teamfights</h2>
      <TeamfightsCard
        teamfights={teamfights}
        onTeamfightClick={handleTeamfightClick}
      />
    </Container>
  );
};

export default MatchTeamfights;
