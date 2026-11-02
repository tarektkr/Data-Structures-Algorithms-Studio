/**
 * Chapter 13: Non-Directed, Non-Weighted Graph (GraphN)
 * Robert Lafore - Data Structures & Algorithms in Java (Chapter 13)
 *
 * Reverse-Engineered from:
 * - GraphN_274bfee4.class
 * - GraphN_cee0cae3.html
 * - Queue_8cb245a7.class
 * - stack_07e007d3.class
 * - vertex_043aba93.class
 * - vertexGroup_f4653e27.class
 *
 * Constants & Specifications:
 * - MAX_VERTS = 13 (A-M)
 * - appletWidth = 440, appletHeight = 320
 * - drawingBoxHeight = 207
 * - vertexDiameter = 22
 * - noteBoxTop = 45, noteBoxHeight = 25, noteBoxWidth = 430
 * - visitBoxTop = 280, visitBoxHeight = 25, visitBoxWidth = 430
 * - Stack (size 20) and Queue (size 20)
 * - Adjacency matrices: adjMat (current) and adjMat2 (backup for Tree restore)
 * - 3 Traversal Engines:
 *     1: DFS (Depth-First Search using Stack)
 *     2: BFS (Breadth-First Search using Queue)
 *     3: Tree (Minimum Spanning Tree using DFS + Edge pruning & restore)
 */

export type GraphOpMode = 0 | 1 | 2 | 3;

export interface GraphVertex {
  x: number;
  y: number;
  label: string;
  wasVisited: boolean;
  isInTree: boolean;
  color: string;
}

export interface GraphState {
  MAX_VERTS: number;
  nVerts: number;
  vertexList: GraphVertex[];
  adjMat: number[][]; // 1 = edge, 0 = no edge
  adjMat2: number[][]; // backup copy for saveState/restoreState in Tree
  treeEdges: [number, number][]; // edges in current tree

  theStack: number[]; // Stack for DFS & Tree
  theQueue: number[]; // Queue for BFS
  visitArray: number[]; // Array of visited vertex indices

  // State Machine: 0 = idle, 1 = DFS, 2 = BFS, 3 = Tree
  opMode: GraphOpMode;
  codePart: number;
  startingVertex: number;
  currentVertex: number;

  // View flags
  showAdjm: boolean;
  note: string;
  isRunning: boolean;
  speedMs: number;
  wasClearPressed: boolean;

  // Drag interaction
  isDragging: boolean;
  xStartDrag: number;
  yStartDrag: number;
  currentDragX: number;
  currentDragY: number;

  // Dimensions
  appletWidth: number;
  appletHeight: number;
  drawingBoxHeight: number;
  vertexDiameter: number;
}

const PASTEL_COLORS = [
  '#fecaca', '#bbf7d0', '#bae6fd', '#fed7aa', '#ddd6fe',
  '#fbcfe8', '#fef08a', '#c7d2fe', '#a7f3d0', '#fde68a',
  '#e9d5ff', '#fed7aa', '#cbd5e1',
];

export function createInitialGraphState(): GraphState {
  const MAX_VERTS = 13;
  const adjMat: number[][] = [];
  const adjMat2: number[][] = [];
  for (let i = 0; i < MAX_VERTS; i++) {
    adjMat[i] = new Array(MAX_VERTS).fill(0);
    adjMat2[i] = new Array(MAX_VERTS).fill(0);
  }

  return {
    MAX_VERTS,
    nVerts: 0,
    vertexList: [],
    adjMat,
    adjMat2,
    treeEdges: [],
    theStack: [],
    theQueue: [],
    visitArray: [],

    opMode: 0,
    codePart: 1,
    startingVertex: -1,
    currentVertex: 0,

    showAdjm: false,
    note: 'Double-click mouse to make vertex',
    isRunning: false,
    speedMs: 500,
    wasClearPressed: false,

    isDragging: false,
    xStartDrag: 0,
    yStartDrag: 0,
    currentDragX: 0,
    currentDragY: 0,

    appletWidth: 440,
    appletHeight: 320,
    drawingBoxHeight: 207,
    vertexDiameter: 22,
  };
}

/**
 * Loads the standard textbook sample graph from Chapter 13
 * Vertices A, B, C, D, E with cycles
 */
export function loadSampleGraph(): GraphState {
  const state = createInitialGraphState();

  const sampleVerts = [
    { x: 70,  y: 110, label: 'A', color: '#fecaca' },
    { x: 190, y: 100, label: 'B', color: '#bbf7d0' },
    { x: 320, y: 120, label: 'C', color: '#bae6fd' },
    { x: 130, y: 220, label: 'D', color: '#fed7aa' },
    { x: 260, y: 230, label: 'E', color: '#ddd6fe' },
  ];

  state.nVerts = sampleVerts.length;
  state.vertexList = sampleVerts.map((v) => ({
    x: v.x,
    y: v.y,
    label: v.label,
    wasVisited: false,
    isInTree: false,
    color: v.color,
  }));

  // Undirected edges: (A-B), (B-C), (A-D), (D-E), (B-E), (C-E)
  const edges: [number, number][] = [
    [0, 1], // A - B
    [1, 2], // B - C
    [0, 3], // A - D
    [3, 4], // D - E
    [1, 4], // B - E
    [2, 4], // C - E
  ];

  for (const [v1, v2] of edges) {
    state.adjMat[v1][v2] = 1;
    state.adjMat[v2][v1] = 1;
  }

  state.note = 'Sample graph loaded (A-E); press DFS, BFS, or Tree';
  return state;
}

export function closeTo(state: GraphState, x: number, y: number): number {
  const r = state.vertexDiameter / 2; // 11
  for (let i = 0; i < state.nVerts; i++) {
    const v = state.vertexList[i];
    const dx = v.x - x;
    const dy = v.y - y;
    if (Math.sqrt(dx * dx + dy * dy) <= r + 4) {
      return i;
    }
  }
  return -1;
}

export function makeVertex(state: GraphState, x: number, y: number): GraphState {
  if (state.opMode !== 0) {
    return { ...state, note: 'Please finish or reset current operation first' };
  }
  if (state.nVerts >= state.MAX_VERTS) {
    return { ...state, note: "CAN'T INSERT more vertices" };
  }
  if (closeTo(state, x, y) >= 0) {
    return { ...state, note: 'Vertex too close to existing vertex' };
  }
  if (y < 85 || y > 265 || x < 25 || x > 415) {
    return { ...state, note: 'Click inside the graph drawing area' };
  }

  const label = String.fromCharCode(65 + state.nVerts);
  const color = PASTEL_COLORS[state.nVerts % PASTEL_COLORS.length];
  const newV: GraphVertex = {
    x,
    y,
    label,
    wasVisited: false,
    isInTree: false,
    color,
  };

  const nextList = [...state.vertexList, newV];
  return {
    ...state,
    nVerts: state.nVerts + 1,
    vertexList: nextList,
    note: `Made vertex ${label}`,
    wasClearPressed: false,
  };
}

export function startDrag(state: GraphState, x: number, y: number): GraphState {
  if (state.opMode !== 0) return state;
  const vIdx = closeTo(state, x, y);
  if (vIdx >= 0) {
    const v = state.vertexList[vIdx];
    return {
      ...state,
      isDragging: true,
      startingVertex: vIdx,
      xStartDrag: v.x,
      yStartDrag: v.y,
      currentDragX: x,
      currentDragY: y,
      note: `Starting edge at vertex ${v.label}`,
    };
  }
  return state;
}

export function updateDragPosition(state: GraphState, x: number, y: number): GraphState {
  if (!state.isDragging) return state;
  return {
    ...state,
    currentDragX: x,
    currentDragY: y,
  };
}

export function endDrag(state: GraphState, x: number, y: number): GraphState {
  if (!state.isDragging) return state;
  const destIdx = closeTo(state, x, y);
  const srcIdx = state.startingVertex;

  if (destIdx < 0 || srcIdx < 0 || destIdx === srcIdx) {
    return {
      ...state,
      isDragging: false,
      startingVertex: -1,
      note: "CAN'T MAKE EDGE: Drag from vertex to a different vertex",
    };
  }

  const newAdjMat = state.adjMat.map((row) => [...row]);
  newAdjMat[srcIdx][destIdx] = 1;
  newAdjMat[destIdx][srcIdx] = 1;

  const srcLabel = state.vertexList[srcIdx].label;
  const destLabel = state.vertexList[destIdx].label;

  return {
    ...state,
    isDragging: false,
    startingVertex: -1,
    adjMat: newAdjMat,
    note: `Made edge between ${srcLabel} and ${destLabel}`,
  };
}

export function changeView(state: GraphState): GraphState {
  return {
    ...state,
    showAdjm: !state.showAdjm,
    note: !state.showAdjm
      ? 'Adjacency matrix; press View again to show graph'
      : 'Press any button',
  };
}

export function warningNew(state: GraphState): GraphState {
  if (!state.wasClearPressed) {
    return {
      ...state,
      wasClearPressed: true,
      note: 'ARE YOU SURE? Press again to clear old graph',
    };
  }
  return clearGraph(state);
}

export function clearGraph(state: GraphState): GraphState {
  const cleared = createInitialGraphState();
  cleared.speedMs = state.speedMs;
  cleared.note = 'Graph cleared; double-click mouse to make vertex';
  return cleared;
}

export function saveState(state: GraphState): number[][] {
  return state.adjMat.map((row) => [...row]);
}

export function restoreState(state: GraphState): number[][] {
  return state.adjMat2.map((row) => [...row]);
}

export function resetVisited(state: GraphState): GraphState {
  const resetList = state.vertexList.map((v) => ({
    ...v,
    wasVisited: false,
    isInTree: false,
  }));
  return {
    ...state,
    vertexList: resetList,
    theStack: [],
    theQueue: [],
    visitArray: [],
    treeEdges: [],
    opMode: 0,
    codePart: 1,
    isRunning: false,
    startingVertex: -1,
  };
}

export function getAdjUnvisitedVertex(state: GraphState, v: number): number {
  for (let j = 0; j < state.nVerts; j++) {
    if (state.adjMat[v][j] === 1 && !state.vertexList[j].wasVisited) {
      return j;
    }
  }
  return -1;
}

// =========================================================================
// DFS: Depth First Search (opMode = 1)
// State machine matching bytecode in vertexGroup.class (codePart 1..7)
// =========================================================================

export function stepDFS(state: GraphState, clickX?: number, clickY?: number): GraphState {
  if (state.nVerts === 0) {
    return { ...state, note: 'No vertices in graph' };
  }

  // If entering DFS for the first time
  if (state.opMode !== 1) {
    const s = resetVisited(state);
    s.opMode = 1;
    s.codePart = 1;
    s.adjMat2 = saveState(s);
    s.note = 'Single-click on vertex from which to start search';
    s.startingVertex = -1;
    s.codePart = 2;
    return s;
  }

  // codePart 2: Waiting for click to choose starting vertex
  if (state.codePart === 2) {
    let chosen = -1;
    if (clickX !== undefined && clickY !== undefined) {
      chosen = closeTo(state, clickX, clickY);
    }
    if (chosen < 0) {
      if (state.startingVertex >= 0) {
        chosen = state.startingVertex;
      } else {
        chosen = 0; // default start at A if stepped without click
      }
    }

    const startLabel = state.vertexList[chosen].label;
    return {
      ...state,
      currentVertex: chosen,
      startingVertex: chosen,
      note: `Starting search from vertex ${startLabel}`,
      codePart: 3,
    };
  }

  // codePart 3: Visit currentVertex (mark, push on stack, add to visitArray)
  if (state.codePart === 3) {
    const cv = state.currentVertex;
    const vList = [...state.vertexList];
    vList[cv] = { ...vList[cv], wasVisited: true };
    const stack = [...state.theStack, cv];
    const visit = [...state.visitArray, cv];
    const label = vList[cv].label;

    return {
      ...state,
      vertexList: vList,
      theStack: stack,
      visitArray: visit,
      note: `Visited vertex ${label}`,
      codePart: 4,
    };
  }

  // codePart 4: Will check vertices adjacent to currentVertex
  if (state.codePart === 4) {
    const label = state.vertexList[state.currentVertex].label;
    return {
      ...state,
      note: `Will check vertices adjacent to ${label}`,
      codePart: 5,
    };
  }

  // codePart 5: Search for adjacent unvisited vertex
  if (state.codePart === 5) {
    const v = getAdjUnvisitedVertex(state, state.currentVertex);
    if (v === -1) {
      // Rule 2: No unvisited neighbor -> pop from stack
      const newStack = state.theStack.slice(0, -1);
      const poppedLabel = state.vertexList[state.currentVertex].label;

      if (newStack.length === 0) {
        return {
          ...state,
          theStack: newStack,
          note: 'No more vertices with unvisited neighbors',
          codePart: 6,
        };
      } else {
        const top = newStack[newStack.length - 1];
        return {
          ...state,
          theStack: newStack,
          currentVertex: top,
          note: `No more unvisited vertices adjacent to ${poppedLabel}`,
          codePart: 4, // check adjacent of top
        };
      }
    } else {
      // Rule 1: Found unvisited vertex -> make it current and go to codePart 3
      return {
        ...state,
        currentVertex: v,
        codePart: 3,
      };
    }
  }

  // codePart 6: Search finished
  if (state.codePart === 6) {
    return {
      ...state,
      isRunning: false,
      note: 'Press again to reset search',
      codePart: 7,
    };
  }

  // codePart 7: Reset search
  if (state.codePart === 7) {
    const s = resetVisited(state);
    s.note = 'Double-click mouse to make vertex';
    return s;
  }

  return state;
}

// =========================================================================
// BFS: Breadth First Search (opMode = 2)
// State machine matching bytecode in vertexGroup.class (codePart 1..7)
// =========================================================================

export function stepBFS(state: GraphState, clickX?: number, clickY?: number): GraphState {
  if (state.nVerts === 0) {
    return { ...state, note: 'No vertices in graph' };
  }

  if (state.opMode !== 2) {
    const s = resetVisited(state);
    s.opMode = 2;
    s.codePart = 1;
    s.adjMat2 = saveState(s);
    s.note = 'Single-click on vertex from which to start search';
    s.startingVertex = -1;
    s.codePart = 2;
    return s;
  }

  if (state.codePart === 2) {
    let chosen = -1;
    if (clickX !== undefined && clickY !== undefined) {
      chosen = closeTo(state, clickX, clickY);
    }
    if (chosen < 0) {
      chosen = state.startingVertex >= 0 ? state.startingVertex : 0;
    }

    const startLabel = state.vertexList[chosen].label;
    return {
      ...state,
      currentVertex: chosen,
      startingVertex: chosen,
      note: `Starting search from vertex ${startLabel}`,
      codePart: 3,
    };
  }

  if (state.codePart === 3) {
    const cv = state.currentVertex;
    const vList = [...state.vertexList];
    vList[cv] = { ...vList[cv], wasVisited: true };
    const queue = [...state.theQueue, cv];
    const visit = [...state.visitArray, cv];
    const label = vList[cv].label;

    return {
      ...state,
      vertexList: vList,
      theQueue: queue,
      visitArray: visit,
      note: `Visited vertex ${label}`,
      codePart: 4,
    };
  }

  if (state.codePart === 4) {
    const label = state.vertexList[state.currentVertex].label;
    return {
      ...state,
      note: `Will check vertices adjacent to ${label}`,
      codePart: 5,
    };
  }

  if (state.codePart === 5) {
    const v = getAdjUnvisitedVertex(state, state.currentVertex);
    if (v === -1) {
      // Rule 2: No more adjacent unvisited vertices -> remove from queue
      const removed = state.theQueue[0];
      const newQueue = state.theQueue.slice(1);
      const rLabel = state.vertexList[removed].label;

      if (newQueue.length === 0) {
        return {
          ...state,
          theQueue: newQueue,
          note: 'No more vertices with unvisited neighbors',
          codePart: 6,
        };
      } else {
        const nextV = newQueue[0];
        return {
          ...state,
          theQueue: newQueue,
          currentVertex: nextV,
          note: `No more unvisited vertices adjacent to ${rLabel}`,
          codePart: 4,
        };
      }
    } else {
      // Rule 1: Visit next unvisited neighbor, insert into queue
      const vList = [...state.vertexList];
      vList[v] = { ...vList[v], wasVisited: true };
      const newQueue = [...state.theQueue, v];
      const newVisit = [...state.visitArray, v];
      const nLabel = vList[v].label;

      return {
        ...state,
        vertexList: vList,
        theQueue: newQueue,
        visitArray: newVisit,
        note: `Visited vertex ${nLabel}`,
        codePart: 5, // stay in codePart 5 to check next adjacent
      };
    }
  }

  if (state.codePart === 6) {
    return {
      ...state,
      isRunning: false,
      note: 'Press again to reset search',
      codePart: 7,
    };
  }

  if (state.codePart === 7) {
    const s = resetVisited(state);
    s.note = 'Double-click mouse to make vertex';
    return s;
  }

  return state;
}

// =========================================================================
// Tree: Minimum Spanning Tree for Unweighted Graph (opMode = 3)
// State machine matching bytecode in vertexGroup.class (codePart 1..8)
// =========================================================================

export function stepTree(state: GraphState, clickX?: number, clickY?: number): GraphState {
  if (state.nVerts === 0) {
    return { ...state, note: 'No vertices in graph' };
  }

  if (state.opMode !== 3) {
    const s = resetVisited(state);
    s.opMode = 3;
    s.codePart = 1;
    s.adjMat2 = saveState(s);
    s.note = 'Single-click on vertex from which to start tree';
    s.startingVertex = -1;
    s.codePart = 2;
    return s;
  }

  if (state.codePart === 2) {
    let chosen = -1;
    if (clickX !== undefined && clickY !== undefined) {
      chosen = closeTo(state, clickX, clickY);
    }
    if (chosen < 0) {
      chosen = state.startingVertex >= 0 ? state.startingVertex : 0;
    }

    const startLabel = state.vertexList[chosen].label;
    return {
      ...state,
      currentVertex: chosen,
      startingVertex: chosen,
      note: `Starting tree from vertex ${startLabel}`,
      codePart: 3,
    };
  }

  if (state.codePart === 3) {
    const cv = state.currentVertex;
    const vList = [...state.vertexList];
    vList[cv] = { ...vList[cv], wasVisited: true, isInTree: true };
    const stack = [...state.theStack, cv];
    const visit = [...state.visitArray, cv];
    const label = vList[cv].label;

    return {
      ...state,
      vertexList: vList,
      theStack: stack,
      visitArray: visit,
      note: `Visited vertex ${label}`,
      codePart: 4,
    };
  }

  if (state.codePart === 4) {
    const label = state.vertexList[state.currentVertex].label;
    return {
      ...state,
      note: `Will check vertices adjacent to ${label}`,
      codePart: 5,
    };
  }

  if (state.codePart === 5) {
    const topV = state.currentVertex;
    const v = getAdjUnvisitedVertex(state, topV);

    if (v === -1) {
      // Pop
      const newStack = state.theStack.slice(0, -1);
      const poppedLabel = state.vertexList[topV].label;

      if (newStack.length === 0) {
        return {
          ...state,
          theStack: newStack,
          note: 'Press again to delete unmarked edges',
          codePart: 6,
        };
      } else {
        const nextV = newStack[newStack.length - 1];
        return {
          ...state,
          theStack: newStack,
          currentVertex: nextV,
          note: `No more unvisited vertices adjacent to ${poppedLabel}`,
          codePart: 4,
        };
      }
    } else {
      // Add tree edge (topV, v)
      const vList = [...state.vertexList];
      vList[v] = { ...vList[v], wasVisited: true, isInTree: true };
      const newStack = [...state.theStack, v];
      const newVisit = [...state.visitArray, v];
      const newEdges: [number, number][] = [...state.treeEdges, [topV, v]];
      const vLabel = vList[v].label;
      const topLabel = vList[topV].label;

      return {
        ...state,
        vertexList: vList,
        theStack: newStack,
        visitArray: newVisit,
        treeEdges: newEdges,
        currentVertex: v,
        note: `Visited vertex ${vLabel} from ${topLabel}`,
        codePart: 4,
      };
    }
  }

  // codePart 6: Delete unmarked edges
  if (state.codePart === 6) {
    const newAdjMat = state.adjMat.map((row) => new Array(state.MAX_VERTS).fill(0));
    for (const [u, v] of state.treeEdges) {
      newAdjMat[u][v] = 1;
      newAdjMat[v][u] = 1;
    }
    return {
      ...state,
      adjMat: newAdjMat,
      note: 'Minimum spanning tree; press again to restore tree',
      codePart: 7,
    };
  }

  // codePart 7: Restore original tree/graph
  if (state.codePart === 7) {
    const restored = restoreState(state);
    const s = resetVisited(state);
    s.adjMat = restored;
    s.note = 'Double-click mouse to make vertex';
    return s;
  }

  return state;
}

export function stepCurrentGraphNOp(state: GraphState, clickX?: number, clickY?: number): GraphState {
  if (state.opMode === 1) {
    return stepDFS(state, clickX, clickY);
  } else if (state.opMode === 2) {
    return stepBFS(state, clickX, clickY);
  } else if (state.opMode === 3) {
    return stepTree(state, clickX, clickY);
  }
  return state;
}
