using System;
using System.Drawing;
using System.Windows.Forms;

namespace HashViewer
{
    public partial class HashForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer runTimer;

        public HashForm()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();

            runTimer = new System.Windows.Forms.Timer
            {
                Interval = 350
            };
            runTimer.Tick += RunTimer_Tick;

            UpdateUI();
        }

        private void RunTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode == 0)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
                return;
            }

            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void ExecuteCurrentStep()
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Step(isNum, num);
        }

        private void UpdateUI()
        {
            double loadFactor = thePersonGroup.TotalCells > 0 
                ? (double)thePersonGroup.NPersons / thePersonGroup.TotalCells * 100.0 
                : 0.0;
            lblStatus.Text = string.Format("Cells: {0}/{1} (Load: {2:F1}%) | Mode: {3} | Step: {4} | {5}",
                thePersonGroup.NPersons,
                thePersonGroup.TotalCells,
                loadFactor,
                thePersonGroup.OpMode,
                thePersonGroup.CodePart,
                thePersonGroup.Note);
        }

        private void PnlCanvas_Paint(object sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartNew();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnFill_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartFill();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartInsert();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnFind_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartFind();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnDel_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartDelete();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnStep_Click(object sender, EventArgs e)
        {
            if (thePersonGroup.OpMode == 0) return;
            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnRun_Click(object sender, EventArgs e)
        {
            if (runTimer.Enabled)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                if (thePersonGroup.OpMode != 0)
                {
                    runTimer.Start();
                    btnRun.Text = "Pause";
                }
            }
        }
    }
}
