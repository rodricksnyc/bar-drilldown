# Custom Looker Bar/Line Chart Visualization

<img width="1677" alt="image" src="https://github.com/bytecodeio/vts-custom-vis/assets/93162346/245fcc75-f1ce-449b-819a-7e2d7ef09488">
<img width="1677" alt="image" src="https://github.com/bytecodeio/vts-custom-vis/assets/93162346/02d5e6de-6361-42e9-8e24-7f8b99f5b0d0">

This is a Looker custom visualization, built using [Looker's custom visualization API](https://github.com/looker/custom_visualizations_v2), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [ChartJS](https://www.chartjs.org/).

## Local Development
To run this project locally:

1. Clone this git repository locally
1. Run `npm install` to install dependencies
1. Run `npm start` to spin up a local development server at `https://localhost:8080`
1. Navigate to a Looker custom visualization running on `https://localhost:8080/bundle.js` (i.e., a `visualization` defined in the LookML project `manifest.lkml` file with its `url` parameter set to `https://localhost:8080/bundle.js`)
  <img width="371" alt="image" src="https://github.com/bytecodeio/vts-custom-vis/assets/93162346/c2f46dcd-001d-4f15-9365-79569e0b472a">
  <img width="968" alt="image" src="https://github.com/bytecodeio/vts-custom-vis/assets/93162346/507b438c-ffc8-4f81-8aa5-641a7c4e5034">

If the visualization doesn't render, you may need to set your browser to allow localhost's https certificate (navigate to `https://localhost:8080/bundle.js` in your browser > advanced > proceed)

Here are helpful resources for developing a Looker custom vis:

- https://github.com/looker/custom_visualizations_v2/blob/master/docs/getting_started.md
- https://github.com/looker/custom_visualizations_v2
- https://cloud.google.com/looker/docs/reference/param-manifest-visualization


## Visualization Query

To render properly, the visualization accepts a query with:
- 1 dimension
- 1 measure
- 1 table calculation or measure for the period comparison
- 1 pivot (optional)

<img width="1917" alt="image" src="https://github.com/bytecodeio/vts-custom-vis/assets/93162346/66caa2b4-fb55-4e7f-ba62-7250f94d39ce">

The visualization does not currently have robust error handling/messaging for queries provided in a different format.

## Visualization Features

This visualization is a bar chart built with ChartJS. It has the following features:

#### Visualization
1. Hovering over a chart element shows a tooltip with pivot, dimension, measure, and comparison
1. Clicking on a chart element opens the Looker drill menu with [drill options defined in LookML](https://cloud.google.com/looker/docs/reference/param-field-drill-fields)
1. Clicking a pivot value in the legend will add/remove that pivot from the chart
1. There is a toggle in the top right to view the data as a bar chart or a line chart. Bar chart is the default on load   

#### Edit Pane
1. Title - text that renders in the chart title
2. Show X Axis Label - toggle whether or not to show the X Axis label
3. X Axis Text - text that renders in the X Axis label
4. Show Y Axis Label - toggle whether or not to show the 7 Axis label
5. Y Axis Text - text that renders in the Y Axis label
6. Show X Grid Lines - toggle whether or not to show the X grid lines
7. Format Y Axis as Currency - toggle whether or not to prepend the Y axis tick labels with `$`
8. Show KPI - toggle whether or not to show the KPI that renders below the title
9. KPI Unit - text that is appended to the KPI value. Default is `sq ft`
10. Stacked - toggle whether or not the pivot values for each dimension are stacked on each other in the visualization
11. Line Chart Gradient - toggle whether to show a colored gradient fill below each line in the line chart
12. Show All Row Values in Tooltip - Toggle whether the chart element tooltip shows data for just that one element, or all elements in its row

## Line Chart vs Bar Chart Default
To have the visualization render with a line chart as the default, rather than a bar chart, simply comment out lines 147 - 156, and uncomment lines 157 - 166.

## Triggering Filter Updates to the Underlying Query
During development of this visualization, there was a known bug with the filter update event (i.e., `trigger('filter')` method) of Looker's custom visualization API (documented [here](https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md#events)). Example code is provided in lines 83 - 122 and 497 - 510 of `src/components/BarLineVis.tsx` on how to set up a filter select input in the UI, and trigger an update to the underlying Looker query using the custom visualization API.

## Drilling Overlay
- The code provides an example for opening the Looker drill menu when a chart element is clicked, in lines 386 - 406 of `src/components/BarLineVis.tsx`
- Looker's documentation for opening a drill menu using the custom visualization API is described here (under the `LookerCharts.Utils.openDrillMenu(options)` utility function:  
  https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md#rendering-data
- Looker documentation for how to drill into a custom visualization is described here:  
  https://cloud.google.com/looker/docs/best-practices/how-to-use-more-powerful-data-drilling#drilling-to-a-custom-visualization
