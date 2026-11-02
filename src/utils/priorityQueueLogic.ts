export interface PersonPQItem {
  height: number;
  color: string;
}

export interface PriorityQueueState {
  aSize: number; // 10
  queArray: (PersonPQItem | null)[]; // 10 slots (0 to 9)
  nPersons: number; // 0 to 10
  front: number; // -1 to 9 (always nPersons - 1 when not empty, -1 when empty)
  rear: number; // always 0
  curIn: number; // -9 when idle, otherwise search/shift index
  insKey: number;
  tempPers: PersonPQItem | null;
  note: string;
  returnString: string;
  codePart: number; // 1..5 sub-steps
  opMode: 'idle' | 'new' | 'insert' | 'remove' | 'peek';
  isRunning: boolean;
  stepByStep: boolean;
  speedMs: number;
}

// Generate pastel colors matching Robert Lafore applet palette
function generatePerson(key: number): PersonPQItem {
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    height: key,
    color: hex,
  };
}

export function createInitialPriorityQueueState(): PriorityQueueState {
  const queArray: (PersonPQItem | null)[] = new Array(10).fill(null);

  // Initial fill with 5 elements in ascending sorted order
  // (As in Robert Lafore PriorityQ applet: INIT_NUM = 5, sorted ascending from 0 to 4)
  const initialKeys = [142, 285, 419, 637, 850];
  for (let i = 0; i < 5; i++) {
    queArray[i] = generatePerson(initialKeys[i]);
  }

  return {
    aSize: 10,
    queArray,
    nPersons: 5,
    front: 4,
    rear: 0,
    curIn: -9,
    insKey: 0,
    tempPers: null,
    note: 'Press any button',
    returnString: '',
    codePart: 1,
    opMode: 'idle',
    isRunning: false,
    stepByStep: false,
    speedMs: 350,
  };
}

export function startInsert(
  state: PriorityQueueState,
  isNumber: boolean,
  value: number
): PriorityQueueState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -9,
      note: "CAN'T INSERT: need key between 0 and 999",
      isRunning: false,
    };
  }

  if (state.nPersons >= 10) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -9,
      note: "CAN'T INSERT: queue is full",
      isRunning: false,
    };
  }

  const tempPers = generatePerson(value);
  return {
    ...state,
    insKey: value,
    tempPers,
    opMode: 'insert',
    codePart: 2, // starts at step 2 after key input
    curIn: state.nPersons - 1, // Start search at top of queue
    note: `Will insert item with key ${value}`,
  };
}

export function startRemove(state: PriorityQueueState): PriorityQueueState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -9,
      note: "CAN'T REMOVE: queue is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'remove',
    codePart: 1,
    curIn: -9,
    note: 'Will remove item from front of queue',
    returnString: '',
  };
}

export function startPeek(state: PriorityQueueState): PriorityQueueState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -9,
      note: "CAN'T PEEK: queue is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'peek',
    codePart: 1,
    curIn: -9,
    note: 'Will peek at item at front of queue',
    returnString: '',
  };
}

export function startNewQueue(state: PriorityQueueState): PriorityQueueState {
  return {
    ...state,
    opMode: 'new',
    codePart: 1,
    curIn: -9,
    note: 'Will create new queue',
  };
}

export function stepPriorityQueue(state: PriorityQueueState): {
  nextState: PriorityQueueState;
  finished: boolean;
} {
  if (state.opMode === 'idle') {
    return { nextState: state, finished: true };
  }

  // 1. New Queue State Machine
  if (state.opMode === 'new') {
    if (state.codePart === 1) {
      // Step 2: Clear array, reset pointers
      const emptyArray = new Array(10).fill(null);
      return {
        nextState: {
          ...state,
          queArray: emptyArray,
          nPersons: 0,
          front: -1,
          rear: 0,
          curIn: -9,
          note: 'New queue created',
          codePart: 2,
        },
        finished: false,
      };
    } else {
      // Step 3: Complete
      return {
        nextState: {
          ...state,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
        },
        finished: true,
      };
    }
  }

  // 2. Insert State Machine (Search & Shift)
  if (state.opMode === 'insert') {
    // If empty queue: immediate insert at index 0
    if (state.nPersons === 0) {
      if (state.codePart === 2) {
        const nextArray = [...state.queArray];
        nextArray[0] = state.tempPers;
        return {
          nextState: {
            ...state,
            queArray: nextArray,
            nPersons: 1,
            front: 0,
            rear: 0,
            curIn: 0,
            note: `Inserted item with key ${state.insKey}`,
            codePart: 4,
          },
          finished: false,
        };
      } else {
        return {
          nextState: {
            ...state,
            curIn: -9,
            note: 'Press any button',
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          finished: true,
        };
      }
    }

    // When queue is not empty:
    if (state.codePart === 2) {
      // Begin searching from top (curIn = nPersons - 1)
      const curIn = state.nPersons - 1;
      return {
        nextState: {
          ...state,
          curIn,
          codePart: 3,
          note: 'Searching for insertion point',
        },
        finished: false,
      };
    }

    if (state.codePart === 3) {
      // Compare insKey with queArray[curIn]
      if (state.curIn < 0) {
        // Reached bottom: insert at index 0
        return {
          nextState: {
            ...state,
            curIn: 0,
            note: 'Found insertion point',
            codePart: 4,
          },
          finished: false,
        };
      }

      const currentItem = state.queArray[state.curIn];
      if (currentItem && state.insKey > currentItem.height) {
        // Insertion point found! Insert at curIn + 1
        return {
          nextState: {
            ...state,
            curIn: state.curIn + 1,
            note: 'Found insertion point',
            codePart: 4,
          },
          finished: false,
        };
      } else {
        // Current item is >= insKey: shift it up one position to curIn + 1
        const nextArray = [...state.queArray];
        nextArray[state.curIn + 1] = state.queArray[state.curIn];
        nextArray[state.curIn] = null;
        const nextCurIn = state.curIn - 1;

        if (nextCurIn < 0) {
          // Bottom reached
          return {
            nextState: {
              ...state,
              queArray: nextArray,
              curIn: nextCurIn,
              note: 'Shifting; searching for insertion point',
              codePart: 3, // next step will see curIn < 0 and move to step 4
            },
            finished: false,
          };
        }

        return {
          nextState: {
            ...state,
            queArray: nextArray,
            curIn: nextCurIn,
            note: 'Shifting; searching for insertion point',
            codePart: 3,
          },
          finished: false,
        };
      }
    }

    if (state.codePart === 4) {
      // Place item at curIn
      const nextArray = [...state.queArray];
      nextArray[state.curIn] = state.tempPers;
      const nextNPersons = state.nPersons + 1;
      const nextFront = nextNPersons - 1;

      return {
        nextState: {
          ...state,
          queArray: nextArray,
          nPersons: nextNPersons,
          front: nextFront,
          note: `Inserted item with key ${state.insKey}`,
          codePart: 5,
        },
        finished: false,
      };
    }

    // Step 5: Finish
    return {
      nextState: {
        ...state,
        curIn: -9,
        note: 'Press any button',
        codePart: 1,
        opMode: 'idle',
        isRunning: false,
      },
      finished: true,
    };
  }

  // 3. Remove State Machine (Remove from Front = nPersons - 1)
  if (state.opMode === 'remove') {
    if (state.codePart === 1) {
      const targetIndex = state.nPersons - 1;
      const item = state.queArray[targetIndex];
      const valStr = item ? String(item.height) : '';

      const nextArray = [...state.queArray];
      nextArray[targetIndex] = null;
      const nextNPersons = state.nPersons - 1;
      const nextFront = nextNPersons - 1;

      return {
        nextState: {
          ...state,
          queArray: nextArray,
          nPersons: nextNPersons,
          front: nextFront,
          returnString: valStr,
          note: 'Item removed; value returned in Number',
          codePart: 2,
        },
        finished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
        },
        finished: true,
      };
    }
  }

  // 4. Peek State Machine (View Front Item)
  if (state.opMode === 'peek') {
    if (state.codePart === 1) {
      const item = state.queArray[state.front];
      const valStr = item ? String(item.height) : '';
      return {
        nextState: {
          ...state,
          returnString: valStr,
          note: 'Value returned in Number',
          codePart: 2,
        },
        finished: false,
      };
    } else {
      return {
        nextState: {
          ...state,
          note: 'Press any button',
          codePart: 1,
          opMode: 'idle',
          isRunning: false,
        },
        finished: true,
      };
    }
  }

  return { nextState: state, finished: true };
}
