import React from "react";
import { DownArrowSVG } from "../icons/DownArrowSVG";
import { UpArrowSVG } from "../icons/UpArrowSVG";
import { TooltipData, TooltipRow } from "../types";

interface TooltipRowProps {
  hasPivot: boolean;
  style: React.CSSProperties;
  tooltipRow: TooltipRow;
}

const TooltipRow: React.FC<TooltipRowProps> = ({
  hasPivot,
  style,
  tooltipRow,
}) => {
  const {
    hasPreviousPeriod,
    measureValue,
    periodComparisonValue,
    pivotColor,
    pivotText,
  } = tooltipRow;

  return (
    <div className="tooltip-row" style={style}>
      {hasPivot && (
        <div className="pivot-label">
          <div
            className="pivot-color"
            style={{ backgroundColor: pivotColor }}
          ></div>
          <div className="pivot-text">{pivotText}</div>
        </div>
      )}
      <div className="measure-comparison-wrapper">
        <div className="measure-value">{measureValue}</div>
        {hasPreviousPeriod && (
          <div
            className={`period-comparison-wrapper ${
              periodComparisonValue > 0
                ? "positive-background"
                : periodComparisonValue < 0
                ? "negative-background"
                : ""
            }`}
          >
            {periodComparisonValue > 0 && <UpArrowSVG />}
            {periodComparisonValue < 0 && <DownArrowSVG />}
            <span
              className={`comparison-value ${
                periodComparisonValue > 0
                  ? "positive-text"
                  : periodComparisonValue < 0
                  ? "negative-text"
                  : ""
              }`}
            >
              {Math.abs(Math.round(periodComparisonValue)).toLocaleString()}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface TooltipProps {
  hasPivot: boolean;
  tooltipData: TooltipData;
}

const Tooltip: React.FC<TooltipProps> = ({ hasPivot, tooltipData }) => {
  const { dimensionLabel, left, rows, top, yAlign } = tooltipData;

  return (
    <div
      className={`chartjs-tooltip ${yAlign ?? "no-transform"}`}
      style={{ left, top }}
    >
      <div className="dimension-label">{dimensionLabel}</div>
      {rows.map((tooltipRow, i) => (
        <TooltipRow
          hasPivot={hasPivot}
          key={tooltipRow.pivotColor}
          style={{ marginTop: i > 0 ? "8px" : "3px" }}
          tooltipRow={tooltipRow}
        />
      ))}
    </div>
  );
};

export default Tooltip;
