import React, { useRef, useEffect } from 'react';
import { GraphDWState, dtoS, INFINITY } from '../utils/graphDWLogic';

interface GraphDWCanvasProps {
  state: GraphDWState;
  classicTheme?: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const GraphDWCanvas: React.FC<GraphDWCanvasProps> = ({
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
    const height = 345;
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

      // Note text at top
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(state.note, 16, 64);

      if (state.nVerts > 0) {
        const startX = 90;
        const startY = 106;
        const colWidth = 27;
        const rowHeight = 18;

        // Dividing horizontal line below column headers
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX - colWidth, startY - rowHeight + 4);
        ctx.lineTo(startX + (state.nVerts - 1) * colWidth + 8, startY - rowHeight + 4);
        ctx.stroke();

        // Dividing vertical line to right of row headers
        ctx.beginPath();
        ctx.moveTo(startX - colWidth / 2 + 2, startY - 2 * rowHeight + 8);
        ctx.lineTo(startX - colWidth / 2 + 2, startY + (state.nVerts - 1) * rowHeight);
        ctx.stroke();

        // Column headers (labels along top)
        ctx.font = 'bold 12px monospace';
        for (let c = 0; c < state.nVerts; c++) {
          const lbl = state.vertexList[c].label;
          ctx.fillStyle = '#000000';
          ctx.fillText(lbl, startX + c * colWidth, startY - rowHeight);
        }

        // Row headers and cell values
        for (let r = 0; r < state.nVerts; r++) {
          const rLbl = state.vertexList[r].label;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(rLbl, startX - colWidth, startY + r * rowHeight);

          for (let c = 0; c < state.nVerts; c++) {
            const dist = state.adjMat[r][c].distance;
            const str = dtoS(dist);
            ctx.fillStyle = dist < INFINITY ? '#0f172a' : '#64748b';
            ctx.font = dist < INFINITY ? 'bold 11px monospace' : 'normal 10px monospace';
            ctx.fillText(str, startX + c * colWidth, startY + r * rowHeight);
          }
        }
      }
      return;
    }

    // ==========================================
    // 2. GRAPH GRAPHICAL VIEW
    // ==========================================
    // Background
    ctx.fillStyle = classicTheme ? '#c0c0c0' : '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Note Banner at top (noteBoxTop: 45, noteBoxHeight: 25, noteBoxWidth: 430)
    ctx.fillStyle = classicTheme ? '#dcdcdc' : '#ffffff';
    ctx.fillRect(5, 45, 430, 24);
    ctx.strokeStyle = classicTheme ? '#808080' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 45, 430, 24);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(state.note, 14, 61);

    // Drawing box border (top: 71, width: 436, height: 207)
    ctx.strokeStyle = classicTheme ? '#000000' : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 71, 436, 207);

    // Inner area subtle background
    ctx.fillStyle = classicTheme ? '#c0c0c0' : '#f8fafc';
    ctx.fillRect(3, 72, 434, 205);

    // Draw all edges
    for (let i = 0; i < state.nVerts; i++) {
      for (let j = 0; j < state.nVerts; j++) {
        const edge = state.adjMat[i][j];
        if (edge.distance < INFINITY) {
          const v1 = state.vertexList[i];
          const v2 = state.vertexList[j];

          // Draw edge line
          ctx.strokeStyle = edge.isInTree ? (classicTheme ? '#000000' : '#dc2626') : '#334155';
          ctx.lineWidth = edge.isInTree ? 3 : 1.5;

          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();

          // Direction arrowhead/circle at distance 18 from (v2.x, v2.y)
          const dx = v1.x - v2.x;
          const dy = v1.y - v2.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len > 0) {
            const dist = 18;
            const ox = (dx * dist) / len;
            const oy = (dy * dist) / len;
            const dotX = v2.x + ox;
            const dotY = v2.y + oy;

            ctx.fillStyle = edge.isInTree ? '#dc2626' : '#0f172a';
            ctx.beginPath();
            ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Edge Weight Badge at midpoint
          const midX = Math.floor((v1.x + v2.x) / 2) - 9;
          const midY = Math.floor((v1.y + v2.y) / 2) - 8;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(midX, midY, 18, 16);
          ctx.strokeStyle = edge.isInTree ? '#dc2626' : '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(midX, midY, 18, 16);

          ctx.fillStyle = edge.isInTree ? '#dc2626' : '#0f172a';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const weightStr = edge.distance.toString();
          ctx.fillText(weightStr, midX + 9 + 1.5, midY + 8);
        }
      }
    }

    // Active Dragging line preview
    if (state.isDragging && state.startingVertex >= 0 && state.startingVertex < state.nVerts) {
      const startV = state.vertexList[state.startingVertex];
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startV.x, startV.y);
      ctx.lineTo(state.currentDragX, state.currentDragY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw all vertices
    for (let i = 0; i < state.nVerts; i++) {
      const v = state.vertexList[i];
      const radius = 11;

      // When vertex is in the shortest-path tree, draw outer red ring
      if (v.isInTree) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(v.x, v.y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertex circle fill
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.arc(v.x, v.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Vertex border
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vertex Label (perfectly centered in the circle with slight right offset)
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.label, v.x + 1.5, v.y + 1);
    }

    // Bottom Shortest-Path array (visitBoxTop: 305, visitBoxHeight: 25)
    ctx.fillStyle = classicTheme ? '#dcdcdc' : '#ffffff';
    ctx.fillRect(5, 305, 430, 25);
    ctx.strokeStyle = classicTheme ? '#808080' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(5, 305, 430, 25);

    if (state.opMode === 1 && state.codePart > 4) {
      for (let i = 0; i < state.nVerts; i++) {
        if (i < state.sPath.length) {
          const colX = 12 + 40 * i;
          const dist = state.sPath[i].distance;
          const parent = state.sPath[i].parentVert;
          const pLabel = state.vertexList[parent] ? state.vertexList[parent].label : '?';
          const distStr = dtoS(dist);
          const cellText = `${distStr}(${pLabel})`;

          // Horizontal bar
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(colX, 303);
          ctx.lineTo(colX + 35, 303);
          ctx.stroke();

          // Column header label above bar
          const v = state.vertexList[i];
          ctx.fillStyle = v.isInTree ? '#dc2626' : '#000000';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(v.label, colX + 4, 298);

          // Distance and parent inside visitBox
          ctx.fillStyle = '#0f172a';
          ctx.font = '10px monospace';
          ctx.fillText(cellText, colX, 321);
        }
      }
    }
  }, [state, classicTheme]);

  return (
    <div className="flex flex-col items-center select-none">
      <canvas
        ref={canvasRef}
        style={{ width: '440px', height: '345px' }}
        className="cursor-crosshair rounded-lg shadow-sm"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
};
