import React, { useRef, useEffect } from 'react';
import { GraphState } from '../utils/graphLogic';

interface GraphCanvasProps {
  state: GraphState;
  classicTheme?: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDoubleClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  state,
  classicTheme = true,
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

    const width = state.appletWidth;
    const height = state.appletHeight;
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
        const colWidth = 24;
        const rowHeight = 18;

        // Horizontal line under column headers
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX - colWidth, startY - rowHeight + 4);
        ctx.lineTo(startX + (state.nVerts - 1) * colWidth + 12, startY - rowHeight + 4);
        ctx.stroke();

        // Vertical line right of row headers
        ctx.beginPath();
        ctx.moveTo(startX - colWidth / 2 + 2, startY - 2 * rowHeight + 8);
        ctx.lineTo(startX - colWidth / 2 + 2, startY + (state.nVerts - 1) * rowHeight);
        ctx.stroke();

        // Column headers along top
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let c = 0; c < state.nVerts; c++) {
          const lbl = state.vertexList[c].label;
          ctx.fillStyle = '#000000';
          ctx.fillText(lbl, startX + c * colWidth + 1.5, startY - rowHeight);
        }

        // Row headers and cell values (0 or 1)
        for (let r = 0; r < state.nVerts; r++) {
          const rLbl = state.vertexList[r].label;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(rLbl, startX - colWidth + 1.5, startY + r * rowHeight);

          for (let c = 0; c < state.nVerts; c++) {
            const hasEdge = state.adjMat[r][c] === 1;
            ctx.fillStyle = hasEdge ? '#dc2626' : '#64748b';
            ctx.font = hasEdge ? 'bold 12px monospace' : 'normal 11px monospace';
            ctx.fillText(hasEdge ? '1' : '0', startX + c * colWidth + 1.5, startY + r * rowHeight);
          }
        }
      }
      return;
    }

    // ==========================================
    // 2. NORMAL GRAPH CANVAS VIEW
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
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(state.note, 14, 61);

    // Drawing box border (top: 71, width: 436, height: 207)
    ctx.strokeStyle = classicTheme ? '#000000' : '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 71, 436, state.drawingBoxHeight);

    // Inner area background
    ctx.fillStyle = classicTheme ? '#c0c0c0' : '#f8fafc';
    ctx.fillRect(3, 72, 434, state.drawingBoxHeight - 2);

    // Helper: check if edge (i, j) is in treeEdges
    const isEdgeInTree = (i: number, j: number) => {
      return state.treeEdges.some(([u, v]) => (u === i && v === j) || (u === j && v === i));
    };

    // ------------------------------------------
    // A. Draw Edges (Undirected)
    // ------------------------------------------
    for (let i = 0; i < state.nVerts; i++) {
      for (let j = i + 1; j < state.nVerts; j++) {
        if (state.adjMat[i][j] === 1) {
          const v1 = state.vertexList[i];
          const v2 = state.vertexList[j];
          const inTree = isEdgeInTree(i, j);

          ctx.strokeStyle = inTree ? '#dc2626' : '#334155';
          ctx.lineWidth = inTree ? 3 : 1.5;

          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();
        }
      }
    }

    // ------------------------------------------
    // B. Draw Active Dragging Edge Preview
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

      // Visited ring (Amber/Emerald)
      if (v.wasVisited) {
        ctx.strokeStyle = v.isInTree ? '#dc2626' : '#16a34a';
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

      // Vertex circle border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
      ctx.stroke();

      // Vertex Label (centered with +1.5px right offset)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v.label, v.x + 1.5, v.y + 1);
    }

    // ------------------------------------------
    // D. Bottom Status Bar (y: 280, height: 36)
    // ------------------------------------------
    ctx.fillStyle = classicTheme ? '#e5e5e5' : '#ffffff';
    ctx.fillRect(10, 280, 420, 34);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 280, 420, 34);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    if (state.opMode === 1) {
      const visitedStr = state.visitArray.map((idx: number) => state.vertexList[idx].label).join(' ');
      const stackStr = state.theStack.map((idx: number) => state.vertexList[idx].label).join(' ');

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`DFS Visit: ${visitedStr || '(none)'}`, 20, 292);

      ctx.fillStyle = '#7c3aed';
      ctx.font = '11px monospace';
      ctx.fillText(`Stack: [ ${stackStr} ]`, 20, 306);
    } else if (state.opMode === 2) {
      const visitedStr = state.visitArray.map((idx: number) => state.vertexList[idx].label).join(' ');
      const queueStr = state.theQueue.map((idx: number) => state.vertexList[idx].label).join(' ');

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`BFS Visit: ${visitedStr || '(none)'}`, 20, 292);

      ctx.fillStyle = '#0284c7';
      ctx.font = '11px monospace';
      ctx.fillText(`Queue: [ ${queueStr} ]`, 20, 306);
    } else if (state.opMode === 3) {
      const edgesStr = state.treeEdges
        .map(([u, v]) => `${state.vertexList[u].label}${state.vertexList[v].label}`)
        .join(' ');

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Spanning Tree Edges: ${edgesStr || '(none)'}`, 20, 292);

      ctx.fillStyle = '#1e293b';
      ctx.font = '11px monospace';
      ctx.fillText(`Total Edges = ${state.treeEdges.length} (Vertices = ${state.nVerts})`, 20, 306);
    } else {
      ctx.fillStyle = '#475569';
      ctx.font = '11px sans-serif';
      ctx.fillText(
        `Vertices: ${state.nVerts}/${state.MAX_VERTS} | Press DFS, BFS, or Tree to explore`,
        20,
        297
      );
    }
  }, [state, classicTheme]);

  return (
    <div className="flex flex-col items-center select-none">
      <canvas
        ref={canvasRef}
        style={{ width: '440px', height: '320px' }}
        className="cursor-crosshair rounded-lg shadow-sm"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onDoubleClick={onDoubleClick}
      />
    </div>
  );
};
