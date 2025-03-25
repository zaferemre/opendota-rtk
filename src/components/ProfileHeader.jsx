import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../services/playerProfile";
import rankTiers from "../utils/rank.json";

const CardContainer = styled.div`
  padding: 24px;
  display: flex;
  gap: 10px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 5%;
  object-fit: cover;
  border: 3px solid #3674b5;
`;

const RankIcon = styled.img`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 45px;
  height: 45px;
`;

const ProfileDetails = styled.div`
  h3 {
    margin: 0 0 8px;
    font-size: 2rem;
    color: #ecebe9;
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
`;

const SteamCard = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(177, 185, 194); /* Steam dark blue */
  border-radius: 8px;
  padding: 8px;
  width: 80px;
  height: 20px;
  text-decoration: none;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

  img {
    width: 80px; /* Ensure Steam logo fits nicely */
    height: auto;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayerCard = () => {
  const { id: playerId } = useParams();
  const { data, error, isLoading } = useGetUserQuery(playerId, {
    skip: !playerId,
  });

  return (
    <CardContainer>
      {isLoading && <InfoText>Loading...</InfoText>}
      {error && (
        <InfoText style={{ color: "red" }}>Error loading data.</InfoText>
      )}
      {data && (
        <>
          <ProfileHeader>
            <AvatarContainer>
              <Avatar src={data.profile?.avatarfull} alt="Player Avatar" />
              {data.rank_tier &&
                rankTiers[data.rank_tier] &&
                (() => {
                  const rankName = rankTiers[data.rank_tier]; // e.g., "Divine IV"

                  if (rankName === "Immortal") {
                    return (
                      <RankIcon
                        src={`/RankIcons/Immortal/ranked.webp`}
                        alt="Rank Icon - Immortal"
                      />
                    );
                  }

                  const [folderName, romanNumeral] = rankName.split(" ");
                  const romanToNumber = {
                    I: 1,
                    II: 2,
                    III: 3,
                    IV: 4,
                    V: 5,
                  };
                  const imageNumber = romanToNumber[romanNumeral] || 1;

                  return (
                    <RankIcon
                      src={`/RankIcons/${folderName}/${imageNumber}.webp`}
                      alt={`Rank Icon - ${rankName}`}
                    />
                  );
                })()}
            </AvatarContainer>
          </ProfileHeader>

          <ProfileDetails>
            <h3>{data.profile?.personaname || "Unknown Player"}</h3>
            {data.profile?.profileurl && (
              <SteamCard
                href={data.profile.profileurl}
                target="_blank"
                rel="noreferrer"
              >
                <img src="/steam.webp" alt="" />
              </SteamCard>
            )}
          </ProfileDetails>
        </>
      )}
    </CardContainer>
  );
};

export default PlayerCard;
