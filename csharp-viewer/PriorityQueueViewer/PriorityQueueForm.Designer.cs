namespace PriorityQueueViewer
{
    partial class PriorityQueueForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Panel topBarPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnRem;
        private System.Windows.Forms.Button btnPeek;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Timer animationTimer;

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
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.topBarPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnRem = new System.Windows.Forms.Button();
            this.btnPeek = new System.Windows.Forms.Button();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.animationTimer = new System.Windows.Forms.Timer(this.components);

            this.topBarPanel.SuspendLayout();
            this.SuspendLayout();

            // topBarPanel
            this.topBarPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topBarPanel.Height = 40;
            this.topBarPanel.BackColor = System.Drawing.Color.LightGray;
            this.topBarPanel.Controls.Add(this.btnNew);
            this.topBarPanel.Controls.Add(this.btnIns);
            this.topBarPanel.Controls.Add(this.btnRem);
            this.topBarPanel.Controls.Add(this.btnPeek);
            this.topBarPanel.Controls.Add(this.lblNumber);
            this.topBarPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(10, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 25);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnIns
            this.btnIns.Location = new System.Drawing.Point(70, 8);
            this.btnIns.Size = new System.Drawing.Size(55, 25);
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // btnRem
            this.btnRem.Location = new System.Drawing.Point(130, 8);
            this.btnRem.Size = new System.Drawing.Size(55, 25);
            this.btnRem.Text = "Rem";
            this.btnRem.UseVisualStyleBackColor = true;
            this.btnRem.Click += new System.EventHandler(this.BtnRem_Click);

            // btnPeek
            this.btnPeek.Location = new System.Drawing.Point(190, 8);
            this.btnPeek.Size = new System.Drawing.Size(55, 25);
            this.btnPeek.Text = "Peek";
            this.btnPeek.UseVisualStyleBackColor = true;
            this.btnPeek.Click += new System.EventHandler(this.BtnPeek_Click);

            // lblNumber
            this.lblNumber.Location = new System.Drawing.Point(260, 12);
            this.lblNumber.AutoSize = true;
            this.lblNumber.Text = "Number: ";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(320, 10);
            this.txtNumber.Size = new System.Drawing.Size(65, 22);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);

            // animationTimer
            this.animationTimer.Interval = 350;
            this.animationTimer.Tick += new System.EventHandler(this.AnimationTimer_Tick);

            // PriorityQueueForm
            this.ClientSize = new System.Drawing.Size(440, 340);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topBarPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "PriorityQueueForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Priority Queue Workshop Applet";
            this.topBarPanel.ResumeLayout(false);
            this.topBarPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}
