import React, { useRef, useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "../app/store";
import styled from "styled-components";
import MatchTeamfights from "../components/MatchTeamFights";
import TeamfightDetails from "../components/TeamfightDetails";
import { useParams } from "react-router-dom";

const Background = styled.div`
  position: fixed;
  inset: 0;
  background-image: url("/background.jpg");
  background-size: cover;
  background-position: center;
  filter: brightness(0.8);
  z-index: -1;
`;

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

function MatchContent({ id }) {
  const teamfightRef = useRef(null);
  const selectedTeamfight = useSelector(
    (state) => state.match.selectedTeamfight
  );

  useEffect(() => {
    if (selectedTeamfight && teamfightRef.current) {
      teamfightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedTeamfight]);

  return (
    <VerticalStack>
      <MatchTeamfights id={id} />
      <div ref={teamfightRef}>
        <TeamfightDetails id={id} />
      </div>
    </VerticalStack>
  );
}

function Match() {
  const { id } = useParams();

  return (
    <Provider store={store}>
      <Background />
      <PageContainer>
        <MatchContent id={id} />
      </PageContainer>
    </Provider>
  );
}

export default Match;
