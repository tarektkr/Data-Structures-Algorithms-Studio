using System;
using System.Drawing;
using System.Windows.Forms;

namespace TowersViewer
{
    public partial class TowersForm : Form
    {
        private GameGroup theGameGroup;
        private System.Windows.Forms.Timer runTimer;
        private bool isRunning = false;

        public TowersForm()
        {
            InitializeComponent();
            theGameGroup = new GameGroup(3);

            runTimer = new System.Windows.Forms.Timer();
            runTimer.Interval = 400;
            runTimer.Tick += RunTimer_Tick;

            panelCanvas.Paint += PanelCanvas_Paint;
            panelCanvas.MouseDown += PanelCanvas_MouseDown;
            panelCanvas.MouseMove += PanelCanvas_MouseMove;
            panelCanvas.MouseUp += PanelCanvas_MouseUp;

            // Enable double buffering on canvas panel to eliminate flicker
            typeof(Panel).InvokeMember("DoubleBuffered",
                System.Reflection.BindingFlags.SetProperty |
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.NonPublic,
                null, panelCanvas, new object[] { true });

            UpdateUIStatus();
        }

        private void PanelCanvas_Paint(object? sender, PaintEventArgs e)
        {
            theGameGroup.Draw(e.Graphics);
        }

        private void PanelCanvas_MouseDown(object? sender, MouseEventArgs e)
        {
            if (isRunning) return;
            theGameGroup.StartDrag(e.X, e.Y);
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void PanelCanvas_MouseMove(object? sender, MouseEventArgs e)
        {
            if (theGameGroup.IsDragging)
            {
                theGameGroup.DragX = e.X;
                theGameGroup.DragY = e.Y;
                panelCanvas.Invalidate();
            }
        }

        private void PanelCanvas_MouseUp(object? sender, MouseEventArgs e)
        {
            if (theGameGroup.IsDragging)
            {
                theGameGroup.EndDrag(e.X, e.Y);
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            if (int.TryParse(txtNumber.Text, out int count) && count >= 1 && count <= 10)
            {
                theGameGroup = new GameGroup(count);
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
            else
            {
                theGameGroup.CreationError();
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            theGameGroup.Step();
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                btnStep.Enabled = false;
                btnNew.Enabled = false;
                runTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                btnStep.Enabled = true;
                btnNew.Enabled = true;
                runTimer.Stop();
            }
            UpdateUIStatus();
        }

        private void RunTimer_Tick(object? sender, EventArgs e)
        {
            if (theGameGroup.IsDoneFlag)
            {
                isRunning = false;
                btnRun.Text = "Run";
                btnStep.Enabled = true;
                btnNew.Enabled = true;
                runTimer.Stop();
                panelCanvas.Invalidate();
                UpdateUIStatus();
                return;
            }

            theGameGroup.Step();
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void BtnReset_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            runTimer.Stop();
            btnRun.Text = "Run";
            btnStep.Enabled = true;
            btnNew.Enabled = true;

            int count = 3;
            if (int.TryParse(txtNumber.Text, out int c) && c >= 1 && c <= 10)
            {
                count = c;
            }

            theGameGroup = new GameGroup(count);
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void TrackSpeed_Scroll(object? sender, EventArgs e)
        {
            runTimer.Interval = trackSpeed.Value;
            lblSpeed.Text = $"{trackSpeed.Value}ms";
        }

        private void UpdateUIStatus()
        {
            lblNote.Text = theGameGroup.Note;
            lblStatusDisks.Text = $"Disks: {theGameGroup.NDisks}";
            lblStackDepth.Text = $"Stack Frames: {theGameGroup.TheStack.Count}";
            lblCodePart.Text = $"CodePart: {theGameGroup.CodePart}";
        }
    }
}
