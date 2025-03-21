import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetHeroesQuery } from "../services/playerProfile";
import heroesData from "../utils/heroes.json"; // Ensure it's correctly structured

const HeroContainer = styled.div`
  border-radius: 6px;
  color: #DAD7D4;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  background: rgba(15, 15, 15, 0.9);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #ECEBE9;
  margin-left: 10px;
`;

const HeroItem = styled.div`
  display: grid;
  padding: 10px;
  gap: 10px;
  grid-template-columns: 36px 1fr 1fr;
  border-top: 1px solid #0F1012;
`;

const HeroBaseStats = styled.div`
    text-align: start;
`;

const HeroName = styled.div`
    font-size: 14px;
    font-weight: bold;
`;

const HeroGames = styled.div`
    font-size: 12px;
`;

const HeroWinLoss = styled.div`
    text-align: end;
`;

const HeroWinLossPercent = styled.div`
    font-size: 14px;
    font-weight: bold;
    color: #F08149;
`;

const HeroWinLossCounts = styled.div`
    font-size: 12px;
`;

const HeroImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  margin-right: 12px;
  object-fit: cover;
  object-position: center;
`;

const HeroStats = () => {

    const cdnBase = "https://cdn.cloudflare.steamstatic.com";


    const { id: playerId } = useParams();
    const { data: heroesDataArray, isLoading, error } = useGetHeroesQuery(playerId, { skip: !playerId });

    if (isLoading) return <p>Loading Heroes...</p>;
    if (error) return <p style={{ color: "red" }}>Error fetching heroes</p>;

    return (
        <HeroContainer>
            <SectionHeader>
                Top Heroes
            </SectionHeader>
            {heroesDataArray.slice(0, 3).map((hero) => {
                const heroInfo = heroesData[hero.hero_id]; // Make sure this exists in JSON

                return (
                    <HeroItem key={hero.hero_id}>
                        <HeroImage src={`${cdnBase}${heroInfo?.img}`} alt={heroInfo?.localized_name || "Unknown Hero"} />
                        <HeroBaseStats>
                            <HeroName>{heroInfo?.localized_name || "Unknown Hero"}</HeroName>
                            <HeroGames>{hero.games} games</HeroGames>
                        </HeroBaseStats>
                        <HeroWinLoss>
                            <HeroWinLossPercent>{((hero.win / hero.games) * 100).toFixed(2)}%</HeroWinLossPercent>
                            <HeroWinLossCounts>{hero.win}W - {hero.games - hero.win}L </HeroWinLossCounts>
                        </HeroWinLoss>
                    </HeroItem>
                );
            })}
        </HeroContainer>
    );
};

export default HeroStats;
