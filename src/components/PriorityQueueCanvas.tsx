import React, { useRef, useEffect } from 'react';
import { PriorityQueueState } from '../utils/priorityQueueLogic';

interface PriorityQueueCanvasProps {
  state: PriorityQueueState;
  classicTheme?: boolean;
}

export const PriorityQueueCanvas: React.FC<PriorityQueueCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 320;
  const CENTER_X = 175;
  const DIGITS_WIDTH = 18;
  const CELL_X = CENTER_X + DIGITS_WIDTH + 8; // 201
  const CELL_WIDTH = 38;
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

    // 3. Draw All 10 Cells (0 at bottom to 9 at top)
    for (let i = 0; i < 10; i++) {
      const cellY = BASE_Y - i * CELL_HEIGHT;

      // Index label (left of cell)
      ctx.fillStyle = classicTheme ? '#000000' : '#475569';
      ctx.font = classicTheme ? '11px "Courier New", monospace' : '500 11px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${i}`, CELL_X - 8, cellY + 13);

      // Cell border
      ctx.strokeStyle = classicTheme ? '#000000' : '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(CELL_X, cellY, CELL_WIDTH, CELL_HEIGHT);

      // Item in this slot
      const item = state.queArray[i];
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
      } else {
        // Empty slot background
        if (classicTheme) {
          ctx.fillStyle = '#E2E8F0';
          ctx.fillRect(CELL_X + 1, cellY + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2);
        }
      }

      const centerY = cellY + Math.floor(CELL_HEIGHT / 2);

      // Helper function to draw pointer arrow pointing left toward cell
      const drawPointerArrow = (shaftLength: number, color: string, label: string) => {
        const arrowEndX = CELL_X + CELL_WIDTH + 4; // Near the cell edge
        const arrowStartX = arrowEndX + shaftLength;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        // Shaft line
        ctx.beginPath();
        ctx.moveTo(arrowStartX, centerY);
        ctx.lineTo(arrowEndX, centerY);
        ctx.stroke();

        // Arrow head pointing left
        ctx.beginPath();
        ctx.moveTo(arrowEndX, centerY);
        ctx.lineTo(arrowEndX + 5, centerY - 4);
        ctx.lineTo(arrowEndX + 5, centerY + 4);
        ctx.closePath();
        ctx.fill();

        // Label text at the tail
        if (label) {
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(label, arrowStartX + 4, centerY + 4);
        }
      };

      // 4. Draw curIn pointer (Black, shaft 10) during search/shift
      if (state.curIn >= 0 && i === state.curIn) {
        drawPointerArrow(10, '#000000', 'curIn');
      }

      // 5. Draw Front Pointer (Red, short shaft 15)
      if (i === state.front && state.nPersons > 0) {
        drawPointerArrow(15, '#DC2626', 'Front');
      }

      // 6. Draw Rear Pointer (Blue, long shaft 60)
      if (i === state.rear) {
        drawPointerArrow(60, '#2563EB', 'Rear');
      }
    }

    // 7. Base Line and Annotations
    ctx.strokeStyle = classicTheme ? '#000000' : '#64748B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CELL_X - 15, BASE_Y + CELL_HEIGHT + 2);
    ctx.lineTo(CELL_X + CELL_WIDTH + 15, BASE_Y + CELL_HEIGHT + 2);
    ctx.stroke();

    ctx.fillStyle = classicTheme ? '#000000' : '#475569';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Index 0 (Rear / Min)', CELL_X + CELL_WIDTH / 2, BASE_Y + CELL_HEIGHT + 16);

    // 8. Temp item indicator when inserting
    if (state.opMode === 'insert' && state.tempPers) {
      const tempX = 18;
      const tempY = 120;
      ctx.fillStyle = classicTheme ? '#E2E8F0' : '#EEF2F6';
      ctx.fillRect(tempX, tempY, 80, 52);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.strokeRect(tempX, tempY, 80, 52);

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INSERTING', tempX + 40, tempY + 14);

      // Mini preview box of tempPers
      ctx.fillStyle = state.tempPers.color;
      ctx.fillRect(tempX + 20, tempY + 22, 40, 20);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(tempX + 20, tempY + 22, 40, 20);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`${state.tempPers.height}`, tempX + 40, tempY + 36);
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
