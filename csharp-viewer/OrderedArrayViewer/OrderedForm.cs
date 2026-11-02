using System;
using System.Drawing;
using System.Windows.Forms;

namespace OrderedArrayViewer
{
    public partial class OrderedForm : Form
    {
        private readonly OrderedPersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public OrderedForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new OrderedPersonGroup(60);

            animTimer = new System.Windows.Forms.Timer { Interval = 250 };
            animTimer.Tick += AnimTimer_Tick;

            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMoreSteps = false;

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Find)
            {
                hasMoreSteps = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Ins)
            {
                hasMoreSteps = thePersonGroup.StepInsert();
            }
            else if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Del)
            {
                hasMoreSteps = thePersonGroup.StepDelete();
            }

            pnlCanvas.Invalidate();
            UpdateStatus();

            if (!hasMoreSteps)
            {
                animTimer.Stop();
                SetControlsEnabled(true);
            }
        }

        private (bool isNumber, int value) ParseInput()
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int val))
            {
                return (true, val);
            }
            return (false, 0);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.NewArray(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.Fill(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartInsert(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Ins)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Find)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Del)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void RbLinear_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbLinear.Checked)
            {
                thePersonGroup.SetSearchType(true);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void RbBinary_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbBinary.Checked)
            {
                thePersonGroup.SetSearchType(false);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            thePersonGroup.Draw(e.Graphics);
        }

        private void SetControlsEnabled(bool enabled)
        {
            btnNew.Enabled = enabled;
            btnFill.Enabled = enabled;
            btnIns.Enabled = enabled;
            btnFind.Enabled = enabled;
            btnDel.Enabled = enabled;
            txtNumber.Enabled = enabled;
            rbLinear.Enabled = enabled;
            rbBinary.Enabled = enabled;
        }

        private void UpdateStatus()
        {
            lblStatusText.Text = $"الحالة: {thePersonGroup.Note} | عدد العناصر: {thePersonGroup.NPersons} / {thePersonGroup.TotalCells}";
        }
    }
}
