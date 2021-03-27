import React, { useEffect } from "react";
import {
  select,
  geoPath,
  zoom,
  max,
  min,
  geoTransform,
  schemeOranges,
  range,
  scaleThreshold,
  scaleLinear,
  axisBottom,
  format,
} from "d3";
import { feature } from "topojson-client";
export default function choroplethMap({ topology, eduData }) {
  //Svg Height & Width
  const svgHeight = 560;
  const svgWidth = 960;
  //Titles
  const title = "United States Educational Attainment";
  const subtitle =
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)";
  //Graph Margins
  const margin = {
    top: 50,
    right: 20,
    bottom: 45,
    left: 65,
  };
  //Graph Height & Width
  const innerHeight = svgHeight - margin.top - margin.bottom;
  const innerWidth = svgWidth - margin.left - margin.right;
  const counties = feature(topology, topology.objects.counties);
  function scale(scaleFactor, width, height) {
    return geoTransform({
      point: function (x, y) {
        this.stream.point(
          (x - width / 2) * scaleFactor + width / 2,
          /*       y * scaleFactor */
          (y - height / 1.5) * scaleFactor + height / 1.5
        );
      },
    });
  }
  const pathGen = geoPath().projection(scale(0.75, innerWidth, innerHeight));
  useEffect(() => {
    //SVG
    let svg = select(".chart").append("svg");
    svg
      .style("background-color", "lightgrey")
      .style("height", svgHeight)
      .style("width", svgWidth);
    //need to create a group for zoom to work properly.
    const g = svg.append("g");
    //Zoom
    svg.call(
      zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        })
    );
    //Legend
    const legendColors = schemeOranges[8];
    var legendWidth = 400;
    const minEdu = min(eduData, (d) => d.bachelorsOrHigher);
    const maxEdu = max(eduData, (d) => d.bachelorsOrHigher);
    console.log(minEdu);
    console.log(maxEdu);
    let thresholdDomain = () => {
      var array = [];
      var step = (maxEdu - minEdu) / legendColors.length;
      var base = minEdu;
      for (let i = 0; i < legendColors.length; i++) {
        array.push(base + i * step);
      }
      return array;
    };
    /*    console.log(thresholdDomain());
    console.log(
      range(minEdu, maxEdu, (maxEdu - minEdu) / schemeOranges[8].length)
    ); */
    var legendThreshold = scaleThreshold()
      .domain(thresholdDomain())
      .range(legendColors);
    var legendXScale = scaleLinear()
      .domain([minEdu, maxEdu])
      .range([0, legendWidth]);
    var legendXInit = axisBottom(legendXScale);
    legendXInit
      .tickSize(13)
      .tickFormat((x) => Math.round(x) + "%")
      .tickValues(legendThreshold.domain());
    //Legend Declaraction
    const legendGroup = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${innerWidth / 1.5}, 80)`);
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
      .attr("x", function (d) {
        return legendXScale(d[0]);
      })
      .attr("width", function (d) {
        return legendXScale(d[1]) - legendXScale(d[0]);
      })
      .attr("height", "8");
    //Legend X-Axis
    legendGroup.append("g").call(legendXInit).select(".domain").remove();
    //ToolTip
    var tooltip = select(".chart")
      .append("div")
      .attr("id", "tooltip")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("font-size", "14px")
      .style("padding", "10px")
      .style("opacity", 0);
    //County Paths
    const paths = g
      .selectAll("path")
      .data(counties.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", pathGen)
      .attr("data-fips", (d) => {
        const county = eduData.find((data) => data.fips === d.id);
        if (county !== undefined) {
          return county.fips;
        }
      })
      .attr("data-education", (d) => {
        const county = eduData.find((data) => data.fips === d.id);
        if (county !== undefined) {
          return county.bachelorsOrHigher;
        }
      })
      .attr("fill", (d) => {
        const county = eduData.find((data) => data.fips === d.id);
        if (county !== undefined) {
          return legendThreshold(county.bachelorsOrHigher);
        }
      })
      .on("mouseover", function (event, d) {
        const county = eduData.find((data) => data.fips === d.id);
        if (county !== undefined) {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(
              county.area_name +
                ", " +
                county.state +
                ": " +
                county.bachelorsOrHigher +
                "%"
            )
            .attr("data-education", county.bachelorsOrHigher)
            .style("left", event.pageX - 50 + "px")
            .style("top", event.pageY + "px")
            .style("transform", "translateX(60px)");
        }
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });
    //Title
    g.append("text")
      .attr("id", "title")
      .text(title)
      .attr("y", 30)
      .attr("x", svgWidth / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "1.5em");
    //Subtitle
    g.append("text")
      .attr("id", "description")
      .text(subtitle)
      .attr("y", 60)
      .attr("x", svgWidth / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "1em");
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
  const topology = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
  )
    .then((result) => result.json())
    .then((data) => {
      return data;
    });
  const eduData = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
  )
    .then((result) => result.json())
    .then((data) => {
      return data;
    });
  return {
    props: { topology, eduData },
  };
}
