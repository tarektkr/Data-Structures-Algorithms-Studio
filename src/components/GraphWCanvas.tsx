import React, { useRef, useEffect } from 'react';
import { GraphWState, dtoS, INFINITY } from '../utils/graphWLogic';

interface GraphWCanvasProps {
  state: GraphWState;
  classicTheme?: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const GraphWCanvas: React.FC<GraphWCanvasProps> = ({
  state,
  classicTheme = false,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onDoubleClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 440;
    const height = 320;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.direction = 'ltr';

    // ==========================================
    // 1. ADJACENCY MATRIX VIEW
    // ==========================================
    if (state.showAdjm) {
      // Yellow background
      ctx.fillStyle = classicTheme ? '#ffff99' : '#fef08a';
      ctx.fillRect(0, 0, width, height);

      // Note text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(state.note, 16, 64);

      if (state.nVerts === 0) return;

      // Draw Matrix Table
      const startX = 40;
      const startY = 85;
      const cellW = 28;
      const cellH = 17;

      ctx.font = 'bold 11px "Courier New", monospace';

      // Column headers
      for (let j = 0; j < state.nVerts; j++) {
        const x = startX + (j + 1) * cellW;
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(state.vertexList[j].label, x + 6, startY);
      }

      // Rows
      for (let i = 0; i < state.nVerts; i++) {
        const y = startY + (i + 1) * cellH;

        // Row header
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(state.vertexList[i].label, startX, y);

        // Cells
        for (let j = 0; j < state.nVerts; j++) {
          const x = startX + (j + 1) * cellW;
          const dist = state.adjMat[i][j].distance;
          const distStr = dtoS(dist);

          if (distStr === 'inf') {
            ctx.fillStyle = '#9ca3af'; // muted gray for inf
          } else {
            ctx.fillStyle = state.adjMat[i][j].isInTree ? '#dc2626' : '#000000';
          }
          ctx.fillText(distStr, x + 4, y);
        }
      }
      return;
    }

    // ==========================================
    // 2. NORMAL GRAPH VIEW (MSTW)
    // ==========================================

    // Background
    ctx.fillStyle = classicTheme ? '#d4d4d4' : '#e2e8f0';
    ctx.fillRect(0, 0, width, height);

    // Note Box at Top
    ctx.fillStyle = classicTheme ? '#e5e5e5' : '#ffffff';
    ctx.fillRect(10, 42, 420, 24);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 42, 420, 24);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(state.note, 16, 58);

    // Main Drawing Area Border
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 70, 420, 204);
    ctx.fillStyle = classicTheme ? '#dcdcdc' : '#f8fafc';
    ctx.fillRect(11, 71, 418, 202);

    // ------------------------------------------
    // A. Draw Undirected Edges (i < j)
    // ------------------------------------------
    for (let i = 0; i < state.nVerts; i++) {
      for (let j = i + 1; j < state.nVerts; j++) {
        const cell = state.adjMat[i][j];
        if (cell.distance < INFINITY) {
          const v1 = state.vertexList[i];
          const v2 = state.vertexList[j];

          // Check if edge is in Tree
          const inTree = cell.isInTree;

          if (inTree) {
            // Highlighted Tree Edge (bold red)
            ctx.strokeStyle = '#dc2626';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.stroke();
          } else {
            // Normal Edge
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(v1.x, v1.y);
            ctx.lineTo(v2.x, v2.y);
            ctx.stroke();
          }

          // Center Weight Badge
          const midX = Math.round((v1.x + v2.x) / 2);
          const midY = Math.round((v1.y + v2.y) / 2);

          const bw = state.weightBoxWidth;
          const bh = state.weightBoxHeight;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(midX - Math.floor(bw / 2), midY - Math.floor(bh / 2), bw, bh);
          ctx.strokeStyle = inTree ? '#dc2626' : '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(midX - Math.floor(bw / 2), midY - Math.floor(bh / 2), bw, bh);

          ctx.fillStyle = inTree ? '#dc2626' : '#000000';
          ctx.font = 'bold 10px "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell.distance.toString(), midX + 1.5, midY + 1);
        }
      }
    }

    // ------------------------------------------
    // B. Draw Active Edge Drag
    // ------------------------------------------
    if (state.isDragging) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(state.xStartDrag, state.yStartDrag);
      ctx.lineTo(state.currentDragX, state.currentDragY);
      ctx.stroke();
      ctx.restore();
    }

    // ------------------------------------------
    // C. Draw Vertices
    // ------------------------------------------
    for (let i = 0; i < state.nVerts; i++) {
      const v = state.vertexList[i];
      const r = state.vertexDiameter / 2; // 11

      // Tree Red Ring indicator
      if (v.isInTree) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(v.x, v.y, r + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertex circle fill
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Vertex border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Vertex Label (centered with slight right offset)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.label, v.x + 1.5, v.y + 1);
    }

    // ------------------------------------------
    // D. Bottom Bar: Tree and PQ (y=280)
    // ------------------------------------------
    ctx.fillStyle = classicTheme ? '#e5e5e5' : '#ffffff';
    ctx.fillRect(10, 278, 420, 36);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 278, 420, 36);

    ctx.textBaseline = 'middle';
    ctx.font = 'bold 11px "Courier New", monospace';

    // Left side: Tree
    ctx.textAlign = 'left';
    ctx.fillStyle = '#dc2626';
    let treeStr = 'Tree: ';
    for (let i = 0; i < state.nTree; i++) {
      treeStr += state.vertexList[state.tree[i]].label + ' ';
    }
    ctx.fillText(treeStr, 16, 296);

    // Right side: Priority Queue
    ctx.fillStyle = '#1e3a8a';
    let pqStr = 'PQ: ';
    for (let k = 0; k < state.thePQ.length; k++) {
      const edge = state.thePQ[k];
      pqStr += `${state.vertexList[edge.srcVert].label}${state.vertexList[edge.destVert].label}${edge.distance} `;
    }
    ctx.fillText(pqStr, 200, 296);
  }, [state, classicTheme]);

  return (
    <div className="relative inline-block select-none shadow-md rounded-lg overflow-hidden border border-slate-300">
      <canvas
        ref={canvasRef}
        style={{ width: 440, height: 320 }}
        className="cursor-crosshair block"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
};
