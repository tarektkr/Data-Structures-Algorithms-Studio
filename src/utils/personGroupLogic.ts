import { AppletState, PersonItem } from '../types/applet';

export const MAX_CELLS = 60;
export const MAX_KEY = 999;

export function createRandomColor(): string {
  const r = 100 + Math.floor(Math.random() * 156);
  const g = 100 + Math.floor(Math.random() * 156);
  const b = 100 + Math.floor(Math.random() * 156);
  return `rgb(${r}, ${g}, ${b})`;
}

export function createInitialState(): AppletState {
  const items: (PersonItem | null)[] = new Array(MAX_CELLS).fill(null);
  return {
    totalCells: 60,
    items,
    nPersons: 0,
    note: 'Press any button',
    curIn: -1,
    oldCurIn: -1,
    lastDeletion: -1,
    dupsOK: true,
    isOKChangeDups: true,
    currentOp: 'idle',
    codePart: 1,
    findKey: 0,
    delKey: 0,
    wasJustFound: false,
    nDeleted: 0,
    isRunning: false,
    speedMs: 250,
    stepByStep: false,
  };
}

export function handleNewArray(state: AppletState, isNumber: boolean, size: number): AppletState {
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
    isOKChangeDups: true,
    currentOp: 'idle',
    isRunning: false,
    note: `New array created; total items = 0`,
  };
}

export function handleFill(state: AppletState, isNumber: boolean, count: number): AppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter number of items to fill in' };
  }
  if (count < 0 || count > state.totalCells) {
    return { ...state, note: `ERROR: can't fill more than ${state.totalCells} cells` };
  }

  const items: (PersonItem | null)[] = new Array(MAX_CELLS).fill(null);
  const usedKeys = new Set<number>();

  for (let i = 0; i < count; i++) {
    let val: number;
    if (!state.dupsOK) {
      do {
        val = Math.floor(Math.random() * (MAX_KEY + 1));
      } while (usedKeys.has(val));
      usedKeys.add(val);
    } else {
      val = Math.floor(Math.random() * (MAX_KEY + 1));
    }

    items[i] = {
      id: `item-${i}-${Date.now()}-${Math.random()}`,
      height: val,
      color: createRandomColor(),
    };
  }

  return {
    ...state,
    items,
    nPersons: count,
    curIn: -1,
    oldCurIn: -1,
    isOKChangeDups: false,
    currentOp: 'idle',
    isRunning: false,
    note: `Fill completed; total items = ${count}`,
  };
}

export function handleInsert(state: AppletState, isNumber: boolean, key: number): AppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to insert' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `CAN'T INSERT: need key between 0 and ${MAX_KEY}` };
  }
  if (state.nPersons >= state.totalCells) {
    return { ...state, note: "CAN'T INSERT: array is full" };
  }

  if (!state.dupsOK) {
    const exists = state.items.slice(0, state.nPersons).some(item => item && item.height === key);
    if (exists) {
      return { ...state, note: `CAN'T INSERT: ${key} already exists (No dups)` };
    }
  }

  const newItems = [...state.items];
  const insertIndex = state.nPersons;
  newItems[insertIndex] = {
    id: `item-${insertIndex}-${Date.now()}`,
    height: key,
    color: createRandomColor(),
  };

  return {
    ...state,
    items: newItems,
    nPersons: state.nPersons + 1,
    curIn: insertIndex,
    isOKChangeDups: false,
    currentOp: 'idle',
    isRunning: false,
    note: `Inserted item with key ${key}; total items = ${state.nPersons + 1}`,
  };
}

export function startFind(state: AppletState, isNumber: boolean, key: number): AppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to find' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `ERROR: use key between 0 and ${MAX_KEY}` };
  }

  return {
    ...state,
    findKey: key,
    curIn: 0,
    oldCurIn: -1,
    wasJustFound: false,
    currentOp: 'find',
    codePart: 1,
    isRunning: true,
    note: `Looking for item with key ${key}`,
  };
}

export function stepFind(state: AppletState): { nextState: AppletState; finished: boolean } {
  if (state.currentOp !== 'find') {
    return { nextState: state, finished: true };
  }

  if (state.curIn >= state.nPersons) {
    const note = state.wasJustFound
      ? `Have found item with key ${state.findKey} at index ${state.curIn - 1}`
      : `Can't locate item with key ${state.findKey}`;

    return {
      nextState: {
        ...state,
        curIn: -1,
        currentOp: 'idle',
        isRunning: false,
        note,
      },
      finished: true,
    };
  }

  const currentItem = state.items[state.curIn];
  const isMatch = currentItem !== null && currentItem.height === state.findKey;

  if (isMatch) {
    // تم العثور على العنصر: التوقف فوراً دون مسح بقية المصفوفة
    const note = `Have found item with key ${state.findKey} at index ${state.curIn}`;

    return {
      nextState: {
        ...state,
        curIn: state.curIn, // إبقاء مؤشر السهم الأحمر مشيراً إلى العنصر الذي تم إيجاده
        oldCurIn: state.curIn,
        wasJustFound: true,
        currentOp: 'idle',
        isRunning: false,
        note,
      },
      finished: true, // إنهاء البحث فوراً
    };
  } else {
    return {
      nextState: {
        ...state,
        oldCurIn: state.curIn,
        curIn: state.curIn + 1,
        note: `Checking index = ${state.curIn}`,
      },
      finished: false,
    };
  }
}

export function startDelete(state: AppletState, isNumber: boolean, key: number): AppletState {
  if (!isNumber) {
    return { ...state, note: 'Enter key of item to delete' };
  }
  if (key < 0 || key > MAX_KEY) {
    return { ...state, note: `ERROR: use key between 0 and ${MAX_KEY}` };
  }

  return {
    ...state,
    delKey: key,
    curIn: 0,
    oldCurIn: -1,
    lastDeletion: -1,
    wasJustFound: false,
    nDeleted: 0,
    currentOp: 'del',
    codePart: 1, // 1: search, 2: shift
    isRunning: true,
    note: `Enter key of item to delete: ${key}`,
  };
}

export function stepDelete(state: AppletState): { nextState: AppletState; finished: boolean } {
  if (state.currentOp !== 'del') {
    return { nextState: state, finished: true };
  }

  if (state.codePart === 1) {
    // Phase 1: Search for item
    if (state.curIn >= state.nPersons) {
      const note = state.nDeleted > 0
        ? 'Shifts complete; no more items to delete'
        : `Can't locate item with key ${state.delKey}`;

      return {
        nextState: {
          ...state,
          curIn: -1,
          currentOp: 'idle',
          isRunning: false,
          note,
        },
        finished: true,
      };
    }

    const currentItem = state.items[state.curIn];
    if (currentItem && currentItem.height === state.delKey) {
      return {
        nextState: {
          ...state,
          nDeleted: state.nDeleted + 1,
          wasJustFound: true,
          lastDeletion: state.curIn,
          codePart: 2, // Switch to shifting
          note: `Have found and deleted item with key ${state.delKey}`,
        },
        finished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          oldCurIn: state.curIn,
          curIn: state.curIn + 1,
          note: `Checking index = ${state.curIn}`,
        },
        finished: false,
      };
    }
  } else if (state.codePart === 2) {
    // Phase 2: Shift items left
    if (state.curIn < state.nPersons - 1) {
      const newItems = [...state.items];
      newItems[state.curIn] = newItems[state.curIn + 1];

      return {
        nextState: {
          ...state,
          items: newItems,
          note: `Will shift item ${state.curIn + 1} to ${state.curIn}`,
          curIn: state.curIn + 1,
        },
        finished: false,
      };
    } else {
      // Reached the end of items
      const newItems = [...state.items];
      newItems[state.nPersons - 1] = null;
      const newNPersons = state.nPersons - 1;

      if (state.dupsOK) {
        // If duplicates OK, check from lastDeletion position for any more duplicates
        return {
          nextState: {
            ...state,
            items: newItems,
            nPersons: newNPersons,
            curIn: state.lastDeletion,
            codePart: 1,
            note: `Shifting completed. Total items = ${newNPersons}`,
          },
          finished: false,
        };
      } else {
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
  }

  return { nextState: state, finished: true };
}
