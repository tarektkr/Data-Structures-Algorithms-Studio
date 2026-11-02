export interface PersonQueueItem {
  height: number;
  color: string;
}

export interface QueueState {
  aSize: number; // 10
  queArray: (PersonQueueItem | null)[]; // 10 slots (0 to 9)
  nPersons: number; // 0 to 10
  front: number; // 0 to 9
  rear: number; // -1 to 9 (wraps around)
  oldFront: number;
  oldRear: number;
  insKey: number;
  tempPers: PersonQueueItem | null;
  note: string;
  returnString: string;
  codePart: number; // 1: initial, 2..: sub-steps
  opMode: 'idle' | 'new' | 'insert' | 'remove' | 'peek';
  isRunning: boolean;
  stepByStep: boolean;
  speedMs: number;
}

// Generate pastel colors matching Robert Lafore applet palette
function generatePerson(key: number): PersonQueueItem {
  // r = 100 + random * 155, g = 100 + random * 155, b = 100 + random * 155
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    height: key,
    color: hex,
  };
}

export function createInitialQueueState(): QueueState {
  const queArray: (PersonQueueItem | null)[] = new Array(10).fill(null);

  // Initial fill with 4 random elements (as in Robert Lafore Queue applet: INIT_NUM = 4)
  const initialKeys = [245, 612, 108, 489];
  for (let i = 0; i < 4; i++) {
    const key = initialKeys[i] ?? Math.floor(Math.random() * 900) + 50;
    queArray[i] = generatePerson(key);
  }

  return {
    aSize: 10,
    queArray,
    nPersons: 4,
    front: 0,
    rear: 3,
    oldFront: 0,
    oldRear: 3,
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

export function startInsert(state: QueueState, isNumber: boolean, value: number): QueueState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T INSERT: need key between 0 and 999",
      isRunning: false,
    };
  }

  if (state.nPersons >= 10) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
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
    codePart: 1,
    note: `Will insert item with key ${value}`,
  };
}

export function startRemove(state: QueueState): QueueState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T REMOVE: queue is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'remove',
    codePart: 1,
    note: 'Will remove item from front of queue',
    returnString: '',
  };
}

export function startPeek(state: QueueState): QueueState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T PEEK: queue is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'peek',
    codePart: 1,
    note: 'Will peek at item at front of queue',
    returnString: '',
  };
}

export function startNewQueue(state: QueueState): QueueState {
  return {
    ...state,
    opMode: 'new',
    codePart: 1,
    note: 'Will create new queue',
  };
}

export function stepQueue(state: QueueState): { nextState: QueueState; finished: boolean } {
  if (state.opMode === 'idle') {
    return { nextState: state, finished: true };
  }

  // 1. New Queue State Machine
  if (state.opMode === 'new') {
    if (state.codePart === 1) {
      // Step 2: Clear array and reset pointers
      const emptyArray = new Array(10).fill(null);
      return {
        nextState: {
          ...state,
          queArray: emptyArray,
          nPersons: 0,
          oldFront: state.front,
          front: 0,
          oldRear: state.rear,
          rear: -1,
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

  // 2. Insert (Ins) State Machine
  if (state.opMode === 'insert') {
    if (state.codePart === 1) {
      // Step 2: Check bounds
      if (state.nPersons >= 10) {
        return {
          nextState: {
            ...state,
            note: "CAN'T INSERT: queue is full",
            codePart: 3,
          },
          finished: false,
        };
      }

      // Step 3: Advance rear (with circular wrap-around) and insert item
      let nextRear = state.rear;
      if (nextRear >= 9) {
        nextRear = -1; // wrap-around!
      }
      nextRear++;

      const nextArray = [...state.queArray];
      nextArray[nextRear] = state.tempPers;
      const nextNPersons = state.nPersons + 1;

      return {
        nextState: {
          ...state,
          oldRear: state.rear,
          rear: nextRear,
          nPersons: nextNPersons,
          queArray: nextArray,
          note: `Inserted item with key ${state.insKey}`,
          codePart: 2,
        },
        finished: false,
      };
    } else {
      // Step 4: Complete
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

  // 3. Remove (Rem) State Machine
  if (state.opMode === 'remove') {
    if (state.codePart === 1) {
      // Step 2: Remove item at front, extract value, advance front pointer
      const targetIndex = state.front;
      const item = state.queArray[targetIndex];
      const valStr = item ? String(item.height) : '';

      const nextArray = [...state.queArray];
      nextArray[targetIndex] = null;
      const nextNPersons = state.nPersons - 1;

      let nextFront = state.front + 1;
      if (nextFront > 9) {
        nextFront = 0; // wrap-around!
      }

      return {
        nextState: {
          ...state,
          queArray: nextArray,
          nPersons: nextNPersons,
          oldFront: state.front,
          front: nextFront,
          returnString: valStr,
          note: 'Item removed; value returned in Number',
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

  // 4. Peek State Machine
  if (state.opMode === 'peek') {
    if (state.codePart === 1) {
      // Step 2: Read value from front
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

  return { nextState: state, finished: true };
}
