import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import styled from "styled-components";
import PlayerSearchForm from "./components/PlayerSearchForm";
import PlayerCard from "./components/PlayerCard";
import MatchCard from "./components/MatchCard";
import Header from "./components/Header";
import MatchDetails from "./components/MatchDetails";
import MatchTeamfights from "./components/MatchTeamFights";
import TeamfightDetails from "./components/TeamfightDetails";
import MatchGraphs from "./components/MatchGraphs";

// Background Blur
const Background = styled.div`
  position: fixed;
  inset: 0;
  background-image: url("/wallpaper.png");
  background-size: cover;
  background-position: center;
  filter: brightness(0.8);
  z-index: -1;
`;

// Overall page container
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
`;

// Card Layouts
const Grid2 = styled.div`
  display: flex;
  max-width: 100%;
  gap: 20px;
  margin-bottom: 32px;
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

function App() {
  return (
    <Provider store={store}>
      <Background />
      <PageContainer>
        <Header />
        <PlayerSearchForm />

        <Grid2>
          <PlayerCard />
          <MatchCard />
        </Grid2>

        <VerticalStack>
          <MatchTeamfights />
          <TeamfightDetails />
        </VerticalStack>

        <MatchDetails />
      </PageContainer>{" "}
    </Provider>
  );
}

export default App;
