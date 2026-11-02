import React, { useRef, useEffect } from 'react';
import { BubbleSortState } from '../utils/bubbleSortLogic';

interface BubbleSortCanvasProps {
  state: BubbleSortState;
  classicTheme?: boolean;
}

export const BubbleSortCanvas: React.FC<BubbleSortCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 370;
  const CANVAS_HEIGHT = 320;
  const BAR_BASE_Y = 230;
  const BAR_LEFT_MARGIN = 35;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // 1. Background
    if (classicTheme) {
      ctx.fillStyle = '#C0C0C0'; // Classic Java AWT LightGray
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#F8FAFC'; // Modern Slate-50
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Counters (Swaps and Comparisons) in top left
    ctx.fillStyle = classicTheme ? '#000000' : '#1E293B';
    ctx.font = classicTheme ? 'bold 12px "Courier New", monospace, sans-serif' : '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Swaps = ${state.swaps}`, 10, 16);
    ctx.fillText(`Comparisons = ${state.comps}`, 10, 32);

    // 3. Bars Dimensions
    const barWidth = state.aSize === 10 ? 20 : 2;
    const barSeparation = state.aSize === 10 ? 10 : 1;

    // Draw baseline
    ctx.strokeStyle = classicTheme ? '#808080' : '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(BAR_LEFT_MARGIN - 5, BAR_BASE_Y);
    ctx.lineTo(CANVAS_WIDTH - 20, BAR_BASE_Y);
    ctx.stroke();

    // 4. Draw Bars
    for (let i = 0; i < state.aSize; i++) {
      const bar = state.bars[i];
      if (!bar) continue;

      const barX = BAR_LEFT_MARGIN + i * (barWidth + barSeparation);
      const barY = BAR_BASE_Y - bar.height;

      if (classicTheme) {
        // Bar color
        ctx.fillStyle = bar.color;
        ctx.fillRect(barX, barY, barWidth, bar.height);

        // 3D Bevel highlight
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(barX, barY + bar.height);
        ctx.lineTo(barX, barY);
        ctx.lineTo(barX + barWidth, barY);
        ctx.stroke();

        ctx.strokeStyle = '#404040';
        ctx.beginPath();
        ctx.moveTo(barX + barWidth, barY);
        ctx.lineTo(barX + barWidth, barY + bar.height);
        ctx.stroke();
      } else {
        // Modern Style
        ctx.fillStyle = bar.color;
        ctx.beginPath();
        if (state.aSize === 10) {
          ctx.roundRect(barX, barY, barWidth, bar.height, [3, 3, 0, 0]);
        } else {
          ctx.fillRect(barX, barY, barWidth, bar.height);
        }
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.stroke();
      }

      // Height text on top of bar for size = 10
      if (state.aSize === 10) {
        ctx.fillStyle = classicTheme ? '#000000' : '#475569';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${bar.height}`, barX + barWidth / 2, barY - 4);
      }
    }

    // 5. Indicators and Text below baseline (arrowText)
    const arrowY = BAR_BASE_Y + 2;

    const drawArrow = (index: number, color: string, label: string) => {
      if (index < 0 || index >= state.aSize) return;
      const x = BAR_LEFT_MARGIN + index * (barWidth + barSeparation) + Math.floor(barWidth / 2);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      // Vertical arrow pointing UP towards the bar
      ctx.beginPath();
      ctx.moveTo(x, arrowY + 14);
      ctx.lineTo(x, arrowY + 3);
      ctx.stroke();

      // Arrow head pointing UP
      ctx.beginPath();
      ctx.moveTo(x, arrowY + 2);
      ctx.lineTo(x - 3, arrowY + 7);
      ctx.lineTo(x + 3, arrowY + 7);
      ctx.closePath();
      ctx.fill();

      // Label
      if (state.aSize === 10) {
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, arrowY + 26);
      }
    };

    if (state.aSize === 10) {
      // outer pointer (Red)
      drawArrow(state.outer, '#DC2626', 'outer');

      // inner pointer (Blue)
      drawArrow(state.inner, '#2563EB', 'inner');

      // inner+1 pointer (Blue)
      if (state.inner + 1 < state.aSize) {
        drawArrow(state.inner + 1, '#2563EB', 'inner+1');
      }

      // Bottom Message
      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 48;
      if (state.doneFlag) {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Sort is complete', CANVAS_WIDTH / 2, msgY);
      } else if (state.inner < state.aSize - 1) {
        const h1 = state.bars[state.inner]?.height ?? 0;
        const h2 = state.bars[state.inner + 1]?.height ?? 0;
        ctx.fillStyle = '#2563EB';
        ctx.font = 'bold 12px sans-serif';
        if (h1 > h2) {
          ctx.fillText('Will be swapped', CANVAS_WIDTH / 2, msgY);
        } else {
          ctx.fillText('Will not be swapped', CANVAS_WIDTH / 2, msgY);
        }
      }
    } else {
      // For size = 100: simplified arrow indicators
      drawArrow(state.outer, '#DC2626', '');
      drawArrow(state.inner, '#2563EB', '');

      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 30;
      ctx.font = 'bold 12px sans-serif';
      if (state.doneFlag) {
        ctx.fillStyle = '#000000';
        ctx.fillText('Sort is complete', CANVAS_WIDTH / 2, msgY);
      } else {
        ctx.fillStyle = '#2563EB';
        ctx.fillText(`Scanning: Outer=${state.outer}, Inner=${state.inner}`, CANVAS_WIDTH / 2, msgY);
      }
    }
  }, [state, classicTheme]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
        }}
        className="rounded shadow-sm border border-slate-400/50 bg-[#C0C0C0]"
      />
    </div>
  );
};
