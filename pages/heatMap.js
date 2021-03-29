import React, { useEffect } from "react";
import {
  select,
  scaleTime,
  scaleBand,
  scaleLinear,
  axisLeft,
  axisBottom,
  timeFormat,
  extent,
  min,
  max,
  format,
  schemeCategory10,
  scaleOrdinal,
  scaleThreshold,
} from "d3";
import { motion } from "framer-motion";
export default function heatMap({ data, baseTemp }) {
  useEffect(() => {
    //Graph Margins
    const margin = {
      top: 60,
      right: 30,
      bottom: 65,
      left: 80,
    };
    //chart title
    const title = "Monthly Global Land-Surface Temperature";
    const subtitle =
      data[0].year +
      " - " +
      data[data.length - 1].year +
      ": base temperature " +
      baseTemp +
      "℃";
    //Svg Height & Width
    const svgHeight = 560;
    const svgWidth = 1000;
    //Graph Height & Width
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;
    //SVG
    let svg = select(".chart").append("svg");
    svg.style("height", svgHeight).style("width", svgWidth);

    //X-Values
    const xValue = (d) => d.year;
    const xAxisLabel = "Year";
    //Y-Values
    const yValue = (d) => d.month;
    const yAxisLabel = "Month";
    //X-Scale
    const years = data.map((d) => {
      return d.year;
    });
    const xScale = scaleBand().domain(years).range([0, innerWidth]);
    //Y-Scale
    const yScale = scaleBand()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
      .range([0, innerHeight])
      .padding(0.2);
    //Instantiating X Axis
    const xAxisInit = axisBottom(xScale);
    xAxisInit.tickValues(
      xScale.domain().filter(function (year) {
        // set ticks to years divisible by 10
        return year % 10 === 0;
      })
    );
    xAxisInit.tickFormat(function (year) {
      var date = new Date(0);
      date.setUTCFullYear(year);
      return timeFormat("%Y")(date);
    });
    xAxisInit.tickSize(10, 1);
    //Instantiating Y Axis
    const yAxisInit = axisLeft(yScale);
    yAxisInit.tickFormat(function (month) {
      var date = new Date(0);
      date.setUTCMonth(month);
      return timeFormat("%B")(date);
    });
    //Creating a group to be the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Legend
    let colorArray = [
      "#a50026",
      "#d73027",
      "#f46d43",
      "#fdae61",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#abd9e9",
      "#74add1",
      "#4575b4",
      "#313695",
    ];
    var legendColors = colorArray.reverse();
    var legendWidth = 400;
    var legendHeight = 300 / legendColors.length;
    var variance = data.map(function (val) {
      return val.variance;
    });
    var minTemp = baseTemp + Math.min.apply(null, variance);
    var maxTemp = baseTemp + Math.max.apply(null, variance);
    let thresholdDomain = () => {
      var array = [];
      var step = (maxTemp - minTemp) / legendColors.length;
      var base = minTemp;
      for (let i = 1; i < legendColors.length; i++) {
        array.push(base + i * step);
      }
      return array;
    };
    var legendThreshold = scaleThreshold()
      .domain(thresholdDomain())
      .range(legendColors);
    var legendXScale = scaleLinear()
      .domain([minTemp, maxTemp])
      .range([0, legendWidth]);
    var legendXInit = axisBottom(legendXScale);
    legendXInit.tickValues(legendThreshold.domain()).tickFormat(format(".1f"));
    //Legend Group
    const legendSVG = select(".chart")
      .append("div")
      .attr("id", "legend")
      .style("height", "100px")
      .append("svg")
      .style("width", svgWidth)
      .style("height", "100px");
    const legendGroup = legendSVG
      .append("g")
      .attr("transform", `translate(${svgWidth / 3.5}, 40)`);
    //Legend X-Axis
    legendGroup.append("g").call(legendXInit);
    //Legend Bars
    legendGroup
      .selectAll("rect")
      .data(
        legendThreshold.range().map(function (color) {
          var d = legendThreshold.invertExtent(color);
          if (d[0] === null) d[0] = legendXScale.domain()[0];
          if (d[1] === null) d[1] = legendXScale.domain()[1];
          return d;
        })
      )
      .enter()
      .append("rect")
      .style("fill", function (d) {
        return legendThreshold(d[0]);
      })
      .style("stroke-width", 1)
      .style("stroke", "black")
      .attr("x", function (d) {
        return legendXScale(d[0]);
      })
      .attr("y", "-28")
      .attr("width", function (d) {
        return legendXScale(d[1]) - legendXScale(d[0]);
      })
      .attr("height", function (d) {
        return legendHeight;
      });

    //ToolTip
    var tooltip = select(".chart")
      .append("div")
      .attr("id", "tooltip")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("font-size", "14px")
      .style("padding", "10px")
      .style("opacity", 0)
      .style("text-align", "center");
    //Appending Bars to g
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("y", (d) => yScale(yValue(d)))
      .attr("x", (d) => xScale(xValue(d)))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("data-month", (d) => d.month)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => baseTemp + d.variance)
      .attr("fill", function (d) {
        return legendThreshold(baseTemp + d.variance);
      })
      .on("mouseover", function (event, d) {
        var date = new Date(d.year, d.month);
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            timeFormat("%Y - %B")(date) +
              "<br>" +
              format(".1f")(baseTemp + d.variance) +
              "&#8451;" +
              "<br>" +
              format("+.1f")(d.variance) +
              "&#8451;"
          )
          .attr("data-year", d.year)
          .style("left", event.pageX - 50 + "px")
          .style("top", event.pageY - 100 + "px")
          .style("transform", "translateX(60px)");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
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
    //Appending Y-Axis to g
    const yAxis = g.append("g").call(yAxisInit);
    yAxis.attr("transform", `translate(0)`);
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
      .attr("id", "description")
      .text(subtitle)
      .attr("y", -10)
      .attr("x", innerWidth / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "1em");

    return () => {
      /*  svg = svg.remove(); */
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
      style={{ height: 660, width: 1000 }}
    >
      <div className="chart"></div>
    </motion.div>
  );
}

export async function getStaticProps(context) {
  const resource = await fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  resource.monthlyVariance.forEach((d) => {
    d.month -= 1;
  });

  return {
    props: {
      data: resource.monthlyVariance,
      baseTemp: resource.baseTemperature,
    },
  };
}
