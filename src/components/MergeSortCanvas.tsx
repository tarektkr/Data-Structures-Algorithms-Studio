import React, { useRef, useEffect } from 'react';
import { MergeSortState } from '../utils/mergeSortLogic';

interface MergeSortCanvasProps {
  state: MergeSortState;
  classicTheme?: boolean;
}

export const MergeSortCanvas: React.FC<MergeSortCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 370;
  const CANVAS_HEIGHT = 300;
  const BASELINE_Y = 225;

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

    // 2. Note Box at top right
    if (classicTheme) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(135, 8, 225, 24);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(135, 8, 225, 24);

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.note, 247, 20);
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

    // 3. Stats at top left: Comparisons and Copies
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = 'bold 11px monospace';
    if (classicTheme) {
      ctx.fillStyle = '#000000';
      ctx.fillText(`Comparisons = ${state.comps}`, 10, 8);
      ctx.fillText(`Copies = ${state.copies}`, 10, 22);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Comparisons = ${state.comps}`, 10, 8);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`Copies = ${state.copies}`, 10, 22);
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

    // 5. Horizontal Line for active partition [lower, upper]
    if (state.lower >= 0 && state.upper >= state.lower && state.upper < aSize) {
      const leftX = barLeftMargin + state.lower * (barWidth + barSeparation);
      const rightX = barLeftMargin + state.upper * (barWidth + barSeparation) + barWidth;

      ctx.strokeStyle = classicTheme ? '#000000' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftX, BASELINE_Y + 2);
      ctx.lineTo(rightX, BASELINE_Y + 2);
      ctx.stroke();
    }

    // 6. Draw pointer arrows: lower, upper, mid, ptr
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

    // Stagger arrow levels:
    // lower (blue) -> level 0
    // upper (blue) -> level 0
    // mid (green) -> level 1
    // ptr (red) -> level 2 (when copying from workspace)
    if (state.lower >= 0 && state.lower < aSize) {
      drawArrow(state.lower, classicTheme ? '#0000FF' : '#60a5fa', 'lower', 0);
    }
    if (state.upper >= 0 && state.upper < aSize && state.upper !== state.lower) {
      drawArrow(state.upper, classicTheme ? '#0000FF' : '#60a5fa', 'upper', 0);
    }
    if (state.mid >= 0 && state.mid < aSize && state.lower !== state.upper) {
      drawArrow(state.mid, classicTheme ? '#008000' : '#4ade80', 'mid', 1);
    }
    if (state.codePart === 10) {
      const ptrIndex = state.lowerBoundM + state.jM;
      if (ptrIndex >= 0 && ptrIndex < aSize) {
        drawArrow(ptrIndex, '#FF0000', 'ptr', 2);
      }
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
