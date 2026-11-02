import { PersonItem } from '../types/applet';
import { MAX_CELLS, MAX_KEY, createRandomColor } from './personGroupLogic';

export interface OrderedAppletState {
  totalCells: number;
  items: (PersonItem | null)[];
  nPersons: number;
  note: string;
  curIn: number;
  oldCurIn: number;
  lowerBound: number;
  upperBound: number;
  showRange: boolean;
  isLinear: boolean;
  isOKChange: boolean;
  currentOp: 'idle' | 'new' | 'fill' | 'ins' | 'find' | 'del';
  codePart: number; // For step-by-step phases
  insKey: number;
  findKey: number;
  delKey: number;
  insertPoint: number;
  shiftIndex: number;
  isRunning: boolean;
  speedMs: number;
  stepByStep: boolean;
}

export function createInitialOrderedState(): OrderedAppletState {
  const items: (PersonItem | null)[] = new Array(MAX_CELLS).fill(null);
  return {
    totalCells: 60,
    items,
    nPersons: 0,
    note: 'Press any button',
    curIn: -1,
    oldCurIn: -1,
    lowerBound: 0,
    upperBound: 0,
    showRange: false,
    isLinear: false, // Default is Binary Search in Ordered Array!
    isOKChange: true,
    currentOp: 'idle',
    codePart: 1,
    insKey: 0,
    findKey: 0,
    delKey: 0,
    insertPoint: 0,
    shiftIndex: 0,
    isRunning: false,
    speedMs: 250,
    stepByStep: false,
  };
}

export function handleOrderedNew(
  state: OrderedAppletState,
  isNumber: boolean,
  size: number
): OrderedAppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter size of array to create' };
  }
  if (size < 0 || size > MAX_CELLS) {
    return { ...state, note: `ERROR: use size between 0 and ${MAX_CELLS}` };
  }
  const items: (PersonItem | null)[] = new Array(MAX_CELLS).fill(null);
  return {
    ...state,
    totalCells: size,
    items,
    nPersons: 0,
    curIn: -1,
    oldCurIn: -1,
    showRange: false,
    isOKChange: true,
    currentOp: 'idle',
    isRunning: false,
    note: `New array created; total items = 0`,
  };
}

export function handleOrderedFill(
  state: OrderedAppletState,
  isNumber: boolean,
  count: number
): OrderedAppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter number of items to fill in' };
  }
  if (count < 0 || count > state.totalCells) {
    return { ...state, note: `ERROR: can't fill more than ${state.totalCells} cells` };
  }

  // Generate unique random values and sort them ascendingly
  const usedKeys = new Set<number>();
  while (usedKeys.size < count) {
    const val = Math.floor(Math.random() * (MAX_KEY + 1));
    usedKeys.add(val);
  }

  const sortedKeys = Array.from(usedKeys).sort((a, b) => a - b);
  const items: (PersonItem | null)[] = new Array(MAX_CELLS).fill(null);

  for (let i = 0; i < count; i++) {
    items[i] = {
      id: `ord-item-${i}-${Date.now()}-${Math.random()}`,
      height: sortedKeys[i],
      color: createRandomColor(),
    };
  }

  return {
    ...state,
    items,
    nPersons: count,
    curIn: -1,
    oldCurIn: -1,
    showRange: false,
    isOKChange: false,
    currentOp: 'idle',
    isRunning: false,
    note: `Fill completed; total items = ${count}`,
  };
}

export function startOrderedInsert(
  state: OrderedAppletState,
  isNumber: boolean,
  key: number
): OrderedAppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to insert' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `CAN'T INSERT: need key between 0 and ${MAX_KEY}` };
  }
  if (state.nPersons >= state.totalCells) {
    return { ...state, note: "CAN'T INSERT: array is full" };
  }

  // Find insert point in ascending array
  let insertPt = 0;
  for (let i = 0; i < state.nPersons; i++) {
    const itm = state.items[i];
    if (itm) {
      if (itm.height === key) {
        return {
          ...state,
          curIn: i,
          note: `CAN'T INSERT: duplicate at index ${i}`,
        };
      }
      if (itm.height > key) {
        insertPt = i;
        break;
      }
      insertPt = i + 1;
    }
  }

  return {
    ...state,
    insKey: key,
    insertPoint: insertPt,
    shiftIndex: state.nPersons - 1,
    codePart: 1, // 1: shift items right, 2: place item
    curIn: state.nPersons > insertPt ? state.nPersons - 1 : insertPt,
    showRange: false,
    currentOp: 'ins',
    isRunning: true,
    isOKChange: false,
    note: `Will insert at index ${insertPt}, following shift`,
  };
}

export function stepOrderedInsert(
  state: OrderedAppletState
): { nextState: OrderedAppletState; finished: boolean } {
  if (state.currentOp !== 'ins') {
    return { nextState: state, finished: true };
  }

  if (state.codePart === 1) {
    // Shifting elements to the right to make room
    if (state.shiftIndex >= state.insertPoint) {
      const newItems = [...state.items];
      newItems[state.shiftIndex + 1] = newItems[state.shiftIndex];

      return {
        nextState: {
          ...state,
          items: newItems,
          curIn: state.shiftIndex,
          note: `Shifted item from index ${state.shiftIndex} to ${state.shiftIndex + 1}`,
          shiftIndex: state.shiftIndex - 1,
        },
        finished: false,
      };
    } else {
      // Shifting completed, now insert
      const newItems = [...state.items];
      newItems[state.insertPoint] = {
        id: `ord-item-ins-${Date.now()}`,
        height: state.insKey,
        color: createRandomColor(),
      };
      const newNPersons = state.nPersons + 1;

      return {
        nextState: {
          ...state,
          items: newItems,
          nPersons: newNPersons,
          curIn: state.insertPoint,
          currentOp: 'idle',
          isRunning: false,
          note: `Inserted item ${state.insKey} at index ${state.insertPoint}; total items = ${newNPersons}`,
        },
        finished: true,
      };
    }
  }

  return { nextState: state, finished: true };
}

export function startOrderedFind(
  state: OrderedAppletState,
  isNumber: boolean,
  key: number
): OrderedAppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to find' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `ERROR: use key between 0 and ${MAX_KEY}` };
  }

  if (state.isLinear) {
    return {
      ...state,
      findKey: key,
      curIn: 0,
      showRange: false,
      currentOp: 'find',
      isRunning: true,
      note: `Checking index = 0`,
    };
  } else {
    // Binary Search
    const lb = 0;
    const ub = state.nPersons - 1;
    const mid = Math.floor((lb + ub) / 2);

    return {
      ...state,
      findKey: key,
      lowerBound: lb,
      upperBound: ub,
      curIn: mid,
      showRange: true,
      currentOp: 'find',
      isRunning: true,
      note: `Checking index ${mid}, range = ${lb} to ${ub}`,
    };
  }
}

export function stepOrderedFind(
  state: OrderedAppletState
): { nextState: OrderedAppletState; finished: boolean } {
  if (state.currentOp !== 'find') {
    return { nextState: state, finished: true };
  }

  if (state.isLinear) {
    // Linear Search in Ordered Array
    if (state.curIn >= state.nPersons) {
      return {
        nextState: {
          ...state,
          curIn: -1,
          currentOp: 'idle',
          isRunning: false,
          note: `Can't locate item with key ${state.findKey}`,
        },
        finished: true,
      };
    }

    const item = state.items[state.curIn];
    if (item && item.height === state.findKey) {
      // Found! Stop immediately
      return {
        nextState: {
          ...state,
          currentOp: 'idle',
          isRunning: false,
          note: `Have found item with key ${state.findKey} at index ${state.curIn}`,
        },
        finished: true,
      };
    }

    if (item && item.height > state.findKey) {
      // In ordered array, if element exceeds target, it can't exist! Early exit
      return {
        nextState: {
          ...state,
          curIn: -1,
          currentOp: 'idle',
          isRunning: false,
          note: `Can't locate item with key ${state.findKey}`,
        },
        finished: true,
      };
    }

    return {
      nextState: {
        ...state,
        curIn: state.curIn + 1,
        note: `Checking index = ${state.curIn + 1}`,
      },
      finished: false,
    };
  } else {
    // Binary Search
    if (state.lowerBound > state.upperBound) {
      return {
        nextState: {
          ...state,
          curIn: -1,
          showRange: false,
          currentOp: 'idle',
          isRunning: false,
          note: `Can't locate item with key ${state.findKey}`,
        },
        finished: true,
      };
    }

    const cur = state.curIn;
    const item = state.items[cur];

    if (item && item.height === state.findKey) {
      // Found! Stop immediately
      return {
        nextState: {
          ...state,
          showRange: false,
          currentOp: 'idle',
          isRunning: false,
          note: `Have found item with key ${state.findKey} at index ${cur}`,
        },
        finished: true,
      };
    }

    let nextLB = state.lowerBound;
    let nextUB = state.upperBound;

    if (item && state.findKey < item.height) {
      nextUB = cur - 1; // Search left half
    } else {
      nextLB = cur + 1; // Search right half
    }

    if (nextLB > nextUB) {
      return {
        nextState: {
          ...state,
          curIn: -1,
          showRange: false,
          currentOp: 'idle',
          isRunning: false,
          note: `Can't locate item with key ${state.findKey}`,
        },
        finished: true,
      };
    }

    const nextMid = Math.floor((nextLB + nextUB) / 2);
    return {
      nextState: {
        ...state,
        lowerBound: nextLB,
        upperBound: nextUB,
        curIn: nextMid,
        showRange: true,
        note: `Checking index ${nextMid}, range = ${nextLB} to ${nextUB}`,
      },
      finished: false,
    };
  }
}

export function startOrderedDelete(
  state: OrderedAppletState,
  isNumber: boolean,
  key: number
): OrderedAppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to delete' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `ERROR: use key between 0 and ${MAX_KEY}` };
  }

  // Find index using binary search or linear search
  let foundIdx = -1;
  let lb = 0;
  let ub = state.nPersons - 1;

  while (lb <= ub) {
    const mid = Math.floor((lb + ub) / 2);
    const item = state.items[mid];
    if (item && item.height === key) {
      foundIdx = mid;
      break;
    }
    if (item && item.height < key) {
      lb = mid + 1;
    } else {
      ub = mid - 1;
    }
  }

  if (foundIdx === -1) {
    return {
      ...state,
      curIn: -1,
      showRange: false,
      currentOp: 'idle',
      note: `Can't locate item with key ${key}`,
    };
  }

  return {
    ...state,
    delKey: key,
    curIn: foundIdx,
    shiftIndex: foundIdx,
    codePart: 1, // Shifting items left
    currentOp: 'del',
    isRunning: true,
    showRange: false,
    note: `Have found and deleted item with key ${key}`,
  };
}

export function stepOrderedDelete(
  state: OrderedAppletState
): { nextState: OrderedAppletState; finished: boolean } {
  if (state.currentOp !== 'del') {
    return { nextState: state, finished: true };
  }

  if (state.shiftIndex < state.nPersons - 1) {
    const newItems = [...state.items];
    newItems[state.shiftIndex] = newItems[state.shiftIndex + 1];

    return {
      nextState: {
        ...state,
        items: newItems,
        curIn: state.shiftIndex,
        shiftIndex: state.shiftIndex + 1,
        note: `Shifted item from index ${state.shiftIndex + 1} to ${state.shiftIndex}`,
      },
      finished: false,
    };
  } else {
    // Clear last item
    const newItems = [...state.items];
    newItems[state.nPersons - 1] = null;
    const newNPersons = state.nPersons - 1;

    return {
      nextState: {
        ...state,
        items: newItems,
        nPersons: newNPersons,
        curIn: -1,
        currentOp: 'idle',
        isRunning: false,
        note: `Shifting completed. Total items = ${newNPersons}`,
      },
      finished: true,
    };
  }
}
