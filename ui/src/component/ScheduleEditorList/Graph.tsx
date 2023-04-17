import React, { useRef } from "react";
import styled from "styled-components";
import useResizeEffect from "~src/helper/useResizeEffect";

export default function Graph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useResizeEffect(canvasRef, (entry, target) => {
    const { width, height } = entry.contentRect;
    if (target) {
      target.width = width;
      target.height = height;
    }
  });

  return <Canvas ref={canvasRef} />;
}

const Canvas = styled.canvas`
  grid-area: graph;
  background: ${({ theme }) => theme.color.background.light};
  width: 100%;
  height: 100%;
`;
