import { nanoid } from "nanoid";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { DefaultTheme, useTheme } from "styled-components";
import { Schedule } from "~../app/bindings/Schedule";
import useResizeEffect from "~src/helper/useResizeEffect";
import { ScheduleState } from "~src/state/ScheduleState";

const MINIUM_GRID_INTERVAL_PX = 100;
const POINT_RADIUS = 8;

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
  const [mouseHoveringPointId, setMouseHoveringPointId] = useState<
    string | undefined
  >();

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
      drawLine(context, theme, schedule, offsetSecond, pxPerSecond);
      drawPoint(context, pxPerSecond, schedule, offsetSecond, theme);

      renderRequestAnimationFrameId.current =
        requestAnimationFrame(renderGraph);
    };
    renderGraph();
    return () => {
      if (renderRequestAnimationFrameId.current) {
        cancelAnimationFrame(renderRequestAnimationFrameId.current);
      }
    };
  }, [offsetSecond, pxPerSecond, theme, schedule]);

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
      onClick={(event) => {
        if (event.ctrlKey && canvasRef.current) {
          const newVolumePoint = {
            id: nanoid(),
            offsetSecond:
              event.nativeEvent.offsetX / pxPerSecond + offsetSecond,
            volume: 1 - event.nativeEvent.offsetY / canvasRef.current.height,
          };
          setSchedule((prev) => {
            const volumePoints = [...prev.volumePoints, newVolumePoint];
            return {
              id: prev.id,
              volumePoints,
            };
          });
        }
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        if (!canvasRef.current) {
          return;
        }
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        const maxOffsetSecond = width / pxPerSecond + offsetSecond;
        const onscreenPoints = getOnscreenPoints(
          schedule,
          offsetSecond,
          maxOffsetSecond
        );
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;
        const clickedPoint = onscreenPoints.find((point) => {
          const x = (point.offsetSecond - offsetSecond) * pxPerSecond;
          const y = height - point.volume * height;
          return (mouseX - x) ** 2 + (mouseY - y) ** 2 < POINT_RADIUS ** 2;
        });
        if (clickedPoint) {
          setSchedule((prev) => {
            return {
              id: prev.id,
              volumePoints: prev.volumePoints.filter(
                (point) => point.id !== clickedPoint.id
              ),
            };
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

function drawPoint(
  context: CanvasRenderingContext2D,
  pxPerSecond: number,
  schedule: Schedule,
  offsetSecond: number,
  theme: DefaultTheme
) {
  const maxOffsetSecond = context.canvas.width / pxPerSecond + offsetSecond;
  const onscreenPoints = getOnscreenPoints(
    schedule,
    offsetSecond,
    maxOffsetSecond
  );
  context.save();
  context.fillStyle = theme.color.primary.main;
  context.strokeStyle = theme.color.primary.contrastText;
  context.lineWidth = 2;
  onscreenPoints.forEach((point) => {
    const x = (point.offsetSecond - offsetSecond) * pxPerSecond;
    const y = context.canvas.height - point.volume * context.canvas.height;
    context.beginPath();
    context.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.stroke();
  });
  context.restore();
}

function getOnscreenPoints(
  schedule: Schedule,
  offsetSecond: number,
  maxOffsetSecond: number
) {
  return schedule.volumePoints.filter((volumePoint) => {
    if (
      volumePoint.offsetSecond < offsetSecond ||
      volumePoint.offsetSecond > maxOffsetSecond
    ) {
      return false;
    }
    return true;
  });
}

function drawLine(
  context: CanvasRenderingContext2D,
  theme: DefaultTheme,
  schedule: Schedule,
  offsetSecond: number,
  pxPerSecond: number
) {
  context.save();
  context.strokeStyle = theme.color.background.contrastText;
  context.lineWidth = 4;
  context.beginPath();
  if (schedule.volumePoints[0]) {
    context.moveTo(
      0,
      context.canvas.height -
        schedule.volumePoints[0].volume * context.canvas.height
    );
  }
  schedule.volumePoints.forEach((volumePoint) => {
    const x = (volumePoint.offsetSecond - offsetSecond) * pxPerSecond;
    const y =
      context.canvas.height - volumePoint.volume * context.canvas.height;
    context.lineTo(x, y);
  });
  if (schedule.volumePoints[schedule.volumePoints.length - 1]) {
    context.lineTo(
      context.canvas.width,
      context.canvas.height -
        schedule.volumePoints[schedule.volumePoints.length - 1].volume *
          context.canvas.height
    );
  }
  context.stroke();
  context.restore();
}

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
  context.beginPath();
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
