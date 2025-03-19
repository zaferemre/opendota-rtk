import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PlayerSearchForm from "./components/PlayerSearchForm";
import PlayerCard from "./components/PlayerCard";
import MatchCard from "./components/MatchCard";
import styled from "styled-components";

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
`;
const Bg = styled.div`
  background-image: url("/wallpaper.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: fixed;
  width: 100%;
  z-index: -1;
  filter: blur(5px);
  filter: brightness(0.9);
`;

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Bg />

        <PlayerSearchForm />
        <CardContainer>
          <PlayerCard />
          <MatchCard />
        </CardContainer>
      </div>
    </Provider>
  );
}

export default App;
