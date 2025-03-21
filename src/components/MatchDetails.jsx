import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import itemIdtoName from "../utils/item_ids.json";
import itemNametoImage from "../utils/items.json";
import heroIdtoImg from "../utils/heroes.json";
import { useParams } from "react-router-dom"; // <-- for route param

const Container = styled.div`
  margin: 16px auto;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
`;

const Th = styled.th`
  padding: 8px;
  background: #f0f0f0;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
`;

const Td = styled.td`
  padding: 6px;
  border: 1px solid #ccc;
  text-align: center;
`;

const ItemIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: scale-down;
  margin: 0 1px;
`;

const HeroIcon = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
`;

const SortIndicator = styled.span`
  margin-left: 4px;
  font-size: 0.7rem;
`;

const TimelineContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 4px;
`;

const TimelineIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: scale-down;
`;

const TimelineTime = styled.span`
  font-size: 0.6rem;
  color: #666;
`;

const PurchaseTimeline = ({ purchaseLog }) => {
  if (!purchaseLog || purchaseLog.length === 0) return "-";
  return (
    <TimelineContainer>
      {purchaseLog.map((entry, index) => {
        const imageData = itemNametoImage[entry.key];
        return (
          <div key={index} style={{ textAlign: "center" }}>
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
          </div>
        );
      })}
    </TimelineContainer>
  );
};

const MatchDetails = () => {
  const { id: matchId } = useParams(); // ✅ Get matchId from URL
  const { data, error, isLoading } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const players = (data && data.players) || [];

  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return players;
    const sorted = [...players].sort((a, b) => {
      const aVal = a[sortConfig.key] || 0;
      const bVal = b[sortConfig.key] || 0;
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
    return sorted;
  }, [players, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <SortIndicator>
        {sortConfig.direction === "asc" ? "▲" : "▼"}
      </SortIndicator>
    );
  };

  if (!matchId) return <Container>Select a match.</Container>;
  if (isLoading) return <Container>Loading match...</Container>;
  if (error) return <Container>Error loading match.</Container>;

  return (
    <Container>
      <h3>Match Details: {matchId}</h3>
      <Table>
        <thead>
          <tr>
            <Th>#</Th>
            <Th onClick={() => handleSort("personaname")}>
              Name{renderSortIndicator("personaname")}
            </Th>
            <Th>Hero</Th>
            <Th>Items</Th>
            <Th>Purchases</Th>
            <Th onClick={() => handleSort("kills")}>
              K{renderSortIndicator("kills")}
            </Th>
            <Th onClick={() => handleSort("deaths")}>
              D{renderSortIndicator("deaths")}
            </Th>
            <Th onClick={() => handleSort("assists")}>
              A{renderSortIndicator("assists")}
            </Th>
            <Th onClick={() => handleSort("xp_per_min")}>
              XPM{renderSortIndicator("xp_per_min")}
            </Th>
            <Th onClick={() => handleSort("gold_per_min")}>
              GPM{renderSortIndicator("gold_per_min")}
            </Th>
            <Th onClick={() => handleSort("hero_damage")}>
              DMG{renderSortIndicator("hero_damage")}
            </Th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((p, i) => {
            const heroData = heroIdtoImg[p.hero_id];
            const heroIcon = heroData ? (
              <HeroIcon
                src={`https://cdn.cloudflare.steamstatic.com${heroData.img}`}
                alt={`Hero ${p.hero_id}`}
                title={`Hero ${p.hero_id}`}
              />
            ) : (
              p.hero_id
            );

            const items = [0, 1, 2, 3, 4, 5].map((j) => {
              const itemId = p[`item_${j}`];
              if (!itemId || itemId === 0) return null;
              const itemName = itemIdtoName[itemId];
              const itemImg = itemName && itemNametoImage[itemName];
              return itemImg ? (
                <ItemIcon
                  key={j}
                  src={`https://cdn.cloudflare.steamstatic.com${itemImg.img}`}
                  alt={itemName}
                  title={itemName}
                />
              ) : null;
            });

            return (
              <tr key={i}>
                <Td>{i + 1}</Td>
                <Td>{p.personaname || "Anonymous"}</Td>
                <Td>{heroIcon}</Td>
                <Td>{items.filter(Boolean)}</Td>
                <Td>
                  <PurchaseTimeline purchaseLog={p.purchase_log} />
                </Td>
                <Td>{p.kills ?? "-"}</Td>
                <Td>{p.deaths ?? "-"}</Td>
                <Td>{p.assists ?? "-"}</Td>
                <Td>{p.xp_per_min ?? "-"}</Td>
                <Td>{p.gold_per_min ?? "-"}</Td>
                <Td>{p.hero_damage ?? "-"}</Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default MatchDetails;
