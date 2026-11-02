namespace BubbleSortViewer
{
    partial class BubbleSortForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnSize;
        private System.Windows.Forms.Button btnDraw;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Panel pnlCanvas;

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
            this.pnlControls = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnSize = new System.Windows.Forms.Button();
            this.btnDraw = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.pnlControls.SuspendLayout();
            this.SuspendLayout();

            // pnlControls
            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnSize);
            this.pnlControls.Controls.Add(this.btnDraw);
            this.pnlControls.Controls.Add(this.btnRun);
            this.pnlControls.Controls.Add(this.btnStep);
            this.pnlControls.Controls.Add(this.lblStatus);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 50;

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(10, 10);
            this.btnNew.Size = new System.Drawing.Size(90, 30);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnSize
            this.btnSize.Location = new System.Drawing.Point(105, 10);
            this.btnSize.Size = new System.Drawing.Size(75, 30);
            this.btnSize.Text = "Size";
            this.btnSize.UseVisualStyleBackColor = true;
            this.btnSize.Click += new System.EventHandler(this.BtnSize_Click);

            // btnDraw
            this.btnDraw.Location = new System.Drawing.Point(185, 10);
            this.btnDraw.Size = new System.Drawing.Size(65, 30);
            this.btnDraw.Text = "Draw";
            this.btnDraw.UseVisualStyleBackColor = true;
            this.btnDraw.Click += new System.EventHandler(this.BtnDraw_Click);

            // btnRun
            this.btnRun.Location = new System.Drawing.Point(255, 10);
            this.btnRun.Size = new System.Drawing.Size(65, 30);
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            // btnStep
            this.btnStep.Location = new System.Drawing.Point(325, 10);
            this.btnStep.Size = new System.Drawing.Size(65, 30);
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            // pnlCanvas
            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            // BubbleSortForm
            this.ClientSize = new System.Drawing.Size(420, 390);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "BubbleSortForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore Bubble Sort Applet Viewer (C# Windows Forms)";
            this.pnlControls.ResumeLayout(false);
            this.ResumeLayout(false);
        }
    }
}
