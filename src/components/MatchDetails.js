import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import itemIdtoName from "../utils/item_ids.json";
import itemNametoImage from "../utils/items.json";
import heroIdtoImg from "../utils/heroes.json";

const Container = styled.div`
  margin: 20px auto;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 12px;
  background: #f2f2f2;
  border: 1px solid #ddd;
  text-align: center;
  cursor: pointer;
  user-select: none;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
`;

const ItemIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: scale-down;
  margin: 0 2px;
`;

const HeroIcon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
`;

const SortIndicator = styled.span`
  margin-left: 4px;
  font-size: 0.8rem;
`;

const TimelineContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 4px 0;
`;

const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 8px;
`;

const TimelineIcon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: scale-down;
  margin-bottom: 4px;
`;

const TimelineTime = styled.span`
  font-size: 0.75rem;
  color: #666;
`;

const TimelineArrow = styled.span`
  font-size: 1rem;
  margin: 0 8px;
  color: #aaa;
`;

const PurchaseTimeline = ({ purchaseLog }) => {
  if (!purchaseLog || purchaseLog.length === 0) return "N/A";
  return (
    <TimelineContainer>
      {purchaseLog.map((entry, index) => {
        const imageData = itemNametoImage[entry.key];
        return (
          <React.Fragment key={index}>
            <TimelineItem>
              {imageData ? (
                <TimelineIcon
                  src={`https://cdn.cloudflare.steamstatic.com${imageData.img}`}
                  alt={entry.key}
                  title={entry.key}
                />
              ) : (
                <span>{entry.key}</span>
              )}
              <TimelineTime>{entry.time}s</TimelineTime>
            </TimelineItem>
            {index < purchaseLog.length - 1 && <TimelineArrow>→</TimelineArrow>}
          </React.Fragment>
        );
      })}
    </TimelineContainer>
  );
};

const MatchDetails = () => {
  // Always call hooks at the top.
  const matchId = useSelector((state) => state.match.selectedMatchId);
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Prepare players even if data is not yet available.
  const players = (data && data.players) || [];

  // Memoize sorted players unconditionally.
  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return players;
    const sorted = [...players].sort((a, b) => {
      const aVal = a[sortConfig.key] || 0;
      const bVal = b[sortConfig.key] || 0;
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [players, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <SortIndicator>
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </SortIndicator>
    );
  };

  // Conditional rendering based on data status.
  if (!matchId) {
    return <Container>Please select a match.</Container>;
  }
  if (isLoading) {
    return <Container>Loading match details...</Container>;
  }
  if (error) {
    return <Container>Error loading match details.</Container>;
  }

  return (
    <Container>
      <h2>Match Details for {matchId}</h2>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th onClick={() => handleSort("personaname")}>
              Player {renderSortIndicator("personaname")}
            </Th>
            <Th>Hero</Th>
            <Th>Items</Th>
            <Th>Purchase Timeline</Th>
            <Th onClick={() => handleSort("kills")}>
              Kills {renderSortIndicator("kills")}
            </Th>
            <Th onClick={() => handleSort("deaths")}>
              Deaths {renderSortIndicator("deaths")}
            </Th>
            <Th onClick={() => handleSort("assists")}>
              Assists {renderSortIndicator("assists")}
            </Th>
            <Th onClick={() => handleSort("xp_per_min")}>
              XPM {renderSortIndicator("xp_per_min")}
            </Th>
            <Th onClick={() => handleSort("gold_per_min")}>
              GPM {renderSortIndicator("gold_per_min")}
            </Th>
            <Th onClick={() => handleSort("hero_damage")}>
              Hero Damage {renderSortIndicator("hero_damage")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => {
            const name = player.personaname || "Anonymous";
            const heroData = heroIdtoImg[player.hero_id];
            const items = [0, 1, 2, 3, 4, 5].map((i) => {
              const itemId = player[`item_${i}`];
              if (!itemId || itemId === 0) return null;
              const itemName = itemIdtoName[itemId];
              const imageData = itemName && itemNametoImage[itemName];
              return imageData ? (
                <ItemIcon
                  key={i}
                  src={`https://cdn.cloudflare.steamstatic.com${imageData.img}`}
                  alt={itemName}
                  title={itemName}
                />
              ) : null;
            });
            return (
              <tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{name}</Td>
                <Td>
                  {heroData ? (
                    <HeroIcon
                      src={`https://cdn.cloudflare.steamstatic.com${heroData.img}`}
                      alt={`Hero ${player.hero_id}`}
                      title={`Hero ${player.hero_id}`}
                    />
                  ) : (
                    player.hero_id
                  )}
                </Td>
                <Td>{items.filter(Boolean)}</Td>
                <Td>
                  <PurchaseTimeline purchaseLog={player.purchase_log} />
                </Td>
                <Td>{player.kills != null ? player.kills : "N/A"}</Td>
                <Td>{player.deaths != null ? player.deaths : "N/A"}</Td>
                <Td>{player.assists != null ? player.assists : "N/A"}</Td>
                <Td>{player.xp_per_min || "N/A"}</Td>
                <Td>{player.gold_per_min || "N/A"}</Td>
                <Td>{player.hero_damage || "N/A"}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default MatchDetails;
