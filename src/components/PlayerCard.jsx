import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"; // <-- Get the :id from the route
import {
  useGetUserQuery,
  useGetLastMatchesQuery,
} from "../services/playerProfile";
import { setSelectedMatchId } from "../features/counter/matchSlice";
import heroIdtoImg from "../utils/heroes.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const CardContainer = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3674b5;
`;

const ProfileDetails = styled.div`
  margin-left: 16px;
  text-align: left;

  h3 {
    margin: 0 0 8px;
    font-size: 1.5rem;
    color: #333;
  }

  p {
    margin: 4px 0;
    color: #555;
    font-size: 1rem;
  }
`;

const InfoText = styled.p`
  color: #666;
  font-size: 1rem;
  text-align: center;
`;

const SectionTitle = styled.h4`
  text-align: center;
  margin: 20px 0 12px;
  color: #3674b5;
`;

const MatchesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MatchItem = styled.li`
  font-size: 0.9rem;
  background: #f9f9f9;
  margin: 8px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background-color: #3674b5;
    transform: scale(1.02);
    color: #fff;
  }
`;

const MatchItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeroImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const MatchDetails = styled.div`
  flex: 1;
  span {
    display: block;
    margin-bottom: 4px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background-color: #3674b5;
    color: #fff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PlayerCard = () => {
  const { id: playerId } = useParams(); // ← Get the player ID from the URL
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetUserQuery(playerId, {
    skip: !playerId,
  });
  const {
    data: lastMatches,
    error: errorMatches,
    isLoading: isLoadingMatches,
  } = useGetLastMatchesQuery(playerId, {
    skip: !playerId,
  });

  const [page, setPage] = useState(1);
  const matchesPerPage = 4;

  // Reset page when new matches load
  useEffect(() => {
    setPage(1);
  }, [lastMatches]);

  const handleMatchClick = (matchId) => {
    dispatch(setSelectedMatchId(matchId));
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const totalPages = lastMatches
    ? Math.ceil(lastMatches.length / matchesPerPage)
    : 0;
  const paginatedMatches = lastMatches?.slice(
    (page - 1) * matchesPerPage,
    page * matchesPerPage
  );

  return (
    <CardContainer>
      <h2 style={{ textAlign: "center", color: "#333" }}>Player Profile</h2>
      {isLoading && <InfoText>Loading...</InfoText>}
      {error && (
        <InfoText style={{ color: "red" }}>Error loading data.</InfoText>
      )}
      {data && (
        <>
          <ProfileHeader>
            <Avatar src={data.profile?.avatarfull} alt="Player Avatar" />
            <ProfileDetails>
              <h3>{data.profile?.personaname || "Unknown Player"}</h3>
              {data.profile?.steamid && <p>Steam ID: {data.profile.steamid}</p>}
              {data.profile?.profileurl && (
                <p>
                  <a
                    href={data.profile.profileurl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Steam Profile
                  </a>
                </p>
              )}
            </ProfileDetails>
          </ProfileHeader>
          <SectionTitle>Last Matches</SectionTitle>
          {isLoadingMatches && <InfoText>Loading Matches...</InfoText>}
          {errorMatches && (
            <InfoText style={{ color: "red" }}>Error loading matches.</InfoText>
          )}
          {lastMatches?.length > 0 ? (
            <>
              <MatchesList>
                {paginatedMatches.map((match, index) => (
                  <MatchItem
                    key={index}
                    onClick={() => handleMatchClick(match.match_id)}
                  >
                    <MatchItemContainer>
                      <HeroImage
                        src={`${cdnBase}${heroIdtoImg[match.hero_id].img}`}
                        alt={`Hero ${match.hero_id}`}
                      />
                      <MatchDetails>
                        <span>
                          <strong>Match ID:</strong> {match.match_id}
                        </span>
                        <span>
                          <strong>KDA:</strong> {match.kills}/{match.deaths}/
                          {match.assists}
                        </span>
                        <span>
                          <strong>Duration:</strong>{" "}
                          {formatDuration(match.duration)}
                        </span>
                        <span>
                          <strong>Date:</strong>{" "}
                          {new Date(match.start_time * 1000).toLocaleString()}
                        </span>
                      </MatchDetails>
                    </MatchItemContainer>
                  </MatchItem>
                ))}
              </MatchesList>
              <PaginationContainer>
                <PaginationButton
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </PaginationButton>
                <span>
                  Page {page} of {totalPages}
                </span>
                <PaginationButton
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </PaginationButton>
              </PaginationContainer>
            </>
          ) : (
            <InfoText>No recent matches found</InfoText>
          )}
        </>
      )}
    </CardContainer>
  );
};

export default PlayerCard;
