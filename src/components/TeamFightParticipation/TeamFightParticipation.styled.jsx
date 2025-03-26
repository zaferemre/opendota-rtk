import styled from "styled-components";
const TeamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TeamBlock = styled.div`
  background: #2a2a2a;
  border-left: 4px solid
    ${(props) => (props.team === "radiant" ? "#66bb6a" : "#ef5350")};
  padding: 8px 10px;
  border-radius: 6px;
`;

const TeamTitle = styled.h4`
  margin: 0 0 6px;
  color: ${(props) => (props.team === "radiant" ? "#a5d6a7" : "#ef9a9a")};
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
  background: #1e1e1e;
  object-fit: contain;
  border: 1px solid #555;
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
