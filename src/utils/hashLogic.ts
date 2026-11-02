// Robert Lafore's Linear-Probe Hash Table Logic Engine (Chapter 11: Hash Tables)
// Reverse-engineered from Hash_14d4a580.class, personGroup_f2c7777b.class, person_563b6826.class

export interface HashPerson {
  height: number; // 0 to 999, or -1 for deleted item (*Del*)
  color: string;
}

export type HashOpMode = 'idle' | 'new' | 'fill' | 'ins' | 'find' | 'del';

export interface HashState {
  appletWidth: number; // 440
  appletHeight: number; // 300
  topMargin: number; // 80 (draw starts around 89)
  leftMargin: number; // 10
  textHeight: number; // 13
  hF1: number; // 12
  hF2: number; // 6
  hF3: number; // 0
  vF: number; // 8
  nCellsPerCol: number; // 12
  columnWidth: number; // 85
  cellWidth: number; // 35
  cellHeight: number; // 17
  digits3Width: number; // 18
  vertSeparation: number; // 19
  horizSeparation: number; // 60
  noteBoxTop: number; // 55
  noteBoxHeight: number; // 25
  noteBoxWidth: number; // 300
  ASIZE: number; // 60
  MAX_KEY: number; // 999

  personArray: (HashPerson | null)[];
  totalCells: number; // default 60
  nPersons: number;
  tempPers: HashPerson | null;
  note: string;
  fillValue: number;
  insKey: number;
  findKey: number;
  delKey: number;
  codePart: number;
  codePart2: number;
  opMode: HashOpMode;
  curIn: number;
  oldCurIn: number;
  drawMode: number;
  isCollision: boolean;

  isRunning: boolean;
  speedMs: number;
}

export function makePerson(height: number): HashPerson {
  if (height === -1) {
    return {
      height: -1,
      color: '#d4d0c8',
    };
  }
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  return {
    height,
    color: `rgb(${r}, ${g}, ${b})`,
  };
}

export function hashFunction(key: number, totalCells: number): number {
  if (totalCells <= 0) return 0;
  return ((key % totalCells) + totalCells) % totalCells;
}

export function populateInitialHash(
  personArray: (HashPerson | null)[],
  totalCells: number,
  count: number
): number {
  for (let i = 0; i < totalCells; i++) {
    personArray[i] = null;
  }
  let filled = 0;
  for (let attempt = 0; attempt < 500 && filled < count; attempt++) {
    const key = Math.floor(Math.random() * 1000); // 0 to 999
    let cur = hashFunction(key, totalCells);
    let probes = 0;
    while (probes < totalCells) {
      if (personArray[cur] === null) {
        personArray[cur] = makePerson(key);
        filled++;
        break;
      }
      cur = (cur + 1) % totalCells;
      probes++;
    }
  }
  return filled;
}

export function createInitialHashState(initialCells = 60, initialCount = 30): HashState {
  const personArray: (HashPerson | null)[] = new Array(initialCells).fill(null);
  const nPersons = populateInitialHash(personArray, initialCells, initialCount);

  return {
    appletWidth: 440,
    appletHeight: 300,
    topMargin: 80,
    leftMargin: 10,
    textHeight: 13,
    hF1: 12,
    hF2: 6,
    hF3: 0,
    vF: 8,
    nCellsPerCol: 12,
    columnWidth: 85,
    cellWidth: 35,
    cellHeight: 17,
    digits3Width: 18,
    vertSeparation: 19,
    horizSeparation: 60,
    noteBoxTop: 55,
    noteBoxHeight: 25,
    noteBoxWidth: 300,
    ASIZE: 60,
    MAX_KEY: 999,

    personArray,
    totalCells: initialCells,
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
    curIn: -1,
    oldCurIn: -1,
    drawMode: 2,
    isCollision: false,

    isRunning: false,
    speedMs: 350,
  };
}

// 1. New Array trigger
export function startHashNew(state: HashState, isNum: boolean, size?: number): HashState {
  return {
    ...state,
    opMode: 'new',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurIn: state.curIn,
    curIn: -1,
    note: 'Enter size of array to create',
    fillValue: isNum && size !== undefined ? size : 60,
  };
}

// 2. Fill trigger
export function startHashFill(state: HashState, isNum: boolean, count?: number): HashState {
  return {
    ...state,
    opMode: 'fill',
    codePart: 1,
    codePart2: 1,
    drawMode: 1,
    oldCurIn: state.curIn,
    curIn: -1,
    note: 'Enter number of items to fill in',
    fillValue: isNum && count !== undefined ? count : Math.floor(state.totalCells / 2),
  };
}

// 3. Insert trigger
export function startHashInsert(state: HashState, isNum: boolean, key?: number): HashState {
  return {
    ...state,
    opMode: 'ins',
    codePart: 1,
    drawMode: 1,
    oldCurIn: state.curIn,
    curIn: -1,
    note: 'Enter key of item to insert',
    insKey: isNum && key !== undefined ? key : Math.floor(Math.random() * 1000),
    isCollision: false,
  };
}

// 4. Find trigger
export function startHashFind(state: HashState, isNum: boolean, key?: number): HashState {
  return {
    ...state,
    opMode: 'find',
    codePart: 1,
    drawMode: 1,
    oldCurIn: state.curIn,
    curIn: -1,
    note: 'Enter key of item to find',
    findKey: isNum && key !== undefined ? key : Math.floor(Math.random() * 1000),
    isCollision: false,
  };
}

// 5. Delete trigger
export function startHashDelete(state: HashState, isNum: boolean, key?: number): HashState {
  return {
    ...state,
    opMode: 'del',
    codePart: 1,
    drawMode: 1,
    oldCurIn: state.curIn,
    curIn: -1,
    note: 'Enter key of item to delete',
    delKey: isNum && key !== undefined ? key : Math.floor(Math.random() * 1000),
    isCollision: false,
  };
}

// Step runner through the exact state machine
export function stepHash(
  state: HashState,
  inputVal?: number
): { nextState: HashState; finished: boolean } {
  const personArray = [...state.personArray];
  let {
    opMode,
    codePart,
    codePart2,
    totalCells,
    nPersons,
    tempPers,
    note,
    fillValue,
    insKey,
    findKey,
    delKey,
    curIn,
    oldCurIn,
    drawMode,
    isCollision,
  } = state;

  if (opMode === 'idle') {
    return {
      nextState: { ...state, isRunning: false },
      finished: true,
    };
  }

  // --- 1. NEW ARRAY ---
  if (opMode === 'new') {
    switch (codePart) {
      case 1: {
        note = 'Enter size of array to create';
        drawMode = 1;
        codePart = 2;
        oldCurIn = curIn;
        curIn = -1;
        break;
      }
      case 2: {
        const size = inputVal !== undefined && !isNaN(inputVal) ? inputVal : fillValue;
        if (size < 0 || size > 60) {
          note = 'ERROR: use size between 0 and 60';
          codePart = 1;
        } else {
          totalCells = size;
          note = `Will create empty array with ${totalCells} cells`;
          codePart = 5;
        }
        drawMode = 1;
        break;
      }
      case 5: {
        const newArr: (HashPerson | null)[] = new Array(totalCells).fill(null);
        nPersons = 0;
        note = `New array created; total items = ${nPersons}`;
        oldCurIn = curIn;
        curIn = -1;
        drawMode = 2;
        codePart = 6;
        return {
          nextState: {
            ...state,
            personArray: newArr,
            totalCells,
            nPersons,
            note,
            oldCurIn,
            curIn,
            drawMode,
            codePart,
            opMode,
          },
          finished: false,
        };
      }
      case 6: {
        note = 'Press any button';
        drawMode = 1;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            note,
            drawMode,
            codePart,
            opMode,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart = 1;
        opMode = 'idle';
    }
    return {
      nextState: {
        ...state,
        totalCells,
        nPersons,
        note,
        oldCurIn,
        curIn,
        drawMode,
        codePart,
        opMode,
      },
      finished: opMode === 'idle',
    };
  }

  // --- 2. FILL ---
  if (opMode === 'fill') {
    switch (codePart2) {
      case 1: {
        note = 'Enter number of items to fill in';
        drawMode = 1;
        codePart2 = 2;
        oldCurIn = curIn;
        curIn = -1;
        break;
      }
      case 2: {
        const count = inputVal !== undefined && !isNaN(inputVal) ? inputVal : fillValue;
        if (count < 0 || count > totalCells) {
          note = `ERROR: can't fill more than ${totalCells} items`;
          codePart2 = 1;
        } else {
          fillValue = count;
          note = `Will fill in ${fillValue} items`;
          codePart2 = 3;
        }
        drawMode = 1;
        break;
      }
      case 3: {
        const newArr: (HashPerson | null)[] = new Array(totalCells).fill(null);
        nPersons = populateInitialHash(newArr, totalCells, fillValue);
        note = `Fill completed; total items = ${nPersons}`;
        oldCurIn = curIn;
        curIn = -1;
        drawMode = 2;
        codePart2 = 4;
        return {
          nextState: {
            ...state,
            personArray: newArr,
            nPersons,
            note,
            oldCurIn,
            curIn,
            drawMode,
            codePart2,
            opMode,
          },
          finished: false,
        };
      }
      case 4: {
        note = 'Press any button';
        drawMode = 1;
        codePart2 = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            note,
            drawMode,
            codePart2,
            opMode,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart2 = 1;
        opMode = 'idle';
    }
    return {
      nextState: {
        ...state,
        nPersons,
        note,
        oldCurIn,
        curIn,
        drawMode,
        codePart2,
        opMode,
      },
      finished: opMode === 'idle',
    };
  }

  // --- 3. INSERT ---
  if (opMode === 'ins') {
    switch (codePart) {
      case 1: {
        note = 'Enter key of item to insert';
        drawMode = 1;
        codePart = 2;
        break;
      }
      case 2: {
        const key = inputVal !== undefined && !isNaN(inputVal) ? inputVal : insKey;
        if (key < 0 || key > 999) {
          note = "CAN'T INSERT: need key between 0 and 999";
          codePart = 1;
          drawMode = 1;
          break;
        }
        if (nPersons >= totalCells) {
          note = "CAN'T INSERT: array is full";
          codePart = 6;
          drawMode = 1;
          break;
        }
        insKey = key;
        isCollision = false;
        tempPers = makePerson(insKey);
        note = `Will insert item with key ${insKey}`;
        codePart = 3;
        drawMode = 1;
        break;
      }
      case 3: {
        if (!isCollision) {
          oldCurIn = curIn;
          curIn = hashFunction(insKey, totalCells);
          // Check if cell is empty or was deleted
          if (personArray[curIn] === null || personArray[curIn]!.height === -1) {
            personArray[curIn] = tempPers;
            nPersons++;
            note = `Inserted item with key ${insKey} at index ${curIn}`;
            drawMode = 1;
            codePart = 5;
          } else {
            note = `Cell ${curIn} occupied; going to next cell`;
            isCollision = true;
            drawMode = 1;
            codePart = 3;
          }
        } else {
          // Probe next cell
          if (personArray[curIn] === null || personArray[curIn]!.height === -1) {
            personArray[curIn] = tempPers;
            nPersons++;
            note = `Inserted item with key ${insKey} at index ${curIn}`;
            isCollision = false;
            drawMode = 1;
            codePart = 5;
          } else {
            oldCurIn = curIn;
            curIn = (curIn + 1) % totalCells;
            note = 'Searching for unoccupied cell; step was 1';
            codePart = 3;
            drawMode = 1;
          }
        }
        break;
      }
      case 5: {
        note = `Insertion completed; total items = ${nPersons}`;
        drawMode = 1;
        codePart = 6;
        break;
      }
      case 6: {
        oldCurIn = curIn;
        curIn = -1;
        note = 'Press any button';
        drawMode = 1;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            personArray,
            nPersons,
            tempPers,
            note,
            oldCurIn,
            curIn,
            drawMode,
            codePart,
            opMode,
            isCollision: false,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart = 1;
        opMode = 'idle';
    }
    return {
      nextState: {
        ...state,
        personArray,
        nPersons,
        tempPers,
        note,
        insKey,
        oldCurIn,
        curIn,
        drawMode,
        codePart,
        opMode,
        isCollision,
      },
      finished: opMode === 'idle',
    };
  }

  // --- 4. FIND ---
  if (opMode === 'find') {
    switch (codePart) {
      case 1: {
        note = 'Enter key of item to find';
        codePart = 2;
        drawMode = 1;
        break;
      }
      case 2: {
        const key = inputVal !== undefined && !isNaN(inputVal) ? inputVal : findKey;
        if (key < 0 || key > 999) {
          note = 'ERROR: use key between 0 and 999';
          codePart = 1;
          drawMode = 1;
          break;
        }
        findKey = key;
        oldCurIn = curIn;
        curIn = hashFunction(findKey, totalCells);
        isCollision = false;
        note = `Looking for item with key ${findKey} at index ${curIn}`;
        codePart = 3;
        drawMode = 1;
        break;
      }
      case 3: {
        if (personArray[curIn] === null) {
          note = `Can't locate item with key ${findKey}`;
          codePart = 6;
        } else if (personArray[curIn]!.height === findKey) {
          note = `Have found item with key ${findKey}`;
          codePart = 6;
        } else if (!isCollision) {
          note = 'No match; will start probe';
          isCollision = true;
          codePart = 3;
        } else {
          oldCurIn = curIn;
          curIn = (curIn + 1) % totalCells;
          note = 'Checking next cell; step was 1';
          codePart = 3;
        }
        drawMode = 1;
        break;
      }
      case 6: {
        oldCurIn = curIn;
        curIn = -1;
        note = 'Press any button';
        codePart = 1;
        opMode = 'idle';
        drawMode = 1;
        return {
          nextState: {
            ...state,
            note,
            oldCurIn,
            curIn,
            drawMode,
            codePart,
            opMode,
            isCollision: false,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart = 1;
        opMode = 'idle';
    }
    return {
      nextState: {
        ...state,
        note,
        findKey,
        oldCurIn,
        curIn,
        drawMode,
        codePart,
        opMode,
        isCollision,
      },
      finished: opMode === 'idle',
    };
  }

  // --- 5. DELETE ---
  if (opMode === 'del') {
    switch (codePart) {
      case 1: {
        note = 'Enter key of item to delete';
        codePart = 2;
        drawMode = 1;
        break;
      }
      case 2: {
        const key = inputVal !== undefined && !isNaN(inputVal) ? inputVal : delKey;
        if (key < 0 || key > 999) {
          note = 'ERROR: use key between 0 and 999';
          codePart = 1;
          drawMode = 1;
          break;
        }
        delKey = key;
        oldCurIn = curIn;
        curIn = hashFunction(delKey, totalCells);
        isCollision = false;
        note = `Looking for item with key ${delKey} at index ${curIn}`;
        codePart = 3;
        drawMode = 1;
        break;
      }
      case 3: {
        if (personArray[curIn] === null) {
          note = `Can't locate item with key ${delKey}`;
          codePart = 6;
        } else if (personArray[curIn]!.height === delKey) {
          note = `Have found item with key ${delKey}`;
          codePart = 5;
        } else if (!isCollision) {
          note = 'No match; will start probe';
          isCollision = true;
          codePart = 3;
        } else {
          oldCurIn = curIn;
          curIn = (curIn + 1) % totalCells;
          note = 'Checking next cell; step was 1';
          codePart = 3;
        }
        drawMode = 1;
        break;
      }
      case 5: {
        // Place sentinel deleted node
        personArray[curIn] = makePerson(-1); // *Del*
        nPersons = Math.max(0, nPersons - 1);
        note = `Deleted item with key ${delKey}; total persons = ${nPersons}`;
        codePart = 6;
        drawMode = 1;
        break;
      }
      case 6: {
        oldCurIn = curIn;
        curIn = -1;
        note = 'Press any button';
        codePart = 1;
        opMode = 'idle';
        drawMode = 1;
        return {
          nextState: {
            ...state,
            personArray,
            nPersons,
            note,
            oldCurIn,
            curIn,
            drawMode,
            codePart,
            opMode,
            isCollision: false,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart = 1;
        opMode = 'idle';
    }
    return {
      nextState: {
        ...state,
        personArray,
        nPersons,
        note,
        delKey,
        oldCurIn,
        curIn,
        drawMode,
        codePart,
        opMode,
        isCollision,
      },
      finished: opMode === 'idle',
    };
  }

  return { nextState: state, finished: true };
}
