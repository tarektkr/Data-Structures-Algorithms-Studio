import React, { useRef, useEffect } from 'react';
import { AppletState } from '../types/applet';

interface AppletCanvasProps {
  state: {
    totalCells: number;
    items: ({ id: string; height: number; color: string } | null)[];
    note: string;
    curIn: number;
    showRange?: boolean;
    lowerBound?: number;
    upperBound?: number;
  };
  classicTheme?: boolean;
  onSelectKey?: (key: number) => void;
}

export const AppletCanvas: React.FC<AppletCanvasProps> = ({
  state,
  classicTheme = true,
  onSelectKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const N_COLUMNS = 6;
  const N_CELLS_PER_COL = 10;
  const CANVAS_WIDTH = 450;
  const CANVAS_HEIGHT = 330;

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

    // 2. Note Box
    const noteX = 12;
    const noteY = 16;
    const noteW = 426;
    const noteH = 28;

    if (classicTheme) {
      // 3D inset box
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(noteX, noteY, noteW, noteH);
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteX, noteY, noteW, noteH);

      // Top/Left dark shadow, bottom/right white highlight
      ctx.strokeStyle = '#404040';
      ctx.beginPath();
      ctx.moveTo(noteX, noteY + noteH);
      ctx.lineTo(noteX, noteY);
      ctx.lineTo(noteX + noteW, noteY);
      ctx.stroke();

      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(noteX, noteY + noteH);
      ctx.lineTo(noteX + noteW, noteY + noteH);
      ctx.lineTo(noteX + noteW, noteY);
      ctx.stroke();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace, sans-serif';
    } else {
      // Modern Card
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(noteX, noteY, noteW, noteH, 6);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 12px system-ui, sans-serif';
    }

    // Draw note text with ellipsis if too long
    const textY = noteY + 18;
    ctx.fillText(state.note, noteX + 10, textY);

    // 3. Grid Layout Constants
    const leftMargin = 12;
    const topMargin = 56;
    const columnWidth = 71;
    const cellWidth = 36;
    const cellHeight = 19;
    const vertSeparation = 25;

    // 4. Draw Array Cells
    for (let i = 0; i < state.totalCells; i++) {
      const col = Math.floor(i / N_CELLS_PER_COL);
      const row = i % N_CELLS_PER_COL;

      const cellX = leftMargin + col * columnWidth + 18;
      const cellY = topMargin + row * vertSeparation;

      // Draw Index Number
      ctx.fillStyle = classicTheme ? '#000000' : '#64748B';
      ctx.font = classicTheme ? '11px sans-serif' : '500 10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${i}`, cellX - 4, cellY + 14);
      ctx.textAlign = 'left';

      // Draw Cell Box
      const item = state.items[i];

      if (classicTheme) {
        // Outer border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);

        // Highlight binary search range
        if (
          state.showRange &&
          state.lowerBound !== undefined &&
          state.upperBound !== undefined &&
          i >= state.lowerBound &&
          i <= state.upperBound
        ) {
          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = 2;
          ctx.strokeRect(cellX - 1, cellY - 1, cellWidth + 2, cellHeight + 2);
        }

        if (item) {
          // Fill item color
          ctx.fillStyle = item.color;
          ctx.fillRect(cellX + 1, cellY + 1, cellWidth - 2, cellHeight - 2);

          // 3D Bevel for classic Java fill3DRect look
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(cellX + 1, cellY + cellHeight - 1);
          ctx.lineTo(cellX + 1, cellY + 1);
          ctx.lineTo(cellX + cellWidth - 1, cellY + 1);
          ctx.stroke();

          ctx.strokeStyle = '#404040';
          ctx.beginPath();
          ctx.moveTo(cellX + 1, cellY + cellHeight - 1);
          ctx.lineTo(cellX + cellWidth - 1, cellY + cellHeight - 1);
          ctx.lineTo(cellX + cellWidth - 1, cellY + 1);
          ctx.stroke();

          // Value Text
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${item.height}`, cellX + Math.floor(cellWidth / 2), cellY + 14);
          ctx.textAlign = 'left';
        } else {
          // Empty cell in classic style
          ctx.fillStyle = '#E8E8E8';
          ctx.fillRect(cellX + 1, cellY + 1, cellWidth - 2, cellHeight - 2);
        }
      } else {
        // Modern Style
        if (item) {
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.roundRect(cellX, cellY, cellWidth, cellHeight, 4);
          ctx.fill();

          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Value text centered
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 11px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${item.height}`, cellX + Math.floor(cellWidth / 2), cellY + 14);
          ctx.textAlign = 'left';
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(cellX, cellY, cellWidth, cellHeight, 4);
          ctx.fill();

          ctx.strokeStyle = '#CBD5E1';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw Pointer Indicator (Red Arrow) if current index
      if (i === state.curIn) {
        const arrowX = cellX + cellWidth + 3;
        const arrowY = cellY + Math.floor(cellHeight / 2);

        ctx.fillStyle = '#DC2626'; // Vibrant Red
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;

        // Line
        ctx.beginPath();
        ctx.moveTo(arrowX + 11, arrowY);
        ctx.lineTo(arrowX + 2, arrowY);
        ctx.stroke();

        // Arrow head pointing left
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + 6, arrowY - 4);
        ctx.lineTo(arrowX + 6, arrowY + 4);
        ctx.closePath();
        ctx.fill();
      }
    }
  }, [state, classicTheme]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelectKey) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const leftMargin = 12;
    const topMargin = 56;
    const columnWidth = 71;
    const cellWidth = 36;
    const cellHeight = 19;
    const vertSeparation = 25;

    for (let i = 0; i < state.totalCells; i++) {
      const col = Math.floor(i / N_CELLS_PER_COL);
      const row = i % N_CELLS_PER_COL;

      const cellX = leftMargin + col * columnWidth + 18;
      const cellY = topMargin + row * vertSeparation;

      if (
        clickX >= cellX &&
        clickX <= cellX + cellWidth &&
        clickY >= cellY &&
        clickY <= cellY + cellHeight
      ) {
        const item = state.items[i];
        if (item) {
          onSelectKey(item.height);
        }
        break;
      }
    }
  };

  return (
    <div className="relative inline-block select-none overflow-hidden rounded-lg shadow-inner border border-slate-300 bg-slate-100">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ width: '100%', maxWidth: '450px', height: 'auto', display: 'block' }}
        className="cursor-pointer"
        title="انقر على أي عنصر لاختيار قيمته في مربع الإدخال"
      />
    </div>
  );
};
