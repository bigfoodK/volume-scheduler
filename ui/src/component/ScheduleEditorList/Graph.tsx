import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { DefaultTheme, useTheme } from "styled-components";
import useResizeEffect from "~src/helper/useResizeEffect";
import { ScheduleState } from "~src/state/ScheduleState";

const MINIUM_GRID_INTERVAL_PX = 100;

type Props = {
  scheduleId: string;
};

export default function Graph(props: Props) {
  const { scheduleId } = props;
  const [pxPerSecond, setPxPerSecond] = useState(0.1);
  const [offsetSecond, setOffsetSecond] = useState(0);
  const [isDraggingBackground, setIsDraggingBackground] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRequestAnimationFrameId = useRef<number | null>();
  const [schedule, setSchedule] = useRecoilState(
    ScheduleState.schedule(scheduleId)
  );
  const theme = useTheme();

  useResizeEffect(canvasRef, (entry, target) => {
    const { width, height } = entry.contentRect;
    if (target) {
      target.width = width;
      target.height = height;
    }
  });

  useEffect(() => {
    const renderGraph = () => {
      const context = canvasRef.current?.getContext("2d");
      if (!context) {
        renderRequestAnimationFrameId.current =
          requestAnimationFrame(renderGraph);
        return;
      }

      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      drawGrid(context, pxPerSecond, offsetSecond, theme);

      renderRequestAnimationFrameId.current =
        requestAnimationFrame(renderGraph);
    };
    renderGraph();
    return () => {
      if (renderRequestAnimationFrameId.current) {
        cancelAnimationFrame(renderRequestAnimationFrameId.current);
      }
    };
  }, [offsetSecond, pxPerSecond, theme]);

  return (
    <Canvas
      ref={canvasRef}
      onMouseDown={(event) => {
        setIsDraggingBackground(true);
      }}
      onMouseUp={(event) => {
        setIsDraggingBackground(false);
      }}
      onMouseMove={(event) => {
        if (isDraggingBackground) {
          setOffsetSecond((prev) =>
            Math.max(prev - event.movementX / pxPerSecond, 0)
          );
        }
      }}
      onWheel={(event) => {
        if (event.ctrlKey) {
          setPxPerSecond((prev) => {
            const next = Math.max(
              0.005,
              Math.min(0.1, Math.exp(Math.log(prev) - event.deltaY / 1000))
            );
            return next;
          });
        }
      }}
    />
  );
}

const Canvas = styled.canvas`
  position: relative;
  grid-area: graph;
  width: 100%;
  height: 100%;
`;
function drawGrid(
  context: CanvasRenderingContext2D,
  pxPerSecond: number,
  offsetSecond: number,
  theme: DefaultTheme
) {
  const gridIntervalSecond = getGridIntervalSecond(pxPerSecond);
  const maxSecondFromOffset = context.canvas.width / pxPerSecond;
  let secondFromOffset = -(offsetSecond % gridIntervalSecond);
  context.save();
  context.strokeStyle = theme.color.background.light;
  context.lineWidth = 1;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = "12px Arial";
  context.fillStyle = theme.color.background.contrastText;
  while (secondFromOffset < maxSecondFromOffset) {
    const x = secondFromOffset * pxPerSecond;
    context.moveTo(x, 0);
    context.lineTo(x, context.canvas.height);
    context.stroke();

    context.fillText(secondToTimestamp(offsetSecond + secondFromOffset), x, 0);
    secondFromOffset += gridIntervalSecond;
  }
  context.restore();
}
function getGridIntervalSecond(pxPerSecond: number) {
  const gridIntervalSecond = MINIUM_GRID_INTERVAL_PX / pxPerSecond;
  if (gridIntervalSecond <= 30) {
    return 30;
  } else if (gridIntervalSecond <= 3600) {
    return gridIntervalSecond - (gridIntervalSecond % 300);
  }
  return gridIntervalSecond - (gridIntervalSecond % 3600);
}
function secondToTimestamp(totalSecond: number) {
  const hour = Math.floor(totalSecond / 3600);
  const minute = Math.floor((totalSecond % 3600) / 60);
  const second = Math.floor(totalSecond % 60);
  return `${hour.toFixed(0).padStart(2, "0")}:${minute
    .toFixed(0)
    .padStart(2, "0")}:${second.toFixed(0).padStart(2, "0")}`;
}
