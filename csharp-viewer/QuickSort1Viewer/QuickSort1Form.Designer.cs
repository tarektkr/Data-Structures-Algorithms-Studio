namespace QuickSort1Viewer;

partial class QuickSort1Form
{
    private System.ComponentModel.IContainer components = null!;
    private System.Windows.Forms.Panel topPanel;
    private System.Windows.Forms.Button btnNew;
    private System.Windows.Forms.Button btnSize;
    private System.Windows.Forms.Button btnDraw;
    private System.Windows.Forms.Button btnRun;
    private System.Windows.Forms.Button btnStep;
    private System.Windows.Forms.Panel canvasPanel;

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
        this.topPanel = new System.Windows.Forms.Panel();
        this.btnNew = new System.Windows.Forms.Button();
        this.btnSize = new System.Windows.Forms.Button();
        this.btnDraw = new System.Windows.Forms.Button();
        this.btnRun = new System.Windows.Forms.Button();
        this.btnStep = new System.Windows.Forms.Button();
        this.canvasPanel = new System.Windows.Forms.Panel();

        // topPanel
        this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
        this.topPanel.Height = 40;
        this.topPanel.BackColor = System.Drawing.Color.LightGray;

        // btnNew
        this.btnNew.Text = "New";
        this.btnNew.Location = new System.Drawing.Point(10, 8);
        this.btnNew.Size = new System.Drawing.Size(55, 25);
        this.btnNew.Click += new System.EventHandler(this.btnNew_Click);

        // btnSize
        this.btnSize.Text = "Size";
        this.btnSize.Location = new System.Drawing.Point(70, 8);
        this.btnSize.Size = new System.Drawing.Size(55, 25);
        this.btnSize.Click += new System.EventHandler(this.btnSize_Click);

        // btnDraw
        this.btnDraw.Text = "Draw";
        this.btnDraw.Location = new System.Drawing.Point(130, 8);
        this.btnDraw.Size = new System.Drawing.Size(55, 25);
        this.btnDraw.Click += new System.EventHandler(this.btnDraw_Click);

        // btnRun
        this.btnRun.Text = "Run";
        this.btnRun.Location = new System.Drawing.Point(190, 8);
        this.btnRun.Size = new System.Drawing.Size(55, 25);
        this.btnRun.Click += new System.EventHandler(this.btnRun_Click);

        // btnStep
        this.btnStep.Text = "Step";
        this.btnStep.Location = new System.Drawing.Point(250, 8);
        this.btnStep.Size = new System.Drawing.Size(55, 25);
        this.btnStep.Click += new System.EventHandler(this.btnStep_Click);

        this.topPanel.Controls.Add(this.btnNew);
        this.topPanel.Controls.Add(this.btnSize);
        this.topPanel.Controls.Add(this.btnDraw);
        this.topPanel.Controls.Add(this.btnRun);
        this.topPanel.Controls.Add(this.btnStep);

        // canvasPanel
        this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
        this.canvasPanel.DoubleBuffered = true;
        this.canvasPanel.BackColor = System.Drawing.Color.FromArgb(192, 192, 192);

        // QuickSort1Form
        this.ClientSize = new System.Drawing.Size(380, 360);
        this.Controls.Add(this.canvasPanel);
        this.Controls.Add(this.topPanel);
        this.Text = "QuickSort1 Applet - Robert Lafore";
        this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
        this.MaximizeBox = false;
        this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
    }
}
