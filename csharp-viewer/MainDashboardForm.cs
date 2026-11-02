using System;
using System.Drawing;
using System.Windows.Forms;

namespace RobertLafore_DSA_Studio
{
    public partial class MainDashboardForm : Form
    {
        private Form? activeEmbeddedForm = null;
        private string currentAlgorithmKey = "unordered";

        public MainDashboardForm()
        {
            InitializeComponent();

            treeNavigation.AfterSelect += TreeNavigation_AfterSelect;
            btnLaunchStandalone.Click += BtnLaunchStandalone_Click;

            PopulateAlgorithmTree();

            // تحميل الخوارزمية الأولى افتراضياً
            LoadAlgorithm("unordered", "المصفوفة غير المرتبة (Unordered Array)", "الفصل 2: المصفوفات", "O(N) Search / O(1) Insert");
        }

        private void PopulateAlgorithmTree()
        {
            treeNavigation.BeginUpdate();
            treeNavigation.Nodes.Clear();

            // الفصل 2
            var ch2 = treeNavigation.Nodes.Add("الفصل 2: المصفوفات (Arrays)");
            AddAlgoNode(ch2, "unordered", "المصفوفة غير المرتبة (Unordered)", "الفصل 2", "O(N) Search / O(1) Insert");
            AddAlgoNode(ch2, "ordered", "المصفوفة المرتبة (Ordered)", "الفصل 2", "O(log N) Binary Search");

            // الفصل 3
            var ch3 = treeNavigation.Nodes.Add("الفصل 3: الترتيب البسيط (Sorting)");
            AddAlgoNode(ch3, "bubble", "ترتيب الفقاعة (Bubble Sort)", "الفصل 3", "O(N²)");
            AddAlgoNode(ch3, "select", "ترتيب الاختيار (Selection Sort)", "الفصل 3", "O(N²)");
            AddAlgoNode(ch3, "insert", "ترتيب الإدراج (Insertion Sort)", "الفصل 3", "O(N²) - O(N) Best");

            // الفصل 4
            var ch4 = treeNavigation.Nodes.Add("الفصل 4: المكدسات والطوابير (Stacks & Queues)");
            AddAlgoNode(ch4, "stack", "المكدس (Stack - LIFO)", "الفصل 4", "O(1)");
            AddAlgoNode(ch4, "queue", "الطابور الدائري (Queue - FIFO)", "الفصل 4", "O(1)");
            AddAlgoNode(ch4, "pqueue", "طابور الأولوية (Priority Queue)", "الفصل 4", "O(N) Insert / O(1) Remove");

            // الفصل 5
            var ch5 = treeNavigation.Nodes.Add("الفصل 5: القوائم المرتبطة (Linked Lists)");
            AddAlgoNode(ch5, "linklist", "القائمة المرتبطة (Link List)", "الفصل 5", "O(1) Insert / O(N) Search");

            // الفصل 6 و 8
            var ch68 = treeNavigation.Nodes.Add("الفصل 6 و 8: العودية والدمج (Recursion)");
            AddAlgoNode(ch68, "towers", "أبراج هانوي (Towers of Hanoi)", "الفصل 6", "O(2ⁿ)");
            AddAlgoNode(ch68, "merge", "ترتيب الدمج (Merge Sort)", "الفصل 8", "O(N log N)");

            // الفصل 7
            var ch7 = treeNavigation.Nodes.Add("الفصل 7: الترتيب السريع (QuickSort)");
            AddAlgoNode(ch7, "quick1", "الترتيب السريع 1 (QuickSort 1)", "الفصل 7", "O(N log N) Avg / O(N²) Worst");
            AddAlgoNode(ch7, "quick2", "الترتيب السريع 2 - وسيط الثلاثة", "الفصل 7", "O(N log N) Median-of-3");

            // الفصل 9
            var ch9 = treeNavigation.Nodes.Add("الفصل 9: الشجرة الثنائية (Binary Trees)");
            AddAlgoNode(ch9, "tree", "شجرة البحث الثنائية (BST)", "الفصل 9", "O(log N) Avg / O(N) Worst");

            // الفصل 11
            var ch11 = treeNavigation.Nodes.Add("الفصل 11: جداول الهاش (Hash Tables)");
            AddAlgoNode(ch11, "hash", "المسح الخطي (Linear Probing)", "الفصل 11", "O(1) Avg");
            AddAlgoNode(ch11, "hashchain", "السلاسل المنفصلة (Separate Chaining)", "الفصل 11", "O(1 + λ)");

            // الفصل 13
            var ch13 = treeNavigation.Nodes.Add("الفصل 13: المخططات العامة (Graphs)");
            AddAlgoNode(ch13, "graph", "البحث بالعمق والعرض (DFS & BFS)", "الفصل 13", "O(V + E)");

            // الفصل 14
            var ch14 = treeNavigation.Nodes.Add("الفصل 14: المخططات الموزونة (Weighted Graphs)");
            AddAlgoNode(ch14, "graphw", "شجرة الامتداد الصغرى بريم (Prim's MST)", "الفصل 14", "O(E log V)");
            AddAlgoNode(ch14, "graphdw", "أقصر مسار دكسترا (Dijkstra)", "الفصل 14", "O(V²)");

            treeNavigation.ExpandAll();
            treeNavigation.EndUpdate();

            if (treeNavigation.Nodes.Count > 0 && treeNavigation.Nodes[0].Nodes.Count > 0)
            {
                treeNavigation.SelectedNode = treeNavigation.Nodes[0].Nodes[0];
            }
        }

        private void AddAlgoNode(TreeNode parent, string key, string text, string chapter, string complexity)
        {
            var node = parent.Nodes.Add(key, text);
            node.Tag = new AlgorithmMetadata(key, text, chapter, complexity);
        }

        private void TreeNavigation_AfterSelect(object? sender, TreeViewEventArgs e)
        {
            if (e.Node == null || e.Node.Tag is not AlgorithmMetadata meta)
                return;

            LoadAlgorithm(meta.Key, meta.Title, meta.Chapter, meta.Complexity);
        }

        private void LoadAlgorithm(string key, string title, string chapter, string complexity)
        {
            currentAlgorithmKey = key;
            lblActiveTitle.Text = $"{chapter} : {title}";
            lblComplexityBadge.Text = $"Time: {complexity}";

            pnlModuleHost.SuspendLayout();

            // تنظيف النموذج المعروض حالياً
            if (activeEmbeddedForm != null)
            {
                activeEmbeddedForm.Hide();
                pnlModuleHost.Controls.Remove(activeEmbeddedForm);
                activeEmbeddedForm.Dispose();
                activeEmbeddedForm = null;
            }

            try
            {
                Form newForm = InstantiateViewer(key);
                activeEmbeddedForm = newForm;

                newForm.TopLevel = false;
                newForm.FormBorderStyle = FormBorderStyle.None;
                newForm.Dock = DockStyle.Fill;

                pnlModuleHost.Controls.Add(newForm);
                newForm.Show();
            }
            catch (Exception ex)
            {
                var lblError = new Label
                {
                    Dock = DockStyle.Fill,
                    TextAlign = ContentAlignment.MiddleCenter,
                    Font = new Font("Segoe UI", 11F, FontStyle.Regular),
                    ForeColor = Color.Red,
                    Text = $"تعذر تحميل النموذج [{title}]:\n{ex.Message}"
                };
                pnlModuleHost.Controls.Add(lblError);
            }
            finally
            {
                pnlModuleHost.ResumeLayout(true);
            }
        }

        private void BtnLaunchStandalone_Click(object? sender, EventArgs e)
        {
            try
            {
                Form standalone = InstantiateViewer(currentAlgorithmKey);
                standalone.StartPosition = FormStartPosition.CenterScreen;
                standalone.Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"خطأ في فتح النافذة: {ex.Message}", "تنبيه", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private Form InstantiateViewer(string key)
        {
            return key switch
            {
                "unordered" => new UnorderedArrayViewer.ArrayForm(),
                "ordered" => new OrderedArrayViewer.OrderedForm(),
                "bubble" => new BubbleSortViewer.BubbleSortForm(),
                "select" => new SelectionSortViewer.SelectionSortForm(),
                "insert" => new InsertionSortViewer.InsertionSortForm(),
                "stack" => new StackViewer.StackForm(),
                "queue" => new QueueViewer.QueueForm(),
                "pqueue" => new PriorityQueueViewer.PriorityQueueForm(),
                "linklist" => new LinkListViewer.LinkListForm(),
                "towers" => new TowersViewer.TowersForm(),
                "merge" => new MergeSortViewer.MergeSortForm(),
                "quick1" => new QuickSort1Viewer.QuickSort1Form(),
                "quick2" => new QuickSort2Viewer.QuickSort2Form(),
                "tree" => new TreeViewer.TreeForm(),
                "hash" => new HashViewer.HashForm(),
                "hashchain" => new HashChainViewer.HashChainForm(),
                "graph" => new GraphViewer.GraphForm(),
                "graphdw" => new GraphDWViewer.GraphDWForm(),
                "graphw" => new GraphWViewer.GraphWForm(),
                _ => new UnorderedArrayViewer.ArrayForm()
            };
        }

        private record AlgorithmMetadata(string Key, string Title, string Chapter, string Complexity);
    }
}
