export interface PersonSSItem {
  height: number;
  color: string;
}

export interface SelectionSortState {
  aSize: number; // 10 or 100
  initOrder: number; // 1: random, 2: inverse
  bars: PersonSSItem[];
  outer: number;
  inner: number;
  min: number;
  outerOld: number;
  minOld: number;
  searchFlag: boolean;
  swapFlag: boolean;
  doneFlag: boolean;
  comps: number;
  swaps: number;
  isRunning: boolean;
  speedMs: number;
  note: string;
}

export function createInitialSelectionSortState(
  aSize: number = 10,
  initOrder: number = 1
): SelectionSortState {
  const bars: PersonSSItem[] = [];

  if (initOrder === 1) {
    // Random Order
    for (let i = 0; i < aSize; i++) {
      const height = Math.floor(Math.random() * 199) + 1;
      const r = Math.floor(Math.random() * 254);
      const g = Math.floor(Math.random() * 254);
      const b = Math.floor(Math.random() * 254);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      bars.push({ height, color: hex });
    }
  } else {
    // Inverse Order (Descending)
    for (let i = 0; i < aSize; i++) {
      const height = Math.max(1, 199 - Math.floor((199 * i) / aSize));
      const r = Math.min(255, Math.max(0, 255 - height));
      const g = (85 * (i % 3)) % 256;
      const b = height % 256;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      bars.push({ height, color: hex });
    }
  }

  return {
    aSize,
    initOrder,
    bars,
    outer: 0,
    inner: 1,
    min: 0,
    outerOld: 0,
    minOld: 0,
    searchFlag: true,
    swapFlag: false,
    doneFlag: false,
    comps: 0,
    swaps: 0,
    isRunning: false,
    speedMs: aSize === 10 ? 250 : 75,
    note: 'Searching for minimum',
  };
}

export function handleSelectionSortNew(state: SelectionSortState): SelectionSortState {
  const nextOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialSelectionSortState(state.aSize, nextOrder);
  return {
    ...next,
    note: nextOrder === 1 ? 'New random array initialized' : 'New inverse array initialized',
  };
}

export function handleSelectionSortSize(state: SelectionSortState): SelectionSortState {
  const nextSize = state.aSize === 10 ? 100 : 10;
  const next = createInitialSelectionSortState(nextSize, state.initOrder);
  return {
    ...next,
    note: `Toggled size to ${nextSize} bars`,
  };
}

export function stepSelectionSort(state: SelectionSortState): {
  nextState: SelectionSortState;
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

  let nextBars = [...state.bars];
  let comps = state.comps;
  let swaps = state.swaps;
  let outer = state.outer;
  let inner = state.inner;
  let min = state.min;
  let outerOld = state.outerOld;
  let minOld = state.minOld;
  let searchFlag = state.searchFlag;
  let swapFlag = false;
  let doneFlag: boolean = state.doneFlag;
  let note = '';

  if (searchFlag) {
    // Phase 1: Search for minimum
    comps++;
    if (nextBars[inner].height < nextBars[min].height) {
      minOld = min;
      min = inner;
    }
    inner++;
    if (inner > state.aSize - 1) {
      searchFlag = false;
      if (min === outer) {
        note = 'No swap necessary';
      } else {
        note = 'Will swap outer & min';
      }
    } else {
      note = 'Searching for minimum';
    }
  } else {
    // Phase 2: Swap phase
    if (min !== outer) {
      const temp = nextBars[outer];
      nextBars[outer] = nextBars[min];
      nextBars[min] = temp;
      swapFlag = true;
      swaps++;
      note = `Swapped outer (${outer}) and min (${min})`;
    } else {
      swapFlag = false;
      note = 'No swap necessary';
    }

    outerOld = outer;
    outer++;
    inner = outer + 1;
    minOld = min;
    min = outer;
    searchFlag = true;

    if (outer > state.aSize - 2) {
      doneFlag = true;
      note = 'Sort is complete';
    } else {
      note = 'Searching for minimum';
    }
  }

  return {
    nextState: {
      ...state,
      bars: nextBars,
      comps,
      swaps,
      outer,
      inner,
      min,
      outerOld,
      minOld,
      searchFlag,
      swapFlag,
      doneFlag,
      isRunning: !doneFlag && state.isRunning,
      note,
    },
    finished: doneFlag,
  };
}
