import React, { Fragment, useState, useMemo, memo } from 'react';
import classnames from 'classnames';

import Button from '../Button';

import css from './SketchGraphic.module.css';

const SketchGraphic = (props) => {
  const {
    showGrid,
    width,
    height,
    shapes,
    strokeWeight,
    onClick,
    isCodeVisible
  } = props;

  // -2 in order to make the grid fully visible in the SVG
  const unit = (width - 2) / 8;

  const grid = useMemo(() => {
    if (!showGrid) {
      return null;
    }
    const grid = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        grid.push(
          <rect
            key={`grid-${i}-${j}`}
            x={i * unit}
            y={j * unit}
            width={unit}
            height={unit}
          />
        );
      }
    }
    return grid;
  }, [showGrid, unit]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={css.root}>
      <g transform={`translate(1, 1)`}>
        <g className={css.grid}>{grid}</g>
        {shapes.map((shape, index) => {
          const showHandlers = shape.showHandlers || shape.dragging !== null;
          const color = `rgb(${shape.color[0]},${shape.color[1]},${shape.color[2]})`;

          if (shape.line) {
            return (
              <Fragment key={index}>
                <line
                  x1={shape.pos[0] * unit}
                  y1={shape.pos[1] * unit}
                  x2={shape.pos[6] * unit}
                  y2={shape.pos[7] * unit}
                  stroke={color}
                  strokeWidth={strokeWeight * unit}
                />
                {showHandlers && (
                  <Handler
                    x1={shape.pos[0]}
                    y1={shape.pos[1]}
                    x2={shape.pos[6]}
                    y2={shape.pos[7]}
                    unit={unit}
                  />
                )}
              </Fragment>
            );
          } else {
            const d = `M ${shape.pos[0] * unit} ${shape.pos[1] * unit} C ${
              shape.pos[2] * unit
            } ${shape.pos[3] * unit} ${shape.pos[4] * unit} ${
              shape.pos[5] * unit
            } ${shape.pos[6] * unit} ${shape.pos[7] * unit}`;
            return (
              <Fragment key={index}>
                <path
                  d={d}
                  stroke={color}
                  fill="none"
                  strokeWidth={strokeWeight * unit}
                />
                {showHandlers && (
                  <g>
                    <Handler d={d} unit={unit} />
                    <Handler
                      x1={shape.pos[0]}
                      y1={shape.pos[1]}
                      x2={shape.pos[2]}
                      y2={shape.pos[3]}
                      unit={unit}
                    />
                    <Handler
                      x1={shape.pos[6]}
                      y1={shape.pos[7]}
                      x2={shape.pos[4]}
                      y2={shape.pos[5]}
                      unit={unit}
                    />
                  </g>
                )}
              </Fragment>
            );
          }
        })}
      </g>
    </svg>
  );
};

// <Button className={css.button} onClick={onClick} size={'large'}>
//   {isCodeVisible ? 'Hide code' : 'Play'}
// </Button>

const Handler = memo(({ x1, y1, x2, y2, d, unit }) => {
  return (
    <g>
      {d && <path d={d} className={css.handlerLine} />}
      {!d && (
        <line
          x1={x1 * unit}
          y1={y1 * unit}
          x2={x2 * unit}
          y2={y2 * unit}
          className={css.handlerLine}
        />
      )}
      {x1 > -1 && (
        <circle
          cx={x2 * unit}
          cy={y2 * unit}
          r={4}
          className={css.handlerCircle}
        />
      )}
      {x1 > -1 && (
        <circle
          cx={x1 * unit}
          cy={y1 * unit}
          r={4}
          className={css.handlerCircle}
        />
      )}
    </g>
  );
});

export default SketchGraphic;
