export interface PersonItem {
  height: number;
  color: string;
}

export interface LinkItem {
  persData: PersonItem;
}

export interface LinkListState {
  aSize: number; // 28
  linkArray: (LinkItem | null)[]; // max 28 links
  totalLinks: number; // 0 to 28
  tempPers: PersonItem | null;
  note: string;
  fillValue: number;
  insKey: number;
  findKey: number;
  delKey: number;
  codePart: number;
  opMode: 'idle' | 'new' | 'insert' | 'find' | 'delete';
  curIn: number; // -1 when idle, 0..27 during traversal
  oldCurIn: number;
  notSorted: boolean; // true: unsorted, false: sorted
  isOKChangeSort: boolean;
  insDex: number;
  areInserting: boolean;
  insertAtEnd: boolean;
  delDex: number;
  areDeleting: boolean;
  isRunning: boolean;
  stepByStep: boolean;
  speedMs: number;
}

// Generate pastel colors matching Robert Lafore palette
function generatePerson(key: number): PersonItem {
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    height: key,
    color: hex,
  };
}

export function createInitialLinkListState(notSorted: boolean = true, initialCount: number = 10): LinkListState {
  const linkArray: (LinkItem | null)[] = new Array(28).fill(null);

  if (notSorted) {
    // 10 unsorted items
    const sampleKeys = [472, 183, 791, 329, 614, 85, 940, 258, 516, 703];
    for (let i = 0; i < initialCount; i++) {
      const key = sampleKeys[i] ?? Math.floor(Math.random() * 900) + 50;
      linkArray[i] = { persData: generatePerson(key) };
    }
  } else {
    // 10 sorted ascending items
    const sampleKeys = [74, 156, 239, 342, 481, 560, 678, 792, 854, 930];
    for (let i = 0; i < initialCount; i++) {
      const key = sampleKeys[i] ?? Math.floor(Math.random() * 900) + 50;
      linkArray[i] = { persData: generatePerson(key) };
    }
  }

  return {
    aSize: 28,
    linkArray,
    totalLinks: initialCount,
    tempPers: null,
    note: 'Press any button',
    fillValue: 10,
    insKey: 0,
    findKey: 0,
    delKey: 0,
    codePart: 1,
    opMode: 'idle',
    curIn: -1,
    oldCurIn: -1,
    notSorted,
    isOKChangeSort: false,
    insDex: 0,
    areInserting: false,
    insertAtEnd: false,
    delDex: 0,
    areDeleting: false,
    isRunning: false,
    stepByStep: false,
    speedMs: 350,
  };
}

export function setSortStatus(state: LinkListState, notSorted: boolean): LinkListState {
  if (state.isOKChangeSort) {
    return {
      ...state,
      notSorted,
      note: notSorted ? 'Data will not be sorted' : 'Data will be sorted',
    };
  }

  return {
    ...state,
    note: 'To change sort status, create list with New',
  };
}

export function startNewList(state: LinkListState, isNumber: boolean, value: number): LinkListState {
  if (state.opMode !== 'new') {
    return {
      ...state,
      opMode: 'new',
      codePart: 1,
      curIn: -1,
      oldCurIn: -1,
      areInserting: false,
      areDeleting: false,
      isOKChangeSort: false,
      note: 'Enter size of linked list to create',
    };
  }

  return state;
}

export function startInsert(state: LinkListState, isNumber: boolean, value: number): LinkListState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -1,
      note: "CAN'T INSERT: need key between 0 and 999",
      isRunning: false,
    };
  }

  if (state.totalLinks >= 28) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -1,
      note: "CAN'T INSERT: no room in display",
      isRunning: false,
    };
  }

  const tempPers = generatePerson(value);

  if (state.notSorted) {
    return {
      ...state,
      insKey: value,
      tempPers,
      curIn: -1,
      insertAtEnd: false,
      opMode: 'insert',
      codePart: 4, // Head insertion directly triggers splice animation
      note: `Will insert item with key ${value}`,
    };
  }

  // Sorted insertion: search begins from head (curIn = 0)
  return {
    ...state,
    insKey: value,
    tempPers,
    curIn: 0,
    insertAtEnd: false,
    opMode: 'insert',
    codePart: 3,
    note: 'Will search for insertion point',
  };
}

export function startFind(state: LinkListState, isNumber: boolean, value: number): LinkListState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -1,
      note: 'ERROR: use key between 0 and 999',
      isRunning: false,
    };
  }

  return {
    ...state,
    findKey: value,
    curIn: 0,
    oldCurIn: -1,
    opMode: 'find',
    codePart: 3,
    note: `Looking for item with key ${value}`,
  };
}

export function startDelete(state: LinkListState, isNumber: boolean, value: number): LinkListState {
  if (!isNumber || value < 0 || value > 999) {
    return {
      ...state,
      opMode: 'idle',
      codePart: 1,
      curIn: -1,
      note: 'ERROR: use key between 0 and 999',
      isRunning: false,
    };
  }

  return {
    ...state,
    delKey: value,
    curIn: 0,
    oldCurIn: -1,
    opMode: 'delete',
    codePart: 3,
    note: `Looking for item with key ${value}`,
  };
}

export function stepLinkList(state: LinkListState, inputValue?: number): {
  nextState: LinkListState;
  finished: boolean;
} {
  if (state.opMode === 'idle') {
    return { nextState: state, finished: true };
  }

  // 1. New List State Machine
  if (state.opMode === 'new') {
    if (state.codePart === 1) {
      // Step 2: Validate size
      const val = inputValue !== undefined ? inputValue : state.fillValue;
      if (val < 0 || val > 28) {
        return {
          nextState: {
            ...state,
            note: 'ERROR: use size between 0 and 28',
            codePart: 1,
            opMode: 'idle',
            isRunning: false,
          },
          finished: true,
        };
      }
      return {
        nextState: {
          ...state,
          fillValue: val,
          note: `Will create list with ${val} links`,
          codePart: 3,
          isOKChangeSort: true,
        },
        finished: false,
      };
    }

    if (state.codePart === 3) {
      // Prompt user to select unsorted or sorted
      return {
        nextState: {
          ...state,
          note: 'Select unsorted or sorted data',
          codePart: 4,
          isOKChangeSort: true,
        },
        finished: false,
      };
    }

    if (state.codePart === 4) {
      // Confirm sort choice
      return {
        nextState: {
          ...state,
          note: state.notSorted ? 'Data will not be sorted' : 'Data will be sorted',
          codePart: 5,
        },
        finished: false,
      };
    }

    if (state.codePart === 5) {
      // Populate array with fillValue elements
      const newArray: (LinkItem | null)[] = new Array(28).fill(null);
      const count = state.fillValue;

      if (state.notSorted) {
        for (let i = 0; i < count; i++) {
          const key = Math.floor(Math.random() * 900) + 50;
          newArray[i] = { persData: generatePerson(key) };
        }
      } else {
        const sortedKeys: number[] = [];
        let curVal = Math.floor(Math.random() * 50) + 30;
        for (let i = 0; i < count; i++) {
          sortedKeys.push(curVal);
          curVal += Math.floor(Math.random() * 70) + 20;
          if (curVal > 999) curVal = 999;
        }
        for (let i = 0; i < count; i++) {
          newArray[i] = { persData: generatePerson(sortedKeys[i]) };
        }
      }

      return {
        nextState: {
          ...state,
          linkArray: newArray,
          totalLinks: count,
          curIn: -1,
          oldCurIn: -1,
          isOKChangeSort: false,
          note: `New list created; total links = ${count}`,
          codePart: 6,
        },
        finished: false,
      };
    }

    // Step 6: Complete
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

  // 2. Insert State Machine
  if (state.opMode === 'insert') {
    if (state.codePart === 3) {
      // Search loop for sorted insertion
      if (state.curIn >= state.totalLinks) {
        // Insertion point at end of list
        return {
          nextState: {
            ...state,
            note: 'Found insertion point at end of list',
            insertAtEnd: true,
            codePart: 4,
          },
          finished: false,
        };
      }

      const current = state.linkArray[state.curIn];
      if (current && state.insKey <= current.persData.height) {
        // Insertion point found before current link
        return {
          nextState: {
            ...state,
            note: 'Have found insertion point',
            insertAtEnd: false,
            codePart: 4,
          },
          finished: false,
        };
      }

      // Advance search
      return {
        nextState: {
          ...state,
          note: 'Searching for insertion point',
          oldCurIn: state.curIn,
          curIn: state.curIn + 1,
          codePart: 3,
        },
        finished: false,
      };
    }

    if (state.codePart === 4) {
      // Visual splice animation step (shows redirected pointers)
      const insDex = state.notSorted ? 0 : state.curIn;
      return {
        nextState: {
          ...state,
          areInserting: true,
          insDex,
          note: 'Inserted item; will redraw list',
          codePart: 5,
        },
        finished: false,
      };
    }

    if (state.codePart === 5) {
      // Commit inserted link into linkArray
      const nextArray = [...state.linkArray];
      const newLink: LinkItem = { persData: state.tempPers! };

      if (state.insertAtEnd) {
        nextArray[state.curIn] = newLink;
      } else {
        const insDex = state.notSorted ? 0 : state.curIn;
        for (let i = state.totalLinks; i > insDex; i--) {
          nextArray[i] = nextArray[i - 1];
        }
        nextArray[insDex] = newLink;
      }

      const newTotal = state.totalLinks + 1;
      const noteStr = state.insertAtEnd
        ? `Inserted item with key ${state.insKey} at end of list`
        : `Inserted item with key ${state.insKey}`;

      return {
        nextState: {
          ...state,
          linkArray: nextArray,
          totalLinks: newTotal,
          areInserting: false,
          note: noteStr,
          codePart: 6,
        },
        finished: false,
      };
    }

    if (state.codePart === 6) {
      return {
        nextState: {
          ...state,
          note: `Insertion completed; total items = ${state.totalLinks}`,
          codePart: 7,
        },
        finished: false,
      };
    }

    // Step 7: Finish
    return {
      nextState: {
        ...state,
        curIn: -1,
        oldCurIn: -1,
        note: 'Press any button',
        codePart: 1,
        opMode: 'idle',
        isRunning: false,
      },
      finished: true,
    };
  }

  // 3. Find State Machine
  if (state.opMode === 'find') {
    if (state.codePart === 3) {
      if (state.curIn < state.totalLinks) {
        const current = state.linkArray[state.curIn];
        if (current && current.persData.height === state.findKey) {
          // Found!
          return {
            nextState: {
              ...state,
              note: `Have found item with key ${state.findKey}`,
              codePart: 6,
            },
            finished: false,
          };
        }

        // In sorted list, if current item > findKey, cannot be in remaining list
        if (!state.notSorted && current && current.persData.height > state.findKey) {
          return {
            nextState: {
              ...state,
              note: `Can't locate item with key ${state.findKey}`,
              codePart: 6,
            },
            finished: false,
          };
        }

        // Continue search
        return {
          nextState: {
            ...state,
            note: `Searching for item with key ${state.findKey}`,
            oldCurIn: state.curIn,
            curIn: state.curIn + 1,
            codePart: 3,
          },
          finished: false,
        };
      }

      // Past end of list: not found
      return {
        nextState: {
          ...state,
          note: `Can't locate item with key ${state.findKey}`,
          codePart: 6,
        },
        finished: false,
      };
    }

    // Step 6: Finish
    return {
      nextState: {
        ...state,
        curIn: -1,
        oldCurIn: -1,
        note: 'Press any button',
        codePart: 1,
        opMode: 'idle',
        isRunning: false,
      },
      finished: true,
    };
  }

  // 4. Delete State Machine
  if (state.opMode === 'delete') {
    if (state.codePart === 3) {
      if (state.curIn < state.totalLinks) {
        const current = state.linkArray[state.curIn];
        if (current && current.persData.height === state.delKey) {
          // Found target link to delete!
          return {
            nextState: {
              ...state,
              delDex: state.curIn,
              note: `Have found item with key ${state.delKey}`,
              codePart: 4,
            },
            finished: false,
          };
        }

        // If sorted and item > delKey, not in list
        if (!state.notSorted && current && current.persData.height > state.delKey) {
          return {
            nextState: {
              ...state,
              note: `Can't locate item with key ${state.delKey}`,
              codePart: 6,
            },
            finished: false,
          };
        }

        // Continue searching
        return {
          nextState: {
            ...state,
            note: `Searching for item with key ${state.delKey}`,
            oldCurIn: state.curIn,
            curIn: state.curIn + 1,
            codePart: 3,
          },
          finished: false,
        };
      }

      // Not found
      return {
        nextState: {
          ...state,
          note: `Can't locate item with key ${state.delKey}`,
          codePart: 6,
        },
        finished: false,
      };
    }

    if (state.codePart === 4) {
      // Visual bypass animation step (shows bypassed pointer skipping over delDex)
      return {
        nextState: {
          ...state,
          areDeleting: true,
          note: 'Deleted item; will redraw list',
          codePart: 5,
        },
        finished: false,
      };
    }

    if (state.codePart === 5) {
      // Shift array down over delDex
      const nextArray = [...state.linkArray];
      for (let i = state.delDex; i < state.totalLinks - 1; i++) {
        nextArray[i] = nextArray[i + 1];
      }
      nextArray[state.totalLinks - 1] = null;
      const newTotal = state.totalLinks - 1;

      return {
        nextState: {
          ...state,
          linkArray: nextArray,
          totalLinks: newTotal,
          areDeleting: false,
          note: `Deleted item with key ${state.delKey}`,
          codePart: 6,
        },
        finished: false,
      };
    }

    // Step 6: Finish
    return {
      nextState: {
        ...state,
        curIn: -1,
        oldCurIn: -1,
        note: 'Press any button',
        codePart: 1,
        opMode: 'idle',
        isRunning: false,
      },
      finished: true,
    };
  }

  return { nextState: state, finished: true };
}
