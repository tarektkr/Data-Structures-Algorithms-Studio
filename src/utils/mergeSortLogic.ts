// Robert Lafore's MergeSort Logic Engine (Chapter 8: Advanced Sorting - Divide & Conquer)
// Reverse-engineered from MergeSort_10fe2f08.class, personGroup_6d26aa9c.class, person_7693fac1.class, params_32dbe5bb.class, stack_591abdf8.class

export interface PersonItem {
  height: number; // 5 to 200
  color: string; // Pastel/distinct color
}

export interface ParamsFrame {
  lower: number;
  upper: number;
  mid: number;
  codePart: number; // Return address state
}

export interface MergeSortState {
  appletWidth: number; // 370
  appletHeight: number; // 320
  maxHeight: number; // 200
  topMargin: number; // 30
  leftMargin: number; // 10
  barLeftMargin: number; // 35 (12 bars) or 10 (100 bars)
  textHeight: number; // 13
  aSize: number; // 12 or 100
  theArray: PersonItem[];
  workSpace: PersonItem[];
  barWidth: number; // 18 (12 bars) or 2 (100 bars)
  barSeparation: number; // 7 (12 bars) or 1 (100 bars)
  doneFlag: boolean;
  codePart: number; // 1 to 10
  oldCodePart: number;
  drawMode: number;
  comps: number;
  copies: number;
  initOrder: number; // 1: Random, 2: Inverse
  note: string;
  theStack: ParamsFrame[];
  lower: number;
  upper: number;
  mid: number;
  lowPtrM: number;
  highPtrM: number;
  upperBoundM: number;
  lowerBoundM: number;
  jM: number;
  midM: number;
  nM: number;
  ptrIndex: number;
  mergingFlag: boolean;
  isRunning: boolean;
  speedMs: number;
}

export function createInitialMergeSortState(
  aSize: number = 12,
  initOrder: number = 1
): MergeSortState {
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

  const workSpace: PersonItem[] = new Array(aSize);

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
    workSpace,
    barWidth,
    barSeparation,
    doneFlag: false,
    codePart: 1,
    oldCodePart: 1,
    drawMode: 2,
    comps: 0,
    copies: 0,
    initOrder,
    note: 'Press any button',
    theStack: [],
    lower: 0,
    upper: aSize - 1,
    mid: 0,
    lowPtrM: 0,
    highPtrM: 0,
    upperBoundM: 0,
    lowerBoundM: 0,
    jM: 0,
    midM: 0,
    nM: 0,
    ptrIndex: -1,
    mergingFlag: false,
    isRunning: false,
    speedMs: 250,
  };
}

export function handleMergeSortNew(state: MergeSortState): MergeSortState {
  const newOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialMergeSortState(state.aSize, newOrder);
  next.speedMs = state.speedMs;
  return next;
}

export function handleMergeSortSize(state: MergeSortState): MergeSortState {
  const newSize = state.aSize === 12 ? 100 : 12;
  const next = createInitialMergeSortState(newSize, state.initOrder);
  next.speedMs = state.speedMs;
  return next;
}

// 10-state machine reverse-engineered from personGroup_6d26aa9c.class sortStep()
export function stepMergeSort(state: MergeSortState): {
  nextState: MergeSortState;
  finished: boolean;
} {
  if (state.doneFlag) {
    return {
      nextState: {
        ...state,
        note: 'Sort is complete; Press New or Size',
        isRunning: false,
      },
      finished: true,
    };
  }

  const arr = state.theArray.map((p) => ({ ...p }));
  const ws = state.workSpace.map((p) => (p ? { ...p } : undefined)) as PersonItem[];
  const stack: ParamsFrame[] = state.theStack.map((f) => ({ ...f }));

  let doneFlag: boolean = state.doneFlag;
  let ptrIndex: number = state.ptrIndex;

  let {
    codePart,
    oldCodePart,
    comps,
    copies,
    note,
    lower,
    upper,
    mid,
    lowPtrM,
    highPtrM,
    upperBoundM,
    lowerBoundM,
    jM,
    midM,
    nM,
    mergingFlag,
  } = state;

  switch (codePart) {
    case 1: {
      // Initial call to mergeSort
      const initialFrame: ParamsFrame = {
        lower: 0,
        upper: state.aSize - 1,
        mid: 0,
        codePart: 6,
      };
      stack.push(initialFrame);
      note = 'Initial call to mergeSort';
      oldCodePart = codePart;
      codePart = 2;
      break;
    }

    case 2: {
      // Entering mergeSort: lower - upper
      const topFrame = stack[stack.length - 1];
      lower = topFrame.lower;
      upper = topFrame.upper;
      note = `Entering mergeSort: ${lower}-${upper}`;
      oldCodePart = codePart;

      if (lower === upper) {
        // Base case: 1 element is always sorted
        codePart = 7;
      } else {
        codePart = 4;
      }
      break;
    }

    case 4: {
      // Will sort lower half
      mid = Math.floor((lower + upper) / 2);
      note = `Will sort lower half: ${lower}-${mid}`;
      const frameLower: ParamsFrame = {
        lower,
        upper: mid,
        mid,
        codePart: 5, // Return here after lower half is sorted
      };
      stack.push(frameLower);
      oldCodePart = codePart;
      codePart = 2; // Recurse on lower half
      break;
    }

    case 5: {
      // Returned from lower half; will sort upper half
      const topFrame = stack[stack.length - 1];
      lower = topFrame.lower;
      upper = topFrame.upper;
      mid = Math.floor((lower + upper) / 2);
      note = `Will sort upper half: ${mid + 1}-${upper}`;
      const frameUpper: ParamsFrame = {
        lower: mid + 1,
        upper,
        mid,
        codePart: 6, // Return here after upper half is sorted
      };
      stack.push(frameUpper);
      oldCodePart = codePart;
      codePart = 2; // Recurse on upper half
      break;
    }

    case 6: {
      // Both halves sorted; will merge ranges
      const topFrame = stack[stack.length - 1];
      lower = topFrame.lower;
      upper = topFrame.upper;
      mid = Math.floor((lower + upper) / 2);
      note = 'Will merge ranges';
      lowPtrM = lower;
      highPtrM = mid + 1;
      upperBoundM = upper;
      oldCodePart = codePart;
      codePart = 9;
      break;
    }

    case 9: {
      // Merge ranges into workspace
      jM = 0;
      lowerBoundM = lowPtrM;
      midM = highPtrM - 1;
      nM = upperBoundM - lowerBoundM + 1;
      note = `Merged ${lowPtrM}-${midM} and ${highPtrM}-${upperBoundM} into workspace`;

      // Perform the merge comparisons and copies
      while (lowPtrM <= midM && highPtrM <= upperBoundM) {
        comps++;
        copies++;
        if (arr[lowPtrM].height < arr[highPtrM].height) {
          ws[jM++] = arr[lowPtrM++];
        } else {
          ws[jM++] = arr[highPtrM++];
        }
      }

      while (lowPtrM <= midM) {
        copies++;
        ws[jM++] = arr[lowPtrM++];
      }

      while (highPtrM <= upperBoundM) {
        copies++;
        ws[jM++] = arr[highPtrM++];
      }

      mergingFlag = false;
      jM = 0;
      oldCodePart = codePart;
      codePart = 10;
      break;
    }

    case 10: {
      // Copy workspace back into theArray step by step
      oldCodePart = codePart;
      if (jM < nM) {
        copies++;
        arr[lowerBoundM + jM] = ws[jM];
        ptrIndex = lowerBoundM + jM;
        note = `Copied workspace into ${lowerBoundM + jM}`;
        jM++;
        codePart = 10;
      } else {
        ptrIndex = -1;
        note = 'Merge completed';
        codePart = 7;
      }
      break;
    }

    case 7: {
      // Exiting mergeSort: return from function
      ptrIndex = -1;
      oldCodePart = codePart;
      const popped = stack.pop();
      const retCode = popped ? popped.codePart : 8;

      if (stack.length === 0) {
        note = 'Exciting mergeSort; sort is complete';
        doneFlag = true;
        codePart = 8;
      } else {
        const topFrame = stack[stack.length - 1];
        lower = topFrame.lower;
        upper = topFrame.upper;
        note = `Exiting mergeSort: ${lower}-${upper}`;
        codePart = retCode;
      }
      break;
    }

    case 8: {
      ptrIndex = -1;
      doneFlag = true;
      note = 'Sort is complete; Press New or Size';
      break;
    }

    default: {
      codePart = 1;
      break;
    }
  }

  return {
    nextState: {
      ...state,
      theArray: arr,
      workSpace: ws,
      theStack: stack,
      codePart,
      oldCodePart,
      comps,
      copies,
      note,
      lower,
      upper,
      mid,
      lowPtrM,
      highPtrM,
      upperBoundM,
      lowerBoundM,
      jM,
      midM,
      nM,
      ptrIndex,
      mergingFlag,
      doneFlag,
      isRunning: doneFlag ? false : state.isRunning,
    },
    finished: doneFlag,
  };
}
