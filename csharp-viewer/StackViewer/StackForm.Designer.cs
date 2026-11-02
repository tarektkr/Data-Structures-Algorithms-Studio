namespace StackViewer
{
    partial class StackForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnPush;
        private System.Windows.Forms.Button btnPop;
        private System.Windows.Forms.Button btnPeek;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblStatus;

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
            this.btnPush = new System.Windows.Forms.Button();
            this.btnPop = new System.Windows.Forms.Button();
            this.btnPeek = new System.Windows.Forms.Button();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.lblStatus = new System.Windows.Forms.ToolStripStatusLabel();

            // pnlControls
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 44;
            this.pnlControls.BackColor = System.Drawing.Color.LightGray;

            // btnNew
            this.btnNew.Text = "New";
            this.btnNew.Location = new System.Drawing.Point(10, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnPush
            this.btnPush.Text = "Push";
            this.btnPush.Location = new System.Drawing.Point(70, 8);
            this.btnPush.Size = new System.Drawing.Size(55, 26);
            this.btnPush.Click += new System.EventHandler(this.BtnPush_Click);

            // btnPop
            this.btnPop.Text = "Pop";
            this.btnPop.Location = new System.Drawing.Point(130, 8);
            this.btnPop.Size = new System.Drawing.Size(55, 26);
            this.btnPop.Click += new System.EventHandler(this.BtnPop_Click);

            // btnPeek
            this.btnPeek.Text = "Peek";
            this.btnPeek.Location = new System.Drawing.Point(190, 8);
            this.btnPeek.Size = new System.Drawing.Size(55, 26);
            this.btnPeek.Click += new System.EventHandler(this.BtnPeek_Click);

            // lblNumber
            this.lblNumber.Text = "Number:";
            this.lblNumber.Location = new System.Drawing.Point(260, 12);
            this.lblNumber.Size = new System.Drawing.Size(55, 20);

            // txtNumber
            this.txtNumber.Text = "42";
            this.txtNumber.Location = new System.Drawing.Point(320, 9);
            this.txtNumber.Size = new System.Drawing.Size(60, 22);

            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnPush);
            this.pnlControls.Controls.Add(this.btnPop);
            this.pnlControls.Controls.Add(this.btnPeek);
            this.pnlControls.Controls.Add(this.lblNumber);
            this.pnlControls.Controls.Add(this.txtNumber);

            // statusStrip
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.lblStatus });

            // Form
            this.ClientSize = new System.Drawing.Size(440, 360);
            this.Controls.Add(this.pnlControls);
            this.Controls.Add(this.statusStrip);
            this.Text = "Lafore's Stack (LIFO) Applet Viewer - C# Windows Forms";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        }
    }
}
