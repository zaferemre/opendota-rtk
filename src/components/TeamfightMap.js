import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setSelectedTeamfight } from "../features/counter/matchSlice";
import { setHoveredTeamfightIndex } from "../features/counter/matchSlice";
import { useSelector } from "react-redux";

// Map image config
const MAP_IMAGE = "/Gamemap_7.38_minimap_dota2_gameasset.png";
const MAP_DISPLAY_SIZE = 400; // Smarter size for UI
const MAP_COORD_MAX = 255; // Source coordinate max from API

const MapWrapper = styled.div`
  position: relative;
  width: ${MAP_DISPLAY_SIZE}px;
  height: ${MAP_DISPLAY_SIZE}px;
  background-image: url(${MAP_IMAGE});
  background-size: cover;
  background-position: center;
  border: 2px solid #333;
  border-radius: 12px;
  overflow: hidden;
`;

const Marker = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ff5733;
  border: 1.5px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 2;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  transform: translate(-50%, -120%);
  pointer-events: none;
`;

const TeamfightMap = ({ teamfights }) => {
  const dispatch = useDispatch();
  const hoveredIdx = useSelector((state) => state.match.hoveredTeamfightIndex);

  const computeAveragePosition = (players) => {
    let sumX = 0,
      sumY = 0,
      count = 0;
    players.forEach((p) => {
      if (p.deaths_pos) {
        for (const [xStr, yMap] of Object.entries(p.deaths_pos)) {
          for (const [yStr, times] of Object.entries(yMap)) {
            const x = parseFloat(xStr);
            const y = parseFloat(yStr);
            sumX += x * times;
            sumY += y * times;
            count += times;
          }
        }
      }
    });
    return count ? { x: sumX / count, y: sumY / count } : null;
  };

  const scaleCoord = (val) => (val / MAP_COORD_MAX) * MAP_DISPLAY_SIZE;

  return (
    <MapWrapper>
      {" "}
      {teamfights.map((fight, idx) => {
        const avgPos = computeAveragePosition(fight.players);
        if (!avgPos) return null;

        const left = scaleCoord(avgPos.x);
        const top = scaleCoord(avgPos.y);

        return (
          <div
            key={idx}
            style={{ position: "absolute", left, top }}
            onMouseEnter={() => dispatch(setHoveredTeamfightIndex(idx))}
            onMouseLeave={() => dispatch(setHoveredTeamfightIndex(null))}
          >
            <Marker onClick={() => dispatch(setSelectedTeamfight(fight))} />{" "}
            {hoveredIdx === idx && (
              <Tooltip>
                {" "}
                {Math.floor(fight.start / 60)}
                m– {fight.deaths} {fight.deaths === 1 ? "death" : "deaths"}{" "}
              </Tooltip>
            )}{" "}
          </div>
        );
      })}{" "}
    </MapWrapper>
  );
};

export default TeamfightMap;
