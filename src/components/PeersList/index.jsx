import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetPeersQuery } from "../../services/playerProfile";

const PeersContainer = styled.div`
  background: rgba(15, 15, 15, 0.9);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: #dad7d4;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #ecebe9;
  margin-left: 10px;
`;

const PeerItem = styled.div`
  display: grid;
  padding: 10px;
  gap: 10px;
  grid-template-columns: 36px 1fr 1fr;
  border-top: 1px solid #0f1012;
`;

const PeerAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 2px;
  margin-right: 12px;
  object-fit: cover;
  object-position: center;
`;

const PeerBaseStats = styled.div`
  text-align: start;
`;

const PeerName = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: inherit;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: color 0.2s ease-in-out; /* Smooth transition effect */

  &:hover {
    color: #f08149; /* Changes color on hover */
  }
`;

const PeerGames = styled.div`
  font-size: 12px;
`;

const PeerWinLoss = styled.div`
  text-align: end;
`;

const PeerWinLossPercent = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #f08149;
`;

const PeerWinLossCounts = styled.div`
  font-size: 12px;
`;

const PeersList = () => {
  const { id: playerId } = useParams();
  const {
    data: peers,
    isLoading,
    error,
  } = useGetPeersQuery(playerId, { skip: !playerId });

  if (isLoading) return <p>Loading Peers...</p>;
  if (error) return <p style={{ color: "red" }}>Error fetching peers</p>;

  return (
    <PeersContainer>
      <SectionHeader>Best Teammates</SectionHeader>
      {peers.slice(0, 10).map((peer) => (
        <PeerItem key={peer.account_id}>
          <PeerAvatar src={peer.avatarfull} alt={peer.personaname} />
          <PeerBaseStats>
            <PeerName href={`/player/${peer.account_id}`}>
              {peer.personaname || "Unknown"}
            </PeerName>
            <PeerGames>{peer.games} games</PeerGames>
          </PeerBaseStats>
          <PeerWinLoss>
            <PeerWinLossPercent>
              {((peer.win / peer.games) * 100).toFixed(2)}%
            </PeerWinLossPercent>
            <PeerWinLossCounts>
              {peer.win}W - {peer.games - peer.win}L{" "}
            </PeerWinLossCounts>
          </PeerWinLoss>
        </PeerItem>
      ))}
    </PeersContainer>
  );
};

export default PeersList;
