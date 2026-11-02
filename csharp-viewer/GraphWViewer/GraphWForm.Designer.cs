namespace GraphWViewer
{
    partial class GraphWForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnTree;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.Button btnSample;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Label lblPrompt;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Timer animTimer;

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
            this.components = new System.ComponentModel.Container();
            this.topPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnTree = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.btnSample = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.lblPrompt = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.animTimer = new System.Windows.Forms.Timer(this.components);

            this.topPanel.SuspendLayout();
            this.SuspendLayout();

            // topPanel
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Height = 45;
            this.topPanel.BackColor = System.Drawing.Color.FromArgb(220, 224, 230);
            this.topPanel.Controls.Add(this.btnNew);
            this.topPanel.Controls.Add(this.btnTree);
            this.topPanel.Controls.Add(this.btnView);
            this.topPanel.Controls.Add(this.btnSample);
            this.topPanel.Controls.Add(this.lblPrompt);
            this.topPanel.Controls.Add(this.txtNumber);
            this.topPanel.Controls.Add(this.btnStep);
            this.topPanel.Controls.Add(this.btnRun);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(8, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 28);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnTree
            this.btnTree.Location = new System.Drawing.Point(68, 8);
            this.btnTree.Size = new System.Drawing.Size(55, 28);
            this.btnTree.Text = "Tree";
            this.btnTree.Click += new System.EventHandler(this.BtnTree_Click);

            // btnView
            this.btnView.Location = new System.Drawing.Point(128, 8);
            this.btnView.Size = new System.Drawing.Size(55, 28);
            this.btnView.Text = "View";
            this.btnView.Click += new System.EventHandler(this.BtnView_Click);

            // btnSample
            this.btnSample.Location = new System.Drawing.Point(188, 8);
            this.btnSample.Size = new System.Drawing.Size(65, 28);
            this.btnSample.Text = "Sample";
            this.btnSample.Click += new System.EventHandler(this.BtnSample_Click);

            // lblPrompt
            this.lblPrompt.Location = new System.Drawing.Point(260, 14);
            this.lblPrompt.Size = new System.Drawing.Size(85, 18);
            this.lblPrompt.Text = "Enter number:";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(348, 11);
            this.txtNumber.Size = new System.Drawing.Size(40, 23);
            this.txtNumber.Text = "6";

            // btnStep
            this.btnStep.Location = new System.Drawing.Point(395, 8);
            this.btnStep.Size = new System.Drawing.Size(50, 28);
            this.btnStep.Text = "Step";
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            // btnRun
            this.btnRun.Location = new System.Drawing.Point(450, 8);
            this.btnRun.Size = new System.Drawing.Size(50, 28);
            this.btnRun.Text = "Run";
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);
            this.canvasPanel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDown);
            this.canvasPanel.MouseMove += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseMove);
            this.canvasPanel.MouseUp += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseUp);
            this.canvasPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDoubleClick);

            // animTimer
            this.animTimer.Interval = 500;
            this.animTimer.Tick += new System.EventHandler(this.AnimTimer_Tick);

            // GraphWForm
            this.ClientSize = new System.Drawing.Size(515, 375);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topPanel);
            this.Text = "Weighted, Undirected Graph (MSTW - Minimum Spanning Tree)";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;

            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}
