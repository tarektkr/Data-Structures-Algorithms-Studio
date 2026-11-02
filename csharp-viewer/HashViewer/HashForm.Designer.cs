namespace HashViewer
{
    partial class HashForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlCanvas;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnFill;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Label lblEnterNumber;
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
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnFill = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnDel = new System.Windows.Forms.Button();
            this.btnFind = new System.Windows.Forms.Button();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.lblEnterNumber = new System.Windows.Forms.Label();
            this.btnStep = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();

            // Form
            this.ClientSize = new System.Drawing.Size(480, 420);
            this.Text = "Robert Lafore Linear-Probe Hash Table - Chapter 11";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;

            // pnlCanvas (440 x 300)
            this.pnlCanvas.Location = new System.Drawing.Point(16, 16);
            this.pnlCanvas.Size = new System.Drawing.Size(440, 300);
            this.pnlCanvas.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.pnlCanvas.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            // Row 1: Controls
            int y1 = 328;
            this.btnNew.Location = new System.Drawing.Point(16, y1);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnFill.Location = new System.Drawing.Point(76, y1);
            this.btnFill.Size = new System.Drawing.Size(55, 26);
            this.btnFill.Text = "Fill";
            this.btnFill.Click += new System.EventHandler(this.BtnFill_Click);

            this.btnIns.Location = new System.Drawing.Point(136, y1);
            this.btnIns.Size = new System.Drawing.Size(55, 26);
            this.btnIns.Text = "Ins";
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            this.btnDel.Location = new System.Drawing.Point(196, y1);
            this.btnDel.Size = new System.Drawing.Size(55, 26);
            this.btnDel.Text = "Del";
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            this.btnFind.Location = new System.Drawing.Point(256, y1);
            this.btnFind.Size = new System.Drawing.Size(55, 26);
            this.btnFind.Text = "Find";
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            this.lblEnterNumber.Location = new System.Drawing.Point(318, y1 + 5);
            this.lblEnterNumber.Size = new System.Drawing.Size(85, 18);
            this.lblEnterNumber.Text = "Enter number:";

            this.txtNumber.Location = new System.Drawing.Point(406, y1 + 2);
            this.txtNumber.Size = new System.Drawing.Size(50, 22);

            // Row 2: Step, Run, and Status
            int y2 = 360;
            this.btnStep.Location = new System.Drawing.Point(16, y2);
            this.btnStep.Size = new System.Drawing.Size(65, 26);
            this.btnStep.Text = "Step";
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            this.btnRun.Location = new System.Drawing.Point(86, y2);
            this.btnRun.Size = new System.Drawing.Size(65, 26);
            this.btnRun.Text = "Run";
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            this.lblStatus.Location = new System.Drawing.Point(160, y2 + 5);
            this.lblStatus.Size = new System.Drawing.Size(296, 20);
            this.lblStatus.Font = new System.Drawing.Font("Arial", 8.25f, System.Drawing.FontStyle.Regular);
            this.lblStatus.Text = "Cells: 0/60";

            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.btnNew);
            this.Controls.Add(this.btnFill);
            this.Controls.Add(this.btnIns);
            this.Controls.Add(this.btnDel);
            this.Controls.Add(this.btnFind);
            this.Controls.Add(this.lblEnterNumber);
            this.Controls.Add(this.txtNumber);
            this.Controls.Add(this.btnStep);
            this.Controls.Add(this.btnRun);
            this.Controls.Add(this.lblStatus);
        }
    }
}
