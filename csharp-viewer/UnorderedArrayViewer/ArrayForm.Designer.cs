namespace UnorderedArrayViewer
{
    partial class ArrayForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnFill;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.RadioButton rbDupsOk;
        private System.Windows.Forms.RadioButton rbNoDups;
        private System.Windows.Forms.GroupBox grpDups;
        private System.Windows.Forms.Panel pnlCanvas;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblStatusText;
        private System.Windows.Forms.CheckBox chkStepByStep;
        private System.Windows.Forms.Button btnNextStep;
        private System.Windows.Forms.TrackBar trackSpeed;
        private System.Windows.Forms.Label lblSpeed;

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
            this.btnFill = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnFind = new System.Windows.Forms.Button();
            this.btnDel = new System.Windows.Forms.Button();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.grpDups = new System.Windows.Forms.GroupBox();
            this.rbDupsOk = new System.Windows.Forms.RadioButton();
            this.rbNoDups = new System.Windows.Forms.RadioButton();
            this.chkStepByStep = new System.Windows.Forms.CheckBox();
            this.btnNextStep = new System.Windows.Forms.Button();
            this.trackSpeed = new System.Windows.Forms.TrackBar();
            this.lblSpeed = new System.Windows.Forms.Label();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.lblStatusText = new System.Windows.Forms.ToolStripStatusLabel();

            this.pnlControls.SuspendLayout();
            this.grpDups.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.trackSpeed)).BeginInit();
            this.statusStrip.SuspendLayout();
            this.SuspendLayout();

            // 
            // pnlControls
            // 
            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnFill);
            this.pnlControls.Controls.Add(this.btnIns);
            this.pnlControls.Controls.Add(this.btnFind);
            this.pnlControls.Controls.Add(this.btnDel);
            this.pnlControls.Controls.Add(this.grpDups);
            this.pnlControls.Controls.Add(this.lblNumber);
            this.pnlControls.Controls.Add(this.txtNumber);
            this.pnlControls.Controls.Add(this.chkStepByStep);
            this.pnlControls.Controls.Add(this.btnNextStep);
            this.pnlControls.Controls.Add(this.lblSpeed);
            this.pnlControls.Controls.Add(this.trackSpeed);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Location = new System.Drawing.Point(0, 0);
            this.pnlControls.Name = "pnlControls";
            this.pnlControls.Size = new System.Drawing.Size(680, 85);
            this.pnlControls.TabIndex = 0;

            // 
            // btnNew
            // 
            this.btnNew.Location = new System.Drawing.Point(12, 12);
            this.btnNew.Name = "btnNew";
            this.btnNew.Size = new System.Drawing.Size(55, 30);
            this.btnNew.TabIndex = 0;
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // 
            // btnFill
            // 
            this.btnFill.Location = new System.Drawing.Point(73, 12);
            this.btnFill.Name = "btnFill";
            this.btnFill.Size = new System.Drawing.Size(55, 30);
            this.btnFill.TabIndex = 1;
            this.btnFill.Text = "Fill";
            this.btnFill.UseVisualStyleBackColor = true;
            this.btnFill.Click += new System.EventHandler(this.BtnFill_Click);

            // 
            // btnIns
            // 
            this.btnIns.Location = new System.Drawing.Point(134, 12);
            this.btnIns.Name = "btnIns";
            this.btnIns.Size = new System.Drawing.Size(55, 30);
            this.btnIns.TabIndex = 2;
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // 
            // btnFind
            // 
            this.btnFind.Location = new System.Drawing.Point(195, 12);
            this.btnFind.Name = "btnFind";
            this.btnFind.Size = new System.Drawing.Size(55, 30);
            this.btnFind.TabIndex = 3;
            this.btnFind.Text = "Find";
            this.btnFind.UseVisualStyleBackColor = true;
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            // 
            // btnDel
            // 
            this.btnDel.Location = new System.Drawing.Point(256, 12);
            this.btnDel.Name = "btnDel";
            this.btnDel.Size = new System.Drawing.Size(55, 30);
            this.btnDel.TabIndex = 4;
            this.btnDel.Text = "Del";
            this.btnDel.UseVisualStyleBackColor = true;
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            // 
            // grpDups
            // 
            this.grpDups.Controls.Add(this.rbDupsOk);
            this.grpDups.Controls.Add(this.rbNoDups);
            this.grpDups.Location = new System.Drawing.Point(322, 5);
            this.grpDups.Name = "grpDups";
            this.grpDups.Size = new System.Drawing.Size(165, 40);
            this.grpDups.TabIndex = 5;
            this.grpDups.TabStop = false;

            // 
            // rbDupsOk
            // 
            this.rbDupsOk.AutoSize = true;
            this.rbDupsOk.Checked = true;
            this.rbDupsOk.Location = new System.Drawing.Point(6, 14);
            this.rbDupsOk.Name = "rbDupsOk";
            this.rbDupsOk.Size = new System.Drawing.Size(76, 19);
            this.rbDupsOk.TabIndex = 0;
            this.rbDupsOk.TabStop = true;
            this.rbDupsOk.Text = "Dups OK";
            this.rbDupsOk.UseVisualStyleBackColor = true;
            this.rbDupsOk.CheckedChanged += new System.EventHandler(this.RbDupsOk_CheckedChanged);

            // 
            // rbNoDups
            // 
            this.rbNoDups.AutoSize = true;
            this.rbNoDups.Location = new System.Drawing.Point(88, 14);
            this.rbNoDups.Name = "rbNoDups";
            this.rbNoDups.Size = new System.Drawing.Size(72, 19);
            this.rbNoDups.TabIndex = 1;
            this.rbNoDups.Text = "No dups";
            this.rbNoDups.UseVisualStyleBackColor = true;
            this.rbNoDups.CheckedChanged += new System.EventHandler(this.RbNoDups_CheckedChanged);

            // 
            // lblNumber
            // 
            this.lblNumber.AutoSize = true;
            this.lblNumber.Location = new System.Drawing.Point(495, 18);
            this.lblNumber.Name = "lblNumber";
            this.lblNumber.Size = new System.Drawing.Size(54, 15);
            this.lblNumber.TabIndex = 6;
            this.lblNumber.Text = "Number:";

            // 
            // txtNumber
            // 
            this.txtNumber.Location = new System.Drawing.Point(555, 15);
            this.txtNumber.Name = "txtNumber";
            this.txtNumber.Size = new System.Drawing.Size(60, 23);
            this.txtNumber.TabIndex = 7;

            // 
            // chkStepByStep
            // 
            this.chkStepByStep.AutoSize = true;
            this.chkStepByStep.Location = new System.Drawing.Point(14, 52);
            this.chkStepByStep.Name = "chkStepByStep";
            this.chkStepByStep.Size = new System.Drawing.Size(92, 19);
            this.chkStepByStep.TabIndex = 8;
            this.chkStepByStep.Text = "خطوة بخطوة";
            this.chkStepByStep.UseVisualStyleBackColor = true;

            // 
            // btnNextStep
            // 
            this.btnNextStep.Enabled = false;
            this.btnNextStep.Location = new System.Drawing.Point(115, 48);
            this.btnNextStep.Name = "btnNextStep";
            this.btnNextStep.Size = new System.Drawing.Size(85, 26);
            this.btnNextStep.TabIndex = 9;
            this.btnNextStep.Text = "الخطوة التالية";
            this.btnNextStep.UseVisualStyleBackColor = true;
            this.btnNextStep.Click += new System.EventHandler(this.BtnNextStep_Click);

            // 
            // lblSpeed
            // 
            this.lblSpeed.AutoSize = true;
            this.lblSpeed.Location = new System.Drawing.Point(230, 53);
            this.lblSpeed.Name = "lblSpeed";
            this.lblSpeed.Size = new System.Drawing.Size(42, 15);
            this.lblSpeed.TabIndex = 10;
            this.lblSpeed.Text = "السرعة:";

            // 
            // trackSpeed
            // 
            this.trackSpeed.Location = new System.Drawing.Point(275, 48);
            this.trackSpeed.Minimum = 1;
            this.trackSpeed.Maximum = 10;
            this.trackSpeed.Value = 7;
            this.trackSpeed.Name = "trackSpeed";
            this.trackSpeed.Size = new System.Drawing.Size(120, 26);
            this.trackSpeed.TabIndex = 11;
            this.trackSpeed.ValueChanged += new System.EventHandler(this.TrackSpeed_ValueChanged);

            // 
            // pnlCanvas
            // 
            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Location = new System.Drawing.Point(0, 85);
            this.pnlCanvas.Name = "pnlCanvas";
            this.pnlCanvas.Size = new System.Drawing.Size(680, 350);
            this.pnlCanvas.TabIndex = 1;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            // 
            // statusStrip
            // 
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.lblStatusText});
            this.statusStrip.Location = new System.Drawing.Point(0, 435);
            this.statusStrip.Name = "statusStrip";
            this.statusStrip.Size = new System.Drawing.Size(680, 22);
            this.statusStrip.TabIndex = 2;

            // 
            // lblStatusText
            // 
            this.lblStatusText.Name = "lblStatusText";
            this.lblStatusText.Size = new System.Drawing.Size(118, 17);
            this.lblStatusText.Text = "الحالة: اضغط أي زر للبدء";

            // 
            // ArrayForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(680, 457);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "ArrayForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Robert Lafore - Unordered Array Applet Viewer (C#)";

            this.pnlControls.ResumeLayout(false);
            this.pnlControls.PerformLayout();
            this.grpDups.ResumeLayout(false);
            this.grpDups.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.trackSpeed)).EndInit();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}
