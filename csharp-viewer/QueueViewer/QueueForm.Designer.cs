namespace QueueViewer
{
    partial class QueueForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnRem;
        private System.Windows.Forms.Button btnPeek;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblStatus;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.pnlControls = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnRem = new System.Windows.Forms.Button();
            this.btnPeek = new System.Windows.Forms.Button();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.lblStatus = new System.Windows.Forms.ToolStripStatusLabel();

            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 44;
            this.pnlControls.BackColor = System.Drawing.Color.LightGray;

            this.btnNew.Text = "New";
            this.btnNew.Location = new System.Drawing.Point(10, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnIns.Text = "Ins";
            this.btnIns.Location = new System.Drawing.Point(70, 8);
            this.btnIns.Size = new System.Drawing.Size(55, 26);
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            this.btnRem.Text = "Rem";
            this.btnRem.Location = new System.Drawing.Point(130, 8);
            this.btnRem.Size = new System.Drawing.Size(55, 26);
            this.btnRem.Click += new System.EventHandler(this.BtnRem_Click);

            this.btnPeek.Text = "Peek";
            this.btnPeek.Location = new System.Drawing.Point(190, 8);
            this.btnPeek.Size = new System.Drawing.Size(55, 26);
            this.btnPeek.Click += new System.EventHandler(this.BtnPeek_Click);

            this.lblNumber.Text = "Number:";
            this.lblNumber.Location = new System.Drawing.Point(260, 12);
            this.lblNumber.Size = new System.Drawing.Size(55, 20);

            this.txtNumber.Text = "42";
            this.txtNumber.Location = new System.Drawing.Point(320, 9);
            this.txtNumber.Size = new System.Drawing.Size(60, 22);

            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnIns);
            this.pnlControls.Controls.Add(this.btnRem);
            this.pnlControls.Controls.Add(this.btnPeek);
            this.pnlControls.Controls.Add(this.lblNumber);
            this.pnlControls.Controls.Add(this.txtNumber);

            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.lblStatus });

            this.ClientSize = new System.Drawing.Size(440, 360);
            this.Controls.Add(this.pnlControls);
            this.Controls.Add(this.statusStrip);
            this.Text = "Lafore's Queue (FIFO) Applet Viewer - C# Windows Forms";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        }
    }
}
