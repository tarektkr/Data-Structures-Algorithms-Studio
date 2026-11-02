import React, { useRef, useEffect } from 'react';
import { TreeState } from '../utils/treeLogic';

interface TreeCanvasProps {
  state: TreeState;
  classicTheme?: boolean;
  onSelectNode?: (key: number) => void;
}

const CANVAS_WIDTH = 440;
const CANVAS_HEIGHT = 320;

// Coordinate helper for a node index 0..30
export function getNodeCoordinates(index: number) {
  const leftMargin = 10;
  const topMargin = 70;
  const levelSeparation = 40;
  const horizSeparation = 26;

  let level = 0;
  let column = 15;
  let parentIndex = -1;

  if (index === 0) {
    level = 0;
    column = 15;
    parentIndex = -1;
  } else if (index >= 1 && index <= 2) {
    level = 1;
    column = 7 + (index - 1) * 16;
    parentIndex = 0;
  } else if (index >= 3 && index <= 6) {
    level = 2;
    column = 3 + (index - 3) * 8;
    parentIndex = Math.floor((index - 1) / 2);
  } else if (index >= 7 && index <= 14) {
    level = 3;
    column = 1 + (index - 7) * 4;
    parentIndex = Math.floor((index - 1) / 2);
  } else if (index >= 15 && index <= 30) {
    level = 4;
    column = (index - 15) * 2;
    parentIndex = Math.floor((index - 1) / 2);
  }

  const x = leftMargin + (column * horizSeparation) / 2;
  const y = topMargin + level * levelSeparation;

  return { x, y, level, column, parentIndex };
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({
  state,
  classicTheme = true,
  onSelectNode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // 1. Background
    if (classicTheme) {
      ctx.fillStyle = '#C0C0C0'; // Authentic Java AWT 1.1 gray background
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e293b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Note Box (Top)
    const noteBoxX = 10;
    const noteBoxY = 40;
    const noteBoxW = 420;
    const noteBoxH = 24;

    if (classicTheme) {
      // 3D Inset Panel
      ctx.fillStyle = '#D4D0C8';
      ctx.fillRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(state.note, noteBoxX + 8, noteBoxY + noteBoxH / 2);
    } else {
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
      ctx.fillRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(noteBoxX, noteBoxY, noteBoxW, noteBoxH);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`💬 ${state.note}`, noteBoxX + 8, noteBoxY + noteBoxH / 2);
    }

    // 3. Draw Connecting Lines (Tree Edges)
    ctx.lineWidth = classicTheme ? 1 : 1.5;
    ctx.strokeStyle = classicTheme ? '#000000' : 'rgba(148, 163, 184, 0.5)';

    for (let i = 1; i < 31; i++) {
      const node = state.treeArray[i];
      if (!node) continue;

      const pIdx = Math.floor((i - 1) / 2);
      if (state.treeArray[pIdx] !== null) {
        const childCoords = getNodeCoordinates(i);
        const parentCoords = getNodeCoordinates(pIdx);

        ctx.beginPath();
        ctx.moveTo(parentCoords.x + 10, parentCoords.y + 10);
        ctx.lineTo(childCoords.x + 10, childCoords.y + 10);
        ctx.stroke();
      }
    }

    // 4. Draw Nodes
    for (let i = 0; i < 31; i++) {
      const node = state.treeArray[i];
      if (!node) continue;

      const { x, y } = getNodeCoordinates(i);
      const isCurNode = i === state.curIn;
      const isSuccessor = i === state.successor;

      // Draw Node Circle
      ctx.beginPath();
      ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2);

      if (classicTheme) {
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = isCurNode ? '#FF0000' : isSuccessor ? '#800080' : '#000000';
        ctx.lineWidth = isCurNode || isSuccessor ? 2 : 1;
        ctx.stroke();
      } else {
        // Modern theme: glowing gradient
        const nodeGrad = ctx.createRadialGradient(x + 8, y + 8, 2, x + 10, y + 10, 10);
        if (isCurNode) {
          nodeGrad.addColorStop(0, '#fca5a5');
          nodeGrad.addColorStop(1, '#ef4444');
        } else if (isSuccessor) {
          nodeGrad.addColorStop(0, '#d8b4fe');
          nodeGrad.addColorStop(1, '#a855f7');
        } else {
          nodeGrad.addColorStop(0, '#e0f2fe');
          nodeGrad.addColorStop(1, '#0284c7');
        }
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        ctx.strokeStyle = isCurNode ? '#f87171' : isSuccessor ? '#c084fc' : '#38bdf8';
        ctx.lineWidth = isCurNode || isSuccessor ? 2 : 1.5;
        ctx.stroke();
      }

      // Draw Key Text
      ctx.fillStyle = classicTheme ? '#000000' : '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.height.toString(), x + 10, y + 10);
    }

    // 5. Draw Red Arrow (`drawArrow` above current active node)
    if (state.curIn >= 0 && state.curIn < 31 && state.treeArray[state.curIn] !== null) {
      const { x, y } = getNodeCoordinates(state.curIn);
      const arrowTipX = x + 10;
      const arrowTipY = y - 4;
      const arrowLength = 16;
      const arrowColor = '#FF0000';

      ctx.strokeStyle = arrowColor;
      ctx.fillStyle = arrowColor;
      ctx.lineWidth = 2;

      // Vertical stem
      ctx.beginPath();
      ctx.moveTo(arrowTipX, arrowTipY - arrowLength);
      ctx.lineTo(arrowTipX, arrowTipY);
      ctx.stroke();

      // Arrowhead pointing DOWN to the node
      ctx.beginPath();
      ctx.moveTo(arrowTipX, arrowTipY);
      ctx.lineTo(arrowTipX - 4, arrowTipY - 6);
      ctx.lineTo(arrowTipX + 4, arrowTipY - 6);
      ctx.closePath();
      ctx.fill();
    }

    // 6. Visit Box (Bottom)
    const visitBoxX = 10;
    const visitBoxY = 280;
    const visitBoxW = 420;
    const visitBoxH = 26;

    if (classicTheme) {
      ctx.fillStyle = '#D4D0C8';
      ctx.fillRect(visitBoxX, visitBoxY, visitBoxW, visitBoxH);
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      ctx.strokeRect(visitBoxX, visitBoxY, visitBoxW, visitBoxH);

      ctx.fillStyle = '#000000';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const visitStr = state.visitArray.length > 0 ? state.visitArray.join('  ') : '(empty)';
      ctx.fillText(visitStr, visitBoxX + 8, visitBoxY + visitBoxH / 2);
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(visitBoxX, visitBoxY, visitBoxW, visitBoxH);
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(visitBoxX, visitBoxY, visitBoxW, visitBoxH);

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const visitStr =
        state.visitArray.length > 0
          ? `Traversed: ${state.visitArray.join('  ')}`
          : 'Traversed: (empty)';
      ctx.fillText(visitStr, visitBoxX + 8, visitBoxY + visitBoxH / 2);
    }
  }, [state, classicTheme]);

  // Click handler to select node and autofill key
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSelectNode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = 0; i < 31; i++) {
      const node = state.treeArray[i];
      if (!node) continue;

      const { x, y } = getNodeCoordinates(i);
      const dx = clickX - (x + 10);
      const dy = clickY - (y + 10);
      if (dx * dx + dy * dy <= 12 * 12) {
        onSelectNode(node.height);
        break;
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        className="rounded shadow-inner select-none cursor-pointer"
        onClick={handleCanvasClick}
        title="انقر على أي عقدة لنسخ قيمتها إلى مربع الإدخال"
      />
    </div>
  );
};
