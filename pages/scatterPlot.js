import React, { useEffect } from "react";
import {
  select,
  scaleTime,
  scaleLinear,
  axisLeft,
  axisBottom,
  timeFormat,
  extent,
  min,
  max,
  format,
  scaleOrdinal,
} from "d3";
export default function ScatterPlot({ data }) {
  //console.log(data);
  useEffect(() => {
    data.forEach((d) => {
      d.Place = +d.Place;
      if (typeof d.Time == "string") {
        let parsedTime = d.Time.split(":");
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1], 0);
      }
    });
    //Graph Margins
    const margin = {
      top: 60,
      right: 20,
      bottom: 65,
      left: 80,
    };
    //chart title
    const title = "Doping in Professional Bicycle Racing";
    const subtitle = "35 Fastest times up Alpe d'Huez";
    //Svg Height & Width
    const svgHeight = 460;
    const svgWidth = 900;
    //Graph Height & Width
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;
    //SVG
    let svg = select(".chart").append("svg");
    svg.style("height", svgHeight).style("width", svgWidth);

    //X-Values
    const xValue = (d) => d.Year;
    const xAxisLabel = "Year";
    //Y-Values
    const yValue = (d) => d.Time;
    const yAxisLabel = "Time in Minutes";
    //X-Scale
    const xScale = scaleLinear()
      .domain([min(data, (d) => d.Year - 1), max(data, (d) => d.Year + 1)])
      .range([0, innerWidth]);
    //Y-Scale
    const yScale = scaleTime()
      .domain(extent(data, yValue))
      .range([0, innerHeight]);
    //Color Scale
    var color = scaleOrdinal().range(["purple", "#50e7f2"]);
    //Instantiating X Axis
    const xAxisInit = axisBottom(xScale);
    xAxisInit.tickFormat(format("d"));
    //Instantiating Y Axis
    const yAxisInit = axisLeft(yScale);
    yAxisInit.tickFormat(timeFormat("%M:%S"));
    //Creating a group to be the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //Appending Y-Axis to g
    const yAxis = g.append("g").call(yAxisInit);
    yAxis.selectAll("text").style("font-size", "1.2em");
    //Y-Axis Label
    yAxis
      .attr("id", "y-axis")
      .append("text")
      .text(yAxisLabel)
      .attr("y", -55)
      .attr("x", -innerHeight / 2)
      .attr("font-size", "1.5em")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle");
    //Appending X-Axis to g
    const xAxis = g.append("g").call(xAxisInit);
    xAxis
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .selectAll("text")
      .style("font-size", "1.2em");

    //X-Axis Label
    xAxis
      .append("text")
      .text(xAxisLabel)
      .attr("y", 45)
      .attr("x", innerWidth / 2)
      .attr("font-size", "1.5em")
      .attr("fill", "black");
    //ToolTip
    var tooltip = select(".chart")
      .append("div")
      .attr("id", "tooltip")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("font-size", "14px")
      .style("padding", "10px")
      .style("opacity", 0);
    //Appending points to g
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", 6)
      .style("fill", (d) => color(d.Doping !== ""))
      .attr("opacity", "0.8")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time.toISOString())
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            d.Name +
              ": " +
              d.Nationality +
              "<br>" +
              "Year: " +
              d.Year +
              ", " +
              "Time: " +
              d.Time.getMinutes() +
              ":" +
              d.Time.getSeconds() +
              "<br>" +
              d.Doping
          )
          .attr("data-year", d.Year)
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 100 + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
    //Title
    g.append("text")
      .attr("id", "title")
      .text(title)
      .attr("y", -30)
      .attr("x", innerWidth / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em");
    //Subtitle
    g.append("text")
      .text(subtitle)
      .attr("y", -10)
      .attr("x", innerWidth / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "1em");
    //Legend

    var legend = g
      .append("g")
      .attr("id", "legend")
      .selectAll("#legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", function (d, i) {
        return "translate(0," + (innerHeight / 4 - i * 20) + ")";
      });

    legend
      .append("rect")
      .attr("x", innerWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", innerWidth - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        if (d) {
          return "Riders with doping allegations";
        } else {
          return "No doping allegations";
        }
      });
    return () => {
      svg = svg.remove();
    };
  }, []);
  return (
    <div>
      <div className="chart"></div>
    </div>
  );
}

export async function getStaticProps(context) {
  const resource = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return {
    props: { data: resource },
  };
}
