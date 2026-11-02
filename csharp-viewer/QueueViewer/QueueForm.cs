using System;
using System.Drawing;
using System.Windows.Forms;

namespace QueueViewer
{
    public partial class QueueForm : Form
    {
        private PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer autoTimer;
        private bool isRunning = false;

        public QueueForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();
            thePersonGroup.DoFill();

            autoTimer = new System.Windows.Forms.Timer { Interval = 350 };
            autoTimer.Tick += AutoTimer_Tick;

            UpdateUI();
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            thePersonGroup.NewQueue();
            this.Invalidate();
            UpdateUI();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            bool isNumber = int.TryParse(txtNumber.Text, out int key);
            thePersonGroup.Insert(isNumber, key);
            this.Invalidate();
            UpdateUI();
        }

        private void BtnRem_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Remove();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPeek_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Peek();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void AutoTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode != 0)
            {
                if (thePersonGroup.OpMode == 1) thePersonGroup.NewQueue();
                else if (thePersonGroup.OpMode == 2)
                {
                    bool isNumber = int.TryParse(txtNumber.Text, out int key);
                    thePersonGroup.Insert(isNumber, key);
                }
                else if (thePersonGroup.OpMode == 3)
                {
                    string ret = thePersonGroup.Remove();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                else if (thePersonGroup.OpMode == 4)
                {
                    string ret = thePersonGroup.Peek();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                this.Invalidate();
                UpdateUI();
            }
            else
            {
                autoTimer.Stop();
                isRunning = false;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Items: {thePersonGroup.NPersons}/10 | Front: {thePersonGroup.Front} | Rear: {thePersonGroup.Rear} | {thePersonGroup.Note}";
        }
    }
}
