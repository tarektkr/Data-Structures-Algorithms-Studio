import React, { useRef, useEffect } from 'react';
import { LinkListState } from '../utils/linkListLogic';

interface LinkListCanvasProps {
  state: LinkListState;
  classicTheme?: boolean;
}

export const LinkListCanvas: React.FC<LinkListCanvasProps> = ({
  state,
  classicTheme = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 320;
  const N_COLUMNS = 7;
  const COLUMN_WIDTH = 57;
  const ROW_HEIGHT = 57;
  const LINK_WIDTH = 35;
  const LINK_HEIGHT = 17;
  const START_X = 32;
  const START_Y = 89;

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

    // Helper: draw small arrow pointing right at (ax, ay)
    const drawSmallArrowRight = (ax: number, ay: number, color = '#000000') => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ax - 5, ay - 4);
      ctx.lineTo(ax, ay);
      ctx.lineTo(ax - 5, ay + 4);
      ctx.stroke();
    };

    // 3. Draw Head pointer arrow to the first link
    if (state.totalLinks > 0) {
      const firstX = START_X;
      const firstY = START_Y;

      ctx.fillStyle = '#2563EB';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('First', firstX - 16, firstY + 12);

      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(firstX - 8, firstY + 8);
      ctx.lineTo(firstX - 1, firstY + 8);
      ctx.stroke();
      drawSmallArrowRight(firstX - 1, firstY + 8, '#2563EB');
    }

    // 4. Draw Links
    for (let i = 0; i < state.totalLinks; i++) {
      const col = i % N_COLUMNS;
      const row = Math.floor(i / N_COLUMNS);
      const x = START_X + col * COLUMN_WIDTH;
      const y = START_Y + row * ROW_HEIGHT;

      const link = state.linkArray[i];
      if (!link) continue;

      // Check if this link is currently in deletion bypass
      const isBeingDeleted = state.areDeleting && i === state.delDex;

      if (isBeingDeleted) {
        // Draw bypassed / dashed hollow box
        ctx.strokeStyle = '#EF4444';
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(x, y, LINK_WIDTH, LINK_HEIGHT);
        ctx.setLineDash([]);

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DEL', x + LINK_WIDTH / 2, y + 12);
      } else {
        // Draw 3D beveled link box
        if (classicTheme) {
          ctx.fillStyle = link.persData.color;
          ctx.fillRect(x + 1, y + 1, LINK_WIDTH - 2, LINK_HEIGHT - 2);

          // 3D Bevel highlight & shadow
          ctx.strokeStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.moveTo(x + 1, y + LINK_HEIGHT - 1);
          ctx.lineTo(x + 1, y + 1);
          ctx.lineTo(x + LINK_WIDTH - 1, y + 1);
          ctx.stroke();

          ctx.strokeStyle = '#404040';
          ctx.beginPath();
          ctx.moveTo(x + LINK_WIDTH - 1, y + 1);
          ctx.lineTo(x + LINK_WIDTH - 1, y + LINK_HEIGHT - 1);
          ctx.stroke();

          ctx.strokeStyle = '#000000';
          ctx.strokeRect(x, y, LINK_WIDTH, LINK_HEIGHT);
        } else {
          ctx.fillStyle = link.persData.color;
          ctx.beginPath();
          ctx.roundRect(x, y, LINK_WIDTH, LINK_HEIGHT, 3);
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw key number
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${link.persData.height}`, x + LINK_WIDTH / 2, y + 12);
      }

      // Draw Next Pointer Arrow (connecting link i to link i+1)
      if (i < state.totalLinks - 1) {
        const nextCol = (i + 1) % N_COLUMNS;
        const nextRow = Math.floor((i + 1) / N_COLUMNS);

        if (col < N_COLUMNS - 1) {
          // Normal horizontal arrow to next link on right
          const startPtX = x + LINK_WIDTH;
          const startPtY = y + 8;
          const endPtX = startPtX + 20;

          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(startPtX, startPtY);
          ctx.lineTo(endPtX, startPtY);
          ctx.stroke();

          drawSmallArrowRight(endPtX, startPtY, '#000000');
        } else {
          // Serpentine Wrap-around arrow from end of row to start of next row
          const p1X = x + LINK_WIDTH;
          const p1Y = y + 8;
          const p2X = p1X + 8;
          const p2Y = p1Y;
          const p3X = p2X;
          const p3Y = y + 36;
          const p4X = 14;
          const p4Y = p3Y;
          const p5X = 14;
          const p5Y = START_Y + nextRow * ROW_HEIGHT + 8;
          const p6X = START_X;
          const p6Y = p5Y;

          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p1X, p1Y);
          ctx.lineTo(p2X, p2Y);
          ctx.lineTo(p3X, p3Y);
          ctx.lineTo(p4X, p4Y);
          ctx.lineTo(p5X, p5Y);
          ctx.lineTo(p6X, p6Y);
          ctx.stroke();

          drawSmallArrowRight(p6X, p6Y, '#000000');
        }
      } else {
        // Last link: points to null
        const endX = x + LINK_WIDTH;
        const endY = y + 8;

        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + 12, endY);
        ctx.stroke();

        // Null termination symbol (earth ground symbol)
        ctx.beginPath();
        ctx.moveTo(endX + 12, endY - 5);
        ctx.lineTo(endX + 12, endY + 5);
        ctx.moveTo(endX + 15, endY - 3);
        ctx.lineTo(endX + 15, endY + 3);
        ctx.moveTo(endX + 18, endY - 1);
        ctx.lineTo(endX + 18, endY + 1);
        ctx.stroke();
      }

      // Red pointer arrow above curIn
      if (state.curIn === i) {
        const arrowCenterX = x + LINK_WIDTH / 2;
        const arrowTipY = y - 2;
        const arrowTailY = y - 18;

        ctx.strokeStyle = '#DC2626';
        ctx.fillStyle = '#DC2626';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(arrowCenterX, arrowTailY);
        ctx.lineTo(arrowCenterX, arrowTipY);
        ctx.stroke();

        // Arrow head pointing down
        ctx.beginPath();
        ctx.moveTo(arrowCenterX, arrowTipY);
        ctx.lineTo(arrowCenterX - 4, arrowTipY - 5);
        ctx.lineTo(arrowCenterX + 4, arrowTipY - 5);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('current', arrowCenterX, arrowTailY - 2);
      }
    }

    // 5. Draw Visual Splice during Insertion (areInserting)
    if (state.areInserting && state.tempPers) {
      const insDex = state.insDex;
      const col = insDex % N_COLUMNS;
      const row = Math.floor(insDex / N_COLUMNS);
      const tempX = 15 + col * COLUMN_WIDTH;
      const tempY = 115 + row * ROW_HEIGHT;

      // Draw temp link box
      ctx.fillStyle = state.tempPers.color;
      ctx.fillRect(tempX + 1, tempY + 1, LINK_WIDTH - 2, LINK_HEIGHT - 2);
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(tempX, tempY, LINK_WIDTH, LINK_HEIGHT);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${state.tempPers.height}`, tempX + LINK_WIDTH / 2, tempY + 12);

      // Splice pointers: green/purple pointer showing redirection
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 2;

      // Predecessor -> tempPers
      if (insDex > 0) {
        const predCol = (insDex - 1) % N_COLUMNS;
        const predRow = Math.floor((insDex - 1) / N_COLUMNS);
        const predX = START_X + predCol * COLUMN_WIDTH + LINK_WIDTH;
        const predY = START_Y + predRow * ROW_HEIGHT + 8;

        ctx.beginPath();
        ctx.moveTo(predX, predY);
        ctx.lineTo(tempX, tempY + 8);
        ctx.stroke();
      }

      // tempPers -> Successor
      const succX = START_X + col * COLUMN_WIDTH;
      const succY = START_Y + row * ROW_HEIGHT + 8;

      ctx.beginPath();
      ctx.moveTo(tempX + LINK_WIDTH, tempY + 8);
      ctx.lineTo(succX, succY);
      ctx.stroke();
      drawSmallArrowRight(succX, succY, '#16A34A');
    }

    // 6. Draw Bypass line during Deletion (areDeleting)
    if (state.areDeleting && state.delDex >= 0) {
      const delDex = state.delDex;
      if (delDex > 0 && delDex < state.totalLinks - 1) {
        const predCol = (delDex - 1) % N_COLUMNS;
        const predRow = Math.floor((delDex - 1) / N_COLUMNS);
        const predX = START_X + predCol * COLUMN_WIDTH + LINK_WIDTH;
        const predY = START_Y + predRow * ROW_HEIGHT + 8;

        const succCol = (delDex + 1) % N_COLUMNS;
        const succRow = Math.floor((delDex + 1) / N_COLUMNS);
        const succX = START_X + succCol * COLUMN_WIDTH;
        const succY = START_Y + succRow * ROW_HEIGHT + 8;

        // Curved arc or bypassing line over deleted link
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(predX, predY);
        ctx.quadraticCurveTo((predX + succX) / 2, predY - 20, succX, succY);
        ctx.stroke();
        drawSmallArrowRight(succX, succY, '#DC2626');
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
