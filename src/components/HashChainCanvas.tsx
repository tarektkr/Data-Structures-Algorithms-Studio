import React, { useRef, useEffect } from 'react';
import { HashChainState } from '../utils/hashChainLogic';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface HashChainCanvasProps {
  state: HashChainState;
  classicTheme?: boolean;
  onSelectKey?: (key: number) => void;
  onScrollChange?: (newTop: number) => void;
}

export const HashChainCanvas: React.FC<HashChainCanvasProps> = ({
  state,
  classicTheme = true,
  onSelectKey,
  onScrollChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const maxScroll = Math.max(0, state.totalBuckets - state.linesInView);

  // Wheel listener to scroll buckets smoothly
  const handleWheel = (e: React.WheelEvent) => {
    if (!onScrollChange) return;
    if (e.deltaY > 0) {
      onScrollChange(Math.min(maxScroll, state.topDisplayLine + 1));
    } else if (e.deltaY < 0) {
      onScrollChange(Math.max(0, state.topDisplayLine - 1));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = 420;
    const height = 320;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 1. Clear / Background
    if (classicTheme) {
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
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

    // 2. Note Box at top
    const noteX = 10;
    const noteY = 45;
    const noteW = 320;
    const noteH = 25;

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

    // 3. Draw 10 visible buckets
    const startList = state.topDisplayLine;
    const endList = Math.min(state.totalBuckets, startList + state.linesInView);

    for (let list = startList; list < endList; list++) {
      const row = list - startList;
      const baseY = 79 + 24 * row;
      const bucket = state.bucketArray[list];

      // Draw Bucket Index number on left
      const isCurrentList = list === state.curList && state.opMode !== 'idle';
      ctx.font = classicTheme ? 'bold 11px sans-serif' : 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isCurrentList
        ? (classicTheme ? '#b91c1c' : '#f43f5e')
        : (classicTheme ? '#000000' : '#94a3b8');
      ctx.fillText(list.toString(), 28, baseY + 4);

      if (!bucket || bucket.nLinks === 0) {
        // Draw empty head cell (null)
        const cellX = 33;
        const cellY = baseY - 5;
        const cellW = 35;
        const cellH = 17;

        ctx.fillStyle = classicTheme ? '#d4d0c8' : '#1e293b';
        ctx.fillRect(cellX, cellY, cellW, cellH);
        ctx.strokeStyle = classicTheme ? '#808080' : '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(cellX, cellY, cellW, cellH);

        // draw null text in faint font
        ctx.font = 'italic 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = classicTheme ? '#888888' : '#64748b';
        ctx.fillText('null', cellX + cellW / 2, cellY + cellH / 2);

        // If currently focused on empty bucket
        if (isCurrentList && state.curLink === 0) {
          drawPointerArrow(ctx, cellX, cellY, cellW, cellH, classicTheme);
        }
      } else {
        // Draw links in this bucket
        for (let link = 0; link < bucket.nLinks; link++) {
          const item = bucket.linkArray[link];
          if (!item) continue;

          const cellX = 33 + link * 60;
          const cellY = baseY - 5;
          const cellW = 35;
          const cellH = 17;

          // If link > 0, draw connecting horizontal arrow from previous link
          if (link > 0) {
            const prevRight = 33 + (link - 1) * 60 + cellW;
            const arrowY = baseY + 3;

            ctx.strokeStyle = classicTheme ? '#000000' : '#94a3b8';
            ctx.fillStyle = classicTheme ? '#000000' : '#94a3b8';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.moveTo(prevRight, arrowY);
            ctx.lineTo(cellX, arrowY);
            ctx.stroke();

            // Arrowhead pointing right
            ctx.beginPath();
            ctx.moveTo(cellX, arrowY);
            ctx.lineTo(cellX - 6, arrowY - 4);
            ctx.lineTo(cellX - 6, arrowY + 4);
            ctx.closePath();
            ctx.fill();
          }

          // Draw link cell body
          ctx.fillStyle = item.persData.color;
          ctx.fillRect(cellX, cellY, cellW, cellH);

          if (classicTheme) {
            // 3D bevel effect
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
            const isTarget = isCurrentList && state.curLink === link;
            ctx.strokeStyle = isTarget ? '#f43f5e' : '#475569';
            ctx.lineWidth = isTarget ? 2 : 1;
            ctx.strokeRect(cellX, cellY, cellW, cellH);
          }

          // Draw item key number
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000000';
          ctx.fillText(item.persData.height.toString(), cellX + cellW / 2, cellY + cellH / 2);

          // Draw pointer arrow if active link
          if (isCurrentList && state.curLink === link) {
            drawPointerArrow(ctx, cellX, cellY, cellW, cellH, classicTheme);
          }
        }
      }
    }
  }, [state, classicTheme]);

  // Helper to draw red pointer arrow above/pointing to the active link
  function drawPointerArrow(
    ctx: CanvasRenderingContext2D,
    cellX: number,
    cellY: number,
    cellW: number,
    cellH: number,
    isClassic: boolean
  ) {
    const tipX = cellX + cellW / 2;
    const tipY = cellY - 2;

    ctx.strokeStyle = isClassic ? '#ff0000' : '#f43f5e';
    ctx.fillStyle = isClassic ? '#ff0000' : '#f43f5e';
    ctx.lineWidth = 2;

    // Vertical arrow pointing down into the cell top
    ctx.beginPath();
    ctx.moveTo(tipX, tipY - 14);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - 4, tipY - 6);
    ctx.lineTo(tipX + 4, tipY - 6);
    ctx.closePath();
    ctx.fill();
  }

  // Handle clicking on a link to select its key
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelectKey) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 420 / (rect.width || 420);
    const scaleY = 320 / (rect.height || 320);
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const startList = state.topDisplayLine;
    const endList = Math.min(state.totalBuckets, startList + state.linesInView);

    for (let list = startList; list < endList; list++) {
      const row = list - startList;
      const baseY = 79 + 24 * row;
      const bucket = state.bucketArray[list];
      if (!bucket) continue;

      for (let link = 0; link < bucket.nLinks; link++) {
        const item = bucket.linkArray[link];
        if (!item) continue;

        const cellX = 33 + link * 60;
        const cellY = baseY - 5;
        const cellW = 35;
        const cellH = 17;

        if (
          clickX >= cellX &&
          clickX <= cellX + cellW &&
          clickY >= cellY &&
          clickY <= cellY + cellH
        ) {
          onSelectKey(item.persData.height);
          return;
        }
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-1.5 select-none"
      onWheel={handleWheel}
    >
      {/* 420px Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: '420px', height: '320px', maxWidth: '100%' }}
          className="rounded shadow cursor-pointer border border-slate-300"
          title="انقر على أي عقدة لنسخ قيمتها إلى خانة الإدخال، أو استخدم عجلة الماوس للتمرير"
        />
      </div>

      {/* Vertical Scrollbar matching AWT 1998 style */}
      <div
        className={`flex flex-col items-center justify-between h-[320px] w-6 rounded border ${
          classicTheme
            ? 'bg-[#d4d0c8] border-slate-400 text-black'
            : 'bg-slate-800 border-slate-700 text-slate-300'
        }`}
      >
        {/* Scroll Up Button */}
        <button
          type="button"
          onClick={() => onScrollChange && onScrollChange(Math.max(0, state.topDisplayLine - 1))}
          disabled={state.topDisplayLine <= 0}
          className={`w-full py-1.5 flex items-center justify-center transition ${
            classicTheme
              ? 'hover:bg-[#b0b0b0] active:bg-[#909090] disabled:opacity-40'
              : 'hover:bg-slate-700 active:bg-slate-600 disabled:opacity-30'
          }`}
          title="تمرير لأعلى (Scroll Up)"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Scroll Track & Draggable Thumb */}
        <div
          className="flex-1 w-full relative flex items-center justify-center cursor-pointer my-1"
          onClick={(e) => {
            if (!onScrollChange) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const clickFraction = (e.clientY - rect.top) / rect.height;
            const target = Math.round(clickFraction * maxScroll);
            onScrollChange(Math.max(0, Math.min(maxScroll, target)));
          }}
        >
          {/* Thumb indicator */}
          <div
            style={{
              top: `${maxScroll > 0 ? (state.topDisplayLine / maxScroll) * 80 : 0}%`,
              height: '24px',
            }}
            className={`w-4 absolute rounded shadow-xs transition-all ${
              classicTheme
                ? 'bg-[#b0b0b0] hover:bg-[#989898] border border-slate-500'
                : 'bg-blue-600 hover:bg-blue-500 border border-blue-400'
            }`}
          />
        </div>

        {/* Scroll Down Button */}
        <button
          type="button"
          onClick={() => onScrollChange && onScrollChange(Math.min(maxScroll, state.topDisplayLine + 1))}
          disabled={state.topDisplayLine >= maxScroll}
          className={`w-full py-1.5 flex items-center justify-center transition ${
            classicTheme
              ? 'hover:bg-[#b0b0b0] active:bg-[#909090] disabled:opacity-40'
              : 'hover:bg-slate-700 active:bg-slate-600 disabled:opacity-30'
          }`}
          title="تمرير لأسفل (Scroll Down)"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
