using System;
using System.Drawing;
using System.Windows.Forms;

namespace StackViewer
{
    /// <summary>
    /// نافذة العرض الرئيسية لتطبيق Stack بلغة C# (Windows Forms)
    /// تجسد عارض الأبليت التفاعلي لـ روبرت لافور
    /// </summary>
    public partial class StackForm : Form
    {
        private PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer autoTimer;
        private bool isRunning = false;

        public StackForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();
            thePersonGroup.DoFill();

            autoTimer = new System.Windows.Forms.Timer
            {
                Interval = 350
            };
            autoTimer.Tick += AutoTimer_Tick;

            UpdateUI();
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            thePersonGroup.NewStack();
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPush_Click(object? sender, EventArgs e)
        {
            bool isNumber = int.TryParse(txtNumber.Text, out int key);
            thePersonGroup.Push(isNumber, key);
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPop_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Pop();
            if (!string.IsNullOrEmpty(ret))
            {
                txtNumber.Text = ret;
            }
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPeek_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Peek();
            if (!string.IsNullOrEmpty(ret))
            {
                txtNumber.Text = ret;
            }
            this.Invalidate();
            UpdateUI();
        }

        private void AutoTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode != 0)
            {
                if (thePersonGroup.OpMode == 1) thePersonGroup.NewStack();
                else if (thePersonGroup.OpMode == 2)
                {
                    bool isNumber = int.TryParse(txtNumber.Text, out int key);
                    thePersonGroup.Push(isNumber, key);
                }
                else if (thePersonGroup.OpMode == 3)
                {
                    string ret = thePersonGroup.Pop();
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
            lblStatus.Text = $"Items: {thePersonGroup.NP同学}/10 | Top Pointer: {thePersonGroup.CurIn} | {thePersonGroup.Note}";
        }
    }
}
