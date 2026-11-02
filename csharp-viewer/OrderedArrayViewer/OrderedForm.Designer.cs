namespace OrderedArrayViewer
{
    partial class OrderedForm
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
        private System.Windows.Forms.RadioButton rbLinear;
        private System.Windows.Forms.RadioButton rbBinary;
        private System.Windows.Forms.GroupBox grpSearch;
        private System.Windows.Forms.Panel pnlCanvas;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblStatusText;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
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
            this.grpSearch = new System.Windows.Forms.GroupBox();
            this.rbLinear = new System.Windows.Forms.RadioButton();
            this.rbBinary = new System.Windows.Forms.RadioButton();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.lblStatusText = new System.Windows.Forms.ToolStripStatusLabel();

            this.pnlControls.SuspendLayout();
            this.grpSearch.SuspendLayout();
            this.statusStrip.SuspendLayout();
            this.SuspendLayout();

            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnFill);
            this.pnlControls.Controls.Add(this.btnIns);
            this.pnlControls.Controls.Add(this.btnFind);
            this.pnlControls.Controls.Add(this.btnDel);
            this.pnlControls.Controls.Add(this.grpSearch);
            this.pnlControls.Controls.Add(this.lblNumber);
            this.pnlControls.Controls.Add(this.txtNumber);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Location = new System.Drawing.Point(0, 0);
            this.pnlControls.Size = new System.Drawing.Size(680, 60);

            this.btnNew.Location = new System.Drawing.Point(12, 14);
            this.btnNew.Size = new System.Drawing.Size(55, 30);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnFill.Location = new System.Drawing.Point(73, 14);
            this.btnFill.Size = new System.Drawing.Size(55, 30);
            this.btnFill.Text = "Fill";
            this.btnFill.Click += new System.EventHandler(this.BtnFill_Click);

            this.btnIns.Location = new System.Drawing.Point(134, 14);
            this.btnIns.Size = new System.Drawing.Size(55, 30);
            this.btnIns.Text = "Ins";
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            this.btnFind.Location = new System.Drawing.Point(195, 14);
            this.btnFind.Size = new System.Drawing.Size(55, 30);
            this.btnFind.Text = "Find";
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            this.btnDel.Location = new System.Drawing.Point(256, 14);
            this.btnDel.Size = new System.Drawing.Size(55, 30);
            this.btnDel.Text = "Del";
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            this.grpSearch.Controls.Add(this.rbLinear);
            this.grpSearch.Controls.Add(this.rbBinary);
            this.grpSearch.Location = new System.Drawing.Point(322, 7);
            this.grpSearch.Size = new System.Drawing.Size(165, 40);

            this.rbLinear.AutoSize = true;
            this.rbLinear.Location = new System.Drawing.Point(6, 14);
            this.rbLinear.Text = "Linear";
            this.rbLinear.CheckedChanged += new System.EventHandler(this.RbLinear_CheckedChanged);

            this.rbBinary.AutoSize = true;
            this.rbBinary.Checked = true;
            this.rbBinary.Location = new System.Drawing.Point(75, 14);
            this.rbBinary.Text = "Binary";
            this.rbBinary.CheckedChanged += new System.EventHandler(this.RbBinary_CheckedChanged);

            this.lblNumber.Location = new System.Drawing.Point(495, 20);
            this.lblNumber.Text = "Number:";

            this.txtNumber.Location = new System.Drawing.Point(555, 17);
            this.txtNumber.Size = new System.Drawing.Size(60, 23);

            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Location = new System.Drawing.Point(0, 60);
            this.pnlCanvas.Size = new System.Drawing.Size(680, 360);
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.lblStatusText });
            this.statusStrip.Location = new System.Drawing.Point(0, 420);
            this.statusStrip.Size = new System.Drawing.Size(680, 22);

            this.ClientSize = new System.Drawing.Size(680, 442);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Robert Lafore - Ordered Array Applet Viewer (C#)";

            this.pnlControls.ResumeLayout(false);
            this.pnlControls.PerformLayout();
            this.grpSearch.ResumeLayout(false);
            this.grpSearch.PerformLayout();
            this.statusStrip.ResumeLayout(false);
            this.statusStrip.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}
