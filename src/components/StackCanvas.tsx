import React, { useRef, useEffect } from 'react';
import { StackState } from '../utils/stackLogic';

interface StackCanvasProps {
  state: StackState;
  classicTheme?: boolean;
}

export const StackCanvas: React.FC<StackCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 320;
  const CENTER_X = 175;
  const DIGITS_WIDTH = 18;
  const CELL_X = CENTER_X + DIGITS_WIDTH + 8; // 201
  const CELL_WIDTH = 35;
  const CELL_HEIGHT = 17;
  const BASE_Y = 255; // y coordinate for cell index 0

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

    // 2. Note Message Box at Top
    const noteBoxX = 10;
    const noteBoxY = 48;
    const noteBoxW = 420;
    const noteBoxH = 26;

    if (classicTheme) {
      // 3D inset box
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);

      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(state.note, noteBoxX + 8, noteBoxY + 17);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH, 6);
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(state.note, noteBoxX + 12, noteBoxY + 17);
    }

    // 3. Draw All 10 Cells (0 at bottom to 9 at top) plus slot 10 for Top when full
    for (let i = 0; i <= 10; i++) {
      const cellY = BASE_Y - i * CELL_HEIGHT;

      // Index label (only for 0 to 9)
      if (i < 10) {
        ctx.fillStyle = classicTheme ? '#000000' : '#475569';
        ctx.font = classicTheme ? '11px "Courier New", monospace' : '500 11px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${i}`, CELL_X - 8, cellY + 13);

        // Cell border
        ctx.strokeStyle = classicTheme ? '#000000' : '#94A3B8';
        ctx.lineWidth = 1;
        ctx.strokeRect(CELL_X, cellY, CELL_WIDTH, CELL_HEIGHT);
      }

      // If item exists in this slot
      const item = state.stackArray[i];
      if (item) {
        if (classicTheme) {
          ctx.fillStyle = item.color;
          ctx.fillRect(CELL_X + 1, cellY + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);

          // 3D bevel edges
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(CELL_X + 1, cellY + CELL_HEIGHT - 1);
          ctx.lineTo(CELL_X + 1, cellY + 1);
          ctx.lineTo(CELL_X + CELL_WIDTH - 1, cellY + 1);
          ctx.stroke();

          ctx.strokeStyle = '#404040';
          ctx.beginPath();
          ctx.moveTo(CELL_X + CELL_WIDTH - 1, cellY + 1);
          ctx.lineTo(CELL_X + CELL_WIDTH - 1, cellY + CELL_HEIGHT - 1);
          ctx.stroke();
        } else {
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.roundRect(CELL_X + 1, cellY + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2, 2);
          ctx.fill();
        }

        // Key value text inside cell
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.height}`, CELL_X + CELL_WIDTH / 2, cellY + 13);
      }

      // 4. Draw Top pointer arrow pointing to curIn
      if (i === state.curIn) {
        const arrowStartX = CELL_X + CELL_WIDTH + 32;
        const arrowEndX = CELL_X + CELL_WIDTH + 8;
        const arrowY = cellY + Math.floor(CELL_HEIGHT / 2);

        ctx.strokeStyle = '#DC2626'; // Red
        ctx.fillStyle = '#DC2626';
        ctx.lineWidth = 2;

        // Line
        ctx.beginPath();
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowEndX, arrowY);
        ctx.stroke();

        // Arrowhead pointing left toward the cell
        ctx.beginPath();
        ctx.moveTo(arrowEndX, arrowY);
        ctx.lineTo(arrowEndX + 6, arrowY - 4);
        ctx.lineTo(arrowEndX + 6, arrowY + 4);
        ctx.closePath();
        ctx.fill();

        // "Top" text
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Top', arrowStartX + 6, arrowY + 4);
      }
    }

    // 5. Stack base line and label
    ctx.strokeStyle = classicTheme ? '#000000' : '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CELL_X - 15, BASE_Y + CELL_HEIGHT + 2);
    ctx.lineTo(CELL_X + CELL_WIDTH + 15, BASE_Y + CELL_HEIGHT + 2);
    ctx.stroke();

    ctx.fillStyle = classicTheme ? '#000000' : '#475569';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Stack Base (index 0)', CELL_X + CELL_WIDTH / 2, BASE_Y + CELL_HEIGHT + 16);

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
