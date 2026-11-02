using System;
using System.Drawing;
using System.Windows.Forms;

namespace HashChainViewer
{
    /// <summary>
    /// نافذة عرض تفاعلية لجدول الهاش بالسلاسل المنفصلة (Separate-Chaining Hash Table Viewer).
    /// تحاكي مظهر وطريقة عمل بريمج روبرت لافور الأصلي لعام 1998 باستخدام Windows Forms و GDI+.
    /// </summary>
    public partial class HashChainForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public HashChainForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(25);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 350
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateScrollbar();
            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMore = thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();

            if (!hasMore)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
        }

        private (bool isNum, int val) ParseInput()
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int v))
            {
                return (true, v);
            }
            return (false, 0);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartNew(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFill(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartInsert(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                animTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void VScrollBar_Scroll(object? sender, ScrollEventArgs e)
        {
            thePersonGroup.TopDisplayLine = vScrollBar.Value;
            pnlCanvas.Invalidate();
        }

        private void UpdateScrollbar()
        {
            int maxScroll = Math.Max(0, thePersonGroup.TotalBuckets - PersonGroup.LINES_IN_VIEW);
            vScrollBar.Maximum = maxScroll + vScrollBar.LargeChange - 1;
            vScrollBar.Value = Math.Max(0, Math.min(maxScroll, thePersonGroup.TopDisplayLine));
        }

        private void UpdateStatus()
        {
            lblStatus.Text = $"Buckets: {thePersonGroup.TotalBuckets} | Items: {thePersonGroup.NPersons} | Load Factor: {(thePersonGroup.TotalBuckets > 0 ? (double)thePersonGroup.NPersons / thePersonGroup.TotalBuckets : 0):0.00}";
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.Clear(Color.LightGray);

            // 1. Note box at top
            using (var brush = new SolidBrush(Color.FromArgb(212, 208, 200)))
            {
                g.FillRectangle(brush, 10, 45, 320, 25);
            }
            g.DrawRectangle(Pens.Gray, 10, 45, 320, 25);

            using (var font = new Font("Courier New", 9f, FontStyle.Bold))
            {
                g.DrawString(thePersonGroup.Note, font, Brushes.Black, 16, 51);
            }

            // 2. Visible buckets
            int startList = thePersonGroup.TopDisplayLine;
            int endList = Math.Min(thePersonGroup.TotalBuckets, startList + PersonGroup.LINES_IN_VIEW);

            for (int list = startList; list < endList; list++)
            {
                int row = list - startList;
                int baseY = 79 + 24 * row;
                var bucket = thePersonGroup.BucketArray[list];

                bool isCurList = list == thePersonGroup.CurList && thePersonGroup.OpMode != PersonGroup.OperationMode.Idle;

                // Bucket number
                using (var numFont = new Font("SansSerif", 8f, FontStyle.Bold))
                {
                    Brush numBrush = isCurList ? Brushes.Red : Brushes.Black;
                    g.DrawString(list.ToString(), numFont, numBrush, 5, baseY - 3);
                }

                if (bucket.NLinks == 0)
                {
                    // Empty head
                    int cellX = 33;
                    int cellY = baseY - 5;
                    using (var br = new SolidBrush(Color.FromArgb(212, 208, 200)))
                    {
                        g.FillRectangle(br, cellX, cellY, 35, 17);
                    }
                    g.DrawRectangle(Pens.Gray, cellX, cellY, 35, 17);

                    using (var italicFont = new Font("SansSerif", 7f, FontStyle.Italic))
                    {
                        g.DrawString("null", italicFont, Brushes.DarkGray, cellX + 7, cellY + 3);
                    }

                    if (isCurList && thePersonGroup.CurLink == 0)
                    {
                        DrawArrow(g, cellX, cellY);
                    }
                }
                else
                {
                    for (int link = 0; link < bucket.NLinks; link++)
                    {
                        var item = bucket.LinkArray[link];
                        if (item == null) continue;

                        int cellX = 33 + link * 60;
                        int cellY = baseY - 5;

                        // Connection arrow from previous
                        if (link > 0)
                        {
                            int prevRight = 33 + (link - 1) * 60 + 35;
                            int arrY = baseY + 3;
                            g.DrawLine(Pens.Black, prevRight, arrY, cellX, arrY);
                            g.FillPolygon(Brushes.Black, new Point[]
                            {
                                new Point(cellX, arrY),
                                new Point(cellX - 5, arrY - 3),
                                new Point(cellX - 5, arrY + 3)
                            });
                        }

                        // Cell body
                        using (var b = new SolidBrush(item.PersData.Color))
                        {
                            g.FillRectangle(b, cellX, cellY, 35, 17);
                        }
                        ControlPaint.DrawBorder3D(g, cellX, cellY, 35, 17, Border3DStyle.Raised);

                        // Key
                        using (var keyFont = new Font("Courier New", 8f, FontStyle.Bold))
                        {
                            g.DrawString(item.PersData.Height.ToString(), keyFont, Brushes.Black, cellX + 6, cellY + 3);
                        }

                        if (isCurList && thePersonGroup.CurLink == link)
                        {
                            DrawArrow(g, cellX, cellY);
                        }
                    }
                }
            }
        }

        private void DrawArrow(Graphics g, int cellX, int cellY)
        {
            int tipX = cellX + 17;
            int tipY = cellY - 2;
            using (var pen = new Pen(Color.Red, 2))
            {
                g.DrawLine(pen, tipX, tipY - 12, tipX, tipY);
            }
            g.FillPolygon(Brushes.Red, new Point[]
            {
                new Point(tipX, tipY),
                new Point(tipX - 4, tipY - 5),
                new Point(tipX + 4, tipY - 5)
            });
        }
    }
}
