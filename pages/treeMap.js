import React, { useEffect, useState } from "react";
import { select, scaleOrdinal, hierarchy, treemap } from "d3";
import Button from "react-bootstrap/Button";
export default function treeMap({
  videoGameSales,
  kickStartePledges,
  movieSales,
}) {
  const [data, setData] = useState(videoGameSales);
  let title = "";
  let subtitle = "";
  let sum = 0;
  data.children.forEach((item) => {
    sum += item.children.length;
  });
  if (data.name === "Video Game Sales Data Top 100") {
    title = data.name;
    subtitle = `Top ${sum} Most Sold Video Games Grouped by Platform`;
  }
  if (data.name === "Kickstarter") {
    title = "Kickstarter Projects Data";
    subtitle = `Top ${sum} Kickstarter Projects Grouped by Product Category`;
  }
  if (data.name === "Movies") {
    title = "Movie Data";
    subtitle = `Top ${sum} Grossing Movies Grouped by Film Genre`;
  }

  useEffect(() => {
    //Graph Margins
    const margin = {
      top: 60,
      right: 0,
      bottom: 0,
      left: 0,
    };
    //Svg Height & Width
    const svgHeight = 660;
    const svgWidth = 960;
    //Legend width
    const legendWidth = 180;
    //Graph Height & Width
    const innerHeight = svgHeight - margin.top - margin.bottom;
    const innerWidth = svgWidth - margin.left - margin.right;
    //Color Scale
    var myColor = scaleOrdinal()
      .domain(data.children)
      .range([
        "#e6194b",
        "#3cb44b",
        "#ffe119",
        "#4363d8",
        "#f58231",
        "#911eb4",
        "#46f0f0",
        "#f032e6",
        "#bcf60c",
        "#fabebe",
        "#008080",
        "#e6beff",
        "#9a6324",
        "#fffac8",
        "#800000",
        "#aaffc3",
        "#808000",
        "#ffd8b1",
        "#fa0000",
        "#808080",
      ]);
    // Chart SVG
    let svg = select(".chart").append("svg");
    svg.style("height", svgHeight).style("width", svgWidth);
    //Legend SVG
    let legend = select(".chart")
      .append("svg")
      .style("width", legendWidth)
      .style("height", svgHeight);
    const legendGroup = legend
      .append("g")
      .attr("transform", `translate(5, ${margin.top + 50})`);
    legendGroup.attr("id", "legend").style("background-color", "white");
    //Creating a group to be the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //Hierarchy Root
    const root = hierarchy(data)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    //Treemap Declare
    const treemapInit = treemap().size([innerWidth, innerHeight]).padding(0.2);
    treemapInit(root);
    //Create a group for each cell
    const cell = g
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("class", "group")
      .attr("transform", function (d) {
        return "translate(" + d.x0 + "," + d.y0 + ")";
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
    //Append rect to cell
    cell
      .append("rect")
      .attr("id", function (d) {
        return d.data.id;
      })
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("class", "tile")
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .attr("data-name", function (d) {
        return d.data.name;
      })
      .attr("data-category", function (d) {
        return d.data.category;
      })
      .attr("data-value", function (d) {
        return d.data.value;
      })
      .attr("fill", function (d) {
        return myColor(d.data.category);
      })
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(
            "Name: " +
              d.data.name +
              "<br>Category: " +
              d.data.category +
              "<br>Value: " +
              d.data.value
          )
          .attr("data-value", d.data.value)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    //Adding the text
    cell
      .append("text") // append text node for each cell / movie
      .attr("cursor", "default")
      .on("mouseover", function (event, d) {
        tooltip.style("opacity", 0.9);
        tooltip
          .html(
            "Name: " +
              d.data.name +
              "<br>Category: " +
              d.data.category +
              "<br>Value: " +
              d.data.value
          )
          .attr("data-value", d.data.value)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      })
      .selectAll("tspan")
      .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("font-size", "10px")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + 10 * i)
      .text((d) => d);

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
    //Legend Categories
    let categories = root.leaves().map(function (nodes) {
      return nodes.data.category;
    });

    //Category Filter to return only unique categories
    categories = categories.filter(function (category, index, self) {
      return self.indexOf(category) === index;
    });
    //Legend Bars
    const legendBarSize = 15;
    const legendVMargin = 10;
    const legendTextXOffset = 3;
    const legendTextYOffset = -2;
    let legendBars = legendGroup
      .append("g")
      .attr("transform", "translate(10,0)")
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(0," + (1.5 * i * legendBarSize + legendVMargin) + ")";
      });
    legendBars
      .append("rect")
      .attr("width", legendBarSize)
      .attr("height", legendBarSize)
      .attr("class", "legend-item")
      .attr("fill", function (d) {
        return myColor(d);
      });
    //Legend Bar text
    legendBars
      .append("text")
      .attr("x", legendBarSize + legendTextXOffset)
      .attr("y", legendBarSize + legendTextYOffset)
      .text(function (d) {
        return d;
      });
    return () => {
      svg = svg.remove();
      legend = legend.remove();
      tooltip = tooltip.remove();
    };
  }, [data]);
  return (
    <div>
      <div className="chart" style={{ display: "flex" }}>
        <div
          className="options"
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "0.5rem",
          }}
        >
          <Button
            variant="outline-dark"
            style={{ margin: "1rem" }}
            onClick={() => setData(videoGameSales)}
          >
            Video Game Sales
          </Button>
          <Button
            variant="outline-dark"
            style={{ margin: "1rem" }}
            onClick={() => setData(movieSales)}
          >
            Movie Sales
          </Button>
          <Button
            variant="outline-dark"
            style={{ margin: "1rem" }}
            onClick={() => setData(kickStartePledges)}
          >
            Kickstarter Pledges
          </Button>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
  const videoGameSales = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  const kickStartePledges = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  const movieSales = await fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  return {
    props: {
      videoGameSales: videoGameSales,
      kickStartePledges: kickStartePledges,
      movieSales: movieSales,
    },
  };
}
