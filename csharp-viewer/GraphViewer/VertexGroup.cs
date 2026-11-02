using System;
using System.Collections.Generic;
using System.Drawing;

namespace GraphViewer
{
    public class TreeEdge
    {
        public int V1 { get; set; }
        public int V2 { get; set; }
        public TreeEdge(int v1, int v2) { V1 = v1; V2 = v2; }
    }

    /// <summary>
    /// Core Graph Engine for Chapter 13:
    /// - MAX_VERTS = 13
    /// - Adjacency Matrix adjMat[13, 13]
    /// - Depth-First Search (DFS)
    /// - Breadth-First Search (BFS)
    /// - Minimum Spanning Tree (MST)
    /// - Adjacency Matrix view toggle
    /// </summary>
    public class VertexGroup
    {
        public const int MAX_VERTS = 13;
        public int NVerts { get; set; }
        public Vertex[] VertexList { get; private set; }
        public int[,] AdjMat { get; private set; }
        public StackX TheStack { get; private set; }
        public QueueX TheQueue { get; private set; }
        public List<int> VisitList { get; private set; }
        public List<TreeEdge> TreeEdges { get; private set; }

        public string Note { get; set; }
        public string OpMode { get; set; } = "idle"; // "idle", "dfs", "bfs", "tree"
        public bool ShowAdjm { get; set; }
        public bool WasClearPressed { get; set; }

        public bool IsDragging { get; set; }
        public int DragStartVertex { get; set; } = -1;
        public Point DragStartPos { get; set; }
        public Point DragCurrentPos { get; set; }

        public VertexGroup()
        {
            VertexList = new Vertex[MAX_VERTS];
            AdjMat = new int[MAX_VERTS, MAX_VERTS];
            TheStack = new StackX(MAX_VERTS);
            TheQueue = new QueueX(MAX_VERTS);
            VisitList = new List<int>();
            TreeEdges = new List<TreeEdge>();
            NVerts = 0;
            Note = "Double-click mouse to make vertex";
        }

        public void LoadSampleGraph()
        {
            Clear();
            Vertex.ClassChar = 'A';

            AddVertex(70, 110, 'A', Color.LightPink);
            AddVertex(190, 100, 'B', Color.LightGreen);
            AddVertex(320, 120, 'C', Color.LightSkyBlue);
            AddVertex(130, 220, 'D', Color.Wheat);
            AddVertex(260, 230, 'E', Color.Thistle);

            AddEdge(0, 1); // A - B
            AddEdge(1, 2); // B - C
            AddEdge(0, 3); // A - D
            AddEdge(3, 4); // D - E
            AddEdge(1, 4); // B - E
            AddEdge(2, 4); // C - E

            Note = "Sample graph loaded (A-E); press DFS, BFS, or Tree";
        }

        public void AddVertex(int x, int y, char label, Color c)
        {
            if (NVerts < MAX_VERTS)
            {
                VertexList[NVerts++] = new Vertex(x, y, label, c);
            }
        }

        public void AddEdge(int start, int end)
        {
            AdjMat[start, end] = 1;
            AdjMat[end, start] = 1;
        }

        public int CloseTo(int x, int y)
        {
            const int radius = 15;
            for (int i = 0; i < NVerts; i++)
            {
                int dx = VertexList[i].X - x;
                int dy = VertexList[i].Y - y;
                if (Math.Sqrt(dx * dx + dy * dy) <= radius)
                    return i;
            }
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            if (OpMode != "idle")
            {
                Note = "Please finish or reset current operation first";
                return;
            }
            if (NVerts >= MAX_VERTS)
            {
                Note = "CAN'T INSERT more vertices";
                return;
            }
            if (CloseTo(x, y) >= 0)
            {
                Note = "Vertex too close to existing vertex";
                return;
            }

            char label = (char)('A' + NVerts);
            VertexList[NVerts] = new Vertex(x, y, label, Color.LightSkyBlue);
            NVerts++;
            Note = $"Made vertex {label}";
            WasClearPressed = false;
        }

        public void StartDrag(int x, int y)
        {
            if (OpMode != "idle") return;
            int vIdx = CloseTo(x, y);
            if (vIdx >= 0)
            {
                IsDragging = true;
                DragStartVertex = vIdx;
                DragStartPos = new Point(VertexList[vIdx].X, VertexList[vIdx].Y);
                DragCurrentPos = new Point(x, y);
                Note = $"Starting edge at vertex {VertexList[vIdx].Label}";
            }
        }

        public void UpdateDrag(int x, int y)
        {
            if (IsDragging)
            {
                DragCurrentPos = new Point(x, y);
            }
        }

        public void EndDrag(int x, int y)
        {
            if (!IsDragging) return;
            int destIdx = CloseTo(x, y);
            int srcIdx = DragStartVertex;
            IsDragging = false;
            DragStartVertex = -1;

            if (destIdx < 0 || srcIdx < 0 || destIdx === srcIdx)
            {
                Note = "CAN'T MAKE EDGE: Drag from vertex to a different vertex";
                return;
            }

            AddEdge(srcIdx, destIdx);
            Note = $"Made edge between {VertexList[srcIdx].Label} and {VertexList[destIdx].Label}";
        }

        public void WarningNew()
        {
            if (!WasClearPressed)
            {
                WasClearPressed = true;
                Note = "ARE YOU SURE? Press again to clear old graph";
            }
            else
            {
                Clear();
                Note = "Graph cleared; double-click mouse to make vertex";
            }
        }

        public void Clear()
        {
            NVerts = 0;
            for (int i = 0; i < MAX_VERTS; i++)
            {
                VertexList[i] = null!;
                for (int j = 0; j < MAX_VERTS; j++)
                    AdjMat[i, j] = 0;
            }
            ResetVisited();
            WasClearPressed = false;
        }

        public void ResetVisited()
        {
            for (int i = 0; i < NVerts; i++)
            {
                if (VertexList[i] != null)
                {
                    VertexList[i].WasVisited = false;
                    VertexList[i].IsInTree = false;
                }
            }
            TheStack = new StackX(MAX_VERTS);
            TheQueue = new QueueX(MAX_VERTS);
            VisitList.Clear();
            TreeEdges.Clear();
            OpMode = "idle";
        }

        public int GetAdjUnvisitedVertex(int v)
        {
            for (int j = 0; j < NVerts; j++)
            {
                if (AdjMat[v, j] == 1 && !VertexList[j].WasVisited)
                    return j;
            }
            return -1;
        }

        // ==========================================
        // Depth-First Search (DFS)
        // ==========================================
        public void StartDFS(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "dfs";

            VertexList[startIdx].WasVisited = true;
            TheStack.Push(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting DFS from vertex {VertexList[startIdx].Label}; pushed on stack";
        }

        public bool StepDFS()
        {
            if (OpMode != "dfs")
            {
                StartDFS();
                return false;
            }

            if (TheStack.IsEmpty())
            {
                OpMode = "idle";
                Note = "DFS complete; all reachable vertices visited";
                return true;
            }

            int topV = TheStack.Peek();
            int v = GetAdjUnvisitedVertex(topV);

            if (v == -1)
            {
                int popped = TheStack.Pop();
                if (TheStack.IsEmpty())
                {
                    OpMode = "idle";
                    Note = $"Popped {VertexList[popped].Label}; stack is empty. DFS complete!";
                    return true;
                }
                Note = $"No unvisited neighbors for {VertexList[popped].Label}; popped. Backtrack to {VertexList[TheStack.Peek()].Label}";
            }
            else
            {
                VertexList[v].WasVisited = true;
                TheStack.Push(v);
                VisitList.Add(v);
                Note = $"Visited {VertexList[v].Label} from {VertexList[topV].Label}; pushed on stack";
            }
            return false;
        }

        // ==========================================
        // Breadth-First Search (BFS)
        // ==========================================
        public void StartBFS(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "bfs";

            VertexList[startIdx].WasVisited = true;
            TheQueue.Insert(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting BFS from vertex {VertexList[startIdx].Label}; placed in queue";
        }

        public bool StepBFS()
        {
            if (OpMode != "bfs")
            {
                StartBFS();
                return false;
            }

            if (TheQueue.IsEmpty())
            {
                OpMode = "idle";
                Note = "BFS complete; all reachable vertices visited";
                return true;
            }

            int currentV = TheQueue.ToArray()[0];
            int v = GetAdjUnvisitedVertex(currentV);

            if (v == -1)
            {
                int removed = TheQueue.Remove();
                if (TheQueue.IsEmpty())
                {
                    OpMode = "idle";
                    Note = $"Removed {VertexList[removed].Label}; queue is empty. BFS complete!";
                    return true;
                }
                Note = $"All neighbors of {VertexList[removed].Label} visited; removed. Front of queue is {VertexList[TheQueue.ToArray()[0]].Label}";
            }
            else
            {
                VertexList[v].WasVisited = true;
                TheQueue.Insert(v);
                VisitList.Add(v);
                Note = $"Visited {VertexList[v].Label} adjacent to {VertexList[currentV].Label}; added to queue";
            }
            return false;
        }

        // ==========================================
        // Minimum Spanning Tree (MST - Unweighted)
        // ==========================================
        public void StartTree(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "tree";

            VertexList[startIdx].WasVisited = true;
            VertexList[startIdx].IsInTree = true;
            TheStack.Push(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting Minimum Spanning Tree from vertex {VertexList[startIdx].Label}";
        }

        public bool StepTree()
        {
            if (OpMode != "tree")
            {
                StartTree();
                return false;
            }

            if (TheStack.IsEmpty())
            {
                OpMode = "idle";
                Note = $"Minimum Spanning Tree complete ({TreeEdges.Count} edges connecting {NVerts} vertices)";
                return true;
            }

            int topV = TheStack.Peek();
            int v = GetAdjUnvisitedVertex(topV);

            if (v == -1)
            {
                int popped = TheStack.Pop();
                if (TheStack.IsEmpty())
                {
                    OpMode = "idle";
                    Note = $"Tree complete! Spanning tree formed with {TreeEdges.Count} edges";
                    return true;
                }
                Note = $"Backtracking from {VertexList[popped].Label}";
            }
            else
            {
                VertexList[v].WasVisited = true;
                VertexList[v].IsInTree = true;
                TheStack.Push(v);
                VisitList.Add(v);
                TreeEdges.Add(new TreeEdge(topV, v));
                Note = $"Added tree edge {VertexList[topV].Label}-{VertexList[v].Label} to Spanning Tree";
            }
            return false;
        }

        public void ChangeView()
        {
            ShowAdjm = !ShowAdjm;
            Note = ShowAdjm ? "Adjacency matrix; press View again to show graph" : "Press any button";
        }
    }
}
