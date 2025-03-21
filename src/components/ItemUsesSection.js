import React from "react";
import styled from "styled-components";
import itemNametoImage from "../utils/items.json";

const cdnBase = "https://cdn.cloudflare.steamstatic.com";

const ItemGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

const ItemIconWrapper = styled.div`
  position: relative;

  height: 40px;
`;

const ItemImg = styled.img`
  height: 100%;
  border-radius: 4px;
  border: 1px solid #555;
`;

const ItemCount = styled.div`
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

const ItemUsesSection = ({ item_uses }) => {
  if (!item_uses || Object.keys(item_uses).length === 0) return <> N / A </>;

  return (
    <ItemGrid>
      {" "}
      {Object.entries(item_uses).map(([itemName, count]) => {
        const imagePath = itemNametoImage[itemName].img;
        if (!imagePath) return null;

        return (
          <ItemIconWrapper key={itemName} title={`${itemName}: ${count}`}>
            <ItemImg src={`${cdnBase}${imagePath}`} alt={itemName} />{" "}
            <ItemCount> {count} </ItemCount>{" "}
          </ItemIconWrapper>
        );
      })}{" "}
    </ItemGrid>
  );
};

export default ItemUsesSection;
