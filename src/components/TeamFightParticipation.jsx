import React from "react";
import styled from "styled-components";
import heroIdtoImg from "../utils/heroes.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const TeamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TeamBlock = styled.div`
  background: ${(props) => (props.team === "radiant" ? "#e8f5e9" : "#ffebee")};
  border-left: 4px solid
    ${(props) => (props.team === "radiant" ? "#66bb6a" : "#ef5350")};
  padding: 8px 10px;
  border-radius: 6px;
`;

const TeamTitle = styled.h4`
  margin: 0 0 6px;
  color: ${(props) => (props.team === "radiant" ? "#2e7d32" : "#c62828")};
  font-size: 0.85rem;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const HeroWrapper = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
`;

const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #fff;
  object-fit: contain;
  border: 1px solid #bbb;
`;

const DeathUnderline = styled.div`
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: red;
  border-radius: 0 0 4px 4px;
`;
const BuybackLine = styled.div`
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgb(241, 198, 4);
  border-radius: 0 0 4px 4px;
`;

const TeamFightParticipation = ({ players, allPlayers }) => {
  if (!players || !allPlayers) return null;

  const radiant = [];
  const dire = [];

  players.forEach((fightPlayer, i) => {
    const matchPlayer = allPlayers[i];
    if (!matchPlayer) return;

    const {
      xp_delta,
      gold_delta,
      damage,
      healing,
      deaths,
      ability_uses,
      buybacks,
    } = fightPlayer;

    const contributed =
      xp_delta ||
      gold_delta ||
      damage ||
      healing ||
      deaths > 0 ||
      buybacks > 0 ||
      (ability_uses && Object.keys(ability_uses).length > 0);

    if (!contributed) return;

    const heroId = matchPlayer.hero_id;
    const heroIconPath = heroIdtoImg[heroId]?.icon;
    const heroUrl = heroIconPath ? `${cdnBase}${heroIconPath}` : null;

    const heroIcon = (
      <HeroWrapper key={i}>
        {heroUrl ? (
          <>
            <HeroImg src={heroUrl} alt={`Hero ${heroId}`} />
            {deaths > 0 && <DeathUnderline />}
            {buybacks > 0 && <BuybackLine />}
          </>
        ) : (
          <span>❓</span>
        )}
      </HeroWrapper>
    );

    (matchPlayer.player_slot < 128 ? radiant : dire).push(heroIcon);
  });

  return (
    <TeamWrapper>
      {radiant.length > 0 && (
        <TeamBlock team="radiant">
          <TeamTitle team="radiant">Radiant</TeamTitle>
          <ParticipantsList>{radiant}</ParticipantsList>
        </TeamBlock>
      )}
      {dire.length > 0 && (
        <TeamBlock team="dire">
          <TeamTitle team="dire">Dire</TeamTitle>
          <ParticipantsList>{dire}</ParticipantsList>
        </TeamBlock>
      )}
    </TeamWrapper>
  );
};

export default TeamFightParticipation;
