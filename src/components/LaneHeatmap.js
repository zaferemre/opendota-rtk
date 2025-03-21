import React from "react";
import styled from "styled-components";

const MAP_IMAGE = "/Gamemap_7.38_minimap_dota2_gameasset.png";
const MAP_SIZE = 512;
const COORD_MAX = 127; // lane_pos values go from 0–127 usually

const MapWrapper = styled.div`
  position: relative;
  width: ${MAP_SIZE}px;
  height: ${MAP_SIZE}px;
  background-image: url(${MAP_IMAGE});
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #444;
`;

const HeatDot = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 0, 0, ${(props) => props.intensity || 0.2});
  border-radius: 50%;
  transform: translate(-50%, -50%);
`;

const LaneHeatmap = ({ lanePos }) => {
  const points = [];
  if (!lanePos) return null;

  for (const [xStr, yMap] of Object.entries(lanePos)) {
    const x = parseInt(xStr, 10);
    for (const [yStr, count] of Object.entries(yMap)) {
      const y = parseInt(yStr, 10);
      points.push({ x, y, count });
    }
  }

  const maxCount = Math.max(...points.map((p) => p.count), 1);

  return (
    <MapWrapper>
      {" "}
      {points.map((p, i) => {
        const left = (p.x / COORD_MAX) * MAP_SIZE;
        const top = (p.y / COORD_MAX) * MAP_SIZE;
        return (
          <HeatDot
            key={i}
            style={{ left, top }}
            intensity={p.count / maxCount}
          />
        );
      })}{" "}
    </MapWrapper>
  );
};

export default LaneHeatmap;
