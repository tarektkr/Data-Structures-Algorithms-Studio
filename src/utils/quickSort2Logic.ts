// Robert Lafore's QuickSort2 Logic Engine (Chapter 8: Advanced Sorting - Median-of-Three Partitioning)
// Reverse-engineered from QuickSort2_3a0666a6.class, personGroup_cc1bc240.class, person_e98abcde.class, stack_474d5a6b.class

export interface PersonItem {
  height: number; // 5 to 200
  color: string; // Pastel/distinct color
}

export interface QuickSort2State {
  appletWidth: number; // 370
  appletHeight: number; // 320
  maxHeight: number; // 200
  topMargin: number; // 30
  leftMargin: number; // 10
  barLeftMargin: number; // 35 for 10 bars, 10 for 100 bars
  textHeight: number; // 13
  aSize: number; // 10 or 100
  theArray: PersonItem[];
  barWidth: number; // 16 (for 10) or 2 (for 100)
  barSeparation: number; // 20 (for 10) or 1 (for 100)
  doneFlag: boolean;
  codePart: number; // 0 to 8, 15
  comps: number;
  swaps: number;
  initOrder: number; // 1: Random, 2: Inverse
  left: number;
  right: number;
  center: number;
  size: number;
  pivot: number; // index of pivot
  leftScan: number;
  rightScan: number;
  leftStack: number[]; // Explicit call stack for left partition boundaries
  rightStack: number[]; // Explicit call stack for right partition boundaries
  note: string;
  drawMode: number;
  isRunning: boolean;
  speedMs: number;
}

export function createInitialQuickSort2State(
  aSize: number = 10,
  initOrder: number = 1
): QuickSort2State {
  const barWidth = aSize === 100 ? 2 : 16;
  const barSeparation = aSize === 100 ? 1 : 20;
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
  const center = Math.floor((left + right) / 2);
  const size = right - left + 1;
  const pivot = center;
  const leftScan = left;
  const rightScan = right;

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
    codePart: 0,
    comps: 0,
    swaps: 0,
    initOrder,
    left,
    right,
    center,
    size,
    pivot,
    leftScan,
    rightScan,
    leftStack: [],
    rightStack: [],
    note: 'Press any button',
    drawMode: 2,
    isRunning: false,
    speedMs: 250,
  };
}

export function handleQuickSort2New(state: QuickSort2State): QuickSort2State {
  // Toggles between random and inverse order
  const newOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialQuickSort2State(state.aSize, newOrder);
  next.speedMs = state.speedMs;
  return next;
}

export function handleQuickSort2Size(state: QuickSort2State): QuickSort2State {
  // Toggles between 10 bars and 100 bars
  const newSize = state.aSize === 10 ? 100 : 10;
  const next = createInitialQuickSort2State(newSize, state.initOrder);
  next.speedMs = state.speedMs;
  return next;
}

// Step logic faithfully reverse-engineered from personGroup_cc1bc240.class
export function stepQuickSort2(state: QuickSort2State): {
  nextState: QuickSort2State;
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
    center,
    size,
    pivot,
    leftScan,
    rightScan,
    comps,
    swaps,
    note,
  } = state;
  let doneFlag: boolean = state.doneFlag;

  const swap = (i1: number, i2: number) => {
    const temp = arr[i1];
    arr[i1] = arr[i2];
    arr[i2] = temp;
    swaps++;
  };

  switch (codePart) {
    case 0: {
      // Entry point into quickSort
      size = right - left + 1;
      if (size <= 1) {
        note = `Array of 1 (${left}-${right}) always sorted`;
        codePart = 1;
      } else if (size === 2) {
        note = `Will sort 2-element array (${left}-${right})`;
        codePart = 1;
      } else {
        // size >= 3: compute median-of-three center
        center = Math.floor((left + right) / 2);
        note = `Will sort left, center, right (${left}-${center}-${right})`;
        codePart = 1;
      }
      break;
    }

    case 1: {
      if (size <= 1) {
        note = 'No action necessary';
        codePart = 7;
      } else if (size === 2) {
        comps++;
        if (arr[left].height > arr[right].height) {
          swap(left, right);
        }
        note = 'Done 2-element sort';
        codePart = 7;
      } else if (size === 3) {
        // Direct sort of 3 elements
        comps++;
        if (arr[left].height > arr[center].height) {
          swap(left, center);
        }
        comps++;
        if (arr[left].height > arr[right].height) {
          swap(left, right);
        }
        comps++;
        if (arr[center].height > arr[right].height) {
          swap(center, right);
        }
        note = 'Done left-center-right sort';
        codePart = 7;
      } else {
        // size > 3: Median-of-Three
        comps++;
        if (arr[left].height > arr[center].height) {
          swap(left, center);
        }
        comps++;
        if (arr[left].height > arr[right].height) {
          swap(left, right);
        }
        comps++;
        if (arr[center].height > arr[right].height) {
          swap(center, right);
        }
        pivot = center;
        note = `Will partition (${left + 1}-${right - 2}); pivot will be ${pivot}`;
        codePart = 15;
      }
      break;
    }

    case 15: {
      // Move pivot (median) to right - 1
      note = 'Will swap pivot and right-1';
      swap(center, right - 1);
      pivot = right - 1;
      leftScan = left;
      rightScan = right - 1;
      codePart = 2;
      break;
    }

    case 2: {
      note = `Will scan (${leftScan}-${rightScan})`;
      codePart = 3;
      break;
    }

    case 3: {
      // Median-of-Three scanning loop
      const pivotVal = arr[pivot].height;

      // Scan from left
      while (true) {
        leftScan++;
        comps++;
        if (leftScan >= right || arr[leftScan].height >= pivotVal) {
          break;
        }
      }

      // Scan from right
      while (true) {
        rightScan--;
        comps++;
        if (rightScan <= left || arr[rightScan].height <= pivotVal) {
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
      swap(leftScan, rightScan);
      note = 'Will scan again';
      codePart = 3;
      break;
    }

    case 5: {
      swap(leftScan, pivot);
      note = `Array partitioned: left (${left}-${leftScan - 1}), right (${leftScan + 1}-${right})`;
      codePart = 6;
      break;
    }

    case 6: {
      // Push right partition onto explicit stack
      lStack.push(leftScan + 1);
      rStack.push(right);

      // Setup left partition
      note = `Will sort left partition (${left}-${leftScan - 1})`;
      right = leftScan - 1;
      leftScan = left;
      rightScan = right;
      pivot = right;
      codePart = 0;
      break;
    }

    case 7: {
      // Pop from explicit stacks or complete
      if (lStack.length === 0) {
        doneFlag = true;
        note = 'Sort is complete';
        codePart = 8;
      } else {
        left = lStack.pop()!;
        right = rStack.pop()!;
        leftScan = left;
        rightScan = right;
        pivot = right;
        note = `Will call quickSort for right partition (${left}-${right})`;
        codePart = 0;
      }
      break;
    }

    case 8: {
      note = 'Press any button';
      break;
    }

    default: {
      codePart = 0;
      break;
    }
  }

  return {
    nextState: {
      ...state,
      theArray: arr,
      leftStack: lStack,
      rightStack: rStack,
      codePart,
      left,
      right,
      center,
      size,
      pivot,
      leftScan,
      rightScan,
      comps,
      swaps,
      doneFlag,
      note,
      isRunning: doneFlag ? false : state.isRunning,
    },
    finished: doneFlag,
  };
}
