# Prompt & Technical Specification for Visual Studio AI Agent
# موجه ومواصفات تقنية لوكيل الذكاء الاصطناعي في Visual Studio

---

## الغرض من هذا المستند (Objective):
أنت تعمل كمطور برمجيات خبير في **C# و .NET 8.0 Windows Forms**.
المطلوب منك هو دمج جميع مشاريع البريمجات التفاعلية المستقلة والمحولة من كتاب **روبرت لافور (Robert Lafore - Data Structures & Algorithms in Java)** إلى **مشروع موحد واحد قابل للتشغيل مباشرة (Single Unified Executable Project)** داخل Visual Studio 2022 دون الحاجة إلى Node.js أو أي خوادم خارجية.

---

## 1. خلفية المشروع (Project Background):
المشروع هو إعادة بناء وتطوير بريمجات الجافا التعليمية (AWT Workshop Applets) الصادرة مع كتاب خوارزميات وهياكل بيانات روبرت لافور لعام 1998، وتحويلها إلى تطبيق سطح مكتب حديث بتقنية **.NET 8.0 Windows Forms** باستخدام رسم **GDI+** التفاعلي.

### الفصول والمشاريع المنفذة (19 مشروعاً):
1. **الفصل 2: المصفوفات (Arrays)**
   - `UnorderedArray`: مصفوفة غير مرتبة مع بحث خطي وحذف وإدراج وخيار التكرار.
   - `OrderedArray`: مصفوفة مرتبة مع بحث ثنائي $O(\log N)$ ومسح النطاق.
2. **الفصل 3: الترتيب البسيط (Simple Sorting)**
   - `BubbleSort`: ترتيب الفقاعة مع مؤشري outer و inner والتبديل البصري.
   - `SelectionSort`: ترتيب الاختيار مع مؤشر min.
   - `InsertionSort`: ترتيب الإدراج مع إزاحة العناصر ونسخها.
3. **الفصل 4: المكدسات والطوابير (Stacks & Queues)**
   - `Stack`: مكدس LIFO مع عمليات push و pop و peek ومؤشر top.
   - `Queue`: طابور دائري FIFO مع مؤشري front و rear والتفاف المؤشرات.
   - `PriorityQueue`: طابور أولوية مرتب مع إخراج العنصر الأصغر.
4. **الفصل 5: القوائم المرتبطة (Linked Lists)**
   - `LinkList`: قائمة مترابطة أحادية مع روابط وعقد وأسهم متحركة مع خيار مرتبة/غير مرتبة.
5. **الفصل 6 و 8: العودية وترتيب الدمج (Recursion & Merge Sort)**
   - `Towers`: أبراج هانوي مع محاكاة المكدس العودي وتحريك الأقراص بين الأعمدة A و B و C.
   - `MergeSort`: ترتيب الدمج (Divide & Conquer) مع شاشة فرعية لمصفوفة العمل workSpace ومحاكاة مكدس الاستدعاء.
6. **الفصل 7: الترتيب السريع (QuickSort)**
   - `QuickSort1`: الترتيب السريع التقليدي مع اختيار المحور من الطرف والمسح بالمؤشرات.
   - `QuickSort2`: الترتيب السريع بأسلوب وسيط الثلاثة (Median-of-Three Partitioning).
7. **الفصل 9: الشجرة الثنائية (Binary Trees)**
   - `Tree`: شجرة البحث الثنائية (BST) مع رسم العقد والروابط، والاجتياز المرتب Inorder، وعمليات Find و Insert و Delete مع إيجاد الخلف (Successor).
8. **الفصل 11: جداول الهاش (Hash Tables)**
   - `Hash`: جدول الهاش بالمسح الخطي (Linear Probing) مع 60 خلية ورمز الحذف المحجوز `*Del*`.
   - `HashChain`: جدول الهاش بالسلاسل المنفصلة (Separate Chaining) مع 25 قائمة مترابطة وشريط تمرير رأسي.
9. **الفصل 13: المخططات العامة والبحث (Graphs: DFS & BFS & Tree)**
   - `Graph`: مخطط غير موجه وغير موزون (13 رأساً A-M)، سحب حواف بالفأرة، بحث بالعمق DFS باستخدام المكدس، بحث بالعرض BFS باستخدام الطابور، شجرة الامتداد وحذف الحواف الزائدة، ومصفوفة المجاورة (Adjacency Matrix).
10. **الفصل 14: المخططات الموزونة (Weighted Graphs)**
    - `GraphW`: مخطط موزون غير موجه مع خوارزمية بريم (Prim's MST) وطابور أولوية الحواف.
    - `GraphDW`: مخطط موزون وموجه مع خوارزمية دكسترا (Dijkstra's Shortest Path) ومصفوفة أقصر المسارات `sPath`.

---

## 2. المشكلة المطلوب حلها (The Core Task):
حالياً، كل فصل من الفصول السابقة يمتلك ملف مشروع منفصل (`.csproj`) ونقطة دخول خاصة به (`Program.cs`) ونموذج رئيسي (`Form`).
المطلوب هو:
**إنشاء مشروع C# .NET 8.0 موحد باسم `RobertLafore_DSA_Studio` يجمع كل هذه البريمجات في تطبيق نافذة واحدة متكامل مع قائمة تنقل رئيسية.**

---

## 3. المعمارية الهندسية المطلوبة للمشروع الموحد (Target Architecture):

### أ) تحويل النماذج المستقلة إلى عناصر تحكم مستخدم (UserControls):
بدلاً من أن يكون كل بريمج نافذة مستقلة `Form`:
1. تحويل محتوى كل بريمج إلى `UserControl` مستقل (أو إبقاء النماذج وفتحها داخل `Panel` رئيسي عبر خاصية `TopLevel = false`).
   * الخيار الأفضل والأنظف: تحويل كل نموذج `XxxForm` إلى `XxxView : UserControl` يحتوي على أزرار التحكم وشريط Canvas للرسم.
   * الخيار الأسرع والعملي: إبقاء نماذج `Form` كما هي، وتضمينها داخل لوحة الحاوية الرئيسية `mainContentPanel.Controls.Add(form); form.TopLevel = false; form.Dock = DockStyle.Fill; form.Show();`.

### ب) إنشاء نافذة رئيسية أنيقة (Main Dashboard Window):
* اسم النموذج: `MainDashboardForm.cs`.
* التخطيط (Layout):
  * **الشريط الجانبي الأيمن/الأيسر (Sidebar Navigation):** يحتوي على شجرة تصنيف أو قائمة أزرار أنيقة مقسمة حسب الفصول:
    - الفصل 2: المصفوفات (غير المرتبة / المرتبة).
    - الفصل 3: خوارزميات الترتيب البسيط (الفقاعة / الاختيار / الإدراج).
    - الفصل 4: المكدسات والطوابير (المكدس / الطابور / طابور الأولوية).
    - الفصل 5: القوائم المرتبطة.
    - الفصل 6: أبراج هانوي.
    - الفصل 7: الترتيب السريع (1 و 2).
    - الفصل 8: ترتيب الدمج.
    - الفصل 9: الشجرة الثنائية (BST).
    - الفصل 11: جداول الهاش (المسح الخطي / السلاسل المنفصلة).
    - الفصل 13: المخططات العامة (DFS & BFS & Spanning Tree).
    - الفصل 14: المخططات الموزونة (بريم Prim / دكسترا Dijkstra).
  * **المنطقة المركزية (Main Content Area):** لوحة `Panel` كبيرة تستقبل البريمج المختار لعرض واجهته التفاعلية ورسم GDI+ المباشر.
  * **شريط الحالة (Status Bar / Title Header):** يعرض اسم الفصل، والخوارزمية الحالية، والتعقيد الزمني $O(N)$، وزر إعادة التعيين السريع.

### ج) تنظيم مساحات الأسماء (Namespaces & Code Organization):
لتجنب تضارب الأسماء (مثل وجود كلاس `Person` في عدة فصول أو كلاس `Vertex`):
```text
RobertLafore_DSA_Studio/
│
├── RobertLafore_DSA_Studio.csproj
├── Program.cs
├── MainDashboardForm.cs
├── MainDashboardForm.Designer.cs
│
├── Common/
│   ├── IWorkshopModule.cs
│   └── ModernTheme.cs
│
├── Modules/
│   ├── Ch02_Arrays/
│   │   ├── UnorderedArrayView.cs
│   │   ├── OrderedArrayView.cs
│   │   └── Person.cs
│   │
│   ├── Ch03_SimpleSorting/
│   │   ├── BubbleSortView.cs
│   │   ├── SelectionSortView.cs
│   │   └── InsertionSortView.cs
│   │
│   ├── Ch04_StacksQueues/
│   │   ├── StackView.cs
│   │   ├── QueueView.cs
│   │   └── PriorityQueueView.cs
│   │
│   ├── Ch05_LinkedLists/
│   │   └── LinkListView.cs
│   │
│   ├── Ch06_Recursion/
│   │   └── TowersView.cs
│   │
│   ├── Ch07_QuickSort/
│   │   ├── QuickSort1View.cs
│   │   └── QuickSort2View.cs
│   │
│   ├── Ch08_MergeSort/
│   │   └── MergeSortView.cs
│   │
│   ├── Ch09_BinaryTrees/
│   │   └── TreeViewPanel.cs
│   │
│   ├── Ch11_HashTables/
│   │   ├── HashLinearView.cs
│   │   └── HashChainView.cs
│   │
│   ├── Ch13_Graphs/
│   │   └── GraphNView.cs
│   │
│   └── Ch14_WeightedGraphs/
│       ├── GraphWView.cs
│       └── GraphDWView.cs
```

---

## 4. ملف المشروع المطلوب (`RobertLafore_DSA_Studio.csproj`):
```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <ApplicationTitle>Robert Lafore Data Structures &amp; Algorithms Studio</ApplicationTitle>
    <AssemblyName>RobertLafore_DSA_Studio</AssemblyName>
    <RootNamespace>RobertLafore_DSA_Studio</RootNamespace>
  </PropertyGroup>

</Project>
```

---

## 5. كود نقطة الدخول (`Program.cs`):
```csharp
using System;
using System.Windows.Forms;

namespace RobertLafore_DSA_Studio
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new MainDashboardForm());
        }
    }
}
```

---

## 6. كود لوحة القيادة والتنقل السريع (`MainDashboardForm.cs`):
```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

namespace RobertLafore_DSA_Studio
{
    public partial class MainDashboardForm : Form
    {
        private Panel sidebarPanel;
        private Panel contentPanel;
        private Label headerLabel;
        private TreeView navTreeView;
        private Form? currentActiveForm;

        public MainDashboardForm()
        {
            InitializeComponent();
            SetupLayout();
            PopulateNavigation();
        }

        private void SetupLayout()
        {
            this.Text = "روبرت لافور — استوديو هياكل البيانات والخوارزميات (C# .NET 8.0)";
            this.Size = new Size(1100, 750);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            // Header Banner
            var headerPanel = new Panel { Dock = DockStyle.Top, Height = 55, BackColor = Color.FromArgb(15, 23, 42) };
            headerLabel = new Label
            {
                Text = "منصة محاكاة خوارزميات روبرت لافور (Robert Lafore Workshop Studio)",
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 12F, FontStyle.Bold),
                Dock = DockStyle.Fill,
                TextAlign = ContentAlignment.MiddleLeft,
                Padding = new Padding(20, 0, 0, 0)
            };
            headerPanel.Controls.Add(headerLabel);
            this.Controls.Add(headerPanel);

            // Sidebar
            sidebarPanel = new Panel { Dock = DockStyle.Left, Width = 280, BackColor = Color.FromArgb(248, 250, 252) };
            navTreeView = new TreeView
            {
                Dock = DockStyle.Fill,
                BorderStyle = BorderStyle.None,
                BackColor = Color.FromArgb(248, 250, 252),
                Font = new Font("Segoe UI", 9.5F),
                ShowLines = true,
                ShowPlusMinus = true
            };
            navTreeView.AfterSelect += NavTreeView_AfterSelect;
            sidebarPanel.Controls.Add(navTreeView);
            this.Controls.Add(sidebarPanel);

            // Content Panel
            contentPanel = new Panel { Dock = DockStyle.Fill, BackColor = Color.FromArgb(241, 245, 249) };
            this.Controls.Add(contentPanel);
        }

        private void PopulateNavigation()
        {
            var root = navTreeView.Nodes;

            var ch2 = root.Add("الفصل 2: المصفوفات (Arrays)");
            ch2.Nodes.Add("arr_unord", "المصفوفة غير المرتبة (Unordered)");
            ch2.Nodes.Add("arr_ord", "المصفوفة المرتبة (Ordered Array)");

            var ch3 = root.Add("الفصل 3: الترتيب البسيط (Sorting)");
            ch3.Nodes.Add("sort_bubble", "ترتيب الفقاعة (Bubble Sort)");
            ch3.Nodes.Add("sort_select", "ترتيب الاختيار (Selection Sort)");
            ch3.Nodes.Add("sort_insert", "ترتيب الإدراج (Insertion Sort)");

            var ch4 = root.Add("الفصل 4: المكدسات والطوابير");
            ch4.Nodes.Add("stack", "المكدس (Stack)");
            ch4.Nodes.Add("queue", "طابور الانتظار (Queue)");
            ch4.Nodes.Add("pq", "طابور الأولوية (Priority Queue)");

            var ch5 = root.Add("الفصل 5: القوائم المرتبطة");
            ch5.Nodes.Add("linklist", "القائمة المرتبطة (Linked List)");

            var ch6 = root.Add("الفصل 6: العودية (Recursion)");
            ch6.Nodes.Add("towers", "أبراج هانوي (Towers of Hanoi)");

            var ch7 = root.Add("الفصل 7: الترتيب السريع");
            ch7.Nodes.Add("quick1", "الترتيب السريع 1 (QuickSort 1)");
            ch7.Nodes.Add("quick2", "الترتيب السريع 2 - وسيط الثلاثة");

            var ch8 = root.Add("الفصل 8: ترتيب الدمج");
            ch8.Nodes.Add("merge", "ترتيب الدمج (Merge Sort)");

            var ch9 = root.Add("الفصل 9: الشجرة الثنائية");
            ch9.Nodes.Add("tree", "شجرة البحث الثنائية (Binary Tree)");

            var ch11 = root.Add("الفصل 11: جداول الهاش");
            ch11.Nodes.Add("hash_lin", "جدول الهاش بالمسح الخطي");
            ch11.Nodes.Add("hash_chain", "جدول الهاش بالسلاسل المنفصلة");

            var ch13 = root.Add("الفصل 13: المخططات والبحث");
            ch13.Nodes.Add("graph_n", "المخطط غير الموجه (DFS / BFS / Tree)");

            var ch14 = root.Add("الفصل 14: المخططات الموزونة");
            ch14.Nodes.Add("graph_w", "المخطط غير الموجه الموزون (Prim MST)");
            ch14.Nodes.Add("graph_dw", "المخطط الموجه الموزون (Dijkstra)");

            ch2.Expand();
            navTreeView.SelectedNode = ch2.Nodes[0];
        }

        private void NavTreeView_AfterSelect(object? sender, TreeViewEventArgs e)
        {
            if (e.Node == null || e.Node.Nodes.Count > 0) return;

            Form? nextForm = e.Node.Name switch
            {
                "arr_unord" => new UnorderedArrayViewer.ArrayForm(),
                "arr_ord" => new OrderedArrayViewer.OrderedForm(),
                "sort_bubble" => new BubbleSortViewer.BubbleSortForm(),
                "sort_select" => new SelectionSortViewer.SelectionSortForm(),
                "sort_insert" => new InsertionSortViewer.InsertionSortForm(),
                "stack" => new StackViewer.StackForm(),
                "queue" => new QueueViewer.QueueForm(),
                "pq" => new PriorityQueueViewer.PriorityQueueForm(),
                "linklist" => new LinkListViewer.LinkListForm(),
                "towers" => new TowersViewer.TowersForm(),
                "quick1" => new QuickSort1Viewer.QuickSort1Form(),
                "quick2" => new QuickSort2Viewer.QuickSort2Form(),
                "merge" => new MergeSortViewer.MergeSortForm(),
                "tree" => new TreeViewer.TreeForm(),
                "hash_lin" => new HashViewer.HashForm(),
                "hash_chain" => new HashChainViewer.HashChainForm(),
                "graph_n" => new GraphViewer.GraphForm(),
                "graph_w" => new GraphWViewer.GraphWForm(),
                "graph_dw" => new GraphDWViewer.GraphDWForm(),
                _ => null
            };

            if (nextForm != null)
            {
                LoadEmbeddedForm(nextForm, e.Node.Text);
            }
        }

        private void LoadEmbeddedForm(Form form, string title)
        {
            if (currentActiveForm != null)
            {
                currentActiveForm.Close();
                currentActiveForm.Dispose();
            }

            currentActiveForm = form;
            form.TopLevel = false;
            form.FormBorderStyle = FormBorderStyle.None;
            form.Dock = DockStyle.Fill;

            contentPanel.Controls.Clear();
            contentPanel.Controls.Add(form);
            form.Show();

            headerLabel.Text = $"روبرت لافور — {title}";
        }
    }
}
```

---

## 7. خطوات التنفيذ المطلوبة منك (Step-by-Step Instructions for the AI Agent):
1. **أنشئ مشروعاً جديداً** من نوع `Windows Forms App (.NET 8.0)` باسم `RobertLafore_DSA_Studio`.
2. **انسخ ملفات الأكواد الخاصة بكل بريمج** من المجلدات الفرعية الموجودة في المشروع:
   - ضع كل بريمج في Namespace خاص به (مثل `UnorderedArrayViewer`, `OrderedArrayViewer`, `GraphViewer`, إلخ) حتى لا يحدث أي تضارب في أسماء الكلاسات الداخلية مثل `Person` و `Vertex` و `StackX`.
3. **أضف نموذج لوحة القيادة الرئيسي** `MainDashboardForm.cs` واجعله شاشة البداية في `Program.cs`.
4. **تأكد من عدم وجود أي خطأ في البناء** عبر تشغيل:
   ```bash
   dotnet build
   dotnet run
   ```
5. **النتيجة المطلوبة:** عند تشغيل البرنامج يفتح تطبيق ديسكتوب واحد أنيق بمظهر Windows 11 / Windows 10، يضم شجرة تنقل جانبية تمكن المستخدم من الانتقال فوراً بين بريمجات المصفوفات، والترتيب، والمكدس، والطابور، والقوائم المرتبطة، والعودية، والترتيب السريع، والشجرة الثنائية، والهاش، والمخططات دون أي إغلاق للنافذة!
