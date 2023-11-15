import {
  Fields,
  Link,
  LookerChartUtils,
  TooltipData,
  TooltipRow,
  VisConfig,
  VisData,
} from "../types";
import React, { useEffect, useMemo, useState } from "react";
import { formatNumber } from "../utils";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip as ChartJsTooltip,
  LineController,
  BarController,
  ChartType,
  ChartOptions,
  Filler,
  ChartData,
  Point,
  BubbleDataPoint,
  ChartTypeRegistry,
  TooltipModel,
} from "chart.js";
import Tooltip from "./Tooltip";
import { Chart } from "react-chartjs-2";
import "bootstrap/scss/bootstrap.scss";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  ChartJsTooltip,
  LineController,
  BarController,
  Filler
);

interface BarLineVisProps {
  data: VisData;
  fields: Fields;
  config: VisConfig;
  lookerCharts: LookerChartUtils;
  lookerVis?: any;
}

const chartPlugins = [
  {
    id: "padding-below-legend",
    beforeInit(chart: any) {
      // Get a reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call the original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        this.height += 10;
      };
    },
  },
];

function BarLineVis({
  data,
  fields,
  config,
  lookerCharts,
}: BarLineVisProps): JSX.Element {
  console.log("🚀 ~ file: BarLineVis.tsx:81 ~ data:", data);
  // Filters
  // const filterFieldMap = {
  //   marketRegion: "properties.market_or_region",
  // };

  // const marketRegionFilterOptions = [
  //   {
  //     label: "Market",
  //     value: "market",
  //   },
  //   {
  //     label: "Region",
  //     value: "region",
  //   },
  // ];

  // const defaultFilters = {
  //   marketRegion: marketRegionFilterOptions[0].value,
  // };

  // const [filters, setFilters] = useState(defaultFilters);

  // function handleFilterSelection(
  //   filterName: keyof typeof filterFieldMap,
  //   value: string,
  //   lookerVis: any
  // ) {
  //   const fieldName = filterFieldMap[filterName];
  //   lookerVis.trigger("filter", [
  //     {
  //       field: "lease_date_properties.dynamic_date",
  //       value: "2022-05",
  //       run: true,
  //     },
  //   ]);
  //   setFilters((prev) => ({
  //     ...prev,
  //     marketRegion: value,
  //   }));
  // }

  // config values
  const {
    isYAxisCurrency,
    showXGridLines,
    showYGridLines,
    showXAxisLabel,
    xAxisText,
    showYAxisLabel,
    yAxisText,
    title,
    showKpi,
    kpiUnit,
    isStacked,
    showLineChartGradient,
    showAllValuesInTooltip,
  } = config;

  // Chart type toggle
  interface ChartTypeOption {
    label: string;
    value: ChartType;
  }

  const chartTypeOptions: ChartTypeOption[] = [
    {
      label: "Bar",
      value: "bar",
    },
    {
      label: "Line",
      value: "line",
    },
  ];
  // const chartTypeOptions: ChartTypeOption[] = [
  //   {
  //     label: "Line",
  //     value: "line",
  //   },
  //   {
  //     label: "Bar",
  //     value: "bar",
  //   },
  // ];
  const [selectedChartType, setSelectedChartType] = useState(
    chartTypeOptions[0].value
  );

  // map Looker query data to ChartJS data format
  const dimensionName = fields.dimensions[0];
  const measureName = fields.measures[0];
  const previousPeriodFieldName = fields.measures[1];

  const labels = data.map(
    (row) => row[dimensionName].rendered ?? row[dimensionName].value ?? "∅"
  );

  // const colors = ["#6253DA", "#D0D9E1", "#6CBFEF", "#A3D982", "#E192ED"];
  const colors = [
    "d9ed92",
    "b5e48c",
    "99d98c",
    "76c893",
    "52b69a",
    "34a0a4",
    "168aad",
    "1a759f",
    "1e6091",
    "184e77",
    "00296b",
  ];

  const hasPivot = !!fields.pivots && fields.pivots.length > 0;
  const fill = showLineChartGradient ? "origin" : false;

  const defaultChartData: ChartData<
    | "bar"
    | "line"
    | "scatter"
    | "bubble"
    | "pie"
    | "doughnut"
    | "polarArea"
    | "radar",
    (number | Point | [number, number] | BubbleDataPoint)[],
    any
  > = {
    labels,
    datasets: [],
  };
  const [chartData, setChartData] = useState(defaultChartData);

  function createGradient(
    ctx: CanvasRenderingContext2D,
    startColor: string,
    endColor: string
  ): CanvasGradient {
    const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradientFill.addColorStop(0, startColor);
    gradientFill.addColorStop(1, endColor);
    return gradientFill;
  }

  function updateChartData(chartType: ChartType) {
    let datasets = [];
    let canvasElement = document.getElementById("chart") as HTMLCanvasElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (hasPivot) {
        const pivotValues = Object.keys(data[0][measureName]);
        pivotValues.forEach((pivotValue, i) => {
          const columnData = data.map(
            (row) => row[measureName][pivotValue].value
          );

          const gradientFill = createGradient(
            ctx,
            `#${colors[i]}`,
            `#${colors[i]}00`
          );

          datasets.push({
            type: chartType,
            label: pivotValue,
            backgroundColor:
              chartType === "line" ? gradientFill : `#${colors[i]}`,
            borderColor: `#${colors[i]}`,
            pointBackgroundColor: `#${colors[i]}`,
            data: columnData,
            yAxisID: "yLeft",
            fill,
          });
        });
      } else {
        const gradientFill = createGradient(
          ctx,
          `#${colors[0]}`,
          `#${colors[0]}00`
        );
        datasets.push({
          type: chartType,
          backgroundColor:
            chartType === "line" ? gradientFill : `#${colors[0]}`,
          borderColor: `#${colors[0]}`,
          pointBackgroundColor: `#${colors[0]}`,
          data: data.map((row) => row[measureName].value),
          yAxisID: "yLeft",
          fill,
        });
      }
      setChartData({ labels, datasets });
    }
  }

  useEffect(() => {
    updateChartData(selectedChartType);
  }, []);

  // chart tooltip
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const hasPeriodComparisonMeasure = fields.measures.length > 1;
  const periodComparisonMeasure = fields.measures[1];

  interface TooltipContext {
    chart: ChartJS<
      keyof ChartTypeRegistry,
      (number | Point | [number, number] | BubbleDataPoint)[],
      unknown
    >;
    tooltip: TooltipModel<"bar" | "line">;
  }

  function tooltipHandler(
    context: TooltipContext,
    isYAxisCurrency: boolean,
    setTooltip: (newState: TooltipData | null) => void
  ) {
    const isTooltipVisible = context.tooltip.opacity !== 0;
    if (isTooltipVisible) {
      const position = context.chart.canvas.getBoundingClientRect();

      const { dataIndex } = context.tooltip.dataPoints[0];

      const lookerRow = data[dataIndex];
      let rows: TooltipRow[] = [];
      if (showAllValuesInTooltip) {
        Object.entries(lookerRow[measureName]).forEach(
          ([pivotName, { value: currentPeriodValue }], i) => {
            // Period comparison
            const previousPeriodValue =
              lookerRow[previousPeriodFieldName][pivotName].value;
            const hasPreviousPeriod =
              hasPeriodComparisonMeasure && !!previousPeriodValue;
            const periodComparisonValue =
              ((currentPeriodValue - previousPeriodValue) /
                previousPeriodValue) *
              100;

            rows.push({
              hasPreviousPeriod,
              measureValue: `${
                isYAxisCurrency ? "$" : ""
              }${currentPeriodValue}`,
              periodComparisonValue,
              pivotColor: `#${colors[i]}`,
              pivotText: pivotName,
            });
          }
        );
      } else {
        // Period comparison
        const pivotValue = context.tooltip.dataPoints[0].dataset.label;
        const previousPeriodValue =
          data[dataIndex][periodComparisonMeasure][pivotValue].value;
        const currentPeriodValue = context.tooltip.dataPoints[0].raw as number;

        const hasPreviousPeriod =
          hasPeriodComparisonMeasure && !!previousPeriodValue;
        const periodComparisonValue =
          ((currentPeriodValue - previousPeriodValue) / previousPeriodValue) *
          100;

        rows = [
          {
            hasPreviousPeriod,
            measureValue: `${isYAxisCurrency ? "$" : ""}${
              context.tooltip.dataPoints[0].formattedValue
            }`,
            periodComparisonValue,
            pivotColor: context.tooltip.dataPoints[0].dataset
              .borderColor as string,
            pivotText: context.tooltip.dataPoints[0].dataset.label,
          },
        ];
      }

      setTooltip({
        dimensionLabel: context.tooltip.title[0],
        left:
          position.left + window.pageXOffset + context.tooltip.caretX + "px",
        rows,
        top:
          position.top +
          window.pageYOffset +
          context.tooltip.caretY -
          20 +
          "px",
        yAlign: context.tooltip.yAlign,
      });
    } else {
      setTooltip(null);
    }
  }

  // chart options
  const chartOptions: ChartOptions<"bar" | "line"> = useMemo(
    () => ({
      layout: {
        padding: {
          top: 5,
        },
      },
      onClick: (event, elements, chart) => {
        console.log("event", event);
        console.log("elements", elements);
        console.log("chart", chart);

        if (!elements.length) {
          return;
        }

        const { datasetIndex, index: dataIndex } = elements[0];

        const measureLinks =
          Object.values(data[dataIndex][measureName])[datasetIndex].links ?? [];
        const dimensionLinks =
          (data[dataIndex][dimensionName].links as Link[]) ?? [];

        lookerCharts.Utils.openDrillMenu({
          links: [...measureLinks, ...dimensionLinks],
          event: event.native,
        });
      },
      plugins: {
        legend: {
          align: "start" as const,
          display: hasPivot,
        },
        tooltip: {
          enabled: false,
          position: "nearest",
          external: (context) =>
            tooltipHandler(context, isYAxisCurrency, setTooltip),
        },
      },
      scales: {
        x: {
          grid: {
            display: showXGridLines,
          },
          stacked: isStacked,
          title: {
            display: showXAxisLabel,
            text: xAxisText,
          },
        },
        yLeft: {
          grid: {
            display: showYGridLines,
          },
          position: "left" as const,
          stacked: isStacked,
          ticks: {
            callback: function (value: number) {
              return `${isYAxisCurrency ? "$" : ""}${formatNumber(value)}`;
            },
          },
          title: {
            display: showYAxisLabel,
            text: yAxisText,
          },
        },
      },
    }),
    []
  );

  // KPI value
  const kpiValue = data.reduce((total, currentRow) => {
    let newTotal = total;
    if (hasPivot) {
      const cellValues = Object.values(currentRow[measureName]).map(
        (cell) => cell.value
      );
      for (let i = 0; i < cellValues.length; i++) {
        newTotal += cellValues[i];
      }
    } else {
      newTotal += currentRow[measureName].value;
    }

    return newTotal;
  }, 0);

  function handleChartTypeSelection(newChartType: ChartType) {
    setSelectedChartType(newChartType);
    updateChartData(newChartType);
  }

  return (
    <div id="vis-wrapper">
      <div id="header">
        <div id="title-kpi-wrapper">
          <div id="title">{title}</div>
          {showKpi && (
            <div id="kpi">
              {kpiValue.toLocaleString()} {kpiUnit}
            </div>
          )}
        </div>
        <div id="controls">
          <ButtonGroup size="sm">
            {chartTypeOptions.map((chartTypeOption) => (
              <Button
                active={selectedChartType === chartTypeOption.value}
                key={chartTypeOption.value}
                onClick={() => handleChartTypeSelection(chartTypeOption.value)}
                // variant="outline-secondary"
              >
                {chartTypeOption.label}
              </Button>
            ))}
          </ButtonGroup>
          {/* <ButtonGroup size="sm">
              {marketRegionFilterOptions.map(({ label, value }, i) => (
                <Button
                  active={filters.marketRegion === value}
                  key={value}
                  onClick={() =>
                    handleFilterSelection("marketRegion", value, vis)
                  }
                  variant="outline-secondary"
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup> */}
        </div>
      </div>
      <div id="chart-wrapper">
        <Chart
          type={selectedChartType}
          data={chartData}
          options={chartOptions}
          id="chart"
          plugins={chartPlugins}
        />
        {tooltip && <Tooltip hasPivot={hasPivot} tooltipData={tooltip} />}
      </div>
    </div>
  );
}

export default BarLineVis;
