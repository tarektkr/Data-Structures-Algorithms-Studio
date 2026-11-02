namespace GraphDWViewer
{
    partial class GraphDWForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnPath;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.Button btnSample;
        private System.Windows.Forms.Label lblEnterNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Panel canvasPanel;

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
            this.topPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnPath = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.btnSample = new System.Windows.Forms.Button();
            this.lblEnterNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.topPanel.SuspendLayout();
            this.SuspendLayout();

            // topPanel
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Height = 40;
            this.topPanel.BackColor = System.Drawing.Color.LightGray;
            this.topPanel.Controls.Add(this.btnNew);
            this.topPanel.Controls.Add(this.btnPath);
            this.topPanel.Controls.Add(this.btnView);
            this.topPanel.Controls.Add(this.btnSample);
            this.topPanel.Controls.Add(this.lblEnterNumber);
            this.topPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(8, 7);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnPath
            this.btnPath.Location = new System.Drawing.Point(68, 7);
            this.btnPath.Size = new System.Drawing.Size(55, 26);
            this.btnPath.Text = "Path";
            this.btnPath.Click += new System.EventHandler(this.BtnPath_Click);

            // btnView
            this.btnView.Location = new System.Drawing.Point(128, 7);
            this.btnView.Size = new System.Drawing.Size(55, 26);
            this.btnView.Text = "View";
            this.btnView.Click += new System.EventHandler(this.BtnView_Click);

            // btnSample
            this.btnSample.Location = new System.Drawing.Point(188, 7);
            this.btnSample.Size = new System.Drawing.Size(65, 26);
            this.btnSample.Text = "Sample";
            this.btnSample.Click += new System.EventHandler(this.BtnSample_Click);

            // lblEnterNumber
            this.lblEnterNumber.Location = new System.Drawing.Point(260, 11);
            this.lblEnterNumber.AutoSize = true;
            this.lblEnterNumber.Text = "Enter number:";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(345, 8);
            this.txtNumber.Size = new System.Drawing.Size(45, 23);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);
            this.canvasPanel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDown);
            this.canvasPanel.MouseUp += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseUp);
            this.canvasPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDoubleClick);

            // GraphDWForm
            this.ClientSize = new System.Drawing.Size(440, 365);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "GraphDWForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Directed, Weighted Graph (GraphDW)";
            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}
