import React from "react";
import { Provider } from "react-redux";
import { useParams } from "react-router-dom"; // <-- for route param
import { store } from "../app/store";
import styled from "styled-components";
import ProfileHeader from "../components/ProfileHeader";
import HeroStats from "../components/HeroStats";
import PeersList from "../components/PeersList";
import MatchHistory from "../components/MatchHistory";
// Background Blur
const Background = styled.div`
  position: fixed;
  inset: 0;
  background-image: url("/background.jpg  ");
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
  z-index: -1;
`;

// Overall page container
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px;
`;

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 24fr 60fr;
  gap: 10px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerStatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 960px) {
    width: 100%;
  }
`;

const MatchHistoryColumn = styled.div`
  @media (max-width: 960px) {
    width: 100%;
  }
`;
// Card Layouts
const Grid2 = styled.div`
  display: flex;
  max-width: 100%;
  gap: 20px;
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

function Profile() {
  const { id } = useParams(); // ← Get player ID from URL

  return (
    <Provider store={store}>
      <Background />
      <PageContainer>
        <Grid2>
          <ProfileHeader id={id} />
          {/* <MatchCard id={id} /> */}
        </Grid2>
        <LayoutContainer>
          <PlayerStatsColumn>
            <HeroStats id={id}/>
            <PeersList id={id}/>
          </PlayerStatsColumn>
          <MatchHistoryColumn>
            <MatchHistory id={id}/>
          </MatchHistoryColumn>
        </LayoutContainer>
      </PageContainer>
    </Provider>
  );
}

export default Profile;
