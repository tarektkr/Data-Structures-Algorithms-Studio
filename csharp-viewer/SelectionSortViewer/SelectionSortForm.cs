using System;
using System.Drawing;
using System.Windows.Forms;

namespace SelectionSortViewer
{
    /// <summary>
    /// نافذة العرض الرئيسية لتطبيق Selection Sort بلغة C# (Windows Forms)
    /// تجسد عارض الأبليت التفاعلي لـ روبرت لافور
    /// </summary>
    public partial class SelectionSortForm : Form
    {
        private GroupSS thePersonGroup;
        private readonly System.Windows.Forms.Timer sortTimer;
        private int currentSize = 10;
        private int currentOrder = 1;
        private bool isRunning = false;

        public SelectionSortForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new GroupSS(currentSize, currentOrder);

            sortTimer = new System.Windows.Forms.Timer
            {
                Interval = currentSize == 10 ? 250 : 75
            };
            sortTimer.Tick += SortTimer_Tick;

            UpdateUI();
        }

        private void SortTimer_Tick(object? sender, EventArgs e)
        {
            if (isRunning)
            {
                bool continues = thePersonGroup.SortStep();
                pnlCanvas.Invalidate();
                UpdateUI();

                if (!continues)
                {
                    isRunning = false;
                    sortTimer.Stop();
                    btnRun.Text = "Run";
                }
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentOrder = currentOrder == 1 ? 2 : 1;
            thePersonGroup = new GroupSS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnSize_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentSize = currentSize == 10 ? 100 : 10;
            sortTimer.Interval = currentSize == 10 ? 250 : 75;
            thePersonGroup = new GroupSS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDraw_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.DrawMode = 2;
            pnlCanvas.Invalidate();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (thePersonGroup.DoneFlag) return;

            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                sortTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                sortTimer.Stop();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.SortStep();
            thePersonGroup.DrawMode = 1;
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"الحجم: {currentSize} | الترتيب: {(currentOrder == 1 ? "عشوائي" : "معكوس")} | المقارنات: {thePersonGroup.Comps} | التبديلات: {thePersonGroup.Swaps}";
            btnNew.Text = $"New ({(currentOrder == 1 ? "Random" : "Inverse")})";
            btnSize.Text = $"Size ({currentSize})";
        }
    }
}
