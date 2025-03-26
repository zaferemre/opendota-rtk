import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTeamfight,
  setHoveredTeamfightIndex,
} from "../../features/counter/matchSlice";
import {
  Controls,
  Marker,
  Slider,
  SliderGroup,
  Tooltip,
} from "./TeamfightMap.styled";

const MAP_IMAGE = "/Gamemap_7.38_minimap_dota2_gameasset.png";
const MAP_DISPLAY_SIZE = 400;

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
  margin-bottom: 16px;
`;
const TeamfightMap = ({ teamfights }) => {
  const dispatch = useDispatch();
  const hoveredIdx = useSelector((state) => state.match.hoveredTeamfightIndex);

  // Adjustable transform coefficients
  const [a, setA] = useState(6.7225);
  const [b, setB] = useState(4.0);
  const [c, setC] = useState(-1296.01);
  const [d, setD] = useState(-6.7191);
  const [e, setE] = useState(-4.7088);
  const [f, setF] = useState(1953.26);
  const [scaleX, setScaleX] = useState(0.5891);
  const [scaleY, setScaleY] = useState(0.5948);

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

  const transformPosition = (x, y) => {
    const px = (a * y + b * x + c) * scaleX;
    const py = (d * y + e * x + f) * scaleY;
    return { left: px, top: py };
  };

  return (
    <>
      <Controls>
        {[
          ["🧮 a", a, setA, -20, 20],
          ["🧮 b", b, setB, -20, 20],
          ["🔧 c", c, setC, -2000, 2000],
          ["🧮 d", d, setD, -20, 20],
          ["🧮 e", e, setE, -20, 20],
          ["🔧 f", f, setF, -2000, 2000],
          ["📏 scaleX", scaleX, setScaleX, 0.1, 2],
          ["📏 scaleY", scaleY, setScaleY, 0.1, 2],
        ].map(([label, value, setter, min, max]) => (
          <SliderGroup key={label}>
            <label>
              {label}: {Number(value).toFixed(4)}
              <Slider
                type="range"
                min={min}
                max={max}
                step="0.01"
                value={value}
                onChange={(e) => setter(parseFloat(e.target.value))}
              />
            </label>
          </SliderGroup>
        ))}
      </Controls>
      <MapWrapper>
        {teamfights.map((fight, idx) => {
          const avgPos = computeAveragePosition(fight.players);
          if (!avgPos) return null;

          const { left, top } = transformPosition(avgPos.x, avgPos.y);

          return (
            <div
              key={idx}
              style={{ position: "absolute", left, top }}
              onMouseEnter={() => dispatch(setHoveredTeamfightIndex(idx))}
              onMouseLeave={() => dispatch(setHoveredTeamfightIndex(null))}
            >
              <Marker onClick={() => dispatch(setSelectedTeamfight(fight))} />
              {hoveredIdx === idx && (
                <Tooltip>
                  {Math.floor(fight.start / 60)}m – {fight.deaths}{" "}
                  {fight.deaths === 1 ? "death" : "deaths"}
                </Tooltip>
              )}
            </div>
          );
        })}
      </MapWrapper>
    </>
  );
};

export default TeamfightMap;
