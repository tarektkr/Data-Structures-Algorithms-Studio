using System;
using System.Drawing;
using System.Windows.Forms;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// نافذة العرض الرئيسية للتطبيق (Windows Forms Viewer)
    /// تجسد عارض الأبليت التفاعلي لمصفوفة روبرت لافور غير المرتبة (Unordered Array Applet).
    /// </summary>
    public partial class ArrayForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public ArrayForm()
        {
            InitializeComponent();

            // تفعيل الرسم المزدوج لمنع وميض الشاشة (DoubleBuffering)
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(60);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 250 // سرعة التحريك الافتراضية
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMoreSteps = false;

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                hasMoreSteps = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
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
            thePersonGroup.Insert(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                if (chkStepByStep.Checked)
                {
                    // نمط الخطوة اليدوية
                    SetControlsEnabled(false);
                    btnNextStep.Enabled = true;
                }
                else
                {
                    // تحريك تلقائي
                    SetControlsEnabled(false);
                    animTimer.Start();
                }
            }
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
            {
                if (chkStepByStep.Checked)
                {
                    SetControlsEnabled(false);
                    btnNextStep.Enabled = true;
                }
                else
                {
                    SetControlsEnabled(false);
                    animTimer.Start();
                }
            }
        }

        private void BtnNextStep_Click(object? sender, EventArgs e)
        {
            bool hasMore = false;
            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                hasMore = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
            {
                hasMore = thePersonGroup.StepDelete();
            }

            pnlCanvas.Invalidate();
            UpdateStatus();

            if (!hasMore)
            {
                btnNextStep.Enabled = false;
                SetControlsEnabled(true);
            }
        }

        private void RbDupsOk_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbDupsOk.Checked)
            {
                thePersonGroup.SetDupsStatus(true);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void RbNoDups_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbNoDups.Checked)
            {
                thePersonGroup.SetDupsStatus(false);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void TrackSpeed_ValueChanged(object? sender, EventArgs e)
        {
            // تغيير سرعة المؤقت بين 50ms إلى 800ms
            int speedVal = trackSpeed.Value; // 1 to 10
            animTimer.Interval = Math.Max(30, 850 - (speedVal * 80));
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
            rbDupsOk.Enabled = enabled;
            rbNoDups.Enabled = enabled;
        }

        private void UpdateStatus()
        {
            lblStatusText.Text = $"الحالة: {thePersonGroup.Note} | عدد العناصر: {thePersonGroup.NPersons} / {thePersonGroup.TotalCells}";
        }
    }
}
