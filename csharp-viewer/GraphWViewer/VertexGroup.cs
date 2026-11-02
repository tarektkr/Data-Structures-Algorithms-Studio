using System;
using System.Drawing;

namespace GraphWViewer
{
    /// <summary>
    /// Manages the vertices, undirected edges, priority queue, and Minimum Spanning Tree (MSTW) algorithm
    /// (Robert Lafore - vertexGroup.class)
    /// </summary>
    public class VertexGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 320;
        public const int TopMargin = 70;
        public const int LeftMargin = 10;
        public const int VertexDiameter = 22;
        public const int WeightBoxWidth = 17;
        public const int WeightBoxHeight = 15;
        public const int MAX_VERTS = 13;
        public const int MAX_WEIGHT = 99;
        public const int INFINITY = 1000000;

        public Vertex[] VertexList { get; private set; }
        public DisIs[,] AdjMat { get; private set; }
        public DisIs[,] AdjMat2 { get; private set; }
        public int NVerts { get; set; }

        public PriorityQ ThePQ { get; private set; }
        public int[] Tree { get; private set; }
        public int NTree { get; set; }

        public string Note { get; set; }
        public string OldNote { get; set; }
        public int OpMode { get; set; }   // 0: idle, 1: tree / MST in progress
        public int CodePart { get; set; } // 1 to 8
        public int DrawMode { get; set; }
        public bool ShowAdjm { get; set; }

        public int XStartDrag { get; set; }
        public int YStartDrag { get; set; }
        public int CurrentDragX { get; set; }
        public int CurrentDragY { get; set; }
        public bool IsDragging { get; set; }
        public bool MadeVertex { get; set; }
        public bool WasClearPressed { get; set; }

        public int StartingVertex { get; set; }
        public int CurrentVert { get; set; }
        public int DisplayVertex { get; set; }
        public int DisplayEdge1 { get; set; }
        public int DisplayEdge2 { get; set; }

        private readonly Random _rand = new Random();

        public VertexGroup()
        {
            VertexList = new Vertex[MAX_VERTS];
            AdjMat = new DisIs[MAX_VERTS, MAX_VERTS];
            AdjMat2 = new DisIs[MAX_VERTS, MAX_VERTS];
            Tree = new int[MAX_VERTS];
            ThePQ = new PriorityQ();

            for (int i = 0; i < MAX_VERTS; i++)
            {
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat[i, j] = new DisIs(INFINITY, false);
                    AdjMat2[i, j] = new DisIs(INFINITY, false);
                }
            }

            NVerts = 0;
            NTree = 0;
            Note = "Double-click mouse to make vertex";
            OldNote = "";
            OpMode = 0;
            CodePart = 1;
            DrawMode = 4;
            ShowAdjm = false;
            StartingVertex = -1;
            DisplayVertex = -1;
            DisplayEdge1 = -1;
            DisplayEdge2 = -1;
            WasClearPressed = false;
        }

        private Color GetRandomColor()
        {
            return Color.FromArgb(
                100 + _rand.Next(155),
                100 + _rand.Next(155),
                100 + _rand.Next(155)
            );
        }

        public int CloseTo(int x, int y)
        {
            const int threshold = 11;
            for (int i = 0; i < NVerts; i++)
            {
                if (Math.Abs(VertexList[i].X - x) < threshold && Math.Abs(VertexList[i].Y - y) < threshold)
                {
                    return i;
                }
            }
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            MadeVertex = true;
            if (NVerts >= MAX_VERTS)
            {
                Note = "CAN'T INSERT more vertices";
                return;
            }

            int clampedX = Math.Max(20, Math.Min(x, 420));
            int clampedY = Math.Max(75, Math.Min(y, 265));

            char label = (char)('A' + NVerts);
            VertexList[NVerts] = new Vertex(clampedX, clampedY, label, GetRandomColor());
            Note = $"Made vertex {label}";
            DisplayVertex = NVerts;
            NVerts++;
            DrawMode = 2;
        }

        public void StartDrag(int x, int y)
        {
            XStartDrag = x;
            YStartDrag = y;
            CurrentDragX = x;
            CurrentDragY = y;
            IsDragging = true;

            int vertIdx = CloseTo(x, y);
            if (vertIdx < 0)
            {
                Note = "To make edge, drag from vertex to vertex";
            }
            else
            {
                Note = $"Starting edge at vertex {VertexList[vertIdx].Label}";
            }
            DrawMode = 1;
        }

        public void EndDrag(bool isNumber, int weight, int x, int y)
        {
            IsDragging = false;
            if (MadeVertex)
            {
                MadeVertex = false;
                DrawMode = 2;
                return;
            }

            int src = CloseTo(XStartDrag, YStartDrag);
            int dest = CloseTo(x, y);

            if (OpMode > 0)
            {
                if (StartingVertex == -1)
                    Note = "Click on a VERTEX";
                else
                    Note = $"You clicked on {VertexList[StartingVertex].Label}";
                DrawMode = 1;
                return;
            }

            if (src < 0 || dest < 0 || src == dest)
            {
                Note = "CAN'T MAKE EDGE: Drag from vertex to vertex";
                DrawMode = 1;
                return;
            }

            if (!isNumber || weight < 0 || weight > MAX_WEIGHT)
            {
                Note = $"CAN'T MAKE EDGE: Enter a weight (0 to {MAX_WEIGHT})";
                DrawMode = 1;
                return;
            }

            // Undirected edge: symmetric in AdjMat
            AdjMat[src, dest].Distance = weight;
            AdjMat[dest, src].Distance = weight;
            MadeVertex = false;
            DisplayEdge1 = src;
            DisplayEdge2 = dest;
            Note = $"Made edge from {VertexList[src].Label} to {VertexList[dest].Label} with weight {weight}";
            DrawMode = 3;
        }

        public void ChangeView()
        {
            if (ShowAdjm)
            {
                Note = OldNote;
                ShowAdjm = false;
            }
            else
            {
                OldNote = Note;
                Note = NVerts == 0 ? "No vertices; adjacency matrix is empty" : "Press View button again to show graph";
                ShowAdjm = true;
            }
            DrawMode = 4;
        }

        public void WarningNew()
        {
            if (WasClearPressed)
            {
                ClearGraph();
            }
            else
            {
                WasClearPressed = true;
                Note = "ARE YOU SURE? Press again to clear old graph";
            }
        }

        public void ClearGraph()
        {
            NVerts = 0;
            NTree = 0;
            ThePQ = new PriorityQ();
            for (int i = 0; i < MAX_VERTS; i++)
            {
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat[i, j] = new DisIs(INFINITY, false);
                    AdjMat2[i, j] = new DisIs(INFINITY, false);
                }
            }
            Note = "Double-click mouse to make vertex";
            OpMode = 0;
            CodePart = 1;
            ShowAdjm = false;
            WasClearPressed = false;
            DrawMode = 4;
        }

        public void SaveState()
        {
            for (int i = 0; i < MAX_VERTS; i++)
            {
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat2[i, j] = new DisIs(AdjMat[i, j].Distance, AdjMat[i, j].IsInTree);
                }
            }
        }

        public void RestoreState()
        {
            for (int i = 0; i < MAX_VERTS; i++)
            {
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat[i, j] = new DisIs(AdjMat2[i, j].Distance, AdjMat2[i, j].IsInTree);
                }
            }
        }

        public void PutInPQ(int newEdgeDest, int newEdgeDist)
        {
            int queueIndex = ThePQ.Find(newEdgeDest);
            if (queueIndex != -1)
            {
                var tempEdge = ThePQ.PeekN(queueIndex);
                if (tempEdge.Distance > newEdgeDist)
                {
                    ThePQ.RemoveN(queueIndex);
                    ThePQ.Insert(new Edge(CurrentVert, newEdgeDest, newEdgeDist));
                }
            }
            else
            {
                ThePQ.Insert(new Edge(CurrentVert, newEdgeDest, newEdgeDist));
            }
        }

        public void Mst()
        {
            if (NVerts == 0)
            {
                Note = "Double-click mouse to make vertex";
                return;
            }

            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    SaveState();
                    Note = "Single-click on vertex from which to start tree";
                    StartingVertex = -1;
                    DrawMode = 1;
                    CodePart = 2;
                    break;

                case 2:
                    if (StartingVertex == -1)
                    {
                        Note = "INVALID VERTEX";
                        CodePart = 1;
                        DrawMode = 1;
                    }
                    else
                    {
                        Note = $"Starting tree from vertex {VertexList[StartingVertex].Label}";
                        CurrentVert = StartingVertex;
                        CodePart = 3;
                        DrawMode = 1;
                    }
                    break;

                case 3:
                    Tree[NTree] = CurrentVert;
                    NTree++;
                    VertexList[CurrentVert].IsInTree = true;
                    Note = $"Placed vertex {VertexList[CurrentVert].Label} in tree";
                    CodePart = (NTree == NVerts) ? 6 : 4;
                    DrawMode = 1;
                    break;

                case 4:
                    for (int j = 0; j < NVerts; j++)
                    {
                        if (j == CurrentVert || VertexList[j].IsInTree) continue;
                        int d = AdjMat[CurrentVert, j].Distance;
                        if (d == INFINITY) continue;
                        PutInPQ(j, d);
                    }

                    if (ThePQ.Size() == 0)
                    {
                        Note = "Graph not connected";
                        CodePart = 8;
                    }
                    else
                    {
                        Note = $"Placed vertices adj to {VertexList[CurrentVert].Label} in priority queue";
                        CodePart = 5;
                    }
                    DrawMode = 1;
                    break;

                case 5:
                    var minEdge = ThePQ.RemoveMin();
                    if (minEdge != null)
                    {
                        CurrentVert = minEdge.DestVert;
                        AdjMat[minEdge.SrcVert, minEdge.DestVert].IsInTree = true;
                        AdjMat[minEdge.DestVert, minEdge.SrcVert].IsInTree = true;
                        Note = $"Removed minimum-distance edge {VertexList[minEdge.SrcVert].Label}{VertexList[minEdge.DestVert].Label}{minEdge.Distance} from priority queue";
                    }
                    DrawMode = 1;
                    CodePart = 3; // loops back to add CurrentVert to tree
                    break;

                case 6:
                    Note = "Press again to delete unmarked edges";
                    DrawMode = 1;
                    CodePart = 7;
                    break;

                case 7:
                    for (int i = 0; i < NVerts; i++)
                    {
                        for (int j = 0; j < NVerts; j++)
                        {
                            if (AdjMat[i, j].Distance != INFINITY)
                            {
                                if (!AdjMat[i, j].IsInTree)
                                {
                                    AdjMat[i, j].Distance = INFINITY;
                                }
                                else
                                {
                                    AdjMat[i, j].IsInTree = false;
                                }
                            }
                        }
                    }
                    Note = "Minimum spanning tree; press again to restore tree";
                    DrawMode = 1;
                    CodePart = 8;
                    break;

                case 8:
                    RestoreState();
                    Note = "Press any button";
                    NTree = 0;
                    for (int i = 0; i < NVerts; i++)
                    {
                        VertexList[i].IsInTree = false;
                    }
                    while (!ThePQ.IsEmpty()) ThePQ.RemoveMin();
                    CodePart = 1;
                    OpMode = 0;
                    DrawMode = 4;
                    break;
            }
        }

        public void LoadSampleGraph()
        {
            ClearGraph();
            var sampleCoords = new Point[]
            {
                new Point(60, 140),  // A
                new Point(140, 70),  // B
                new Point(140, 210), // C
                new Point(280, 70),  // D
                new Point(280, 210), // E
                new Point(360, 140), // F
            };

            for (int i = 0; i < sampleCoords.Length; i++)
            {
                VertexList[i] = new Vertex(sampleCoords[i].X, sampleCoords[i].Y, (char)('A' + i), GetRandomColor());
            }
            NVerts = sampleCoords.Length;

            var edges = new (int u, int v, int w)[]
            {
                (0, 1, 6),
                (0, 2, 4),
                (1, 2, 10),
                (1, 3, 7),
                (1, 4, 7),
                (2, 3, 8),
                (2, 4, 5),
                (3, 4, 12),
                (3, 5, 7),
                (4, 5, 7)
            };

            foreach (var (u, v, w) in edges)
            {
                AdjMat[u, v].Distance = w;
                AdjMat[v, u].Distance = w;
            }

            Note = "Sample graph loaded. Click Tree then click vertex A to start!";
            DrawMode = 4;
        }

        public static string DtoS(int dist)
        {
            return dist >= INFINITY ? "inf" : dist.ToString();
        }
    }
}
