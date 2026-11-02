// Robert Lafore's Towers of Hanoi Logic Engine (Chapter 6: Recursion)
// Reverse-engineered from gameGroup_37ac082e.class, tower_634e71e2.class, disk_ebac85be.class, params_b582fed3.class, stack_a94dd59c.class

export interface DiskItem {
  width: number;
  height: number;
  color: string;
  label: string; // "1", "2", ...
  diskNum: number; // 1 (smallest) to N (largest)
}

export interface TowerItem {
  xCtr: number; // 80 (A), 220 (B), 360 (C)
  label: 'A' | 'B' | 'C';
  disks: DiskItem[]; // bottom at 0, top at disks.length - 1
}

export interface CallParam {
  n: number;
  from: number; // 0, 1, 2
  to: number; // 0, 1, 2
  inter: number; // 0, 1, 2
  codePart: number; // return address: 5, 7, 8
}

export interface TowersState {
  appletWidth: number; // 440
  appletHeight: number; // 335
  nDisks: number; // 1 to 10, default 3
  towers: TowerItem[];
  theStack: CallParam[];
  currentParams: CallParam | null;
  note: string;
  opMode: 'idle' | 'running' | 'step';
  codePart: number; // 1..8
  isDoneFlag: boolean;
  diskMoved: boolean;
  from: number;
  to: number;
  inter: number;
  n: number;
  draggedDisk: DiskItem | null;
  dragSourceTower: number;
  dragX: number;
  dragY: number;
  isDragging: boolean;
  movesCount: number;
  minMoves: number; // 2^n - 1
  isRunning: boolean;
  speedMs: number;
}

// Robert Lafore distinct bright pastel colors for disks
export const DISK_COLORS: string[] = [
  '#FF3B30', // Red (Disk 1 - top)
  '#FF9500', // Orange (Disk 2)
  '#FFCC00', // Yellow (Disk 3)
  '#34C759', // Green (Disk 4)
  '#00C7BE', // Teal (Disk 5)
  '#30B0C7', // Cyan (Disk 6)
  '#007AFF', // Blue (Disk 7)
  '#5856D6', // Indigo (Disk 8)
  '#AF52DE', // Purple (Disk 9)
  '#FF2D55', // Pink (Disk 10)
];

export function createInitialTowersState(nDisks: number = 3): TowersState {
  const safeNDisks = Math.max(1, Math.min(10, nDisks));
  const maxDiskWidth = 120;
  const widthFactor = Math.floor(maxDiskWidth / safeNDisks);

  const initialDisks: DiskItem[] = [];
  // Disk 1 is smallest (top), Disk safeNDisks is largest (bottom)
  for (let i = safeNDisks; i >= 1; i--) {
    const w = maxDiskWidth - (safeNDisks - i) * widthFactor + 14;
    initialDisks.push({
      width: Math.min(130, Math.max(30, w)),
      height: 20,
      color: DISK_COLORS[(i - 1) % DISK_COLORS.length],
      label: i.toString(),
      diskNum: i,
    });
  }

  const towers: TowerItem[] = [
    { xCtr: 80, label: 'A', disks: initialDisks },
    { xCtr: 220, label: 'B', disks: [] },
    { xCtr: 360, label: 'C', disks: [] },
  ];

  return {
    appletWidth: 440,
    appletHeight: 335,
    nDisks: safeNDisks,
    towers,
    theStack: [],
    currentParams: null,
    note: 'Press any button, or drag disk to another post',
    opMode: 'idle',
    codePart: 1,
    isDoneFlag: false,
    diskMoved: false,
    from: 0,
    to: 2,
    inter: 1,
    n: safeNDisks,
    draggedDisk: null,
    dragSourceTower: -1,
    dragX: 0,
    dragY: 0,
    isDragging: false,
    movesCount: 0,
    minMoves: Math.pow(2, safeNDisks) - 1,
    isRunning: false,
    speedMs: 400,
  };
}

export function towerIndexToLabel(idx: number): string {
  if (idx === 0) return 'A';
  if (idx === 1) return 'B';
  return 'C';
}

export function closeToTower(x: number): number {
  if (Math.abs(x - 80) < 45) return 0;
  if (Math.abs(x - 220) < 45) return 1;
  if (Math.abs(x - 360) < 45) return 2;
  return -1;
}

// Mouse Drag interactions
export function startDrag(state: TowersState, x: number, y: number): TowersState {
  if (state.isRunning) return state;

  const towerIdx = closeToTower(x);
  if (towerIdx === -1) {
    return {
      ...state,
      note: 'Drag a colored DISK to a different black TOWER',
    };
  }

  const tower = state.towers[towerIdx];
  if (tower.disks.length === 0) {
    return {
      ...state,
      note: `NO DISKS on tower ${tower.label}`,
    };
  }

  // Top disk of tower can be dragged
  const topDisk = tower.disks[tower.disks.length - 1];

  return {
    ...state,
    draggedDisk: topDisk,
    dragSourceTower: towerIdx,
    dragX: x,
    dragY: y,
    isDragging: true,
    note: `Dragging from tower ${tower.label}`,
  };
}

export function updateDrag(state: TowersState, x: number, y: number): TowersState {
  if (!state.isDragging) return state;
  return {
    ...state,
    dragX: x,
    dragY: y,
  };
}

export function endDrag(state: TowersState, x: number, y: number): TowersState {
  if (!state.isDragging || !state.draggedDisk || state.dragSourceTower === -1) {
    return {
      ...state,
      isDragging: false,
      draggedDisk: null,
      dragSourceTower: -1,
    };
  }

  const sourceTowerIdx = state.dragSourceTower;
  const targetTowerIdx = closeToTower(x);

  if (targetTowerIdx === -1 || targetTowerIdx === sourceTowerIdx) {
    return {
      ...state,
      isDragging: false,
      draggedDisk: null,
      dragSourceTower: -1,
      note: 'Press any button, or drag disk to another post',
    };
  }

  const targetTower = state.towers[targetTowerIdx];
  const sourceTower = state.towers[sourceTowerIdx];
  const disk = state.draggedDisk;

  // Check Hanoi rule: disk placed on target must be smaller than target top disk
  if (targetTower.disks.length > 0) {
    const targetTop = targetTower.disks[targetTower.disks.length - 1];
    if (disk.width >= targetTop.width) {
      return {
        ...state,
        isDragging: false,
        draggedDisk: null,
        dragSourceTower: -1,
        note: 'Must put a SMALLER disk ON a LARGER disk',
      };
    }
  }

  // Move disk
  const newTowers = state.towers.map((t, idx) => {
    if (idx === sourceTowerIdx) {
      return {
        ...t,
        disks: t.disks.slice(0, t.disks.length - 1),
      };
    }
    if (idx === targetTowerIdx) {
      return {
        ...t,
        disks: [...t.disks, disk],
      };
    }
    return t;
  });

  const nextMoves = state.movesCount + 1;
  const isWon = newTowers[2].disks.length === state.nDisks;

  return {
    ...state,
    towers: newTowers,
    isDragging: false,
    draggedDisk: null,
    dragSourceTower: -1,
    movesCount: nextMoves,
    isDoneFlag: isWon,
    note: isWon
      ? 'Congratulations! You moved all the disks!'
      : `Moved disk ${disk.label} from ${sourceTower.label} to ${targetTower.label}`,
  };
}

// Step in the Robert Lafore recursive stack simulation
export function stepTowers(state: TowersState): { nextState: TowersState; finished: boolean } {
  if (state.isDoneFlag) {
    return {
      nextState: {
        ...state,
        note: 'Press New to reset',
        isRunning: false,
      },
      finished: true,
    };
  }

  const stack = [...state.theStack];
  let towers = state.towers.map((t) => ({ ...t, disks: [...t.disks] }));
  let { codePart, n, from, to, inter } = state;
  let diskMoved = false;
  let note = state.note;
  let isDoneFlag: boolean = state.isDoneFlag;
  let movesCount = state.movesCount;

  switch (codePart) {
    case 1: {
      // Check if starting condition met: all disks must begin on Tower A
      if (towers[1].disks.length !== 0 || towers[2].disks.length !== 0) {
        return {
          nextState: {
            ...state,
            note: 'You must begin with ALL DISKS ON TOWER A',
            codePart: 8,
            isRunning: false,
          },
          finished: true,
        };
      }
      note = 'Will shift all disks from A to C';
      // Push initial call onto simulated stack
      stack.push({
        n: state.nDisks,
        from: 0,
        to: 2,
        inter: 1,
        codePart: 8,
      });
      codePart = 2;
      break;
    }

    case 2: {
      // Peek current frame from stack
      const topFrame = stack[stack.length - 1];
      n = topFrame.n;
      from = topFrame.from;
      to = topFrame.to;
      inter = topFrame.inter;

      note = `Entering function with ${n} disks`;
      codePart = 3;
      break;
    }

    case 3: {
      if (n === 1) {
        // Base case: Move last disk directly from -> to
        const disk = towers[from].disks.pop();
        if (disk) {
          towers[to].disks.push(disk);
          diskMoved = true;
          movesCount++;
          note = `Moved last disk ${disk.label} from ${towerIndexToLabel(from)} to ${towerIndexToLabel(to)}`;
        }
        if (towers[2].disks.length === state.nDisks) {
          note = 'Congratulations! You moved all the disks!';
        }
        codePart = 7;
      } else {
        note = 'More than one disk, will continue';
        codePart = 4;
      }
      break;
    }

    case 4: {
      // First recursive call: move top (n-1) from 'from' to 'inter'
      note = `Will move top ${n - 1} disks from ${towerIndexToLabel(from)} to ${towerIndexToLabel(inter)}`;
      stack.push({
        n: n - 1,
        from,
        to: inter,
        inter: to,
        codePart: 5,
      });
      codePart = 2;
      break;
    }

    case 5: {
      // Move remaining disk n from 'from' to 'to'
      const disk = towers[from].disks.pop();
      if (disk) {
        towers[to].disks.push(disk);
        diskMoved = true;
        movesCount++;
        note = `Moved remaining disk ${n} from ${towerIndexToLabel(from)} to ${towerIndexToLabel(to)}`;
      }
      codePart = 6;
      break;
    }

    case 6: {
      // Second recursive call: move top (n-1) from 'inter' to 'to'
      note = `Will move top ${n - 1} disks from ${towerIndexToLabel(inter)} to ${towerIndexToLabel(to)}`;
      stack.push({
        n: n - 1,
        from: inter,
        to,
        inter: from,
        codePart: 7,
      });
      codePart = 2;
      break;
    }

    case 7: {
      // Return step: pop current frame and check return point
      const popped = stack.pop();
      const returnPart = popped ? popped.codePart : 8;

      if (stack.length === 0) {
        note = `Returning from function with ${n} disks`;
        codePart = 8;
      } else {
        const caller = stack[stack.length - 1];
        n = caller.n;
        from = caller.from;
        to = caller.to;
        inter = caller.inter;
        note = `Returning from function with ${n} disks`;
        codePart = returnPart;
      }
      break;
    }

    case 8:
    default: {
      note = 'Press New to reset';
      isDoneFlag = true;
      return {
        nextState: {
          ...state,
          note,
          isDoneFlag: true,
          isRunning: false,
          codePart: 8,
        },
        finished: true,
      };
    }
  }

  return {
    nextState: {
      ...state,
      towers,
      theStack: stack,
      codePart,
      n,
      from,
      to,
      inter,
      diskMoved,
      note,
      movesCount,
      isDoneFlag,
      currentParams: stack.length > 0 ? stack[stack.length - 1] : null,
    },
    finished: isDoneFlag,
  };
}
