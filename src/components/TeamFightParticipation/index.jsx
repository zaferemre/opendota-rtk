import React from "react";
import styled from "styled-components";
import heroIdtoImg from "../../utils/heroes.json";
import {
  HeroWrapper,
  HeroImg,
  DeathUnderline,
  BuybackLine,
  TeamWrapper,
  TeamBlock,
  TeamTitle,
  ParticipantsList,
} from "./TeamFightParticipation.styled";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

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
