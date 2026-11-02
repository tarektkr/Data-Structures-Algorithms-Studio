import React, { useRef, useEffect } from 'react';
import { TowersState } from '../utils/towersLogic';

interface TowersCanvasProps {
  state: TowersState;
  classicTheme?: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const TowersCanvas: React.FC<TowersCanvasProps> = ({
  state,
  classicTheme = true,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 335;
  const GROUND_LEVEL = 300;
  const TOWER_WIDTH = 15;
  const TOWER_TOP = 80;
  const TOWER_HEIGHT = 220; // 300 - 80
  const DISK_HEIGHT = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    // 1. Applet background
    if (classicTheme) {
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Note / message box at top
    // AWT bytecode: fillRect(10, 45, 420, 25); drawString(note, 16, 64)
    if (classicTheme) {
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(10, 45, 420, 25);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(state.note, 16, 62);
    } else {
      // Modern sleek note card
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(10, 40, 420, 32, 6);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(state.note, 20, 60);
    }

    // 3. Ground base plate
    if (classicTheme) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(15, GROUND_LEVEL, 410, 6);
    } else {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(15, GROUND_LEVEL, 410, 8, 4);
      ctx.fill();
    }

    // 4. Draw the three towers
    state.towers.forEach((tower) => {
      const poleX = tower.xCtr - Math.floor(TOWER_WIDTH / 2);

      // Tower vertical post
      if (classicTheme) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(poleX, TOWER_TOP, TOWER_WIDTH, TOWER_HEIGHT);
      } else {
        // Modern wooden post with rounded top
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(poleX, TOWER_TOP, TOWER_WIDTH, TOWER_HEIGHT, [4, 4, 0, 0]);
        ctx.fill();
      }

      // Tower letter label (A, B, C)
      ctx.fillStyle = classicTheme ? '#000000' : '#475569';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tower.label, tower.xCtr, GROUND_LEVEL + 22);

      // Draw disks on this tower
      tower.disks.forEach((disk, diskIndex) => {
        // Skip rendering if this disk is currently being dragged
        if (state.isDragging && state.draggedDisk === disk) return;

        const diskY = GROUND_LEVEL - (diskIndex + 1) * DISK_HEIGHT;
        drawSingleDisk(ctx, tower.xCtr, diskY, disk, classicTheme);
      });
    });

    // 5. Draw dragged disk following mouse cursor
    if (state.isDragging && state.draggedDisk) {
      drawSingleDisk(ctx, state.dragX, state.dragY - 10, state.draggedDisk, classicTheme, true);
    }

    // Reset text alignment
    ctx.textAlign = 'start';
  }, [state, classicTheme]);

  // Helper function to draw a capsule-shaped disk
  function drawSingleDisk(
    ctx: CanvasRenderingContext2D,
    xCtr: number,
    topY: number,
    disk: { width: number; height: number; color: string; label: string },
    isClassic: boolean,
    isHover: boolean = false
  ) {
    const leftX = xCtr - Math.floor(disk.width / 2);
    const radius = Math.floor(disk.height / 2);

    if (isClassic) {
      // Robert Lafore exact AWT drawing:
      // fillRect center + two fillOval endpoints + drawRect & drawOval borders
      ctx.save();
      if (isHover) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
      }

      // Outline in black
      ctx.fillStyle = '#000000';
      ctx.fillRect(leftX, topY, disk.width, disk.height);
      ctx.beginPath();
      ctx.arc(leftX, topY + radius, radius, Math.PI / 2, (Math.PI * 3) / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(leftX + disk.width, topY + radius, radius, (Math.PI * 3) / 2, Math.PI / 2);
      ctx.fill();

      // Colored body
      ctx.fillStyle = disk.color;
      ctx.fillRect(leftX, topY + 1, disk.width, disk.height - 2);
      ctx.beginPath();
      ctx.arc(leftX, topY + radius, radius - 1, Math.PI / 2, (Math.PI * 3) / 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(leftX + disk.width, topY + radius, radius - 1, (Math.PI * 3) / 2, Math.PI / 2);
      ctx.fill();

      // Label text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(disk.label, xCtr, topY + 14);

      ctx.restore();
    } else {
      // Modern smooth pill with gradient & subtle 3D shine
      ctx.save();
      if (isHover) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
      }

      ctx.beginPath();
      ctx.roundRect(leftX - radius, topY, disk.width + radius * 2, disk.height, radius);
      ctx.fillStyle = disk.color;
      ctx.fill();

      // Border
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Subtle top highlight reflection
      ctx.beginPath();
      ctx.roundRect(leftX - radius + 3, topY + 2, disk.width + radius * 2 - 6, 4, 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      // Center number label
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(disk.label, xCtr, topY + 14);

      ctx.restore();
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      className="rounded-lg shadow-inner cursor-grab active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
};
