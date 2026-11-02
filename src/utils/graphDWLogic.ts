// Robert Lafore's Directed, Weighted Graph (GraphDW)
// Reverse-engineered from GraphDW.class, vertexGroup.class, vertex.class, disP.class, disIs.class

export interface GraphVertex {
  x: number;
  y: number;
  label: string;
  color: string;
  isInTree: boolean;
}

export interface DisIs {
  distance: number;
  isInTree: boolean;
}

export interface DisP {
  parentVert: number;
  distance: number;
}

export interface GraphDWState {
  appletWidth: number;
  appletHeight: number;
  topMargin: number;
  leftMargin: number;
  textHeight: number;
  vertexDiameter: number;
  dirDistance: number;
  dirSize: number;
  weightBoxWidth: number;
  weightBoxHeight: number;
  noteBoxTop: number;
  noteBoxHeight: number;
  noteBoxWidth: number;
  visitBoxTop: number;
  visitBoxHeight: number;
  visitBoxWidth: number;
  charSpace: number;
  headerBoxTop: number;
  drawingBoxHeight: number;

  MAX_VERTS: number;
  MAX_WEIGHT: number;
  INFINITY: number;

  vertexList: GraphVertex[];
  adjMat: DisIs[][];
  nVerts: number;
  tree: number[];
  nTree: number;

  sPath: DisP[];
  startingVertex: number;
  startTree: number;
  currentSrc: number;
  currentDest: number;
  startToCurrent: number;
  currentToFringe: number;
  startToFringe: number;
  loopCounter: number;
  willUpdate: boolean;

  displayVertex: number;
  displayEdge1: number;
  displayEdge2: number;

  note: string;
  oldNote: string;
  showAdjm: boolean;
  opMode: number; // 0: idle, 1: path in progress
  codePart: number; // 1 to 14
  drawMode: number;

  xStartDrag: number;
  yStartDrag: number;
  isDragging: boolean;
  currentDragX: number;
  currentDragY: number;
  madeVertex: boolean;
  wasClearPressed: boolean;

  isRunning: boolean;
  speed: number;
  speedMs: number;
}

export const INFINITY = 1000000;
export const MAX_VERTS = 13;
export const MAX_WEIGHT = 99;

export function dtoS(dist: number): string {
  if (dist >= INFINITY) return 'inf';
  return dist.toString();
}

function getRandomColor(): string {
  const r = 100 + Math.floor(Math.random() * 155);
  const g = 100 + Math.floor(Math.random() * 155);
  const b = 100 + Math.floor(Math.random() * 155);
  return `rgb(${r}, ${g}, ${b})`;
}

export function createEmptyAdjMat(): DisIs[][] {
  const mat: DisIs[][] = [];
  for (let i = 0; i < MAX_VERTS; i++) {
    const row: DisIs[] = [];
    for (let j = 0; j < MAX_VERTS; j++) {
      row.push({ distance: INFINITY, isInTree: false });
    }
    mat.push(row);
  }
  return mat;
}

export function createInitialGraphDWState(): GraphDWState {
  const state: GraphDWState = {
    appletWidth: 440,
    appletHeight: 325,
    topMargin: 70,
    leftMargin: 10,
    textHeight: 13,
    vertexDiameter: 22,
    dirDistance: 18,
    dirSize: 7,
    weightBoxWidth: 17,
    weightBoxHeight: 15,
    noteBoxTop: 45,
    noteBoxHeight: 25,
    noteBoxWidth: 430,
    visitBoxTop: 305,
    visitBoxHeight: 25,
    visitBoxWidth: 430,
    charSpace: 40,
    headerBoxTop: 280,
    drawingBoxHeight: 207,

    MAX_VERTS: 13,
    MAX_WEIGHT: 99,
    INFINITY,

    vertexList: [],
    adjMat: createEmptyAdjMat(),
    nVerts: 0,
    tree: new Array(MAX_VERTS).fill(0),
    nTree: 0,

    sPath: [],
    startingVertex: -1,
    startTree: 0,
    currentSrc: 0,
    currentDest: 0,
    startToCurrent: 0,
    currentToFringe: 0,
    startToFringe: 0,
    loopCounter: 0,
    willUpdate: false,

    displayVertex: -1,
    displayEdge1: -1,
    displayEdge2: -1,

    note: 'Double-click mouse to make vertex',
    oldNote: '',
    showAdjm: false,
    opMode: 0,
    codePart: 1,
    drawMode: 4,

    xStartDrag: 0,
    yStartDrag: 0,
    isDragging: false,
    currentDragX: 0,
    currentDragY: 0,
    madeVertex: false,
    wasClearPressed: false,

    isRunning: false,
    speed: 500,
    speedMs: 500,
  };

  return state;
}

export function closeTo(state: GraphDWState, x: number, y: number): number {
  const threshold = 11;
  for (let i = 0; i < state.nVerts; i++) {
    const v = state.vertexList[i];
    if (Math.abs(v.x - x) < threshold && Math.abs(v.y - y) < threshold) {
      return i;
    }
  }
  return -1;
}

export function makeVertex(state: GraphDWState, x: number, y: number): GraphDWState {
  const next = { ...state };
  next.madeVertex = true;

  // bounds check for vertex creation inside drawing area
  const clampedX = Math.max(25, Math.min(state.appletWidth - 25, x));
  const clampedY = Math.max(state.topMargin + 15, Math.min(state.topMargin + state.drawingBoxHeight - 15, y));

  if (next.nVerts >= MAX_VERTS) {
    next.note = "CAN'T INSERT more vertices";
    return next;
  }

  const label = String.fromCharCode(65 + next.nVerts);
  const newVert: GraphVertex = {
    x: clampedX,
    y: clampedY,
    label,
    color: getRandomColor(),
    isInTree: false,
  };

  const nextList = [...next.vertexList, newVert];
  next.vertexList = nextList;
  next.nVerts++;
  next.note = `Made vertex ${label}`;
  next.displayVertex = next.nVerts - 1;
  next.opMode = 0;
  next.drawMode = 2;
  return next;
}

export function startDrag(state: GraphDWState, x: number, y: number): GraphDWState {
  const next = { ...state };
  next.xStartDrag = x;
  next.yStartDrag = y;
  next.isDragging = true;
  next.currentDragX = x;
  next.currentDragY = y;

  const vertIdx = closeTo(next, x, y);
  next.startingVertex = vertIdx;

  if (vertIdx < 0) {
    next.note = 'To make edge, drag from vertex to vertex';
  } else {
    next.note = `Starting edge at vertex ${next.vertexList[vertIdx].label}`;
  }
  next.drawMode = 1;
  return next;
}

export function updateDragPosition(state: GraphDWState, x: number, y: number): GraphDWState {
  if (!state.isDragging) return state;
  return {
    ...state,
    currentDragX: x,
    currentDragY: y,
  };
}

export function endDrag(
  state: GraphDWState,
  isNumber: boolean,
  weight: number,
  x: number,
  y: number
): GraphDWState {
  const next = { ...state };
  next.isDragging = false;

  if (next.madeVertex) {
    next.madeVertex = false;
    next.drawMode = 2;
    return next;
  }

  const src = closeTo(next, next.xStartDrag, next.yStartDrag);
  const dest = closeTo(next, x, y);

  if (next.opMode > 0) {
    if (next.startingVertex === -1) {
      next.note = 'Click on a VERTEX';
    } else {
      next.note = `You clicked on ${next.vertexList[next.startingVertex].label}`;
    }
    next.drawMode = 1;
    return next;
  }

  if (src < 0 || dest < 0 || src === dest) {
    next.note = "CAN'T MAKE EDGE: Drag from vertex to vertex";
    next.drawMode = 1;
    return next;
  }

  if (!isNumber || weight < 0 || weight > MAX_WEIGHT) {
    next.note = `CAN'T MAKE EDGE: Enter a weight (0 to ${MAX_WEIGHT})`;
    next.drawMode = 1;
    return next;
  }

  // Valid edge
  const newAdj = next.adjMat.map((row) => row.map((cell) => ({ ...cell })));
  newAdj[src][dest].distance = weight;
  next.adjMat = newAdj;
  next.madeVertex = false;
  next.displayEdge1 = src;
  next.displayEdge2 = dest;
  next.note = `Made edge from ${next.vertexList[src].label} to ${next.vertexList[dest].label} with weight ${weight}`;
  next.drawMode = 3;
  return next;
}

export function changeView(state: GraphDWState): GraphDWState {
  const next = { ...state };
  if (next.showAdjm) {
    next.note = next.oldNote;
    next.showAdjm = false;
  } else {
    next.oldNote = next.note;
    if (next.nVerts === 0) {
      next.note = 'No vertices; adjacency matrix is empty';
    } else {
      next.note = 'Press View button again to show graph';
    }
    next.showAdjm = true;
    next.drawMode = 4;
  }
  return next;
}

export function warningNew(state: GraphDWState): GraphDWState {
  return {
    ...state,
    wasClearPressed: true,
    note: 'ARE YOU SURE? Press again to clear old graph',
  };
}

export function clearGraph(state: GraphDWState): GraphDWState {
  return createInitialGraphDWState();
}

export function stepPath(state: GraphDWState, clickX?: number, clickY?: number): GraphDWState {
  const next = {
    ...state,
    vertexList: state.vertexList.map((v) => ({ ...v })),
    adjMat: state.adjMat.map((r) => r.map((c) => ({ ...c }))),
    tree: [...state.tree],
    sPath: state.sPath.map((p) => ({ ...p })),
  };

  if (clickX !== undefined && clickY !== undefined) {
    const clicked = closeTo(next, clickX, clickY);
    if (clicked >= 0) {
      next.startingVertex = clicked;
      next.note = `You clicked on ${next.vertexList[clicked].label}`;
    } else {
      next.startingVertex = -1;
      next.note = 'Click on a VERTEX';
    }
    next.drawMode = 1;
    return next;
  }

  if (next.nVerts === 0) {
    next.note = 'Double-click mouse to make vertex';
    return next;
  }

  if (next.opMode !== 1) {
    next.opMode = 1;
    next.codePart = 1;
  }

  switch (next.codePart) {
    case 1: {
      next.note = 'Single-click on starting vertex';
      next.startingVertex = -1;
      next.drawMode = 1;
      next.codePart = 2;
      return next;
    }
    case 2: {
      if (next.startingVertex === -1) {
        next.note = 'INVALID VERTEX';
        next.codePart = 1;
        next.drawMode = 1;
        return next;
      }
      next.startTree = next.startingVertex;
      next.note = `Starting from vertex ${next.vertexList[next.startTree].label}`;
      next.codePart = 3;
      next.drawMode = 1;
      return next;
    }
    case 3: {
      next.vertexList[next.startTree].isInTree = true;
      next.tree[0] = next.startTree;
      next.nTree = 1;
      next.note = `Added vertex ${next.vertexList[next.startTree].label} to tree`;
      next.displayVertex = next.startTree;
      next.drawMode = 2;
      next.codePart = 4;
      return next;
    }
    case 4: {
      // Copy row from adjacency matrix to sPath
      const newSPath: DisP[] = [];
      for (let i = 0; i < next.nVerts; i++) {
        const d = next.adjMat[next.startTree][i].distance;
        newSPath.push({ parentVert: next.startTree, distance: d });
      }
      next.sPath = newSPath;
      next.note = `Copied row ${next.vertexList[next.startTree].label} from adjacency matrix to shortest-path array`;
      next.drawMode = 1;
      next.codePart = 5;
      return next;
    }
    case 5: {
      // Find min distance among vertices not in tree
      let minDist = INFINITY;
      let minVert = 0;
      for (let i = 0; i < next.nVerts; i++) {
        if (!next.vertexList[i].isInTree) {
          if (next.sPath[i].distance < minDist) {
            minDist = next.sPath[i].distance;
            minVert = i;
          }
        }
      }

      if (minDist === INFINITY) {
        next.note = 'One or more vertices are UNREACHABLE';
        next.codePart = 12;
      } else {
        next.currentDest = minVert;
        next.currentSrc = next.sPath[minVert].parentVert;
        next.startToCurrent = next.sPath[minVert].distance;
        next.note = `Minimum distance from ${next.vertexList[next.startTree].label} is ${next.startToCurrent}, to vertex ${next.vertexList[next.currentDest].label}`;
        next.codePart = 6;
      }
      next.drawMode = 1;
      return next;
    }
    case 6: {
      // Add currentDest to tree
      next.vertexList[next.currentDest].isInTree = true;
      next.tree[next.nTree] = next.currentDest;
      next.nTree++;
      next.note = `Added vertex ${next.vertexList[next.currentDest].label} to tree`;
      next.adjMat[next.currentSrc][next.currentDest].isInTree = true;
      next.displayEdge1 = next.currentSrc;
      next.displayEdge2 = next.currentDest;

      if (next.nTree === next.nVerts) {
        next.codePart = 12;
      } else {
        next.loopCounter = 0;
        next.codePart = 7;
      }
      next.drawMode = 3;
      return next;
    }
    case 7: {
      next.note = 'Will adjust values in shortest-path array';
      next.drawMode = 1;
      next.codePart = 8;
      return next;
    }
    case 8: {
      // Find next non-tree column
      while (next.loopCounter < next.nVerts && next.vertexList[next.loopCounter].isInTree) {
        next.loopCounter++;
      }

      if (next.loopCounter === next.nVerts) {
        next.note = 'Finished all entries in shortest-path array';
        next.codePart = 5;
      } else {
        next.note = `Will compare distances for column ${next.vertexList[next.loopCounter].label}`;
        next.codePart = 9;
      }
      next.drawMode = 1;
      return next;
    }
    case 9: {
      next.currentToFringe = next.adjMat[next.currentDest][next.loopCounter].distance;
      next.startToFringe = next.startToCurrent + next.currentToFringe;
      const sPathDist = next.sPath[next.loopCounter].distance;

      let str = '';
      if (next.startToFringe < sPathDist) {
        str = ' less than ';
        next.willUpdate = true;
      } else {
        str = ' greater than or equal to ';
        next.willUpdate = false;
      }

      const sLabel = next.vertexList[next.startTree].label;
      const cLabel = next.vertexList[next.currentDest].label;
      const fLabel = next.vertexList[next.loopCounter].label;

      next.note = `To ${fLabel}:  ${sLabel} to ${cLabel} (${dtoS(next.startToCurrent)}) plus edge ${cLabel}${fLabel} (${dtoS(next.currentToFringe)}) ${str}${sLabel} to ${fLabel} (${dtoS(sPathDist)})`;
      next.codePart = 10;
      next.drawMode = 1;
      return next;
    }
    case 10: {
      if (next.willUpdate) {
        next.sPath[next.loopCounter].parentVert = next.currentDest;
        next.sPath[next.loopCounter].distance = next.startToFringe;
        next.note = `Updated array column ${next.vertexList[next.loopCounter].label}`;
      } else {
        next.note = `No need to update array column ${next.vertexList[next.loopCounter].label}`;
      }
      next.drawMode = 1;
      next.codePart = 11;
      return next;
    }
    case 11: {
      next.loopCounter++;
      if (next.loopCounter < next.nVerts) {
        next.note = 'Will examine next non-tree column';
        next.codePart = 8;
      } else {
        next.note = 'Done all entries in shortest-path array';
        next.codePart = 5;
      }
      next.drawMode = 1;
      return next;
    }
    case 12: {
      next.note = `All shortest paths from ${next.vertexList[next.startTree].label} found; distances in array`;
      next.codePart = 13;
      next.drawMode = 1;
      next.isRunning = false;
      return next;
    }
    case 13: {
      next.note = 'Press again to reset paths';
      next.codePart = 14;
      next.drawMode = 1;
      return next;
    }
    case 14: {
      next.nTree = 0;
      for (let i = 0; i < next.nVerts; i++) {
        next.vertexList[i].isInTree = false;
        for (let j = 0; j < next.nVerts; j++) {
          next.adjMat[i][j].isInTree = false;
        }
      }
      next.note = 'Press any button';
      next.codePart = 1;
      next.opMode = 0;
      next.drawMode = 4;
      return next;
    }
    default:
      return next;
  }
}

export function loadSampleGraph(): GraphDWState {
  const state = createInitialGraphDWState();

  // A 5-vertex classic sample graph from Robert Lafore's Chapter 14
  // Vertices: A (60, 140), B (150, 95), C (250, 95), D (350, 150), E (200, 230)
  const sampleCoords = [
    { x: 60, y: 150 },   // A
    { x: 160, y: 100 },  // B
    { x: 280, y: 100 },  // C
    { x: 370, y: 160 },  // D
    { x: 210, y: 220 },  // E
  ];

  for (let i = 0; i < sampleCoords.length; i++) {
    const c = sampleCoords[i];
    state.vertexList.push({
      x: c.x,
      y: c.y,
      label: String.fromCharCode(65 + i),
      color: getRandomColor(),
      isInTree: false,
    });
  }
  state.nVerts = sampleCoords.length;

  // Edges:
  // A -> B: 50
  // A -> D: 80
  // B -> C: 60
  // B -> D: 90
  // C -> D: 40
  // D -> E: 20
  // E -> B: 50
  // E -> C: 30
  const edges = [
    { from: 0, to: 1, w: 50 }, // A -> B
    { from: 0, to: 3, w: 80 }, // A -> D
    { from: 1, to: 2, w: 60 }, // B -> C
    { from: 1, to: 3, w: 90 }, // B -> D
    { from: 2, to: 3, w: 40 }, // C -> D
    { from: 3, to: 4, w: 20 }, // D -> E
    { from: 4, to: 1, w: 50 }, // E -> B
    { from: 4, to: 2, w: 30 }, // E -> C
  ];

  for (const edge of edges) {
    state.adjMat[edge.from][edge.to].distance = edge.w;
  }

  state.note = 'Sample graph loaded. Click Path then click vertex A to start!';
  state.drawMode = 4;
  return state;
}
