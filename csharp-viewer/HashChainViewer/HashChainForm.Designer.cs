namespace HashChainViewer
{
    partial class HashChainForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlCanvas;
        private System.Windows.Forms.VScrollBar vScrollBar;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnFill;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Label lblEnterNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Label lblStatus;

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
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.vScrollBar = new System.Windows.Forms.VScrollBar();
            this.pnlControls = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnFill = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnFind = new System.Windows.Forms.Button();
            this.btnDel = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.lblEnterNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.lblStatus = new System.Windows.Forms.Label();
            this.pnlControls.SuspendLayout();
            this.SuspendLayout();
            // 
            // pnlCanvas
            // 
            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Location = new System.Drawing.Point(12, 12);
            this.pnlCanvas.Name = "pnlCanvas";
            this.pnlCanvas.Size = new System.Drawing.Size(420, 320);
            this.pnlCanvas.TabIndex = 0;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);
            // 
            // vScrollBar
            // 
            this.vScrollBar.LargeChange = 10;
            this.vScrollBar.Location = new System.Drawing.Point(434, 12);
            this.vScrollBar.Maximum = 15;
            this.vScrollBar.Name = "vScrollBar";
            this.vScrollBar.Size = new System.Drawing.Size(20, 320);
            this.vScrollBar.TabIndex = 1;
            this.vScrollBar.Scroll += new System.Windows.Forms.ScrollEventHandler(this.VScrollBar_Scroll);
            // 
            // pnlControls
            // 
            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(212)))), ((int)(((byte)(208)))), ((int)(((byte)(200)))));
            this.pnlControls.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnFill);
            this.pnlControls.Controls.Add(this.btnIns);
            this.pnlControls.Controls.Add(this.btnFind);
            this.pnlControls.Controls.Add(this.btnDel);
            this.pnlControls.Controls.Add(this.btnStep);
            this.pnlControls.Controls.Add(this.btnRun);
            this.pnlControls.Controls.Add(this.lblEnterNumber);
            this.pnlControls.Controls.Add(this.txtNumber);
            this.pnlControls.Location = new System.Drawing.Point(12, 340);
            this.pnlControls.Name = "pnlControls";
            this.pnlControls.Size = new System.Drawing.Size(442, 68);
            this.pnlControls.TabIndex = 2;
            // 
            // btnNew
            // 
            this.btnNew.Location = new System.Drawing.Point(8, 8);
            this.btnNew.Name = "btnNew";
            this.btnNew.Size = new System.Drawing.Size(52, 24);
            this.btnNew.TabIndex = 0;
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);
            // 
            // btnFill
            // 
            this.btnFill.Location = new System.Drawing.Point(64, 8);
            this.btnFill.Name = "btnFill";
            this.btnFill.Size = new System.Drawing.Size(52, 24);
            this.btnFill.TabIndex = 1;
            this.btnFill.Text = "Fill";
            this.btnFill.UseVisualStyleBackColor = true;
            this.btnFill.Click += new System.EventHandler(this.BtnFill_Click);
            // 
            // btnIns
            // 
            this.btnIns.Location = new System.Drawing.Point(120, 8);
            this.btnIns.Name = "btnIns";
            this.btnIns.Size = new System.Drawing.Size(52, 24);
            this.btnIns.TabIndex = 2;
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);
            // 
            // btnFind
            // 
            this.btnFind.Location = new System.Drawing.Point(176, 8);
            this.btnFind.Name = "btnFind";
            this.btnFind.Size = new System.Drawing.Size(52, 24);
            this.btnFind.TabIndex = 3;
            this.btnFind.Text = "Find";
            this.btnFind.UseVisualStyleBackColor = true;
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);
            // 
            // btnDel
            // 
            this.btnDel.Location = new System.Drawing.Point(232, 8);
            this.btnDel.Name = "btnDel";
            this.btnDel.Size = new System.Drawing.Size(52, 24);
            this.btnDel.TabIndex = 4;
            this.btnDel.Text = "Del";
            this.btnDel.UseVisualStyleBackColor = true;
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);
            // 
            // btnStep
            // 
            this.btnStep.Location = new System.Drawing.Point(8, 36);
            this.btnStep.Name = "btnStep";
            this.btnStep.Size = new System.Drawing.Size(60, 24);
            this.btnStep.TabIndex = 5;
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);
            // 
            // btnRun
            // 
            this.btnRun.Location = new System.Drawing.Point(72, 36);
            this.btnRun.Name = "btnRun";
            this.btnRun.Size = new System.Drawing.Size(60, 24);
            this.btnRun.TabIndex = 6;
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);
            // 
            // lblEnterNumber
            // 
            this.lblEnterNumber.AutoSize = true;
            this.lblEnterNumber.Location = new System.Drawing.Point(292, 13);
            this.lblEnterNumber.Name = "lblEnterNumber";
            this.lblEnterNumber.Size = new System.Drawing.Size(83, 15);
            this.lblEnterNumber.TabIndex = 7;
            this.lblEnterNumber.Text = "Enter number:";
            // 
            // txtNumber
            // 
            this.txtNumber.Location = new System.Drawing.Point(380, 10);
            this.txtNumber.Name = "txtNumber";
            this.txtNumber.Size = new System.Drawing.Size(50, 23);
            this.txtNumber.TabIndex = 8;
            this.txtNumber.Text = "42";
            // 
            // lblStatus
            // 
            this.lblStatus.AutoSize = true;
            this.lblStatus.Location = new System.Drawing.Point(12, 415);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(180, 15);
            this.lblStatus.TabIndex = 3;
            this.lblStatus.Text = "Buckets: 25 | Items: 25 | Load: 1.00";
            // 
            // HashChainForm
            // 
            this.ClientSize = new System.Drawing.Size(468, 440);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.pnlControls);
            this.Controls.Add(this.vScrollBar);
            this.Controls.Add(this.pnlCanvas);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "HashChainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Separate-Chaining Hash Table Viewer (Robert Lafore)";
            this.pnlControls.ResumeLayout(false);
            this.pnlControls.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}
