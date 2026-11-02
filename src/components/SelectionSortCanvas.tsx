import React, { useRef, useEffect } from 'react';
import { SelectionSortState } from '../utils/selectionSortLogic';

interface SelectionSortCanvasProps {
  state: SelectionSortState;
  classicTheme?: boolean;
}

export const SelectionSortCanvas: React.FC<SelectionSortCanvasProps> = ({
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
    ctx.fillText(`Swaps = ${state.swaps}`, 10, 16);
    ctx.fillText(`Comparisons = ${state.comps}`, 10, 32);

    // 3. Bars Dimensions
    const barWidth = state.aSize === 10 ? 20 : 2;
    const barSeparation = state.aSize === 10 ? 10 : 1;

    // Baseline
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
      // outer pointer (Red)
      drawArrow(state.outer, '#DC2626', 'outer');

      // inner pointer (Blue)
      if (state.inner < state.aSize && state.searchFlag) {
        drawArrow(state.inner, '#2563EB', 'inner');
      }

      // min pointer (Magenta)
      drawArrow(state.min, '#C026D3', 'min');

      // Bottom Message
      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 48;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px sans-serif';

      if (state.doneFlag) {
        ctx.fillText('Sort is complete', CANVAS_WIDTH / 2, msgY);
      } else if (state.searchFlag) {
        ctx.fillText('Searching for minimum', CANVAS_WIDTH / 2, msgY);
      } else if (state.outer === state.min) {
        ctx.fillText('No swap necessary', CANVAS_WIDTH / 2, msgY);
      } else {
        ctx.fillText('Will swap outer & min', CANVAS_WIDTH / 2, msgY);
      }
    } else {
      // For size = 100
      drawArrow(state.outer, '#DC2626', '');
      drawArrow(state.min, '#C026D3', '');
      if (state.searchFlag) {
        drawArrow(state.inner, '#2563EB', '');
      }

      ctx.textAlign = 'center';
      const msgY = BAR_BASE_Y + 30;
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#000000';
      if (state.doneFlag) {
        ctx.fillText('Sort is complete', CANVAS_WIDTH / 2, msgY);
      } else {
        ctx.fillText(`Outer=${state.outer}, Min=${state.min}, Inner=${state.inner}`, CANVAS_WIDTH / 2, msgY);
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
