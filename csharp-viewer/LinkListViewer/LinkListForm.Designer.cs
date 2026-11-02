namespace LinkListViewer
{
    partial class LinkListForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Panel topBarPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.RadioButton rbUnsorted;
        private System.Windows.Forms.RadioButton rbSorted;
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
            this.btnFind = new System.Windows.Forms.Button();
            this.btnDel = new System.Windows.Forms.Button();
            this.rbUnsorted = new System.Windows.Forms.RadioButton();
            this.rbSorted = new System.Windows.Forms.RadioButton();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.animationTimer = new System.Windows.Forms.Timer(this.components);

            this.topBarPanel.SuspendLayout();
            this.SuspendLayout();

            // topBarPanel
            this.topBarPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topBarPanel.Height = 42;
            this.topBarPanel.BackColor = System.Drawing.Color.LightGray;
            this.topBarPanel.Controls.Add(this.btnNew);
            this.topBarPanel.Controls.Add(this.btnIns);
            this.topBarPanel.Controls.Add(this.btnFind);
            this.topBarPanel.Controls.Add(this.btnDel);
            this.topBarPanel.Controls.Add(this.rbUnsorted);
            this.topBarPanel.Controls.Add(this.rbSorted);
            this.topBarPanel.Controls.Add(this.lblNumber);
            this.topBarPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(8, 8);
            this.btnNew.Size = new System.Drawing.Size(48, 25);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnIns
            this.btnIns.Location = new System.Drawing.Point(58, 8);
            this.btnIns.Size = new System.Drawing.Size(46, 25);
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // btnFind
            this.btnFind.Location = new System.Drawing.Point(106, 8);
            this.btnFind.Size = new System.Drawing.Size(48, 25);
            this.btnFind.Text = "Find";
            this.btnFind.UseVisualStyleBackColor = true;
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            // btnDel
            this.btnDel.Location = new System.Drawing.Point(156, 8);
            this.btnDel.Size = new System.Drawing.Size(46, 25);
            this.btnDel.Text = "Del";
            this.btnDel.UseVisualStyleBackColor = true;
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            // rbUnsorted
            this.rbUnsorted.Location = new System.Drawing.Point(208, 11);
            this.rbUnsorted.Size = new System.Drawing.Size(72, 20);
            this.rbUnsorted.Text = "Unsorted";
            this.rbUnsorted.Checked = true;
            this.rbUnsorted.CheckedChanged += new System.EventHandler(this.RbSort_CheckedChanged);

            // rbSorted
            this.rbSorted.Location = new System.Drawing.Point(282, 11);
            this.rbSorted.Size = new System.Drawing.Size(60, 20);
            this.rbSorted.Text = "Sorted";
            this.rbSorted.CheckedChanged += new System.EventHandler(this.RbSort_CheckedChanged);

            // lblNumber
            this.lblNumber.Location = new System.Drawing.Point(344, 13);
            this.lblNumber.AutoSize = true;
            this.lblNumber.Text = "Enter number: ";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(426, 10);
            this.txtNumber.Size = new System.Drawing.Size(50, 22);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);

            // animationTimer
            this.animationTimer.Interval = 350;
            this.animationTimer.Tick += new System.EventHandler(this.AnimationTimer_Tick);

            // LinkListForm
            this.ClientSize = new System.Drawing.Size(485, 340);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topBarPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "LinkListForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Linked List Workshop Applet";
            this.topBarPanel.ResumeLayout(false);
            this.topBarPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}
