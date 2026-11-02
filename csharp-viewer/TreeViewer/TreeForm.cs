using System;
using System.Drawing;
using System.Windows.Forms;

namespace TreeViewer
{
    public partial class TreeForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer runTimer;

        public TreeForm()
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

            switch (thePersonGroup.OpMode)
            {
                case 1: thePersonGroup.Fill(isNum, num); break;
                case 2: thePersonGroup.Find(isNum, num); break;
                case 3: thePersonGroup.Insert(isNum, num); break;
                case 4: thePersonGroup.Traverse(); break;
                case 5: thePersonGroup.Remove(isNum, num); break;
            }
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Nodes: {thePersonGroup.FilledNodes}/31 | Mode: {thePersonGroup.OpMode} | Step: {thePersonGroup.CodePart} | {thePersonGroup.Note}";
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Fill(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Find(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Insert(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnTrav_Click(object? sender, EventArgs e)
        {
            thePersonGroup.Traverse();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Remove(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (runTimer.Enabled)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                runTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            runTimer.Stop();
            btnRun.Text = "Run";
            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_MouseClick(object? sender, MouseEventArgs e)
        {
            for (int i = 0; i < PersonGroup.ASIZE; i++)
            {
                if (thePersonGroup.TreeArray[i] == null) continue;
                var coords = thePersonGroup.GetNodeCoords(i);
                int dx = e.X - (coords.x + 10);
                int dy = e.Y - (coords.y + 10);
                if (dx * dx + dy * dy <= 144)
                {
                    txtNumber.Text = thePersonGroup.TreeArray[i]!.GetHeight().ToString();
                    break;
                }
            }
        }
    }
}
