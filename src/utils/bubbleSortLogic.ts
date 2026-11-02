export interface PersonBSItem {
  height: number;
  color: string;
}

export interface BubbleSortState {
  aSize: number; // 10 or 100
  initOrder: number; // 1: random, 2: inverse
  bars: PersonBSItem[];
  outer: number;
  inner: number;
  innerOld: number;
  swapFlag: boolean;
  doneFlag: boolean;
  comps: number;
  swaps: number;
  isRunning: boolean;
  speedMs: number;
  note: string;
}

export function createInitialBubbleSortState(
  aSize: number = 10,
  initOrder: number = 1
): BubbleSortState {
  const bars: PersonBSItem[] = [];

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
    outer: aSize - 1,
    inner: 0,
    innerOld: 0,
    swapFlag: false,
    doneFlag: false,
    comps: 0,
    swaps: 0,
    isRunning: false,
    speedMs: aSize === 10 ? 250 : 75,
    note: initOrder === 1 ? 'New random data created' : 'New inverse data created',
  };
}

export function handleBubbleSortNew(state: BubbleSortState): BubbleSortState {
  // Toggle order between 1 (random) and 2 (inverse)
  const nextOrder = state.initOrder === 1 ? 2 : 1;
  const next = createInitialBubbleSortState(state.aSize, nextOrder);
  return {
    ...next,
    note: nextOrder === 1 ? 'New random array initialized' : 'New inverse array initialized',
  };
}

export function handleBubbleSortSize(state: BubbleSortState): BubbleSortState {
  // Toggle size between 10 and 100
  const nextSize = state.aSize === 10 ? 100 : 10;
  const next = createInitialBubbleSortState(nextSize, state.initOrder);
  return {
    ...next,
    note: `Toggled size to ${nextSize} bars`,
  };
}

export function stepBubbleSort(state: BubbleSortState): {
  nextState: BubbleSortState;
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
  let comps = state.comps + 1;
  let swaps = state.swaps;
  let swapFlag = false;

  const currentHeight = nextBars[state.inner].height;
  const nextHeight = nextBars[state.inner + 1].height;

  let note = '';
  if (currentHeight > nextHeight) {
    // Swap
    const temp = nextBars[state.inner];
    nextBars[state.inner] = nextBars[state.inner + 1];
    nextBars[state.inner + 1] = temp;
    swapFlag = true;
    swaps++;
    note = `Will be swapped: ${currentHeight} > ${nextHeight}`;
  } else {
    swapFlag = false;
    note = `Will not be swapped: ${currentHeight} <= ${nextHeight}`;
  }

  const innerOld = state.inner;
  let nextInner = state.inner + 1;
  let nextOuter = state.outer;
  let doneFlag: boolean = state.doneFlag;

  if (nextInner > nextOuter - 1) {
    nextInner = 0;
    nextOuter--;
    if (nextOuter <= 0) {
      doneFlag = true;
      note = 'Sort is complete';
    }
  }

  return {
    nextState: {
      ...state,
      bars: nextBars,
      comps,
      swaps,
      swapFlag,
      innerOld,
      inner: nextInner,
      outer: nextOuter,
      doneFlag,
      isRunning: !doneFlag && state.isRunning,
      note,
    },
    finished: doneFlag,
  };
}
