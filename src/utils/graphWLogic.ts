// Robert Lafore's Weighted, Undirected Graph (GraphW - Minimum Spanning Tree / MSTW)
// Reverse-engineered from GraphW.class, vertexGroup.class, edge.class, priorityQ.class, disIs.class, vertex.class

export interface GraphWVertex {
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

export interface GraphWEdge {
  srcVert: number;
  destVert: number;
  distance: number;
}

export const INFINITY = 1000000;
export const MAX_VERTS = 13;
export const MAX_WEIGHT = 99;
export const PQ_SIZE = 20;

export class PriorityQ {
  private queArray: GraphWEdge[] = [];

  constructor(items?: GraphWEdge[]) {
    if (items) {
      this.queArray = items.map((e) => ({ ...e }));
    }
  }

  public insert(item: GraphWEdge): void {
    let j: number;
    for (j = 0; j < this.queArray.length; j++) {
      if (item.distance >= this.queArray[j].distance) {
        break;
      }
    }
    this.queArray.splice(j, 0, { ...item });
  }

  public removeMin(): GraphWEdge | undefined {
    return this.queArray.pop();
  }

  public removeN(n: number): void {
    if (n >= 0 && n < this.queArray.length) {
      this.queArray.splice(n, 1);
    }
  }

  public peekMin(): GraphWEdge | undefined {
    if (this.queArray.length === 0) return undefined;
    return this.queArray[this.queArray.length - 1];
  }

  public peekN(n: number): GraphWEdge | undefined {
    return this.queArray[n];
  }

  public size(): number {
    return this.queArray.length;
  }

  public isEmpty(): boolean {
    return this.queArray.length === 0;
  }

  public find(findDex: number): number {
    for (let j = 0; j < this.queArray.length; j++) {
      if (this.queArray[j].destVert === findDex) {
        return j;
      }
    }
    return -1;
  }

  public toArray(): GraphWEdge[] {
    return this.queArray.map((e) => ({ ...e }));
  }
}

export interface GraphWState {
  appletWidth: number;
  appletHeight: number;
  topMargin: number;
  leftMargin: number;
  textHeight: number;
  vertexDiameter: number;
  weightBoxWidth: number;
  weightBoxHeight: number;
  noteBoxTop: number;
  noteBoxHeight: number;
  noteBoxWidth: number;
  visitBoxTop: number;
  visitBoxHeight: number;
  visitBoxWidth: number;
  drawingBoxHeight: number;

  MAX_VERTS: number;
  MAX_WEIGHT: number;
  INFINITY: number;

  vertexList: GraphWVertex[];
  adjMat: DisIs[][];
  adjMat2: DisIs[][];
  nVerts: number;

  thePQ: GraphWEdge[];
  tree: number[];
  nTree: number;

  note: string;
  oldNote: string;
  opMode: number; // 0: idle, 1: tree / MST in progress
  codePart: number; // 1 to 8
  drawMode: number;

  xStartDrag: number;
  yStartDrag: number;
  isDragging: boolean;
  currentDragX: number;
  currentDragY: number;
  madeVertex: boolean;
  showAdjm: boolean;

  startingVertex: number;
  currentVert: number;
  displayVertex: number;
  displayEdge1: number;
  displayEdge2: number;

  wasClearPressed: boolean;
  isRunning: boolean;
  speed: number;
  speedMs: number;
}

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

export function createInitialGraphWState(): GraphWState {
  const state: GraphWState = {
    appletWidth: 440,
    appletHeight: 320,
    topMargin: 70,
    leftMargin: 10,
    textHeight: 13,
    vertexDiameter: 22,
    weightBoxWidth: 17,
    weightBoxHeight: 15,
    noteBoxTop: 45,
    noteBoxHeight: 25,
    noteBoxWidth: 430,
    visitBoxTop: 280,
    visitBoxHeight: 25,
    visitBoxWidth: 430,
    drawingBoxHeight: 207,

    MAX_VERTS: 13,
    MAX_WEIGHT: 99,
    INFINITY,

    vertexList: [],
    adjMat: createEmptyAdjMat(),
    adjMat2: createEmptyAdjMat(),
    nVerts: 0,

    thePQ: [],
    tree: new Array(MAX_VERTS).fill(0),
    nTree: 0,

    note: 'Double-click mouse to make vertex',
    oldNote: '',
    opMode: 0,
    codePart: 1,
    drawMode: 4,

    xStartDrag: 0,
    yStartDrag: 0,
    isDragging: false,
    currentDragX: 0,
    currentDragY: 0,
    madeVertex: false,
    showAdjm: false,

    startingVertex: -1,
    currentVert: 0,
    displayVertex: -1,
    displayEdge1: -1,
    displayEdge2: -1,

    wasClearPressed: false,
    isRunning: false,
    speed: 500,
    speedMs: 500,
  };

  return state;
}

export function closeTo(state: GraphWState, x: number, y: number): number {
  const threshold = 11; // vertex radius
  for (let i = 0; i < state.nVerts; i++) {
    const v = state.vertexList[i];
    if (Math.abs(v.x - x) < threshold && Math.abs(v.y - y) < threshold) {
      return i;
    }
  }
  return -1;
}

export function makeVertex(state: GraphWState, x: number, y: number): GraphWState {
  const next = { ...state };
  next.madeVertex = true;

  if (next.nVerts >= MAX_VERTS) {
    next.note = "CAN'T INSERT more vertices";
    return next;
  }

  // Constrain inside drawing box: y in [70, 277], x in [15, 425]
  const clampedX = Math.max(20, Math.min(x, 420));
  const clampedY = Math.max(75, Math.min(y, 265));

  const newVert: GraphWVertex = {
    x: clampedX,
    y: clampedY,
    label: String.fromCharCode(65 + next.nVerts),
    color: getRandomColor(),
    isInTree: false,
  };

  next.vertexList = [...next.vertexList, newVert];
  next.note = `Made vertex ${newVert.label}`;
  next.displayVertex = next.nVerts;
  next.nVerts++;
  next.drawMode = 2;
  return next;
}

export function startDrag(state: GraphWState, x: number, y: number): GraphWState {
  const next = { ...state };
  next.xStartDrag = x;
  next.yStartDrag = y;
  next.currentDragX = x;
  next.currentDragY = y;
  next.isDragging = true;

  const vertIdx = closeTo(next, x, y);
  if (vertIdx < 0) {
    next.note = 'To make edge, drag from vertex to vertex';
  } else {
    next.note = `Starting edge at vertex ${next.vertexList[vertIdx].label}`;
  }
  next.drawMode = 1;
  return next;
}

export function updateDragPosition(state: GraphWState, x: number, y: number): GraphWState {
  if (!state.isDragging) return state;
  return {
    ...state,
    currentDragX: x,
    currentDragY: y,
  };
}

export function endDrag(
  state: GraphWState,
  isNumber: boolean,
  weight: number,
  x: number,
  y: number
): GraphWState {
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

  // Undirected Edge: symmetric in adjMat
  const newAdj = next.adjMat.map((row) => row.map((cell) => ({ ...cell })));
  newAdj[src][dest].distance = weight;
  newAdj[dest][src].distance = weight;
  next.adjMat = newAdj;
  next.madeVertex = false;
  next.displayEdge1 = src;
  next.displayEdge2 = dest;
  next.note = `Made edge from ${next.vertexList[src].label} to ${next.vertexList[dest].label} with weight ${weight}`;
  next.drawMode = 3;
  return next;
}

export function changeView(state: GraphWState): GraphWState {
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
  }
  next.drawMode = 4;
  return next;
}

export function warningNew(state: GraphWState): GraphWState {
  if (state.wasClearPressed) {
    return clearGraph(state);
  }
  return {
    ...state,
    wasClearPressed: true,
    note: 'ARE YOU SURE? Press again to clear old graph',
  };
}

export function clearGraph(state: GraphWState): GraphWState {
  return createInitialGraphWState();
}

export function saveState(state: GraphWState): GraphWState {
  const next = { ...state };
  next.adjMat2 = next.adjMat.map((row) => row.map((cell) => ({ ...cell })));
  return next;
}

export function restoreState(state: GraphWState): GraphWState {
  const next = { ...state };
  next.adjMat = next.adjMat2.map((row) => row.map((cell) => ({ ...cell })));
  return next;
}

export function putInPQ(state: GraphWState, newEdgeDest: number, newEdgeDist: number): GraphWState {
  const next = { ...state };
  const pq = new PriorityQ(next.thePQ);

  const queueIndex = pq.find(newEdgeDest);
  if (queueIndex !== -1) {
    const tempEdge = pq.peekN(queueIndex)!;
    const oldDist = tempEdge.distance;
    if (oldDist > newEdgeDist) {
      pq.removeN(queueIndex);
      const theEdge: GraphWEdge = {
        srcVert: next.currentVert,
        destVert: newEdgeDest,
        distance: newEdgeDist,
      };
      pq.insert(theEdge);
    }
  } else {
    const theEdge: GraphWEdge = {
      srcVert: next.currentVert,
      destVert: newEdgeDest,
      distance: newEdgeDist,
    };
    pq.insert(theEdge);
  }

  next.thePQ = pq.toArray();
  return next;
}

export function stepMST(state: GraphWState, clickX?: number, clickY?: number): GraphWState {
  let next = {
    ...state,
    vertexList: state.vertexList.map((v) => ({ ...v })),
    adjMat: state.adjMat.map((r) => r.map((c) => ({ ...c }))),
    adjMat2: state.adjMat2.map((r) => r.map((c) => ({ ...c }))),
    tree: [...state.tree],
    thePQ: state.thePQ.map((e) => ({ ...e })),
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
      next = saveState(next);
      next.note = 'Single-click on vertex from which to start tree';
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
      next.note = `Starting tree from vertex ${next.vertexList[next.startingVertex].label}`;
      next.currentVert = next.startingVertex;
      next.codePart = 3;
      next.drawMode = 1;
      return next;
    }
    case 3: {
      next.tree[next.nTree] = next.currentVert;
      next.nTree++;
      next.vertexList[next.currentVert].isInTree = true;
      next.note = `Placed vertex ${next.vertexList[next.currentVert].label} in tree`;
      if (next.nTree === next.nVerts) {
        next.codePart = 6;
      } else {
        next.codePart = 4;
      }
      next.drawMode = 1;
      return next;
    }
    case 4: {
      // Put adjacent vertices in priority queue
      for (let j = 0; j < next.nVerts; j++) {
        if (j === next.currentVert) continue;
        if (next.vertexList[j].isInTree) continue;
        const d = next.adjMat[next.currentVert][j].distance;
        if (d === INFINITY) continue;
        next = putInPQ(next, j, d);
      }

      const pq = new PriorityQ(next.thePQ);
      if (pq.size() === 0) {
        next.note = 'Graph not connected';
        next.codePart = 8;
      } else {
        next.note = `Placed vertices adj to ${next.vertexList[next.currentVert].label} in priority queue`;
        next.codePart = 5;
      }
      next.drawMode = 1;
      return next;
    }
    case 5: {
      const pq = new PriorityQ(next.thePQ);
      const theEdge = pq.removeMin();
      next.thePQ = pq.toArray();

      if (theEdge) {
        next.currentVert = theEdge.destVert;
        next.adjMat[theEdge.srcVert][theEdge.destVert].isInTree = true;
        next.adjMat[theEdge.destVert][theEdge.srcVert].isInTree = true;
        next.note = `Removed minimum-distance edge ${next.vertexList[theEdge.srcVert].label}${next.vertexList[theEdge.destVert].label}${theEdge.distance} from priority queue`;
      }
      next.drawMode = 1;
      next.codePart = 3; // loops back to add currentVert to tree
      return next;
    }
    case 6: {
      next.note = 'Press again to delete unmarked edges';
      next.drawMode = 1;
      next.codePart = 7;
      return next;
    }
    case 7: {
      // Delete all unmarked edges (distance = INFINITY)
      const newAdj = next.adjMat.map((r) => r.map((c) => ({ ...c })));
      for (let i = 0; i < next.nVerts; i++) {
        for (let j = 0; j < next.nVerts; j++) {
          if (newAdj[i][j].distance !== INFINITY) {
            if (!newAdj[i][j].isInTree) {
              newAdj[i][j].distance = INFINITY;
            } else {
              newAdj[i][j].isInTree = false;
            }
          }
        }
      }
      next.adjMat = newAdj;
      next.note = 'Minimum spanning tree; press again to restore tree';
      next.drawMode = 1;
      next.codePart = 8;
      next.isRunning = false;
      return next;
    }
    case 8: {
      next = restoreState(next);
      next.note = 'Press any button';
      next.nTree = 0;
      for (let i = 0; i < next.nVerts; i++) {
        next.vertexList[i].isInTree = false;
      }
      next.thePQ = [];
      next.codePart = 1;
      next.opMode = 0;
      next.drawMode = 4;
      return next;
    }
    default:
      return next;
  }
}

export function loadSampleGraphW(): GraphWState {
  const state = createInitialGraphWState();

  // Classic 6-vertex sample graph from Robert Lafore's Chapter 14 (MSTW)
  // Vertices: A (60, 140), B (140, 70), C (140, 210), D (280, 70), E (280, 210), F (360, 140)
  const sampleCoords = [
    { x: 60, y: 140 },  // A
    { x: 140, y: 70 },  // B
    { x: 140, y: 210 }, // C
    { x: 280, y: 70 },  // D
    { x: 280, y: 210 }, // E
    { x: 360, y: 140 }, // F
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

  // Symmetric undirected edges:
  // A-B: 6
  // A-C: 4
  // B-C: 10
  // B-D: 7
  // B-E: 7
  // C-D: 8
  // C-E: 5
  // D-E: 12
  // D-F: 7
  // E-F: 7
  const edges = [
    { u: 0, v: 1, w: 6 },  // A-B
    { u: 0, v: 2, w: 4 },  // A-C
    { u: 1, v: 2, w: 10 }, // B-C
    { u: 1, v: 3, w: 7 },  // B-D
    { u: 1, v: 4, w: 7 },  // B-E
    { u: 2, v: 3, w: 8 },  // C-D
    { u: 2, v: 4, w: 5 },  // C-E
    { u: 3, v: 4, w: 12 }, // D-E
    { u: 3, v: 5, w: 7 },  // D-F
    { u: 4, v: 5, w: 7 },  // E-F
  ];

  for (const e of edges) {
    state.adjMat[e.u][e.v].distance = e.w;
    state.adjMat[e.v][e.u].distance = e.w;
  }

  state.note = 'Sample graph loaded. Click Tree then click vertex A to start!';
  state.drawMode = 4;
  return state;
}
