// Robert Lafore's Separate-Chaining Hash Table Logic Engine (Chapter 11: Hash Tables)
// Reverse-engineered from HashChain_9126496e.class, personGroup_1a35b143.class, bucket_1601ef86.class, link_5d76c154.class, person_15b7172a.class

export interface ChainPerson {
  height: number; // 0 to 999
  color: string;
}

export interface ChainLink {
  persData: ChainPerson;
}

export interface ChainBucket {
  linkArray: (ChainLink | null)[];
  nLinks: number;
}

export type HashChainOpMode = 'idle' | 'new' | 'fill' | 'ins' | 'find' | 'del';

export interface HashChainState {
  appletWidth: number; // 440
  appletHeight: number; // 320
  topMargin: number; // 70
  leftMargin: number; // 10
  textHeight: number; // 13
  hF1: number; // 12
  hF2: number; // 6
  hF3: number; // 0
  vF: number; // 8
  columnWidth: number; // 60
  cellWidth: number; // 35
  arrowLen: number; // 22
  cellHeight: number; // 17
  digits3Width: number; // 18
  rowHeight: number; // 24
  noteBoxTop: number; // 45
  noteBoxHeight: number; // 25
  noteBoxWidth: number; // 320
  MAX_BUCKETS: number; // 100
  MAX_KEY: number; // 999
  MAX_LINKS: number; // 6
  linesInView: number; // 10

  bucketArray: ChainBucket[];
  totalBuckets: number; // default 25
  nPersons: number;
  tempPers: ChainPerson | null;
  note: string;
  fillValue: number;
  insKey: number;
  findKey: number;
  delKey: number;
  codePart: number;
  codePart2: number;
  opMode: HashChainOpMode;
  curList: number;
  curLink: number;
  oldCurList: number;
  oldCurLink: number;
  drawMode: number;
  topDisplayLine: number;

  isRunning: boolean;
  speedMs: number;
}

export function makeChainPerson(height: number): ChainPerson {
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  return {
    height,
    color: `rgb(${r}, ${g}, ${b})`,
  };
}

export function createEmptyBucket(maxLinks = 6): ChainBucket {
  return {
    linkArray: new Array(maxLinks).fill(null),
    nLinks: 0,
  };
}

export function chainHashFunction(key: number, totalBuckets: number): number {
  if (totalBuckets <= 0) return 0;
  return ((key % totalBuckets) + totalBuckets) % totalBuckets;
}

export function populateInitialChain(
  bucketArray: ChainBucket[],
  totalBuckets: number,
  count: number
): number {
  let filled = 0;
  for (let attempt = 0; attempt < 500 && filled < count; attempt++) {
    const key = Math.floor(Math.random() * 1000); // 0 to 999
    const list = chainHashFunction(key, totalBuckets);
    const bucket = bucketArray[list];
    if (bucket && bucket.nLinks < 6) {
      // Shift right and insert at head (index 0)
      for (let k = bucket.nLinks; k > 0; k--) {
        bucket.linkArray[k] = bucket.linkArray[k - 1];
      }
      bucket.linkArray[0] = { persData: makeChainPerson(key) };
      bucket.nLinks++;
      filled++;
    }
  }
  return filled;
}

export function createInitialHashChainState(initialBuckets = 25, initialCount = 25): HashChainState {
  const bucketArray: ChainBucket[] = [];
  for (let i = 0; i < initialBuckets; i++) {
    bucketArray.push(createEmptyBucket(6));
  }
  const nPersons = populateInitialChain(bucketArray, initialBuckets, initialCount);

  return {
    appletWidth: 440,
    appletHeight: 320,
    topMargin: 70,
    leftMargin: 10,
    textHeight: 13,
    hF1: 12,
    hF2: 6,
    hF3: 0,
    vF: 8,
    columnWidth: 60,
    cellWidth: 35,
    arrowLen: 22,
    cellHeight: 17,
    digits3Width: 18,
    rowHeight: 24,
    noteBoxTop: 45,
    noteBoxHeight: 25,
    noteBoxWidth: 320,
    MAX_BUCKETS: 100,
    MAX_KEY: 999,
    MAX_LINKS: 6,
    linesInView: 10,

    bucketArray,
    totalBuckets: initialBuckets,
    nPersons,
    tempPers: null,
    note: 'Press any button',
    fillValue: 0,
    insKey: 0,
    findKey: 0,
    delKey: 0,
    codePart: 1,
    codePart2: 1,
    opMode: 'idle',
    curList: 0,
    curLink: 0,
    oldCurList: -1,
    oldCurLink: -1,
    drawMode: 2,
    topDisplayLine: 0,

    isRunning: false,
    speedMs: 350,
  };
}

// 1. New Table
export function startChainNew(state: HashChainState, isNum: boolean, size?: number): HashChainState {
  return {
    ...state,
    opMode: 'new',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurList: state.curList,
    curList: 0,
    oldCurLink: state.curLink,
    curLink: 0,
    note: 'Enter number of linked lists in array: ',
    fillValue: isNum && size !== undefined ? size : 25,
  };
}

// 2. Fill Table
export function startChainFill(state: HashChainState, isNum: boolean, count?: number): HashChainState {
  return {
    ...state,
    opMode: 'fill',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurList: state.curList,
    curList: 0,
    oldCurLink: state.curLink,
    curLink: 0,
    note: 'Enter number of items to fill in',
    fillValue: isNum && count !== undefined ? count : 25,
  };
}

// 3. Insert Item
export function startChainInsert(state: HashChainState, isNum: boolean, key?: number): HashChainState {
  return {
    ...state,
    opMode: 'ins',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurList: state.curList,
    curList: 0,
    oldCurLink: state.curLink,
    curLink: 0,
    note: 'Enter key of item to insert',
    insKey: isNum && key !== undefined ? key : 42,
  };
}

// 4. Find Item
export function startChainFind(state: HashChainState, isNum: boolean, key?: number): HashChainState {
  return {
    ...state,
    opMode: 'find',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurList: state.curList,
    curList: 0,
    oldCurLink: state.curLink,
    curLink: 0,
    note: 'Enter key of item to find',
    findKey: isNum && key !== undefined ? key : 42,
  };
}

// 5. Delete Item
export function startChainDelete(state: HashChainState, isNum: boolean, key?: number): HashChainState {
  return {
    ...state,
    opMode: 'del',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurList: state.curList,
    curList: 0,
    oldCurLink: state.curLink,
    curLink: 0,
    note: 'Enter key of item to delete',
    delKey: isNum && key !== undefined ? key : 42,
  };
}

// Scroll position setter
export function setChainScroll(state: HashChainState, topDisplayLine: number): HashChainState {
  const maxScroll = Math.max(0, state.totalBuckets - state.linesInView);
  const clamped = Math.max(0, Math.min(maxScroll, topDisplayLine));
  return {
    ...state,
    topDisplayLine: clamped,
  };
}

// Ensure the targeted list is visible in viewport
function scrollIntoView(state: HashChainState, targetList: number): number {
  if (targetList < state.topDisplayLine) {
    return targetList;
  }
  if (targetList >= state.topDisplayLine + state.linesInView) {
    return Math.max(0, targetList - state.linesInView + 1);
  }
  return state.topDisplayLine;
}

// Step logic executing the bytecode state machine
export function stepChain(
  state: HashChainState,
  inputNum?: number
): { nextState: HashChainState; isFinished: boolean } {
  const { opMode, codePart } = state;

  if (opMode === 'idle') {
    return { nextState: state, isFinished: true };
  }

  // --- 1. NEW ARRAY ---
  if (opMode === 'new') {
    if (codePart === 1) {
      const val = inputNum !== undefined ? inputNum : state.fillValue;
      if (val <= 0 || val > 100) {
        return {
          nextState: {
            ...state,
            note: 'ERROR: use size between 0 and 100',
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          isFinished: true,
        };
      }
      return {
        nextState: {
          ...state,
          fillValue: val,
          note: `Will create empty table with ${val} lists`,
          codePart: 2,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 2) {
      const newBuckets: ChainBucket[] = [];
      for (let i = 0; i < state.fillValue; i++) {
        newBuckets.push(createEmptyBucket(6));
      }
      return {
        nextState: {
          ...state,
          bucketArray: newBuckets,
          totalBuckets: state.fillValue,
          nPersons: 0,
          curList: 0,
          curLink: 0,
          topDisplayLine: 0,
          note: `New table created; total items = 0`,
          codePart: 3,
          drawMode: 2,
        },
        isFinished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
          drawMode: 1,
        },
        isFinished: true,
      };
    }
  }

  // --- 2. FILL ---
  if (opMode === 'fill') {
    if (codePart === 1) {
      const val = inputNum !== undefined ? inputNum : state.fillValue;
      const maxPossible = state.totalBuckets * 6;
      if (val < 0 || val > maxPossible) {
        return {
          nextState: {
            ...state,
            note: `ERROR: can't fill more than ${maxPossible} items`,
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          isFinished: true,
        };
      }
      return {
        nextState: {
          ...state,
          fillValue: val,
          note: `Will fill in ${val} items`,
          codePart: 2,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 2) {
      // Clear all buckets first
      const newBuckets: ChainBucket[] = [];
      for (let i = 0; i < state.totalBuckets; i++) {
        newBuckets.push(createEmptyBucket(6));
      }
      const filled = populateInitialChain(newBuckets, state.totalBuckets, state.fillValue);
      return {
        nextState: {
          ...state,
          bucketArray: newBuckets,
          nPersons: filled,
          curList: 0,
          curLink: 0,
          topDisplayLine: 0,
          note: `Fill completed; total items = ${filled}`,
          codePart: 3,
          drawMode: 2,
        },
        isFinished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
          drawMode: 1,
        },
        isFinished: true,
      };
    }
  }

  // --- 3. INSERT ---
  if (opMode === 'ins') {
    if (codePart === 1) {
      const key = inputNum !== undefined ? inputNum : state.insKey;
      if (key < 0 || key > 999) {
        return {
          nextState: {
            ...state,
            note: "CAN'T INSERT: need key between 0 and 999",
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          isFinished: true,
        };
      }
      const p = makeChainPerson(key);
      return {
        nextState: {
          ...state,
          insKey: key,
          tempPers: p,
          note: `Will insert item with key ${key}`,
          codePart: 2,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 2) {
      const list = chainHashFunction(state.insKey, state.totalBuckets);
      const newTop = scrollIntoView(state, list);
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: list,
          topDisplayLine: newTop,
          oldCurLink: state.curLink,
          curLink: 0,
          note: `Will insert in list ${list}`,
          codePart: 3,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 3) {
      const list = state.curList;
      const bucket = state.bucketArray[list];
      if (bucket.nLinks >= 6) {
        return {
          nextState: {
            ...state,
            note: `CAN'T INSERT: list ${list} is full`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      // Insert at head (index 0)
      const newBuckets = state.bucketArray.map((b, idx) => {
        if (idx !== list) return b;
        const newLinks = [...b.linkArray];
        for (let k = b.nLinks; k > 0; k--) {
          newLinks[k] = newLinks[k - 1];
        }
        newLinks[0] = { persData: state.tempPers! };
        return {
          linkArray: newLinks,
          nLinks: b.nLinks + 1,
        };
      });
      return {
        nextState: {
          ...state,
          bucketArray: newBuckets,
          nPersons: state.nPersons + 1,
          curLink: 0,
          note: `Inserted item with key ${state.insKey} in list ${list}`,
          codePart: 4,
          drawMode: 2,
        },
        isFinished: false,
      };
    } else if (codePart === 4) {
      return {
        nextState: {
          ...state,
          note: `Insertion completed; total items = ${state.nPersons}`,
          codePart: 5,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: 0,
          oldCurLink: state.curLink,
          curLink: 0,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
          drawMode: 1,
        },
        isFinished: true,
      };
    }
  }

  // --- 4. FIND ---
  if (opMode === 'find') {
    if (codePart === 1) {
      const key = inputNum !== undefined ? inputNum : state.findKey;
      if (key < 0 || key > 999) {
        return {
          nextState: {
            ...state,
            note: "CAN'T FIND: use key between 0 and 999",
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          isFinished: true,
        };
      }
      return {
        nextState: {
          ...state,
          findKey: key,
          note: `Will try to find item with key ${key}`,
          codePart: 2,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 2) {
      const list = chainHashFunction(state.findKey, state.totalBuckets);
      const newTop = scrollIntoView(state, list);
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: list,
          topDisplayLine: newTop,
          oldCurLink: state.curLink,
          curLink: 0,
          note: `Item with key ${state.findKey} should be in list ${list}`,
          codePart: 3,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 3) {
      const list = state.curList;
      const bucket = state.bucketArray[list];
      if (bucket.nLinks === 0) {
        return {
          nextState: {
            ...state,
            note: `Can't find item with key ${state.findKey}`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      const item = bucket.linkArray[state.curLink];
      if (item && item.persData.height === state.findKey) {
        return {
          nextState: {
            ...state,
            note: `Have found item with key ${state.findKey}`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      if (state.curLink >= bucket.nLinks - 1) {
        return {
          nextState: {
            ...state,
            note: `Can't find item with key ${state.findKey}`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      // Advance to next link
      const nextLink = state.curLink + 1;
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          oldCurLink: state.curLink,
          curLink: nextLink,
          note: `Looking for item with key ${state.findKey} at link ${nextLink}`,
          codePart: 3,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: 0,
          oldCurLink: state.curLink,
          curLink: 0,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
          drawMode: 1,
        },
        isFinished: true,
      };
    }
  }

  // --- 5. DELETE ---
  if (opMode === 'del') {
    if (codePart === 1) {
      const key = inputNum !== undefined ? inputNum : state.delKey;
      if (key < 0 || key > 999) {
        return {
          nextState: {
            ...state,
            note: "CAN'T FIND: use key between 0 and 999",
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          isFinished: true,
        };
      }
      return {
        nextState: {
          ...state,
          delKey: key,
          note: `Will try to delete item with key ${key}`,
          codePart: 2,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 2) {
      const list = chainHashFunction(state.delKey, state.totalBuckets);
      const newTop = scrollIntoView(state, list);
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: list,
          topDisplayLine: newTop,
          oldCurLink: state.curLink,
          curLink: 0,
          note: `Item with key ${state.delKey} should be in list ${list}`,
          codePart: 3,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 3) {
      const list = state.curList;
      const bucket = state.bucketArray[list];
      if (bucket.nLinks === 0) {
        return {
          nextState: {
            ...state,
            note: `Can't find item with key ${state.delKey}`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      const item = bucket.linkArray[state.curLink];
      if (item && item.persData.height === state.delKey) {
        return {
          nextState: {
            ...state,
            note: `Have found item with key ${state.delKey}`,
            codePart: 4,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      if (state.curLink >= bucket.nLinks - 1) {
        return {
          nextState: {
            ...state,
            note: `Can't find item with key ${state.delKey}`,
            codePart: 5,
            drawMode: 1,
          },
          isFinished: false,
        };
      }
      // Advance to next link
      const nextLink = state.curLink + 1;
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          oldCurLink: state.curLink,
          curLink: nextLink,
          note: `Looking for item with key ${state.delKey} at link ${nextLink}`,
          codePart: 3,
          drawMode: 1,
        },
        isFinished: false,
      };
    } else if (codePart === 4) {
      // Remove item at curLink and shift left
      const list = state.curList;
      const bucket = state.bucketArray[list];
      const linkIdx = state.curLink;

      const newBuckets = state.bucketArray.map((b, idx) => {
        if (idx !== list) return b;
        const newLinks = [...b.linkArray];
        for (let k = linkIdx; k < b.nLinks - 1; k++) {
          newLinks[k] = newLinks[k + 1];
        }
        newLinks[b.nLinks - 1] = null;
        return {
          linkArray: newLinks,
          nLinks: b.nLinks - 1,
        };
      });

      const nextCurLink = linkIdx > 0 ? linkIdx - 1 : 0;
      return {
        nextState: {
          ...state,
          bucketArray: newBuckets,
          nPersons: Math.max(0, state.nPersons - 1),
          oldCurLink: state.curLink,
          curLink: nextCurLink,
          note: `Deleted item with key ${state.delKey}`,
          codePart: 5,
          drawMode: 2,
        },
        isFinished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          oldCurList: state.curList,
          curList: 0,
          oldCurLink: state.curLink,
          curLink: 0,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
          drawMode: 2,
        },
        isFinished: true,
      };
    }
  }

  return { nextState: state, isFinished: true };
}
