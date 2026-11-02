export interface PersonISItem {
  height: number;
  color: string;
}

export interface InsertionSortState {
  aSize: number; // 10 or 100
  initOrder: number; // 1: random, 2: inverse
  bars: (PersonISItem | null)[]; // size + 1 (the last index is temp)
  outer: number;
  inner: number;
  outerOld: number;
  innerOld: number;
  codePart: number; // 1: copy outer to temp, 2: shift right, 3: copy temp to inner
  doneFlag: boolean;
  comps: number;
  copies: number;
  isRunning: boolean;
  speedMs: number;
  note: string;
}

export function createInitialInsertionSortState(
  aSize: number = 10,
  initOrder: number = 1
): InsertionSortState {
  const bars: (PersonISItem | null)[] = [];

  if (initOrder === 1) {
    for (let i = 0; i < aSize; i++) {
      const height = Math.floor(Math.random() * 199) + 1;
      const r = Math.floor(Math.random() * 254);
      const g = Math.floor(Math.random() * 254);
      const b = Math.floor(Math.random() * 254);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      bars.push({ height, color: hex });
    }
  } else {
    for (let i = 0; i < aSize; i++) {
      const height = Math.max(1, 199 - Math.floor((199 * i) / aSize));
      const r = Math.min(255, Math.max(0, 255 - height));
      const g = (85 * (i % 3)) % 256;
      const b = height % 256;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      bars.push({ height, color: hex });
    }
  }

  // Extra slot for temp bar at index aSize
  bars.push(null);

  return {
    aSize,
    initOrder,
    bars,
    outer: 1,
    inner: 1,
    outerOld: 0,
    innerOld: 0,
    codePart: 1,
    doneFlag: false,
    comps: 0,
    copies: 0,
    isRunning: false,
    speedMs: aSize === 10 ? 250 : 75,
    note: 'Will copy outer to temp',
  };
}

export function handleInsertionSortNew(state: InsertionSortState): InsertionSortState {
  const nextOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialInsertionSortState(state.aSize, nextOrder);
  return {
    ...next,
    note: nextOrder === 1 ? 'New random array initialized' : 'New inverse array initialized',
  };
}

export function handleInsertionSortSize(state: InsertionSortState): InsertionSortState {
  const nextSize = state.aSize === 10 ? 100 : 10;
  const next = createInitialInsertionSortState(nextSize, state.initOrder);
  return {
    ...next,
    note: `Toggled size to ${nextSize} bars`,
  };
}

export function stepInsertionSort(state: InsertionSortState): {
  nextState: InsertionSortState;
  finished: boolean;
} {
  if (state.doneFlag) {
    return {
      nextState: {
        ...state,
        isRunning: false,
        note: 'Sort is complete',
      },
      finished: true,
    };
  }

  const nextBars = [...state.bars];
  let comps = state.comps;
  let copies = state.copies;
  let outer = state.outer;
  let inner = state.inner;
  let outerOld = state.outerOld;
  let innerOld = state.innerOld;
  let codePart = state.codePart;
  let doneFlag: boolean = state.doneFlag;
  let note = '';

  const tempIdx = state.aSize;

  if (codePart === 1) {
    // Copy outer to temp
    nextBars[tempIdx] = nextBars[outer];
    nextBars[outer] = null;
    copies++;
    innerOld = inner;
    inner = outer;
    codePart = 2;
    note = 'Have copied outer to temp';
  } else if (codePart === 2) {
    // Compare inner-1 and temp
    comps++;
    const tempItem = nextBars[tempIdx];
    const prevItem = inner > 0 ? nextBars[inner - 1] : null;

    if (inner > 0 && prevItem && tempItem && prevItem.height >= tempItem.height) {
      // Shift right: copy inner-1 to inner
      nextBars[inner] = nextBars[inner - 1];
      nextBars[inner - 1] = null;
      copies++;
      innerOld = inner;
      inner--;
      note = `Will copy inner-1 to inner (shift)`;
    } else {
      codePart = 3;
      if (inner === 0) {
        note = 'Now inner is 0, so will copy temp to inner';
      } else {
        note = 'No copy necessary; will copy temp to inner';
      }
    }
  } else if (codePart === 3) {
    // Copy temp to inner
    nextBars[inner] = nextBars[tempIdx];
    nextBars[tempIdx] = null;
    copies++;
    outerOld = outer;
    outer++;

    if (outer >= state.aSize) {
      doneFlag = true;
      note = 'Sort is complete';
    } else {
      codePart = 1;
      note = 'Will copy outer to temp';
    }
  }

  return {
    nextState: {
      ...state,
      bars: nextBars,
      comps,
      copies,
      outer,
      inner,
      outerOld,
      innerOld,
      codePart,
      doneFlag,
      isRunning: !doneFlag && state.isRunning,
      note,
    },
    finished: doneFlag,
  };
}
