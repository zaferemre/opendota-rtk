import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetMatchInfoQuery } from "../services/playerProfile";
import styled from "styled-components";
import {
  setSelectedTeamfight,
  setHoveredTeamfightIndex,
} from "../features/counter/matchSlice";
import * as d3 from "d3";
import { useParams } from "react-router-dom"; // <-- for route param

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  background: #181818;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  padding: 16px;
`;

const ChartWrapper = styled.div`
  height: 300px;
  width: 100%;
  background: #222;
  border-radius: 8px;
  padding: 8px;
`;

const MatchGraphs = () => {
  const dispatch = useDispatch();
  const { id: matchId } = useParams();
  const hoveredIndex = useSelector(
    (state) => state.match.hoveredTeamfightIndex
  );
  const {
    data: matchData,
    error,
    isLoading,
  } = useGetMatchInfoQuery(matchId, {
    skip: !matchId,
  });

  const chartRef = useRef(null);
  useEffect(() => {
    if (!matchData) return;

    const radiantGoldAdv = matchData?.radiant_gold_adv || [];
    const radiantXpAdv = matchData?.radiant_xp_adv || [];
    const teamfights = matchData?.teamfights || [];

    const timeSeriesData = radiantGoldAdv.map((gold, index) => ({
      time: index,
      goldDiff: gold,
      xpDiff: radiantXpAdv[index] || 0,
    }));

    const scatterData = teamfights.map((tf, index) => {
      const minuteTime =
        tf.start !== undefined ? Math.floor(tf.start / 60) : index;
      const goldValue = timeSeriesData[minuteTime]?.goldDiff || 0;
      return {
        time: minuteTime,
        y: goldValue,
        deaths: tf.deaths,
        index,
      };
    });

    d3.select(chartRef.current).selectAll("*").remove();

    const width = 640;
    const height = 280;
    const margin = { top: 10, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(timeSeriesData, (d) => d.time)])
      .range([0, innerWidth]);

    // ✅ Center y-axis around 0
    const yExtent = d3.extent(
      timeSeriesData.flatMap((d) => [d.goldDiff, d.xpDiff])
    );
    const maxAbsY = Math.max(Math.abs(yExtent[0]), Math.abs(yExtent[1]));

    const yScale = d3
      .scaleLinear()
      .domain([-maxAbsY, maxAbsY]) // symmetric around 0
      .range([innerHeight, 0]);

    const lineGold = d3
      .line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.goldDiff));

    const lineXp = d3
      .line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.xpDiff));

    // ✅ Draw zero line
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(0))
      .attr("y2", yScale(0))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,2");

    // Gold and XP lines
    svg
      .append("path")
      .datum(timeSeriesData)
      .attr("fill", "none")
      .attr("stroke", "#8884d8")
      .attr("stroke-width", 2)
      .attr("d", lineGold);

    svg
      .append("path")
      .datum(timeSeriesData)
      .attr("fill", "none")
      .attr("stroke", "#82ca9d")
      .attr("stroke-width", 2)
      .attr("d", lineXp);

    // Teamfight dots
    svg
      .selectAll(".teamfight")
      .data(scatterData)
      .enter()
      .append("circle")
      .attr("class", "teamfight")
      .attr("cx", (d) => xScale(d.time))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => (d.index === hoveredIndex ? 10 : 6))
      .attr("fill", "#ff5733")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .style("opacity", (d) => (d.index === hoveredIndex ? 1 : 0.8))
      .on("click", (event, d) => {
        const fight = teamfights[d.index];
        if (fight) dispatch(setSelectedTeamfight(fight));
      })
      .on("mouseenter", (event, d) => {
        dispatch(setHoveredTeamfightIndex(d.index));
      })
      .on("mouseleave", () => {
        dispatch(setHoveredTeamfightIndex(null));
      });

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll("text")
      .style("fill", "#ccc");

    // Y Axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("fill", "#ccc");
  }, [matchData, hoveredIndex, dispatch]);

  if (!matchId) return <Container>Please select a match.</Container>;
  if (isLoading) return <Container>Loading match data...</Container>;
  if (error) return <Container>Error loading match data.</Container>;

  return (
    <Container>
      <h3 style={{ textAlign: "center", color: "#ccc", marginBottom: "8px" }}>
        Match Graph
      </h3>
      <ChartWrapper ref={chartRef} />
    </Container>
  );
};

export default MatchGraphs;
