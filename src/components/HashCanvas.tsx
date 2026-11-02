import React, { useRef, useEffect } from 'react';
import { HashState } from '../utils/hashLogic';

interface HashCanvasProps {
  state: HashState;
  classicTheme?: boolean;
  onSelectKey?: (key: number) => void;
}

export const HashCanvas: React.FC<HashCanvasProps> = ({
  state,
  classicTheme = true,
  onSelectKey,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = 440 * dpr;
    canvas.height = 320 * dpr;
    ctx.scale(dpr, dpr);

    const width = 440;
    const height = 320;

    // Clear / Background
    if (classicTheme) {
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#0f172a'; // Slate 900
      ctx.fillRect(0, 0, width, height);

      // Subtle grid background in modern theme
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 1. Draw Note Box at Top
    const noteX = 10;
    const noteY = 48;
    const noteW = 420;
    const noteH = 26;

    if (classicTheme) {
      ctx.fillStyle = '#d4d0c8';
      ctx.fillRect(noteX, noteY, noteW, noteH);

      // 3D inset border
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteX, noteY, noteW, noteH);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.note, noteX + 10, noteY + noteH / 2);
    } else {
      // Modern banner
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(noteX, noteY, noteW, noteH);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteX, noteY, noteW, noteH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`💬 ${state.note}`, noteX + 10, noteY + noteH / 2);
    }

    // 2. Draw Hash Table Cells
    const totalCells = state.totalCells;
    const cellsPerCol = 12;

    for (let i = 0; i < totalCells; i++) {
      const col = Math.floor(i / cellsPerCol);
      const row = i % cellsPerCol;

      const baseX = 10 + 85 * col;
      const baseY = 89 + 17 * row;

      const cellX = baseX + 26;
      const cellY = baseY - 8;
      const cellW = 35;
      const cellH = 17;

      const item = state.personArray[i];
      const isActive = i === state.curIn;

      // Index number label on the left
      ctx.font = classicTheme ? '11px sans-serif' : '10px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = classicTheme ? '#000000' : '#94a3b8';
      ctx.fillText(i.toString(), cellX - 4, cellY + cellH / 2 + 1);

      // Cell body fill
      if (item === null) {
        // Empty cell
        ctx.fillStyle = classicTheme ? '#d4d0c8' : '#1e293b';
        ctx.fillRect(cellX, cellY, cellW, cellH);

        // Border
        ctx.strokeStyle = classicTheme ? '#808080' : '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellW, cellH);
      } else if (item.height === -1) {
        // *Del* deleted item sentinel
        ctx.fillStyle = classicTheme ? '#d4d0c8' : '#334155';
        ctx.fillRect(cellX, cellY, cellW, cellH);

        ctx.strokeStyle = classicTheme ? '#808080' : '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellW, cellH);

        // Draw *Del* text
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = classicTheme ? '#666666' : '#f87171';
        ctx.fillText('*Del*', cellX + cellW / 2, cellY + cellH / 2 + 1);
      } else {
        // Occupied cell
        ctx.fillStyle = item.color;
        ctx.fillRect(cellX, cellY, cellW, cellH);

        if (classicTheme) {
          // AWT 3D bevel effect
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cellX, cellY + cellH);
          ctx.lineTo(cellX, cellY);
          ctx.lineTo(cellX + cellW, cellY);
          ctx.stroke();

          ctx.strokeStyle = '#808080';
          ctx.beginPath();
          ctx.moveTo(cellX + cellW, cellY);
          ctx.lineTo(cellX + cellW, cellY + cellH);
          ctx.lineTo(cellX, cellY + cellH);
          ctx.stroke();

          ctx.strokeStyle = '#000000';
          ctx.strokeRect(cellX - 0.5, cellY - 0.5, cellW + 1, cellH + 1);
        } else {
          ctx.strokeStyle = isActive ? '#f43f5e' : '#475569';
          ctx.lineWidth = isActive ? 2 : 1;
          ctx.strokeRect(cellX, cellY, cellW, cellH);
        }

        // Draw key number
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000000';
        ctx.fillText(item.height.toString(), cellX + cellW / 2, cellY + cellH / 2 + 1);
      }

      // Highlight active cell border if probing
      if (isActive) {
        if (!classicTheme) {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.strokeRect(cellX - 2, cellY - 2, cellW + 4, cellH + 4);
        }

        // Draw Red Arrow pointing from right of cell into cell
        const arrowTipX = cellX + cellW;
        const arrowTipY = cellY + Math.floor(cellH / 2);
        const arrowLength = 18;

        ctx.strokeStyle = classicTheme ? '#ff0000' : '#f43f5e';
        ctx.fillStyle = classicTheme ? '#ff0000' : '#f43f5e';
        ctx.lineWidth = 2;

        // Main horizontal line
        ctx.beginPath();
        ctx.moveTo(arrowTipX + arrowLength, arrowTipY);
        ctx.lineTo(arrowTipX, arrowTipY);
        ctx.stroke();

        // Arrowhead pointing LEFT
        ctx.beginPath();
        ctx.moveTo(arrowTipX, arrowTipY);
        ctx.lineTo(arrowTipX + 7, arrowTipY - 5);
        ctx.lineTo(arrowTipX + 7, arrowTipY + 5);
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
    const scaleX = 440 / (rect.width || 440);
    const scaleY = 320 / (rect.height || 320);
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const totalCells = state.totalCells;
    const cellsPerCol = 12;

    for (let i = 0; i < totalCells; i++) {
      const col = Math.floor(i / cellsPerCol);
      const row = i % cellsPerCol;

      const baseX = 10 + 85 * col;
      const baseY = 89 + 17 * row;
      const cellX = baseX + 26;
      const cellY = baseY - 8;
      const cellW = 35;
      const cellH = 17;

      if (
        clickX >= cellX &&
        clickX <= cellX + cellW &&
        clickY >= cellY &&
        clickY <= cellY + cellH
      ) {
        const item = state.personArray[i];
        if (item && item.height >= 0) {
          onSelectKey(item.height);
        } else {
          onSelectKey(i);
        }
        break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ width: '440px', height: '320px', maxWidth: '100%' }}
        className="rounded shadow cursor-pointer border border-slate-300"
        title="انقر على أي خلية لنسخ قيمتها إلى خانة الإدخال"
      />
    </div>
  );
};
