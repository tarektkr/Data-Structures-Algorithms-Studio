namespace TowersViewer
{
    partial class TowersForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel panelCanvas;
        private System.Windows.Forms.Panel panelTop;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnReset;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Label lblPrompt;
        private System.Windows.Forms.TrackBar trackSpeed;
        private System.Windows.Forms.Label lblSpeed;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblNote;
        private System.Windows.Forms.ToolStripStatusLabel lblStatusDisks;
        private System.Windows.Forms.ToolStripStatusLabel lblStackDepth;
        private System.Windows.Forms.ToolStripStatusLabel lblCodePart;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            panelCanvas = new System.Windows.Forms.Panel();
            panelTop = new System.Windows.Forms.Panel();
            btnNew = new System.Windows.Forms.Button();
            btnStep = new System.Windows.Forms.Button();
            btnRun = new System.Windows.Forms.Button();
            btnReset = new System.Windows.Forms.Button();
            txtNumber = new System.Windows.Forms.TextBox();
            lblPrompt = new System.Windows.Forms.Label();
            trackSpeed = new System.Windows.Forms.TrackBar();
            lblSpeed = new System.Windows.Forms.Label();
            statusStrip = new System.Windows.Forms.StatusStrip();
            lblNote = new System.Windows.Forms.ToolStripStatusLabel();
            lblStatusDisks = new System.Windows.Forms.ToolStripStatusLabel();
            lblStackDepth = new System.Windows.Forms.ToolStripStatusLabel();
            lblCodePart = new System.Windows.Forms.ToolStripStatusLabel();

            // Form
            Text = "Robert Lafore's Towers of Hanoi - Chapter 6 Workshop Applet";
            ClientSize = new System.Drawing.Size(460, 420);
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            MaximizeBox = false;
            StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;

            // panelTop
            panelTop.Dock = System.Windows.Forms.DockStyle.Top;
            panelTop.Height = 45;
            panelTop.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);

            btnNew.Text = "New";
            btnNew.Location = new System.Drawing.Point(8, 10);
            btnNew.Size = new System.Drawing.Size(55, 26);
            btnNew.Click += BtnNew_Click;

            lblPrompt.Text = "Enter number (1-10):";
            lblPrompt.AutoSize = true;
            lblPrompt.Location = new System.Drawing.Point(68, 15);

            txtNumber.Text = "3";
            txtNumber.Location = new System.Drawing.Point(185, 12);
            txtNumber.Size = new System.Drawing.Size(30, 23);
            txtNumber.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;

            btnStep.Text = "Step";
            btnStep.Location = new System.Drawing.Point(225, 10);
            btnStep.Size = new System.Drawing.Size(55, 26);
            btnStep.Click += BtnStep_Click;

            btnRun.Text = "Run";
            btnRun.Location = new System.Drawing.Point(285, 10);
            btnRun.Size = new System.Drawing.Size(55, 26);
            btnRun.Click += BtnRun_Click;

            btnReset.Text = "Reset";
            btnReset.Location = new System.Drawing.Point(345, 10);
            btnReset.Size = new System.Drawing.Size(50, 26);
            btnReset.Click += BtnReset_Click;

            trackSpeed.Minimum = 100;
            trackSpeed.Maximum = 1000;
            trackSpeed.Value = 400;
            trackSpeed.TickFrequency = 100;
            trackSpeed.Location = new System.Drawing.Point(400, 8);
            trackSpeed.Size = new System.Drawing.Size(50, 30);
            trackSpeed.Scroll += TrackSpeed_Scroll;

            panelTop.Controls.Add(btnNew);
            panelTop.Controls.Add(lblPrompt);
            panelTop.Controls.Add(txtNumber);
            panelTop.Controls.Add(btnStep);
            panelTop.Controls.Add(btnRun);
            panelTop.Controls.Add(btnReset);
            panelTop.Controls.Add(trackSpeed);

            // panelCanvas
            panelCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            panelCanvas.BackColor = System.Drawing.Color.LightGray;

            // statusStrip
            statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
                lblNote,
                lblStatusDisks,
                lblStackDepth,
                lblCodePart
            });
            lblNote.Spring = true;
            lblNote.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            lblNote.Text = "Ready";

            lblStatusDisks.Text = "Disks: 3";
            lblStackDepth.Text = "Stack Frames: 0";
            lblCodePart.Text = "CodePart: 1";

            Controls.Add(panelCanvas);
            Controls.Add(panelTop);
            Controls.Add(statusStrip);
        }
    }
}
