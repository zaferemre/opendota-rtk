import React from "react";
import styled from "styled-components";
import skillNametoImage from "../../utils/abilities.json"; // your mapping

const cdnBase = "https://cdn.cloudflare.steamstatic.com";
const AbilityGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

const AbilityIconWrapper = styled.div`
  position: relative;

  height: 40px;
`;

const AbilityImg = styled.img`
  height: 100%;
  border-radius: 4px;
  border: 1px solid #555;
`;

const AbilityCount = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #222;
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  border: 1px solid #444;
`;

const AbilityUsesSection = ({ ability_uses }) => {
  if (!ability_uses || Object.keys(ability_uses).length === 0)
    return <> N / A </>;

  return (
    <AbilityGrid>
      {" "}
      {Object.entries(ability_uses).map(([abilityName, count]) => {
        const imagePath = skillNametoImage[abilityName].img;
        if (!imagePath) return null; // fallback if unknown ability

        return (
          <AbilityIconWrapper
            key={abilityName}
            title={`${abilityName}: ${count}`}
          >
            <AbilityImg src={`${cdnBase}${imagePath}`} alt={abilityName} />{" "}
            <AbilityCount> {count} </AbilityCount>{" "}
          </AbilityIconWrapper>
        );
      })}{" "}
    </AbilityGrid>
  );
};

export default AbilityUsesSection;
