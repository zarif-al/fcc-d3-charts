# FCC - Charts

## All User Stories

[Bar Chart](#bar-chart), [Scatter Plot](#scatter-plot), [Heat Map](#heat-map), [Choropleth Map](#choropleth-map), [Tree Map](#tree-map)

## Bar Chart

- User Story #1: My chart should have a title with a corresponding id="title".

- User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".

- User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".

- User Story #4: Both axes should contain multiple tick labels, each with a corresponding class="tick".

- User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.

- User Story #6: Each bar should have the properties data-date and data-gdp containing date and GDP values.

- User Story #7: The bar elements' data-date properties should match the order of the provided data.

- User Story #8: The bar elements' data-gdp properties should match the order of the provided data.

- User Story #9: Each bar element's height should accurately represent the data's corresponding GDP.

- User Story #10: The data-date attribute and its corresponding bar element should align with the corresponding value on the x-axis.

- User Story #11: The data-gdp attribute and its corresponding bar element should align with the corresponding value on the y-axis.

- User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

- User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.

[Back To Top](#all-user-stories)

## Scatter Plot

- User Story #1: I can see a title element that has a corresponding id="title".

- User Story #2: I can see an x-axis that has a corresponding id="x-axis".

- User Story #3: I can see a y-axis that has a corresponding id="y-axis".

- User Story #4: I can see dots, that each have a class of dot, which represent the data being plotted.

- User Story #5: Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.

- User Story #6: The data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format. For data-xvalue, integers (full years) or Date objects are acceptable for test evaluation. For data-yvalue (minutes), use Date objects.

- User Story #7: The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.

- User Story #8: The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.

- User Story #9: I can see multiple tick labels on the y-axis with %M:%S time format.

- User Story #10: I can see multiple tick labels on the x-axis that show the year.

- User Story #11: I can see that the range of the x-axis labels are within the range of the actual x-axis data.

- User Story #12: I can see that the range of the y-axis labels are within the range of the actual y-axis data.

- User Story #13: I can see a legend containing descriptive text that has id="legend".

- User Story #14: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

- User Story #15: My tooltip should have a data-year property that corresponds to the data-xvalue of the active area.

[Back To Top](#all-user-stories)

## Heat Map

- User Story #1: My heat map should have a title with a corresponding id="title".

- User Story #2: My heat map should have a description with a corresponding id="description".

- User Story #3: My heat map should have an x-axis with a corresponding id="x-axis".

- User Story #4: My heat map should have a y-axis with a corresponding id="y-axis".

- User Story #5: My heat map should have rect elements with a class="cell" that represent the data.

- User Story #6: There should be at least 4 different fill colors used for the cells.

- User Story #7: Each cell will have the properties data-month, data-year, data-temp containing their corresponding month, year, and temperature values.

- User Story #8: The data-month, data-year of each cell should be within the range of the data.

- User Story #9: My heat map should have cells that align with the corresponding month on the y-axis.

- User Story #10: My heat map should have cells that align with the corresponding year on the x-axis.

- User Story #11: My heat map should have multiple tick labels on the y-axis with the full month name.

- User Story #12: My heat map should have multiple tick labels on the x-axis with the years between 1754 and 2015.

- User Story #13: My heat map should have a legend with a corresponding id="legend".

- User Story #14: My legend should contain rect elements.

- User Story #15: The rect elements in the legend should use at least 4 different fill colors.

- User Story #16: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

- User Story #17: My tooltip should have a data-year property that corresponds to the data-year of the active area.

[Back To Top](#all-user-stories)

## Choropleth Map

- User Story #1: My choropleth should have a title with a corresponding id="title".

- User Story #2: My choropleth should have a description element with a corresponding id="description".

- User Story #3: My choropleth should have counties with a corresponding class="county" that represent the data.

- User Story #4: There should be at least 4 different fill colors used for the counties.

- User Story #5: My counties should each have data-fips and data-education properties containing their corresponding fips and education values.

- User Story #6: My choropleth should have a county for each provided data point.

- User Story #7: The counties should have data-fips and data-education values that match the sample data.

- User Story #8: My choropleth should have a legend with a corresponding id="legend".

- User Story #9: There should be at least 4 different fill colors used for the legend.

- User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

- User Story #11: My tooltip should have a data-education property that corresponds to the data-education of the active area.

[Back To Top](#all-user-stories)

## Tree Map

- User Story #1: My tree map should have a title with a corresponding id="title".

- User Story #2: My tree map should have a description with a corresponding id="description".

- User Story #3: My tree map should have rect elements with a corresponding class="tile" that represent the data.

- User Story #4: There should be at least 2 different fill colors used for the tiles.

- User Story #5: Each tile should have the properties data-name, data-category, and data-value containing their corresponding name, category, and value.

- User Story #6: The area of each tile should correspond to the data-value amount: tiles with a larger data-value should have a bigger area.

- User Story #7: My tree map should have a legend with corresponding id="legend".

- User Story #8: My legend should have rect elements with a corresponding class="legend-item".

- User Story #9: The rect elements in the legend should use at least 2 different fill colors.

- User Story #10: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

- User Story #11: My tooltip should have a data-value property that corresponds to the data-value of the active area.

[Back To Top](#all-user-stories)
