// Robert Lafore's Binary Tree Logic Engine (Chapter 9: Binary Trees)
// Reverse-engineered from Tree_77f83d03.class, personGroup_8ef00881.class, person_3005aeb9.class, stack_79803ef1.class

export interface TreeNode {
  height: number; // 0 to 99
  color: string; // Pastel/distinct color
}

export type TreeOpMode = 'idle' | 'fill' | 'find' | 'ins' | 'trav' | 'del';

export interface TreeState {
  appletWidth: number; // 440
  appletHeight: number; // 300
  maxHeight: number; // 200
  topMargin: number; // 70
  leftMargin: number; // 10
  textHeight: number; // 13
  nodeDiameter: number; // 20
  levelSeparation: number; // 40
  horizSeparation: number; // 26
  noteBoxTop: number; // 45
  noteBoxHeight: number; // 25
  noteBoxWidth: number; // 200 (display up to 420)
  visitBoxTop: number; // 280
  visitBoxHeight: number; // 25
  visitBoxWidth: number; // 430
  ASIZE: number; // 31
  MAX_KEY: number; // 99
  treeArray: (TreeNode | null)[]; // length 31
  theStack: number[]; // Explicit LIFO stack for traversal node indexes
  filledNodes: number;
  note: string;
  isRand: boolean;
  value: number;
  codePart: number;
  opMode: TreeOpMode;
  curIn: number;
  curInOld: number;
  oldArrow: number;
  visitArray: number[];
  visitIndex: number;
  successor: number;
  drawAll: boolean;
  drawMode: number;
  isRunning: boolean;
  speedMs: number;
}

export function createNode(height: number): TreeNode {
  const r = Math.floor(Math.random() * 155) + 100;
  const g = Math.floor(Math.random() * 155) + 100;
  const b = Math.floor(Math.random() * 155) + 100;
  return {
    height,
    color: `rgb(${r}, ${g}, ${b})`,
  };
}

// Helper: accurate recursive subtree shift for array-based BST
export function shiftSubtreeUp(treeArray: (TreeNode | null)[], srcIdx: number, dstIdx: number): void {
  if (srcIdx >= 31) return;
  treeArray[dstIdx] = treeArray[srcIdx];
  treeArray[srcIdx] = null;

  const leftSrc = 2 * srcIdx + 1;
  const rightSrc = 2 * srcIdx + 2;
  const leftDst = 2 * dstIdx + 1;
  const rightDst = 2 * dstIdx + 2;

  if (leftSrc < 31 && leftDst < 31) {
    shiftSubtreeUp(treeArray, leftSrc, leftDst);
  }
  if (rightSrc < 31 && rightDst < 31) {
    shiftSubtreeUp(treeArray, rightSrc, rightDst);
  }
}

// Inorder successor in right subtree
export function findInorderSuccessor(treeArray: (TreeNode | null)[], nodeIndex: number): number {
  let successor = nodeIndex;
  let current = 2 * nodeIndex + 2; // Right child
  while (current < 31 && treeArray[current] !== null) {
    successor = current;
    current = 2 * current + 1; // Left child
  }
  return successor;
}

// Initial populate of random nodes
export function populateInitialTree(treeArray: (TreeNode | null)[], nodeCount: number): number {
  for (let i = 0; i < 31; i++) {
    treeArray[i] = null;
  }
  let filled = 0;
  const usedKeys: boolean[] = new Array(100).fill(false);

  for (let attempt = 0; attempt < 100 && filled < nodeCount; attempt++) {
    const key = Math.floor(Math.random() * 100);
    if (usedKeys[key]) continue;

    const newNode = createNode(key);
    let cur = 0;

    while (cur <= 30) {
      if (treeArray[cur] === null) {
        treeArray[cur] = newNode;
        usedKeys[key] = true;
        filled++;
        break;
      }
      if (key < treeArray[cur]!.height) {
        cur = 2 * cur + 1;
      } else {
        cur = 2 * cur + 2;
      }
    }
  }
  return filled;
}

export function createInitialTreeState(): TreeState {
  const treeArray: (TreeNode | null)[] = new Array(31).fill(null);
  const filled = populateInitialTree(treeArray, 10);

  return {
    appletWidth: 440,
    appletHeight: 300,
    maxHeight: 200,
    topMargin: 70,
    leftMargin: 10,
    textHeight: 13,
    nodeDiameter: 20,
    levelSeparation: 40,
    horizSeparation: 26,
    noteBoxTop: 45,
    noteBoxHeight: 25,
    noteBoxWidth: 200,
    visitBoxTop: 280,
    visitBoxHeight: 25,
    visitBoxWidth: 430,
    ASIZE: 31,
    MAX_KEY: 99,
    treeArray,
    theStack: [],
    filledNodes: filled,
    note: 'Press a button',
    isRand: true,
    value: 0,
    codePart: 1,
    opMode: 'idle',
    curIn: -1,
    curInOld: -1,
    oldArrow: -1,
    visitArray: [],
    visitIndex: 0,
    successor: -1,
    drawAll: true,
    drawMode: 2,
    isRunning: false,
    speedMs: 350,
  };
}

// Operation triggers from UI Buttons:
export function startTreeFill(state: TreeState, isNum: boolean, num?: number): TreeState {
  return {
    ...state,
    opMode: 'fill',
    codePart: 1,
    value: isNum && num !== undefined ? num : Math.floor(Math.random() * 15) + 5,
    isRand: !isNum,
    visitArray: [],
    visitIndex: 0,
    curIn: 0,
    oldArrow: state.curInOld,
    curInOld: 0,
    drawMode: 0,
    note: 'Enter number of nodes (1 to 31)',
  };
}

export function startTreeFind(state: TreeState, isNum: boolean, num?: number): TreeState {
  const val = isNum && num !== undefined ? num : Math.floor(Math.random() * 100);
  return {
    ...state,
    opMode: 'find',
    codePart: 1,
    value: val,
    isRand: !isNum,
    visitArray: [],
    visitIndex: 0,
    curIn: 0,
    oldArrow: state.curInOld,
    curInOld: 0,
    drawMode: 0,
    note: 'Enter key of node to find',
  };
}

export function startTreeInsert(state: TreeState, isNum: boolean, num?: number): TreeState {
  const val = isNum && num !== undefined ? num : Math.floor(Math.random() * 100);
  return {
    ...state,
    opMode: 'ins',
    codePart: 1,
    value: val,
    isRand: !isNum,
    visitArray: [],
    visitIndex: 0,
    curIn: 0,
    oldArrow: state.curInOld,
    curInOld: 0,
    drawMode: 0,
    note: 'Enter value of node to insert',
  };
}

export function startTreeTraverse(state: TreeState): TreeState {
  return {
    ...state,
    opMode: 'trav',
    codePart: 1,
    theStack: [],
    visitArray: [],
    visitIndex: 0,
    curIn: 0,
    oldArrow: state.curInOld,
    curInOld: 0,
    drawMode: 0,
    note: 'Will traverse tree in "inorder"',
  };
}

export function startTreeDelete(state: TreeState, isNum: boolean, num?: number): TreeState {
  const val = isNum && num !== undefined ? num : Math.floor(Math.random() * 100);
  return {
    ...state,
    opMode: 'del',
    codePart: 1,
    value: val,
    isRand: !isNum,
    visitArray: [],
    visitIndex: 0,
    curIn: 0,
    oldArrow: state.curInOld,
    curInOld: 0,
    drawMode: 0,
    note: 'Enter key of node to delete',
  };
}

// Step function executing one micro-step of the current operation state machine
export function stepTree(state: TreeState, inputVal?: number): { nextState: TreeState; finished: boolean } {
  const tree = [...state.treeArray];
  let {
    opMode,
    codePart,
    value,
    curIn,
    curInOld,
    oldArrow,
    note,
    filledNodes,
    theStack,
    visitArray,
    visitIndex,
    successor,
    drawMode,
  } = state;

  theStack = [...theStack];
  visitArray = [...visitArray];

  if (opMode === 'idle') {
    return {
      nextState: { ...state, isRunning: false },
      finished: true,
    };
  }

  // --- 1. FILL OPERATION ---
  if (opMode === 'fill') {
    switch (codePart) {
      case 1: {
        visitIndex = 0;
        visitArray = [];
        note = 'Enter number of nodes (1 to 31)';
        curIn = 0;
        oldArrow = curInOld;
        curInOld = 0;
        drawMode = 0;
        codePart = 2;
        break;
      }
      case 2: {
        const count = inputVal !== undefined && inputVal >= 1 && inputVal <= 31 ? inputVal : value;
        if (count < 1 || count > 31) {
          note = 'Inappropriate number of nodes';
          codePart = 1;
        } else {
          value = count;
          note = `Will create tree of ${count} nodes`;
          codePart = 3;
        }
        break;
      }
      case 3: {
        filledNodes = populateInitialTree(tree, value);
        drawMode = 2;
        note = 'Press any button';
        oldArrow = curInOld;
        curInOld = 0;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            treeArray: tree,
            filledNodes,
            note,
            drawMode,
            codePart,
            opMode,
            curIn: -1,
            curInOld: -1,
            oldArrow: -1,
            isRunning: false,
          },
          finished: true,
        };
      }
      default:
        codePart = 1;
        opMode = 'idle';
        break;
    }
  }

  // --- 2. FIND OPERATION ---
  else if (opMode === 'find') {
    switch (codePart) {
      case 1: {
        visitIndex = 0;
        note = 'Enter key of node to find';
        curIn = 0;
        oldArrow = curInOld;
        curInOld = 0;
        drawMode = 0;
        codePart = 2;
        break;
      }
      case 2: {
        const target = inputVal !== undefined && inputVal >= 0 && inputVal <= 99 ? inputVal : value;
        if (target < 0 || target > 99) {
          note = 'Nodes have values from 0 to 99';
          codePart = 1;
        } else {
          value = target;
          note = `Will try to find node with key ${target}`;
          codePart = 3;
        }
        break;
      }
      case 3: {
        if (tree[curIn] === null) {
          note = "Can't find node with that value";
          codePart = 1;
          opMode = 'idle';
          return {
            nextState: {
              ...state,
              note,
              codePart,
              opMode,
              isRunning: false,
            },
            finished: true,
          };
        }

        if (value === tree[curIn]!.height) {
          note = `Have found node ${value}`;
          oldArrow = curInOld;
          curInOld = curIn;
          codePart = 4;
        } else {
          oldArrow = curInOld;
          curInOld = curIn;
          if (value < tree[curIn]!.height) {
            curIn = 2 * curIn + 1;
            note = 'Going to left child';
          } else {
            curIn = 2 * curIn + 2;
            note = 'Going to right child';
          }

          if (curIn > 30 || tree[curIn] === null) {
            note = "Can't find node with that value";
            codePart = 1;
            opMode = 'idle';
            return {
              nextState: {
                ...state,
                note,
                curIn,
                curInOld,
                oldArrow,
                codePart,
                opMode,
                isRunning: false,
              },
              finished: true,
            };
          }
          codePart = 3;
        }
        break;
      }
      case 4: {
        note = 'Search is complete';
        codePart = 5;
        break;
      }
      case 5: {
        note = 'Press any button';
        oldArrow = curInOld;
        curInOld = 0;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            note,
            oldArrow,
            curInOld,
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
        break;
    }
  }

  // --- 3. INSERT OPERATION ---
  else if (opMode === 'ins') {
    switch (codePart) {
      case 1: {
        visitIndex = 0;
        note = 'Enter value of node to insert';
        curIn = 0;
        oldArrow = curInOld;
        curInOld = 0;
        drawMode = 0;
        codePart = 2;
        break;
      }
      case 2: {
        const target = inputVal !== undefined && inputVal >= 0 && inputVal <= 99 ? inputVal : value;
        if (target < 0 || target > 99) {
          note = 'Nodes have values from 0 to 99';
          codePart = 1;
        } else {
          value = target;
          note = `Will insert node with key ${target}`;
          codePart = 3;
        }
        break;
      }
      case 3: {
        oldArrow = curInOld;
        curInOld = curIn;

        if (curIn > 30) {
          note = 'Level is too great';
          codePart = 4;
          break;
        }

        if (tree[curIn] === null) {
          // Found empty slot! Insert node
          tree[curIn] = createNode(value);
          note = `Have inserted node with key ${value}`;
          filledNodes++;
          curInOld = curIn;
          drawMode = 1;
          codePart = 4;
        } else {
          if (value < tree[curIn]!.height) {
            curIn = 2 * curIn + 1;
            note = 'Going to left child';
          } else {
            curIn = 2 * curIn + 2;
            note = 'Going to right child';
          }

          if (curIn > 30) {
            note = "Can't insert: Level is too great";
            codePart = 1;
            opMode = 'idle';
            return {
              nextState: {
                ...state,
                note,
                curIn,
                codePart,
                opMode,
                isRunning: false,
              },
              finished: true,
            };
          }
          drawMode = 0;
          codePart = 3;
        }
        break;
      }
      case 4: {
        note = 'Insertion completed';
        drawMode = 0;
        codePart = 5;
        break;
      }
      case 5: {
        note = 'Press any button';
        oldArrow = curInOld;
        curInOld = 0;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            treeArray: tree,
            filledNodes,
            note,
            oldArrow,
            curInOld,
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
        break;
    }
  }

  // --- 4. TRAVERSE (INORDER WITH EXPLICIT STACK) ---
  else if (opMode === 'trav') {
    switch (codePart) {
      case 1: {
        visitArray = [];
        visitIndex = 0;
        theStack = [];
        curIn = 0;
        oldArrow = curInOld;
        curInOld = 0;
        drawMode = 0;
        note = 'Will traverse tree in "inorder"';
        codePart = 5;
        break;
      }
      case 5: {
        if (tree[0] === null) {
          note = 'Done traversal';
          codePart = 4;
          break;
        }
        curIn = 0;
        oldArrow = curInOld;
        curInOld = curIn;
        note = 'Will check left child';
        codePart = 6;
        break;
      }
      case 6: {
        const leftChild = 2 * curIn + 1;
        if (leftChild <= 30 && tree[leftChild] !== null) {
          theStack.push(curIn);
          curIn = leftChild;
          oldArrow = curInOld;
          curInOld = curIn;
          note = 'Will check left child';
          codePart = 6; // Keep going down left subtree
        } else {
          note = 'Will visit this node';
          codePart = 7;
        }
        break;
      }
      case 7: {
        // Visit current node: output key into visitArray
        if (tree[curIn] !== null) {
          visitArray.push(tree[curIn]!.height);
          visitIndex++;
        }
        note = 'Will check for right child';
        codePart = 8;
        break;
      }
      case 8: {
        const rightChild = 2 * curIn + 2;
        if (rightChild <= 30 && tree[rightChild] !== null) {
          curIn = rightChild;
          oldArrow = curInOld;
          curInOld = curIn;
          note = 'Will check left child';
          codePart = 6; // Go down left branch of right subtree
        } else if (theStack.length > 0) {
          note = 'Will go to root of last subtree';
          curIn = theStack.pop()!;
          oldArrow = curInOld;
          curInOld = curIn;
          codePart = 7; // Visit popped parent node
        } else {
          note = 'Done traversal';
          codePart = 4;
        }
        break;
      }
      case 4: {
        note = 'Done traversal';
        codePart = 10;
        break;
      }
      case 10: {
        note = 'Press any button';
        oldArrow = curInOld;
        curInOld = 0;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            theStack,
            visitArray,
            visitIndex,
            note,
            oldArrow,
            curInOld,
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
        break;
    }
  }

  // --- 5. DELETE OPERATION ---
  else if (opMode === 'del') {
    switch (codePart) {
      case 1: {
        visitIndex = 0;
        note = 'Enter key of node to delete';
        curIn = 0;
        oldArrow = curInOld;
        curInOld = 0;
        drawMode = 0;
        codePart = 2;
        break;
      }
      case 2: {
        const target = inputVal !== undefined && inputVal >= 0 && inputVal <= 99 ? inputVal : value;
        if (target < 0 || target > 99) {
          note = 'Nodes have values from 0 to 99';
          codePart = 1;
        } else {
          value = target;
          note = `Will try to delete node ${target}`;
          codePart = 3;
        }
        break;
      }
      case 3: {
        if (tree[curIn] === null) {
          note = "Can't find node with that value";
          codePart = 1;
          opMode = 'idle';
          return {
            nextState: {
              ...state,
              note,
              codePart,
              opMode,
              isRunning: false,
            },
            finished: true,
          };
        }

        if (value === tree[curIn]!.height) {
          note = 'Have found node to delete';
          oldArrow = curInOld;
          curInOld = curIn;
          codePart = 4;
        } else {
          oldArrow = curInOld;
          curInOld = curIn;
          if (value < tree[curIn]!.height) {
            curIn = 2 * curIn + 1;
            note = 'Going to left child';
          } else {
            curIn = 2 * curIn + 2;
            note = 'Going to right child';
          }

          if (curIn > 30 || tree[curIn] === null) {
            note = "Can't find node with that value";
            codePart = 1;
            opMode = 'idle';
            return {
              nextState: {
                ...state,
                note,
                curIn,
                codePart,
                opMode,
                isRunning: false,
              },
              finished: true,
            };
          }
          codePart = 3;
        }
        break;
      }
      case 4: {
        // Analyze deletion case
        const leftIdx = 2 * curIn + 1;
        const rightIdx = 2 * curIn + 2;
        const hasLeft = leftIdx <= 30 && tree[leftIdx] !== null;
        const hasRight = rightIdx <= 30 && tree[rightIdx] !== null;

        if (!hasLeft && !hasRight) {
          // Case 1: Leaf node (no children)
          note = 'Will delete node without complication';
          codePart = 6;
        } else if (!hasLeft && hasRight) {
          // Case 2a: Only right child
          note = 'Will replace node with its right subtree';
          codePart = 7;
        } else if (hasLeft && !hasRight) {
          // Case 2b: Only left child
          note = 'Will replace node with its left subtree';
          codePart = 8;
        } else {
          // Case 3: Two children -> find successor
          successor = findInorderSuccessor(tree, curIn);
          note = `Will replace node with ${tree[successor]!.height}`;
          codePart = 9;
        }
        break;
      }
      case 6: {
        // Delete leaf
        tree[curIn] = null;
        filledNodes = Math.max(0, filledNodes - 1);
        note = 'Node was deleted';
        drawMode = 2;
        codePart = 10;
        break;
      }
      case 7: {
        // Replace node with right subtree
        const rightIdx = 2 * curIn + 2;
        shiftSubtreeUp(tree, rightIdx, curIn);
        filledNodes = Math.max(0, filledNodes - 1);
        note = 'Node was replaced by its right subtree';
        drawMode = 2;
        codePart = 10;
        break;
      }
      case 8: {
        // Replace node with left subtree
        const leftIdx = 2 * curIn + 1;
        shiftSubtreeUp(tree, leftIdx, curIn);
        filledNodes = Math.max(0, filledNodes - 1);
        note = 'Node was replaced by its left subtree';
        drawMode = 2;
        codePart = 10;
        break;
      }
      case 9: {
        // Two children: replace curIn's key with successor's key
        tree[curIn] = { ...tree[successor]! };
        const succRight = 2 * successor + 2;
        if (succRight <= 30 && tree[succRight] !== null) {
          const succVal = tree[succRight]!.height;
          note = `and replace ${succVal} with its right subtree`;
          shiftSubtreeUp(tree, succRight, successor);
          filledNodes = Math.max(0, filledNodes - 1);
          note = 'Removed node in 2-step process';
        } else {
          tree[successor] = null;
          filledNodes = Math.max(0, filledNodes - 1);
          note = 'Node was replaced by successor';
        }
        drawMode = 2;
        codePart = 10;
        break;
      }
      case 10: {
        note = 'Press any button';
        oldArrow = curInOld;
        curInOld = 0;
        codePart = 1;
        opMode = 'idle';
        return {
          nextState: {
            ...state,
            treeArray: tree,
            filledNodes,
            note,
            oldArrow,
            curInOld,
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
        break;
    }
  }

  return {
    nextState: {
      ...state,
      treeArray: tree,
      filledNodes,
      note,
      curIn,
      curInOld,
      oldArrow,
      value,
      codePart,
      opMode,
      theStack,
      visitArray,
      visitIndex,
      successor,
      drawMode,
    },
    finished: false,
  };
}
