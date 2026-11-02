using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace GraphViewer
{
    public partial class GraphForm : Form
    {
        private readonly VertexGroup _graph;
        private bool _isRunning;

        public GraphForm()
        {
            InitializeComponent();
            _graph = new VertexGroup();
            _graph.LoadSampleGraph();
            DoubleBuffered = true;
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.WarningNew();
            canvasPanel.Invalidate();
        }

        private void BtnDFS_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartDFS(0);
            canvasPanel.Invalidate();
        }

        private void BtnBFS_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartBFS(0);
            canvasPanel.Invalidate();
        }

        private void BtnTree_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartTree(0);
            canvasPanel.Invalidate();
        }

        private void BtnView_Click(object? sender, EventArgs e)
        {
            _graph.ChangeView();
            canvasPanel.Invalidate();
        }

        private void BtnSample_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.LoadSampleGraph();
            canvasPanel.Invalidate();
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            StepCurrent();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (_graph.OpMode == "idle")
            {
                _graph.StartDFS(0);
            }

            _isRunning = !_isRunning;
            if (_isRunning)
            {
                btnRun.Text = "Pause";
                animTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                animTimer.Stop();
            }
        }

        private void StepCurrent()
        {
            bool done = false;
            if (_graph.OpMode == "dfs")
            {
                done = _graph.StepDFS();
            }
            else if (_graph.OpMode == "bfs")
            {
                done = _graph.StepBFS();
            }
            else if (_graph.OpMode == "tree")
            {
                done = _graph.StepTree();
            }

            if (done)
            {
                _isRunning = false;
                btnRun.Text = "Run";
                animTimer.Stop();
            }
            canvasPanel.Invalidate();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            StepCurrent();
        }

        private void CanvasPanel_MouseDown(object? sender, MouseEventArgs e)
        {
            _graph.StartDrag(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseMove(object? sender, MouseEventArgs e)
        {
            if (_graph.IsDragging)
            {
                _graph.UpdateDrag(e.X, e.Y);
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseUp(object? sender, MouseEventArgs e)
        {
            if (_graph.IsDragging)
            {
                _graph.EndDrag(e.X, e.Y);
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseDoubleClick(object? sender, MouseEventArgs e)
        {
            _graph.MakeVertex(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object? sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            int width = canvasPanel.Width;
            int height = canvasPanel.Height;

            // ==========================================
            // 1. Adjacency Matrix View
            // ==========================================
            if (_graph.ShowAdjm)
            {
                g.Clear(Color.FromArgb(255, 255, 153)); // Classic yellow

                using var noteFont = new Font("SansSerif", 10, FontStyle.Bold);
                g.DrawString(_graph.Note, noteFont, Brushes.Black, 16, 15);

                if (_graph.NVerts > 0)
                {
                    int startX = 85;
                    int startY = 60;
                    int colWidth = 24;
                    int rowHeight = 20;

                    // Lines
                    g.DrawLine(Pens.Black, startX - colWidth, startY - rowHeight + 4, startX + (_graph.NVerts - 1) * colWidth + 12, startY - rowHeight + 4);
                    g.DrawLine(Pens.Black, startX - colWidth / 2 + 2, startY - 2 * rowHeight + 8, startX - colWidth / 2 + 2, startY + (_graph.NVerts - 1) * rowHeight);

                    using var mFont = new Font("Courier New", 10, FontStyle.Bold);
                    var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

                    // Column headers
                    for (int c = 0; c < _graph.NVerts; c++)
                    {
                        g.DrawString(_graph.VertexList[c].Label.ToString(), mFont, Brushes.Black, startX + c * colWidth, startY - rowHeight, sf);
                    }

                    // Row headers and values (0 or 1)
                    for (int r = 0; r < _graph.NVerts; r++)
                    {
                        g.DrawString(_graph.VertexList[r].Label.ToString(), mFont, Brushes.Black, startX - colWidth, startY + r * rowHeight, sf);
                        for (int c = 0; c < _graph.NVerts; c++)
                        {
                            bool hasEdge = _graph.AdjMat[r, c] == 1;
                            Brush b = hasEdge ? Brushes.Crimson : Brushes.SlateGray;
                            g.DrawString(hasEdge ? "1" : "0", mFont, b, startX + c * colWidth, startY + r * rowHeight, sf);
                        }
                    }
                }
                return;
            }

            // ==========================================
            // 2. Normal Graph View
            // ==========================================
            g.Clear(Color.FromArgb(192, 192, 192));

            // Note Banner
            g.FillRectangle(Brushes.White, 5, 10, width - 10, 24);
            g.DrawRectangle(Pens.Gray, 5, 10, width - 10, 24);
            using (var font = new Font("SansSerif", 9, FontStyle.Bold))
            {
                g.DrawString(_graph.Note, font, Brushes.Black, 10, 15);
            }

            // Drawing Area Box
            int boxTop = 40;
            int boxHeight = 220;
            g.FillRectangle(Brushes.WhiteSmoke, 5, boxTop, width - 10, boxHeight);
            g.DrawRectangle(Pens.Black, 5, boxTop, width - 10, boxHeight);

            // Draw Edges
            for (int i = 0; i < _graph.NVerts; i++)
            {
                for (int j = i + 1; j < _graph.NVerts; j++)
                {
                    if (_graph.AdjMat[i, j] == 1)
                    {
                        var v1 = _graph.VertexList[i];
                        var v2 = _graph.VertexList[j];

                        bool inTree = _graph.TreeEdges.Exists(te => (te.V1 == i && te.V2 == j) || (te.V1 == j && te.V2 == i));
                        using var pen = new Pen(inTree ? Color.Red : Color.FromArgb(50, 60, 80), inTree ? 3 : 1.5f);
                        g.DrawLine(pen, v1.X, v1.Y, v2.X, v2.Y);
                    }
                }
            }

            // Draw Active Dragging Edge Preview
            if (_graph.IsDragging)
            {
                using var dashPen = new Pen(Color.DodgerBlue, 2f) { DashStyle = DashStyle.Dash };
                g.DrawLine(dashPen, _graph.DragStartPos, _graph.DragCurrentPos);
            }

            // Draw Vertices
            const int diameter = 22;
            const int radius = 11;
            using var vFont = new Font("Courier New", 10, FontStyle.Bold);
            var centerSf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

            for (int i = 0; i < _graph.NVerts; i++)
            {
                var v = _graph.VertexList[i];

                // Visited / Tree outer ring
                if (v.WasVisited)
                {
                    using var ringPen = new Pen(v.IsInTree ? Color.Red : Color.ForestGreen, 2.5f);
                    g.DrawEllipse(ringPen, v.X - radius - 3, v.Y - radius - 3, diameter + 6, diameter + 6);
                }

                // Fill vertex
                using var brush = new SolidBrush(v.Color);
                g.FillEllipse(brush, v.X - radius, v.Y - radius, diameter, diameter);
                g.DrawEllipse(Pens.Black, v.X - radius, v.Y - radius, diameter, diameter);

                // Vertex label (centered)
                g.DrawString(v.Label.ToString(), vFont, Brushes.Black, v.X + 1, v.Y, centerSf);
            }

            // Bottom Status Box
            int barY = 270;
            int barHeight = 45;
            g.FillRectangle(Brushes.White, 5, barY, width - 10, barHeight);
            g.DrawRectangle(Pens.Gray, 5, barY, width - 10, barHeight);

            using var barFont = new Font("Courier New", 9, FontStyle.Regular);
            using var boldFont = new Font("Courier New", 9, FontStyle.Bold);

            if (_graph.OpMode == "dfs")
            {
                string visitStr = string.Join(" ", _graph.VisitList.ConvertAll(idx => _graph.VertexList[idx].Label));
                string stackStr = string.Join(" ", Array.ConvertAll(_graph.TheStack.ToArray(), idx => _graph.VertexList[idx].Label));
                g.DrawString($"DFS Visit: {visitStr}", boldFont, Brushes.Black, 10, barY + 5);
                g.DrawString($"Stack: [ {stackStr} ]", barFont, Brushes.Purple, 10, barY + 24);
            }
            else if (_graph.OpMode == "bfs")
            {
                string visitStr = string.Join(" ", _graph.VisitList.ConvertAll(idx => _graph.VertexList[idx].Label));
                string queueStr = string.Join(" ", Array.ConvertAll(_graph.TheQueue.ToArray(), idx => _graph.VertexList[idx].Label));
                g.DrawString($"BFS Visit: {visitStr}", boldFont, Brushes.Black, 10, barY + 5);
                g.DrawString($"Queue: [ {queueStr} ]", barFont, Brushes.Navy, 10, barY + 24);
            }
            else if (_graph.OpMode == "tree")
            {
                string edgesStr = string.Join(" ", _graph.TreeEdges.ConvertAll(e => $"{_graph.VertexList[e.V1].Label}{_graph.VertexList[e.V2].Label}"));
                g.DrawString($"Spanning Tree: {edgesStr}", boldFont, Brushes.Red, 10, barY + 5);
                g.DrawString($"Total Tree Edges = {_graph.TreeEdges.Count} (Vertices = {_graph.NVerts})", barFont, Brushes.Black, 10, barY + 24);
            }
            else
            {
                g.DrawString($"Vertices: {_graph.NVerts}/{VertexGroup.MAX_VERTS} | Press DFS, BFS, or Tree to explore", barFont, Brushes.DarkSlateGray, 10, barY + 14);
            }
        }
    }
}
