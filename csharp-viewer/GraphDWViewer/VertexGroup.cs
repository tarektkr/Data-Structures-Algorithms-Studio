using System;
using System.Drawing;

namespace GraphDWViewer
{
    /// <summary>
    /// Manages the collection of vertices, adjacency matrix, and Dijkstra's shortest path algorithm.
    /// Ported faithfully from Robert Lafore's vertexGroup.class.
    /// </summary>
    public class VertexGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 325;
        public const int TopMargin = 70;
        public const int LeftMargin = 10;
        public const int TextHeight = 13;
        public const int VertexDiameter = 22;
        public const int DirDistance = 18;
        public const int DirSize = 7;
        public const int WeightBoxWidth = 17;
        public const int WeightBoxHeight = 15;
        public const int NoteBoxTop = 45;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 430;
        public const int VisitBoxTop = 305;
        public const int VisitBoxHeight = 25;
        public const int VisitBoxWidth = 430;
        public const int CharSpace = 40;
        public const int HeaderBoxTop = 280;
        public const int DrawingBoxHeight = 207;

        public const int MaxVerts = 13;
        public const int MaxWeight = 99;
        public const int Infinity = 1000000;

        public Vertex[] VertexList { get; private set; }
        public DisIs[,] AdjMat { get; private set; }
        public int NVerts { get; set; }
        public int[] Tree { get; private set; }
        public int NTree { get; set; }

        public DisP[] SPath { get; private set; }
        public int StartingVertex { get; set; }
        public int StartTree { get; set; }
        public int CurrentSrc { get; set; }
        public int CurrentDest { get; set; }
        public int StartToCurrent { get; set; }
        public int CurrentToFringe { get; set; }
        public int StartToFringe { get; set; }
        public int LoopCounter { get; set; }
        public bool WillUpdate { get; set; }

        public int DisplayVertex { get; set; }
        public int DisplayEdge1 { get; set; }
        public int DisplayEdge2 { get; set; }

        public string Note { get; set; }
        public string OldNote { get; set; }
        public bool ShowAdjm { get; set; }
        public int OpMode { get; set; } // 0: idle, 1: path in progress
        public int CodePart { get; set; } // 1 to 14
        public int DrawMode { get; set; }

        public int XStartDrag { get; set; }
        public int YStartDrag { get; set; }
        public bool MadeVertex { get; set; }

        public VertexGroup()
        {
            Vertex.ClassChar = 'A';
            VertexList = new Vertex[MaxVerts];
            SPath = new DisP[MaxVerts];
            AdjMat = new DisIs[MaxVerts, MaxVerts];
            NVerts = 0;
            Tree = new int[MaxVerts];
            NTree = 0;

            for (int i = 0; i < MaxVerts; i++)
            {
                for (int j = 0; j < MaxVerts; j++)
                {
                    AdjMat[i, j] = new DisIs(Infinity, false);
                }
            }

            ShowAdjm = false;
            StartingVertex = -1;
            Note = "Double-click mouse to make vertex";
            OldNote = "";
            DrawMode = 4;
            OpMode = 0;
            CodePart = 1;
        }

        public string DtoS(int dist)
        {
            if (dist >= Infinity) return "inf";
            return dist.ToString();
        }

        public void WarningNew()
        {
            Note = "ARE YOU SURE? Press again to clear old graph";
        }

        public int CloseTo(int x, int y)
        {
            const int threshold = 11;
            for (int i = 0; i < NVerts; i++)
            {
                if (Math.Abs(VertexList[i].X - x) < threshold && Math.Abs(VertexList[i].Y - y) < threshold)
                    return i;
            }
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            MadeVertex = true;
            if (NVerts >= MaxVerts)
            {
                Note = "CAN'T INSERT more vertices";
                return;
            }

            VertexList[NVerts] = new Vertex(x, y);
            Note = "Made vertex " + VertexList[NVerts].Label;
            DisplayVertex = NVerts;
            NVerts++;
            OpMode = 0;
            DrawMode = 2;
        }

        public void StartDrag(int x, int y)
        {
            XStartDrag = x;
            YStartDrag = y;
            int vert = CloseTo(x, y);
            StartingVertex = vert;
            if (vert < 0)
                Note = "To make edge, drag from vertex to vertex";
            else
                Note = "Starting edge at vertex " + VertexList[vert].Label;
            DrawMode = 1;
        }

        public void EndDrag(bool isNumber, int weight, int x, int y)
        {
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
                    Note = "You clicked on " + VertexList[StartingVertex].Label;
                DrawMode = 1;
                return;
            }

            if (src < 0 || dest < 0 || src == dest)
            {
                Note = "CAN'T MAKE EDGE: Drag from vertex to vertex";
                DrawMode = 1;
                return;
            }

            if (!isNumber || weight < 0 || weight > MaxWeight)
            {
                Note = "CAN'T MAKE EDGE: Enter a weight (0 to " + MaxWeight + ")";
                DrawMode = 1;
                return;
            }

            AdjMat[src, dest].Distance = weight;
            MadeVertex = false;
            DisplayEdge1 = src;
            DisplayEdge2 = dest;
            Note = "Made edge from " + VertexList[src].Label + " to " + VertexList[dest].Label + " with weight " + weight;
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
                if (NVerts == 0)
                    Note = "No vertices; adjacency matrix is empty";
                else
                    Note = "Press View button again to show graph";
                ShowAdjm = true;
                DrawMode = 4;
            }
        }

        public void Path()
        {
            if (NVerts == 0) return;

            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Single-click on starting vertex";
                    StartingVertex = -1;
                    DrawMode = 1;
                    CodePart = 2;
                    break;

                case 2:
                    if (StartingVertex == -1)
                    {
                        Note = "INVALID VERTEX";
                        CodePart = 1;
                    }
                    else
                    {
                        StartTree = StartingVertex;
                        Note = "Starting from vertex " + VertexList[StartTree].Label;
                        CodePart = 3;
                    }
                    DrawMode = 1;
                    break;

                case 3:
                    VertexList[StartTree].IsInTree = true;
                    Tree[0] = StartTree;
                    NTree = 1;
                    Note = "Added vertex " + VertexList[StartTree].Label + " to tree";
                    DisplayVertex = StartTree;
                    DrawMode = 2;
                    CodePart = 4;
                    break;

                case 4:
                    for (int i = 0; i < NVerts; i++)
                    {
                        int d = AdjMat[StartTree, i].Distance;
                        SPath[i] = new DisP(StartTree, d);
                    }
                    Note = "Copied row " + VertexList[StartTree].Label + " from adjacency matrix to shortest-path array";
                    DrawMode = 1;
                    CodePart = 5;
                    break;

                case 5:
                    int minDist = Infinity;
                    int minVert = 0;
                    for (int i = 0; i < NVerts; i++)
                    {
                        if (!VertexList[i].IsInTree)
                        {
                            if (SPath[i].Distance < minDist)
                            {
                                minDist = SPath[i].Distance;
                                minVert = i;
                            }
                        }
                    }

                    if (minDist == Infinity)
                    {
                        Note = "One or more vertices are UNREACHABLE";
                        CodePart = 12;
                    }
                    else
                    {
                        CurrentDest = minVert;
                        CurrentSrc = SPath[minVert].ParentVert;
                        StartToCurrent = SPath[minVert].Distance;
                        Note = "Minimum distance from " + VertexList[StartTree].Label + " is " + StartToCurrent + ", to vertex " + VertexList[CurrentDest].Label;
                        CodePart = 6;
                    }
                    DrawMode = 1;
                    break;

                case 6:
                    VertexList[CurrentDest].IsInTree = true;
                    Tree[NTree++] = CurrentDest;
                    Note = "Added vertex " + VertexList[CurrentDest].Label + " to tree";
                    AdjMat[CurrentSrc, CurrentDest].IsInTree = true;
                    DisplayEdge1 = CurrentSrc;
                    DisplayEdge2 = CurrentDest;

                    if (NTree == NVerts)
                        CodePart = 12;
                    else
                    {
                        LoopCounter = 0;
                        CodePart = 7;
                    }
                    DrawMode = 3;
                    break;

                case 7:
                    Note = "Will adjust values in shortest-path array";
                    DrawMode = 1;
                    CodePart = 8;
                    break;

                case 8:
                    while (LoopCounter < NVerts && VertexList[LoopCounter].IsInTree)
                    {
                        LoopCounter++;
                    }

                    if (LoopCounter == NVerts)
                    {
                        Note = "Finished all entries in shortest-path array";
                        CodePart = 5;
                    }
                    else
                    {
                        Note = "Will compare distances for column " + VertexList[LoopCounter].Label;
                        CodePart = 9;
                    }
                    DrawMode = 1;
                    break;

                case 9:
                    CurrentToFringe = AdjMat[CurrentDest, LoopCounter].Distance;
                    StartToFringe = StartToCurrent + CurrentToFringe;
                    int sPathDist = SPath[LoopCounter].Distance;

                    string str = "";
                    if (StartToFringe < sPathDist)
                    {
                        str = " less than ";
                        WillUpdate = true;
                    }
                    else
                    {
                        str = " greater than or equal to ";
                        WillUpdate = false;
                    }

                    char sLabel = VertexList[StartTree].Label;
                    char cLabel = VertexList[CurrentDest].Label;
                    char fLabel = VertexList[LoopCounter].Label;

                    Note = "To " + fLabel + ":  " + sLabel + " to " + cLabel + " (" + DtoS(StartToCurrent) + ") plus edge " + cLabel + fLabel + " (" + DtoS(CurrentToFringe) + ") " + str + sLabel + " to " + fLabel + " (" + DtoS(sPathDist) + ")";
                    CodePart = 10;
                    DrawMode = 1;
                    break;

                case 10:
                    if (WillUpdate)
                    {
                        SPath[LoopCounter].ParentVert = CurrentDest;
                        SPath[LoopCounter].Distance = StartToFringe;
                        Note = "Updated array column " + VertexList[LoopCounter].Label;
                    }
                    else
                    {
                        Note = "No need to update array column " + VertexList[LoopCounter].Label;
                    }
                    DrawMode = 1;
                    CodePart = 11;
                    break;

                case 11:
                    LoopCounter++;
                    if (LoopCounter < NVerts)
                    {
                        Note = "Will examine next non-tree column";
                        CodePart = 8;
                    }
                    else
                    {
                        Note = "Done all entries in shortest-path array";
                        CodePart = 5;
                    }
                    DrawMode = 1;
                    break;

                case 12:
                    Note = "All shortest paths from " + VertexList[StartTree].Label + " found; distances in array";
                    CodePart = 13;
                    DrawMode = 1;
                    break;

                case 13:
                    Note = "Press again to reset paths";
                    CodePart = 14;
                    DrawMode = 1;
                    break;

                case 14:
                    NTree = 0;
                    for (int i = 0; i < NVerts; i++)
                    {
                        VertexList[i].IsInTree = false;
                        for (int j = 0; j < NVerts; j++)
                            AdjMat[i, j].IsInTree = false;
                    }
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    DrawMode = 4;
                    break;
            }
        }

        public void Draw(Graphics g)
        {
            if (ShowAdjm)
            {
                g.FillRectangle(Brushes.Yellow, 0, 0, AppletWidth, AppletHeight);
                g.DrawString(Note, new Font("Arial", 9, FontStyle.Bold), Brushes.Black, 16, 64);
                DrawAdjm(g);
                return;
            }

            // Light gray background
            g.FillRectangle(SystemBrushes.Control, 0, 0, AppletWidth, AppletHeight);

            // Note Box
            g.FillRectangle(Brushes.White, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            g.DrawRectangle(Pens.Gray, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            g.DrawString(Note, new Font("Arial", 9, FontStyle.Bold), Brushes.Black, 16, 52);

            // Drawing Area border
            g.DrawRectangle(Pens.Black, 2, 71, 436, DrawingBoxHeight);

            // Edges
            for (int i = 0; i < NVerts; i++)
            {
                for (int j = 0; j < NVerts; j++)
                {
                    if (AdjMat[i, j].Distance < Infinity)
                    {
                        DrawEdge(g, i, j);
                    }
                }
            }

            // Vertices
            for (int i = 0; i < NVerts; i++)
            {
                DrawOneVertex(g, i);
            }

            // Bottom Shortest-Path array
            g.FillRectangle(Brushes.White, LeftMargin, VisitBoxTop, VisitBoxWidth, VisitBoxHeight);
            g.DrawRectangle(Pens.Gray, LeftMargin, VisitBoxTop, VisitBoxWidth, VisitBoxHeight);

            if (OpMode == 1 && CodePart > 4)
            {
                for (int i = 0; i < NVerts; i++)
                {
                    if (SPath[i] != null)
                    {
                        int colX = 12 + CharSpace * i;
                        int dist = SPath[i].Distance;
                        int parent = SPath[i].ParentVert;
                        char pLabel = VertexList[parent] != null ? VertexList[parent].Label : '?';
                        string cellText = DtoS(dist) + "(" + pLabel + ")";

                        g.DrawLine(Pens.Black, colX, 303, colX + 35, 303);

                        Brush labelBrush = VertexList[i].IsInTree ? Brushes.Red : Brushes.Black;
                        g.DrawString(VertexList[i].Label.ToString(), new Font("Courier New", 9, FontStyle.Bold), labelBrush, colX + 4, 288);
                        g.DrawString(cellText, new Font("Courier New", 8, FontStyle.Regular), Brushes.Black, colX, 310);
                    }
                }
            }
        }

        private void DrawOneVertex(Graphics g, int vertIdx)
        {
            if (vertIdx < 0 || vertIdx >= NVerts) return;
            Vertex v = VertexList[vertIdx];
            int vx = v.X - 11;
            int vy = v.Y - 11;

            using (Brush brush = new SolidBrush(v.VertexColor))
            {
                g.FillEllipse(brush, vx, vy, VertexDiameter, VertexDiameter);
            }
            g.DrawEllipse(Pens.Black, vx, vy, VertexDiameter, VertexDiameter);

            if (v.IsInTree)
            {
                g.DrawEllipse(Pens.Red, vx - 3, vy - 3, 28, 28);
            }

            g.DrawString(v.Label.ToString(), new Font("Arial", 10, FontStyle.Bold), Brushes.Black, vx + 6, vy + 4);
        }

        private void DrawEdge(Graphics g, int src, int dest)
        {
            Vertex v1 = VertexList[src];
            Vertex v2 = VertexList[dest];

            Pen pen = AdjMat[src, dest].IsInTree ? new Pen(Color.Red, 3) : Pens.Black;
            g.DrawLine(pen, v1.X, v1.Y, v2.X, v2.Y);

            DrawDirection(g, v1.X, v1.Y, v2.X, v2.Y, AdjMat[src, dest].IsInTree);

            int midX = (v1.X + v2.X) / 2 - 8;
            int midY = (v1.Y + v2.Y) / 2 - 7;
            g.FillRectangle(Brushes.White, midX, midY, WeightBoxWidth, WeightBoxHeight);
            g.DrawRectangle(pen, midX, midY, WeightBoxWidth, WeightBoxHeight);

            string wStr = AdjMat[src, dest].Distance.ToString();
            int offX = wStr.Length > 1 ? 2 : 5;
            g.DrawString(wStr, new Font("Courier New", 8, FontStyle.Bold), Brushes.Black, midX + offX, midY + 1);
        }

        private void DrawDirection(Graphics g, int x1, int y1, int x2, int y2, bool inTree)
        {
            int dx = x1 - x2;
            int dy = y1 - y2;
            int len = (int)Math.Sqrt(dx * dx + dy * dy);
            if (len == 0) return;

            int ox = dx * DirDistance / len;
            int oy = dy * DirDistance / len;
            Brush brush = inTree ? Brushes.Red : Brushes.Black;
            g.FillEllipse(brush, x2 + ox - 3, y2 + oy - 3, DirSize, DirSize);
        }

        private void DrawAdjm(Graphics g)
        {
            if (NVerts == 0) return;

            int startX = 90;
            int startY = 106;
            int colW = 27;
            int rowH = 18;

            g.DrawLine(Pens.Black, startX - colW, startY - rowH + 4, startX + (NVerts - 1) * colW + 8, startY - rowH + 4);
            g.DrawLine(Pens.Black, startX - colW / 2 + 2, startY - 2 * rowH + 8, startX - colW / 2 + 2, startY + (NVerts - 1) * rowH);

            Font font = new Font("Courier New", 9, FontStyle.Bold);

            for (int c = 0; c < NVerts; c++)
            {
                g.DrawString(VertexList[c].Label.ToString(), font, Brushes.Black, startX + c * colW, startY - rowH - 4);
            }

            for (int r = 0; r < NVerts; r++)
            {
                g.DrawString(VertexList[r].Label.ToString(), font, Brushes.Black, startX - colW, startY + r * rowH - 4);

                for (int c = 0; c < NVerts; c++)
                {
                    string dStr = DtoS(AdjMat[r, c].Distance);
                    g.DrawString(dStr, font, Brushes.Black, startX + c * colW, startY + r * rowH - 4);
                }
            }
        }
    }
}
