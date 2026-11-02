import React, { useRef, useEffect } from 'react';
import { QuickSort1State } from '../utils/quickSort1Logic';

interface QuickSort1CanvasProps {
  state: QuickSort1State;
  classicTheme?: boolean;
}

export const QuickSort1Canvas: React.FC<QuickSort1CanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 370;
  const CANVAS_HEIGHT = 300;
  const BASELINE_Y = 230;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // 1. Background
    if (classicTheme) {
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Note Box at top
    if (classicTheme) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(140, 8, 220, 24);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(140, 8, 220, 24);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.note, 250, 20);
    } else {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.fillRect(135, 8, 225, 26);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(135, 8, 225, 26);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.note, 247, 21);
    }

    // 3. Stats at top left: Swaps and Comparisons
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 11px monospace';
    if (classicTheme) {
      ctx.fillStyle = '#000000';
      ctx.fillText(`Swaps = ${state.swaps}`, 10, 8);
      ctx.fillText(`Comparisons = ${state.comps}`, 10, 22);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Swaps = ${state.swaps}`, 10, 8);
      ctx.fillStyle = '#a78bfa';
      ctx.fillText(`Comparisons = ${state.comps}`, 10, 22);
    }

    // 4. Draw Bars
    const { barWidth, barSeparation, barLeftMargin, theArray, aSize } = state;

    for (let i = 0; i < aSize; i++) {
      const p = theArray[i];
      if (!p) continue;

      const x = barLeftMargin + i * (barWidth + barSeparation);
      const h = p.height;
      const y = BASELINE_Y - h;

      if (classicTheme) {
        // Authentic AWT 3D Bar
        ctx.fillStyle = p.color;
        ctx.fillRect(x, y, barWidth, h);

        if (barWidth >= 5) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x, y);
          ctx.lineTo(x + barWidth - 1, y);
          ctx.stroke();

          ctx.strokeStyle = '#505050';
          ctx.beginPath();
          ctx.moveTo(x + barWidth, y);
          ctx.lineTo(x + barWidth, y + h);
          ctx.stroke();
        }
      } else {
        // Modern Glow Bar
        const barGrad = ctx.createLinearGradient(0, y, 0, y + h);
        barGrad.addColorStop(0, p.color);
        barGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = barGrad;
        ctx.fillRect(x, y, barWidth, h);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, barWidth, h);
      }
    }

    // 5. Horizontal Line for active partition [left, right]
    if (state.left >= 0 && state.right >= state.left && state.right < aSize) {
      const leftX = barLeftMargin + state.left * (barWidth + barSeparation);
      const rightX = barLeftMargin + state.right * (barWidth + barSeparation) + barWidth;

      ctx.strokeStyle = classicTheme ? '#000000' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX, BASELINE_Y + 2);
      ctx.lineTo(rightX, BASELINE_Y + 2);
      ctx.stroke();
    }

    // 6. Draw pointer arrows below baseline: left, right, leftScan, rightScan, pivot
    // Arrow function helper
    const drawArrow = (
      index: number,
      color: string,
      label: string,
      yOffsetLevel: number
    ) => {
      if (index < 0 || index >= aSize) return;

      const xCenter = barLeftMargin + index * (barWidth + barSeparation) + barWidth / 2;
      const arrowTipY = BASELINE_Y + 5;
      const arrowBaseY = BASELINE_Y + 14 + yOffsetLevel * 14;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.5;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(xCenter, arrowTipY);
      ctx.lineTo(xCenter, arrowBaseY);
      ctx.stroke();

      // Arrowhead pointing UP to bar
      ctx.beginPath();
      ctx.moveTo(xCenter, arrowTipY);
      ctx.lineTo(xCenter - 3, arrowTipY + 4);
      ctx.lineTo(xCenter + 3, arrowTipY + 4);
      ctx.closePath();
      ctx.fill();

      // Text Label
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, xCenter, arrowBaseY + 2);
    };

    // Stagger arrow levels to prevent overlap when indexes coincide:
    // left (blue) -> level 0
    // right (blue) -> level 0
    // leftScan (red) -> level 1
    // rightScan (magenta) -> level 2
    // pivot (black/cyan) -> level 3
    if (state.left >= 0) {
      drawArrow(state.left, classicTheme ? '#0000FF' : '#60a5fa', 'left', 0);
    }
    if (state.right >= 0 && state.right !== state.left) {
      drawArrow(state.right, classicTheme ? '#0000FF' : '#60a5fa', 'right', 0);
    }
    if (state.leftScan >= 0) {
      drawArrow(state.leftScan, '#FF0000', 'leftScan', 1);
    }
    if (state.rightScan >= 0) {
      drawArrow(state.rightScan, classicTheme ? '#C000C0' : '#f472b6', 'rightScan', 2);
    }
    if (state.codePart >= 2 && state.codePart <= 6 && state.right >= 0) {
      drawArrow(state.right, classicTheme ? '#000000' : '#22d3ee', 'pivot', 3);
    }
  }, [state, classicTheme]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        className="rounded shadow-inner select-none cursor-default"
      />
    </div>
  );
};
