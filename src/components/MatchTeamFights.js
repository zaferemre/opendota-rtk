import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import {
  setSelectedTeamfight,
  setMatchData,
} from "../features/counter/matchSlice";
import TeamfightsCard from "./TeamfightsCard";
import TeamfightMap from "./TeamfightMap";
import MatchGraphs from "./MatchGraphs";
import { useParams } from "react-router-dom"; // <-- for route param

const Container = styled.div`
  max-width: 1200px;
  margin: 32px auto;
  padding: 24px;
  background: #ffffffcc;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  font-weight: 600;
  text-align: center;
`;

const TopRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const LeftPane = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
`;

const RightPane = styled.div`
  flex: 2;
  min-width: 500px;
`;

const MatchTeamfights = () => {
  const dispatch = useDispatch();
  const { id: matchId } = useParams(); // ✅ Get matchId from URL
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  useEffect(() => {
    if (data) {
      dispatch(setMatchData(data));
    }
  }, [data, dispatch]);

  if (!matchId) return <Container> Please select a match. </Container>;
  if (isLoading) return <Container> Loading match details... </Container>;
  if (error) return <Container> Error loading match details. </Container>;

  const teamfights = data.teamfights || [];
  const allPlayers = data.players || [];

  return (
    <Container>
      <Title> Teamfights in Match# {matchId} </Title>{" "}
      <TopRow>
        <LeftPane>
          <TeamfightMap teamfights={teamfights} />{" "}
        </LeftPane>{" "}
        <RightPane>
          <MatchGraphs />
        </RightPane>{" "}
      </TopRow>{" "}
      <TeamfightsCard
        teamfights={teamfights}
        allPlayers={allPlayers}
        onTeamfightClick={(tf) => dispatch(setSelectedTeamfight(tf))}
      />{" "}
    </Container>
  );
};

export default MatchTeamfights;
