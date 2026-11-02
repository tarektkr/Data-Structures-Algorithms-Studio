using System;
using System.Drawing;
using System.Windows.Forms;

namespace MergeSortViewer
{
    public partial class MergeSortForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public MergeSortForm()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(12, 1);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 250
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateUI();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMore = thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();

            if (!hasMore)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Status: {thePersonGroup.Note} | Comparisons: {thePersonGroup.Comparisons} | Copies: {thePersonGroup.Copies}";
            lblOrder.Text = thePersonGroup.InitOrder == 1 ? "Order: Random" : "Order: Inverse";
            lblSize.Text = $"Bars: {thePersonGroup.Size}";
        }

        private void btnNew_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleOrder();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnSize_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleSize();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnDraw_Click(object? sender, EventArgs e)
        {
            pnlCanvas.Invalidate();
        }

        private void btnRun_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                if (thePersonGroup.IsDone)
                {
                    thePersonGroup.InitBars();
                }
                animTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void btnStep_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void pnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void tbSpeed_Scroll(object? sender, EventArgs e)
        {
            animTimer.Interval = Math.Max(20, tbSpeed.Value);
        }
    }
}
