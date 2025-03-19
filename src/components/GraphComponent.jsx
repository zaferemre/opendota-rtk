import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
} from "recharts";
import { setSelectedTeamfight } from "../features/counter/matchSlice";

const Container = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const ChartWrapper = styled.div`
  margin-bottom: 40px;
`;

const CustomDot = (props) => {
  const { cx, cy, payload, onDotClick } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill="red"
      stroke="black"
      strokeWidth={1}
      cursor="pointer"
      onClick={() => onDotClick(payload)}
    />
  );
};

const sampleMatchData = {
  radiant_gold_adv: [
    0, -70, 252, 632, -42, 449, 429, 876, 1204, 1653, 2034, 1277, -672, 478,
    -1894, -1363, -1632, -2459, -2463, -2521, -3530, -2882, -3332, -4273, -1052,
    -937, -1063, 630, 354, 2731, 2276, 3044, 2494, -242, -1661, -2199, -3308,
    3739, 6523, 6506, 5043, 4652, 3278, 1786, 619, -1475, -7726, -13583, -17292,
    -22247,
  ],
  radiant_xp_adv: [
    0, -170, -33, 271, -91, 141, -130, 613, 238, 681, 1077, 388, -1951, -655,
    -3383, -3213, -4268, -4093, -4161, -4597, -4955, -4941, -7693, -5637, -679,
    -2036, -2026, 1336, 384, 5059, 5298, 7542, 5548, 1064, 104, -295, -7135,
    11627, 11739, 11208, 7542, 7285, 6353, 3671, 2518, 717, -14336, -16820,
    -25573, -30833,
  ],
  teamfights: [
    { start: 351, deaths: 3 },
    { start: 402, deaths: 4 },
    { start: 707, deaths: 3 },
    { start: 911, deaths: 4 },
    { start: 1279, deaths: 4 },
    { start: 1658, deaths: 5 },
    { start: 1899, deaths: 3 },
  ],
};

const MatchGraphs = () => {
  const dispatch = useDispatch();
  const matchId = useSelector((state) => state.match.selectedMatchId);
  const {
    data: matchData,
    error,
    isLoading,
  } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  // Use sample data if API data isn't available.
  const effectiveMatchData = matchData || sampleMatchData;

  // Debug logs
  console.log("Effective match data:", effectiveMatchData);

  const radiantGoldAdv = Array.isArray(effectiveMatchData.radiant_gold_adv)
    ? effectiveMatchData.radiant_gold_adv
    : [];
  const radiantXpAdv = Array.isArray(effectiveMatchData.radiant_xp_adv)
    ? effectiveMatchData.radiant_xp_adv
    : [];
  const teamfights = Array.isArray(effectiveMatchData.teamfights)
    ? effectiveMatchData.teamfights
    : [];

  const timeSeriesData = radiantGoldAdv.map((gold, index) => ({
    time: index,
    goldDiff: gold,
    xpDiff: radiantXpAdv[index] || 0,
  }));

  const scatterData = teamfights.map((tf, index) => {
    const minuteTime = Math.floor(tf.start / 60);
    const goldValue = timeSeriesData[minuteTime]
      ? timeSeriesData[minuteTime].goldDiff
      : 0;
    return {
      time: minuteTime,
      y: goldValue,
      deaths: tf.deaths,
    };
  });

  const handleTeamfightClick = (payload) => {
    const fight = teamfights.find((tf, index) => {
      const fightTime =
        tf.start !== undefined ? Math.floor(tf.start / 60) : index;
      return fightTime === payload.time;
    });
    if (fight) {
      dispatch(setSelectedTeamfight(fight));
      console.log("Teamfight clicked:", fight);
    }
  };

  return (
    <Container>
      <h2>Match Metrics Over Time</h2>
      <ChartWrapper>
        <LineChart
          width={1000}
          height={400}
          data={timeSeriesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time (min)",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="goldDiff"
            stroke="#8884d8"
            dot={{ stroke: "#8884d8", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 8 }}
            name="Gold Difference"
          />
          <Line
            type="monotone"
            dataKey="xpDiff"
            stroke="#82ca9d"
            dot={{ stroke: "#82ca9d", strokeWidth: 2, r: 3 }}
            name="XP Difference"
          />
          <Scatter
            data={scatterData}
            name="Teamfight"
            onClick={handleTeamfightClick}
            dot={(props) => (
              <CustomDot {...props} onDotClick={handleTeamfightClick} />
            )}
          />
        </LineChart>
      </ChartWrapper>
      <p>
        Red dots mark teamfight events (converted from seconds to minutes).
        Click on a red dot to view details (see console).
      </p>
    </Container>
  );
};

export default MatchGraphs;
