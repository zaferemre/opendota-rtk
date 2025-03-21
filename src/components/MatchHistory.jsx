import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetLastMatchesQuery } from "../services/playerProfile";
import heroesData from "../utils/heroes.json"; // Ensure this maps hero_id to hero images
import gameModes from "../utils/game_mode.json";
import lobbyTypes from "../utils/lobby_type.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

// 🎨 Styled Components
const MatchHistoryContainer = styled.div`
  background: rgba(15, 15, 15, 0.9);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  color: #DAD7D4;
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 10px;
  font-weight: bold;
  color: #ECEBE9;
  margin-left: 10px;
`;

const MatchLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: block;
  border-radius: 5px;
`;

const MatchItem = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 4px 2fr 0.5fr 2fr 2fr 1fr 16px;
  align-items: center;
  background: ${(props) => (props.isWin ? "#20326d" : "#51263d")};
  margin: 5px 0;
  border-radius: 8px;
  border-top: 1px solid #0F1012;
  transition: background 0.2s ease-in-out;
  
  &:hover {
    background: ${(props) => (props.isWin ? "#2A4285" : "#6A314E")}; /* Lighter tint on hover */
  }

`;

const HeroImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 8px;
  margin-right: 12px;
  object-fit: cover;
  margin: 5px;
`;

const MatchDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const MatchBasicInfo = styled.div`
    text-align: center;
`;

const MatchLobbyType = styled.div`
    font-size: 14px;
    font-weight: bold;
`;

const MatchGameMode = styled.div`
    font-size: 12px;
`;

const MatchTimeInfo = styled.div`
    text-align: end;
`;

const MatchDuration = styled.div`
    font-size: 14px;
    font-weight: 500;
`;

const MatchTime = styled.div`
    font-size: 12px;

`;

const WinLossIndicator = styled.div`
    background: ${(props) => (props.isWin ? "#3273fa" : "#ff4655")}; /* Blue for win, Red for loss */
    height: 100%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
`;

const ViewStats = styled.div`
    background: ${(props) => (props.isWin ? "#3273fa" : "#ff4655")};
    height: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const KDA = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin: 0;
`;

const Result = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.isWin ? "#62c462" : "#d9534f")};
  margin: 0;
`;

const PartySize = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: #DAD7D4; /* Light gray */
  display: flex;
  align-items: center;
  gap: 6px;
`;

const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString(navigator.language, {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
    });
};

const capitalizeWords = (str) =>
    str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const getGameMode = (id) =>
    capitalizeWords(gameModes[id]?.name.replace("game_mode_", "").replace(/_/g, " ") || "Unknown Mode");

const getLobbyType = (id) =>
    capitalizeWords(lobbyTypes[id]?.name.replace("lobby_type_", "").replace(/_/g, " ") || "Unknown Lobby");

const MatchHistory = () => {
    const { id: playerId } = useParams();
    const { data: matches, isLoading, error } = useGetLastMatchesQuery(playerId, {
        skip: !playerId,
    });

    if (isLoading) return <p>Loading Match History...</p>;
    if (error) return <p style={{ color: "red" }}>Error loading matches</p>;
    if (!matches || matches.length === 0) return <p>No recent matches found</p>;

    return (
        <MatchHistoryContainer>
            <SectionHeader>Match History</SectionHeader>
            {matches.slice(0, 20).map((match) => {
                const heroInfo = heroesData[match.hero_id];
                const isWin = match.radiant_win === (match.player_slot < 128); // Determines if player won

                return (
                    <MatchLink href={`/match/${match.match_id}`} key={match.match_id}>
                        <MatchItem isWin={isWin}>
                            <WinLossIndicator isWin={isWin} />

                            <MatchBasicInfo>
                                <MatchLobbyType>{getLobbyType(match.lobby_type)}</MatchLobbyType>
                                <MatchGameMode>{getGameMode(match.game_mode)}</MatchGameMode>
                                {/* <MatchTime>{formatDate(match.start_time)}</MatchTime> */}
                            </MatchBasicInfo>

                            <HeroImage
                                src={`${cdnBase}${heroInfo?.img}`}
                                alt={heroInfo?.localized_name || "Unknown Hero"}
                            />
                            <MatchDetails>
                                <KDA>
                                    {match.kills} / {match.deaths} / {match.assists}
                                </KDA>
                                <Result isWin={isWin}>{isWin ? "Win" : "Loss"}</Result>
                            </MatchDetails>
                            <PartySize>
                                {match.party_size > 1 ? "👥 Party" : "👤 Solo"} ({match.party_size})
                            </PartySize>
                            <MatchTimeInfo>
                                <MatchDuration>{(match.duration / 60).toFixed(0)} min</MatchDuration>
                                <MatchTime>{formatDate(match.start_time)}</MatchTime>
                            </MatchTimeInfo>
                            <ViewStats isWin={isWin}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 6l6 6-6 6" />
                                </svg>
                            </ViewStats>
                        </MatchItem>
                    </MatchLink>
                );
            })}
        </MatchHistoryContainer>
    );
};

export default MatchHistory;
