import React, { useState, useEffect, useRef } from 'react';
import {
  AppletCanvas,
} from './components/AppletCanvas';
import {
  AppletControls,
} from './components/AppletControls';
import {
  CSharpCodeViewer,
} from './components/CSharpCodeViewer';
import {
  AlgorithmExplainer,
} from './components/AlgorithmExplainer';
import {
  OriginalFilesViewer,
} from './components/OriginalFilesViewer';
import {
  AppletLibrarySidebar,
} from './components/AppletLibrarySidebar';
import {
  PendingAppletView,
} from './components/PendingAppletView';
import {
  AppletState,
} from './types/applet';
import {
  APPLET_CATALOG,
  AppletMetadata,
} from './types/appletCatalog';
import {
  createInitialState,
  handleNewArray,
  handleFill,
  handleInsert,
  startFind,
  stepFind,
  startDelete,
  stepDelete,
} from './utils/personGroupLogic';
import {
  OrderedAppletState,
  createInitialOrderedState,
  handleOrderedNew,
  handleOrderedFill,
  startOrderedInsert,
  stepOrderedInsert,
  startOrderedFind,
  stepOrderedFind,
  startOrderedDelete,
  stepOrderedDelete,
} from './utils/orderedArrayLogic';
import {
  BubbleSortState,
  createInitialBubbleSortState,
  handleBubbleSortNew,
  handleBubbleSortSize,
  stepBubbleSort,
} from './utils/bubbleSortLogic';
import {
  BubbleSortCanvas,
} from './components/BubbleSortCanvas';
import {
  BubbleSortControls,
} from './components/BubbleSortControls';
import {
  SelectionSortState,
  createInitialSelectionSortState,
  handleSelectionSortNew,
  handleSelectionSortSize,
  stepSelectionSort,
} from './utils/selectionSortLogic';
import {
  SelectionSortCanvas,
} from './components/SelectionSortCanvas';
import {
  SelectionSortControls,
} from './components/SelectionSortControls';
import {
  InsertionSortState,
  createInitialInsertionSortState,
  handleInsertionSortNew,
  handleInsertionSortSize,
  stepInsertionSort,
} from './utils/insertionSortLogic';
import {
  InsertionSortCanvas,
} from './components/InsertionSortCanvas';
import {
  InsertionSortControls,
} from './components/InsertionSortControls';
import {
  StackState,
  createInitialStackState,
  startPush,
  startPop,
  startPeek,
  startNewStack,
  stepStack,
} from './utils/stackLogic';
import {
  StackCanvas,
} from './components/StackCanvas';
import {
  StackControls,
} from './components/StackControls';
import {
  QueueState,
  createInitialQueueState,
  startInsert,
  startRemove,
  startPeek as startQueuePeek,
  startNewQueue,
  stepQueue,
} from './utils/queueLogic';
import {
  QueueCanvas,
} from './components/QueueCanvas';
import {
  QueueControls,
} from './components/QueueControls';
import {
  PriorityQueueState,
  createInitialPriorityQueueState,
  startInsert as startPQInsert,
  startRemove as startPQRemove,
  startPeek as startPQPeek,
  startNewQueue as startPQNewQueue,
  stepPriorityQueue,
} from './utils/priorityQueueLogic';
import {
  PriorityQueueCanvas,
} from './components/PriorityQueueCanvas';
import {
  PriorityQueueControls,
} from './components/PriorityQueueControls';
import {
  LinkListState,
  createInitialLinkListState,
  startNewList,
  startInsert as startLinkInsert,
  startFind as startLinkFind,
  startDelete as startLinkDelete,
  setSortStatus as setLinkSortStatus,
  stepLinkList,
} from './utils/linkListLogic';
import {
  LinkListCanvas,
} from './components/LinkListCanvas';
import {
  LinkListControls,
} from './components/LinkListControls';
import {
  TowersState,
  createInitialTowersState,
  startDrag,
  updateDrag,
  endDrag,
  stepTowers,
} from './utils/towersLogic';
import {
  TowersCanvas,
} from './components/TowersCanvas';
import {
  TowersControls,
} from './components/TowersControls';
import {
  QuickSort1State,
  createInitialQuickSort1State,
  handleQuickSort1New,
  handleQuickSort1Size,
  stepQuickSort1,
} from './utils/quickSort1Logic';
import {
  QuickSort1Canvas,
} from './components/QuickSort1Canvas';
import {
  QuickSort1Controls,
} from './components/QuickSort1Controls';
import {
  QuickSort2State,
  createInitialQuickSort2State,
  handleQuickSort2New,
  handleQuickSort2Size,
  stepQuickSort2,
} from './utils/quickSort2Logic';
import {
  QuickSort2Canvas,
} from './components/QuickSort2Canvas';
import {
  QuickSort2Controls,
} from './components/QuickSort2Controls';
import {
  MergeSortState,
  createInitialMergeSortState,
  handleMergeSortNew,
  handleMergeSortSize,
  stepMergeSort,
} from './utils/mergeSortLogic';
import {
  MergeSortCanvas,
} from './components/MergeSortCanvas';
import {
  MergeSortControls,
} from './components/MergeSortControls';
import {
  TreeState,
  createInitialTreeState,
  startTreeFill,
  startTreeFind,
  startTreeInsert,
  startTreeTraverse,
  startTreeDelete,
  stepTree,
} from './utils/treeLogic';
import {
  TreeCanvas,
} from './components/TreeCanvas';
import {
  TreeControls,
} from './components/TreeControls';
import {
  HashState,
  createInitialHashState,
  startHashNew,
  startHashFill,
  startHashInsert,
  startHashFind,
  startHashDelete,
  stepHash,
} from './utils/hashLogic';
import {
  HashCanvas,
} from './components/HashCanvas';
import {
  HashControls,
} from './components/HashControls';
import {
  HashChainState,
  createInitialHashChainState,
  startChainNew,
  startChainFill,
  startChainInsert,
  startChainFind,
  startChainDelete,
  stepChain,
  setChainScroll,
} from './utils/hashChainLogic';
import {
  HashChainCanvas,
} from './components/HashChainCanvas';
import {
  HashChainControls,
} from './components/HashChainControls';
import {
  GraphDWState,
  createInitialGraphDWState,
  loadSampleGraph,
  makeVertex,
  startDrag as startGraphDrag,
  updateDragPosition as updateGraphDrag,
  endDrag as endGraphDrag,
  changeView as changeGraphView,
  warningNew as warningGraphNew,
  clearGraph as clearGraphDW,
  stepPath as stepGraphPath,
} from './utils/graphDWLogic';
import {
  GraphDWCanvas,
} from './components/GraphDWCanvas';
import {
  GraphDWControls,
} from './components/GraphDWControls';
import {
  GraphState,
  createInitialGraphState,
  loadSampleGraph as loadSampleGraphN,
  makeVertex as makeGraphNVertex,
  startDrag as startGraphNDrag,
  updateDragPosition as updateGraphNDrag,
  endDrag as endGraphNDrag,
  changeView as changeGraphNView,
  warningNew as warningGraphNNew,
  clearGraph as clearGraphN,
  stepDFS,
  stepBFS,
  stepTree as stepGraphNTree,
  stepCurrentGraphNOp,
} from './utils/graphLogic';
import {
  GraphCanvas,
} from './components/GraphCanvas';
import {
  GraphControls,
} from './components/GraphControls';
import {
  GraphWState,
  createInitialGraphWState,
  loadSampleGraphW,
  makeVertex as makeGraphWVertex,
  startDrag as startGraphWDrag,
  updateDragPosition as updateGraphWDrag,
  endDrag as endGraphWDrag,
  changeView as changeGraphWView,
  warningNew as warningGraphWNew,
  clearGraph as clearGraphW,
  stepMST as stepGraphWMST,
} from './utils/graphWLogic';
import {
  GraphWCanvas,
} from './components/GraphWCanvas';
import {
  GraphWControls,
} from './components/GraphWControls';
import {
  downloadFullProjectZip,
  downloadAllProjectsMasterZip,
} from './utils/csharpCode';
import {
  Layout,
  Code2,
  BookOpen,
  FolderArchive,
  Download,
  Info,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Monitor,
  Layers,
  Menu,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'viewer' | 'code' | 'guide' | 'artifacts'>('viewer');
  const [selectedApplet, setSelectedApplet] = useState<AppletMetadata>(() => {
    const ch14 = APPLET_CATALOG.find((c) => c.chapterNum === 14);
    return ch14?.applets.find((a) => a.id === 'graph-w') || ch14?.applets.find((a) => a.id === 'graph-dw') || ch14?.applets[0] || APPLET_CATALOG[0].applets[0];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // State for Chapter 13: Graph Workshop (DFS, BFS, Spanning Tree)
  const [graphState, setGraphState] = useState<GraphState>(() => {
    return loadSampleGraphN();
  });

  // State for Chapter 14: Weighted, Undirected Graph (Prim's Minimum Spanning Tree)
  const [graphWState, setGraphWState] = useState<GraphWState>(() => {
    return loadSampleGraphW();
  });

  // State for Chapter 14: Directed, Weighted Graph (Dijkstra's Shortest Path)
  const [graphDWState, setGraphDWState] = useState<GraphDWState>(() => {
    return loadSampleGraph();
  });

  // State for Separate-Chaining Hash Table
  const [hashChainState, setHashChainState] = useState<HashChainState>(() => {
    return createInitialHashChainState();
  });

  // State for Hash Table
  const [hashState, setHashState] = useState<HashState>(() => {
    return createInitialHashState();
  });

  // State for Binary Tree
  const [treeState, setTreeState] = useState<TreeState>(() => {
    return createInitialTreeState();
  });

  // State for Merge Sort
  const [mergeSortState, setMergeSortState] = useState<MergeSortState>(() => {
    return createInitialMergeSortState(12, 1);
  });

  // State for QuickSort 2
  const [quickSort2State, setQuickSort2State] = useState<QuickSort2State>(() => {
    return createInitialQuickSort2State(10, 1);
  });

  // State for QuickSort 1
  const [quickSort1State, setQuickSort1State] = useState<QuickSort1State>(() => {
    return createInitialQuickSort1State(10, 1);
  });

  // State for Towers of Hanoi
  const [towersState, setTowersState] = useState<TowersState>(() => {
    return createInitialTowersState(4);
  });

  // State for Link List
  const [linkListState, setLinkListState] = useState<LinkListState>(() => {
    return createInitialLinkListState(true, 10);
  });

  // State for Priority Queue
  const [priorityQueueState, setPriorityQueueState] = useState<PriorityQueueState>(() => {
    return createInitialPriorityQueueState();
  });

  // State for Queue
  const [queueState, setQueueState] = useState<QueueState>(() => {
    return createInitialQueueState();
  });

  // State for Stack
  const [stackState, setStackState] = useState<StackState>(() => {
    return createInitialStackState();
  });

  // State for Selection Sort
  const [selectionSortState, setSelectionSortState] = useState<SelectionSortState>(() => {
    return createInitialSelectionSortState(10, 1);
  });

  // State for Insertion Sort
  const [insertionSortState, setInsertionSortState] = useState<InsertionSortState>(() => {
    return createInitialInsertionSortState(10, 1);
  });

  // State for Bubble Sort
  const [bubbleSortState, setBubbleSortState] = useState<BubbleSortState>(() => {
    return createInitialBubbleSortState(10, 1);
  });

  // State for Unordered Array
  const [unorderedState, setUnorderedState] = useState<AppletState>(() => {
    const init = createInitialState();
    return handleFill(init, true, 25);
  });

  // State for Ordered Array
  const [orderedState, setOrderedState] = useState<OrderedAppletState>(() => {
    const init = createInitialOrderedState();
    return handleOrderedFill(init, true, 20);
  });

  const [inputValue, setInputValue] = useState<string>('42');
  const [classicTheme, setClassicTheme] = useState<boolean>(true);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isMasterZipping, setIsMasterZipping] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([
    'تم تحميل بريمج جدول الهاش (Linear-Probe Hash Table) من الفصل 11 بنجاح.',
    'تمثيل دقيق لـ 60 خلية موزعة على 5 أعمدة مع دالة التجزئة key % totalCells.',
    'يدعم عمليات New (إنشاء سعة مخصصة)، Fill (ملء عشوائي)، Ins (إدراج بالمسح الخطي)، Del (حذف واستبدال بـ *Del*)، و Find (مسح متتابع بالسهم الأحمر).',
    'تم توليد مشروع C# .NET 8.0 كامل ومطابق لواجهات وبرمجيات Robert Lafore لعام 1998.',
  ]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isGraph = selectedApplet.id === 'graph';
  const isGraphW = selectedApplet.id === 'graph-w';
  const isGraphDW = selectedApplet.id === 'graph-dw';
  const isHashChain = selectedApplet.id === 'hash-chain';
  const isHash = selectedApplet.id === 'hash-table';
  const isTree = selectedApplet.id === 'tree';
  const isMergeSort = selectedApplet.id === 'merge-sort';
  const isQuickSort2 = selectedApplet.id === 'quick-sort-2';
  const isQuickSort1 = selectedApplet.id === 'quick-sort-1';
  const isTowers = selectedApplet.id === 'towers';
  const isLinkList = selectedApplet.id === 'link-list';
  const isPriorityQueue = selectedApplet.id === 'priority-queue';
  const isQueue = selectedApplet.id === 'queue';
  const isStack = selectedApplet.id === 'stack';
  const isSelect = selectedApplet.id === 'select-sort';
  const isInsert = selectedApplet.id === 'insert-sort';
  const isBubble = selectedApplet.id === 'bubble-sort';
  const isOrdered = selectedApplet.id === 'ordered-array';
  const currentState = isOrdered ? orderedState : unorderedState;

  // Animation runner loop when running in automatic mode
  useEffect(() => {
    if (isGraph) {
      if (graphState.isRunning && graphState.opMode !== 0) {
        timerRef.current = setTimeout(() => {
          const nextState = stepCurrentGraphNOp(graphState);
          setGraphState(nextState);
          if (nextState.note !== graphState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, graphState.speedMs);
      }
    } else if (isGraphW) {
      if (graphWState.isRunning && graphWState.opMode === 1) {
        timerRef.current = setTimeout(() => {
          const nextState = stepGraphWMST(graphWState);
          setGraphWState(nextState);
          if (nextState.note !== graphWState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, graphWState.speedMs);
      }
    } else if (isGraphDW) {
      if (graphDWState.isRunning && graphDWState.opMode === 1) {
        timerRef.current = setTimeout(() => {
          const nextState = stepGraphPath(graphDWState);
          setGraphDWState(nextState);
          if (nextState.note !== graphDWState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, graphDWState.speedMs);
      }
    } else if (isHashChain) {
      if (hashChainState.isRunning && hashChainState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const val = parseInt(inputValue, 10);
          const { nextState } = stepChain(hashChainState, !isNaN(val) ? val : undefined);
          setHashChainState(nextState);
          if (nextState.note !== hashChainState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, hashChainState.speedMs);
      }
    } else if (isHash) {
      if (hashState.isRunning && hashState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const val = parseInt(inputValue, 10);
          const { nextState } = stepHash(hashState, !isNaN(val) ? val : undefined);
          setHashState(nextState);
          if (nextState.note !== hashState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, hashState.speedMs);
      }
    } else if (isTree) {
      if (treeState.isRunning && treeState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const val = parseInt(inputValue, 10);
          const { nextState } = stepTree(treeState, !isNaN(val) ? val : undefined);
          setTreeState(nextState);
          if (nextState.note !== treeState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, treeState.speedMs);
      }
    } else if (isMergeSort) {
      if (mergeSortState.isRunning && !mergeSortState.doneFlag) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepMergeSort(mergeSortState);
          setMergeSortState(nextState);
          if (nextState.note !== mergeSortState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, mergeSortState.speedMs);
      }
    } else if (isQuickSort2) {
      if (quickSort2State.isRunning && !quickSort2State.doneFlag) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepQuickSort2(quickSort2State);
          setQuickSort2State(nextState);
          if (nextState.note !== quickSort2State.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, quickSort2State.speedMs);
      }
    } else if (isQuickSort1) {
      if (quickSort1State.isRunning && !quickSort1State.doneFlag) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepQuickSort1(quickSort1State);
          setQuickSort1State(nextState);
          if (nextState.note !== quickSort1State.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, quickSort1State.speedMs);
      }
    } else if (isTowers) {
      if (towersState.isRunning && !towersState.isDoneFlag) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepTowers(towersState);
          setTowersState(nextState);
          if (nextState.note !== towersState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, towersState.speedMs);
      }
    } else if (isLinkList) {
      if (linkListState.isRunning && linkListState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const numVal = parseInt(inputValue, 10);
          const { nextState } = stepLinkList(linkListState, isNaN(numVal) ? undefined : numVal);
          setLinkListState(nextState);
          if (nextState.note !== linkListState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, linkListState.speedMs);
      }
    } else if (isPriorityQueue) {
      if (priorityQueueState.isRunning && priorityQueueState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepPriorityQueue(priorityQueueState);
          setPriorityQueueState(nextState);
          if (nextState.returnString) {
            setInputValue(nextState.returnString);
          }
          if (nextState.note !== priorityQueueState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, priorityQueueState.speedMs);
      }
    } else if (isQueue) {
      if (queueState.isRunning && queueState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepQueue(queueState);
          setQueueState(nextState);
          if (nextState.returnString) {
            setInputValue(nextState.returnString);
          }
          if (nextState.note !== queueState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, queueState.speedMs);
      }
    } else if (isStack) {
      if (stackState.isRunning && stackState.opMode !== 'idle') {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepStack(stackState);
          setStackState(nextState);
          if (nextState.returnString) {
            setInputValue(nextState.returnString);
          }
          if (nextState.note !== stackState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, stackState.speedMs);
      }
    } else if (isSelect) {
      if (selectionSortState.isRunning) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepSelectionSort(selectionSortState);
          setSelectionSortState(nextState);
          if (nextState.note !== selectionSortState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, selectionSortState.speedMs);
      }
    } else if (isInsert) {
      if (insertionSortState.isRunning) {
        timerRef.current = setTimeout(() => {
          const { nextState } = stepInsertionSort(insertionSortState);
          setInsertionSortState(nextState);
          if (nextState.note !== insertionSortState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, insertionSortState.speedMs);
      }
    } else if (isBubble) {
      if (bubbleSortState.isRunning) {
        timerRef.current = setTimeout(() => {
          const { nextState, finished } = stepBubbleSort(bubbleSortState);
          setBubbleSortState(nextState);
          if (nextState.note !== bubbleSortState.note) {
            setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
          }
        }, bubbleSortState.speedMs);
      }
    } else if (isOrdered) {
      if (orderedState.isRunning && !orderedState.stepByStep) {
        timerRef.current = setTimeout(() => {
          if (orderedState.currentOp === 'find') {
            const { nextState, finished } = stepOrderedFind(orderedState);
            setOrderedState(nextState);
            if (nextState.note !== orderedState.note) {
              setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
            }
          } else if (orderedState.currentOp === 'ins') {
            const { nextState, finished } = stepOrderedInsert(orderedState);
            setOrderedState(nextState);
            if (nextState.note !== orderedState.note) {
              setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
            }
          } else if (orderedState.currentOp === 'del') {
            const { nextState, finished } = stepOrderedDelete(orderedState);
            setOrderedState(nextState);
            if (nextState.note !== orderedState.note) {
              setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
            }
          }
        }, orderedState.speedMs);
      }
    } else {
      if (unorderedState.isRunning && !unorderedState.stepByStep) {
        timerRef.current = setTimeout(() => {
          if (unorderedState.currentOp === 'find') {
            const { nextState } = stepFind(unorderedState);
            setUnorderedState(nextState);
            if (nextState.note !== unorderedState.note) {
              setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
            }
          } else if (unorderedState.currentOp === 'del') {
            const { nextState } = stepDelete(unorderedState);
            setUnorderedState(nextState);
            if (nextState.note !== unorderedState.note) {
              setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
            }
          }
        }, unorderedState.speedMs);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isHash,
    hashState,
    isTree,
    treeState,
    isMergeSort,
    mergeSortState,
    isQuickSort2,
    quickSort2State,
    isQuickSort1,
    quickSort1State,
    isTowers,
    towersState,
    isLinkList,
    linkListState,
    isPriorityQueue,
    priorityQueueState,
    isQueue,
    queueState,
    isStack,
    stackState,
    isSelect,
    selectionSortState,
    isInsert,
    insertionSortState,
    isBubble,
    bubbleSortState,
    orderedState,
    unorderedState,
    isHashChain,
    hashChainState,
    isGraphDW,
    graphDWState,
    isGraphW,
    graphWState,
    isGraph,
    graphState,
  ]);

  // Graph Workshop (Chapter 13) Handlers (DFS, BFS, Spanning Tree)
  const onGraphNNew = () => {
    const next = warningGraphNNew(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNDFS = () => {
    const next = stepDFS(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNBFS = () => {
    const next = stepBFS(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNTree = () => {
    const next = stepGraphNTree(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNView = () => {
    const next = changeGraphNView(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNSample = () => {
    const next = loadSampleGraphN();
    setGraphState(next);
    setExecutionLog((prev) => [
      'تم تحميل المخطط النموذجي (Sample Graph: A-I مع حواف متصلة)',
      ...prev.slice(0, 19),
    ]);
  };

  const onGraphNStep = () => {
    const next = stepCurrentGraphNOp(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNToggleRun = () => {
    setGraphState((prev) => {
      const willRun = !prev.isRunning;
      let nextState = { ...prev, isRunning: willRun };
      if (willRun && prev.opMode === 0) {
        nextState = stepDFS(nextState);
      }
      return nextState;
    });
  };

  const onGraphNReset = () => {
    const next = clearGraphN(graphState);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNSpeedChange = (speedMs: number) => {
    setGraphState((prev) => ({ ...prev, speedMs }));
  };

  const getGraphNCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 440 / (rect.width || 440);
    const scaleY = 320 / (rect.height || 320);
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const onGraphNCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphNCanvasCoords(e);
    if (graphState.opMode !== 0 && graphState.codePart === 1) {
      const next = stepCurrentGraphNOp(graphState, x, y);
      setGraphState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
      return;
    }
    const next = startGraphNDrag(graphState, x, y);
    setGraphState(next);
  };

  const onGraphNCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!graphState.isDragging) return;
    const { x, y } = getGraphNCanvasCoords(e);
    const next = updateGraphNDrag(graphState, x, y);
    setGraphState(next);
  };

  const onGraphNCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!graphState.isDragging) return;
    const { x, y } = getGraphNCanvasCoords(e);
    const next = endGraphNDrag(graphState, x, y);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphNCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphNCanvasCoords(e);
    const next = makeGraphNVertex(graphState, x, y);
    setGraphState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  // Weighted, Undirected Graph (Chapter 14) Handlers (Prim's MST)
  const onGraphWNew = () => {
    const next = warningGraphWNew(graphWState);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWTree = () => {
    const next = stepGraphWMST(graphWState);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWView = () => {
    const next = changeGraphWView(graphWState);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWSample = () => {
    const next = loadSampleGraphW();
    setGraphWState(next);
    setExecutionLog((prev) => [
      'تم تحميل الرسم البياني التوضيحي الموزون غير الموجّه (Sample Graph: A-E)',
      ...prev.slice(0, 19),
    ]);
  };

  const onGraphWStep = () => {
    const next = stepGraphWMST(graphWState);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWToggleRun = () => {
    setGraphWState((prev) => {
      const willRun = !prev.isRunning;
      let nextState = { ...prev, isRunning: willRun };
      if (willRun && prev.opMode === 0) {
        nextState = stepGraphWMST(nextState);
      }
      return nextState;
    });
  };

  const onGraphWReset = () => {
    const next = clearGraphW(graphWState);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWSpeedChange = (speedMs: number) => {
    setGraphWState((prev) => ({ ...prev, speedMs }));
  };

  // Canvas Mouse Event Handlers for GraphW
  const getGraphWCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 440 / (rect.width || 440);
    const scaleY = 320 / (rect.height || 320);
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const onGraphWCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphWCanvasCoords(e);
    // If Prim's MST is waiting for starting vertex selection
    if (graphWState.opMode === 1 && graphWState.codePart === 1) {
      const next = stepGraphWMST(graphWState, x, y);
      setGraphWState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
      return;
    }

    // Otherwise, initiate edge dragging from a vertex
    const next = startGraphWDrag(graphWState, x, y);
    setGraphWState(next);
  };

  const onGraphWCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (graphWState.drawMode !== 2) return;
    const { x, y } = getGraphWCanvasCoords(e);
    const next = updateGraphWDrag(graphWState, x, y);
    setGraphWState(next);
  };

  const onGraphWCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (graphWState.drawMode !== 2) return;
    const { x, y } = getGraphWCanvasCoords(e);
    const weightVal = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(weightVal);
    const next = endGraphWDrag(graphWState, isNum, isNum ? weightVal : -1, x, y);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphWCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphWCanvasCoords(e);
    const next = makeGraphWVertex(graphWState, x, y);
    setGraphWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };
  const onGraphNew = () => {
    const next = warningGraphNew(graphDWState);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphPath = () => {
    const next = stepGraphPath(graphDWState);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphView = () => {
    const next = changeGraphView(graphDWState);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphSample = () => {
    const next = loadSampleGraph();
    setGraphDWState(next);
    setExecutionLog((prev) => [
      'تم تحميل الرسم البياني التوضيحي الموزون والموجّه (Sample Graph: A-E)',
      ...prev.slice(0, 19),
    ]);
  };

  const onGraphStep = () => {
    const next = stepGraphPath(graphDWState);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphToggleRun = () => {
    setGraphDWState((prev) => {
      const willRun = !prev.isRunning;
      let nextState = { ...prev, isRunning: willRun };
      if (willRun && prev.opMode === 0) {
        nextState = stepGraphPath(nextState);
      }
      return nextState;
    });
  };

  const onGraphReset = () => {
    const next = clearGraphDW(graphDWState);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphSpeedChange = (speedMs: number) => {
    setGraphDWState((prev) => ({ ...prev, speedMs }));
  };

  // Canvas Mouse Event Handlers for GraphDW
  const getGraphCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 440 / (rect.width || 440);
    const scaleY = 345 / (rect.height || 345);
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    };
  };

  const onGraphCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphCanvasCoords(e);
    // If Dijkstra path is waiting for starting vertex selection
    if (graphDWState.opMode === 1 && graphDWState.codePart === 1) {
      const next = stepGraphPath(graphDWState, x, y);
      setGraphDWState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
      return;
    }

    // Otherwise, initiate edge dragging from a vertex
    const next = startGraphDrag(graphDWState, x, y);
    setGraphDWState(next);
  };

  const onGraphCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (graphDWState.drawMode !== 2) return;
    const { x, y } = getGraphCanvasCoords(e);
    const next = updateGraphDrag(graphDWState, x, y);
    setGraphDWState(next);
  };

  const onGraphCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (graphDWState.drawMode !== 2) return;
    const { x, y } = getGraphCanvasCoords(e);
    const weightVal = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(weightVal);
    const next = endGraphDrag(graphDWState, isNum, isNum ? weightVal : -1, x, y);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onGraphCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getGraphCanvasCoords(e);
    const next = makeVertex(graphDWState, x, y);
    setGraphDWState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  // Separate-Chaining Hash Table Handlers
  const onChainNew = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startChainNew(hashChainState, isNum, isNum ? val : undefined);
    setHashChainState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onChainFill = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startChainFill(hashChainState, isNum, isNum ? val : undefined);
    setHashChainState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onChainInsert = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startChainInsert(hashChainState, isNum, isNum ? val : undefined);
    setHashChainState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onChainFind = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startChainFind(hashChainState, isNum, isNum ? val : undefined);
    setHashChainState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onChainDelete = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startChainDelete(hashChainState, isNum, isNum ? val : undefined);
    setHashChainState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onChainStep = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const { nextState } = stepChain(hashChainState, isNum ? val : undefined);
    setHashChainState(nextState);
    if (nextState.note !== hashChainState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onChainToggleRun = () => {
    setHashChainState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const onChainReset = () => {
    const reset = createInitialHashChainState();
    setHashChainState(reset);
    setExecutionLog((prev) => ['تمت إعادة تعيين جدول الهاش بالسلاسل المنفصلة (25 قائمة و 25 عنصراً).', ...prev.slice(0, 19)]);
  };

  const onChainSpeedChange = (speed: number) => {
    setHashChainState((prev) => ({
      ...prev,
      speedMs: speed,
    }));
  };

  const onChainScrollChange = (newTop: number) => {
    setHashChainState((prev) => setChainScroll(prev, newTop));
  };

  const onChainSelectKey = (key: number) => {
    setInputValue(key.toString());
  };

  // Hash Table Handlers
  const onHashNew = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startHashNew(hashState, isNum, isNum ? val : undefined);
    setHashState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onHashFill = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startHashFill(hashState, isNum, isNum ? val : undefined);
    setHashState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onHashInsert = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startHashInsert(hashState, isNum, isNum ? val : undefined);
    setHashState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onHashFind = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startHashFind(hashState, isNum, isNum ? val : undefined);
    setHashState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onHashDelete = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startHashDelete(hashState, isNum, isNum ? val : undefined);
    setHashState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onHashStep = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const { nextState } = stepHash(hashState, isNum ? val : undefined);
    setHashState(nextState);
    if (nextState.note !== hashState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onHashToggleRun = () => {
    setHashState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const onHashReset = () => {
    const reset = createInitialHashState();
    setHashState(reset);
    setExecutionLog((prev) => ['تمت إعادة ضبط جدول الهاش للحالة الأولية.', ...prev.slice(0, 19)]);
  };

  const onHashSpeedChange = (speed: number) => {
    setHashState((prev) => ({
      ...prev,
      speedMs: speed,
    }));
  };

  const onHashSelectKey = (key: number) => {
    setInputValue(key.toString());
  };

  // Binary Tree Handlers
  const onTreeFill = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startTreeFill(treeState, isNum, isNum ? val : undefined);
    setTreeState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onTreeFind = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startTreeFind(treeState, isNum, isNum ? val : undefined);
    setTreeState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onTreeInsert = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startTreeInsert(treeState, isNum, isNum ? val : undefined);
    setTreeState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onTreeTraverse = () => {
    const next = startTreeTraverse(treeState);
    setTreeState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onTreeDelete = () => {
    const val = parseInt(inputValue.trim(), 10);
    const isNum = !isNaN(val);
    const next = startTreeDelete(treeState, isNum, isNum ? val : undefined);
    setTreeState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onTreeStep = () => {
    const val = parseInt(inputValue.trim(), 10);
    const { nextState } = stepTree({ ...treeState, isRunning: false }, !isNaN(val) ? val : undefined);
    setTreeState(nextState);
    if (nextState.note !== treeState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onTreeToggleRun = () => {
    setTreeState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !treeState.isRunning ? 'بدء تشغيل عمليات الشجرة الثنائية آلياً (Run)...' : 'إيقاف مؤقت للتشغيل الآلي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onTreeReset = () => {
    const next = createInitialTreeState();
    setTreeState(next);
    setExecutionLog((prev) => ['تمت إعادة تعيين الشجرة الثنائية إلى 10 عقد افتراضية.', ...prev.slice(0, 19)]);
  };

  const onTreeSpeedChange = (speedMs: number) => {
    setTreeState((prev) => ({ ...prev, speedMs }));
  };

  const onTreeSelectNode = (key: number) => {
    setInputValue(key.toString());
    setExecutionLog((prev) => [`تم اختيار العقدة ذات المفتاح ${key} ووضعها في صندوق الإدخال.`, ...prev.slice(0, 19)]);
  };

  // Merge Sort Handlers
  const onMergeSortNew = () => {
    const next = handleMergeSortNew(mergeSortState);
    setMergeSortState(next);
    setExecutionLog((prev) => [
      `تم توليد بيانات جديدة لترتيب الدمج بوضعية ${next.initOrder === 1 ? 'العشوائية (Random)' : 'المعكوسة (Inverse)'}.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onMergeSortSize = () => {
    const next = handleMergeSortSize(mergeSortState);
    setMergeSortState(next);
    setExecutionLog((prev) => [
      `تم تبديل حجم مصفوفة الدمج إلى ${next.aSize} عمود مع إعادة التهيئة.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onMergeSortDraw = () => {
    setMergeSortState((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم أعمدة ترتيب الدمج (Draw).', ...prev.slice(0, 19)]);
  };

  const onMergeSortRun = () => {
    if (mergeSortState.doneFlag) {
      const reset = createInitialMergeSortState(mergeSortState.aSize, mergeSortState.initOrder);
      setMergeSortState({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء دورة ترتيب دمج جديدة (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setMergeSortState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !mergeSortState.isRunning ? 'بدء تشغيل ترتيب الدمج آلياً (Run)...' : 'إيقاف مؤقت للتشغيل الآلي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onMergeSortStep = () => {
    const { nextState } = stepMergeSort({ ...mergeSortState, isRunning: false });
    setMergeSortState(nextState);
    if (nextState.note !== mergeSortState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onMergeSortReset = () => {
    const next = createInitialMergeSortState(mergeSortState.aSize, mergeSortState.initOrder);
    setMergeSortState(next);
    setExecutionLog((prev) => ['تمت إعادة ضبط مصفوفة ترتيب الدمج.', ...prev.slice(0, 19)]);
  };

  const onMergeSortSpeedChange = (speedMs: number) => {
    setMergeSortState((prev) => ({ ...prev, speedMs }));
  };

  // QuickSort 2 Handlers
  const onQuickSort2New = () => {
    const next = handleQuickSort2New(quickSort2State);
    setQuickSort2State(next);
    setExecutionLog((prev) => [
      `تم توليد بيانات جديدة للترتيب السريع 2 بوضعية ${next.initOrder === 1 ? 'العشوائية (Random)' : 'المعكوسة (Inverse)'}.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort2Size = () => {
    const next = handleQuickSort2Size(quickSort2State);
    setQuickSort2State(next);
    setExecutionLog((prev) => [
      `تم تغيير حجم المصفوفة إلى ${next.aSize} عمود مع إعادة تهيئة وسيط الثلاثة.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort2Draw = () => {
    setQuickSort2State((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم أعمدة الترتيب السريع 2 (Draw).', ...prev.slice(0, 19)]);
  };

  const onQuickSort2Run = () => {
    if (quickSort2State.doneFlag) {
      const reset = createInitialQuickSort2State(quickSort2State.aSize, quickSort2State.initOrder);
      setQuickSort2State({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء دورة فرز سريع 2 جديدة (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setQuickSort2State((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !quickSort2State.isRunning ? 'بدء تشغيل الترتيب السريع 2 آلياً (Run)...' : 'إيقاف مؤقت للتشغيل الآلي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort2Step = () => {
    const { nextState } = stepQuickSort2({ ...quickSort2State, isRunning: false });
    setQuickSort2State(nextState);
    if (nextState.note !== quickSort2State.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onQuickSort2Reset = () => {
    const next = createInitialQuickSort2State(quickSort2State.aSize, quickSort2State.initOrder);
    setQuickSort2State(next);
    setExecutionLog((prev) => ['تمت إعادة ضبط مصفوفة الترتيب السريع 2.', ...prev.slice(0, 19)]);
  };

  const onQuickSort2SpeedChange = (speedMs: number) => {
    setQuickSort2State((prev) => ({ ...prev, speedMs }));
  };

  // QuickSort 1 Handlers
  const onQuickSort1New = () => {
    const next = handleQuickSort1New(quickSort1State);
    setQuickSort1State(next);
    setExecutionLog((prev) => [
      `تم توليد بيانات جديدة للترتيب السريع 1 بوضعية ${next.initOrder === 1 ? 'العشوائية (Random)' : 'المعكوسة (Inverse)'}.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort1Size = () => {
    const next = handleQuickSort1Size(quickSort1State);
    setQuickSort1State(next);
    setExecutionLog((prev) => [
      `تم تغيير حجم المصفوفة إلى ${next.aSize} عمود مع إعادة التهيئة.`,
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort1Draw = () => {
    setQuickSort1State((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم أعمدة الترتيب السريع 1 (Draw).', ...prev.slice(0, 19)]);
  };

  const onQuickSort1Run = () => {
    if (quickSort1State.doneFlag) {
      const reset = createInitialQuickSort1State(quickSort1State.aSize, quickSort1State.initOrder);
      setQuickSort1State({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء دورة فرز سريع جديدة (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setQuickSort1State((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !quickSort1State.isRunning ? 'بدء تشغيل الترتيب السريع 1 آلياً (Run)...' : 'إيقاف مؤقت للتشغيل الآلي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onQuickSort1Step = () => {
    const { nextState } = stepQuickSort1({ ...quickSort1State, isRunning: false });
    setQuickSort1State(nextState);
    if (nextState.note !== quickSort1State.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onQuickSort1Reset = () => {
    const next = createInitialQuickSort1State(quickSort1State.aSize, quickSort1State.initOrder);
    setQuickSort1State(next);
    setExecutionLog((prev) => ['تمت إعادة ضبط مصفوفة الترتيب السريع 1.', ...prev.slice(0, 19)]);
  };

  const onQuickSort1SpeedChange = (speedMs: number) => {
    setQuickSort1State((prev) => ({ ...prev, speedMs }));
  };

  // Towers of Hanoi Handlers
  const onTowersNew = (n: number) => {
    const clamped = Math.max(1, Math.min(10, n));
    const next = createInitialTowersState(clamped);
    setTowersState(next);
    setExecutionLog((prev) => [`تم إنشاء لعبة أبراج هانوي جديدة بعدد أقراص ${clamped}.`, ...prev.slice(0, 19)]);
  };

  const onTowersStep = () => {
    const { nextState } = stepTowers({ ...towersState, isRunning: false });
    setTowersState(nextState);
    if (nextState.note !== towersState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onTowersTogglePlay = () => {
    if (towersState.isDoneFlag) {
      const reset = createInitialTowersState(towersState.nDisks);
      setTowersState({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء حل مسألة أبراج هانوي تلقائياً (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setTowersState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !towersState.isRunning ? 'بدء تشغيل خوارزمية أبراج هانوي تلقائياً (Run)...' : 'إيقاف مؤقت للتشغيل التلقائي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onTowersReset = () => {
    const next = createInitialTowersState(towersState.nDisks);
    setTowersState(next);
    setExecutionLog((prev) => ['تمت إعادة تهيئة أبراج هانوي.', ...prev.slice(0, 19)]);
  };

  const onTowersSpeedChange = (speedMs: number) => {
    setTowersState((prev) => ({ ...prev, speedMs }));
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 440 / (rect.width || 440);
    const scaleY = 335 / (rect.height || 335);
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const onTowersMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    const next = startDrag(towersState, x, y);
    if (next !== towersState) {
      setTowersState(next);
      if (next.note !== towersState.note) {
        setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
      }
    }
  };

  const onTowersMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (towersState.isDragging && towersState.dragSourceTower >= 0) {
      const { x, y } = getCanvasCoords(e);
      const next = updateDrag(towersState, x, y);
      setTowersState(next);
    }
  };

  const onTowersMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (towersState.isDragging && towersState.dragSourceTower >= 0) {
      const { x, y } = getCanvasCoords(e);
      const next = endDrag(towersState, x, y);
      setTowersState(next);
      if (next.note !== towersState.note) {
        setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
      }
    }
  };

  // Operations handlers
  const onNew = (isNum: boolean, val: number) => {
    if (isOrdered) {
      const next = handleOrderedNew(orderedState, isNum, val);
      setOrderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    } else {
      const next = handleNewArray(unorderedState, isNum, val);
      setUnorderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onFill = (isNum: boolean, val: number) => {
    if (isOrdered) {
      const next = handleOrderedFill(orderedState, isNum, val);
      setOrderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    } else {
      const next = handleFill(unorderedState, isNum, val);
      setUnorderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onIns = (isNum: boolean, val: number) => {
    if (isOrdered) {
      const next = startOrderedInsert(orderedState, isNum, val);
      setOrderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    } else {
      const next = handleInsert(unorderedState, isNum, val);
      setUnorderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onFind = (isNum: boolean, val: number) => {
    if (isOrdered) {
      const next = startOrderedFind(orderedState, isNum, val);
      setOrderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    } else {
      const next = startFind(unorderedState, isNum, val);
      setUnorderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onDel = (isNum: boolean, val: number) => {
    if (isOrdered) {
      const next = startOrderedDelete(orderedState, isNum, val);
      setOrderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    } else {
      const next = startDelete(unorderedState, isNum, val);
      setUnorderedState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onSetDups = (dupsOK: boolean) => {
    if (unorderedState.isOKChangeDups) {
      setUnorderedState((prev) => ({
        ...prev,
        dupsOK,
        note: dupsOK ? 'Duplicates OK selected' : 'No dups selected',
      }));
      setExecutionLog((prev) => [
        dupsOK ? 'تم السماح بالتكرار (Dups OK)' : 'تم منع التكرار (No dups)',
        ...prev.slice(0, 19),
      ]);
    } else {
      setUnorderedState((prev) => ({
        ...prev,
        note: 'To change duplication status, create array with New',
      }));
      setExecutionLog((prev) => [
        'لتغيير خيار التكرار، قم بإنشاء مصفوفة جديدة بواسطة New',
        ...prev.slice(0, 19),
      ]);
    }
  };

  const onSetLinear = (linear: boolean) => {
    if (orderedState.isOKChange) {
      setOrderedState((prev) => ({
        ...prev,
        isLinear: linear,
        note: linear ? 'Uses linear search' : 'Uses binary search',
      }));
      setExecutionLog((prev) => [
        linear ? 'تم اختيار البحث الخطي (Linear Search)' : 'تم اختيار البحث الثنائي (Binary Search)',
        ...prev.slice(0, 19),
      ]);
    } else {
      setOrderedState((prev) => ({
        ...prev,
        note: 'To change search type, create array with New',
      }));
      setExecutionLog((prev) => [
        'لتغيير نوع البحث، قم بإنشاء مصفوفة جديدة بواسطة New',
        ...prev.slice(0, 19),
      ]);
    }
  };

  const onNextStep = () => {
    if (isOrdered) {
      if (orderedState.currentOp === 'find') {
        const { nextState } = stepOrderedFind(orderedState);
        setOrderedState(nextState);
        setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
      } else if (orderedState.currentOp === 'ins') {
        const { nextState } = stepOrderedInsert(orderedState);
        setOrderedState(nextState);
        setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
      } else if (orderedState.currentOp === 'del') {
        const { nextState } = stepOrderedDelete(orderedState);
        setOrderedState(nextState);
        setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
      }
    } else {
      if (unorderedState.currentOp === 'find') {
        const { nextState } = stepFind(unorderedState);
        setUnorderedState(nextState);
        setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
      } else if (unorderedState.currentOp === 'del') {
        const { nextState } = stepDelete(unorderedState);
        setUnorderedState(nextState);
        setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
      }
    }
  };

  const onTogglePlay = () => {
    if (isOrdered) {
      setOrderedState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    } else {
      setUnorderedState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  const onSpeedChange = (speedMs: number) => {
    if (isOrdered) {
      setOrderedState((prev) => ({ ...prev, speedMs }));
    } else {
      setUnorderedState((prev) => ({ ...prev, speedMs }));
    }
  };

  const onToggleStepByStep = (enabled: boolean) => {
    if (isOrdered) {
      setOrderedState((prev) => ({ ...prev, stepByStep: enabled, isRunning: !enabled }));
    } else {
      setUnorderedState((prev) => ({ ...prev, stepByStep: enabled, isRunning: !enabled }));
    }
  };

  const onReset = () => {
    if (isOrdered) {
      const init = createInitialOrderedState();
      const filled = handleOrderedFill(init, true, 20);
      setOrderedState(filled);
      setExecutionLog(['تمت إعادة تعيين المصفوفة المرتبة إلى 20 عنصراً.']);
    } else {
      const init = createInitialState();
      const filled = handleFill(init, true, 20);
      setUnorderedState(filled);
      setExecutionLog(['تمت إعادة تعيين المصفوفة غير المرتبة إلى 20 عنصراً.']);
    }
  };

  // Link List Handlers
  const onLinkNew = () => {
    const numVal = parseInt(inputValue, 10);
    if (linkListState.opMode === 'new') {
      const count = isNaN(numVal) ? 10 : numVal;
      if (count < 0 || count > 28) {
        setLinkListState((prev) => ({
          ...prev,
          note: 'ERROR: use size between 0 and 28',
          opMode: 'idle',
          codePart: 1,
        }));
        setExecutionLog((prev) => ['ERROR: use size between 0 and 28', ...prev.slice(0, 19)]);
        return;
      }
      const fresh = createInitialLinkListState(linkListState.notSorted, count);
      fresh.isOKChangeSort = true;
      fresh.note = 'Press any button; or select Unsorted/Sorted';
      setLinkListState(fresh);
      setExecutionLog((prev) => [
        `تم إنشاء قائمة مرتبطة جديدة بحجم ${count} عقدة (${fresh.notSorted ? 'غير مرتبة' : 'مرتبة'}).`,
        ...prev.slice(0, 19),
      ]);
    } else {
      const next = startNewList(linkListState, !isNaN(numVal), numVal);
      setLinkListState(next);
      setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
    }
  };

  const onLinkInsert = (val: number) => {
    const next = startLinkInsert(linkListState, val >= 0, val);
    setLinkListState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onLinkFind = (val: number) => {
    const next = startLinkFind(linkListState, val >= 0, val);
    setLinkListState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onLinkDelete = (val: number) => {
    const next = startLinkDelete(linkListState, val >= 0, val);
    setLinkListState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onLinkSortChange = (notSorted: boolean) => {
    const next = setLinkSortStatus(linkListState, notSorted);
    setLinkListState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onLinkStep = () => {
    const numVal = parseInt(inputValue, 10);
    const { nextState } = stepLinkList(linkListState, isNaN(numVal) ? undefined : numVal);
    setLinkListState(nextState);
    if (nextState.note !== linkListState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onLinkTogglePlay = () => {
    setLinkListState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const onLinkReset = () => {
    const fresh = createInitialLinkListState(true, 10);
    setLinkListState(fresh);
    setExecutionLog((prev) => ['تمت إعادة تعيين القائمة المترابطة إلى 10 عناصر.', ...prev.slice(0, 19)]);
  };

  const onLinkSpeedChange = (speedMs: number) => {
    setLinkListState((prev) => ({ ...prev, speedMs }));
  };

  // Priority Queue Handlers
  const onPQNew = () => {
    const next = startPQNewQueue(priorityQueueState);
    setPriorityQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onPQInsert = (val: number) => {
    const next = startPQInsert(priorityQueueState, val >= 0, val);
    setPriorityQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onPQRemove = () => {
    const next = startPQRemove(priorityQueueState);
    setPriorityQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onPQPeek = () => {
    const next = startPQPeek(priorityQueueState);
    setPriorityQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onPQStep = () => {
    const { nextState } = stepPriorityQueue(priorityQueueState);
    setPriorityQueueState(nextState);
    if (nextState.returnString) {
      setInputValue(nextState.returnString);
    }
    if (nextState.note !== priorityQueueState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onPQTogglePlay = () => {
    setPriorityQueueState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const onPQReset = () => {
    const init = createInitialPriorityQueueState();
    setPriorityQueueState(init);
    setExecutionLog((prev) => ['تمت إعادة تعيين طابور الأولويات (Priority Queue) إلى 5 عناصر مرتبة تصاعدياً.', ...prev.slice(0, 19)]);
  };

  const onPQSpeedChange = (speedMs: number) => {
    setPriorityQueueState((prev) => ({ ...prev, speedMs }));
  };

  // Queue Handlers
  const onQueueNew = () => {
    const next = startNewQueue(queueState);
    setQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onQueueInsert = (val: number) => {
    const next = startInsert(queueState, val >= 0, val);
    setQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onQueueRemove = () => {
    const next = startRemove(queueState);
    setQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onQueuePeek = () => {
    const next = startQueuePeek(queueState);
    setQueueState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onQueueStep = () => {
    const { nextState } = stepQueue(queueState);
    setQueueState(nextState);
    if (nextState.returnString) {
      setInputValue(nextState.returnString);
    }
    if (nextState.note !== queueState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onQueueTogglePlay = () => {
    setQueueState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const onQueueReset = () => {
    const init = createInitialQueueState();
    setQueueState(init);
    setExecutionLog((prev) => ['تمت إعادة تعيين طابور الانتظار (Queue) إلى 4 عناصر افتراضية.', ...prev.slice(0, 19)]);
  };

  const onQueueSpeedChange = (speedMs: number) => {
    setQueueState((prev) => ({ ...prev, speedMs }));
  };

  // Stack Handlers
  const onStackNew = () => {
    const next = startNewStack(stackState);
    setStackState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onStackPush = (val: number) => {
    const next = startPush(stackState, val >= 0, val);
    setStackState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onStackPop = () => {
    const next = startPop(stackState);
    setStackState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onStackPeek = () => {
    const next = startPeek(stackState);
    setStackState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onStackStep = () => {
    const { nextState } = stepStack(stackState);
    setStackState(nextState);
    if (nextState.returnString) {
      setInputValue(nextState.returnString);
    }
    if (nextState.note !== stackState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onStackTogglePlay = () => {
    setStackState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const onStackReset = () => {
    const init = createInitialStackState();
    setStackState(init);
    setExecutionLog((prev) => ['تمت إعادة تعيين المكدس (Stack) إلى 4 عناصر افتراضية.', ...prev.slice(0, 19)]);
  };

  const onStackSpeedChange = (speedMs: number) => {
    setStackState((prev) => ({ ...prev, speedMs }));
  };

  // Selection Sort Handlers
  const onSelectionNew = () => {
    const next = handleSelectionSortNew(selectionSortState);
    setSelectionSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onSelectionSize = () => {
    const next = handleSelectionSortSize(selectionSortState);
    setSelectionSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onSelectionDraw = () => {
    setSelectionSortState((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم أعمدة الاختيار والشاشة (Draw).', ...prev.slice(0, 19)]);
  };

  const onSelectionRun = () => {
    if (selectionSortState.doneFlag) {
      const reset = createInitialSelectionSortState(selectionSortState.aSize, selectionSortState.initOrder);
      setSelectionSortState({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء جولة جديدة لترتيب الاختيار (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setSelectionSortState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !selectionSortState.isRunning ? 'بدء تشغيل ترتيب الاختيار تلقائياً (Run)...' : 'إيقاف مؤقت للتشغيل التلقائي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onSelectionStep = () => {
    const { nextState } = stepSelectionSort({ ...selectionSortState, isRunning: false });
    setSelectionSortState(nextState);
    if (nextState.note !== selectionSortState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onSelectionReset = () => {
    const next = createInitialSelectionSortState(selectionSortState.aSize, selectionSortState.initOrder);
    setSelectionSortState(next);
    setExecutionLog((prev) => ['تمت إعادة تهيئة مصفوفة ترتيب الاختيار (Selection Sort).', ...prev.slice(0, 19)]);
  };

  const onSelectionSpeedChange = (speedMs: number) => {
    setSelectionSortState((prev) => ({ ...prev, speedMs }));
  };

  // Insertion Sort Handlers
  const onInsertionNew = () => {
    const next = handleInsertionSortNew(insertionSortState);
    setInsertionSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onInsertionSize = () => {
    const next = handleInsertionSortSize(insertionSortState);
    setInsertionSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onInsertionDraw = () => {
    setInsertionSortState((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم أعمدة ترتيب الإدراج (Draw).', ...prev.slice(0, 19)]);
  };

  const onInsertionRun = () => {
    if (insertionSortState.doneFlag) {
      const reset = createInitialInsertionSortState(insertionSortState.aSize, insertionSortState.initOrder);
      setInsertionSortState({ ...reset, isRunning: true });
      setExecutionLog((prev) => ['بدء جولة جديدة لترتيب الإدراج (Run)...', ...prev.slice(0, 19)]);
      return;
    }
    setInsertionSortState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !insertionSortState.isRunning ? 'بدء تشغيل ترتيب الإدراج تلقائياً (Run)...' : 'إيقاف مؤقت للتشغيل التلقائي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onInsertionStep = () => {
    const { nextState } = stepInsertionSort({ ...insertionSortState, isRunning: false });
    setInsertionSortState(nextState);
    if (nextState.note !== insertionSortState.note) {
      setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
    }
  };

  const onInsertionReset = () => {
    const next = createInitialInsertionSortState(insertionSortState.aSize, insertionSortState.initOrder);
    setInsertionSortState(next);
    setExecutionLog((prev) => ['تمت إعادة تهيئة مصفوفة ترتيب الإدراج (Insertion Sort).', ...prev.slice(0, 19)]);
  };

  const onInsertionSpeedChange = (speedMs: number) => {
    setInsertionSortState((prev) => ({ ...prev, speedMs }));
  };

  // Bubble Sort Handlers
  const onBubbleNew = () => {
    const next = handleBubbleSortNew(bubbleSortState);
    setBubbleSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onBubbleSize = () => {
    const next = handleBubbleSortSize(bubbleSortState);
    setBubbleSortState(next);
    setExecutionLog((prev) => [next.note, ...prev.slice(0, 19)]);
  };

  const onBubbleDraw = () => {
    setBubbleSortState((prev) => ({ ...prev, isRunning: false }));
    setExecutionLog((prev) => ['تمت إعادة رسم الأعمدة والشاشة (Draw).', ...prev.slice(0, 19)]);
  };

  const onBubbleRun = () => {
    if (bubbleSortState.doneFlag) return;
    setBubbleSortState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setExecutionLog((prev) => [
      !bubbleSortState.isRunning ? 'بدء تشغيل الترتيب الفقاعي تلقائياً (Run)...' : 'إيقاف مؤقت للتشغيل التلقائي.',
      ...prev.slice(0, 19),
    ]);
  };

  const onBubbleStep = () => {
    const { nextState } = stepBubbleSort({ ...bubbleSortState, isRunning: false });
    setBubbleSortState(nextState);
    setExecutionLog((prev) => [nextState.note, ...prev.slice(0, 19)]);
  };

  const onBubbleReset = () => {
    const next = createInitialBubbleSortState(bubbleSortState.aSize, bubbleSortState.initOrder);
    setBubbleSortState(next);
    setExecutionLog((prev) => ['تمت إعادة تعيين مصفوفة الترتيب الفقاعي.', ...prev.slice(0, 19)]);
  };

  const onBubbleSpeedChange = (speedMs: number) => {
    setBubbleSortState((prev) => ({ ...prev, speedMs }));
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadFullProjectZip(selectedApplet.id);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadMasterZip = async () => {
    try {
      setIsMasterZipping(true);
      await downloadAllProjectsMasterZip();
    } finally {
      setIsMasterZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans" dir="rtl">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition border border-slate-700"
              title="فتح / إغلاق مكتبة البريمجات"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  منصة عارض بريمجات روبرت لافور بلغة #C
                </h1>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                  {selectedApplet.titleAr}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Data Structures & Algorithms in Java (Robert Lafore) — C# Windows Forms Viewer Studio
              </p>
            </div>
          </div>

          {/* Quick Actions: Applet Selector + Download ZIP */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-300 font-medium">البريمج:</span>
              <select
                aria-label="اختر البريمج المطلوب"
                value={selectedApplet.id}
                onChange={(e) => {
                  const target = APPLET_CATALOG.flatMap((ch) => ch.applets).find(
                    (a) => a.id === e.target.value
                  );
                  if (target) {
                    setSelectedApplet(target);
                    if (target.status === 'active') {
                      setActiveTab('viewer');
                    }
                  }
                }}
                className="bg-slate-900 text-xs text-white border border-slate-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans cursor-pointer"
              >
                {APPLET_CATALOG.map((ch) => (
                  <optgroup key={ch.chapterNum} label={ch.nameAr} className="bg-slate-900 text-white">
                    {ch.applets.map((applet) => (
                      <option key={applet.id} value={applet.id}>
                        {applet.status === 'active' ? '🟢 ' : '⏳ '}
                        {applet.titleAr}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Download Current Applet ZIP */}
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold rounded-lg shadow transition active:scale-95 disabled:opacity-50"
              title="تحميل كود C# الخاص بالفصل المختار حالياً"
            >
              <FolderArchive className="w-4 h-4 text-blue-400" />
              {isZipping ? 'جارٍ التحميل...' : `تحميل الفصل الحالي`}
            </button>

            {/* Download Master Solution ZIP (All 19 Projects) */}
            <button
              type="button"
              onClick={handleDownloadMasterZip}
              disabled={isMasterZipping}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition active:scale-95 disabled:opacity-50"
              title="تحميل كافة مشاريع الكتاب (19 مشروعاً كاملاً مع ملف Solution واحد)"
            >
              <Download className="w-4 h-4 text-amber-200" />
              {isMasterZipping ? 'جارٍ تجميع كافة الفصول...' : 'تحميل جميع الفصول (Master ZIP)'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 border-t border-slate-800 pt-1 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('viewer')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'viewer'
                ? 'border-blue-500 text-blue-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-4 h-4" />
            المحاكي التفاعلي (Interactive Viewer)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            مشروع وكود C# الكامل (.NET 8)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            شرح هيكل البيانات والخوارزمية
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artifacts')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition ${
              activeTab === 'artifacts'
                ? 'border-blue-500 text-blue-400 font-bold bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            ملفات جافا الأصلية المرفقة
          </button>
        </div>
      </header>

      {/* Main Workspace Layout (Sidebar + Content Area) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden">
        {/* Collapsible Applet Library Sidebar */}
        <AppletLibrarySidebar
          currentAppletId={selectedApplet.id}
          onSelectApplet={(applet) => {
            setSelectedApplet(applet);
            if (applet.status === 'active') {
              setActiveTab('viewer');
            }
          }}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* If the user clicked on a pending applet, show the clean pending card */}
          {selectedApplet.status === 'pending' ? (
            <PendingAppletView
              applet={selectedApplet}
              onReturnToActive={() => setSelectedApplet(APPLET_CATALOG[0].applets[1])}
            />
          ) : (
            <>
              {/* Tab 1: Interactive Viewer for Active Applet */}
              {activeTab === 'viewer' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left/Main Column: Canvas + Controls */}
                  <div className="lg:col-span-8 space-y-4">
                    {isGraph ? (
                      <>
                        <GraphControls
                          onNew={onGraphNNew}
                          onDFS={onGraphNDFS}
                          onBFS={onGraphNBFS}
                          onTree={onGraphNTree}
                          onView={onGraphNView}
                          onSample={onGraphNSample}
                          onStep={onGraphNStep}
                          onToggleRun={onGraphNToggleRun}
                          onReset={onGraphNReset}
                          onSpeedChange={onGraphNSpeedChange}
                          isRunning={graphState.isRunning}
                          showAdjm={graphState.showAdjm}
                          opMode={graphState.opMode}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                          nVerts={graphState.nVerts}
                        />

                        {/* Visual Canvas (Graph or Yellow Adjacency Matrix) */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm overflow-x-auto">
                          <GraphCanvas
                            state={graphState}
                            classicTheme={classicTheme}
                            onMouseDown={onGraphNCanvasMouseDown}
                            onMouseMove={onGraphNCanvasMouseMove}
                            onMouseUp={onGraphNCanvasMouseUp}
                            onDoubleClick={onGraphNCanvasDoubleClick}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الرؤوس (Vertices):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {graphState.nVerts} / {graphState.MAX_VERTS}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الزيارات (Visits):</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {graphState.visitArray.length}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-purple-700">المكدس (Stack):</span>
                            <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                              {graphState.theStack.length}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-sky-700">الطابور (Queue):</span>
                            <span className="font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                              {graphState.theQueue.length}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">طريقة العرض:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {graphState.showAdjm ? 'مصفوفة المجاورة (Matrix)' : 'المخطط التفاعلي (Graph)'}
                            </span>
                            {graphState.opMode !== 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-rose-700">الخطوة الحالية:</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  جزء {graphState.codePart}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 انقر نقراً مزدوجاً لإنشاء رأس (Vertex A-M)، واسحب بالفأرة بين رأسين لإنشاء حافة غير موجّهة!
                          </div>
                        </div>
                      </>
                    ) : isGraphW ? (
                      <>
                        <GraphWControls
                          onNew={onGraphWNew}
                          onTree={onGraphWTree}
                          onView={onGraphWView}
                          onSample={onGraphWSample}
                          onStep={onGraphWStep}
                          onToggleRun={onGraphWToggleRun}
                          onReset={onGraphWReset}
                          onSpeedChange={onGraphWSpeedChange}
                          isRunning={graphWState.isRunning}
                          showAdjm={graphWState.showAdjm}
                          opMode={graphWState.opMode}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                          nVerts={graphWState.nVerts}
                        />

                        {/* Visual Canvas (Graph or Yellow Adjacency Matrix) */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm overflow-x-auto">
                          <GraphWCanvas
                            state={graphWState}
                            classicTheme={classicTheme}
                            onMouseDown={onGraphWCanvasMouseDown}
                            onMouseMove={onGraphWCanvasMouseMove}
                            onMouseUp={onGraphWCanvasMouseUp}
                            onDoubleClick={onGraphWCanvasDoubleClick}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الرؤوس (Vertices):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {graphWState.nVerts} / {graphWState.MAX_VERTS}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">رؤوس الشجرة (Tree):</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {graphWState.nTree} في الشجرة
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-purple-700">طابور الأولوية (PQ):</span>
                            <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                              {graphWState.thePQ.length} حافة
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">طريقة العرض:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {graphWState.showAdjm ? 'مصفوفة المجاورة (Matrix)' : 'المخطط التفاعلي (Graph)'}
                            </span>
                            {graphWState.opMode === 1 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-emerald-700">الخطوة الحالية:</span>
                                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                  جزء {graphWState.codePart}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 انقر نقراً مزدوجاً لإنشاء رأس (Vertex)، واكتب وزناً ثم اسحب بالفأرة لإنشاء حافة غير موجّهة!
                          </div>
                        </div>
                      </>
                    ) : isGraphDW ? (
                      <>
                        <GraphDWControls
                          onNew={onGraphNew}
                          onPath={onGraphPath}
                          onView={onGraphView}
                          onSample={onGraphSample}
                          onStep={onGraphStep}
                          onToggleRun={onGraphToggleRun}
                          onReset={onGraphReset}
                          onSpeedChange={onGraphSpeedChange}
                          isRunning={graphDWState.isRunning}
                          showAdjm={graphDWState.showAdjm}
                          opMode={graphDWState.opMode}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                          nVerts={graphDWState.nVerts}
                        />

                        {/* Visual Canvas (Graph or Yellow Adjacency Matrix) */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm overflow-x-auto">
                          <GraphDWCanvas
                            state={graphDWState}
                            classicTheme={classicTheme}
                            onMouseDown={onGraphCanvasMouseDown}
                            onMouseMove={onGraphCanvasMouseMove}
                            onMouseUp={onGraphCanvasMouseUp}
                            onDoubleClick={onGraphCanvasDoubleClick}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الرؤوس (Vertices):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {graphDWState.nVerts} / {graphDWState.MAX_VERTS}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">رؤوس الشجرة (Tree):</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {graphDWState.nTree} في الشجرة
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">طريقة العرض:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {graphDWState.showAdjm ? 'مصفوفة المجاورة (Matrix)' : 'المخطط التفاعلي (Graph)'}
                            </span>
                            {graphDWState.opMode === 1 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-purple-700">الخطوة الحالية:</span>
                                <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                                  جزء {graphDWState.codePart}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 انقر نقراً مزدوجاً لإنشاء رأس (Vertex)، واكتب وزناً ثم اسحب بالفأرة لإنشاء حافة موجّهة!
                          </div>
                        </div>
                      </>
                    ) : isHashChain ? (
                      <>
                        <HashChainControls
                          onNew={onChainNew}
                          onFill={onChainFill}
                          onIns={onChainInsert}
                          onDel={onChainDelete}
                          onFind={onChainFind}
                          onStep={onChainStep}
                          onToggleRun={onChainToggleRun}
                          onReset={onChainReset}
                          onSpeedChange={onChainSpeedChange}
                          isRunning={hashChainState.isRunning}
                          opMode={hashChainState.opMode}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          totalBuckets={hashChainState.totalBuckets}
                          nPersons={hashChainState.nPersons}
                          topDisplayLine={hashChainState.topDisplayLine}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas with Scrollbar */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <HashChainCanvas
                            state={hashChainState}
                            classicTheme={classicTheme}
                            onSelectKey={onChainSelectKey}
                            onScrollChange={onChainScrollChange}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">القوائم (Buckets):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {hashChainState.totalBuckets} قائمة
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العناصر:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {hashChainState.nPersons} عنصر
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">معامل التحميل:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              λ = {(hashChainState.totalBuckets > 0 ? hashChainState.nPersons / hashChainState.totalBuckets : 0).toFixed(2)}
                            </span>
                            {hashChainState.opMode !== 'idle' && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-rose-700">المؤشرات:</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  List {hashChainState.curList}, Link {hashChainState.curLink}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {hashChainState.opMode}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الخطوة:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              جزء {hashChainState.codePart}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 جدول الهاش بالسلاسل المنفصلة (Separate Chaining): انقر على أي عقدة لنسخ قيمتها، أو استخدم شريط التمرير الرأسي للتنقل!
                          </div>
                        </div>
                      </>
                    ) : isHash ? (
                      <>
                        <HashControls
                          onNew={onHashNew}
                          onFill={onHashFill}
                          onIns={onHashInsert}
                          onDel={onHashDelete}
                          onFind={onHashFind}
                          onStep={onHashStep}
                          onToggleRun={onHashToggleRun}
                          onReset={onHashReset}
                          onSpeedChange={onHashSpeedChange}
                          isRunning={hashState.isRunning}
                          opMode={hashState.opMode}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          totalCells={hashState.totalCells}
                          nPersons={hashState.nPersons}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <HashCanvas
                            state={hashState}
                            classicTheme={classicTheme}
                            onSelectKey={onHashSelectKey}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الخلايا المشغولة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {hashState.nPersons} / {hashState.totalCells}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">معامل التحميل (Load):</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {hashState.totalCells > 0 ? ((hashState.nPersons / hashState.totalCells) * 100).toFixed(1) : 0}%
                            </span>
                            {hashState.curIn >= 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-rose-700">مؤشر المسح curIn:</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  خلية {hashState.curIn} {hashState.personArray[hashState.curIn] ? (hashState.personArray[hashState.curIn]!.height === -1 ? '(*Del*)' : `(مفتاح ${hashState.personArray[hashState.curIn]!.height})`) : '(فارغة)'}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {hashState.opMode}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الخطوة:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              جزء {hashState.codePart}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 جدول الهاش (Linear Probing): انقر على أي خلية لنسخ مفتاحها لصندوق الإدخال مباشرة!
                          </div>
                        </div>
                      </>
                    ) : isTree ? (
                      <>
                        <TreeControls
                          onFill={onTreeFill}
                          onFind={onTreeFind}
                          onIns={onTreeInsert}
                          onTrav={onTreeTraverse}
                          onDel={onTreeDelete}
                          onStep={onTreeStep}
                          onToggleRun={onTreeToggleRun}
                          onReset={onTreeReset}
                          onSpeedChange={onTreeSpeedChange}
                          isRunning={treeState.isRunning}
                          opMode={treeState.opMode}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          filledNodes={treeState.filledNodes}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <TreeCanvas
                            state={treeState}
                            classicTheme={classicTheme}
                            onSelectNode={onTreeSelectNode}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">عدد العقد:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {treeState.filledNodes} / 31
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-emerald-700">الجذر (Root):</span>
                            <span className="font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {treeState.treeArray[0] ? treeState.treeArray[0]!.height : 'null (فارغ)'}
                            </span>
                            {treeState.curIn >= 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-rose-700">مؤشر السهم curIn:</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  عقدة {treeState.curIn} {treeState.treeArray[treeState.curIn] ? `(مفتاح ${treeState.treeArray[treeState.curIn]!.height})` : ''}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {treeState.opMode}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الخطوة:</span>
                            <span className="font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                              جزء {treeState.codePart}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 شجرة البحث الثنائية (BST): يمكنك النقر على أي عقدة لنسخ مفتاحها لصندوق الإدخال مباشرة!
                          </div>
                        </div>
                      </>
                    ) : isMergeSort ? (
                      <>
                        <MergeSortControls
                          onNew={onMergeSortNew}
                          onSize={onMergeSortSize}
                          onDraw={onMergeSortDraw}
                          onRun={onMergeSortRun}
                          onStep={onMergeSortStep}
                          onReset={onMergeSortReset}
                          onSpeedChange={onMergeSortSpeedChange}
                          isRunning={mergeSortState.isRunning}
                          aSize={mergeSortState.aSize}
                          initOrder={mergeSortState.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <MergeSortCanvas
                            state={mergeSortState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {mergeSortState.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {mergeSortState.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">عمليات النسخ (Copies):</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {mergeSortState.copies}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المؤشرات:</span>
                            <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-200">
                              low={mergeSortState.lower}, up={mergeSortState.upper}, mid={mergeSortState.mid}{mergeSortState.ptrIndex >= 0 ? `, ptr=${mergeSortState.ptrIndex}` : ''}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                mergeSortState.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : mergeSortState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {mergeSortState.doneFlag
                                ? 'اكتمل الترتيب (Complete)'
                                : mergeSortState.isRunning
                                ? 'جارٍ التشغيل التلقائي...'
                                : 'متوقف / خطوة بخطوة'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 ترتيب الدمج (Divide & Conquer): يقسم النطاقات عودياً ثم يدمجها في workSpace بزمن مضمون O(N log N)!
                          </div>
                        </div>
                      </>
                    ) : isQuickSort2 ? (
                      <>
                        <QuickSort2Controls
                          onNew={onQuickSort2New}
                          onSize={onQuickSort2Size}
                          onDraw={onQuickSort2Draw}
                          onRun={onQuickSort2Run}
                          onStep={onQuickSort2Step}
                          onReset={onQuickSort2Reset}
                          onSpeedChange={onQuickSort2SpeedChange}
                          isRunning={quickSort2State.isRunning}
                          aSize={quickSort2State.aSize}
                          initOrder={quickSort2State.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <QuickSort2Canvas
                            state={quickSort2State}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {quickSort2State.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {quickSort2State.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">التبديلات:</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {quickSort2State.swaps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المؤشرات:</span>
                            <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-200">
                              L={quickSort2State.left}, R={quickSort2State.right}, C={quickSort2State.center}, P={quickSort2State.pivot}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                quickSort2State.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : quickSort2State.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {quickSort2State.doneFlag
                                ? 'اكتمل الترتيب (Complete)'
                                : quickSort2State.isRunning
                                ? 'جارٍ التشغيل التلقائي...'
                                : 'متوقف / خطوة بخطوة'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 الترتيب السريع 2 (Median-of-Three): يفرز العناصر الثلاثة (Left, Center, Right) ويجعل الوسيط عند right-1 كمحور لتفادي أسوأ أداء O(N²)!
                          </div>
                        </div>
                      </>
                    ) : isQuickSort1 ? (
                      <>
                        <QuickSort1Controls
                          onNew={onQuickSort1New}
                          onSize={onQuickSort1Size}
                          onDraw={onQuickSort1Draw}
                          onRun={onQuickSort1Run}
                          onStep={onQuickSort1Step}
                          onReset={onQuickSort1Reset}
                          onSpeedChange={onQuickSort1SpeedChange}
                          isRunning={quickSort1State.isRunning}
                          aSize={quickSort1State.aSize}
                          initOrder={quickSort1State.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <QuickSort1Canvas
                            state={quickSort1State}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status & Quick Stats */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {quickSort1State.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {quickSort1State.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">التبديلات:</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {quickSort1State.swaps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المؤشرات:</span>
                            <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-200">
                              L={quickSort1State.left}, R={quickSort1State.right}, LScan={quickSort1State.leftScan}, RScan={quickSort1State.rightScan}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                quickSort1State.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : quickSort1State.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {quickSort1State.doneFlag
                                ? 'اكتمل الترتيب (Complete)'
                                : quickSort1State.isRunning
                                ? 'جارٍ التشغيل التلقائي...'
                                : 'متوقف / خطوة بخطوة'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 الترتيب السريع 1 (QuickSort 1): يختار العنصر الأقصى يميناً كمحور (Pivot)، ثم يبدأ المسح المزدوج من اليسار واليمين!
                          </div>
                        </div>
                      </>
                    ) : isTowers ? (
                      <>
                        <TowersControls
                          onNew={onTowersNew}
                          onStep={onTowersStep}
                          onTogglePlay={onTowersTogglePlay}
                          onReset={onTowersReset}
                          onSpeedChange={onTowersSpeedChange}
                          isRunning={towersState.isRunning}
                          stepByStep={!towersState.isRunning}
                          onToggleStepByStep={() => {}}
                          nDisks={towersState.nDisks}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <TowersCanvas
                            state={towersState}
                            classicTheme={classicTheme}
                            onMouseDown={onTowersMouseDown}
                            onMouseMove={onTowersMouseMove}
                            onMouseUp={onTowersMouseUp}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأقراص:</span>
                            <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                              {towersState.nDisks}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-indigo-700">الحركات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {towersState.movesCount} / {Math.pow(2, towersState.nDisks) - 1}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-emerald-700">عمق المكدس:</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {towersState.theStack.length}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                towersState.isDoneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : towersState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {towersState.isDoneFlag
                                ? 'اكتمل الحل (Solved)'
                                : towersState.isRunning
                                ? 'جارٍ التشغيل العودي...'
                                : 'جاهز للعب أو الخطوة'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 يمكنك سحب أي قرص علوي بالماوس وإفلاته على عمود آخر، أو الضغط على Step لمشاهدة محاكاة مكدس الاستدعاءات العودي خطوة بخطوة!
                          </div>
                        </div>
                      </>
                    ) : isLinkList ? (
                      <>
                        <LinkListControls
                          onNew={onLinkNew}
                          onInsert={onLinkInsert}
                          onFind={onLinkFind}
                          onDelete={onLinkDelete}
                          onSetSortStatus={onLinkSortChange}
                          onStep={onLinkStep}
                          onTogglePlay={onLinkTogglePlay}
                          onReset={onLinkReset}
                          onSpeedChange={onLinkSpeedChange}
                          isRunning={linkListState.isRunning}
                          stepByStep={!linkListState.isRunning}
                          onToggleStepByStep={() => {}}
                          notSorted={linkListState.notSorted}
                          totalLinks={linkListState.totalLinks}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <LinkListCanvas
                            state={linkListState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">عدد العقد:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {linkListState.totalLinks} / 28
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-sky-700">الترتيب:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                linkListState.notSorted
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {linkListState.notSorted ? 'غير مرتبة (Unsorted)' : 'مرتبة تصاعدياً (Sorted)'}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-indigo-700">الرأس (First):</span>
                            <span className="font-mono bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {linkListState.linkArray[0]
                                ? linkListState.linkArray[0]!.persData.height
                                : 'null (فارغ)'}
                            </span>
                            {linkListState.curIn >= 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-rose-700">المؤشر curIn:</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  عقدة {linkListState.curIn}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {linkListState.opMode}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                linkListState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : linkListState.totalLinks === 28
                                  ? 'bg-rose-100 text-rose-800'
                                  : linkListState.totalLinks === 0
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {linkListState.isRunning
                                ? 'جارٍ التنفيذ...'
                                : linkListState.totalLinks === 28
                                ? 'ممتلئة (Full)'
                                : linkListState.totalLinks === 0
                                ? 'فارغة (Empty)'
                                : 'جاهزة (Ready)'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 القائمة المترابطة (Link List): الإدراج في الرأس فوري O(1) في الوضع غير المرتب، وتتبع الروابط Splice و Bypass يوضح إعادة توجيه المؤشرات!
                          </div>
                        </div>
                      </>
                    ) : isPriorityQueue ? (
                      <>
                        <PriorityQueueControls
                          onNew={onPQNew}
                          onInsert={onPQInsert}
                          onRemove={onPQRemove}
                          onPeek={onPQPeek}
                          onStep={onPQStep}
                          onTogglePlay={onPQTogglePlay}
                          onReset={onPQReset}
                          onSpeedChange={onPQSpeedChange}
                          isRunning={priorityQueueState.isRunning}
                          stepByStep={!priorityQueueState.isRunning}
                          onToggleStepByStep={() => {}}
                          nPersons={priorityQueueState.nPersons}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <PriorityQueueCanvas
                            state={priorityQueueState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">السعة والعناصر:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {priorityQueueState.nPersons} / 10
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-rose-700">Front (الأعلى أولوية):</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {priorityQueueState.front >= 0 ? priorityQueueState.front : 'فارغ'}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-blue-700">Rear (الأدنى أولوية):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {priorityQueueState.rear}
                            </span>
                            {priorityQueueState.curIn >= 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-slate-700">curIn (مؤشر الإزاحة):</span>
                                <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                                  {priorityQueueState.curIn}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {priorityQueueState.opMode}
                            </span>
                            {priorityQueueState.returnString && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-emerald-700">القيمة المرجعة:</span>
                                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                  {priorityQueueState.returnString}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                priorityQueueState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : priorityQueueState.nPersons === 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : priorityQueueState.nPersons === 0
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {priorityQueueState.isRunning
                                ? 'جارٍ التنفيذ...'
                                : priorityQueueState.nPersons === 10
                                ? 'ممتلئ (Full)'
                                : priorityQueueState.nPersons === 0
                                ? 'فارغ (Empty)'
                                : 'جاهز (Ready)'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 طابور الأولويات (Priority Queue): الإدراج (Ins) يزيح العناصر الأكبر O(N)، والحذف (Rem) يسحب العنصر الأكبر فوراً O(1)!
                          </div>
                        </div>
                      </>
                    ) : isQueue ? (
                      <>
                        <QueueControls
                          onNew={onQueueNew}
                          onInsert={onQueueInsert}
                          onRemove={onQueueRemove}
                          onPeek={onQueuePeek}
                          onStep={onQueueStep}
                          onTogglePlay={onQueueTogglePlay}
                          onReset={onQueueReset}
                          onSpeedChange={onQueueSpeedChange}
                          isRunning={queueState.isRunning}
                          stepByStep={!queueState.isRunning}
                          onToggleStepByStep={() => {}}
                          nPersons={queueState.nPersons}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <QueueCanvas
                            state={queueState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">السعة والعناصر:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {queueState.nPersons} / 10
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-rose-700">Front (المقدمة):</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {queueState.front}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-blue-700">Rear (المؤخرة):</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {queueState.rear}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {queueState.opMode}
                            </span>
                            {queueState.returnString && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-emerald-700">القيمة المرجعة:</span>
                                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                  {queueState.returnString}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                queueState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : queueState.nPersons === 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : queueState.nPersons === 0
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {queueState.isRunning
                                ? 'جارٍ التنفيذ...'
                                : queueState.nPersons === 10
                                ? 'ممتلئ (Full)'
                                : queueState.nPersons === 0
                                ? 'فارغ (Empty)'
                                : 'جاهز (Ready)'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 الطابور الدائري (FIFO): الإدراج (Ins) عند Rear والحذف (Rem) من Front؛ التفاف دائري تلقائي عند الفهرس 9!
                          </div>
                        </div>
                      </>
                    ) : isStack ? (
                      <>
                        <StackControls
                          onNew={onStackNew}
                          onPush={onStackPush}
                          onPop={onStackPop}
                          onPeek={onStackPeek}
                          onStep={onStackStep}
                          onTogglePlay={onStackTogglePlay}
                          onReset={onStackReset}
                          onSpeedChange={onStackSpeedChange}
                          isRunning={stackState.isRunning}
                          stepByStep={!stackState.isRunning}
                          onToggleStepByStep={() => {}}
                          nPersons={stackState.nPersons}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <StackCanvas
                            state={stackState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">السعة والعناصر:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {stackState.nPersons} / 10
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">مؤشر القمة (Top):</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {stackState.curIn}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                              {stackState.opMode}
                            </span>
                            {stackState.returnString && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-emerald-700">القيمة المرجعة:</span>
                                <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                  {stackState.returnString}
                                </span>
                              </>
                            )}
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                stackState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : stackState.nPersons === 10
                                  ? 'bg-rose-100 text-rose-800'
                                  : stackState.nPersons === 0
                                  ? 'bg-slate-100 text-slate-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {stackState.isRunning
                                ? 'جارٍ التنفيذ...'
                                : stackState.nPersons === 10
                                ? 'ممتلئ (Full)'
                                : stackState.nPersons === 0
                                ? 'فارغ (Empty)'
                                : 'جاهز (Ready)'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 المكدس (LIFO): الإدراج (Push) والحذف (Pop) والمعاينة (Peek) تتم جميعها في زمن قياسي ثابت O(1)!
                          </div>
                        </div>
                      </>
                    ) : isSelect ? (
                      <>
                        <SelectionSortControls
                          onNew={onSelectionNew}
                          onSize={onSelectionSize}
                          onDraw={onSelectionDraw}
                          onRun={onSelectionRun}
                          onStep={onSelectionStep}
                          onTogglePlay={onSelectionRun}
                          onReset={onSelectionReset}
                          onSpeedChange={onSelectionSpeedChange}
                          isRunning={selectionSortState.isRunning}
                          aSize={selectionSortState.aSize}
                          initOrder={selectionSortState.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <SelectionSortCanvas
                            state={selectionSortState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {selectionSortState.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {selectionSortState.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">التبديلات:</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {selectionSortState.swaps} (O(N) فقط)
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المؤشرات:</span>
                            <span className="font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-bold border border-purple-200">
                              outer={selectionSortState.outer}, min={selectionSortState.min}, inner={selectionSortState.inner}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                selectionSortState.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : selectionSortState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {selectionSortState.doneFlag
                                ? 'مكتمل (Complete)'
                                : selectionSortState.isRunning
                                ? 'جارٍ التشغيل...'
                                : 'متوقف'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 لاحظ أن التبديل يتم مرة واحدة فقط في نهاية فحص الدورة عبر مؤشر min ومؤشر outer!
                          </div>
                        </div>
                      </>
                    ) : isInsert ? (
                      <>
                        <InsertionSortControls
                          onNew={onInsertionNew}
                          onSize={onInsertionSize}
                          onDraw={onInsertionDraw}
                          onRun={onInsertionRun}
                          onStep={onInsertionStep}
                          onTogglePlay={onInsertionRun}
                          onReset={onInsertionReset}
                          onSpeedChange={onInsertionSpeedChange}
                          isRunning={insertionSortState.isRunning}
                          aSize={insertionSortState.aSize}
                          initOrder={insertionSortState.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <InsertionSortCanvas
                            state={insertionSortState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {insertionSortState.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {insertionSortState.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">النسخ:</span>
                            <span className="font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                              {insertionSortState.copies} (Copies)
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                insertionSortState.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : insertionSortState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {insertionSortState.doneFlag
                                ? 'مكتمل (Complete)'
                                : insertionSortState.isRunning
                                ? 'جارٍ التشغيل...'
                                : 'متوقف'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 يقوم بنسخ outer إلى المتغير المؤقت temp ثم إزاحة العناصر الأكبر وإدراج temp في موقعه!
                          </div>
                        </div>
                      </>
                    ) : isBubble ? (
                      <>
                        <BubbleSortControls
                          onNew={onBubbleNew}
                          onSize={onBubbleSize}
                          onDraw={onBubbleDraw}
                          onRun={onBubbleRun}
                          onStep={onBubbleStep}
                          onTogglePlay={onBubbleRun}
                          onReset={onBubbleReset}
                          onSpeedChange={onBubbleSpeedChange}
                          onToggleStepByStep={() => {}}
                          isRunning={bubbleSortState.isRunning}
                          stepByStep={!bubbleSortState.isRunning}
                          aSize={bubbleSortState.aSize}
                          initOrder={bubbleSortState.initOrder}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <BubbleSortCanvas
                            state={bubbleSortState}
                            classicTheme={classicTheme}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">الأعمدة:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {bubbleSortState.aSize} عمود
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">المقارنات:</span>
                            <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold">
                              {bubbleSortState.comps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">التبديلات:</span>
                            <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              {bubbleSortState.swaps}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">الحالة:</span>
                            <span
                              className={`font-mono px-2 py-0.5 rounded font-bold ${
                                bubbleSortState.doneFlag
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : bubbleSortState.isRunning
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {bubbleSortState.doneFlag
                                ? 'مكتمل (Complete)'
                                : bubbleSortState.isRunning
                                ? 'جارٍ التشغيل...'
                                : 'متوقف'}
                            </span>
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 اضغط Step للتقدم خطوة واحدة ومشاهدة تبديل القيم ومؤشري outer و inner!
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Controls bar */}
                        <AppletControls
                          onNew={onNew}
                          onFill={onFill}
                          onIns={onIns}
                          onFind={onFind}
                          onDel={onDel}
                          onSetDups={onSetDups}
                          searchTypeOption={isOrdered ? 'searchMode' : 'duplicates'}
                          isLinear={isOrdered ? orderedState.isLinear : false}
                          onSetLinear={onSetLinear}
                          onNextStep={onNextStep}
                          onTogglePlay={onTogglePlay}
                          onSpeedChange={onSpeedChange}
                          onReset={onReset}
                          dupsOK={!isOrdered ? unorderedState.dupsOK : false}
                          isRunning={currentState.isRunning}
                          stepByStep={currentState.stepByStep}
                          onToggleStepByStep={onToggleStepByStep}
                          currentOp={currentState.currentOp}
                          inputValue={inputValue}
                          setInputValue={setInputValue}
                          classicTheme={classicTheme}
                          setClassicTheme={setClassicTheme}
                        />

                        {/* The Visual Canvas */}
                        <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-sm">
                          <AppletCanvas
                            state={{
                              totalCells: currentState.totalCells,
                              items: currentState.items,
                              note: currentState.note,
                              curIn: currentState.curIn,
                              showRange: isOrdered ? orderedState.showRange : false,
                              lowerBound: isOrdered ? orderedState.lowerBound : 0,
                              upperBound: isOrdered ? orderedState.upperBound : 0,
                            }}
                            classicTheme={classicTheme}
                            onSelectKey={(key) => setInputValue(key.toString())}
                          />
                        </div>

                        {/* Status and quick instructions */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">عدد العناصر الحالية:</span>
                            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                              {currentState.nPersons} / {currentState.totalCells}
                            </span>
                            <span className="text-slate-400">|</span>
                            <span className="font-semibold text-slate-700">العملية:</span>
                            <span className="font-mono uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                              {currentState.currentOp}
                            </span>
                            {currentState.curIn >= 0 && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-slate-700">مؤشر الفحص (Index):</span>
                                <span className="font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                                  {currentState.curIn}
                                </span>
                              </>
                            )}
                            {isOrdered && orderedState.showRange && (
                              <>
                                <span className="text-slate-400">|</span>
                                <span className="font-semibold text-blue-700">نطاق البحث (Range):</span>
                                <span className="font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-bold">
                                  {orderedState.lowerBound} إلى {orderedState.upperBound}
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-slate-500 text-[11px]">
                            💡 انقر على أي خلية في المصفوفة لنسخ قيمتها تلقائياً إلى حقل Number!
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Column: Execution Log, Algorithm Tracer, & Original HTML Guide */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Algorithm Step Tracer */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          مُتتبّع تنفيذ الخوارزمية ({selectedApplet.titleEn})
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {isGraph
                            ? graphState.isRunning
                              ? `جارٍ تشغيل ${graphState.opMode === 1 ? 'DFS' : graphState.opMode === 2 ? 'BFS' : 'Tree'} تلقائياً...`
                              : graphState.opMode !== 0
                              ? `خوارزمية ${graphState.opMode === 1 ? 'البحث في العمق DFS' : graphState.opMode === 2 ? 'البحث في العرض BFS' : 'شجرة الامتداد Tree'} خطوة بخطوة (جزء ${graphState.codePart})`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isGraphW
                            ? graphWState.isRunning
                              ? 'جارٍ تشغيل شجرة الامتداد الأصغري (Prim MST) تلقائياً...'
                              : graphWState.opMode === 1
                              ? `خوارزمية بريم خطوة بخطوة (جزء ${graphWState.codePart})`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isGraphDW
                            ? graphDWState.isRunning
                              ? 'جارٍ تشغيل خوارزمية دكسترا لأقصر المسارات تلقائياً...'
                              : graphDWState.opMode === 1
                              ? `خوارزمية دكسترا خطوة بخطوة (جزء ${graphDWState.codePart})`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isHashChain
                            ? hashChainState.isRunning
                              ? 'جارٍ تشغيل عمليات جدول الهاش بالسلاسل المنفصلة...'
                              : hashChainState.opMode !== 'idle'
                              ? `جارٍ تنفيذ عملية ${hashChainState.opMode} خطوة بخطوة`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isHash
                            ? hashState.isRunning
                              ? 'جارٍ تشغيل عمليات جدول الهاش...'
                              : hashState.opMode !== 'idle'
                              ? `جارٍ تنفيذ عملية ${hashState.opMode} خطوة بخطوة`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isTree
                            ? treeState.isRunning
                              ? 'جارٍ تشغيل عمليات الشجرة الثنائية...'
                              : treeState.opMode !== 'idle'
                              ? `جارٍ تنفيذ عملية ${treeState.opMode} خطوة بخطوة`
                              : 'في وضع الانتظار / جاهزة للأوامر'
                            : isMergeSort
                            ? mergeSortState.isRunning
                              ? 'جارٍ ترتيب الدمج (فرّق تسد)...'
                              : mergeSortState.doneFlag
                              ? 'اكتمل الترتيب بنجاح'
                              : 'في وضع الانتظار / خطوة بخطوة'
                            : isQuickSort2
                            ? quickSort2State.isRunning
                              ? 'جارٍ الترتيب بأسلوب وسيط الثلاثة...'
                              : quickSort2State.doneFlag
                              ? 'اكتمل الترتيب بنجاح'
                              : 'في وضع الانتظار / خطوة بخطوة'
                            : isQuickSort1
                            ? quickSort1State.isRunning
                              ? 'جارٍ الترتيب السريع...'
                              : quickSort1State.doneFlag
                              ? 'اكتمل الترتيب بنجاح'
                              : 'في وضع الانتظار / خطوة بخطوة'
                            : isTowers
                            ? towersState.isRunning
                              ? 'جارٍ التنفيذ العودي...'
                              : towersState.isDoneFlag
                              ? 'اكتمل الحل'
                              : 'في وضع الانتظار'
                            : isLinkList
                            ? linkListState.isRunning
                              ? 'جارٍ التنفيذ...'
                              : 'في وضع الانتظار'
                            : isPriorityQueue
                            ? priorityQueueState.isRunning
                              ? 'جارٍ التنفيذ...'
                              : 'في وضع الانتظار'
                            : isQueue
                            ? queueState.isRunning
                              ? 'جارٍ التنفيذ...'
                              : 'في وضع الانتظار'
                            : isStack
                            ? stackState.isRunning
                              ? 'جارٍ التنفيذ...'
                              : 'في وضع الانتظار'
                            : isSelect
                            ? selectionSortState.isRunning
                              ? 'جارٍ الترتيب...'
                              : selectionSortState.doneFlag
                              ? 'اكتمل الترتيب'
                              : 'في وضع الانتظار'
                            : isInsert
                            ? insertionSortState.isRunning
                              ? 'جارٍ الترتيب...'
                              : insertionSortState.doneFlag
                              ? 'اكتمل الترتيب'
                              : 'في وضع الانتظار'
                            : isBubble
                            ? bubbleSortState.isRunning
                              ? 'جارٍ الترتيب...'
                              : bubbleSortState.doneFlag
                              ? 'اكتمل الترتيب'
                              : 'في وضع الانتظار'
                            : currentState.currentOp === 'idle'
                            ? 'في وضع الانتظار'
                            : 'جارٍ التنفيذ...'}
                        </span>
                      </h3>

                      {/* State Card */}
                      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-2">
                        <div className="flex justify-between items-center text-slate-600">
                          <span>الرسالة المعروضة:</span>
                          <span className="font-mono font-bold text-blue-900 text-left" dir="ltr">
                            "{isGraph
                              ? graphState.note
                              : isGraphW
                              ? graphWState.note
                              : isGraphDW
                              ? graphDWState.note
                              : isHashChain
                              ? hashChainState.note
                              : isHash
                              ? hashState.note
                              : isTree
                              ? treeState.note
                              : isMergeSort
                              ? mergeSortState.note
                              : isQuickSort2
                              ? quickSort2State.note
                              : isQuickSort1
                              ? quickSort1State.note
                              : isTowers
                              ? towersState.note
                              : isLinkList
                              ? linkListState.note
                              : isPriorityQueue
                              ? priorityQueueState.note
                              : isQueue
                              ? queueState.note
                              : isStack
                              ? stackState.note
                              : isSelect
                              ? selectionSortState.note
                              : isInsert
                              ? insertionSortState.note
                              : isBubble
                              ? bubbleSortState.note
                              : currentState.note}"
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span>
                            {isGraph
                              ? 'مؤشرات المخطط والمكدس والطابور (GraphN):'
                              : isGraphW
                              ? 'مؤشرات المخطط وشجرة الامتداد (GraphW):'
                              : isGraphDW
                              ? 'مؤشرات المخطط وشجرة المسارات (GraphDW):'
                              : isHashChain
                              ? 'مؤشرات القوائم والسلاسل (Separate Chaining):'
                              : isHash
                              ? 'مؤشرات جدول الهاش والمسح الخطي:'
                              : isTree
                              ? 'مؤشرات الشجرة ومصفوفة الزيارة:'
                              : isMergeSort
                              ? 'مؤشرات ترتيب الدمج والمكدس:'
                              : isQuickSort2
                              ? 'مؤشرات وسيط الثلاثة:'
                              : isQuickSort1
                              ? 'مؤشرات الترتيب السريع:'
                              : isTowers
                              ? 'إطار التفعيل في قمة المكدس (Stack Top):'
                              : isLinkList
                              ? 'مؤشرات القائمة المترابطة:'
                              : isPriorityQueue
                              ? 'مؤشرات الأولوية (Front & Rear):'
                              : isQueue
                              ? 'مؤشرات الطابور (Front & Rear):'
                              : isStack
                              ? 'مؤشر القمة (Top):'
                              : isSelect || isInsert || isBubble
                              ? 'المؤشرات الحالية:'
                              : isOrdered
                              ? 'نوع البحث المختار:'
                              : 'وضعية التكرار:'}
                          </span>
                          <span className="font-semibold text-emerald-700">
                            {isGraph
                              ? `الرؤوس=${graphState.nVerts}/${graphState.MAX_VERTS} | الزيارات=${graphState.visitArray.length} | المكدس=${graphState.theStack.length} | الطابور=${graphState.theQueue.length} | العرض=${graphState.showAdjm ? 'Matrix' : 'Graph'} | جزء=${graphState.codePart}`
                              : isGraphW
                              ? `الرؤوس=${graphWState.nVerts}/${graphWState.MAX_VERTS} | الشجرة=${graphWState.nTree} | طابور PQ=${graphWState.thePQ.length} | العرض=${graphWState.showAdjm ? 'Matrix' : 'Graph'} | جزء=${graphWState.codePart}`
                              : isGraphDW
                              ? `الرؤوس=${graphDWState.nVerts}/${graphDWState.MAX_VERTS} | الشجرة=${graphDWState.nTree} | العرض=${graphDWState.showAdjm ? 'Matrix' : 'Graph'} | جزء=${graphDWState.codePart}`
                              : isHashChain
                              ? `List=${hashChainState.curList >= 0 ? hashChainState.curList : '-'}, Link=${hashChainState.curLink >= 0 ? hashChainState.curLink : '-'} | Lists=${hashChainState.totalBuckets}, Items=${hashChainState.nPersons} | λ=${(hashChainState.totalBuckets > 0 ? hashChainState.nPersons / hashChainState.totalBuckets : 0).toFixed(2)}`
                              : isHash
                              ? `curIn=${hashState.curIn >= 0 ? hashState.curIn : '-'}, oldCurIn=${hashState.oldCurIn >= 0 ? hashState.oldCurIn : '-'} | Cells=${hashState.nPersons}/${hashState.totalCells} | Load=${((hashState.nPersons / (hashState.totalCells || 1)) * 100).toFixed(0)}%`
                              : isTree
                              ? `curIn=${treeState.curIn >= 0 ? treeState.curIn : '-'}, succ=${treeState.successor >= 0 ? treeState.successor : '-'} | Stack=${treeState.theStack.length} | Visits=${treeState.visitIndex}`
                              : isMergeSort
                              ? `low=${mergeSortState.lower}, up=${mergeSortState.upper}, mid=${mergeSortState.mid}, ptr=${mergeSortState.ptrIndex >= 0 ? mergeSortState.ptrIndex : '-'} | Stack=${mergeSortState.theStack.length}`
                              : isQuickSort2
                              ? `L=${quickSort2State.left}, R=${quickSort2State.right}, C=${quickSort2State.center}, P=${quickSort2State.pivot}, LScan=${quickSort2State.leftScan}, RScan=${quickSort2State.rightScan}`
                              : isQuickSort1
                              ? `L=${quickSort1State.left}, R=${quickSort1State.right}, Pivot=${quickSort1State.pivot}, LScan=${quickSort1State.leftScan}, RScan=${quickSort1State.rightScan}`
                              : isTowers
                              ? towersState.theStack.length > 0
                                ? `n=${towersState.theStack[towersState.theStack.length - 1].n}, from=${String.fromCharCode(65 + towersState.theStack[towersState.theStack.length - 1].from)}, to=${String.fromCharCode(65 + towersState.theStack[towersState.theStack.length - 1].to)}, ret=${towersState.theStack[towersState.theStack.length - 1].codePart}`
                                : 'المكدس فارغ'
                              : isLinkList
                              ? `${linkListState.notSorted ? 'غير مرتبة (Unsorted)' : 'مرتبة (Sorted)'}${
                                  linkListState.curIn >= 0 ? ` | curIn=${linkListState.curIn}` : ''
                                }`
                              : isPriorityQueue
                              ? `Front = ${priorityQueueState.front}, Rear = ${priorityQueueState.rear}${priorityQueueState.curIn >= 0 ? `, curIn = ${priorityQueueState.curIn}` : ''}`
                              : isQueue
                              ? `Front = ${queueState.front}, Rear = ${queueState.rear}`
                              : isStack
                              ? `Top = ${stackState.curIn}`
                              : isSelect
                              ? `outer=${selectionSortState.outer}, min=${selectionSortState.min}, inner=${selectionSortState.inner}`
                              : isInsert
                              ? `outer=${insertionSortState.outer}, inner=${insertionSortState.inner}`
                              : isBubble
                              ? `outer=${bubbleSortState.outer}, inner=${bubbleSortState.inner}`
                              : isOrdered
                              ? orderedState.isLinear
                                ? 'خطي (Linear Search)'
                                : 'ثنائي (Binary Search O(log N))'
                              : unorderedState.dupsOK
                              ? 'مسموح (Dups OK)'
                              : 'ممنوع (No Dups)'}
                          </span>
                        </div>
                      </div>

                      {/* Execution Log List */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 mb-1.5">سجل الخطوات الأخيرة:</div>
                        <div className="bg-slate-950 text-slate-300 p-3 rounded-lg font-mono text-[11px] max-h-48 overflow-y-auto space-y-1 border border-slate-800 text-left" dir="ltr">
                          {executionLog.map((log, idx) => (
                            <div key={idx} className={idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              &gt; {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Original Applet Guide */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-sm text-xs space-y-2.5">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs border-b border-amber-200 pb-2">
                        <Info className="w-4 h-4 text-amber-700" />
                        دليل عمليات البريمج (من ملف {isGraph ? 'GraphN.html' : isGraphW ? 'GraphW.html' : isGraphDW ? 'GraphDW.html' : isHashChain ? 'HashChain.html' : isHash ? 'Hash.html' : isTree ? 'Tree.html' : isMergeSort ? 'MergeSort.html' : isQuickSort2 ? 'QuickSort2.html' : isQuickSort1 ? 'QuickSort1.html' : isTowers ? 'Towers.html' : isLinkList ? 'LinkList.html' : isPriorityQueue ? 'PriorityQ.html' : isQueue ? 'Queue.html' : isStack ? 'Stack.html' : isSelect ? 'SelectSort.html' : isInsert ? 'InsertSort.html' : isBubble ? 'BubbleSort.html' : isOrdered ? 'Ordered.html' : 'Array.html'} الأصلي)
                      </div>

                      {isGraph ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">Double-click:</strong> انقر نقراً مزدوجاً بالماوس في أي مساحة فارغة لإنشاء رأس جديد (Vertex) مسمى بأحرف أبجدية متتالية (A, B, C...).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Drag:</strong> اسحب الفأرة من رأس إلى رأس آخر لإنشاء حافة غير موجّهة (Undirected Edge).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">DFS:</strong> ينفذ خوارزمية البحث في العمق (Depth-First Search) باستخدام المكدس، ويطلب النقر على رأس البداية.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">BFS:</strong> ينفذ خوارزمية البحث في العرض (Breadth-First Search) باستخدام الطابور الدائري، ويطلب النقر على رأس البداية.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Tree:</strong> ينشئ شجرة الامتداد (Spanning Tree) بحذف الحواف غير الشجرية ثم استعادتها.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">View:</strong> يبدّل العرض بين المخطط التفاعلي ومصفوفة المجاورة (Adjacency Matrix).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يمسح المخطط الحالي للبدء بمخطط جديد (يطلب ضغطة ثانية للتأكيد ARE YOU SURE?).
                          </div>
                        </div>
                      ) : isGraphW ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">Double-click:</strong> انقر نقراً مزدوجاً بالماوس في أي مساحة فارغة لإنشاء رأس جديد (Vertex) مسمى بأحرف أبجدية متتالية (A, B, C...).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Drag:</strong> اسحب الفأرة من رأس إلى رأس آخر لإنشاء حافة غير موجّهة وموزونة (Enter weight first في خانة الإدخال 0-99 قبل السحب).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Tree:</strong> ينفذ خوارزمية بريم (Prim's Algorithm) لإنشاء شجرة الامتداد الأصغري (Minimum Spanning Tree) عبر طابور الأولوية (thePQ) ثم يتيح حذف الحواف غير المنتمية للشجرة واستعادتها.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">View:</strong> يبدّل العرض بين المخطط التفاعلي ومصفوفة المجاورة المتناظرة الصفراء (Adjacency Matrix).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يمسح المخطط الحالي للبدء بمخطط مخصص جديد (يطلب ضغطة ثانية للتأكيد ARE YOU SURE?).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Sample:</strong> يُحمّل المخطط التوضيحي الكلاسيكي خماسي الرؤوس من الفصل 14 لتجربة فورية لخوارزمية بريم.
                          </div>
                        </div>
                      ) : isGraphDW ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">Double-click:</strong> انقر نقراً مزدوجاً بالماوس في أي مساحة فارغة لإنشاء رأس جديد (Vertex) مسمى بأحرف أبجدية متتالية (A, B, C...).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Type number:</strong> اكتب وزناً للحافة (0 إلى 99) في مربع الإدخال قبل السحب.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Drag:</strong> اسحب الفأرة من رأس إلى رأس آخر لإنشاء حافة موجّهة وموزونة (Directed Weighted Edge) مع نقطة دائرية تحدد الاتجاه.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Path:</strong> ينفذ خوارزمية دكسترا (Dijkstra's Algorithm) لإيجاد أقصر المسارات من الرأس المختار (Single-click on starting vertex) ويعرض شجرة أقصر المسارات بالدوائر والخطوط الحمراء ومصفوفة sPath بالأسفل.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">View:</strong> يبدّل العرض بين الرسم التفاعلي ومصفوفة المجاورة الصفراء (Adjacency Matrix) التي تعرض جميع الأوزان واللانهاية (inf).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يمسح الرسم الحالي للبدء برسم مخصص (يطلب ضغطة ثانية للتأكيد ARE YOU SURE?).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Sample:</strong> يُحمّل الرسم التوضيحي الكلاسيكي خماسي الرؤوس من الفصل 14 لتجربة فورية لخوارزمية دكسترا.
                          </div>
                        </div>
                      ) : isHashChain ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ جدول تجزئة جديد يحتوي على N قائمة مترابطة (بين 1 و 100 قائمة، مع نافذة عرض لـ 10 قوائم وشريط تمرير عمودي Scrollbar).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Fill:</strong> يُدرج N عنصراً عشوائياً بمفاتيح بين 0 و 999 في الجدول عبر توزيعها على القوائم المترابطة (بحد أقصى 6 عناصر لكل قائمة).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يُدرج عنصراً جديداً بقيمة N في رأس القائمة المحسوبة بدالة التجزئة (key % totalBuckets) بزمن O(1).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Find:</strong> يبحث عن العنصر ذي المفتاح N بالانتقال إلى القائمة المناسبة ثم اجتياز عقد السلسلة واحدة تلو الأخرى مع مؤشر السهم الأحمر.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Del:</strong> يبحث عن العنصر ذي المفتاح N في سلسلته ويحذفه بإعادة ربط العقد، دون ترك خلايا ميتة محجوزة (*Del*).
                          </div>
                          <div className="text-[11px] text-amber-800">
                            (اكتب الرقم N في مربع الإدخال، أو استخدم شريط التمرير الرأسي للتنقل بين القوائم من 0 إلى {hashChainState.totalBuckets - 1}).
                          </div>
                        </div>
                      ) : isHash ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ جدول تجزئة جديد بسعة N خلية (الحد الأقصى 60 خلية).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Fill:</strong> يُدرج N عنصراً عشوائياً (بمفاتيح بين 0 و 999) في الجدول باستخدام دالة التجزئة والمسح الخطي.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يُدرج عنصراً جديداً بمفتاح N في موقعه المحسوب key % totalCells مع المسح الخطي عند التصادم.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Del:</strong> يبحث عن العنصر ذي المفتاح N ويستبدله برمز الحذف المحجوز (*Del*) لمنع انقطاع مسارات البحث.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Find:</strong> يبحث عن العنصر ذي المفتاح N ويتتبع خطوات المسح بالسهم الأحمر حتى العثور عليه أو بلوغ خلية فارغة.
                          </div>
                          <div className="text-[11px] text-amber-800">
                            (اكتب القيمة N في مربع "Enter number" قبل الضغط على أزرار العمليات، أو انقر على أي خلية).
                          </div>
                        </div>
                      ) : isTree ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">Fill:</strong> يُنشئ شجرة ثنائية جديدة تحتوي على N عقدة عشوائية (بين 1 و 31 عقدة بمفاتيح فريدة من 0 إلى 99).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Find:</strong> يبحث عن العقدة ذات المفتاح N بالنزول خطوة بخطوة عبر الشجرة بمقارنة المفاتيح مع مؤشر السهم الأحمر.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يُدرج عقدة جديدة بمفتاح N في موضعها الصحيح وفق خاصية BST مع التحقق من عدم تجاوز العمق 4 (الفهرس 30).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Trav:</strong> يجتاز الشجرة بالترتيب التصاعدي (Inorder: يسار - جذر - يمين) باستخدام مكدس LIFO صريح ويعرض ترتيب الزيارة في صندوق الزيارة السفلي.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Del:</strong> يحذف العقدة ذات المفتاح N بمعالجة الحالات الثلاث: ورقة، ابن وحيد، أو استبدال بالخليفة المتصاعد (Inorder Successor).
                          </div>
                          <div className="text-[11px] text-amber-800">
                            (اكتب القيمة N في مربع "Enter number" قبل الضغط على أزرار العمليات، أو انقر على أي عقدة).
                          </div>
                        </div>
                      ) : isMergeSort ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ بيانات جديدة ويبدأ الترتيب؛ يُبدل بين الترتيب العشوائي (Random) والمعكوس (Inverse).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Size:</strong> يُبدل بين 12 عموداً و 100 عمود؛ ويُنشئ بيانات جديدة مع إعادة ضبط الخوارزمية.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Draw:</strong> يُعيد رسم الأعمدة والمؤشرات على اللوحة بالكامل.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Run:</strong> يبدأ تشغيل عملية الترتيب آلياً ومستمراً. (اضغط Step لإيقافه مؤقتاً، واضغط Run للمتابعة).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Step:</strong> يُنفذ خطوة فرز أو دمج أو نسخ عكسي واحدة عبر مكدس الاستدعاءات الصريح ومصفوفة workSpace.
                          </div>
                        </div>
                      ) : isQuickSort2 ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ بيانات جديدة ويبدأ الترتيب؛ يُبدل بين الترتيب العشوائي (Random) والمعكوس (Inverse).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Size:</strong> يُبدل بين 10 أعمدة و 100 عمود؛ ويُنشئ بيانات جديدة مع إعادة ضبط الخوارزمية.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Draw:</strong> يُعيد رسم الأعمدة والمؤشرات على اللوحة بالكامل.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Run:</strong> يبدأ تشغيل عملية الترتيب آلياً ومستمراً. (اضغط Step لإيقافه مؤقتاً، واضغط Run للمتابعة).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Step:</strong> يُنفذ خطوة فرز أو تجزيء واحدة مع تحريك مؤشرات left, right, center, leftScan, rightScan, pivot.
                          </div>
                        </div>
                      ) : isQuickSort1 ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ بيانات جديدة ويبدأ الترتيب؛ يُبدل بين الترتيب العشوائي (Random) والمعكوس (Inverse).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Size:</strong> يُبدل بين 10 أعمدة و 100 عمود مع إعادة تهيئة البيانات والترتيب.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Draw:</strong> يُعيد رسم الأعمدة بالكامل.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Run:</strong> يبدأ تشغيل الترتيب السريع آلياً ومستمراً.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Step:</strong> يُنفذ خطوة مسح أو مقارنة أو تبديل واحدة.
                          </div>
                        </div>
                      ) : isTowers ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">Drag:</strong> اسحب أي قرص علوي بالماوس وأفلته فوق عمود آخر (يمنع البرنامج وضع قرص أكبر فوق قرص أصغر ويعيده مكانه).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Type number:</strong> اكتب عدداً بين 1 و 10 في خانة Enter number لتحديد عدد الأقراص.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ لعبة جديدة بعدد الأقراص المختار ومرتبة على العمود الأيسر A.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Step:</strong> يُنفذ خطوة خوارزمية واحدة من الحل العودي ويعرض رسائل مكدس الاستدعاءات.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Run:</strong> يبدأ تشغيل خوارزمية الحل آلياً وبشكل مستمر حتى نقل كل الأقراص للعمود C.
                          </div>
                        </div>
                      ) : isLinkList ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ قائمة مترابطة جديدة بعدد N من العقد (الحد الأقصى 28 عقدة).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يُدرج عنصراً جديداً بقيمة N (في الرأس O(1) في الوضع غير المرتب، أو مع تشبيك الروابط Splice في الوضع المرتب).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Find:</strong> يبحث خطياً عن العقدة ذات القيمة N باستخدام مؤشر curIn الأحمر.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Del:</strong> يحذف العقدة ذات القيمة N مع حركة تجاوز الرابط Bypass.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Unsorted/Sorted:</strong> تُستخدم مع زر New لتحديد حالة الترتيب الابتدائية.
                          </div>
                          <div className="text-[11px] text-amber-800 italic pt-1">
                            (أدخل القيمة N داخل مربع "Enter number:" ثم اضغط الزر المطلوب)
                          </div>
                        </div>
                      ) : isQueue ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ طابوراً فارغاً جديداً ويُصفّر المؤشرات (<code className="font-mono text-[11px]">front=0, rear=-1</code>).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يُدرج عنصراً بقيمة N عند مؤخرة الطابور (<strong className="text-blue-700">Rear</strong>) مع التفاف دائري تلقائي.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Rem:</strong> يسحب عنصراً من مقدمة الطابور (<strong className="text-rose-700">Front</strong>)، يُرجع قيمته في مربع Number، ويُقدم مؤشر Front.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Peek:</strong> يعاين قيمة العنصر في مقدمة الطابور دون حذفه ويُرجعها في مربع Number.
                          </div>
                          <div className="text-[11px] text-amber-800 italic pt-1">
                            (أدخل القيمة N داخل مربع "Number:" ثم اضغط Ins)
                          </div>
                        </div>
                      ) : isStack ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ مكدساً فارغاً جديداً.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Push:</strong> يُدرج عنصراً بقيمة N عند قمة المكدس (Top).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Pop:</strong> يسحب عنصراً من قمة المكدس، ويُرجع قيمته في مربع Number.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Peek:</strong> يعاين قيمة العنصر في قمة المكدس دون حذفه.
                          </div>
                          <div className="text-[11px] text-amber-800 italic pt-1">
                            (أدخل القيمة N داخل مربع "Number:" ثم اضغط Push)
                          </div>
                        </div>
                      ) : isBubble ? (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ بيانات جديدة ويبدأ الترتيب؛ يُبدل بين الترتيب العشوائي (Random) والمعكوس (Inverse).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Size:</strong> يُبدل بين 10 أعمدة و 100 عمود مع إعادة تهيئة البيانات والترتيب.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Draw:</strong> يعيد رسم الأعمدة والشاشة بالكامل.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Run:</strong> يبدأ تشغيل خوارزمية الترتيب آلياً ومستمراً. (اضغط Step لإيقافه مؤقتاً).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Step:</strong> ينفذ خطوة فحص وتبديل واحدة ويحرك المؤشرات.
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-slate-700 leading-relaxed">
                          <div>
                            <strong className="text-slate-900 font-mono">New:</strong> يُنشئ مصفوفة فارغة بحجم N (الحد الأقصى 60 خلية).
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Fill:</strong> يملأ المصفوفة بـ N عنصر مرتب تصاعدياً.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Ins:</strong> يجد موضع الإدراج الصحيح، يُزيح العناصر لليمين لسد الفراغ، ثم يدرج العنصر.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Find:</strong> يبحث عن العنصر {isOrdered ? 'باستخدام البحث الثنائي السريع O(log N) مع تحديد النطاق الأزرق' : 'خطياً'} ويتوقف فور العثور عليه.
                          </div>
                          <div>
                            <strong className="text-slate-900 font-mono">Del:</strong> يبحث عن العنصر ثم يُزيح العناصر اللاحقة لليسار.
                          </div>
                          <div className="text-[11px] text-amber-800 italic pt-1">
                            (أدخل القيمة N داخل مربع "Number:" ثم اضغط الزر المطلوب)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Full C# Source Code & Solution */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  <CSharpCodeViewer appletId={selectedApplet.id} />
                </div>
              )}

              {/* Tab 3: Data Structure Guide & Big-O */}
              {activeTab === 'guide' && (
                <AlgorithmExplainer appletId={selectedApplet.id} />
              )}

              {/* Tab 4: Original Java Class Artifacts */}
              {activeTab === 'artifacts' && (
                <OriginalFilesViewer appletId={selectedApplet.id} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        منصة عارض بريمجات روبرت لافور لهياكل البيانات والخوارزميات (Robert Lafore Data Structures & Algorithms Applets) — مكتوب بلغة C# Windows Forms و React/TypeScript.
      </footer>
    </div>
  );
}
