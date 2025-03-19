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

// Custom dot component so scatter points (teamfight markers) are clickable.
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

  if (!matchId) {
    return <Container>Please select a match.</Container>;
  }
  if (isLoading) {
    return <Container>Loading match data...</Container>;
  }
  if (error) {
    return <Container>Error loading match data.</Container>;
  }

  // Extract arrays with safe defaults.
  const radiantGoldAdv = matchData?.radiant_gold_adv || [];
  const radiantXpAdv = matchData?.radiant_xp_adv || [];
  const teamfights = matchData?.teamfights || [];

  // Transform arrays into time series data.
  // Here, each index represents one minute.
  const timeSeriesData = radiantGoldAdv.map((gold, index) => ({
    time: index, // each index equals one minute
    goldDiff: gold,
    xpDiff: radiantXpAdv[index] || 0,
  }));

  // Create scatter data for teamfights.
  // Convert teamfight start time (seconds) to minutes.
  const scatterData = teamfights.map((tf, index) => {
    const minuteTime =
      tf.start !== undefined ? Math.floor(tf.start / 60) : index;
    const goldValue = timeSeriesData[minuteTime]
      ? timeSeriesData[minuteTime].goldDiff
      : 0;
    return {
      time: minuteTime, // x-axis value in minutes
      y: goldValue, // y-axis value (gold difference at that minute)
      deaths: tf.deaths,
      // additional fields can be added as needed
    };
  });

  // Handle clicking on a teamfight marker.
  const handleTeamfightClick = (payload) => {
    // Find the teamfight whose converted start time (in minutes) matches the clicked payload's time.
    const fight = teamfights.find((tf, index) => {
      const fightTime =
        tf.start !== undefined ? Math.floor(tf.start / 60) : index;
      return fightTime === payload.time;
    });
    if (fight) {
      dispatch(setSelectedTeamfight(fight));
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
        The red dots indicate teamfight events. Click on a dot to view detailed
        information about that teamfight.
      </p>
    </Container>
  );
};

export default MatchGraphs;
