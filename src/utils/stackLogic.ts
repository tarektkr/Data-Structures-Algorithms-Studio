export interface PersonStackItem {
  height: number;
  color: string;
}

export interface StackState {
  aSize: number; // 10
  stackArray: (PersonStackItem | null)[]; // 11 slots (0 to 10)
  nPersons: number; // 0 to 10
  curIn: number; // Top pointer index
  oldCurIn: number;
  insKey: number;
  tempPers: PersonStackItem | null;
  note: string;
  returnString: string;
  codePart: number; // 1: initial, 2..: sub-steps
  opMode: 'idle' | 'new' | 'push' | 'pop' | 'peek';
  isRunning: boolean;
  stepByStep: boolean;
  speedMs: number;
}

// Generate distinct colors matching Robert Lafore applet palette
function generatePerson(key: number): PersonStackItem {
  const r = Math.floor(Math.random() * 200) + 30;
  const g = Math.floor(Math.random() * 200) + 30;
  const b = Math.floor(Math.random() * 200) + 30;
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    height: key,
    color: hex,
  };
}

export function createInitialStackState(): StackState {
  const stackArray: (PersonStackItem | null)[] = new Array(11).fill(null);

  // Initial fill with 4 random elements (as in Robert Lafore Stack applet: INIT_NUM = 4)
  const initialKeys = [123, 456, 789, 321];
  for (let i = 0; i < 4; i++) {
    const key = initialKeys[i] ?? Math.floor(Math.random() * 900) + 100;
    stackArray[i] = generatePerson(key);
  }

  return {
    aSize: 10,
    stackArray,
    nPersons: 4,
    curIn: 4,
    oldCurIn: 4,
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

export function startPush(state: StackState, isNumber: boolean, value: number): StackState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T PUSH: need key between 0 and 999",
      isRunning: false,
    };
  }

  if (state.nPersons >= 10) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T PUSH: stack is full",
      isRunning: false,
    };
  }

  const tempPers = generatePerson(value);
  return {
    ...state,
    insKey: value,
    tempPers,
    opMode: 'push',
    codePart: 1,
    note: `Will push item with key ${value}`,
  };
}

export function startPop(state: StackState): StackState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T POP: stack is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'pop',
    codePart: 1,
    note: 'Will pop item from top of stack',
    returnString: '',
  };
}

export function startPeek(state: StackState): StackState {
  if (state.nPersons <= 0) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      note: "CAN'T PEEK: stack is empty",
      returnString: '',
      isRunning: false,
    };
  }

  return {
    ...state,
    opMode: 'peek',
    codePart: 1,
    note: 'Will peek at item at top of stack',
    returnString: '',
  };
}

export function startNewStack(state: StackState): StackState {
  return {
    ...state,
    opMode: 'new',
    codePart: 1,
    note: 'Will create new, empty stack',
  };
}

export function stepStack(state: StackState): { nextState: StackState; finished: boolean } {
  if (state.opMode === 'idle') {
    return { nextState: state, finished: true };
  }

  if (state.opMode === 'new') {
    if (state.codePart === 1) {
      // Step 2: Clear stack
      const newArray = new Array(11).fill(null);
      return {
        nextState: {
          ...state,
          stackArray: newArray,
          nPersons: 0,
          oldCurIn: state.curIn,
          curIn: 0,
          note: 'New stack created',
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

  if (state.opMode === 'push') {
    if (state.codePart === 1) {
      // Step 2: Increment top
      const nextNPersons = state.nPersons + 1;
      return {
        nextState: {
          ...state,
          nPersons: nextNPersons,
          oldCurIn: state.curIn,
          curIn: nextNPersons,
          note: 'Incremented top',
          codePart: 2,
        },
        finished: false,
      };
    } else if (state.codePart === 2) {
      // Step 3: Insert item at top
      const nextArray = [...state.stackArray];
      nextArray[state.nPersons - 1] = state.tempPers;
      return {
        nextState: {
          ...state,
          stackArray: nextArray,
          note: `Inserted item with key ${state.insKey} at top`,
          codePart: 3,
        },
        finished: false,
      };
    } else {
      // Step 4: Finished
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

  if (state.opMode === 'pop') {
    if (state.codePart === 1) {
      // Step 2: Remove item and get value
      const targetIndex = state.nPersons - 1;
      const item = state.stackArray[targetIndex];
      const valStr = item ? String(item.height) : '';
      const nextArray = [...state.stackArray];
      nextArray[targetIndex] = null;
      return {
        nextState: {
          ...state,
          stackArray: nextArray,
          returnString: valStr,
          note: 'Item removed; value returned in Number',
          codePart: 2,
        },
        finished: false,
      };
    } else if (state.codePart === 2) {
      // Step 3: Decrement top
      const nextNPersons = state.nPersons - 1;
      return {
        nextState: {
          ...state,
          nPersons: nextNPersons,
          oldCurIn: state.curIn,
          curIn: nextNPersons,
          note: 'Decremented top',
          codePart: 3,
        },
        finished: false,
      };
    } else {
      // Step 4: Finished
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

  if (state.opMode === 'peek') {
    if (state.codePart === 1) {
      // Step 2: Read value from top
      const targetIndex = state.nPersons - 1;
      const item = state.stackArray[targetIndex];
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
      // Step 3: Finished
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
