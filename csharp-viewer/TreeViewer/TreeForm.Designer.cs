namespace TreeViewer
{
    partial class TreeForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlCanvas;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnFill;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnTrav;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
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
            pnlCanvas = new System.Windows.Forms.Panel();
            pnlControls = new System.Windows.Forms.Panel();
            btnFill = new System.Windows.Forms.Button();
            btnFind = new System.Windows.Forms.Button();
            btnIns = new System.Windows.Forms.Button();
            btnTrav = new System.Windows.Forms.Button();
            btnDel = new System.Windows.Forms.Button();
            lblNumber = new System.Windows.Forms.Label();
            txtNumber = new System.Windows.Forms.TextBox();
            btnStep = new System.Windows.Forms.Button();
            btnRun = new System.Windows.Forms.Button();
            lblStatus = new System.Windows.Forms.Label();

            pnlControls.SuspendLayout();
            SuspendLayout();

            // pnlCanvas
            pnlCanvas.BackColor = System.Drawing.Color.FromArgb(192, 192, 192);
            pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            pnlCanvas.Paint += PnlCanvas_Paint;
            pnlCanvas.MouseClick += PnlCanvas_MouseClick;

            // pnlControls
            pnlControls.Dock = System.Windows.Forms.DockStyle.Bottom;
            pnlControls.Height = 70;
            pnlControls.BackColor = System.Drawing.Color.FromArgb(235, 235, 235);
            pnlControls.Controls.Add(btnFill);
            pnlControls.Controls.Add(btnFind);
            pnlControls.Controls.Add(btnIns);
            pnlControls.Controls.Add(btnTrav);
            pnlControls.Controls.Add(btnDel);
            pnlControls.Controls.Add(lblNumber);
            pnlControls.Controls.Add(txtNumber);
            pnlControls.Controls.Add(btnStep);
            pnlControls.Controls.Add(btnRun);
            pnlControls.Controls.Add(lblStatus);

            int btnY = 10;
            int h = 26;

            // Buttons
            btnFill.Text = "Fill";
            btnFill.Location = new System.Drawing.Point(10, btnY);
            btnFill.Size = new System.Drawing.Size(46, h);
            btnFill.Click += BtnFill_Click;

            btnFind.Text = "Find";
            btnFind.Location = new System.Drawing.Point(60, btnY);
            btnFind.Size = new System.Drawing.Size(46, h);
            btnFind.Click += BtnFind_Click;

            btnIns.Text = "Ins";
            btnIns.Location = new System.Drawing.Point(110, btnY);
            btnIns.Size = new System.Drawing.Size(44, h);
            btnIns.Click += BtnIns_Click;

            btnTrav.Text = "Trav";
            btnTrav.Location = new System.Drawing.Point(158, btnY);
            btnTrav.Size = new System.Drawing.Size(48, h);
            btnTrav.Click += BtnTrav_Click;

            btnDel.Text = "Del";
            btnDel.Location = new System.Drawing.Point(210, btnY);
            btnDel.Size = new System.Drawing.Size(44, h);
            btnDel.Click += BtnDel_Click;

            lblNumber.Text = "Enter number:";
            lblNumber.Location = new System.Drawing.Point(260, btnY + 4);
            lblNumber.AutoSize = true;

            txtNumber.Text = "42";
            txtNumber.Location = new System.Drawing.Point(344, btnY + 1);
            txtNumber.Size = new System.Drawing.Size(40, 23);

            btnStep.Text = "Step";
            btnStep.Location = new System.Drawing.Point(390, btnY);
            btnStep.Size = new System.Drawing.Size(46, h);
            btnStep.Click += BtnStep_Click;

            btnRun.Text = "Run";
            btnRun.Location = new System.Drawing.Point(440, btnY);
            btnRun.Size = new System.Drawing.Size(46, h);
            btnRun.Click += BtnRun_Click;

            // Status Label
            lblStatus.Location = new System.Drawing.Point(10, 42);
            lblStatus.Size = new System.Drawing.Size(480, 20);
            lblStatus.Font = new System.Drawing.Font("Segoe UI", 8.5F, System.Drawing.FontStyle.Regular);
            lblStatus.ForeColor = System.Drawing.Color.FromArgb(60, 60, 60);

            // TreeForm
            AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            ClientSize = new System.Drawing.Size(496, 390);
            Controls.Add(pnlCanvas);
            Controls.Add(pnlControls);
            FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            MaximizeBox = false;
            Name = "TreeForm";
            StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            Text = "Robert Lafore - Binary Search Tree Workshop";

            pnlControls.ResumeLayout(false);
            pnlControls.PerformLayout();
            ResumeLayout(false);
        }
    }
}
