import React from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import styled from "styled-components";
import PlayerSearchBar from "../components/PlayerSearchBar";
import Header from "../components/Header/index";
// Background Blur
const Background = styled.div`
  position: fixed;
  inset: 0;
  background-image: url("/background.jpg");
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

function Home() {
  return (
    <Provider store={store}>
      <Background />
      <PageContainer>
        <Header />
        <PlayerSearchBar />
      </PageContainer>
    </Provider>
  );
}

export default Home;
