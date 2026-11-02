namespace RobertLafore_DSA_Studio
{
    partial class MainDashboardForm
    {
        private System.ComponentModel.IContainer components = null!;
        private System.Windows.Forms.SplitContainer splitMain;
        private System.Windows.Forms.Panel pnlSidebar;
        private System.Windows.Forms.Label lblSidebarTitle;
        private System.Windows.Forms.Label lblSidebarSubtitle;
        private System.Windows.Forms.TreeView treeNavigation;
        private System.Windows.Forms.Panel pnlContentHeader;
        private System.Windows.Forms.Label lblActiveTitle;
        private System.Windows.Forms.Label lblComplexityBadge;
        private System.Windows.Forms.Button btnLaunchStandalone;
        private System.Windows.Forms.Panel pnlModuleHost;

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
            this.splitMain = new System.Windows.Forms.SplitContainer();
            this.pnlSidebar = new System.Windows.Forms.Panel();
            this.treeNavigation = new System.Windows.Forms.TreeView();
            this.lblSidebarSubtitle = new System.Windows.Forms.Label();
            this.lblSidebarTitle = new System.Windows.Forms.Label();
            this.pnlModuleHost = new System.Windows.Forms.Panel();
            this.pnlContentHeader = new System.Windows.Forms.Panel();
            this.btnLaunchStandalone = new System.Windows.Forms.Button();
            this.lblComplexityBadge = new System.Windows.Forms.Label();
            this.lblActiveTitle = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.splitMain)).BeginInit();
            this.splitMain.Panel1.SuspendLayout();
            this.splitMain.Panel2.SuspendLayout();
            this.splitMain.SuspendLayout();
            this.pnlSidebar.SuspendLayout();
            this.pnlContentHeader.SuspendLayout();
            this.SuspendLayout();
            // 
            // splitMain
            // 
            this.splitMain.Dock = System.Windows.Forms.DockStyle.Fill;
            this.splitMain.FixedPanel = System.Windows.Forms.FixedPanel.Panel1;
            this.splitMain.Location = new System.Drawing.Point(0, 0);
            this.splitMain.Name = "splitMain";
            // 
            // splitMain.Panel1
            // 
            this.splitMain.Panel1.Controls.Add(this.pnlSidebar);
            this.splitMain.Panel1MinSize = 250;
            // 
            // splitMain.Panel2
            // 
            this.splitMain.Panel2.Controls.Add(this.pnlModuleHost);
            this.splitMain.Panel2.Controls.Add(this.pnlContentHeader);
            this.splitMain.Size = new System.Drawing.Size(1260, 780);
            this.splitMain.SplitterDistance = 300;
            this.splitMain.TabIndex = 0;
            // 
            // pnlSidebar
            // 
            this.pnlSidebar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(248)))), ((int)(((byte)(250)))), ((int)(((byte)(252)))));
            this.pnlSidebar.Controls.Add(this.treeNavigation);
            this.pnlSidebar.Controls.Add(this.lblSidebarSubtitle);
            this.pnlSidebar.Controls.Add(this.lblSidebarTitle);
            this.pnlSidebar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlSidebar.Location = new System.Drawing.Point(0, 0);
            this.pnlSidebar.Name = "pnlSidebar";
            this.pnlSidebar.Padding = new System.Windows.Forms.Padding(8);
            this.pnlSidebar.TabIndex = 0;
            // 
            // treeNavigation
            // 
            this.treeNavigation.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.treeNavigation.Dock = System.Windows.Forms.DockStyle.Fill;
            this.treeNavigation.Font = new System.Drawing.Font("Segoe UI", 9.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.treeNavigation.FullRowSelect = true;
            this.treeNavigation.HideSelection = false;
            this.treeNavigation.ItemHeight = 28;
            this.treeNavigation.Location = new System.Drawing.Point(8, 70);
            this.treeNavigation.Name = "treeNavigation";
            this.treeNavigation.ShowLines = true;
            this.treeNavigation.ShowPlusMinus = true;
            this.treeNavigation.ShowRootLines = true;
            this.treeNavigation.Size = new System.Drawing.Size(284, 702);
            this.treeNavigation.TabIndex = 2;
            // 
            // lblSidebarSubtitle
            // 
            this.lblSidebarSubtitle.Dock = System.Windows.Forms.DockStyle.Top;
            this.lblSidebarSubtitle.Font = new System.Drawing.Font("Segoe UI", 8.5F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.lblSidebarSubtitle.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(100)))), ((int)(((byte)(116)))), ((int)(((byte)(139)))));
            this.lblSidebarSubtitle.Location = new System.Drawing.Point(8, 38);
            this.lblSidebarSubtitle.Name = "lblSidebarSubtitle";
            this.lblSidebarSubtitle.Size = new System.Drawing.Size(284, 32);
            this.lblSidebarSubtitle.TabIndex = 1;
            this.lblSidebarSubtitle.Text = "بريمجات روبرت لافور التفاعلية (19 خوارزمية)";
            this.lblSidebarSubtitle.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // lblSidebarTitle
            // 
            this.lblSidebarTitle.Dock = System.Windows.Forms.DockStyle.Top;
            this.lblSidebarTitle.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            this.lblSidebarTitle.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.lblSidebarTitle.Location = new System.Drawing.Point(8, 8);
            this.lblSidebarTitle.Name = "lblSidebarTitle";
            this.lblSidebarTitle.Size = new System.Drawing.Size(284, 30);
            this.lblSidebarTitle.TabIndex = 0;
            this.lblSidebarTitle.Text = "هياكل البيانات والخوارزميات";
            this.lblSidebarTitle.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // pnlModuleHost
            // 
            this.pnlModuleHost.BackColor = System.Drawing.Color.White;
            this.pnlModuleHost.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlModuleHost.Location = new System.Drawing.Point(0, 56);
            this.pnlModuleHost.Name = "pnlModuleHost";
            this.pnlModuleHost.Size = new System.Drawing.Size(956, 724);
            this.pnlModuleHost.TabIndex = 1;
            // 
            // pnlContentHeader
            // 
            this.pnlContentHeader.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(241)))), ((int)(((byte)(245)))), ((int)(((byte)(249)))));
            this.pnlContentHeader.Controls.Add(this.btnLaunchStandalone);
            this.pnlContentHeader.Controls.Add(this.lblComplexityBadge);
            this.pnlContentHeader.Controls.Add(this.lblActiveTitle);
            this.pnlContentHeader.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlContentHeader.Location = new System.Drawing.Point(0, 0);
            this.pnlContentHeader.Name = "pnlContentHeader";
            this.pnlContentHeader.Padding = new System.Windows.Forms.Padding(16, 8, 16, 8);
            this.pnlContentHeader.Size = new System.Drawing.Size(956, 56);
            this.pnlContentHeader.TabIndex = 0;
            // 
            // btnLaunchStandalone
            // 
            this.btnLaunchStandalone.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnLaunchStandalone.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(226)))), ((int)(((byte)(232)))), ((int)(((byte)(240)))));
            this.btnLaunchStandalone.FlatAppearance.BorderSize = 0;
            this.btnLaunchStandalone.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnLaunchStandalone.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.btnLaunchStandalone.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(30)))), ((int)(((byte)(41)))), ((int)(((byte)(59)))));
            this.btnLaunchStandalone.Location = new System.Drawing.Point(760, 12);
            this.btnLaunchStandalone.Name = "btnLaunchStandalone";
            this.btnLaunchStandalone.Size = new System.Drawing.Size(180, 32);
            this.btnLaunchStandalone.TabIndex = 2;
            this.btnLaunchStandalone.Text = "فتح في نافذة مستقلة ↗";
            this.btnLaunchStandalone.UseVisualStyleBackColor = false;
            // 
            // lblComplexityBadge
            // 
            this.lblComplexityBadge.AutoSize = true;
            this.lblComplexityBadge.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(219)))), ((int)(((byte)(234)))), ((int)(((byte)(254)))));
            this.lblComplexityBadge.Font = new System.Drawing.Font("Segoe UI", 8.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            this.lblComplexityBadge.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(29)))), ((int)(((byte)(78)))), ((int)(((byte)(216)))));
            this.lblComplexityBadge.Location = new System.Drawing.Point(400, 19);
            this.lblComplexityBadge.Name = "lblComplexityBadge";
            this.lblComplexityBadge.Padding = new System.Windows.Forms.Padding(6, 2, 6, 2);
            this.lblComplexityBadge.Size = new System.Drawing.Size(86, 19);
            this.lblComplexityBadge.TabIndex = 1;
            this.lblComplexityBadge.Text = "Time: O(N)";
            // 
            // lblActiveTitle
            // 
            this.lblActiveTitle.AutoSize = true;
            this.lblActiveTitle.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            this.lblActiveTitle.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(15)))), ((int)(((byte)(23)))), ((int)(((byte)(42)))));
            this.lblActiveTitle.Location = new System.Drawing.Point(16, 16);
            this.lblActiveTitle.Name = "lblActiveTitle";
            this.lblActiveTitle.Size = new System.Drawing.Size(268, 21);
            this.lblActiveTitle.TabIndex = 0;
            this.lblActiveTitle.Text = "اختر خوارزمية من الشريط الجانبي";
            // 
            // MainDashboardForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1260, 780);
            this.Controls.Add(this.splitMain);
            this.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point);
            this.MinimumSize = new System.Drawing.Size(960, 600);
            this.Name = "MainDashboardForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "روبرت لافور - ستوديو الخوارزميات وهياكل البيانات | Robert Lafore DSA Studio (.NET 8)";
            this.splitMain.Panel1.ResumeLayout(false);
            this.splitMain.Panel2.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.splitMain)).EndInit();
            this.splitMain.ResumeLayout(false);
            this.pnlSidebar.ResumeLayout(false);
            this.pnlContentHeader.ResumeLayout(false);
            this.pnlContentHeader.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}
