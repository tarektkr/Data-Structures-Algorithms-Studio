// Robert Lafore's QuickSort1 Logic Engine (Chapter 8: Advanced Sorting)
// Reverse-engineered from QuickSort1_918cb9a4.class, personGroup_9b4bb0ef.class, person_9577cde9.class, stack_35aefc25.class

export interface PersonItem {
  height: number; // 5 to 200
  color: string; // Pastel/distinct color
}

export interface QuickSort1State {
  appletWidth: number; // 370
  appletHeight: number; // 320
  maxHeight: number; // 200
  topMargin: number; // 30
  leftMargin: number; // 10
  barLeftMargin: number; // 35 for 10 bars, 10 for 100 bars
  textHeight: number; // 13
  aSize: number; // 10 or 100
  theArray: PersonItem[];
  barWidth: number; // 18 (for 10) or 2 (for 100)
  barSeparation: number; // 7 (for 10) or 1 (for 100)
  doneFlag: boolean;
  codePart: number; // 1 to 8
  comps: number;
  swaps: number;
  initOrder: number; // 1: Random, 2: Inverse
  left: number;
  right: number;
  pivot: number; // pivot value
  leftScan: number;
  rightScan: number;
  phonyLeft: number;
  leftStack: number[]; // Explicit call stack for left partition boundaries
  rightStack: number[]; // Explicit call stack for right partition boundaries
  note: string;
  drawMode: number;
  isRunning: boolean;
  speedMs: number;
}

export function createInitialQuickSort1State(
  aSize: number = 10,
  initOrder: number = 1
): QuickSort1State {
  const barWidth = aSize === 100 ? 2 : 18;
  const barSeparation = aSize === 100 ? 1 : 7;
  const barLeftMargin = aSize === 100 ? 10 : 35;

  const theArray: PersonItem[] = [];

  if (initOrder === 1) {
    // Random order with distinct pastel colors
    for (let i = 0; i < aSize; i++) {
      const height = Math.floor(Math.random() * 195) + 5;
      const r = Math.floor(Math.random() * 200) + 55;
      const g = Math.floor(Math.random() * 200) + 55;
      const b = Math.floor(Math.random() * 200) + 55;
      theArray.push({
        height,
        color: `rgb(${r}, ${g}, ${b})`,
      });
    }
  } else {
    // Inverse order (strictly decreasing)
    for (let i = 0; i < aSize; i++) {
      const height = 195 - Math.floor((195 * i) / aSize);
      const r = Math.min(255, 255 - Math.floor((150 * i) / aSize));
      const g = Math.min(255, 100 + Math.floor((100 * i) / aSize));
      const b = Math.min(255, 50 + Math.floor((180 * i) / aSize));
      theArray.push({
        height,
        color: `rgb(${r}, ${g}, ${b})`,
      });
    }
  }

  const left = 0;
  const right = aSize - 1;
  const pivot = theArray[right].height;
  const leftScan = left;
  const rightScan = right - 1;

  return {
    appletWidth: 370,
    appletHeight: 320,
    maxHeight: 200,
    topMargin: 30,
    leftMargin: 10,
    barLeftMargin,
    textHeight: 13,
    aSize,
    theArray,
    barWidth,
    barSeparation,
    doneFlag: false,
    codePart: 1,
    comps: 0,
    swaps: 0,
    initOrder,
    left,
    right,
    pivot,
    leftScan,
    rightScan,
    phonyLeft: 0,
    leftStack: [],
    rightStack: [],
    note: 'Press any button',
    drawMode: 2,
    isRunning: false,
    speedMs: 250,
  };
}

export function handleQuickSort1New(state: QuickSort1State): QuickSort1State {
  // Toggles between random and inverse order
  const newOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialQuickSort1State(state.aSize, newOrder);
  next.speedMs = state.speedMs;
  return next;
}

export function handleQuickSort1Size(state: QuickSort1State): QuickSort1State {
  // Toggles between 10 bars and 100 bars
  const newSize = state.aSize === 10 ? 100 : 10;
  const next = createInitialQuickSort1State(newSize, state.initOrder);
  next.speedMs = state.speedMs;
  return next;
}

// Exact 8-state machine reverse-engineered from personGroup.sortStep()
export function stepQuickSort1(state: QuickSort1State): {
  nextState: QuickSort1State;
  finished: boolean;
} {
  if (state.doneFlag) {
    return {
      nextState: {
        ...state,
        note: 'Sort is complete',
        isRunning: false,
      },
      finished: true,
    };
  }

  const arr = state.theArray.map((p) => ({ ...p }));
  const lStack = [...state.leftStack];
  const rStack = [...state.rightStack];
  let {
    codePart,
    left,
    right,
    pivot,
    leftScan,
    rightScan,
    comps,
    swaps,
    note,
  } = state;
  let doneFlag: boolean = state.doneFlag;

  switch (codePart) {
    case 1: {
      // Check if partition has 1 or fewer elements: right - left <= 0
      if (right - left <= 0) {
        note = `Entering quickSort(); partition (${left}-${right}) too small to sort`;
        codePart = 7;
      } else {
        pivot = arr[right].height;
        note = `Entering quickSort(); will partition (${left}-${right})`;
        codePart = 2;
      }
      break;
    }

    case 2: {
      leftScan = left - 1;
      rightScan = right;
      note = `leftScan=${leftScan}, rightScan=${rightScan}; will scan`;
      codePart = 3;
      break;
    }

    case 3: {
      // Find element >= pivot from left
      while (true) {
        leftScan++;
        comps++;
        if (leftScan >= right || arr[leftScan].height >= pivot) {
          break;
        }
      }

      // Find element <= pivot from right
      while (true) {
        rightScan--;
        if (rightScan <= left) {
          break;
        }
        comps++;
        if (arr[rightScan].height <= pivot) {
          break;
        }
      }

      if (leftScan >= rightScan) {
        note = 'Scans have met; will swap pivot and leftScan';
        codePart = 5;
      } else {
        note = 'Will swap leftScan and rightScan';
        codePart = 4;
      }
      break;
    }

    case 4: {
      // Swap leftScan and rightScan
      const temp = arr[leftScan];
      arr[leftScan] = arr[rightScan];
      arr[rightScan] = temp;
      swaps++;
      note = 'Will scan again';
      codePart = 3;
      break;
    }

    case 5: {
      // Swap pivot (at right) and leftScan
      const temp = arr[leftScan];
      arr[leftScan] = arr[right];
      arr[right] = temp;
      swaps++;
      note = `Array partitioned: left (${left}-${leftScan - 1}), right (${leftScan + 1}-${right})`;
      codePart = 6;
      break;
    }

    case 6: {
      // Push right partition onto stack for later processing
      lStack.push(leftScan + 1);
      rStack.push(right);
      note = `Will sort left partition (${left}-${leftScan - 1})`;
      right = leftScan - 1;
      leftScan = -1;
      rightScan = -1;
      pivot = -1;
      codePart = 1;
      break;
    }

    case 7: {
      // Check if recursion stack is empty
      if (lStack.length === 0) {
        doneFlag = true;
        note = 'Sort is complete';
        codePart = 8;
      } else {
        left = lStack.pop()!;
        right = rStack.pop()!;
        leftScan = -1;
        rightScan = -1;
        pivot = -1;
        note = `Will sort right partition (${left}-${right})`;
        codePart = 1;
      }
      break;
    }

    case 8:
    default: {
      note = 'Press any button';
      return {
        nextState: {
          ...state,
          note: 'Sort is complete - Press any button',
          codePart: 8,
          doneFlag: true,
          isRunning: false,
        },
        finished: true,
      };
    }
  }

  return {
    nextState: {
      ...state,
      theArray: arr,
      leftStack: lStack,
      rightStack: rStack,
      left,
      right,
      pivot,
      leftScan,
      rightScan,
      comps,
      swaps,
      codePart,
      note,
      doneFlag,
      isRunning: doneFlag ? false : state.isRunning,
    },
    finished: doneFlag,
  };
}
