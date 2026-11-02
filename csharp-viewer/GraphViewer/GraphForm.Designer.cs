namespace GraphViewer
{
    partial class GraphForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnDFS;
        private System.Windows.Forms.Button btnBFS;
        private System.Windows.Forms.Button btnTree;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.Button btnSample;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
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
            this.btnDFS = new System.Windows.Forms.Button();
            this.btnBFS = new System.Windows.Forms.Button();
            this.btnTree = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.btnSample = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.animTimer = new System.Windows.Forms.Timer(this.components);

            this.topPanel.SuspendLayout();
            this.SuspendLayout();

            // topPanel
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Height = 45;
            this.topPanel.BackColor = System.Drawing.Color.FromArgb(220, 224, 230);
            this.topPanel.Controls.Add(this.btnNew);
            this.topPanel.Controls.Add(this.btnDFS);
            this.topPanel.Controls.Add(this.btnBFS);
            this.topPanel.Controls.Add(this.btnTree);
            this.topPanel.Controls.Add(this.btnView);
            this.topPanel.Controls.Add(this.btnSample);
            this.topPanel.Controls.Add(this.btnStep);
            this.topPanel.Controls.Add(this.btnRun);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(6, 8);
            this.btnNew.Size = new System.Drawing.Size(52, 28);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnDFS
            this.btnDFS.Location = new System.Drawing.Point(62, 8);
            this.btnDFS.Size = new System.Drawing.Size(52, 28);
            this.btnDFS.Text = "DFS";
            this.btnDFS.UseVisualStyleBackColor = true;
            this.btnDFS.Click += new System.EventHandler(this.BtnDFS_Click);

            // btnBFS
            this.btnBFS.Location = new System.Drawing.Point(118, 8);
            this.btnBFS.Size = new System.Drawing.Size(52, 28);
            this.btnBFS.Text = "BFS";
            this.btnBFS.UseVisualStyleBackColor = true;
            this.btnBFS.Click += new System.EventHandler(this.BtnBFS_Click);

            // btnTree
            this.btnTree.Location = new System.Drawing.Point(174, 8);
            this.btnTree.Size = new System.Drawing.Size(52, 28);
            this.btnTree.Text = "Tree";
            this.btnTree.UseVisualStyleBackColor = true;
            this.btnTree.Click += new System.EventHandler(this.BtnTree_Click);

            // btnView
            this.btnView.Location = new System.Drawing.Point(230, 8);
            this.btnView.Size = new System.Drawing.Size(52, 28);
            this.btnView.Text = "View";
            this.btnView.UseVisualStyleBackColor = true;
            this.btnView.Click += new System.EventHandler(this.BtnView_Click);

            // btnSample
            this.btnSample.Location = new System.Drawing.Point(286, 8);
            this.btnSample.Size = new System.Drawing.Size(60, 28);
            this.btnSample.Text = "Sample";
            this.btnSample.UseVisualStyleBackColor = true;
            this.btnSample.Click += new System.EventHandler(this.BtnSample_Click);

            // btnStep
            this.btnStep.Location = new System.Drawing.Point(350, 8);
            this.btnStep.Size = new System.Drawing.Size(50, 28);
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            // btnRun
            this.btnRun.Location = new System.Drawing.Point(404, 8);
            this.btnRun.Size = new System.Drawing.Size(50, 28);
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.FromArgb(192, 192, 192);
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);
            this.canvasPanel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDown);
            this.canvasPanel.MouseMove += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseMove);
            this.canvasPanel.MouseUp += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseUp);
            this.canvasPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDoubleClick);

            // animTimer
            this.animTimer.Interval = 500;
            this.animTimer.Tick += new System.EventHandler(this.AnimTimer_Tick);

            // GraphForm
            this.ClientSize = new System.Drawing.Size(460, 370);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "GraphForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Graph Workshop - Depth/Breadth First Search & MST";

            this.topPanel.ResumeLayout(false);
            this.ResumeLayout(false);
        }
    }
}
