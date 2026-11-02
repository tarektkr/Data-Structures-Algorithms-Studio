import React, { useRef, useEffect } from 'react';
import { InsertionSortState } from '../utils/insertionSortLogic';

interface InsertionSortCanvasProps {
  state: InsertionSortState;
  classicTheme?: boolean;
}

export const InsertionSortCanvas: React.FC<InsertionSortCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 370;
  const CANVAS_HEIGHT = 320;
  const BAR_BASE_Y = 230;
  const BAR_LEFT_MARGIN = 20;

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
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Counters in top left
    ctx.fillStyle = classicTheme ? '#000000' : '#1E293B';
    ctx.font = classicTheme ? 'bold 12px "Courier New", monospace, sans-serif' : '600 12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Copies = ${state.copies}`, 10, 16);
    ctx.fillText(`Comparisons = ${state.comps}`, 10, 32);

    // 3. Bars Dimensions
    const barWidth = state.aSize === 10 ? 18 : 2;
    const barSeparation = state.aSize === 10 ? 8 : 1;

    // Baseline
    ctx.strokeStyle = classicTheme ? '#808080' : '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(BAR_LEFT_MARGIN - 5, BAR_BASE_Y);
    ctx.lineTo(CANVAS_WIDTH - 15, BAR_BASE_Y);
    ctx.stroke();

    // 4. Draw Array Bars (0 to aSize - 1)
    for (let i = 0; i < state.aSize; i++) {
      const bar = state.bars[i];
      const barX = BAR_LEFT_MARGIN + i * (barWidth + barSeparation);

      if (bar) {
        const barY = BAR_BASE_Y - bar.height;
        if (classicTheme) {
          ctx.fillStyle = bar.color;
          ctx.fillRect(barX, barY, barWidth, bar.height);

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
          ctx.fillStyle = bar.color;
          ctx.beginPath();
          if (state.aSize === 10) {
            ctx.roundRect(barX, barY, barWidth, bar.height, [3, 3, 0, 0]);
          } else {
            ctx.fillRect(barX, barY, barWidth, bar.height);
          }
          ctx.fill();
        }

        if (state.aSize === 10) {
          ctx.fillStyle = classicTheme ? '#000000' : '#475569';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${bar.height}`, barX + barWidth / 2, barY - 4);
        }
      } else {
        // Empty slot (dashed or light background)
        ctx.strokeStyle = classicTheme ? '#A0A0A0' : '#E2E8F0';
        ctx.strokeRect(barX, BAR_BASE_Y - 20, barWidth, 20);
      }
    }

    // 5. Draw Temp Bar on right side
    const tempX = CANVAS_WIDTH - (state.aSize === 10 ? 45 : 30);
    const tempBar = state.bars[state.aSize];

    ctx.fillStyle = classicTheme ? '#000000' : '#475569';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('temp', tempX + barWidth / 2, BAR_BASE_Y + 16);

    if (tempBar) {
      const tempY = BAR_BASE_Y - tempBar.height;
      ctx.fillStyle = tempBar.color;
      ctx.fillRect(tempX, tempY, barWidth, tempBar.height);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(`${tempBar.height}`, tempX + barWidth / 2, tempY - 4);
    } else {
      ctx.strokeStyle = '#808080';
      ctx.strokeRect(tempX, BAR_BASE_Y - 30, barWidth, 30);
    }

    // 6. Indicators below bars
    const arrowY = BAR_BASE_Y + 2;

    const drawArrow = (index: number, color: string, label: string) => {
      if (index < 0 || index >= state.aSize) return;
      const x = BAR_LEFT_MARGIN + index * (barWidth + barSeparation) + Math.floor(barWidth / 2);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(x, arrowY + 14);
      ctx.lineTo(x, arrowY + 3);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, arrowY + 2);
      ctx.lineTo(x - 3, arrowY + 7);
      ctx.lineTo(x + 3, arrowY + 7);
      ctx.closePath();
      ctx.fill();

      if (state.aSize === 10 && label) {
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, arrowY + 26);
      }
    };

    if (state.aSize === 10) {
      drawArrow(state.outer, '#DC2626', 'outer');
      drawArrow(state.inner, '#2563EB', 'inner');

      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 48;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(state.note, (CANVAS_WIDTH - 40) / 2, msgY);
    } else {
      drawArrow(state.outer, '#DC2626', '');
      drawArrow(state.inner, '#2563EB', '');

      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 30;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(state.note, (CANVAS_WIDTH - 40) / 2, msgY);
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
