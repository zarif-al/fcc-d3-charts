import React, { useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  min,
  max,
  scaleTime,
  axisLeft,
  axisBottom,
} from "d3";
import { motion } from "framer-motion";
export default function Home({ data }) {
  const dateShortner = (date) => {
    date = new Date(date);
    if (date.getMonth() == 0) {
      return date.getFullYear() + " Q1";
      //Q1
    } else if (date.getMonth() == 3) {
      return date.getFullYear() + " Q2";
      //Q2
    } else if (date.getMonth() == 6) {
      return date.getFullYear() + " Q3";
      //Q3
    } else {
      return date.getFullYear() + " Q4";
      //Q4
    }
  };

  useEffect(() => {
    //Svg Height & Width
    const svgHeight = 660;
    const svgWidth = 1200;
    //Graph Margins
    const margin = {
      top: 50,
      right: 20,
      bottom: 60,
      left: 80,
    };
    //Graph Height & Width
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;

    //SVG
    let svg = select(".chart").append("svg");
    svg.style("height", svgHeight).style("width", svgWidth);
    //X-Values
    const xValue = (d) => new Date(d[0]);
    //Y-Values
    const yValue = (d) => d[1];
    //increasing the upperbound because bars exceed xScale otherwise
    let maxDate = max(data, xValue);
    maxDate = maxDate.setMonth(maxDate.getMonth() + 4);
    //X-Scale
    const xScale = scaleTime()
      .domain([min(data, xValue), maxDate])
      .range([0, innerWidth]);
    //Y-Scale
    const yScale = scaleLinear()
      .domain([0, max(data, yValue)])
      .range([innerHeight, 0]);
    //Chart Title
    const title = "United States GDP";
    //Instantiating Axes
    //X-Axis
    const xLabel = "Year";
    const xAxisInit = axisBottom(xScale);
    //Y-Axis
    const yLabel = "Gross Domestic Product";
    const yAxisInit = axisLeft(yScale);
    //yAxisInit.tickFormat((number) => format(".2s")(number).replace("G", "B"));
    yAxisInit.tickSize(-innerWidth);
    yAxisInit.tickSizeOuter(0);
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
      .text(yLabel)
      .attr("y", -55)
      .attr("x", -innerHeight / 2)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em")
      .attr("fill", "black");
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
      .text(xLabel)
      .attr("y", 50)
      .attr("x", innerWidth / 2)
      .attr("font-size", "1.5em")
      .attr("fill", "black");
    /*
      TO REMOVE TICKS AND ELEMENTS. BECAUSE OF
      FONT TILTING I WILL NEED TO APPLY THIS SEPERATELY.
      .select(".domain")
        .remove()
        OR
      .selectAll(".domain, .tick line").remove()
      xAxis.select(".domain").remove();
      */
    //ToolTip

    var tooltip = select(".chart")
      .append("div")
      .attr("id", "tooltip")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("font-size", "18px")
      .style("text-align", "center")
      .style("width", "150px")
      .style("heigth", "50px")
      .style("padding", "2px")
      .style("opacity", 0);
    //Appending Bars to g
    const bars = g
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(yValue(d)))
      .attr("x", (d) => xScale(xValue(d)))
      .attr("width", innerWidth / 275)
      .attr("height", (d) => innerHeight - yScale(yValue(d)))
      .attr("fill", "steelBlue");
    bars.attr("data-date", (d) => d[0]).attr("data-gdp", (d) => d[1]);
    bars
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        const dateInfo = dateShortner(d[0]);
        tooltip
          .html(
            dateInfo +
              "<br>" +
              "$" +
              d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
              " Billion"
          )
          .attr("data-date", d[0])
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
      .attr("y", -15)
      .attr("x", svgWidth / 2)
      .attr("text-anchor", "end")
      .attr("font-size", "1.5em");

    return () => {
      svg = svg.remove();
      tooltip = tooltip.remove();
    };
  }, []);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
        exit: { opacity: 0, x: 100, transition: { duration: 1 } },
      }}
      className="chart"
      style={{ width: 1200, height: 660 }}
    ></motion.div>
  );
}

export async function getStaticProps(context) {
  const resource = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return {
    props: { data: resource.data },
  };
}
