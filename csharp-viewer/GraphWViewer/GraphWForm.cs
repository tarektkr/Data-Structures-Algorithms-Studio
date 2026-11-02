using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace GraphWViewer
{
    public partial class GraphWForm : Form
    {
        private readonly VertexGroup _group;
        private bool _isRunning = false;

        public GraphWForm()
        {
            InitializeComponent();
            _group = new VertexGroup();
            _group.LoadSampleGraph();
            canvasPanel.DoubleBuffered(true);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            _group.WarningNew();
            canvasPanel.Invalidate();
        }

        private void BtnTree_Click(object? sender, EventArgs e)
        {
            _group.Mst();
            canvasPanel.Invalidate();
        }

        private void BtnView_Click(object? sender, EventArgs e)
        {
            _group.ChangeView();
            btnView.Text = _group.ShowAdjm ? "Matrix" : "Graph";
            canvasPanel.Invalidate();
        }

        private void BtnSample_Click(object? sender, EventArgs e)
        {
            _group.LoadSampleGraph();
            canvasPanel.Invalidate();
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            _group.Mst();
            canvasPanel.Invalidate();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            _isRunning = !_isRunning;
            btnRun.Text = _isRunning ? "Pause" : "Run";
            if (_isRunning)
            {
                if (_group.OpMode == 0) _group.Mst();
                animTimer.Start();
            }
            else
            {
                animTimer.Stop();
            }
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            if (_group.OpMode == 1)
            {
                _group.Mst();
                canvasPanel.Invalidate();
                if (_group.OpMode == 0)
                {
                    _isRunning = false;
                    btnRun.Text = "Run";
                    animTimer.Stop();
                }
            }
            else
            {
                _isRunning = false;
                btnRun.Text = "Run";
                animTimer.Stop();
            }
        }

        private void CanvasPanel_MouseDown(object sender, MouseEventArgs e)
        {
            if (_group.OpMode == 1 && _group.CodePart == 1)
            {
                int clicked = _group.CloseTo(e.X, e.Y);
                if (clicked >= 0)
                {
                    _group.StartingVertex = clicked;
                    _group.Note = $"You clicked on {_group.VertexList[clicked].Label}";
                }
                else
                {
                    _group.StartingVertex = -1;
                    _group.Note = "Click on a VERTEX";
                }
                _group.DrawMode = 1;
                canvasPanel.Invalidate();
                return;
            }

            _group.StartDrag(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseMove(object sender, MouseEventArgs e)
        {
            if (_group.IsDragging)
            {
                _group.CurrentDragX = e.X;
                _group.CurrentDragY = e.Y;
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseUp(object sender, MouseEventArgs e)
        {
            if (_group.IsDragging)
            {
                bool isNum = int.TryParse(txtNumber.Text.Trim(), out int w);
                _group.EndDrag(isNum, isNum ? w : -1, e.X, e.Y);
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            _group.MakeVertex(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            int width = canvasPanel.Width;
            int height = canvasPanel.Height;

            // 1. Matrix View
            if (_group.ShowAdjm)
            {
                using var yellowBrush = new SolidBrush(Color.FromArgb(255, 255, 153));
                g.FillRectangle(yellowBrush, 0, 0, width, height);

                using var font = new Font("Courier New", 9f, FontStyle.Bold);
                using var textBrush = new SolidBrush(Color.Black);
                g.DrawString(_group.Note, font, textBrush, 16, 64);

                if (_group.NVerts == 0) return;

                int startX = 40;
                int startY = 85;
                int cellW = 28;
                int cellH = 17;

                using var headBrush = new SolidBrush(Color.Navy);
                for (int j = 0; j < _group.NVerts; j++)
                {
                    g.DrawString(_group.VertexList[j].Label.ToString(), font, headBrush, startX + (j + 1) * cellW + 4, startY);
                }

                for (int i = 0; i < _group.NVerts; i++)
                {
                    int y = startY + (i + 1) * cellH;
                    g.DrawString(_group.VertexList[i].Label.ToString(), font, headBrush, startX, y);

                    for (int j = 0; j < _group.NVerts; j++)
                    {
                        int x = startX + (j + 1) * cellW;
                        int dist = _group.AdjMat[i, j].Distance;
                        string dStr = VertexGroup.DtoS(dist);

                        using var cellBrush = new SolidBrush(dStr == "inf" ? Color.Gray : (_group.AdjMat[i, j].IsInTree ? Color.Red : Color.Black));
                        g.DrawString(dStr, font, cellBrush, x + 2, y);
                    }
                }
                return;
            }

            // 2. Normal View
            using (var bgBrush = new SolidBrush(Color.FromArgb(212, 212, 212)))
                g.FillRectangle(bgBrush, 0, 0, width, height);

            // Note Box
            using (var noteBg = new SolidBrush(Color.White))
                g.FillRectangle(noteBg, 10, 42, 420, 24);
            using (var noteBorder = new Pen(Color.FromArgb(148, 163, 184)))
                g.DrawRectangle(noteBorder, 10, 42, 420, 24);

            using (var noteFont = new Font("Courier New", 9f, FontStyle.Bold))
            using (var noteTextBrush = new SolidBrush(Color.Black))
                g.DrawString(_group.Note, noteFont, noteTextBrush, 16, 47);

            // Drawing Area Box
            using (var drawBg = new SolidBrush(Color.FromArgb(220, 220, 220)))
                g.FillRectangle(drawBg, 11, 71, 418, 202);
            using (var drawBorder = new Pen(Color.FromArgb(100, 116, 139)))
                g.DrawRectangle(drawBorder, 10, 70, 420, 204);

            // Edges
            for (int i = 0; i < _group.NVerts; i++)
            {
                for (int j = i + 1; j < _group.NVerts; j++)
                {
                    var cell = _group.AdjMat[i, j];
                    if (cell.Distance < VertexGroup.INFINITY)
                    {
                        var v1 = _group.VertexList[i];
                        var v2 = _group.VertexList[j];

                        bool inTree = cell.IsInTree;
                        using var pen = new Pen(inTree ? Color.Red : Color.Black, inTree ? 3f : 1.5f);
                        g.DrawLine(pen, v1.X, v1.Y, v2.X, v2.Y);

                        // Center Badge
                        int midX = (v1.X + v2.X) / 2;
                        int midY = (v1.Y + v2.Y) / 2;
                        int bw = VertexGroup.WeightBoxWidth;
                        int bh = VertexGroup.WeightBoxHeight;

                        using var badgeBg = new SolidBrush(Color.White);
                        g.FillRectangle(badgeBg, midX - bw / 2, midY - bh / 2, bw, bh);
                        using var badgeBorder = new Pen(inTree ? Color.Red : Color.Black);
                        g.DrawRectangle(badgeBorder, midX - bw / 2, midY - bh / 2, bw, bh);

                        using var badgeFont = new Font("Courier New", 8f, FontStyle.Bold);
                        using var badgeTextBrush = new SolidBrush(inTree ? Color.Red : Color.Black);
                        var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                        g.DrawString(cell.Distance.ToString(), badgeFont, badgeTextBrush, new RectangleF(midX - bw / 2, midY - bh / 2, bw, bh), sf);
                    }
                }
            }

            // Dragging dashed line
            if (_group.IsDragging)
            {
                using var dragPen = new Pen(Color.Blue, 2f) { DashStyle = DashStyle.Dash };
                g.DrawLine(dragPen, _group.XStartDrag, _group.YStartDrag, _group.CurrentDragX, _group.CurrentDragY);
            }

            // Vertices
            for (int i = 0; i < _group.NVerts; i++)
            {
                var v = _group.VertexList[i];
                int r = VertexGroup.VertexDiameter / 2;

                if (v.IsInTree)
                {
                    using var ringPen = new Pen(Color.Red, 2.5f);
                    g.DrawEllipse(ringPen, v.X - r - 4, v.Y - r - 4, (r + 4) * 2, (r + 4) * 2);
                }

                using var vBrush = new SolidBrush(v.Color);
                g.FillEllipse(vBrush, v.X - r, v.Y - r, r * 2, r * 2);

                using var vPen = new Pen(Color.Black, 1.5f);
                g.DrawEllipse(vPen, v.X - r, v.Y - r, r * 2, r * 2);

                using var vFont = new Font("Courier New", 10f, FontStyle.Bold);
                using var vTextBrush = new SolidBrush(Color.Black);
                var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                g.DrawString(v.Label.ToString(), vFont, vTextBrush, new RectangleF(v.X - r, v.Y - r, r * 2, r * 2), sf);
            }

            // Bottom Bar: Tree and PQ
            using (var botBg = new SolidBrush(Color.White))
                g.FillRectangle(botBg, 10, 278, 420, 36);
            using (var botBorder = new Pen(Color.FromArgb(148, 163, 184)))
                g.DrawRectangle(botBorder, 10, 278, 420, 36);

            using var botFont = new Font("Courier New", 9f, FontStyle.Bold);

            // Left: Tree
            string treeStr = "Tree: ";
            for (int i = 0; i < _group.NTree; i++)
            {
                treeStr += _group.VertexList[_group.Tree[i]].Label + " ";
            }
            using (var treeBrush = new SolidBrush(Color.Red))
                g.DrawString(treeStr, botFont, treeBrush, 16, 288);

            // Right: PQ
            string pqStr = "PQ: ";
            var pqList = _group.ThePQ.ToList();
            for (int k = 0; k < pqList.Count; k++)
            {
                var eItem = pqList[k];
                pqStr += $"{_group.VertexList[eItem.SrcVert].Label}{_group.VertexList[eItem.DestVert].Label}{eItem.Distance} ";
            }
            using (var pqBrush = new SolidBrush(Color.FromArgb(30, 58, 138)))
                g.DrawString(pqStr, botFont, pqBrush, 200, 288);
        }
    }

    public static class ControlExtensions
    {
        public static void DoubleBuffered(this Control control, bool enable)
        {
            var prop = typeof(Control).GetProperty("DoubleBuffered", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
            prop?.SetValue(control, enable, null);
        }
    }
}
