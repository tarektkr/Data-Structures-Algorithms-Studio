import JSZip from 'jszip';
import { CSharpSourceFile } from '../types/applet';

export const CSHARP_FILES: CSharpSourceFile[] = [
  {
    name: 'ArrayForm.cs',
    filename: 'ArrayForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية (Windows Forms) ومعالجة أحداث الأزرار، والتحريك المتزامن بالمؤقت.',
    descriptionEn: 'Main Windows Forms GUI handling button events, animations, and GDI+ rendering.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// نافذة العرض الرئيسية للتطبيق (Windows Forms Viewer)
    /// تجسد عارض الأبليت التفاعلي لمصفوفة روبرت لافور غير المرتبة (Unordered Array Applet).
    /// </summary>
    public partial class ArrayForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public ArrayForm()
        {
            InitializeComponent();

            // تفعيل الرسم المزدوج لمنع وميض الشاشة (DoubleBuffering)
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(60);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 250 // سرعة التحريك الافتراضية بالمللي ثانية
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMoreSteps = false;

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                hasMoreSteps = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
            {
                hasMoreSteps = thePersonGroup.StepDelete();
            }

            pnlCanvas.Invalidate();
            UpdateStatus();

            if (!hasMoreSteps)
            {
                animTimer.Stop();
                SetControlsEnabled(true);
            }
        }

        private (bool isNumber, int value) ParseInput()
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int val))
            {
                return (true, val);
            }
            return (false, 0);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.NewArray(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.Fill(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.Insert(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                if (chkStepByStep.Checked)
                {
                    // نمط الخطوة اليدوية
                    SetControlsEnabled(false);
                    btnNextStep.Enabled = true;
                }
                else
                {
                    // تحريك تلقائي بالمؤقت
                    SetControlsEnabled(false);
                    animTimer.Start();
                }
            }
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
            {
                if (chkStepByStep.Checked)
                {
                    SetControlsEnabled(false);
                    btnNextStep.Enabled = true;
                }
                else
                {
                    SetControlsEnabled(false);
                    animTimer.Start();
                }
            }
        }

        private void BtnNextStep_Click(object? sender, EventArgs e)
        {
            bool hasMore = false;
            if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Find)
            {
                hasMore = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == PersonGroup.OperationMode.Del)
            {
                hasMore = thePersonGroup.StepDelete();
            }

            pnlCanvas.Invalidate();
            UpdateStatus();

            if (!hasMore)
            {
                btnNextStep.Enabled = false;
                SetControlsEnabled(true);
            }
        }

        private void RbDupsOk_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbDupsOk.Checked)
            {
                thePersonGroup.SetDupsStatus(true);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void RbNoDups_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbNoDups.Checked)
            {
                thePersonGroup.SetDupsStatus(false);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void TrackSpeed_ValueChanged(object? sender, EventArgs e)
        {
            int speedVal = trackSpeed.Value; // 1 إلى 10
            animTimer.Interval = Math.Max(30, 850 - (speedVal * 80));
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            thePersonGroup.Draw(e.Graphics);
        }

        private void SetControlsEnabled(bool enabled)
        {
            btnNew.Enabled = enabled;
            btnFill.Enabled = enabled;
            btnIns.Enabled = enabled;
            btnFind.Enabled = enabled;
            btnDel.Enabled = enabled;
            txtNumber.Enabled = enabled;
            rbDupsOk.Enabled = enabled;
            rbNoDups.Enabled = enabled;
        }

        private void UpdateStatus()
        {
            lblStatusText.Text = $"الحالة: {thePersonGroup.Note} | عدد العناصر: {thePersonGroup.NPersons} / {thePersonGroup.TotalCells}";
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق هيكل البيانات للمصفوفة غير المرتبة، البحث الخطي، الحذف مع الإزاحة، ورسم الخلايا بـ GDI+.',
    descriptionEn: 'Core data structure logic, linear search, delete with left shift, and GDI+ cell drawing.',
    content: `using System;
using System.Drawing;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل المصفوفة غير المرتبة (PersonGroup)
    /// تطابق منطق وخوارزميات personGroup.class في كتاب خوارزميات وهياكل البيانات لـ Robert Lafore.
    /// تدعم العمليات: New, Fill, Ins, Find, Del بالإضافة إلى التكرار (Duplicates OK / No dups).
    /// </summary>
    public class PersonGroup
    {
        // الثوابت الأساسية للأبعاد والحدود
        public const int ASIZE = 60;      // الحد الأقصى لحجم المصفوفة
        public const int MAX_KEY = 999;   // الحد الأقصى لقيمة المفتاح
        public const int N_COLUMNS = 6;   // عدد الأعمدة
        public const int N_CELLS_PER_COL = 10; // عدد الخلايا في كل عمود

        // أبعاد الرسم وتنسيق واجهة العرض
        public int AppletWidth { get; set; } = 440;
        public int AppletHeight { get; set; } = 320;
        public int LeftMargin { get; set; } = 10;
        public int TopMargin { get; set; } = 89;
        public int ColumnWidth { get; set; } = 85;
        public int CellWidth { get; set; } = 35;
        public int CellHeight { get; set; } = 17;
        public int NoteBoxTop { get; set; } = 55;
        public int NoteBoxHeight { get; set; } = 25;
        public int NoteBoxWidth { get; set; } = 325;

        // حالة المصفوفة والبيانات
        private Person?[] personArray;
        public int TotalCells { get; private set; } = 60;
        public int NPersons { get; private set; } = 0;
        public string Note { get; private set; } = "Press any button";

        // مؤشرات حالة الخوارزمية والتحريك
        public int CurIn { get; private set; } = -1;
        public int OldCurIn { get; private set; } = -1;
        public int LastDeletion { get; private set; } = -1;
        public bool DupsOK { get; private set; } = true;
        public bool IsOKChangeDups { get; private set; } = true;

        // وضع العملية الحالي
        public enum OperationMode { Idle = 0, New = 1, Fill = 2, Ins = 3, Find = 4, Del = 5 }
        public OperationMode CurrentOp { get; private set; } = OperationMode.Idle;
        public int CodePart { get; private set; } = 1;

        private int findKey = 0;
        private int delKey = 0;
        private bool wasJustFound = false;
        private int nDeleted = 0;

        private readonly Random rand = new Random();

        public PersonGroup(int totalSize = ASIZE)
        {
            TotalCells = Math.Clamp(totalSize, 0, ASIZE);
            personArray = new Person?[ASIZE];
            Note = "Press any button";
            CurIn = -1;
            OldCurIn = -1;
        }

        public Person MakePerson(int height)
        {
            int r = 100 + rand.Next(156);
            int g = 100 + rand.Next(156);
            int b = 100 + rand.Next(156);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void SetDupsStatus(bool status)
        {
            if (IsOKChangeDups)
            {
                DupsOK = status;
            }
            else
            {
                Note = "To change duplication status, create array with New";
            }
        }

        public void NewArray(bool isNumber, int size)
        {
            if (!isNumber)
            {
                Note = "Enter size of array to create";
                return;
            }

            if (size < 0 || size > ASIZE)
            {
                Note = $"ERROR: use size between 0 and {ASIZE}";
                return;
            }

            TotalCells = size;
            NPersons = 0;
            personArray = new Person?[ASIZE];
            CurIn = -1;
            OldCurIn = -1;
            IsOKChangeDups = true;
            CurrentOp = OperationMode.Idle;
            Note = $"New array created; total items = {NPersons}";
        }

        public void Fill(bool isNumber, int count)
        {
            if (!isNumber)
            {
                Note = "Enter number of items to fill in";
                return;
            }

            if (count < 0 || count > TotalCells)
            {
                Note = $"ERROR: can't fill more than {TotalCells} cells";
                return;
            }

            NPersons = 0;
            for (int i = 0; i < count; i++)
            {
                int val;
                if (!DupsOK)
                {
                    do
                    {
                        val = rand.Next(MAX_KEY + 1);
                    } while (Contains(val, i));
                }
                else
                {
                    val = rand.Next(MAX_KEY + 1);
                }

                personArray[i] = MakePerson(val);
                NPersons++;
            }

            CurIn = -1;
            OldCurIn = -1;
            IsOKChangeDups = false;
            CurrentOp = OperationMode.Idle;
            Note = $"Fill completed; total items = {NPersons}";
        }

        private bool Contains(int key, int limit)
        {
            for (int i = 0; i < limit; i++)
            {
                if (personArray[i] != null && personArray[i]!.Height == key)
                    return true;
            }
            return false;
        }

        public void Insert(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to insert";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"CAN'T INSERT: need key between 0 and {MAX_KEY}";
                return;
            }

            if (NPersons >= TotalCells)
            {
                Note = "CAN'T INSERT: array is full";
                return;
            }

            if (!DupsOK && Contains(key, NPersons))
            {
                Note = $"CAN'T INSERT: {key} already exists (No dups)";
                return;
            }

            CurIn = NPersons;
            personArray[NPersons] = MakePerson(key);
            NPersons++;
            IsOKChangeDups = false;
            CurrentOp = OperationMode.Idle;
            Note = $"Inserted item with key {key}; total items = {NPersons}";
        }

        public void StartFind(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to find";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"ERROR: use key between 0 and {MAX_KEY}";
                return;
            }

            findKey = key;
            CurIn = 0;
            OldCurIn = -1;
            wasJustFound = false;
            CurrentOp = OperationMode.Find;
            CodePart = 1;
            Note = $"Looking for item with key {findKey}";
        }

        public bool StepFind()
        {
            if (CurrentOp != OperationMode.Find) return false;

            if (CurIn >= NPersons)
            {
                // انتهى البحث دون العثور على العنصر
                Note = $"Can't locate item with key {findKey}";
                CurIn = -1;
                CurrentOp = OperationMode.Idle;
                return false;
            }

            OldCurIn = CurIn;
            if (personArray[CurIn] != null && personArray[CurIn]!.Height == findKey)
            {
                // تم العثور على العنصر المطابق: التوقف فوراً دون مسح بقية المصفوفة
                Note = $"Have found item with key {findKey} at index {CurIn}";
                wasJustFound = true;
                CurrentOp = OperationMode.Idle;
                return false; // إنهاء البحث فوراً وإبقاء CurIn مشيراً للعنصر
            }
            else
            {
                Note = $"Checking index = {CurIn}";
                CurIn++;
                return true;
            }
        }

        public void StartDelete(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to delete";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"ERROR: use key between 0 and {MAX_KEY}";
                return;
            }

            delKey = key;
            CurIn = 0;
            OldCurIn = -1;
            LastDeletion = -1;
            wasJustFound = false;
            nDeleted = 0;
            CurrentOp = OperationMode.Del;
            CodePart = 1;
            Note = $"Enter key of item to delete: {delKey}";
        }

        public bool StepDelete()
        {
            if (CurrentOp != OperationMode.Del) return false;

            if (CodePart == 1) // مرحلة البحث
            {
                if (CurIn >= NPersons)
                {
                    if (nDeleted > 0)
                    {
                        Note = $"Shifts complete; no more items to delete";
                    }
                    else
                    {
                        Note = $"Can't locate item with key {delKey}";
                    }
                    CurIn = -1;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                OldCurIn = CurIn;
                if (personArray[CurIn] != null && personArray[CurIn]!.Height == delKey)
                {
                    nDeleted++;
                    wasJustFound = true;
                    LastDeletion = CurIn;
                    Note = $"Have found and deleted item with key {delKey}";
                    CodePart = 2; // بدء الإزاحة
                    return true;
                }
                else
                {
                    Note = $"Checking index = {CurIn}";
                    CurIn++;
                    return true;
                }
            }
            else if (CodePart == 2) // مرحلة إزاحة العناصر نحو اليسار
            {
                if (CurIn < NPersons - 1)
                {
                    personArray[CurIn] = personArray[CurIn + 1];
                    Note = $"Will shift item {CurIn + 1} to {CurIn}";
                    CurIn++;
                    return true;
                }
                else
                {
                    personArray[NPersons - 1] = null;
                    NPersons--;
                    Note = $"Shifting completed. Total items = {NPersons}";

                    if (DupsOK)
                    {
                        CurIn = LastDeletion;
                        CodePart = 1;
                        return true;
                    }
                    else
                    {
                        CurIn = -1;
                        CurrentOp = OperationMode.Idle;
                        return false;
                    }
                }
            }

            return false;
        }

        public void Draw(Graphics g)
        {
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            using (SolidBrush boxBrush = new SolidBrush(Color.LightGray))
            using (Pen borderPen = new Pen(Color.Gray))
            {
                g.FillRectangle(boxBrush, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            }

            using (Font noteFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString(Note, noteFont, textBrush, 16, NoteBoxTop + 5);
            }

            for (int i = 0; i < TotalCells; i++)
            {
                DrawPersonCell(g, i);
            }
        }

        private void DrawPersonCell(Graphics g, int index)
        {
            int col = index / 10;
            int row = index % 10;
            int cellX = LeftMargin + col * ColumnWidth + 20;
            int cellY = TopMargin + row * (CellHeight + 2);

            using (Font idxFont = new Font("SansSerif", 8f, FontStyle.Regular))
            using (SolidBrush idxBrush = new SolidBrush(Color.DarkSlateGray))
            {
                string idxText = index.ToString();
                int xOffset = index >= 10 ? 16 : 10;
                g.DrawString(idxText, idxFont, idxBrush, cellX - xOffset - 2, cellY + 2);
            }

            using (Pen cellPen = new Pen(Color.Black))
            {
                g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
            }

            if (index < NPersons && personArray[index] != null)
            {
                Person p = personArray[index]!;
                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(barBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }

                using (Font valFont = new Font("SansSerif", 8f, FontStyle.Bold))
                using (SolidBrush valBrush = new SolidBrush(Color.Black))
                using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                {
                    string valText = p.Height.ToString();
                    Rectangle cellRect = new Rectangle(cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                    g.DrawString(valText, valFont, valBrush, cellRect, sf);
                }
            }
            else
            {
                using (SolidBrush emptyBrush = new SolidBrush(Color.WhiteSmoke))
                {
                    g.FillRectangle(emptyBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }
            }

            if (index == CurIn)
            {
                int arrowX = cellX + CellWidth + 5;
                int arrowY = cellY + (CellHeight / 2);

                using (Pen redPen = new Pen(Color.Red, 2f))
                using (SolidBrush redBrush = new SolidBrush(Color.Red))
                {
                    g.DrawLine(redPen, arrowX + 12, arrowY, arrowX, arrowY);
                    Point[] arrowHead = new Point[]
                    {
                        new Point(arrowX, arrowY),
                        new Point(arrowX + 6, arrowY - 4),
                        new Point(arrowX + 6, arrowY + 4)
                    };
                    g.FillPolygon(redBrush, arrowHead);
                }
            }
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل كائن العنصر داخل المصفوفة (القيمة العددية ولون الرسم).',
    descriptionEn: 'Person item model containing numeric key and drawing color.',
    content: `using System.Drawing;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في المصفوفة غير المرتبة (Person / Item)
    /// يحتوي على القيمة العددية (Key / Height) ولون العرض الخاص به.
    /// Replicates the original person.class from Robert Lafore's Java Workshop Applet.
    /// </summary>
    public class Person
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public override string ToString()
        {
            return Height.ToString();
        }
    }
}`
  },
  {
    name: 'ArrayForm.Designer.cs',
    filename: 'ArrayForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'كود تصميم النافذة والأزرار وعناصر التحكم ومخطط الواجهة التلقائي.',
    descriptionEn: 'Windows Forms auto-generated designer code for buttons, inputs, canvas, and layout.',
    content: `namespace UnorderedArrayViewer
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

            // Controls setup
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
            this.pnlControls.Size = new System.Drawing.Size(680, 85);

            // Button New
            this.btnNew.Location = new System.Drawing.Point(12, 12);
            this.btnNew.Size = new System.Drawing.Size(55, 30);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // Button Fill
            this.btnFill.Location = new System.Drawing.Point(73, 12);
            this.btnFill.Size = new System.Drawing.Size(55, 30);
            this.btnFill.Text = "Fill";
            this.btnFill.Click += new System.EventHandler(this.BtnFill_Click);

            // Button Ins
            this.btnIns.Location = new System.Drawing.Point(134, 12);
            this.btnIns.Size = new System.Drawing.Size(55, 30);
            this.btnIns.Text = "Ins";
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // Button Find
            this.btnFind.Location = new System.Drawing.Point(195, 12);
            this.btnFind.Size = new System.Drawing.Size(55, 30);
            this.btnFind.Text = "Find";
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            // Button Del
            this.btnDel.Location = new System.Drawing.Point(256, 12);
            this.btnDel.Size = new System.Drawing.Size(55, 30);
            this.btnDel.Text = "Del";
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            // Duplicates Group
            this.grpDups.Controls.Add(this.rbDupsOk);
            this.grpDups.Controls.Add(this.rbNoDups);
            this.grpDups.Location = new System.Drawing.Point(322, 5);
            this.grpDups.Size = new System.Drawing.Size(165, 40);

            this.rbDupsOk.AutoSize = true;
            this.rbDupsOk.Checked = true;
            this.rbDupsOk.Location = new System.Drawing.Point(6, 14);
            this.rbDupsOk.Text = "Dups OK";
            this.rbDupsOk.CheckedChanged += new System.EventHandler(this.RbDupsOk_CheckedChanged);

            this.rbNoDups.AutoSize = true;
            this.rbNoDups.Location = new System.Drawing.Point(88, 14);
            this.rbNoDups.Text = "No dups";
            this.rbNoDups.CheckedChanged += new System.EventHandler(this.RbNoDups_CheckedChanged);

            // Number Input
            this.lblNumber.Location = new System.Drawing.Point(495, 18);
            this.lblNumber.Size = new System.Drawing.Size(54, 15);
            this.lblNumber.Text = "Number:";

            this.txtNumber.Location = new System.Drawing.Point(555, 15);
            this.txtNumber.Size = new System.Drawing.Size(60, 23);

            // Step by Step and Speed
            this.chkStepByStep.Location = new System.Drawing.Point(14, 52);
            this.chkStepByStep.Size = new System.Drawing.Size(92, 19);
            this.chkStepByStep.Text = "خطوة بخطوة";

            this.btnNextStep.Enabled = false;
            this.btnNextStep.Location = new System.Drawing.Point(115, 48);
            this.btnNextStep.Size = new System.Drawing.Size(85, 26);
            this.btnNextStep.Text = "الخطوة التالية";
            this.btnNextStep.Click += new System.EventHandler(this.BtnNextStep_Click);

            this.lblSpeed.Location = new System.Drawing.Point(230, 53);
            this.lblSpeed.Size = new System.Drawing.Size(42, 15);
            this.lblSpeed.Text = "السرعة:";

            this.trackSpeed.Location = new System.Drawing.Point(275, 48);
            this.trackSpeed.Minimum = 1;
            this.trackSpeed.Maximum = 10;
            this.trackSpeed.Value = 7;
            this.trackSpeed.Size = new System.Drawing.Size(120, 26);
            this.trackSpeed.ValueChanged += new System.EventHandler(this.TrackSpeed_ValueChanged);

            // Canvas Panel
            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Location = new System.Drawing.Point(0, 85);
            this.pnlCanvas.Size = new System.Drawing.Size(680, 350);
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            // Status Bar
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.lblStatusText });
            this.statusStrip.Location = new System.Drawing.Point(0, 435);
            this.statusStrip.Size = new System.Drawing.Size(680, 22);

            this.lblStatusText.Text = "الحالة: اضغط أي زر للبدء";

            // Form
            this.ClientSize = new System.Drawing.Size(680, 457);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
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
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة الانطلاق الرئيسية للتطبيق (Main Method).',
    descriptionEn: 'Application main entry point.',
    content: `using System;
using System.Windows.Forms;

namespace UnorderedArrayViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new ArrayForm());
        }
    }
}`
  },
  {
    name: 'UnorderedArrayViewer.csproj',
    filename: 'UnorderedArrayViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع .NET 8.0 جاهز للتشغيل بـ dotnet run أو في Visual Studio.',
    descriptionEn: 'Modern .NET 8.0 Windows Forms project file ready to build and run.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>UnorderedArrayViewer</RootNamespace>
    <AssemblyName>UnorderedArrayViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت مصفوفة روبرت لافور غير المرتبة بلغة C#</Description>
  </PropertyGroup>

</Project>`
  },
  {
    name: 'UnorderedArrayViewer.sln',
    filename: 'UnorderedArrayViewer.sln',
    language: 'plaintext',
    descriptionAr: 'ملف حل Visual Studio لفتح المشروع بنقرة واحدة.',
    descriptionEn: 'Visual Studio Solution file to open project with a single click.',
    content: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UnorderedArrayViewer", "UnorderedArrayViewer.csproj", "{8F6A3C4D-9B1A-4D2A-B980-C71E2D3F4A5B}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{8F6A3C4D-9B1A-4D2A-B980-C71E2D3F4A5B}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{8F6A3C4D-9B1A-4D2A-B980-C71E2D3F4A5B}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{8F6A3C4D-9B1A-4D2A-B980-C71E2D3F4A5B}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{8F6A3C4D-9B1A-4D2A-B980-C71E2D3F4A5B}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
EndGlobal`
  },
  {
    name: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    descriptionAr: 'دليل شامل باللغتين العربية والإنجليزية لفتح وتشغيل المشروع.',
    descriptionEn: 'Comprehensive guide in Arabic and English to open, build, and run the project.',
    content: `# عارض ومحاكي أبليت المصفوفة غير المرتبة بلغة C# (Windows Forms)
## Robert Lafore - Unordered Array Applet Viewer in C#

هذا المشروع هو تطبيق مكتوب بلغة **C#** باستخدام **Windows Forms (.NET 8.0)** يعيد بناء وتشغيل أبليت جافا الشهير:
\`Lafore's Unordered Array (Array.class, personGroup.class, person.class)\`
من كتاب **Data Structures & Algorithms in Java (Robert Lafore)**.

---

### محتويات المشروع:
1. **\`Person.cs\`**: تمثيل العنصر داخل المصفوفة بقيمته العددية ولونه (يطابق \`person.class\`).
2. **\`PersonGroup.cs\`**: هيكل البيانات وإدارة المصفوفة غير المرتبة (يطابق \`personGroup.class\`):
   - إنشاء مصفوفة جديدة (\`New\`).
   - ملء المصفوفة بعناصر عشوائية (\`Fill\`).
   - إدراج عنصر جديد في النهاية (\`Ins\`).
   - البحث الخطي خطوة بخطوة مع مؤشر سهم أحمر (\`Find\`).
   - الحذف مع إزاحة العناصر المتبقية نحو اليسار خطوة بخطوة (\`Del\`).
   - دعم التكرار أو منعه (\`Dups OK\` / \`No dups\`).
   - رسم عناصر المصفوفة باستخدام محرك رسوميات GDI+.
3. **\`ArrayForm.cs\` & \`ArrayForm.Designer.cs\`**: واجهة المستخدم التفاعلية (تطابق \`Array.class\` و \`Array.html\`).
   - أزرار التحكم: \`New\`, \`Fill\`, \`Ins\`, \`Find\`, \`Del\`.
   - خيارات التكرار: \`Dups OK\`, \`No dups\`.
   - حقل إدخال الأرقام: \`Number:\`.
   - ميزات إضافية: التحكم في سرعة التحريك، ونمط الخطوة اليدوية (Step-by-step).
4. **\`Program.cs\`**: نقطة انطلاق التطبيق.
5. **\`UnorderedArrayViewer.csproj\` & \`.sln\`**: ملفات المشروع والحل لـ Visual Studio.

---

### طريقة التشغيل:
#### الطريقة 1: عبر سطر الأوامر (Terminal / PowerShell)
تأكد من تثبيت .NET 8 SDK:
\`\`\`bash
cd UnorderedArrayViewer
dotnet run
\`\`\`

#### الطريقة 2: عبر Visual Studio (2022 أو أحدث)
1. افتح الملف \`UnorderedArrayViewer.sln\`.
2. اضغط على مفتاح **F5** للتشغيل الفوري.
`
  }
];

export const CSHARP_FILES_ORDERED: CSharpSourceFile[] = [
  {
    name: 'OrderedForm.cs',
    filename: 'OrderedForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة C# Windows Forms للأبليت المرتب مع البحث الثنائي Binary Search والمؤقت.',
    descriptionEn: 'Windows Forms GUI for Ordered Array featuring Binary Search and timer animation.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace OrderedArrayViewer
{
    public partial class OrderedForm : Form
    {
        private readonly OrderedPersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public OrderedForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new OrderedPersonGroup(60);

            animTimer = new System.Windows.Forms.Timer { Interval = 250 };
            animTimer.Tick += AnimTimer_Tick;

            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMoreSteps = false;

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Find)
            {
                hasMoreSteps = thePersonGroup.StepFind();
            }
            else if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Ins)
            {
                hasMoreSteps = thePersonGroup.StepInsert();
            }
            else if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Del)
            {
                hasMoreSteps = thePersonGroup.StepDelete();
            }

            pnlCanvas.Invalidate();
            UpdateStatus();

            if (!hasMoreSteps)
            {
                animTimer.Stop();
                SetControlsEnabled(true);
            }
        }

        private (bool isNumber, int value) ParseInput()
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int val))
            {
                return (true, val);
            }
            return (false, 0);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.NewArray(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.Fill(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartInsert(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Ins)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Find)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            pnlCanvas.Invalidate();
            UpdateStatus();

            if (thePersonGroup.CurrentOp == OrderedPersonGroup.OperationMode.Del)
            {
                SetControlsEnabled(false);
                animTimer.Start();
            }
        }

        private void RbLinear_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbLinear.Checked)
            {
                thePersonGroup.SetSearchType(true);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void RbBinary_CheckedChanged(object? sender, EventArgs e)
        {
            if (rbBinary.Checked)
            {
                thePersonGroup.SetSearchType(false);
                pnlCanvas.Invalidate();
                UpdateStatus();
            }
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            e.Graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            thePersonGroup.Draw(e.Graphics);
        }

        private void SetControlsEnabled(bool enabled)
        {
            btnNew.Enabled = enabled;
            btnFill.Enabled = enabled;
            btnIns.Enabled = enabled;
            btnFind.Enabled = enabled;
            btnDel.Enabled = enabled;
            txtNumber.Enabled = enabled;
            rbLinear.Enabled = enabled;
            rbBinary.Enabled = enabled;
        }

        private void UpdateStatus()
        {
            lblStatusText.Text = $"الحالة: {thePersonGroup.Note} | عدد العناصر: {thePersonGroup.NPersons} / {thePersonGroup.TotalCells}";
        }
    }
}`
  },
  {
    name: 'OrderedPersonGroup.cs',
    filename: 'OrderedPersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق البحث الثنائي Binary Search O(log N)، الإدراج المرتب، وإظهار نطاق البحث.',
    descriptionEn: 'Binary Search O(log N), Ordered Insertion, and Search Range Visualization.',
    content: `using System;
using System.Drawing;

namespace OrderedArrayViewer
{
    public class OrderedPersonGroup
    {
        public const int ASIZE = 60;
        public const int MAX_KEY = 999;
        public const int N_COLUMNS = 6;
        public const int N_CELLS_PER_COL = 10;

        public int AppletWidth { get; set; } = 440;
        public int AppletHeight { get; set; } = 320;
        public int LeftMargin { get; set; } = 10;
        public int TopMargin { get; set; } = 89;
        public int ColumnWidth { get; set; } = 85;
        public int CellWidth { get; set; } = 35;
        public int CellHeight { get; set; } = 17;
        public int NoteBoxTop { get; set; } = 55;
        public int NoteBoxHeight { get; set; } = 25;
        public int NoteBoxWidth { get; set; } = 325;

        private Person?[] personArray;
        public int TotalCells { get; private set; } = 60;
        public int NPersons { get; private set; } = 0;
        public string Note { get; private set; } = "Press any button";

        public int CurIn { get; private set; } = -1;
        public int LowerBound { get; private set; } = 0;
        public int UpperBound { get; private set; } = 0;
        public bool ShowRange { get; private set; } = false;

        public bool IsLinear { get; private set; } = false;
        public bool IsOKChange { get; private set; } = true;

        public enum OperationMode { Idle = 0, New = 1, Fill = 2, Ins = 3, Find = 4, Del = 5 }
        public OperationMode CurrentOp { get; private set; } = OperationMode.Idle;
        public int CodePart { get; private set; } = 1;

        private int insKey = 0;
        private int findKey = 0;
        private int delKey = 0;
        private int insertPoint = 0;
        private int shiftIndex = 0;

        private readonly Random rand = new Random();

        public OrderedPersonGroup(int totalSize = ASIZE)
        {
            TotalCells = Math.Clamp(totalSize, 0, ASIZE);
            personArray = new Person?[ASIZE];
            Note = "Press any button";
        }

        public Person MakePerson(int height)
        {
            int r = 100 + rand.Next(156);
            int g = 100 + rand.Next(156);
            int b = 100 + rand.Next(156);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void SetSearchType(bool linear)
        {
            if (IsOKChange)
            {
                IsLinear = linear;
                Note = linear ? "Uses linear search" : "Uses binary search";
            }
            else
            {
                Note = "To change search type, create array with New";
            }
        }

        public void NewArray(bool isNumber, int size)
        {
            if (!isNumber)
            {
                Note = "Enter size of array to create";
                return;
            }

            if (size < 0 || size > ASIZE)
            {
                Note = $"ERROR: use size between 0 and {ASIZE}";
                return;
            }

            TotalCells = size;
            NPersons = 0;
            personArray = new Person?[ASIZE];
            CurIn = -1;
            ShowRange = false;
            IsOKChange = true;
            CurrentOp = OperationMode.Idle;
            Note = $"New array created; total items = {NPersons}";
        }

        public void Fill(bool isNumber, int count)
        {
            if (!isNumber)
            {
                Note = "Enter number of items to fill in";
                return;
            }

            if (count < 0 || count > TotalCells)
            {
                Note = $"ERROR: can't fill more than {TotalCells} cells";
                return;
            }

            var keys = new System.Collections.Generic.HashSet<int>();
            while (keys.Count < count)
            {
                keys.Add(rand.Next(MAX_KEY + 1));
            }

            var sortedList = new System.Collections.Generic.List<int>(keys);
            sortedList.Sort();

            personArray = new Person?[ASIZE];
            for (int i = 0; i < count; i++)
            {
                personArray[i] = MakePerson(sortedList[i]);
            }

            NPersons = count;
            CurIn = -1;
            ShowRange = false;
            IsOKChange = false;
            CurrentOp = OperationMode.Idle;
            Note = $"Fill completed; total items = {NPersons}";
        }

        public void StartInsert(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to insert";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"CAN'T INSERT: need key between 0 and {MAX_KEY}";
                return;
            }

            if (NPersons >= TotalCells)
            {
                Note = "CAN'T INSERT: array is full";
                return;
            }

            insertPoint = 0;
            for (int i = 0; i < NPersons; i++)
            {
                if (personArray[i] != null)
                {
                    if (personArray[i]!.Height == key)
                    {
                        CurIn = i;
                        Note = $"CAN'T INSERT: duplicate at index {i}";
                        return;
                    }
                    if (personArray[i]!.Height > key)
                    {
                        insertPoint = i;
                        break;
                    }
                    insertPoint = i + 1;
                }
            }

            insKey = key;
            shiftIndex = NPersons - 1;
            CurIn = NPersons > insertPoint ? NPersons - 1 : insertPoint;
            CurrentOp = OperationMode.Ins;
            CodePart = 1;
            IsOKChange = false;
            Note = $"Will insert at index {insertPoint}, following shift";
        }

        public bool StepInsert()
        {
            if (CurrentOp != OperationMode.Ins) return false;

            if (shiftIndex >= insertPoint)
            {
                personArray[shiftIndex + 1] = personArray[shiftIndex];
                CurIn = shiftIndex;
                Note = $"Shifted item from index {shiftIndex} to {shiftIndex + 1}";
                shiftIndex--;
                return true;
            }
            else
            {
                personArray[insertPoint] = MakePerson(insKey);
                NPersons++;
                CurIn = insertPoint;
                CurrentOp = OperationMode.Idle;
                Note = $"Inserted item {insKey} at index {insertPoint}; total items = {NPersons}";
                return false;
            }
        }

        public void StartFind(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to find";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"ERROR: use key between 0 and {MAX_KEY}";
                return;
            }

            findKey = key;
            CurrentOp = OperationMode.Find;

            if (IsLinear)
            {
                CurIn = 0;
                ShowRange = false;
                Note = "Checking index = 0";
            }
            else
            {
                LowerBound = 0;
                UpperBound = NPersons - 1;
                CurIn = (LowerBound + UpperBound) / 2;
                ShowRange = true;
                Note = $"Checking index {CurIn}, range = {LowerBound} to {UpperBound}";
            }
        }

        public bool StepFind()
        {
            if (CurrentOp != OperationMode.Find) return false;

            if (IsLinear)
            {
                if (CurIn >= NPersons)
                {
                    Note = $"Can't locate item with key {findKey}";
                    CurIn = -1;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                if (personArray[CurIn] != null && personArray[CurIn]!.Height == findKey)
                {
                    Note = $"Have found item with key {findKey} at index {CurIn}";
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                if (personArray[CurIn] != null && personArray[CurIn]!.Height > findKey)
                {
                    Note = $"Can't locate item with key {findKey}";
                    CurIn = -1;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                CurIn++;
                Note = $"Checking index = {CurIn}";
                return true;
            }
            else
            {
                if (LowerBound > UpperBound)
                {
                    Note = $"Can't locate item with key {findKey}";
                    CurIn = -1;
                    ShowRange = false;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                if (personArray[CurIn] != null && personArray[CurIn]!.Height == findKey)
                {
                    Note = $"Have found item with key {findKey} at index {CurIn}";
                    ShowRange = false;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                if (personArray[CurIn] != null && findKey < personArray[CurIn]!.Height)
                {
                    UpperBound = CurIn - 1;
                }
                else
                {
                    LowerBound = CurIn + 1;
                }

                if (LowerBound > UpperBound)
                {
                    Note = $"Can't locate item with key {findKey}";
                    CurIn = -1;
                    ShowRange = false;
                    CurrentOp = OperationMode.Idle;
                    return false;
                }

                CurIn = (LowerBound + UpperBound) / 2;
                Note = $"Checking index {CurIn}, range = {LowerBound} to {UpperBound}";
                return true;
            }
        }

        public void StartDelete(bool isNumber, int key)
        {
            if (!isNumber)
            {
                Note = "Enter key of item to delete";
                return;
            }

            if (key < 0 || key > MAX_KEY)
            {
                Note = $"ERROR: use key between 0 and {MAX_KEY}";
                return;
            }

            delKey = key;
            int foundIdx = -1;
            int lb = 0, ub = NPersons - 1;
            while (lb <= ub)
            {
                int mid = (lb + ub) / 2;
                if (personArray[mid] != null && personArray[mid]!.Height == key)
                {
                    foundIdx = mid;
                    break;
                }
                if (personArray[mid] != null && personArray[mid]!.Height < key)
                    lb = mid + 1;
                else
                    ub = mid - 1;
            }

            if (foundIdx == -1)
            {
                Note = $"Can't locate item with key {key}";
                CurIn = -1;
                CurrentOp = OperationMode.Idle;
                return;
            }

            CurIn = foundIdx;
            shiftIndex = foundIdx;
            CurrentOp = OperationMode.Del;
            Note = $"Have found and deleted item with key {key}";
        }

        public bool StepDelete()
        {
            if (CurrentOp != OperationMode.Del) return false;

            if (shiftIndex < NPersons - 1)
            {
                personArray[shiftIndex] = personArray[shiftIndex + 1];
                CurIn = shiftIndex;
                shiftIndex++;
                Note = $"Shifted item from index {shiftIndex} to {shiftIndex - 1}";
                return true;
            }
            else
            {
                personArray[NPersons - 1] = null;
                NPersons--;
                CurIn = -1;
                CurrentOp = OperationMode.Idle;
                Note = $"Shifting completed. Total items = {NPersons}";
                return false;
            }
        }

        public void Draw(Graphics g)
        {
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            using (SolidBrush boxBrush = new SolidBrush(Color.LightGray))
            using (Pen borderPen = new Pen(Color.Gray))
            {
                g.FillRectangle(boxBrush, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            }

            using (Font noteFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString(Note, noteFont, textBrush, 16, NoteBoxTop + 5);
            }

            for (int i = 0; i < TotalCells; i++)
            {
                DrawPersonCell(g, i);
            }
        }

        private void DrawPersonCell(Graphics g, int index)
        {
            int col = index / 10;
            int row = index % 10;
            int cellX = LeftMargin + col * ColumnWidth + 20;
            int cellY = TopMargin + row * (CellHeight + 2);

            using (Font idxFont = new Font("SansSerif", 8f, FontStyle.Regular))
            using (SolidBrush idxBrush = new SolidBrush(Color.DarkSlateGray))
            {
                string idxText = index.ToString();
                int xOffset = index >= 10 ? 16 : 10;
                g.DrawString(idxText, idxFont, idxBrush, cellX - xOffset - 2, cellY + 2);
            }

            using (Pen cellPen = new Pen(Color.Black))
            {
                g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
            }

            if (ShowRange && index >= LowerBound && index <= UpperBound)
            {
                using (Pen rangePen = new Pen(Color.Blue, 2f))
                {
                    g.DrawRectangle(rangePen, cellX - 1, cellY - 1, CellWidth + 2, CellHeight + 2);
                }
            }

            if (index < NPersons && personArray[index] != null)
            {
                Person p = personArray[index]!;
                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(barBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }

                using (Font valFont = new Font("SansSerif", 8f, FontStyle.Bold))
                using (SolidBrush valBrush = new SolidBrush(Color.Black))
                using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                {
                    string valText = p.Height.ToString();
                    Rectangle cellRect = new Rectangle(cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                    g.DrawString(valText, valFont, valBrush, cellRect, sf);
                }
            }
            else
            {
                using (SolidBrush emptyBrush = new SolidBrush(Color.WhiteSmoke))
                {
                    g.FillRectangle(emptyBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }
            }

            if (index == CurIn)
            {
                int arrowX = cellX + CellWidth + 5;
                int arrowY = cellY + (CellHeight / 2);

                using (Pen redPen = new Pen(Color.Red, 2f))
                using (SolidBrush redBrush = new SolidBrush(Color.Red))
                {
                    g.DrawLine(redPen, arrowX + 12, arrowY, arrowX, arrowY);
                    Point[] arrowHead = new Point[]
                    {
                        new Point(arrowX, arrowY),
                        new Point(arrowX + 6, arrowY - 4),
                        new Point(arrowX + 6, arrowY + 4)
                    };
                    g.FillPolygon(redBrush, arrowHead);
                }
            }
        }
    }
}`
  },
  {
    name: 'OrderedArrayViewer.csproj',
    filename: 'OrderedArrayViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع .NET 8.0 لـ Ordered Array Viewer.',
    descriptionEn: '.NET 8.0 project file for Ordered Array Viewer.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>OrderedArrayViewer</RootNamespace>
    <AssemblyName>OrderedArrayViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت المصفوفة المرتبة لـ روبرت لافور بلغة C# (Binary Search)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_BUBBLE: CSharpSourceFile[] = [
  {
    name: 'BubbleSortForm.cs',
    filename: 'BubbleSortForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرئيسية لـ Bubble Sort ومعالجة أزرار New, Size, Draw, Run, Step والتحريك بالمؤقت.',
    descriptionEn: 'Main Windows Forms GUI for Bubble Sort handling New, Size, Draw, Run, Step and Timer animation.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace BubbleSortViewer
{
    /// <summary>
    /// نافذة العرض الرئيسية لتطبيق Bubble Sort بلغة C# (Windows Forms)
    /// تجسد عارض الأبليت التفاعلي لـ روبرت لافور
    /// </summary>
    public partial class BubbleSortForm : Form
    {
        private GroupBS thePersonGroup;
        private readonly System.Windows.Forms.Timer sortTimer;
        private int currentSize = 10;
        private int currentOrder = 1; // 1: Random, 2: Inverse
        private bool isRunning = false;

        public BubbleSortForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new GroupBS(currentSize, currentOrder);

            sortTimer = new System.Windows.Forms.Timer
            {
                Interval = currentSize == 10 ? 250 : 75
            };
            sortTimer.Tick += SortTimer_Tick;

            UpdateUI();
        }

        private void SortTimer_Tick(object? sender, EventArgs e)
        {
            if (isRunning)
            {
                bool continues = thePersonGroup.SortStep();
                pnlCanvas.Invalidate();
                UpdateUI();

                if (!continues)
                {
                    isRunning = false;
                    sortTimer.Stop();
                    btnRun.Text = "Run";
                }
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentOrder = currentOrder == 1 ? 2 : 1;
            thePersonGroup = new GroupBS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnSize_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentSize = currentSize == 10 ? 100 : 10;
            sortTimer.Interval = currentSize == 10 ? 250 : 75;
            thePersonGroup = new GroupBS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDraw_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.DrawMode = 2;
            pnlCanvas.Invalidate();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (thePersonGroup.DoneFlag) return;

            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                sortTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                sortTimer.Stop();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.SortStep();
            thePersonGroup.DrawMode = 1;
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"الحجم: {currentSize} | الترتيب: {(currentOrder == 1 ? "عشوائي" : "معكوس")} | المقارنات: {thePersonGroup.Comps} | التبديلات: {thePersonGroup.Swaps}";
            btnNew.Text = $"New ({(currentOrder == 1 ? "Random" : "Inverse")})";
            btnSize.Text = $"Size ({currentSize})";
        }
    }
}`
  },
  {
    name: 'GroupBS.cs',
    filename: 'GroupBS.cs',
    language: 'csharp',
    descriptionAr: 'منطق خوارزمية الترتيب الفقاعي، المقارنات، التبديلات، ورسم الأعمدة والمؤشرات بتقنية GDI+.',
    descriptionEn: 'Bubble sort logic, comparisons, swaps, and rendering of bars and arrows with GDI+.',
    content: `using System;
using System.Drawing;

namespace BubbleSortViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل خوارزمية الترتيب الفقاعي ورسم الأعمدة والمؤشرات
    /// تتطابق تماماً مع groupBS.class من أبليت روبرت لافور
    /// </summary>
    public class GroupBS
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int TopMargin = 30;
        public const int LeftMargin = 10;
        public const int BarLeftMargin = 35;
        public const int TextHeight = 13;
        public const int BarBaseY = 230;

        public int ASize { get; private set; }
        public PersonBS?[] TheArray { get; private set; }
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int Outer { get; private set; }
        public int Inner { get; private set; }
        public int InnerOld { get; private set; }
        public bool SwapFlag { get; private set; }
        public bool DoneFlag { get; private set; }
        public int Comps { get; private set; }
        public int Swaps { get; private set; }
        public int InitOrder { get; private set; } // 1: Random, 2: Inverse
        public int DrawMode { get; set; } = 2; // 1: partial update, 2: full redraw

        private static readonly Random Rng = new Random();

        public GroupBS(int size, int order)
        {
            ASize = size;
            InitOrder = order;
            TheArray = new PersonBS[ASize];

            if (ASize == 100)
            {
                BarWidth = 2;
                BarSeparation = 1;
            }
            else
            {
                BarWidth = 20;
                BarSeparation = 10;
            }

            Outer = ASize - 1;
            Inner = 0;
            InnerOld = 0;
            Comps = 0;
            Swaps = 0;
            SwapFlag = false;
            DoneFlag = false;
            DrawMode = 2;

            InitializeData();
        }

        private void InitializeData()
        {
            if (InitOrder == 1)
            {
                // ترتيب عشوائي (Random Order)
                for (int i = 0; i < ASize; i++)
                {
                    int height = (int)(Rng.NextDouble() * 199.0) + 1;
                    int r = (int)(Rng.NextDouble() * 254.0);
                    int g = (int)(Rng.NextDouble() * 254.0);
                    int b = (int)(Rng.NextDouble() * 254.0);
                    TheArray[i] = new PersonBS(height, Color.FromArgb(r, g, b));
                }
            }
            else
            {
                // ترتيب معكوس تنازلي (Inverse Order)
                for (int i = 0; i < ASize; i++)
                {
                    int height = Math.Max(1, 199 - (199 * i) / ASize);
                    int r = Math.Min(255, Math.Max(0, 255 - height));
                    int g = (85 * (i % 3)) % 256;
                    int b = height % 256;
                    TheArray[i] = new PersonBS(height, Color.FromArgb(r, g, b));
                }
            }
        }

        public bool SortStep()
        {
            if (DoneFlag) return false;

            Comps++;

            if (TheArray[Inner] != null && TheArray[Inner + 1] != null &&
                TheArray[Inner]!.Height > TheArray[Inner + 1]!.Height)
            {
                Swap(Inner, Inner + 1);
                SwapFlag = true;
                Swaps++;
            }
            else
            {
                SwapFlag = false;
            }

            InnerOld = Inner;
            Inner++;

            if (Inner > Outer - 1)
            {
                Inner = 0;
                Outer--;
                if (Outer <= 0)
                {
                    DoneFlag = true;
                }
            }

            return !DoneFlag;
        }

        public void Swap(int one, int two)
        {
            PersonBS? temp = TheArray[one];
            TheArray[one] = TheArray[two];
            TheArray[two] = temp;
        }

        public void Draw(Graphics g)
        {
            // خلفية الشاشة باللون الرمادي الكلاسيكي
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            // عدادات المقارنات والتبديلات بالأعلى
            using (Font statFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString($"Swaps = {Swaps}", statFont, textBrush, 10, 15);
                g.DrawString($"Comparisons = {Comps}", statFont, textBrush, 10, 30);
            }

            // رسم خط القاعدة للأعمدة
            using (Pen basePen = new Pen(Color.Gray))
            {
                g.DrawLine(basePen, BarLeftMargin - 5, BarBaseY, AppletWidth - 20, BarBaseY);
            }

            // رسم جميع الأعمدة
            for (int i = 0; i < ASize; i++)
            {
                DrawOneBar(g, i);
            }

            // رسم المؤشرات والأسهم تحت الأعمدة
            if (ASize == 10)
            {
                ArrowText(g, Color.Red, "outer", Outer, 6, true, true);
                ArrowText(g, Color.Blue, "inner", Inner, 4, true, true);
                if (Inner + 1 < ASize)
                {
                    ArrowText(g, Color.Blue, "inner+1", Inner + 1, 4, true, true);
                }

                // نص القرار في الأسفل
                if (DoneFlag)
                {
                    using (Font completeFont = new Font("SansSerif", 10f, FontStyle.Bold))
                    using (SolidBrush completeBrush = new SolidBrush(Color.Black))
                    {
                        g.DrawString("Sort is complete", completeFont, completeBrush, (AppletWidth / 2) - 50, BarBaseY + 45);
                    }
                }
                else if (Inner < ASize - 1 && TheArray[Inner] != null && TheArray[Inner + 1] != null)
                {
                    string msg = TheArray[Inner]!.Height > TheArray[Inner + 1]!.Height
                        ? "Will be swapped"
                        : "Will not be swapped";

                    using (Font msgFont = new Font("SansSerif", 9f, FontStyle.Bold))
                    using (SolidBrush msgBrush = new SolidBrush(Color.Blue))
                    {
                        g.DrawString(msg, msgFont, msgBrush, (AppletWidth / 2) - 60, BarBaseY + 45);
                    }
                }
            }
            else
            {
                // عندما يكون الحجم 100
                ArrowText(g, Color.Red, "", Outer, 6, true, false);
                ArrowText(g, Color.Blue, "", Inner, 4, true, false);
            }
        }

        public void DrawOneBar(Graphics g, int index)
        {
            if (index < 0 || index >= ASize || TheArray[index] == null) return;

            PersonBS p = TheArray[index]!;
            int barX = BarLeftMargin + index * (BarWidth + BarSeparation);
            int barY = BarBaseY - p.Height;

            using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
            {
                g.FillRectangle(barBrush, barX, barY, BarWidth, p.Height);
            }

            // تأثير الأبعاد الثلاثية 3D Bevel
            using (Pen lightPen = new Pen(Color.White))
            using (Pen darkPen = new Pen(Color.DarkGray))
            {
                g.DrawLine(lightPen, barX, barY + p.Height, barX, barY);
                g.DrawLine(lightPen, barX, barY, barX + BarWidth, barY);

                g.DrawLine(darkPen, barX + BarWidth, barY, barX + BarWidth, barY + p.Height);
            }

            // كتابة القيمة العددية فوق العمود إذا كان الحجم 10
            if (ASize == 10)
            {
                using (Font numFont = new Font("SansSerif", 7f, FontStyle.Bold))
                using (SolidBrush numBrush = new SolidBrush(Color.Black))
                {
                    string valStr = p.Height.ToString();
                    g.DrawString(valStr, numFont, numBrush, barX - 1, barY - 12);
                }
            }
        }

        private void ArrowText(Graphics g, Color color, string text, int index, int offsetLevel, bool drawArrow, bool drawText)
        {
            if (index < 0 || index >= ASize) return;

            int x = BarLeftMargin + index * (BarWidth + BarSeparation) + (BarWidth / 2);
            int arrowBaseY = BarBaseY + 2;

            using (Pen p = new Pen(color, 2f))
            using (SolidBrush b = new SolidBrush(color))
            {
                if (drawArrow)
                {
                    // خط السهم يشير للأعلى نحو العمود
                    g.DrawLine(p, x, arrowBaseY + 14, x, arrowBaseY + 3);

                    // رأس السهم
                    Point[] head = new Point[]
                    {
                        new Point(x, arrowBaseY + 2),
                        new Point(x - 3, arrowBaseY + 7),
                        new Point(x + 3, arrowBaseY + 7)
                    };
                    g.FillPolygon(b, head);
                }

                if (drawText && !string.IsNullOrEmpty(text))
                {
                    using (Font labelFont = new Font("SansSerif", 8f, FontStyle.Bold))
                    {
                        g.DrawString(text, labelFont, b, x - 12, arrowBaseY + 18);
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'PersonBS.cs',
    filename: 'PersonBS.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل العمود البياني (العنصر) بارتفاع ولون مميزين.',
    descriptionEn: 'Vertical bar data item with height and color.',
    content: `using System.Drawing;

namespace BubbleSortViewer
{
    /// <summary>
    /// يمثل عنصر البيانات (العمود الرأسي) في خوارزمية الترتيب الفقاعي
    /// يتطابق بدقة مع كلاس personBS.class من أبليت روبرت لافور
    /// </summary>
    public class PersonBS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonBS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}`
  },
  {
    name: 'BubbleSortForm.Designer.cs',
    filename: 'BubbleSortForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر واجهة المستخدم والأزرار واللوحات التفاعلية في Windows Forms.',
    descriptionEn: 'Designer file declaring controls and panels in Windows Forms.',
    content: `namespace BubbleSortViewer
{
    partial class BubbleSortForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnSize;
        private System.Windows.Forms.Button btnDraw;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Panel pnlCanvas;

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
            this.btnSize = new System.Windows.Forms.Button();
            this.btnDraw = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.pnlControls.SuspendLayout();
            this.SuspendLayout();

            // pnlControls
            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnSize);
            this.pnlControls.Controls.Add(this.btnDraw);
            this.pnlControls.Controls.Add(this.btnRun);
            this.pnlControls.Controls.Add(this.btnStep);
            this.pnlControls.Controls.Add(this.lblStatus);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 50;

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(10, 10);
            this.btnNew.Size = new System.Drawing.Size(90, 30);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnSize
            this.btnSize.Location = new System.Drawing.Point(105, 10);
            this.btnSize.Size = new System.Drawing.Size(75, 30);
            this.btnSize.Text = "Size";
            this.btnSize.UseVisualStyleBackColor = true;
            this.btnSize.Click += new System.EventHandler(this.BtnSize_Click);

            // btnDraw
            this.btnDraw.Location = new System.Drawing.Point(185, 10);
            this.btnDraw.Size = new System.Drawing.Size(65, 30);
            this.btnDraw.Text = "Draw";
            this.btnDraw.UseVisualStyleBackColor = true;
            this.btnDraw.Click += new System.EventHandler(this.BtnDraw_Click);

            // btnRun
            this.btnRun.Location = new System.Drawing.Point(255, 10);
            this.btnRun.Size = new System.Drawing.Size(65, 30);
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            // btnStep
            this.btnStep.Location = new System.Drawing.Point(325, 10);
            this.btnStep.Size = new System.Drawing.Size(65, 30);
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            // pnlCanvas
            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            // BubbleSortForm
            this.ClientSize = new System.Drawing.Size(420, 390);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "BubbleSortForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore Bubble Sort Applet Viewer (C# Windows Forms)";
            this.pnlControls.ResumeLayout(false);
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق C# وتشغيل النموذج BubbleSortForm.',
    descriptionEn: 'Main entry point initializing Application and running BubbleSortForm.',
    content: `using System;
using System.Windows.Forms;

namespace BubbleSortViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new BubbleSortForm());
        }
    }
}`
  },
  {
    name: 'BubbleSortViewer.csproj',
    filename: 'BubbleSortViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع .NET 8.0 لـ Bubble Sort Viewer.',
    descriptionEn: '.NET 8.0 project file for Bubble Sort Viewer.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>BubbleSortViewer</RootNamespace>
    <AssemblyName>BubbleSortViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت الترتيب الفقاعي لـ روبرت لافور بلغة C# (Bubble Sort)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_SELECT: CSharpSourceFile[] = [
  {
    name: 'SelectionSortForm.cs',
    filename: 'SelectionSortForm.cs',
    language: 'csharp',
    descriptionAr: 'نافذة العرض الرئيسية لتطبيق ترتيب الاختيار (Selection Sort) ومعالجة الأحداث.',
    descriptionEn: 'Main Windows Forms GUI for Selection Sort handling events and animation.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace SelectionSortViewer
{
    public partial class SelectionSortForm : Form
    {
        private GroupSS thePersonGroup;
        private readonly System.Windows.Forms.Timer sortTimer;
        private int currentSize = 10;
        private int currentOrder = 1;
        private bool isRunning = false;

        public SelectionSortForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new GroupSS(currentSize, currentOrder);

            sortTimer = new System.Windows.Forms.Timer
            {
                Interval = currentSize == 10 ? 250 : 75
            };
            sortTimer.Tick += SortTimer_Tick;

            UpdateUI();
        }

        private void SortTimer_Tick(object? sender, EventArgs e)
        {
            if (isRunning)
            {
                bool continues = thePersonGroup.SortStep();
                pnlCanvas.Invalidate();
                UpdateUI();

                if (!continues)
                {
                    isRunning = false;
                    sortTimer.Stop();
                    btnRun.Text = "Run";
                }
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentOrder = currentOrder == 1 ? 2 : 1;
            thePersonGroup = new GroupSS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnSize_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentSize = currentSize == 10 ? 100 : 10;
            sortTimer.Interval = currentSize == 10 ? 250 : 75;
            thePersonGroup = new GroupSS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDraw_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.DrawMode = 2;
            pnlCanvas.Invalidate();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (thePersonGroup.DoneFlag) return;

            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                sortTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                sortTimer.Stop();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.SortStep();
            thePersonGroup.DrawMode = 1;
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"الحجم: {currentSize} | الترتيب: {(currentOrder == 1 ? "عشوائي" : "معكوس")} | المقارنات: {thePersonGroup.Comps} | التبديلات: {thePersonGroup.Swaps}";
            btnNew.Text = $"New ({(currentOrder == 1 ? "Random" : "Inverse")})";
            btnSize.Text = $"Size ({currentSize})";
        }
    }
}`
  },
  {
    name: 'GroupSS.cs',
    filename: 'GroupSS.cs',
    language: 'csharp',
    descriptionAr: 'منطق خوارزمية ترتيب الاختيار والبحث عن الأصغر وتبديل outer و min.',
    descriptionEn: 'Selection sort logic, search for minimum, and outer/min swaps.',
    content: `using System;
using System.Drawing;

namespace SelectionSortViewer
{
    public class GroupSS
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int TopMargin = 30;
        public const int LeftMargin = 10;
        public const int BarLeftMargin = 35;
        public const int TextHeight = 13;
        public const int BarBaseY = 230;

        public int ASize { get; private set; }
        public PersonSS?[] TheArray { get; private set; }
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int Outer { get; private set; }
        public int Inner { get; private set; }
        public int Min { get; private set; }
        public int OuterOld { get; private set; }
        public int MinOld { get; private set; }
        public bool SearchFlag { get; private set; }
        public bool SwapFlag { get; private set; }
        public bool DoneFlag { get; private set; }
        public int Comps { get; private set; }
        public int Swaps { get; private set; }
        public int InitOrder { get; private set; }
        public int DrawMode { get; set; } = 2;

        private static readonly Random Rng = new Random();

        public GroupSS(int size, int order)
        {
            ASize = size;
            InitOrder = order;
            TheArray = new PersonSS[ASize];

            if (ASize == 100)
            {
                BarWidth = 2;
                BarSeparation = 1;
            }
            else
            {
                BarWidth = 20;
                BarSeparation = 10;
            }

            Outer = 0;
            Inner = 1;
            Min = 0;
            OuterOld = 0;
            MinOld = 0;
            SearchFlag = true;
            SwapFlag = false;
            DoneFlag = false;
            Comps = 0;
            Swaps = 0;
            DrawMode = 2;

            InitializeData();
        }

        private void InitializeData()
        {
            if (InitOrder == 1)
            {
                for (int i = 0; i < ASize; i++)
                {
                    int height = (int)(Rng.NextDouble() * 199.0) + 1;
                    int r = (int)(Rng.NextDouble() * 254.0);
                    int g = (int)(Rng.NextDouble() * 254.0);
                    int b = (int)(Rng.NextDouble() * 254.0);
                    TheArray[i] = new PersonSS(height, Color.FromArgb(r, g, b));
                }
            }
            else
            {
                for (int i = 0; i < ASize; i++)
                {
                    int height = Math.Max(1, 199 - (199 * i) / ASize);
                    int r = Math.Min(255, Math.Max(0, 255 - height));
                    int g = (85 * (i % 3)) % 256;
                    int b = height % 256;
                    TheArray[i] = new PersonSS(height, Color.FromArgb(r, g, b));
                }
            }
        }

        public bool SortStep()
        {
            if (DoneFlag) return false;

            if (SearchFlag)
            {
                Comps++;
                if (TheArray[Inner] != null && TheArray[Min] != null &&
                    TheArray[Inner]!.Height < TheArray[Min]!.Height)
                {
                    MinOld = Min;
                    Min = Inner;
                }
                Inner++;
                if (Inner > ASize - 1)
                {
                    SearchFlag = false;
                }
            }
            else
            {
                if (Min != Outer)
                {
                    Swap(Outer, Min);
                    SwapFlag = true;
                    Swaps++;
                }
                else
                {
                    SwapFlag = false;
                }

                OuterOld = Outer;
                Outer++;
                Inner = Outer + 1;
                MinOld = Min;
                Min = Outer;
                SearchFlag = true;

                if (Outer > ASize - 2)
                {
                    DoneFlag = true;
                }
            }

            return !DoneFlag;
        }

        public void Swap(int one, int two)
        {
            PersonSS? temp = TheArray[one];
            TheArray[one] = TheArray[two];
            TheArray[two] = temp;
        }

        public void Draw(Graphics g)
        {
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            using (Font statFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString($"Swaps = {Swaps}", statFont, textBrush, 10, 15);
                g.DrawString($"Comparisons = {Comps}", statFont, textBrush, 10, 30);
            }

            using (Pen basePen = new Pen(Color.Gray))
            {
                g.DrawLine(basePen, BarLeftMargin - 5, BarBaseY, AppletWidth - 20, BarBaseY);
            }

            for (int i = 0; i < ASize; i++)
            {
                DrawOneBar(g, i);
            }

            if (ASize == 10)
            {
                ArrowText(g, Color.Red, "outer", Outer, 4, true, true);
                if (Inner < ASize && SearchFlag)
                {
                    ArrowText(g, Color.Blue, "inner", Inner, 5, true, true);
                }
                ArrowText(g, Color.Magenta, "min", Min, 6, true, true);

                using (Font msgFont = new Font("SansSerif", 9f, FontStyle.Bold))
                using (SolidBrush msgBrush = new SolidBrush(Color.Black))
                {
                    string msg = DoneFlag
                        ? "Sort is complete"
                        : SearchFlag
                        ? "Searching for minimum"
                        : Outer == Min
                        ? "No swap necessary"
                        : "Will swap outer & min";

                    g.DrawString(msg, msgFont, msgBrush, (AppletWidth / 2) - 60, BarBaseY + 45);
                }
            }
            else
            {
                ArrowText(g, Color.Red, "", Outer, 4, true, false);
                if (SearchFlag) ArrowText(g, Color.Blue, "", Inner, 5, true, false);
                ArrowText(g, Color.Magenta, "", Min, 6, true, false);
            }
        }

        public void DrawOneBar(Graphics g, int index)
        {
            if (index < 0 || index >= ASize || TheArray[index] == null) return;

            PersonSS p = TheArray[index]!;
            int barX = BarLeftMargin + index * (BarWidth + BarSeparation);
            int barY = BarBaseY - p.Height;

            using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
            {
                g.FillRectangle(barBrush, barX, barY, BarWidth, p.Height);
            }

            using (Pen lightPen = new Pen(Color.White))
            using (Pen darkPen = new Pen(Color.DarkGray))
            {
                g.DrawLine(lightPen, barX, barY + p.Height, barX, barY);
                g.DrawLine(lightPen, barX, barY, barX + BarWidth, barY);
                g.DrawLine(darkPen, barX + BarWidth, barY, barX + BarWidth, barY + p.Height);
            }

            if (ASize == 10)
            {
                using (Font numFont = new Font("SansSerif", 7f, FontStyle.Bold))
                using (SolidBrush numBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(p.Height.ToString(), numFont, numBrush, barX - 1, barY - 12);
                }
            }
        }

        private void ArrowText(Graphics g, Color color, string text, int index, int offsetLevel, bool drawArrow, bool drawText)
        {
            if (index < 0 || index >= ASize) return;

            int x = BarLeftMargin + index * (BarWidth + BarSeparation) + (BarWidth / 2);
            int arrowBaseY = BarBaseY + 2;

            using (Pen p = new Pen(color, 2f))
            using (SolidBrush b = new SolidBrush(color))
            {
                if (drawArrow)
                {
                    g.DrawLine(p, x, arrowBaseY + 14, x, arrowBaseY + 3);
                    Point[] head = new Point[]
                    {
                        new Point(x, arrowBaseY + 2),
                        new Point(x - 3, arrowBaseY + 7),
                        new Point(x + 3, arrowBaseY + 7)
                    };
                    g.FillPolygon(b, head);
                }

                if (drawText && !string.IsNullOrEmpty(text))
                {
                    using (Font labelFont = new Font("SansSerif", 8f, FontStyle.Bold))
                    {
                        g.DrawString(text, labelFont, b, x - 12, arrowBaseY + 18);
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'PersonSS.cs',
    filename: 'PersonSS.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل عنصر البيانات في ترتيب الاختيار.',
    descriptionEn: 'Item representation in Selection Sort.',
    content: `using System.Drawing;

namespace SelectionSortViewer
{
    public class PersonSS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonSS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}`
  },
  {
    name: 'SelectionSortForm.Designer.cs',
    filename: 'SelectionSortForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر واجهة المستخدم لـ Selection Sort.',
    descriptionEn: 'Designer for Selection Sort Form.',
    content: `namespace SelectionSortViewer
{
    partial class SelectionSortForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnSize;
        private System.Windows.Forms.Button btnDraw;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Panel pnlCanvas;

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
            this.btnSize = new System.Windows.Forms.Button();
            this.btnDraw = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.pnlControls.SuspendLayout();
            this.SuspendLayout();

            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnSize);
            this.pnlControls.Controls.Add(this.btnDraw);
            this.pnlControls.Controls.Add(this.btnRun);
            this.pnlControls.Controls.Add(this.btnStep);
            this.pnlControls.Controls.Add(this.lblStatus);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 50;

            this.btnNew.Location = new System.Drawing.Point(10, 10);
            this.btnNew.Size = new System.Drawing.Size(90, 30);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnSize.Location = new System.Drawing.Point(105, 10);
            this.btnSize.Size = new System.Drawing.Size(75, 30);
            this.btnSize.Text = "Size";
            this.btnSize.UseVisualStyleBackColor = true;
            this.btnSize.Click += new System.EventHandler(this.BtnSize_Click);

            this.btnDraw.Location = new System.Drawing.Point(185, 10);
            this.btnDraw.Size = new System.Drawing.Size(65, 30);
            this.btnDraw.Text = "Draw";
            this.btnDraw.UseVisualStyleBackColor = true;
            this.btnDraw.Click += new System.EventHandler(this.BtnDraw_Click);

            this.btnRun.Location = new System.Drawing.Point(255, 10);
            this.btnRun.Size = new System.Drawing.Size(65, 30);
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            this.btnStep.Location = new System.Drawing.Point(325, 10);
            this.btnStep.Size = new System.Drawing.Size(65, 30);
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            this.ClientSize = new System.Drawing.Size(420, 390);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "SelectionSortForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore Selection Sort Applet Viewer (C# Windows Forms)";
            this.pnlControls.ResumeLayout(false);
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق Selection Sort.',
    descriptionEn: 'Entry point for Selection Sort.',
    content: `using System;
using System.Windows.Forms;

namespace SelectionSortViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SelectionSortForm());
        }
    }
}`
  },
  {
    name: 'SelectionSortViewer.csproj',
    filename: 'SelectionSortViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع SelectionSortViewer.',
    descriptionEn: 'Project file for SelectionSortViewer.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>SelectionSortViewer</RootNamespace>
    <AssemblyName>SelectionSortViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت ترتيب الاختيار لـ روبرت لافور بلغة C# (Selection Sort)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_INSERT: CSharpSourceFile[] = [
  {
    name: 'InsertionSortForm.cs',
    filename: 'InsertionSortForm.cs',
    language: 'csharp',
    descriptionAr: 'نافذة العرض الرئيسية لتطبيق ترتيب الإدراج (Insertion Sort).',
    descriptionEn: 'Main Windows Forms GUI for Insertion Sort.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace InsertionSortViewer
{
    public partial class InsertionSortForm : Form
    {
        private GroupIS thePersonGroup;
        private readonly System.Windows.Forms.Timer sortTimer;
        private int currentSize = 10;
        private int currentOrder = 1;
        private bool isRunning = false;

        public InsertionSortForm()
        {
            InitializeComponent();

            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new GroupIS(currentSize, currentOrder);

            sortTimer = new System.Windows.Forms.Timer
            {
                Interval = currentSize == 10 ? 250 : 75
            };
            sortTimer.Tick += SortTimer_Tick;

            UpdateUI();
        }

        private void SortTimer_Tick(object? sender, EventArgs e)
        {
            if (isRunning)
            {
                bool continues = thePersonGroup.SortStep();
                pnlCanvas.Invalidate();
                UpdateUI();

                if (!continues)
                {
                    isRunning = false;
                    sortTimer.Stop();
                    btnRun.Text = "Run";
                }
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentOrder = currentOrder == 1 ? 2 : 1;
            thePersonGroup = new GroupIS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnSize_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            currentSize = currentSize == 10 ? 100 : 10;
            sortTimer.Interval = currentSize == 10 ? 250 : 75;
            thePersonGroup = new GroupIS(currentSize, currentOrder);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDraw_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.DrawMode = 2;
            pnlCanvas.Invalidate();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (thePersonGroup.DoneFlag) return;

            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                sortTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                sortTimer.Stop();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            sortTimer.Stop();
            btnRun.Text = "Run";

            thePersonGroup.SortStep();
            thePersonGroup.DrawMode = 1;
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"الحجم: {currentSize} | الترتيب: {(currentOrder == 1 ? "عشوائي" : "معكوس")} | المقارنات: {thePersonGroup.Comps} | النسخ: {thePersonGroup.Copies}";
            btnNew.Text = $"New ({(currentOrder == 1 ? "Random" : "Inverse")})";
            btnSize.Text = $"Size ({currentSize})";
        }
    }
}`
  },
  {
    name: 'GroupIS.cs',
    filename: 'GroupIS.cs',
    language: 'csharp',
    descriptionAr: 'منطق خوارزمية ترتيب الإدراج وإزاحة العناصر لليمين واستخدام متغير temp.',
    descriptionEn: 'Insertion sort logic with right shifts and temp item.',
    content: `using System;
using System.Drawing;

namespace InsertionSortViewer
{
    public class GroupIS
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int TopMargin = 30;
        public const int LeftMargin = 10;
        public const int BarLeftMargin = 20;
        public const int TextHeight = 13;
        public const int BarBaseY = 230;

        public int ASize { get; private set; }
        public PersonIS?[] TheArray { get; private set; }
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int Outer { get; private set; }
        public int Inner { get; private set; }
        public int OuterOld { get; private set; }
        public int InnerOld { get; private set; }
        public bool DoneFlag { get; private set; }
        public int CodePart { get; private set; }
        public int Comps { get; private set; }
        public int Copies { get; private set; }
        public int InitOrder { get; private set; }
        public int DrawMode { get; set; } = 2;

        private static readonly Random Rng = new Random();

        public GroupIS(int size, int order)
        {
            ASize = size;
            InitOrder = order;
            TheArray = new PersonIS[ASize + 1];

            if (ASize == 100)
            {
                BarWidth = 2;
                BarSeparation = 1;
            }
            else
            {
                BarWidth = 18;
                BarSeparation = 8;
            }

            Outer = 1;
            Inner = 1;
            OuterOld = 0;
            InnerOld = 0;
            DoneFlag = false;
            CodePart = 1;
            Comps = 0;
            Copies = 0;
            DrawMode = 2;

            InitializeData();
        }

        private void InitializeData()
        {
            if (InitOrder == 1)
            {
                for (int i = 0; i < ASize; i++)
                {
                    int height = (int)(Rng.NextDouble() * 199.0) + 1;
                    int r = (int)(Rng.NextDouble() * 254.0);
                    int g = (int)(Rng.NextDouble() * 254.0);
                    int b = (int)(Rng.NextDouble() * 254.0);
                    TheArray[i] = new PersonIS(height, Color.FromArgb(r, g, b));
                }
            }
            else
            {
                for (int i = 0; i < ASize; i++)
                {
                    int height = Math.Max(1, 199 - (199 * i) / ASize);
                    int r = Math.Min(255, Math.Max(0, 255 - height));
                    int g = (85 * (i % 3)) % 256;
                    int b = height % 256;
                    TheArray[i] = new PersonIS(height, Color.FromArgb(r, g, b));
                }
            }
            TheArray[ASize] = null;
        }

        public bool SortStep()
        {
            if (DoneFlag) return false;

            if (CodePart == 1)
            {
                TheArray[ASize] = TheArray[Outer];
                TheArray[Outer] = null;
                Copies++;
                InnerOld = Inner;
                Inner = Outer;
                CodePart = 2;
            }
            else if (CodePart == 2)
            {
                Comps++;
                if (Inner > 0 && TheArray[Inner - 1] != null && TheArray[ASize] != null &&
                    TheArray[Inner - 1]!.Height >= TheArray[ASize]!.Height)
                {
                    TheArray[Inner] = TheArray[Inner - 1];
                    TheArray[Inner - 1] = null;
                    Copies++;
                    InnerOld = Inner;
                    Inner--;
                }
                else
                {
                    CodePart = 3;
                }
            }
            else if (CodePart == 3)
            {
                TheArray[Inner] = TheArray[ASize];
                TheArray[ASize] = null;
                Copies++;
                OuterOld = Outer;
                Outer++;

                if (Outer >= ASize)
                {
                    DoneFlag = true;
                }
                else
                {
                    CodePart = 1;
                }
            }

            return !DoneFlag;
        }

        public void Draw(Graphics g)
        {
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            using (Font statFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString($"Copies = {Copies}", statFont, textBrush, 10, 15);
                g.DrawString($"Comparisons = {Comps}", statFont, textBrush, 10, 30);
            }

            using (Pen basePen = new Pen(Color.Gray))
            {
                g.DrawLine(basePen, BarLeftMargin - 5, BarBaseY, AppletWidth - 15, BarBaseY);
            }

            for (int i = 0; i < ASize; i++)
            {
                DrawOneBar(g, i);
            }

            int tempX = AppletWidth - (ASize == 10 ? 45 : 30);
            using (Font labelFont = new Font("SansSerif", 8f, FontStyle.Bold))
            using (SolidBrush b = new SolidBrush(Color.Black))
            {
                g.DrawString("temp", labelFont, b, tempX - 2, BarBaseY + 5);
            }

            if (TheArray[ASize] != null)
            {
                PersonIS p = TheArray[ASize]!;
                int tempY = BarBaseY - p.Height;
                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(barBrush, tempX, tempY, BarWidth, p.Height);
                }
            }

            if (ASize == 10)
            {
                ArrowText(g, Color.Red, "outer", Outer, 4, true, true);
                ArrowText(g, Color.Blue, "inner", Inner, 5, true, true);

                using (Font msgFont = new Font("SansSerif", 9f, FontStyle.Bold))
                using (SolidBrush msgBrush = new SolidBrush(Color.Black))
                {
                    string msg = DoneFlag ? "Sort is complete" :
                                 CodePart == 1 ? "Will copy outer to temp" :
                                 CodePart == 2 ? "Have compared inner-1 & temp" : "Will copy temp to inner";
                    g.DrawString(msg, msgFont, msgBrush, (AppletWidth / 2) - 70, BarBaseY + 45);
                }
            }
            else
            {
                ArrowText(g, Color.Red, "", Outer, 4, true, false);
                ArrowText(g, Color.Blue, "", Inner, 5, true, false);
            }
        }

        public void DrawOneBar(Graphics g, int index)
        {
            if (index < 0 || index >= ASize) return;

            int barX = BarLeftMargin + index * (BarWidth + BarSeparation);
            if (TheArray[index] != null)
            {
                PersonIS p = TheArray[index]!;
                int barY = BarBaseY - p.Height;

                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(barBrush, barX, barY, BarWidth, p.Height);
                }

                using (Pen lightPen = new Pen(Color.White))
                using (Pen darkPen = new Pen(Color.DarkGray))
                {
                    g.DrawLine(lightPen, barX, barY + p.Height, barX, barY);
                    g.DrawLine(lightPen, barX, barY, barX + BarWidth, barY);
                    g.DrawLine(darkPen, barX + BarWidth, barY, barX + BarWidth, barY + p.Height);
                }

                if (ASize == 10)
                {
                    using (Font numFont = new Font("SansSerif", 7f, FontStyle.Bold))
                    using (SolidBrush numBrush = new SolidBrush(Color.Black))
                    {
                        g.DrawString(p.Height.ToString(), numFont, numBrush, barX - 1, barY - 12);
                    }
                }
            }
        }

        private void ArrowText(Graphics g, Color color, string text, int index, int offsetLevel, bool drawArrow, bool drawText)
        {
            if (index < 0 || index >= ASize) return;

            int x = BarLeftMargin + index * (BarWidth + BarSeparation) + (BarWidth / 2);
            int arrowBaseY = BarBaseY + 2;

            using (Pen p = new Pen(color, 2f))
            using (SolidBrush b = new SolidBrush(color))
            {
                if (drawArrow)
                {
                    g.DrawLine(p, x, arrowBaseY + 14, x, arrowBaseY + 3);
                    Point[] head = new Point[]
                    {
                        new Point(x, arrowBaseY + 2),
                        new Point(x - 3, arrowBaseY + 7),
                        new Point(x + 3, arrowBaseY + 7)
                    };
                    g.FillPolygon(b, head);
                }

                if (drawText && !string.IsNullOrEmpty(text))
                {
                    using (Font labelFont = new Font("SansSerif", 8f, FontStyle.Bold))
                    {
                        g.DrawString(text, labelFont, b, x - 12, arrowBaseY + 18);
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'PersonIS.cs',
    filename: 'PersonIS.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل عنصر البيانات في ترتيب الإدراج.',
    descriptionEn: 'Item representation in Insertion Sort.',
    content: `using System.Drawing;

namespace InsertionSortViewer
{
    public class PersonIS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonIS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}`
  },
  {
    name: 'InsertionSortForm.Designer.cs',
    filename: 'InsertionSortForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر واجهة المستخدم لـ Insertion Sort.',
    descriptionEn: 'Designer for Insertion Sort Form.',
    content: `namespace InsertionSortViewer
{
    partial class InsertionSortForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel pnlControls;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnSize;
        private System.Windows.Forms.Button btnDraw;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.Panel pnlCanvas;

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
            this.btnSize = new System.Windows.Forms.Button();
            this.btnDraw = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.lblStatus = new System.Windows.Forms.Label();
            this.pnlCanvas = new System.Windows.Forms.Panel();
            this.pnlControls.SuspendLayout();
            this.SuspendLayout();

            this.pnlControls.BackColor = System.Drawing.Color.FromArgb(240, 240, 240);
            this.pnlControls.Controls.Add(this.btnNew);
            this.pnlControls.Controls.Add(this.btnSize);
            this.pnlControls.Controls.Add(this.btnDraw);
            this.pnlControls.Controls.Add(this.btnRun);
            this.pnlControls.Controls.Add(this.btnStep);
            this.pnlControls.Controls.Add(this.lblStatus);
            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 50;

            this.btnNew.Location = new System.Drawing.Point(10, 10);
            this.btnNew.Size = new System.Drawing.Size(90, 30);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnSize.Location = new System.Drawing.Point(105, 10);
            this.btnSize.Size = new System.Drawing.Size(75, 30);
            this.btnSize.Text = "Size";
            this.btnSize.UseVisualStyleBackColor = true;
            this.btnSize.Click += new System.EventHandler(this.BtnSize_Click);

            this.btnDraw.Location = new System.Drawing.Point(185, 10);
            this.btnDraw.Size = new System.Drawing.Size(65, 30);
            this.btnDraw.Text = "Draw";
            this.btnDraw.UseVisualStyleBackColor = true;
            this.btnDraw.Click += new System.EventHandler(this.BtnDraw_Click);

            this.btnRun.Location = new System.Drawing.Point(255, 10);
            this.btnRun.Size = new System.Drawing.Size(65, 30);
            this.btnRun.Text = "Run";
            this.btnRun.UseVisualStyleBackColor = true;
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            this.btnStep.Location = new System.Drawing.Point(325, 10);
            this.btnStep.Size = new System.Drawing.Size(65, 30);
            this.btnStep.Text = "Step";
            this.btnStep.UseVisualStyleBackColor = true;
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            this.pnlCanvas.BackColor = System.Drawing.Color.LightGray;
            this.pnlCanvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.PnlCanvas_Paint);

            this.ClientSize = new System.Drawing.Size(420, 390);
            this.Controls.Add(this.pnlCanvas);
            this.Controls.Add(this.pnlControls);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "InsertionSortForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore Insertion Sort Applet Viewer (C# Windows Forms)";
            this.pnlControls.ResumeLayout(false);
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق Insertion Sort.',
    descriptionEn: 'Entry point for Insertion Sort.',
    content: `using System;
using System.Windows.Forms;

namespace InsertionSortViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new InsertionSortForm());
        }
    }
}`
  },
  {
    name: 'InsertionSortViewer.csproj',
    filename: 'InsertionSortViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع InsertionSortViewer.',
    descriptionEn: 'Project file for InsertionSortViewer.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>InsertionSortViewer</RootNamespace>
    <AssemblyName>InsertionSortViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت ترتيب الإدراج لـ روبرت لافور بلغة C# (Insertion Sort)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_STACK: CSharpSourceFile[] = [
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'فئة العنصر المخزن في المكدس (Person) مع القيمة واللون الرسومي',
    descriptionEn: 'Person item class storing key and graphical color',
    content: `using System.Drawing;

namespace StackViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في المكدس (Stack)
    /// يتطابق تماماً مع person.class في بريمج روبرت لافور الأصلي
    /// </summary>
    public class Person
    {
        public int Height { get; set; }
        public Color ItemColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'فئة إدارة وتمثيل مكدس البيانات (Stack - LIFO) وعمليات Push, Pop, Peek ومؤشر Top',
    descriptionEn: 'PersonGroup managing LIFO stack operations and GDI+ rendering',
    content: `using System;
using System.Drawing;

namespace StackViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل مكدس البيانات (Stack - LIFO) ورسم الخلايا ومؤشر القمة Top
    /// تتطابق تماماً مع personGroup.class في بريمج روبرت لافور
    /// </summary>
    public class PersonGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 300;
        public const int TopMargin = 80;
        public const int LeftMargin = 10;
        public const int CenterX = 175;
        public const int TextHeight = 13;
        public const int CellWidth = 35;
        public const int CellHeight = 17;
        public const int Digits3Width = 18;
        public const int NoteBoxTop = 55;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 325;
        public const int ASIZE = 10;
        public const int INIT_NUM = 4;
        public const int MAX_KEY = 999;

        public Person?[] StackArray { get; private set; }
        public int NPersons { get; set; }
        public int CurIn { get; set; }
        public int OldCurIn { get; set; }
        public int InsKey { get; set; }
        public Person? TempPers { get; set; }
        public string Note { get; set; } = "Press any button";
        public string ReturnString { get; set; } = "";
        public int CodePart { get; set; } = 1;
        public int OpMode { get; set; } = 0; // 0: idle, 1: new, 2: push, 3: pop, 4: peek

        private static readonly Random Rng = new Random();

        public PersonGroup()
        {
            StackArray = new Person?[11];
            OldCurIn = 0;
            CurIn = 0;
            NPersons = 0;
            CodePart = 1;
            Note = "Press any button";
        }

        public Person MakePerson(int key)
        {
            int r = (int)(Rng.NextDouble() * 200.0) + 30;
            int g = (int)(Rng.NextDouble() * 200.0) + 30;
            int b = (int)(Rng.NextDouble() * 200.0) + 30;
            return new Person(key, Color.FromArgb(r, g, b));
        }

        public void DoFill()
        {
            for (int i = 0; i < 11; i++) StackArray[i] = null;
            for (int i = 0; i < INIT_NUM; i++)
            {
                int key = (int)(Rng.NextDouble() * 1000.0);
                TempPers = MakePerson(key);
                StackArray[i] = TempPers;
            }
            NPersons = INIT_NUM;
            OldCurIn = NPersons;
            CurIn = NPersons;
        }

        public void NewStack()
        {
            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Will create new, empty stack";
                    CodePart = 2;
                    break;
                case 2:
                    for (int i = 0; i < 11; i++) StackArray[i] = null;
                    NPersons = 0;
                    OldCurIn = CurIn;
                    CurIn = 0;
                    Note = "New stack created";
                    CodePart = 3;
                    break;
                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Push(bool isNumber, int key)
        {
            if (OpMode != 2)
            {
                OpMode = 2;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (!isNumber || key < 0 || key > MAX_KEY)
                    {
                        Note = "CAN'T PUSH: need key between 0 and " + MAX_KEY;
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }
                    if (NPersons >= ASIZE)
                    {
                        Note = "CAN'T PUSH: stack is full";
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }
                    InsKey = key;
                    Note = "Will push item with key " + InsKey;
                    TempPers = MakePerson(InsKey);
                    CodePart = 2;
                    break;
                case 2:
                    NPersons++;
                    OldCurIn = CurIn;
                    CurIn = NPersons;
                    Note = "Incremented top";
                    CodePart = 3;
                    break;
                case 3:
                    StackArray[NPersons - 1] = TempPers;
                    Note = "Inserted item with key " + InsKey + " at top";
                    CodePart = 4;
                    break;
                case 4:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public string Pop()
        {
            if (OpMode != 3)
            {
                OpMode = 3;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T POP: stack is empty";
                        CodePart = 1;
                        OpMode = 0;
                        ReturnString = "";
                        return ReturnString;
                    }
                    Note = "Will pop item from top of stack";
                    ReturnString = "";
                    CodePart = 2;
                    break;
                case 2:
                    int val = StackArray[NPersons - 1]?.GetHeight() ?? 0;
                    ReturnString = val.ToString();
                    StackArray[NPersons - 1] = null;
                    Note = "Item removed; value returned in Number";
                    CodePart = 3;
                    break;
                case 3:
                    NPersons--;
                    OldCurIn = CurIn;
                    CurIn = NPersons;
                    Note = "Decremented top";
                    CodePart = 4;
                    break;
                case 4:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
            return ReturnString;
        }

        public string Peek()
        {
            if (OpMode != 4)
            {
                OpMode = 4;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T PEEK: stack is empty";
                        CodePart = 1;
                        OpMode = 0;
                        ReturnString = "";
                        return ReturnString;
                    }
                    Note = "Will peek at item at top of stack";
                    ReturnString = "";
                    CodePart = 2;
                    break;
                case 2:
                    int val = StackArray[NPersons - 1]?.GetHeight() ?? 0;
                    ReturnString = val.ToString();
                    Note = "Value returned in Number";
                    CodePart = 3;
                    break;
                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
            return ReturnString;
        }

        public void Draw(Graphics g)
        {
            g.FillRectangle(SystemBrushes.Control, 0, 0, AppletWidth, AppletHeight);

            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Courier New", 10, FontStyle.Bold))
            {
                g.DrawString(Note, noteFont, textBrush, 16, 55);
            }

            for (int i = 0; i <= ASIZE; i++)
            {
                DrawPerson(g, i);
            }
        }

        public void DrawPerson(Graphics g, int i)
        {
            int cellX = CenterX + Digits3Width + 8;
            int cellY = AppletHeight - 40 - CellHeight * i;

            if (i < ASIZE)
            {
                using (Font idxFont = new Font("Courier New", 9, FontStyle.Bold))
                using (Brush idxBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(i.ToString(), idxFont, idxBrush, cellX - 18, cellY + 2);
                }
                g.DrawRectangle(Pens.Black, cellX, cellY, CellWidth, CellHeight);
            }

            if (StackArray[i] != null)
            {
                Person p = StackArray[i]!;
                using (Brush b = new SolidBrush(p.GetColor()))
                {
                    g.FillRectangle(b, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }
                ControlPaint.DrawBorder3D(g, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1, Border3DStyle.Raised);

                using (Font valFont = new Font("Arial", 8, FontStyle.Bold))
                using (Brush textBrush = new SolidBrush(Color.Black))
                {
                    string s = p.GetHeight().ToString();
                    g.DrawString(s, valFont, textBrush, cellX + 4, cellY + 2);
                }
            }

            if (i == CurIn)
            {
                int arrowX = cellX + CellWidth + 30;
                int arrowY = cellY + CellHeight / 2;

                using (Pen redPen = new Pen(Color.Red, 2))
                using (Brush redBrush = new SolidBrush(Color.Red))
                using (Font topFont = new Font("Arial", 9, FontStyle.Bold))
                {
                    g.DrawLine(redPen, arrowX, arrowY, cellX + CellWidth + 8, arrowY);
                    Point[] pts = new Point[]
                    {
                        new Point(cellX + CellWidth + 8, arrowY),
                        new Point(cellX + CellWidth + 14, arrowY - 4),
                        new Point(cellX + CellWidth + 14, arrowY + 4)
                    };
                    g.FillPolygon(redBrush, pts);
                    g.DrawString("Top", topFont, redBrush, arrowX + 4, arrowY - 7);
                }
            }
        }
    }
}`
  },
  {
    name: 'StackForm.cs',
    filename: 'StackForm.cs',
    language: 'csharp',
    descriptionAr: 'نافذة العرض الرئيسية لتطبيق Stack بلغة C# (Windows Forms)',
    descriptionEn: 'Main Windows Form GUI and event handlers for Stack',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace StackViewer
{
    public partial class StackForm : Form
    {
        private PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer autoTimer;
        private bool isRunning = false;

        public StackForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();
            thePersonGroup.DoFill();

            autoTimer = new System.Windows.Forms.Timer { Interval = 350 };
            autoTimer.Tick += AutoTimer_Tick;

            UpdateUI();
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            thePersonGroup.NewStack();
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPush_Click(object? sender, EventArgs e)
        {
            bool isNumber = int.TryParse(txtNumber.Text, out int key);
            thePersonGroup.Push(isNumber, key);
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPop_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Pop();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPeek_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Peek();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void AutoTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode != 0)
            {
                if (thePersonGroup.OpMode == 1) thePersonGroup.NewStack();
                else if (thePersonGroup.OpMode == 2)
                {
                    bool isNumber = int.TryParse(txtNumber.Text, out int key);
                    thePersonGroup.Push(isNumber, key);
                }
                else if (thePersonGroup.OpMode == 3)
                {
                    string ret = thePersonGroup.Pop();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                else if (thePersonGroup.OpMode == 4)
                {
                    string ret = thePersonGroup.Peek();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                this.Invalidate();
                UpdateUI();
            }
            else
            {
                autoTimer.Stop();
                isRunning = false;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Items: {thePersonGroup.NPersons}/10 | Top Pointer: {thePersonGroup.CurIn} | {thePersonGroup.Note}";
        }
    }
}`
  },
  {
    name: 'StackForm.Designer.cs',
    filename: 'StackForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'التصميم المرئي والأزرار العلوية للـ Form',
    descriptionEn: 'Visual designer layout and controls initialization',
    content: `namespace StackViewer
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
            if (disposing && (components != null)) components.Dispose();
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

            this.pnlControls.Dock = System.Windows.Forms.DockStyle.Top;
            this.pnlControls.Height = 44;
            this.pnlControls.BackColor = System.Drawing.Color.LightGray;

            this.btnNew.Text = "New";
            this.btnNew.Location = new System.Drawing.Point(10, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnPush.Text = "Push";
            this.btnPush.Location = new System.Drawing.Point(70, 8);
            this.btnPush.Size = new System.Drawing.Size(55, 26);
            this.btnPush.Click += new System.EventHandler(this.BtnPush_Click);

            this.btnPop.Text = "Pop";
            this.btnPop.Location = new System.Drawing.Point(130, 8);
            this.btnPop.Size = new System.Drawing.Size(55, 26);
            this.btnPop.Click += new System.EventHandler(this.BtnPop_Click);

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
            this.pnlControls.Controls.Add(this.btnPush);
            this.pnlControls.Controls.Add(this.btnPop);
            this.pnlControls.Controls.Add(this.btnPeek);
            this.pnlControls.Controls.Add(this.lblNumber);
            this.pnlControls.Controls.Add(this.txtNumber);

            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.lblStatus });

            this.ClientSize = new System.Drawing.Size(440, 360);
            this.Controls.Add(this.pnlControls);
            this.Controls.Add(this.statusStrip);
            this.Text = "Lafore\\'s Stack (LIFO) Applet Viewer - C# Windows Forms";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة دخول التطبيق الرئيسية STAThread',
    descriptionEn: 'Application entry point and message loop',
    content: `using System;
using System.Windows.Forms;

namespace StackViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new StackForm());
        }
    }
}`
  },
  {
    name: 'StackViewer.csproj',
    filename: 'StackViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio C# (.NET 8 WinForms)',
    descriptionEn: 'Visual Studio .NET 8 Windows Forms project file',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>StackViewer</RootNamespace>
    <AssemblyName>StackViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت المكدس (Stack - LIFO) لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_QUEUE: CSharpSourceFile[] = [
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'فئة عنصر البيانات المخزن في الطابور (Person) مع القيمة واللون الرسومي',
    descriptionEn: 'Person item class storing key and graphical color',
    content: `using System.Drawing;

namespace QueueViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في الطابور (Queue)
    /// يتطابق تماماً مع person.class في بريمج روبرت لافور الأصلي
    /// </summary>
    public class Person
    {
        public int Height { get; set; }
        public Color ItemColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'فئة إدارة وتمثيل طابور البيانات الدائري (Circular Queue - FIFO) ومؤشري Front و Rear مع دعم Wrap-around',
    descriptionEn: 'PersonGroup managing circular FIFO queue operations, wrap-around, and GDI+ rendering',
    content: `using System;
using System.Drawing;

namespace QueueViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل طابور البيانات الدائري (Circular Queue - FIFO)
    /// ورسم الخلايا ومؤشري Front و Rear مع دعم Wrap-around
    /// تتطابق تماماً مع personGroup.class في بريمج روبرت لافور
    /// </summary>
    public class PersonGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 300;
        public const int TopMargin = 80;
        public const int LeftMargin = 10;
        public const int CenterX = 175;
        public const int TextHeight = 13;
        public const int CellWidth = 35;
        public const int CellHeight = 17;
        public const int BlueShaft = 60; // طول سهم Rear
        public const int RedShaft = 15;  // طول سهم Front
        public const int Digits3Width = 18;
        public const int NoteBoxTop = 55;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 325;
        public const int ASIZE = 10;
        public const int INIT_NUM = 4;
        public const int MAX_KEY = 999;

        private Person?[] queArray;
        public int NPersons { get; private set; }
        public int Front { get; private set; }
        public int Rear { get; private set; }
        public int OldFront { get; private set; }
        public int OldRear { get; private set; }
        public string Note { get; private set; }
        public string ReturnString { get; private set; }
        public int CodePart { get; private set; }
        public int OpMode { get; private set; } // 1: new, 2: ins, 3: rem, 4: peek

        private Person? tempPers;
        private int insKey;

        public PersonGroup()
        {
            queArray = new Person?[ASIZE];
            NPersons = 0;
            Front = 0;
            Rear = -1;
            OldFront = 0;
            OldRear = -1;
            Note = "Press any button";
            ReturnString = string.Empty;
            CodePart = 1;
            OpMode = 0;
        }

        private Person MakePerson(int height)
        {
            Random rnd = new Random();
            int r = 100 + rnd.Next(155);
            int g = 100 + rnd.Next(155);
            int b = 100 + rnd.Next(155);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill()
        {
            for (int i = 0; i < ASIZE; i++)
            {
                queArray[i] = null;
            }

            Random rnd = new Random();
            for (int i = 0; i < INIT_NUM; i++)
            {
                int val = rnd.Next(100, 999);
                tempPers = MakePerson(val);
                queArray[i] = tempPers;
            }

            NPersons = INIT_NUM;
            OldRear = Rear;
            Rear = NPersons - 1; // 3
            Front = 0;
            Note = "Press any button";
        }

        public void NewQueue()
        {
            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Will create new queue";
                    CodePart = 2;
                    break;

                case 2:
                    for (int i = 0; i < ASIZE; i++) queArray[i] = null;
                    NPersons = 0;
                    OldFront = Front;
                    Front = 0;
                    OldRear = Rear;
                    Rear = -1;
                    Note = "New queue created";
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Insert(bool isNumber, int value)
        {
            if (OpMode != 2)
            {
                OpMode = 2;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Enter key of item to insert";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > MAX_KEY)
                    {
                        Note = $"CAN'T INSERT: need key between 0 and {MAX_KEY}";
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }

                    if (NPersons >= ASIZE)
                    {
                        Note = "CAN'T INSERT: queue is full";
                        CodePart = 4;
                        return;
                    }

                    insKey = value;
                    Note = $"Will insert item with key {insKey}";
                    tempPers = MakePerson(insKey);
                    CodePart = 3;
                    break;

                case 3:
                    OldRear = Rear;
                    if (Rear >= ASIZE - 1)
                    {
                        Rear = -1; // Circular Wrap-around!
                    }
                    Rear++;
                    NPersons++;
                    queArray[Rear] = tempPers;
                    Note = $"Inserted item with key {insKey}";
                    CodePart = 4;
                    break;

                case 4:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public string Remove()
        {
            if (OpMode != 3)
            {
                OpMode = 3;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T REMOVE: queue is empty";
                        CodePart = 3;
                    }
                    else
                    {
                        Note = "Will remove item from front of queue";
                        CodePart = 2;
                    }
                    ReturnString = string.Empty;
                    break;

                case 2:
                    if (queArray[Front] != null)
                    {
                        ReturnString = queArray[Front]!.GetHeight().ToString();
                    }
                    queArray[Front] = null;
                    NPersons--;
                    OldFront = Front;
                    Front++;
                    if (Front >= ASIZE)
                    {
                        Front = 0; // Circular Wrap-around!
                    }
                    Note = "Item removed; value returned in Number";
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }

            return ReturnString;
        }

        public string Peek()
        {
            if (OpMode != 4)
            {
                OpMode = 4;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T PEEK: queue is empty";
                        CodePart = 3;
                    }
                    else
                    {
                        Note = "Will peek at item at front of queue";
                        CodePart = 2;
                    }
                    ReturnString = string.Empty;
                    break;

                case 2:
                    if (queArray[Front] != null)
                    {
                        ReturnString = queArray[Front]!.GetHeight().ToString();
                    }
                    Note = "Value returned in Number";
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }

            return ReturnString;
        }

        public void Draw(Graphics g)
        {
            // Background
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight + 20);
            }

            // Note Message Box
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Courier New", 10, FontStyle.Bold))
            {
                g.DrawString(Note, noteFont, textBrush, 16, 60);
            }

            // Draw all 10 cells
            for (int i = 0; i < ASIZE; i++)
            {
                DrawPerson(g, i);
            }
        }

        private void DrawPerson(Graphics g, int index)
        {
            int cellX = CenterX + Digits3Width + 8;
            int cellY = 300 - (40 + index * CellHeight);

            // Draw index number
            using (Font idxFont = new Font("Courier New", 9))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString(index.ToString(), idxFont, textBrush, cellX - 18, cellY + 2);
            }

            // Draw cell border
            g.DrawRectangle(Pens.Black, cellX, cellY, CellWidth, CellHeight);

            // Draw item if exists
            Person? p = queArray[index];
            if (p != null)
            {
                using (SolidBrush fillBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(fillBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }

                // 3D edge effect
                g.DrawLine(Pens.White, cellX + 1, cellY + CellHeight - 1, cellX + 1, cellY + 1);
                g.DrawLine(Pens.White, cellX + 1, cellY + 1, cellX + CellWidth - 1, cellY + 1);
                g.DrawLine(Pens.DarkGray, cellX + CellWidth - 1, cellY + 1, cellX + CellWidth - 1, cellY + CellHeight - 1);

                // Value text
                using (Font valFont = new Font("Arial", 8, FontStyle.Bold))
                using (SolidBrush textBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(p.Height.ToString(), valFont, textBrush, cellX + 6, cellY + 2);
                }
            }

            int arrowTargetX = cellX + CellWidth + 4;
            int arrowY = cellY + CellHeight / 2;

            // Draw Rear Arrow (Blue, Shaft = 60)
            if (index == Rear)
            {
                using (Pen bluePen = new Pen(Color.Blue, 2))
                using (SolidBrush blueBrush = new SolidBrush(Color.Blue))
                using (Font arrowFont = new Font("Arial", 8, FontStyle.Bold))
                {
                    int arrowStartX = arrowTargetX + BlueShaft;
                    g.DrawLine(bluePen, arrowStartX, arrowY, arrowTargetX, arrowY);

                    Point[] pts = new Point[]
                    {
                        new Point(arrowTargetX, arrowY),
                        new Point(arrowTargetX + 5, arrowY - 4),
                        new Point(arrowTargetX + 5, arrowY + 4)
                    };
                    g.FillPolygon(blueBrush, pts);
                    g.DrawString("Rear", arrowFont, blueBrush, arrowStartX + 4, arrowY - 6);
                }
            }

            // Draw Front Arrow (Red, Shaft = 15)
            if (index == Front && NPersons > 0)
            {
                using (Pen redPen = new Pen(Color.Red, 2))
                using (SolidBrush redBrush = new SolidBrush(Color.Red))
                using (Font arrowFont = new Font("Arial", 8, FontStyle.Bold))
                {
                    int arrowStartX = arrowTargetX + RedShaft;
                    g.DrawLine(redPen, arrowStartX, arrowY, arrowTargetX, arrowY);

                    Point[] pts = new Point[]
                    {
                        new Point(arrowTargetX, arrowY),
                        new Point(arrowTargetX + 5, arrowY - 4),
                        new Point(arrowTargetX + 5, arrowY + 4)
                    };
                    g.FillPolygon(redBrush, pts);
                    g.DrawString("Front", arrowFont, redBrush, arrowStartX + 4, arrowY - 6);
                }
            }
        }
    }
}`
  },
  {
    name: 'QueueForm.cs',
    filename: 'QueueForm.cs',
    language: 'csharp',
    descriptionAr: 'نافذة العرض الرئيسية لتطبيق Queue بلغة C# (Windows Forms)',
    descriptionEn: 'Main Windows Form GUI and event handlers for Queue',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace QueueViewer
{
    public partial class QueueForm : Form
    {
        private PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer autoTimer;
        private bool isRunning = false;

        public QueueForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();
            thePersonGroup.DoFill();

            autoTimer = new System.Windows.Forms.Timer { Interval = 350 };
            autoTimer.Tick += AutoTimer_Tick;

            UpdateUI();
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            thePersonGroup.NewQueue();
            this.Invalidate();
            UpdateUI();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            bool isNumber = int.TryParse(txtNumber.Text, out int key);
            thePersonGroup.Insert(isNumber, key);
            this.Invalidate();
            UpdateUI();
        }

        private void BtnRem_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Remove();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void BtnPeek_Click(object? sender, EventArgs e)
        {
            string ret = thePersonGroup.Peek();
            if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
            this.Invalidate();
            UpdateUI();
        }

        private void AutoTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode != 0)
            {
                if (thePersonGroup.OpMode == 1) thePersonGroup.NewQueue();
                else if (thePersonGroup.OpMode == 2)
                {
                    bool isNumber = int.TryParse(txtNumber.Text, out int key);
                    thePersonGroup.Insert(isNumber, key);
                }
                else if (thePersonGroup.OpMode == 3)
                {
                    string ret = thePersonGroup.Remove();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                else if (thePersonGroup.OpMode == 4)
                {
                    string ret = thePersonGroup.Peek();
                    if (!string.IsNullOrEmpty(ret)) txtNumber.Text = ret;
                }
                this.Invalidate();
                UpdateUI();
            }
            else
            {
                autoTimer.Stop();
                isRunning = false;
            }
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            thePersonGroup.Draw(e.Graphics);
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Items: {thePersonGroup.NPersons}/10 | Front: {thePersonGroup.Front} | Rear: {thePersonGroup.Rear} | {thePersonGroup.Note}";
        }
    }
}`
  },
  {
    name: 'QueueForm.Designer.cs',
    filename: 'QueueForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'التصميم المرئي والأزرار العلوية للـ Queue Form',
    descriptionEn: 'Visual designer layout and controls initialization',
    content: `namespace QueueViewer
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
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة دخول التطبيق الرئيسية STAThread لبرنامج Queue',
    descriptionEn: 'Application entry point and message loop',
    content: `using System;
using System.Windows.Forms;

namespace QueueViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new QueueForm());
        }
    }
}`
  },
  {
    name: 'QueueViewer.csproj',
    filename: 'QueueViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio C# (.NET 8 WinForms)',
    descriptionEn: 'Visual Studio .NET 8 Windows Forms project file',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>QueueViewer</RootNamespace>
    <AssemblyName>QueueViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت طابور الانتظار الدائري (Circular Queue - FIFO) لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_PRIORITY_QUEUE: CSharpSourceFile[] = [
  {
    name: 'PriorityQueueForm.cs',
    filename: 'PriorityQueueForm.cs',
    language: 'csharp',
    descriptionAr: 'النافذة الرئيسية لطابور الأولوية (Windows Forms) ومعالجة أحداث الأزرار، والتحريك المتزامن بالمؤقت.',
    descriptionEn: 'Main Windows Forms form handling Priority Queue operations, animations, and GDI+ rendering.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace PriorityQueueViewer
{
    public partial class PriorityQueueForm : Form
    {
        private PersonGroup personGroup;
        private bool isAnimating = false;

        public PriorityQueueForm()
        {
            InitializeComponent();
            personGroup = new PersonGroup();
            personGroup.DoFill();

            // DoubleBuffering لمنع الوميض
            typeof(Panel).InvokeMember("DoubleBuffered",
                System.Reflection.BindingFlags.SetProperty |
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.NonPublic,
                null, canvasPanel, new object[] { true });
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            personGroup.Draw(e.Graphics);
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            personGroup.NewQueue();
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            bool isNumber = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Insert(isNumber, isNumber ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnRem_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            string res = personGroup.Remove();
            if (!string.IsNullOrEmpty(res))
            {
                txtNumber.Text = res;
            }
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnPeek_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;

            string res = personGroup.Peek();
            if (!string.IsNullOrEmpty(res))
            {
                txtNumber.Text = res;
            }
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void StartAnimation()
        {
            isAnimating = true;
            animationTimer.Start();
        }

        private void AnimationTimer_Tick(object sender, EventArgs e)
        {
            if (personGroup.OpMode == 1)
            {
                personGroup.NewQueue();
            }
            else if (personGroup.OpMode == 2)
            {
                bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
                personGroup.Insert(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 3)
            {
                string res = personGroup.Remove();
                if (!string.IsNullOrEmpty(res))
                {
                    txtNumber.Text = res;
                }
            }
            else if (personGroup.OpMode == 4)
            {
                string res = personGroup.Peek();
                if (!string.IsNullOrEmpty(res))
                {
                    txtNumber.Text = res;
                }
            }

            canvasPanel.Invalidate();

            if (personGroup.OpMode == 0)
            {
                animationTimer.Stop();
                isAnimating = false;
            }
        }
    }
}`
  },
  {
    name: 'PriorityQueueForm.Designer.cs',
    filename: 'PriorityQueueForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم الواجهة الرسومية والأزرار ومربع الإدخال لطابور الأولوية في Windows Forms.',
    descriptionEn: 'WinForms Designer code defining buttons, text boxes, canvas panel, and layout.',
    content: `namespace PriorityQueueViewer
{
    partial class PriorityQueueForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Panel topBarPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnRem;
        private System.Windows.Forms.Button btnPeek;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Timer animationTimer;

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
            this.components = new System.ComponentModel.Container();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.topBarPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnRem = new System.Windows.Forms.Button();
            this.btnPeek = new System.Windows.Forms.Button();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.animationTimer = new System.Windows.Forms.Timer(this.components);

            this.topBarPanel.SuspendLayout();
            this.SuspendLayout();

            // topBarPanel
            this.topBarPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topBarPanel.Height = 40;
            this.topBarPanel.BackColor = System.Drawing.Color.LightGray;
            this.topBarPanel.Controls.Add(this.btnNew);
            this.topBarPanel.Controls.Add(this.btnIns);
            this.topBarPanel.Controls.Add(this.btnRem);
            this.topBarPanel.Controls.Add(this.btnPeek);
            this.topBarPanel.Controls.Add(this.lblNumber);
            this.topBarPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(10, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 25);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnIns
            this.btnIns.Location = new System.Drawing.Point(70, 8);
            this.btnIns.Size = new System.Drawing.Size(55, 25);
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // btnRem
            this.btnRem.Location = new System.Drawing.Point(130, 8);
            this.btnRem.Size = new System.Drawing.Size(55, 25);
            this.btnRem.Text = "Rem";
            this.btnRem.UseVisualStyleBackColor = true;
            this.btnRem.Click += new System.EventHandler(this.BtnRem_Click);

            // btnPeek
            this.btnPeek.Location = new System.Drawing.Point(190, 8);
            this.btnPeek.Size = new System.Drawing.Size(55, 25);
            this.btnPeek.Text = "Peek";
            this.btnPeek.UseVisualStyleBackColor = true;
            this.btnPeek.Click += new System.EventHandler(this.BtnPeek_Click);

            // lblNumber
            this.lblNumber.Location = new System.Drawing.Point(260, 12);
            this.lblNumber.AutoSize = true;
            this.lblNumber.Text = "Number: ";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(320, 10);
            this.txtNumber.Size = new System.Drawing.Size(65, 22);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);

            // animationTimer
            this.animationTimer.Interval = 350;
            this.animationTimer.Tick += new System.EventHandler(this.AnimationTimer_Tick);

            // PriorityQueueForm
            this.ClientSize = new System.Drawing.Size(440, 340);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topBarPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "PriorityQueueForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Priority Queue Workshop Applet";
            this.topBarPanel.ResumeLayout(false);
            this.topBarPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'بنية بيانات طابور الأولوية (Priority Queue) ورسم الخلايا العشر ومؤشرات Front و Rear و curIn ومحاذاة الإزاحة.',
    descriptionEn: 'Priority Queue data structure, ascending sorted array logic, shifting insertion, O(1) front removal, and GDI+ rendering.',
    content: `using System;
using System.Drawing;

namespace PriorityQueueViewer
{
    public class PersonGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 300;
        public const int TopMargin = 80;
        public const int LeftMargin = 10;
        public const int CenterX = 175;
        public const int TextHeight = 13;
        public const int CellWidth = 35;
        public const int CellHeight = 17;
        public const int BlueShaft = 60;  // طول سهم Rear
        public const int RedShaft = 15;   // طول سهم Front
        public const int BlackShaft = 10; // طول سهم curIn
        public const int Digits3Width = 18;
        public const int NoteBoxTop = 55;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 325;
        public const int ASIZE = 10;
        public const int INIT_NUM = 5;
        public const int MAX_KEY = 999;

        private Person?[] queArray;
        public int NPersons { get; private set; }
        public int Front { get; private set; }
        public int Rear { get; private set; }
        public int CurIn { get; private set; }
        public string Note { get; private set; }
        public string ReturnString { get; private set; }
        public int CodePart { get; private set; }
        public int OpMode { get; private set; } // 1: new, 2: ins, 3: rem, 4: peek

        private Person? tempPers;
        private int insKey;

        public PersonGroup()
        {
            queArray = new Person?[ASIZE];
            NPersons = 0;
            Front = -1;
            Rear = 0;
            CurIn = -9;
            Note = "Press any button";
            ReturnString = string.Empty;
            CodePart = 1;
            OpMode = 0;
        }

        private Person MakePerson(int height)
        {
            Random rnd = new Random();
            int r = 100 + rnd.Next(155);
            int g = 100 + rnd.Next(155);
            int b = 100 + rnd.Next(155);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill()
        {
            for (int i = 0; i < ASIZE; i++)
            {
                queArray[i] = null;
            }

            int[] keys = new int[INIT_NUM];
            Random rnd = new Random();
            keys[0] = rnd.Next(50, 200);
            for (int i = 1; i < INIT_NUM; i++)
            {
                keys[i] = keys[i - 1] + rnd.Next(60, 180);
                if (keys[i] > MAX_KEY) keys[i] = MAX_KEY - (INIT_NUM - i);
            }

            for (int i = 0; i < INIT_NUM; i++)
            {
                queArray[i] = MakePerson(keys[i]);
            }

            NPersons = INIT_NUM;
            Rear = 0;
            Front = NPersons - 1;
            CurIn = -9;
            Note = "Press any button";
            OpMode = 0;
            CodePart = 1;
        }

        public void NewQueue()
        {
            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Will create new queue";
                    CodePart = 2;
                    break;
                case 2:
                    for (int i = 0; i < ASIZE; i++)
                    {
                        queArray[i] = null;
                    }
                    NPersons = 0;
                    Rear = 0;
                    Front = -1;
                    CurIn = -9;
                    Note = "New queue created";
                    CodePart = 3;
                    break;
                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Insert(bool isNumber, int value)
        {
            if (OpMode != 2)
            {
                OpMode = 2;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Enter key of item to insert";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > MAX_KEY)
                    {
                        Note = "CAN'T INSERT: need key between 0 and " + MAX_KEY;
                        CodePart = 1;
                        OpMode = 0;
                        CurIn = -9;
                        return;
                    }

                    if (NPersons >= ASIZE)
                    {
                        Note = "CAN'T INSERT: queue is full";
                        CodePart = 1;
                        OpMode = 0;
                        CurIn = -9;
                        return;
                    }

                    insKey = value;
                    tempPers = MakePerson(insKey);
                    Note = "Will insert item with key " + insKey;

                    if (NPersons == 0)
                    {
                        CurIn = 0;
                        CodePart = 4;
                    }
                    else
                    {
                        CurIn = NPersons - 1;
                        CodePart = 3;
                    }
                    break;

                case 3:
                    if (CurIn < 0)
                    {
                        CurIn = 0;
                        Note = "Found insertion point";
                        CodePart = 4;
                    }
                    else if (insKey > queArray[CurIn]?.GetHeight())
                    {
                        CurIn = CurIn + 1;
                        Note = "Found insertion point";
                        CodePart = 4;
                    }
                    else
                    {
                        queArray[CurIn + 1] = queArray[CurIn];
                        queArray[CurIn] = null;
                        CurIn--;
                        Note = "Shifting; searching for insertion point";
                    }
                    break;

                case 4:
                    queArray[CurIn] = tempPers;
                    NPersons++;
                    Front = NPersons - 1;
                    Note = "Inserted item with key " + insKey;
                    CodePart = 5;
                    break;

                case 5:
                    Note = "Press any button";
                    CurIn = -9;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public string Remove()
        {
            if (OpMode != 3)
            {
                OpMode = 3;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T REMOVE: queue is empty";
                        CodePart = 1;
                        OpMode = 0;
                        ReturnString = string.Empty;
                        return ReturnString;
                    }
                    Note = "Will remove item from front of queue";
                    CodePart = 2;
                    break;

                case 2:
                    int target = NPersons - 1;
                    Person? p = queArray[target];
                    ReturnString = p != null ? p.GetHeight().ToString() : string.Empty;
                    queArray[target] = null;
                    NPersons--;
                    Front = NPersons - 1;
                    Note = "Item removed";
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }

            return ReturnString;
        }

        public string Peek()
        {
            if (OpMode != 4)
            {
                OpMode = 4;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (NPersons <= 0)
                    {
                        Note = "CAN'T PEEK: queue is empty";
                        CodePart = 1;
                        OpMode = 0;
                        ReturnString = string.Empty;
                        return ReturnString;
                    }
                    Note = "Will peek at item at front of queue";
                    CodePart = 2;
                    break;

                case 2:
                    Person? p = queArray[Front];
                    ReturnString = p != null ? p.GetHeight().ToString() : string.Empty;
                    Note = "Value returned in Number";
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }

            return ReturnString;
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.LightGray);

            using (Brush backBrush = new SolidBrush(Color.LightGray))
            using (Pen borderPen = new Pen(Color.DarkGray))
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Monospace", 9, FontStyle.Bold))
            {
                g.FillRectangle(backBrush, LeftMargin, 48, 420, NoteBoxHeight);
                g.DrawRectangle(borderPen, LeftMargin, 48, 420, NoteBoxHeight);
                g.DrawString(Note, noteFont, textBrush, LeftMargin + 6, 53);
            }

            int cellX = CenterX + Digits3Width + 8;
            int baseY = 255;

            for (int i = 0; i < ASIZE; i++)
            {
                int cellY = baseY - i * CellHeight;

                using (Font indexFont = new Font("Monospace", 8))
                using (Brush indexBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(i.ToString(), indexFont, indexBrush, cellX - 22, cellY + 2);
                }

                using (Pen cellPen = new Pen(Color.Black))
                {
                    g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
                }

                Person? p = queArray[i];
                if (p != null)
                {
                    using (Brush personBrush = new SolidBrush(p.Color))
                    {
                        g.FillRectangle(personBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                    }

                    using (Pen lightPen = new Pen(Color.White))
                    using (Pen darkPen = new Pen(Color.DimGray))
                    {
                        g.DrawLine(lightPen, cellX + 1, cellY + CellHeight - 1, cellX + 1, cellY + 1);
                        g.DrawLine(lightPen, cellX + 1, cellY + 1, cellX + CellWidth - 1, cellY + 1);
                        g.DrawLine(darkPen, cellX + CellWidth - 1, cellY + 1, cellX + CellWidth - 1, cellY + CellHeight - 1);
                    }

                    using (Font valFont = new Font("SansSerif", 8, FontStyle.Bold))
                    using (Brush valBrush = new SolidBrush(Color.Black))
                    {
                        string str = p.GetHeight().ToString();
                        SizeF size = g.MeasureString(str, valFont);
                        g.DrawString(str, valFont, valBrush, cellX + (CellWidth - size.Width) / 2, cellY + 2);
                    }
                }

                int centerY = cellY + CellHeight / 2;

                if (CurIn >= 0 && i == CurIn)
                {
                    DrawArrow(g, cellX, centerY, BlackShaft, Color.Black, "curIn");
                }

                if (i == Front && NPersons > 0)
                {
                    DrawArrow(g, cellX, centerY, RedShaft, Color.Red, "Front");
                }

                if (i == Rear)
                {
                    DrawArrow(g, cellX, centerY, BlueShaft, Color.Blue, "Rear");
                }
            }

            using (Pen basePen = new Pen(Color.Black, 2))
            {
                g.DrawLine(basePen, cellX - 15, baseY + CellHeight + 2, cellX + CellWidth + 15, baseY + CellHeight + 2);
            }
        }

        private void DrawArrow(Graphics g, int cellX, int centerY, int shaftLength, Color color, string label)
        {
            int arrowEndX = cellX + CellWidth + 4;
            int arrowStartX = arrowEndX + shaftLength;

            using (Pen arrowPen = new Pen(color, 2))
            using (Brush arrowBrush = new SolidBrush(color))
            using (Font labelFont = new Font("SansSerif", 8, FontStyle.Bold))
            {
                g.DrawLine(arrowPen, arrowStartX, centerY, arrowEndX, centerY);

                Point[] head = new Point[]
                {
                    new Point(arrowEndX, centerY),
                    new Point(arrowEndX + 5, centerY - 4),
                    new Point(arrowEndX + 5, centerY + 4)
                };
                g.FillPolygon(arrowBrush, head);

                if (!string.IsNullOrEmpty(label))
                {
                    g.DrawString(label, labelFont, arrowBrush, arrowStartX + 4, centerY - 6);
                }
            }
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'فئة كائن الشخص/العنصر المخزن داخل طابور الأولوية (المفتاح واللون).',
    descriptionEn: 'Person item class storing key height and pastel Color.',
    content: `using System.Drawing;

namespace PriorityQueueViewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة الدخول الرئيسية لبرنامج C# Windows Forms.',
    descriptionEn: 'Application entry point initializing WinForms runtime.',
    content: `using System;
using System.Windows.Forms;

namespace PriorityQueueViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new PriorityQueueForm());
        }
    }
}`
  },
  {
    name: 'PriorityQueueViewer.csproj',
    filename: 'PriorityQueueViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio C# (.NET 8 WinForms)',
    descriptionEn: 'Visual Studio .NET 8 Windows Forms project file',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>PriorityQueueViewer</RootNamespace>
    <AssemblyName>PriorityQueueViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت طابور الأولوية (Priority Queue) لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_LINK_LIST: CSharpSourceFile[] = [
  {
    name: 'LinkListForm.cs',
    filename: 'LinkListForm.cs',
    language: 'csharp',
    descriptionAr: 'النافذة الرئيسية للقائمة المترابطة (Windows Forms) ومعالجة أحداث الأزرار (New, Ins, Find, Del) وخيارات الترتيب.',
    descriptionEn: 'Main Windows Forms form handling Linked List operations, animations, and GDI+ rendering.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace LinkListViewer
{
    public partial class LinkListForm : Form
    {
        private PersonGroup personGroup;
        private bool isAnimating = false;

        public LinkListForm()
        {
            InitializeComponent();
            personGroup = new PersonGroup();
            personGroup.DoFill(10);

            // DoubleBuffering لمنع الوميض
            typeof(Panel).InvokeMember("DoubleBuffered",
                System.Reflection.BindingFlags.SetProperty |
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.NonPublic,
                null, canvasPanel, new object[] { true });
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            personGroup.Draw(e.Graphics);
        }

        private void RbSort_CheckedChanged(object sender, EventArgs e)
        {
            if (rbUnsorted.Checked)
            {
                personGroup.SetSortStatus(true);
            }
            else if (rbSorted.Checked)
            {
                personGroup.SetSortStatus(false);
            }
            canvasPanel.Invalidate();
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.NewList(isNum, isNum ? val : 10);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Insert(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnFind_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Find(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void BtnDel_Click(object sender, EventArgs e)
        {
            if (isAnimating) return;
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);
            personGroup.Delete(isNum, isNum ? val : -1);
            canvasPanel.Invalidate();

            if (personGroup.OpMode != 0)
            {
                StartAnimation();
            }
        }

        private void StartAnimation()
        {
            isAnimating = true;
            animationTimer.Start();
        }

        private void AnimationTimer_Tick(object sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int val);

            if (personGroup.OpMode == 1)
            {
                personGroup.NewList(isNum, isNum ? val : 10);
            }
            else if (personGroup.OpMode == 2)
            {
                personGroup.Insert(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 3)
            {
                personGroup.Find(isNum, isNum ? val : -1);
            }
            else if (personGroup.OpMode == 4)
            {
                personGroup.Delete(isNum, isNum ? val : -1);
            }

            canvasPanel.Invalidate();

            if (personGroup.OpMode == 0)
            {
                animationTimer.Stop();
                isAnimating = false;
            }
        }
    }
}`
  },
  {
    name: 'LinkListForm.Designer.cs',
    filename: 'LinkListForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم الواجهة الرسومية والأزرار ومفتاحي الاختيار Unsorted/Sorted في Windows Forms.',
    descriptionEn: 'WinForms Designer code defining buttons, radio buttons, canvas panel, and layout.',
    content: `namespace LinkListViewer
{
    partial class LinkListForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Panel topBarPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnIns;
        private System.Windows.Forms.Button btnFind;
        private System.Windows.Forms.Button btnDel;
        private System.Windows.Forms.RadioButton rbUnsorted;
        private System.Windows.Forms.RadioButton rbSorted;
        private System.Windows.Forms.Label lblNumber;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Timer animationTimer;

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
            this.components = new System.ComponentModel.Container();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.topBarPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnIns = new System.Windows.Forms.Button();
            this.btnFind = new System.Windows.Forms.Button();
            this.btnDel = new System.Windows.Forms.Button();
            this.rbUnsorted = new System.Windows.Forms.RadioButton();
            this.rbSorted = new System.Windows.Forms.RadioButton();
            this.lblNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.animationTimer = new System.Windows.Forms.Timer(this.components);

            this.topBarPanel.SuspendLayout();
            this.SuspendLayout();

            // topBarPanel
            this.topBarPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topBarPanel.Height = 42;
            this.topBarPanel.BackColor = System.Drawing.Color.LightGray;
            this.topBarPanel.Controls.Add(this.btnNew);
            this.topBarPanel.Controls.Add(this.btnIns);
            this.topBarPanel.Controls.Add(this.btnFind);
            this.topBarPanel.Controls.Add(this.btnDel);
            this.topBarPanel.Controls.Add(this.rbUnsorted);
            this.topBarPanel.Controls.Add(this.rbSorted);
            this.topBarPanel.Controls.Add(this.lblNumber);
            this.topBarPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(8, 8);
            this.btnNew.Size = new System.Drawing.Size(48, 25);
            this.btnNew.Text = "New";
            this.btnNew.UseVisualStyleBackColor = true;
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnIns
            this.btnIns.Location = new System.Drawing.Point(58, 8);
            this.btnIns.Size = new System.Drawing.Size(46, 25);
            this.btnIns.Text = "Ins";
            this.btnIns.UseVisualStyleBackColor = true;
            this.btnIns.Click += new System.EventHandler(this.BtnIns_Click);

            // btnFind
            this.btnFind.Location = new System.Drawing.Point(106, 8);
            this.btnFind.Size = new System.Drawing.Size(48, 25);
            this.btnFind.Text = "Find";
            this.btnFind.UseVisualStyleBackColor = true;
            this.btnFind.Click += new System.EventHandler(this.BtnFind_Click);

            // btnDel
            this.btnDel.Location = new System.Drawing.Point(156, 8);
            this.btnDel.Size = new System.Drawing.Size(46, 25);
            this.btnDel.Text = "Del";
            this.btnDel.UseVisualStyleBackColor = true;
            this.btnDel.Click += new System.EventHandler(this.BtnDel_Click);

            // rbUnsorted
            this.rbUnsorted.Location = new System.Drawing.Point(208, 11);
            this.rbUnsorted.Size = new System.Drawing.Size(72, 20);
            this.rbUnsorted.Text = "Unsorted";
            this.rbUnsorted.Checked = true;
            this.rbUnsorted.CheckedChanged += new System.EventHandler(this.RbSort_CheckedChanged);

            // rbSorted
            this.rbSorted.Location = new System.Drawing.Point(282, 11);
            this.rbSorted.Size = new System.Drawing.Size(60, 20);
            this.rbSorted.Text = "Sorted";
            this.rbSorted.CheckedChanged += new System.EventHandler(this.RbSort_CheckedChanged);

            // lblNumber
            this.lblNumber.Location = new System.Drawing.Point(344, 13);
            this.lblNumber.AutoSize = true;
            this.lblNumber.Text = "Enter number: ";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(426, 10);
            this.txtNumber.Size = new System.Drawing.Size(50, 22);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);

            // animationTimer
            this.animationTimer.Interval = 350;
            this.animationTimer.Tick += new System.EventHandler(this.AnimationTimer_Tick);

            // LinkListForm
            this.ClientSize = new System.Drawing.Size(485, 340);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topBarPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.Name = "LinkListForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Linked List Workshop Applet";
            this.topBarPanel.ResumeLayout(false);
            this.topBarPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق القائمة المترابطة (28 عقدة في 4 صفوف)، ورسم العقد وأسهم الربط الأفقية والثعبانية ومحاكاة الإدراج والحذف.',
    descriptionEn: 'Linked list logic, 7x4 node grid layout, horizontal and serpentine wrapping links, and splice/bypass animations.',
    content: `using System;
using System.Drawing;

namespace LinkListViewer
{
    public class PersonGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 300;
        public const int TopMargin = 80;
        public const int LeftMargin = 10;
        public const int TextHeight = 13;
        public const int NColumns = 7;
        public const int NRows = 4;
        public const int ColumnWidth = 57;
        public const int LinkWidth = 35;
        public const int InterLink = 20;
        public const int LinkHeight = 17;
        public const int Digits3Width = 18;
        public const int RowHeight = 57;
        public const int NoteBoxTop = 48;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 420;
        public const int ASIZE = 28;
        public const int MAX_KEY = 999;
        public const int StartX = 32;
        public const int StartY = 89;

        private Link?[] linkArray;
        public int TotalLinks { get; private set; }
        public int CurIn { get; private set; }
        public int OldCurIn { get; private set; }
        public string Note { get; private set; }
        public int CodePart { get; private set; }
        public int OpMode { get; private set; }
        public bool NotSorted { get; private set; }
        public bool IsOKChangeSort { get; private set; }

        private Person? tempPers;
        private int fillValue;
        private int insKey;
        private int findKey;
        private int delKey;
        private int insDex;
        private int delDex;
        private bool areInserting;
        private bool areDeleting;
        private bool insertAtEnd;

        public PersonGroup()
        {
            linkArray = new Link?[ASIZE];
            TotalLinks = 0;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Press any button";
            CodePart = 1;
            OpMode = 0;
            NotSorted = true;
            IsOKChangeSort = false;
            fillValue = 10;
        }

        private Person MakePerson(int height)
        {
            Random rnd = new Random();
            int r = 100 + rnd.Next(155);
            int g = 100 + rnd.Next(155);
            int b = 100 + rnd.Next(155);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void SetSortStatus(bool notSorted)
        {
            if (IsOKChangeSort)
            {
                NotSorted = notSorted;
                Note = NotSorted ? "Data will not be sorted" : "Data will be sorted";
            }
            else
            {
                Note = "To change sort status, create list with New";
            }
        }

        public void DoFill(int count)
        {
            for (int i = 0; i < ASIZE; i++)
            {
                linkArray[i] = null;
            }

            Random rnd = new Random();
            if (NotSorted)
            {
                for (int i = 0; i < count; i++)
                {
                    int key = rnd.Next(50, 950);
                    linkArray[i] = new Link(MakePerson(key));
                }
            }
            else
            {
                int val = rnd.Next(30, 80);
                for (int i = 0; i < count; i++)
                {
                    linkArray[i] = new Link(MakePerson(val));
                    val += rnd.Next(20, 90);
                    if (val > MAX_KEY) val = MAX_KEY;
                }
            }

            TotalLinks = count;
            CurIn = -1;
            OldCurIn = -1;
            IsOKChangeSort = false;
            Note = "Press any button";
            CodePart = 1;
            OpMode = 0;
        }

        public void NewList(bool isNumber, int value)
        {
            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
                areInserting = false;
                areDeleting = false;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Enter size of linked list to create";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > ASIZE)
                    {
                        Note = "ERROR: use size between 0 and " + ASIZE;
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }
                    fillValue = value;
                    Note = "Will create list with " + fillValue + " links";
                    IsOKChangeSort = true;
                    CodePart = 3;
                    break;

                case 3:
                    Note = "Select unsorted or sorted data";
                    IsOKChangeSort = true;
                    CodePart = 4;
                    break;

                case 4:
                    Note = NotSorted ? "Data will not be sorted" : "Data will be sorted";
                    CodePart = 5;
                    break;

                case 5:
                    DoFill(fillValue);
                    Note = "New list created; total links = " + TotalLinks;
                    CodePart = 6;
                    break;

                case 6:
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Insert(bool isNumber, int value)
        {
            if (OpMode != 2)
            {
                OpMode = 2;
                CodePart = 1;
                areDeleting = false;
            }

            switch (CodePart)
            {
                case 1:
                    CurIn = -1;
                    insertAtEnd = false;
                    Note = "Enter key of item to insert";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > MAX_KEY)
                    {
                        Note = "CAN'T INSERT: need key between 0 and " + MAX_KEY;
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }

                    if (TotalLinks >= ASIZE)
                    {
                        Note = "CAN'T INSERT: no room in display";
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }

                    insKey = value;
                    tempPers = MakePerson(insKey);

                    if (NotSorted)
                    {
                        Note = "Will insert item with key " + insKey;
                        CodePart = 4;
                    }
                    else
                    {
                        Note = "Will search for insertion point";
                        CurIn = 0;
                        CodePart = 3;
                    }
                    break;

                case 3:
                    if (CurIn >= TotalLinks)
                    {
                        Note = "Found insertion point at end of list";
                        insertAtEnd = true;
                        CodePart = 4;
                    }
                    else if (insKey <= linkArray[CurIn]?.PersData.GetHeight())
                    {
                        Note = "Have found insertion point";
                        insertAtEnd = false;
                        CodePart = 4;
                    }
                    else
                    {
                        Note = "Searching for insertion point";
                        OldCurIn = CurIn;
                        CurIn++;
                    }
                    break;

                case 4:
                    areInserting = true;
                    insDex = NotSorted ? 0 : CurIn;
                    Note = "Inserted item; will redraw list";
                    CodePart = 5;
                    break;

                case 5:
                    Link newLink = new Link(tempPers!);
                    if (insertAtEnd)
                    {
                        linkArray[CurIn] = newLink;
                    }
                    else
                    {
                        for (int i = TotalLinks; i > insDex; i--)
                        {
                            linkArray[i] = linkArray[i - 1];
                        }
                        linkArray[insDex] = newLink;
                    }

                    TotalLinks++;
                    areInserting = false;
                    Note = insertAtEnd
                        ? "Inserted item with key " + insKey + " at end of list"
                        : "Inserted item with key " + insKey;
                    CodePart = 6;
                    break;

                case 6:
                    Note = "Insertion completed; total items = " + TotalLinks;
                    CodePart = 7;
                    break;

                case 7:
                    Note = "Press any button";
                    CurIn = -1;
                    OldCurIn = -1;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Find(bool isNumber, int value)
        {
            if (OpMode != 3)
            {
                OpMode = 3;
                CodePart = 1;
                areInserting = false;
                areDeleting = false;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Enter key of item to find";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > MAX_KEY)
                    {
                        Note = "ERROR: use key between 0 and " + MAX_KEY;
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }
                    findKey = value;
                    CurIn = 0;
                    OldCurIn = -1;
                    Note = "Looking for item with key " + findKey;
                    CodePart = 3;
                    break;

                case 3:
                    if (CurIn < TotalLinks)
                    {
                        int currentVal = linkArray[CurIn]?.PersData.GetHeight() ?? -1;
                        if (currentVal == findKey)
                        {
                            Note = "Have found item with key " + findKey;
                            CodePart = 6;
                            return;
                        }

                        if (!NotSorted && currentVal > findKey)
                        {
                            Note = "Can't locate item with key " + findKey;
                            CodePart = 6;
                            return;
                        }

                        Note = "Searching for item with key " + findKey;
                        OldCurIn = CurIn;
                        CurIn++;
                    }
                    else
                    {
                        Note = "Can't locate item with key " + findKey;
                        CodePart = 6;
                    }
                    break;

                case 6:
                    Note = "Press any button";
                    CurIn = -1;
                    OldCurIn = -1;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Delete(bool isNumber, int value)
        {
            if (OpMode != 4)
            {
                OpMode = 4;
                CodePart = 1;
                areInserting = false;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Enter key of item to delete";
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNumber || value < 0 || value > MAX_KEY)
                    {
                        Note = "ERROR: use key between 0 and " + MAX_KEY;
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }
                    delKey = value;
                    CurIn = 0;
                    OldCurIn = -1;
                    Note = "Looking for item with key " + delKey;
                    CodePart = 3;
                    break;

                case 3:
                    if (CurIn < TotalLinks)
                    {
                        int currentVal = linkArray[CurIn]?.PersData.GetHeight() ?? -1;
                        if (currentVal == delKey)
                        {
                            delDex = CurIn;
                            Note = "Have found item with key " + delKey;
                            CodePart = 4;
                            return;
                        }

                        if (!NotSorted && currentVal > delKey)
                        {
                            Note = "Can't locate item with key " + delKey;
                            CodePart = 6;
                            return;
                        }

                        Note = "Searching for item with key " + delKey;
                        OldCurIn = CurIn;
                        CurIn++;
                    }
                    else
                    {
                        Note = "Can't locate item with key " + delKey;
                        CodePart = 6;
                    }
                    break;

                case 4:
                    areDeleting = true;
                    Note = "Deleted item; will redraw list";
                    CodePart = 5;
                    break;

                case 5:
                    for (int i = delDex; i < TotalLinks - 1; i++)
                    {
                        linkArray[i] = linkArray[i + 1];
                    }
                    linkArray[TotalLinks - 1] = null;
                    TotalLinks--;
                    areDeleting = false;
                    Note = "Deleted item with key " + delKey;
                    CodePart = 6;
                    break;

                case 6:
                    Note = "Press any button";
                    CurIn = -1;
                    OldCurIn = -1;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.LightGray);

            using (Brush backBrush = new SolidBrush(Color.LightGray))
            using (Pen borderPen = new Pen(Color.DarkGray))
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Monospace", 9, FontStyle.Bold))
            {
                g.FillRectangle(backBrush, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawString(Note, noteFont, textBrush, LeftMargin + 6, NoteBoxTop + 5);
            }

            if (TotalLinks > 0)
            {
                using (Font firstFont = new Font("SansSerif", 8, FontStyle.Bold))
                using (Brush firstBrush = new SolidBrush(Color.Blue))
                using (Pen firstPen = new Pen(Color.Blue, 2))
                {
                    g.DrawString("First", firstFont, firstBrush, StartX - 28, StartY + 2);
                    g.DrawLine(firstPen, StartX - 10, StartY + 8, StartX - 2, StartY + 8);
                    SmallArrow(g, StartX - 2, StartY + 8, Color.Blue);
                }
            }

            for (int i = 0; i < TotalLinks; i++)
            {
                int col = i % NColumns;
                int row = i / NColumns;
                int x = StartX + col * ColumnWidth;
                int y = StartY + row * RowHeight;

                Link? l = linkArray[i];
                if (l == null) continue;

                bool isBeingDeleted = areDeleting && i == delDex;

                if (isBeingDeleted)
                {
                    using (Pen delPen = new Pen(Color.Red, 1) { DashStyle = System.Drawing.Drawing2D.DashStyle.Dash })
                    using (Brush delBrush = new SolidBrush(Color.Red))
                    using (Font delFont = new Font("SansSerif", 7, FontStyle.Bold))
                    {
                        g.DrawRectangle(delPen, x, y, LinkWidth, LinkHeight);
                        g.DrawString("DEL", delFont, delBrush, x + 8, y + 2);
                    }
                }
                else
                {
                    using (Brush b = new SolidBrush(l.PersData.GetColor()))
                    {
                        g.FillRectangle(b, x + 1, y + 1, LinkWidth - 1, LinkHeight - 1);
                    }

                    using (Pen lightPen = new Pen(Color.White))
                    using (Pen darkPen = new Pen(Color.DimGray))
                    using (Pen framePen = new Pen(Color.Black))
                    {
                        g.DrawLine(lightPen, x + 1, y + LinkHeight - 1, x + 1, y + 1);
                        g.DrawLine(lightPen, x + 1, y + 1, x + LinkWidth - 1, y + 1);
                        g.DrawLine(darkPen, x + LinkWidth - 1, y + 1, x + LinkWidth - 1, y + LinkHeight - 1);
                        g.DrawRectangle(framePen, x, y, LinkWidth, LinkHeight);
                    }

                    using (Font valFont = new Font("SansSerif", 8, FontStyle.Bold))
                    using (Brush valBrush = new SolidBrush(Color.Black))
                    {
                        string str = l.PersData.GetHeight().ToString();
                        SizeF s = g.MeasureString(str, valFont);
                        g.DrawString(str, valFont, valBrush, x + (LinkWidth - s.Width) / 2, y + 2);
                    }
                }

                if (i < TotalLinks - 1)
                {
                    int nextRow = (i + 1) / NColumns;
                    if (col < NColumns - 1)
                    {
                        using (Pen linkPen = new Pen(Color.Black, 2))
                        {
                            g.DrawLine(linkPen, x + LinkWidth, y + 8, x + LinkWidth + 20, y + 8);
                            SmallArrow(g, x + LinkWidth + 20, y + 8, Color.Black);
                        }
                    }
                    else
                    {
                        using (Pen wrapPen = new Pen(Color.Black, 2))
                        {
                            g.DrawLine(wrapPen, x + LinkWidth, y + 8, x + LinkWidth + 8, y + 8);
                            g.DrawLine(wrapPen, x + LinkWidth + 8, y + 8, x + LinkWidth + 8, y + 36);
                            g.DrawLine(wrapPen, x + LinkWidth + 8, y + 36, 14, y + 36);
                            g.DrawLine(wrapPen, 14, y + 36, 14, StartY + nextRow * RowHeight + 8);
                            g.DrawLine(wrapPen, 14, StartY + nextRow * RowHeight + 8, StartX, StartY + nextRow * RowHeight + 8);
                            SmallArrow(g, StartX, StartY + nextRow * RowHeight + 8, Color.Black);
                        }
                    }
                }
                else
                {
                    using (Pen nullPen = new Pen(Color.DarkSlateGray, 2))
                    {
                        g.DrawLine(nullPen, x + LinkWidth, y + 8, x + LinkWidth + 12, y + 8);
                        g.DrawLine(nullPen, x + LinkWidth + 12, y + 3, x + LinkWidth + 12, y + 13);
                        g.DrawLine(nullPen, x + LinkWidth + 15, y + 5, x + LinkWidth + 15, y + 11);
                        g.DrawLine(nullPen, x + LinkWidth + 18, y + 7, x + LinkWidth + 18, y + 9);
                    }
                }

                if (CurIn == i)
                {
                    int arrowX = x + LinkWidth / 2;
                    using (Pen curPen = new Pen(Color.Red, 2))
                    using (Brush curBrush = new SolidBrush(Color.Red))
                    {
                        g.DrawLine(curPen, arrowX, y - 18, arrowX, y - 2);
                        Point[] head = new Point[]
                        {
                            new Point(arrowX, y - 2),
                            new Point(arrowX - 4, y - 7),
                            new Point(arrowX + 4, y - 7)
                        };
                        g.FillPolygon(curBrush, head);
                    }
                }
            }

            if (areInserting && tempPers != null)
            {
                int col = insDex % NColumns;
                int row = insDex / NColumns;
                int tempX = 15 + col * ColumnWidth;
                int tempY = 115 + row * RowHeight;

                using (Brush b = new SolidBrush(tempPers.GetColor()))
                using (Pen p = new Pen(Color.Black, 2))
                using (Font f = new Font("SansSerif", 8, FontStyle.Bold))
                using (Brush tb = new SolidBrush(Color.Black))
                {
                    g.FillRectangle(b, tempX, tempY, LinkWidth, LinkHeight);
                    g.DrawRectangle(p, tempX, tempY, LinkWidth, LinkHeight);
                    string str = tempPers.GetHeight().ToString();
                    SizeF s = g.MeasureString(str, f);
                    g.DrawString(str, f, tb, tempX + (LinkWidth - s.Width) / 2, tempY + 2);
                }

                using (Pen splicePen = new Pen(Color.Green, 2))
                {
                    if (insDex > 0)
                    {
                        int predCol = (insDex - 1) % NColumns;
                        int predRow = (insDex - 1) / NColumns;
                        int predX = StartX + predCol * ColumnWidth + LinkWidth;
                        int predY = StartY + predRow * RowHeight + 8;
                        g.DrawLine(splicePen, predX, predY, tempX, tempY + 8);
                    }

                    int succX = StartX + col * ColumnWidth;
                    int succY = StartY + row * RowHeight + 8;
                    g.DrawLine(splicePen, tempX + LinkWidth, tempY + 8, succX, succY);
                    SmallArrow(g, succX, succY, Color.Green);
                }
            }
        }

        private void SmallArrow(Graphics g, int x, int y, Color color)
        {
            using (Pen p = new Pen(color, 2))
            {
                g.DrawLine(p, x, y, x - 5, y - 4);
                g.DrawLine(p, x, y, x - 5, y + 4);
            }
        }
    }
}`
  },
  {
    name: 'Link.cs',
    filename: 'Link.cs',
    language: 'csharp',
    descriptionAr: 'فئة العقدة (Link Node) التي تحتوي على مرجع بيانات الشخص (Person Data).',
    descriptionEn: 'Link node class holding Person data reference.',
    content: `namespace LinkListViewer
{
    public class Link
    {
        public Person PersData { get; set; }

        public Link(Person persData)
        {
            PersData = persData;
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'فئة كائن الشخص المخزن داخل العقدة (المفتاح واللون).',
    descriptionEn: 'Person item class storing key height and pastel Color.',
    content: `using System.Drawing;

namespace LinkListViewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة الدخول الرئيسية لبرنامج C# Windows Forms.',
    descriptionEn: 'Application entry point initializing WinForms runtime.',
    content: `using System;
using System.Windows.Forms;

namespace LinkListViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new LinkListForm());
        }
    }
}`
  },
  {
    name: 'LinkListViewer.csproj',
    filename: 'LinkListViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio C# (.NET 8 WinForms)',
    descriptionEn: 'Visual Studio .NET 8 Windows Forms project file',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>LinkListViewer</RootNamespace>
    <AssemblyName>LinkListViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت القائمة المترابطة (Linked List) لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_TOWERS: CSharpSourceFile[] = [
  {
    name: 'TowersForm.cs',
    filename: 'TowersForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية لمشروع أبراج هانوي مع معالجة أحداث السحب والإفلات والمؤقت وزر الخطوة.',
    descriptionEn: 'Windows Forms form handling mouse drag-and-drop, step-by-step timer execution, and user controls.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace TowersViewer
{
    public partial class TowersForm : Form
    {
        private GameGroup theGameGroup;
        private readonly System.Windows.Forms.Timer runTimer;
        private bool isRunning = false;

        public TowersForm()
        {
            InitializeComponent();
            theGameGroup = new GameGroup(3);

            runTimer = new System.Windows.Forms.Timer { Interval = 400 };
            runTimer.Tick += RunTimer_Tick;

            panelCanvas.Paint += PanelCanvas_Paint;
            panelCanvas.MouseDown += PanelCanvas_MouseDown;
            panelCanvas.MouseMove += PanelCanvas_MouseMove;
            panelCanvas.MouseUp += PanelCanvas_MouseUp;

            typeof(Panel).InvokeMember("DoubleBuffered",
                System.Reflection.BindingFlags.SetProperty |
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.NonPublic,
                null, panelCanvas, new object[] { true });

            UpdateUIStatus();
        }

        private void PanelCanvas_Paint(object? sender, PaintEventArgs e)
        {
            theGameGroup.Draw(e.Graphics);
        }

        private void PanelCanvas_MouseDown(object? sender, MouseEventArgs e)
        {
            if (isRunning) return;
            theGameGroup.StartDrag(e.X, e.Y);
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void PanelCanvas_MouseMove(object? sender, MouseEventArgs e)
        {
            if (theGameGroup.IsDragging)
            {
                theGameGroup.DragX = e.X;
                theGameGroup.DragY = e.Y;
                panelCanvas.Invalidate();
            }
        }

        private void PanelCanvas_MouseUp(object? sender, MouseEventArgs e)
        {
            if (theGameGroup.IsDragging)
            {
                theGameGroup.EndDrag(e.X, e.Y);
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            if (int.TryParse(txtNumber.Text, out int count) && count >= 1 && count <= 10)
            {
                theGameGroup = new GameGroup(count);
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
            else
            {
                theGameGroup.CreationError();
                panelCanvas.Invalidate();
                UpdateUIStatus();
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            theGameGroup.Step();
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            isRunning = !isRunning;
            if (isRunning)
            {
                btnRun.Text = "Pause";
                btnStep.Enabled = false;
                btnNew.Enabled = false;
                runTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                btnStep.Enabled = true;
                btnNew.Enabled = true;
                runTimer.Stop();
            }
            UpdateUIStatus();
        }

        private void RunTimer_Tick(object? sender, EventArgs e)
        {
            if (theGameGroup.IsDoneFlag)
            {
                isRunning = false;
                btnRun.Text = "Run";
                btnStep.Enabled = true;
                btnNew.Enabled = true;
                runTimer.Stop();
                panelCanvas.Invalidate();
                UpdateUIStatus();
                return;
            }

            theGameGroup.Step();
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void BtnReset_Click(object? sender, EventArgs e)
        {
            isRunning = false;
            runTimer.Stop();
            btnRun.Text = "Run";
            btnStep.Enabled = true;
            btnNew.Enabled = true;

            int count = 3;
            if (int.TryParse(txtNumber.Text, out int c) && c >= 1 && c <= 10)
            {
                count = c;
            }

            theGameGroup = new GameGroup(count);
            panelCanvas.Invalidate();
            UpdateUIStatus();
        }

        private void TrackSpeed_Scroll(object? sender, EventArgs e)
        {
            runTimer.Interval = trackSpeed.Value;
        }

        private void UpdateUIStatus()
        {
            lblNote.Text = theGameGroup.Note;
            lblStatusDisks.Text = $"Disks: {theGameGroup.NDisks}";
            lblStackDepth.Text = $"Stack Frames: {theGameGroup.TheStack.Count}";
            lblCodePart.Text = $"CodePart: {theGameGroup.CodePart}";
        }
    }
}`
  },
  {
    name: 'GameGroup.cs',
    filename: 'GameGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق خوارزمية العودية ومحاكاة مكدس الاستدعاءات الصريح والتفاعل بالسحب والإفلات.',
    descriptionEn: 'Core recursive algorithm state machine, call stack simulator, and drag-and-drop logic.',
    content: `using System;
using System.Drawing;

namespace TowersViewer
{
    public class GameGroup
    {
        public int MaxDiskWidth { get; } = 120;
        public int AppletWidth { get; } = 440;
        public int AppletHeight { get; } = 335;
        public int XTowerA { get; } = 80;
        public int XTowerB { get; } = 220;
        public int XTowerC { get; } = 360;
        public int NoteBoxTop { get; } = 45;
        public int NoteBoxHeight { get; } = 25;
        public int NoteBoxWidth { get; } = 420;

        public string Note { get; set; } = "Press any button, or drag disk to another post";
        public int OpMode { get; set; } = 0;
        public int CodePart { get; set; } = 1;
        public Tower[] TowerArray { get; private set; }
        public int NDisks { get; set; }
        public int WidthFactor { get; set; }
        public CallStack TheStack { get; }
        public Params? TheseParams { get; set; }

        public int N { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public int Inter { get; set; }
        public bool IsDoneFlag { get; set; } = false;

        public Disk? DraggedDisk { get; set; }
        public int DragSourceTower { get; set; } = -1;
        public int DragX { get; set; } = 0;
        public int DragY { get; set; } = 0;
        public bool IsDragging { get; set; } = false;

        public static readonly Color[] DiskPalette = new Color[]
        {
            Color.FromArgb(255, 59, 48),
            Color.FromArgb(255, 149, 0),
            Color.FromArgb(255, 204, 0),
            Color.FromArgb(52, 199, 89),
            Color.FromArgb(0, 199, 190),
            Color.FromArgb(48, 176, 199),
            Color.FromArgb(0, 122, 255),
            Color.FromArgb(88, 86, 214),
            Color.FromArgb(175, 82, 222),
            Color.FromArgb(255, 45, 85),
        };

        public GameGroup(int nDisks)
        {
            NDisks = Math.Max(1, Math.Min(10, nDisks));
            TheStack = new CallStack(64);
            WidthFactor = MaxDiskWidth / NDisks;

            TowerArray = new Tower[3];
            TowerArray[0] = new Tower(XTowerA, 'A', NDisks);
            TowerArray[1] = new Tower(XTowerB, 'B', NDisks);
            TowerArray[2] = new Tower(XTowerC, 'C', NDisks);

            for (int i = NDisks; i >= 1; i--)
            {
                int w = MaxDiskWidth - (NDisks - i) * WidthFactor + 14;
                Color c = DiskPalette[(i - 1) % DiskPalette.Length];
                TowerArray[0].InsertDisk(new Disk(Math.Max(30, w), c, i.ToString()));
            }

            Note = "Press any button, or drag disk to another post";
            OpMode = 0;
            CodePart = 1;
            IsDoneFlag = false;
        }

        public void CreationError() => Note = "Before using New, enter number of disks (1 to 10)";
        public void WarningNew() => Note = "ARE YOU SURE? Press again to reset game";

        public int CloseTo(int x, int y)
        {
            if (Math.Abs(x - XTowerA) < 45) return 0;
            if (Math.Abs(x - XTowerB) < 45) return 1;
            if (Math.Abs(x - XTowerC) < 45) return 2;
            return -1;
        }

        public void StartDrag(int x, int y)
        {
            int tIdx = CloseTo(x, y);
            if (tIdx == -1) { Note = "Drag a colored DISK to a different black TOWER"; return; }
            Tower t = TowerArray[tIdx];
            if (t.IsEmpty()) { Note = "NO DISKS on tower " + t.Label; return; }

            DraggedDisk = t.PeekDisk();
            DragSourceTower = tIdx;
            DragX = x;
            DragY = y;
            IsDragging = true;
            Note = "Dragging from tower " + t.Label;
        }

        public void EndDrag(int x, int y)
        {
            if (!IsDragging || DraggedDisk == null || DragSourceTower == -1)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                return;
            }

            int toTower = CloseTo(x, y);
            if (toTower == -1 || toTower == DragSourceTower)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                Note = "Press any button, or drag disk to another post";
                return;
            }

            Tower target = TowerArray[toTower];
            Tower source = TowerArray[DragSourceTower];

            if (!target.IsEmpty() && DraggedDisk.Width >= target.PeekDisk()!.Width)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                Note = "Must put a SMALLER disk ON a LARGER disk";
                return;
            }

            Disk? moved = source.RemoveDisk();
            if (moved != null) target.InsertDisk(moved);

            IsDragging = false;
            DraggedDisk = null;
            DragSourceTower = -1;

            if (TowerArray[2].IsFull())
            {
                Note = "Congratulations! You moved all the disks!";
                IsDoneFlag = true;
            }
            else
            {
                Note = $"Moved disk {moved?.Label} from {source.Label} to {target.Label}";
            }
        }

        public void Step()
        {
            if (OpMode == 0) { OpMode = 1; CodePart = 1; }

            switch (CodePart)
            {
                case 1:
                    if (!TowerArray[1].IsEmpty() || !TowerArray[2].IsEmpty())
                    {
                        Note = "You must begin with ALL DISKS ON TOWER A";
                        CodePart = 8;
                        return;
                    }
                    Note = "Will shift all disks from A to C";
                    TheseParams = new Params(NDisks, 0, 2, 1, 8);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 2:
                    TheseParams = TheStack.Peek();
                    N = TheseParams.N;
                    From = TheseParams.From;
                    To = TheseParams.To;
                    Inter = TheseParams.Inter;
                    Note = $"Entering function with {N} disks";
                    CodePart = 3;
                    break;

                case 3:
                    if (N == 1)
                    {
                        Disk? d = TowerArray[From].RemoveDisk();
                        if (d != null)
                        {
                            TowerArray[To].InsertDisk(d);
                            Note = $"Moved disk {d.Label} from {TowerArray[From].Label} to {TowerArray[To].Label}";
                        }
                        if (TowerArray[2].IsFull())
                            Note = "Congratulations! You moved all the disks!";
                        CodePart = 7;
                    }
                    else
                    {
                        Note = "More than one disk, will continue";
                        CodePart = 4;
                    }
                    break;

                case 4:
                    Note = $"Will move top {N - 1} disks from {TowerArray[From].Label} to {TowerArray[Inter].Label}";
                    TheseParams = new Params(N - 1, From, Inter, To, 5);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 5:
                    Disk? rem = TowerArray[From].RemoveDisk();
                    if (rem != null)
                    {
                        TowerArray[To].InsertDisk(rem);
                        Note = $"Moved remaining disk {N} from {TowerArray[From].Label} to {TowerArray[To].Label}";
                    }
                    CodePart = 6;
                    break;

                case 6:
                    Note = $"Will move top {N - 1} disks from {TowerArray[Inter].Label} to {TowerArray[To].Label}";
                    TheseParams = new Params(N - 1, Inter, To, From, 7);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 7:
                    TheseParams = TheStack.Pop();
                    int returnCode = TheseParams.CodePart;

                    if (TheStack.IsEmpty())
                    {
                        Note = $"Returning from function with {N} disks";
                        CodePart = 8;
                    }
                    else
                    {
                        TheseParams = TheStack.Peek();
                        N = TheseParams.N;
                        From = TheseParams.From;
                        To = TheseParams.To;
                        Inter = TheseParams.Inter;
                        Note = $"Returning from function with {N} disks";
                        CodePart = returnCode;
                    }
                    break;

                case 8:
                default:
                    Note = "Press New to reset";
                    IsDoneFlag = true;
                    break;
            }
        }

        public void Draw(Graphics g)
        {
            using (Brush bgBrush = new SolidBrush(Color.LightGray))
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);

            using (Pen borderPen = new Pen(Color.Black))
                g.DrawRectangle(borderPen, 2, 71, 436, 229);

            using (Brush groundBrush = new SolidBrush(Color.Black))
                g.FillRectangle(groundBrush, 15, 300, 410, 6);

            for (int i = 0; i < 3; i++)
                TowerArray[i].DrawTower(g, 1, 0);

            if (IsDragging && DraggedDisk != null)
                DraggedDisk.DrawDisk(g, DragX, (300 - DragY) / 20);

            using (Brush noteBg = new SolidBrush(Color.LightGray))
                g.FillRectangle(noteBg, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);

            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 9, FontStyle.Bold))
                g.DrawString(Note, font, textBrush, 16, 50);
        }
    }
}`
  },
  {
    name: 'Tower.cs',
    filename: 'Tower.cs',
    language: 'csharp',
    descriptionAr: 'كلاس يمثل عمود البرج وتخزين أقراصه ورسمه.',
    descriptionEn: 'Represents a tower peg and maintains its disk stack.',
    content: `using System;
using System.Drawing;

namespace TowersViewer
{
    public class Tower
    {
        public int GroundLevel { get; } = 300;
        public int DiskHeight { get; } = 20;
        public int TowerWidth { get; } = 15;
        public int TowerTop { get; } = 80;
        public int TowerHeight { get; } = 220;
        public int NDisks { get; set; }
        public int XCtr { get; set; }
        public char Label { get; set; }

        public Disk[] DiskArray { get; private set; }
        public int ArrayTop { get; private set; } = -1;

        public Tower(int xCtr, char label, int nDisks)
        {
            XCtr = xCtr;
            Label = label;
            NDisks = nDisks;
            DiskArray = new Disk[10];
            ArrayTop = -1;
        }

        public void InsertDisk(Disk d) => DiskArray[++ArrayTop] = d;

        public Disk? RemoveDisk()
        {
            if (ArrayTop < 0) return null;
            Disk d = DiskArray[ArrayTop];
            DiskArray[ArrayTop] = null!;
            ArrayTop--;
            return d;
        }

        public Disk? PeekDisk() => ArrayTop < 0 ? null : DiskArray[ArrayTop];
        public bool IsEmpty() => ArrayTop < 0;
        public bool IsFull() => ArrayTop == NDisks - 1;

        public void DrawTower(Graphics g, int drawMode, int ddCode)
        {
            int poleX = XCtr - (TowerWidth / 2);
            using (Brush poleBrush = new SolidBrush(Color.Black))
                g.FillRectangle(poleBrush, poleX, TowerTop, TowerWidth, TowerHeight);

            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 11, FontStyle.Bold))
            {
                string s = Label.ToString();
                SizeF size = g.MeasureString(s, font);
                g.DrawString(s, font, textBrush, XCtr - (size.Width / 2), GroundLevel + 16);
            }

            for (int i = 0; i <= ArrayTop; i++)
            {
                if (DiskArray[i] != null)
                    DiskArray[i].DrawDisk(g, XCtr, i);
            }
        }
    }
}`
  },
  {
    name: 'Disk.cs',
    filename: 'Disk.cs',
    language: 'csharp',
    descriptionAr: 'كلاس يمثل القرص ولونه وعرضه ورسمه بنمط الكبسولة الدائرية.',
    descriptionEn: 'Capsule-styled disk representation with width, color, and label.',
    content: `using System;
using System.Drawing;

namespace TowersViewer
{
    public class Disk
    {
        public int GroundLevel { get; } = 300;
        public int Height { get; } = 20;
        public int Width { get; set; }
        public Color DiskColor { get; set; }
        public string Label { get; set; }

        public Disk(int width, Color color, string label)
        {
            Width = width;
            DiskColor = color;
            Label = label;
        }

        public void DrawDisk(Graphics g, int x, int y)
        {
            int left = x - (Width / 2);
            int top = GroundLevel - (y + 1) * Height;
            int radius = Height / 2;

            using (Brush blackBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(blackBrush, left, top, Width, Height);
                g.FillPie(blackBrush, left - radius, top, Height, Height, 90, 180);
                g.FillPie(blackBrush, left + Width - radius, top, Height, Height, 270, 180);
            }

            using (Brush bodyBrush = new SolidBrush(DiskColor))
            {
                g.FillRectangle(bodyBrush, left, top + 1, Width, Height - 2);
                g.FillPie(bodyBrush, left - radius + 1, top + 1, Height - 2, Height - 2, 90, 180);
                g.FillPie(bodyBrush, left + Width - radius - 1, top + 1, Height - 2, Height - 2, 270, 180);
            }

            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 9, FontStyle.Bold))
            {
                SizeF size = g.MeasureString(Label, font);
                g.DrawString(Label, font, textBrush, x - (size.Width / 2), top + (Height - size.Height) / 2);
            }
        }
    }
}`
  },
  {
    name: 'Params.cs',
    filename: 'Params.cs',
    language: 'csharp',
    descriptionAr: 'إطار استدعاء دالة doTowers ومكدس الاستدعاءات CallStack الصريح.',
    descriptionEn: 'doTowers activation frame and explicit CallStack implementation.',
    content: `using System;

namespace TowersViewer
{
    public class Params
    {
        public int N { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public int Inter { get; set; }
        public int CodePart { get; set; }

        public Params(int n, int from, int to, int inter, int codePart)
        {
            N = n;
            From = from;
            To = to;
            Inter = inter;
            CodePart = codePart;
        }
    }

    public class CallStack
    {
        private readonly Params[] stackArray;
        public int Top { get; private set; } = -1;
        public int MaxSize { get; }

        public CallStack(int maxSize)
        {
            MaxSize = maxSize;
            stackArray = new Params[maxSize];
        }

        public void Push(Params p) => stackArray[++Top] = p;
        public Params Pop() => stackArray[Top--];
        public Params Peek() => stackArray[Top];
        public bool IsEmpty() => Top < 0;
        public bool IsFull() => Top == MaxSize - 1;
        public int Count => Top + 1;
    }
}`
  },
  {
    name: 'TowersViewer.csproj',
    filename: 'TowersViewer.csproj',
    language: 'csharp',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 Windows Forms.',
    descriptionEn: '.NET 8.0 Windows Forms project file.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>TowersViewer</RootNamespace>
    <AssemblyName>TowersViewer</AssemblyName>
    <Description>عارض ومحاكي أبليت أبراج هانوي لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_QUICK_SORT_1: CSharpSourceFile[] = [
  {
    name: 'QuickSort1Form.cs',
    filename: 'QuickSort1Form.cs',
    language: 'csharp',
    descriptionAr: 'نافذة العرض التفاعلية (Windows Forms) ومعالجة أزرار New و Size و Draw و Run و Step.',
    descriptionEn: 'Main Windows Forms GUI handling buttons (New, Size, Draw, Run, Step) and GDI+ rendering.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace QuickSort1Viewer
{
    public partial class QuickSort1Form : Form
    {
        private PersonGroup _group;
        private readonly System.Windows.Forms.Timer _timer;
        private bool _isRunning;

        public QuickSort1Form()
        {
            InitializeComponent();
            _group = new PersonGroup(10, 1);

            _timer = new System.Windows.Forms.Timer { Interval = 250 };
            _timer.Tick += (s, e) =>
            {
                if (_group.DoneFlag)
                {
                    _isRunning = false;
                    _timer.Stop();
                    btnRun.Text = "Run";
                }
                else
                {
                    _group.SortStep();
                }
                canvasPanel.Invalidate();
            };

            canvasPanel.Paint += (s, e) => _group.Draw(e.Graphics);
        }

        private void btnNew_Click(object sender, EventArgs e)
        {
            int newOrder = _group.InitOrder == 1 ? 2 : 1;
            _group.Init(_group.ASize, newOrder);
            canvasPanel.Invalidate();
        }

        private void btnSize_Click(object sender, EventArgs e)
        {
            int newSize = _group.ASize == 10 ? 100 : 10;
            _group.Init(newSize, _group.InitOrder);
            canvasPanel.Invalidate();
        }

        private void btnDraw_Click(object sender, EventArgs e)
        {
            canvasPanel.Invalidate();
        }

        private void btnRun_Click(object sender, EventArgs e)
        {
            if (_group.DoneFlag) return;
            _isRunning = !_isRunning;
            if (_isRunning)
            {
                btnRun.Text = "Pause";
                _timer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                _timer.Stop();
            }
        }

        private void btnStep_Click(object sender, EventArgs e)
        {
            if (_isRunning)
            {
                _isRunning = false;
                _timer.Stop();
                btnRun.Text = "Run";
            }
            _group.SortStep();
            canvasPanel.Invalidate();
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'آلة الحالات العودية الثمانية ومصفوفة الأعمدة ومؤشرات الفحص والمقارنات والتبديلات.',
    descriptionEn: 'The 8-state partition machine, bar drawing routines, pointer arrows, and partition stack management.',
    content: `using System;
using System.Drawing;

namespace QuickSort1Viewer
{
    public class PersonGroup
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int BaselineY = 230;

        public int ASize { get; private set; }
        public Person[] TheArray { get; private set; } = null!;
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int BarLeftMargin { get; private set; }

        public bool DoneFlag { get; private set; }
        public int CodePart { get; private set; }
        public int Comps { get; private set; }
        public int Swaps { get; private set; }
        public int InitOrder { get; private set; }

        public int Left { get; private set; }
        public int Right { get; private set; }
        public int Pivot { get; private set; }
        public int LeftScan { get; private set; }
        public int RightScan { get; private set; }

        public Stack LeftStack { get; private set; } = null!;
        public Stack RightStack { get; private set; } = null!;
        public string Note { get; private set; } = "Press any button";

        public PersonGroup(int aSize = 10, int initOrder = 1)
        {
            Init(aSize, initOrder);
        }

        public void Init(int aSize, int initOrder)
        {
            ASize = aSize;
            InitOrder = initOrder;
            TheArray = new Person[ASize];

            if (ASize == 100)
            {
                BarWidth = 2;
                BarSeparation = 1;
                BarLeftMargin = 10;
            }
            else
            {
                BarWidth = 18;
                BarSeparation = 7;
                BarLeftMargin = 35;
            }

            Comps = 0;
            Swaps = 0;
            DoneFlag = false;
            CodePart = 1;

            Left = 0;
            Right = ASize - 1;
            Pivot = -1;
            LeftScan = -1;
            RightScan = -1;

            LeftStack = new Stack(50);
            RightStack = new Stack(50);
            Note = "Press any button";

            var rand = new Random();
            if (InitOrder == 1)
            {
                for (int i = 0; i < ASize; i++)
                {
                    int h = rand.Next(5, 200);
                    Color c = Color.FromArgb(rand.Next(60, 255), rand.Next(60, 255), rand.Next(60, 255));
                    TheArray[i] = new Person(h, c);
                }
            }
            else
            {
                for (int i = 0; i < ASize; i++)
                {
                    int h = 195 - (195 * i / ASize);
                    int r = Math.Min(255, 255 - (150 * i / ASize));
                    int g = Math.Min(255, 100 + (100 * i / ASize));
                    int b = Math.Min(255, 50 + (180 * i / ASize));
                    TheArray[i] = new Person(h, Color.FromArgb(r, g, b));
                }
            }

            Pivot = TheArray[Right].Height;
        }

        public void SortStep()
        {
            if (DoneFlag)
            {
                Note = "Sort is complete";
                return;
            }

            switch (CodePart)
            {
                case 1:
                    if (Right - Left <= 0)
                    {
                        Note = $"Entering quickSort(); partition ({Left}-{Right}) too small to sort";
                        CodePart = 7;
                    }
                    else
                    {
                        Pivot = TheArray[Right].Height;
                        Note = $"Entering quickSort(); will partition ({Left}-{Right})";
                        CodePart = 2;
                    }
                    break;

                case 2:
                    LeftScan = Left - 1;
                    RightScan = Right;
                    Note = $"leftScan={LeftScan}, rightScan={RightScan}; will scan";
                    CodePart = 3;
                    break;

                case 3:
                    while (true)
                    {
                        LeftScan++;
                        Comps++;
                        if (LeftScan >= Right || TheArray[LeftScan].Height >= Pivot)
                            break;
                    }

                    while (true)
                    {
                        RightScan--;
                        if (RightScan <= Left)
                            break;
                        Comps++;
                        if (TheArray[RightScan].Height <= Pivot)
                            break;
                    }

                    if (LeftScan >= RightScan)
                    {
                        Note = "Scans have met; will swap pivot and leftScan";
                        CodePart = 5;
                    }
                    else
                    {
                        Note = "Will swap leftScan and rightScan";
                        CodePart = 4;
                    }
                    break;

                case 4:
                    Swap(LeftScan, RightScan);
                    Note = "Will scan again";
                    CodePart = 3;
                    break;

                case 5:
                    Swap(LeftScan, Right);
                    Note = $"Array partitioned: left ({Left}-{LeftScan - 1}), right ({LeftScan + 1}-{Right})";
                    CodePart = 6;
                    break;

                case 6:
                    LeftStack.Push(LeftScan + 1);
                    RightStack.Push(Right);
                    Note = $"Will sort left partition ({Left}-{LeftScan - 1})";
                    Right = LeftScan - 1;
                    LeftScan = -1;
                    RightScan = -1;
                    Pivot = -1;
                    CodePart = 1;
                    break;

                case 7:
                    if (LeftStack.IsEmpty())
                    {
                        DoneFlag = true;
                        Note = "Sort is complete";
                        CodePart = 8;
                    }
                    else
                    {
                        Left = LeftStack.Pop();
                        Right = RightStack.Pop();
                        LeftScan = -1;
                        RightScan = -1;
                        Pivot = -1;
                        Note = $"Will sort right partition ({Left}-{Right})";
                        CodePart = 1;
                    }
                    break;

                case 8:
                default:
                    Note = "Sort is complete - Press any button";
                    DoneFlag = true;
                    break;
            }
        }

        private void Swap(int i, int j)
        {
            var temp = TheArray[i];
            TheArray[i] = TheArray[j];
            TheArray[j] = temp;
            Swaps++;
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.FromArgb(192, 192, 192));

            using var font = new Font("Monospace", 9, FontStyle.Bold);
            using var blackBrush = new SolidBrush(Color.Black);
            g.DrawString($"Swaps = {Swaps}", font, blackBrush, 10, 8);
            g.DrawString($"Comparisons = {Comps}", font, blackBrush, 10, 22);

            g.FillRectangle(Brushes.White, 140, 8, 220, 24);
            g.DrawRectangle(Pens.Black, 140, 8, 220, 24);
            using var noteFont = new Font("SansSerif", 8);
            using var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
            g.DrawString(Note, noteFont, blackBrush, new RectangleF(140, 8, 220, 24), sf);

            for (int i = 0; i < ASize; i++)
            {
                var p = TheArray[i];
                int x = BarLeftMargin + i * (BarWidth + BarSeparation);
                int y = BaselineY - p.Height;

                using var barBrush = new SolidBrush(p.Color);
                g.FillRectangle(barBrush, x, y, BarWidth, p.Height);

                if (BarWidth >= 5)
                {
                    g.DrawLine(Pens.White, x, y + p.Height, x, y);
                    g.DrawLine(Pens.White, x, y, x + BarWidth - 1, y);
                    g.DrawLine(Pens.Gray, x + BarWidth, y, x + BarWidth, y + p.Height);
                }
            }

            if (Left >= 0 && Right >= Left && Right < ASize)
            {
                int leftX = BarLeftMargin + Left * (BarWidth + BarSeparation);
                int rightX = BarLeftMargin + Right * (BarWidth + BarSeparation) + BarWidth;
                using var linePen = new Pen(Color.Black, 2);
                g.DrawLine(linePen, leftX, BaselineY + 2, rightX, BaselineY + 2);
            }

            if (Left >= 0) DrawArrow(g, Left, Color.Blue, "left", 0);
            if (Right >= 0 && Right != Left) DrawArrow(g, Right, Color.Blue, "right", 0);
            if (LeftScan >= 0) DrawArrow(g, LeftScan, Color.Red, "leftScan", 1);
            if (RightScan >= 0) DrawArrow(g, RightScan, Color.Magenta, "rightScan", 2);
            if (CodePart >= 2 && CodePart <= 6 && Right >= 0) DrawArrow(g, Right, Color.Black, "pivot", 3);
        }

        private void DrawArrow(Graphics g, int index, Color color, string label, int level)
        {
            if (index < 0 || index >= ASize) return;
            int xCenter = BarLeftMargin + index * (BarWidth + BarSeparation) + BarWidth / 2;
            int tipY = BaselineY + 5;
            int baseY = BaselineY + 14 + level * 14;

            using var pen = new Pen(color, 1.5f);
            using var brush = new SolidBrush(color);
            using var font = new Font("Monospace", 7, FontStyle.Bold);

            g.DrawLine(pen, xCenter, tipY, xCenter, baseY);
            Point[] arrowHead = {
                new Point(xCenter, tipY),
                new Point(xCenter - 3, tipY + 4),
                new Point(xCenter + 3, tipY + 4)
            };
            g.FillPolygon(brush, arrowHead);

            using var sf = new StringFormat { Alignment = StringAlignment.Center };
            g.DrawString(label, font, brush, xCenter, baseY + 2, sf);
        }
    }
}`
  },
  {
    name: 'Stack.cs',
    filename: 'Stack.cs',
    language: 'csharp',
    descriptionAr: 'مكدس بسيط لحفظ حدود المصفوفات الجزئية (Left و Right).',
    descriptionEn: 'Integer stack for preserving partition boundaries.',
    content: `namespace QuickSort1Viewer
{
    public class Stack
    {
        private readonly int[] _st;
        private int _top;

        public Stack(int max = 50)
        {
            _st = new int[max];
            _top = -1;
        }

        public void Push(int val) => _st[++_top] = val;
        public int Pop() => _st[_top--];
        public bool IsEmpty() => _top == -1;
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'عنصر البيانات (Person) ويحمل الارتفاع واللون.',
    descriptionEn: 'Data element with height and color.',
    content: `using System.Drawing;

namespace QuickSort1Viewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }
    }
}`
  },
  {
    name: 'QuickSort1Viewer.csproj',
    filename: 'QuickSort1Viewer.csproj',
    language: 'csharp',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 Windows Forms.',
    descriptionEn: '.NET 8.0 Windows Forms project file.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>QuickSort1Viewer</RootNamespace>
    <AssemblyName>QuickSort1Viewer</AssemblyName>
    <Description>عارض ومحاكي أبليت الترتيب السريع 1 لـ روبرت لافور بلغة C# (Windows Forms)</Description>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_QUICK_SORT_2: CSharpSourceFile[] = [
  {
    name: 'QuickSort2Form.cs',
    filename: 'QuickSort2Form.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية للترتيب السريع 2 بمبدأ وسيط الثلاثة (Median-of-Three Partitioning).',
    descriptionEn: 'Main Windows Forms GUI for QuickSort 2 with Median-of-Three partitioning.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace QuickSort2Viewer
{
    public partial class QuickSort2Form : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public QuickSort2Form()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(10, 1);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 250
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateUI();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMore = thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();

            if (!hasMore)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Status: {thePersonGroup.Note} | Comparisons: {thePersonGroup.Comparisons} | Swaps: {thePersonGroup.Swaps}";
            lblOrder.Text = thePersonGroup.InitOrder == 1 ? "Order: Random" : "Order: Inverse";
            lblSize.Text = $"Bars: {thePersonGroup.Size}";
        }

        private void btnNew_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleOrder();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnSize_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleSize();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnDraw_Click(object? sender, EventArgs e)
        {
            pnlCanvas.Invalidate();
        }

        private void btnRun_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                if (thePersonGroup.IsDone)
                {
                    thePersonGroup.InitBars();
                }
                animTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void btnStep_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void pnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void tbSpeed_Scroll(object? sender, EventArgs e)
        {
            animTimer.Interval = Math.Max(20, tbSpeed.Value);
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'محرك فرز وسيط الثلاثة بآلة حالة من 9 حالات مستخرجة من بايت كود personGroup_cc1bc240.class.',
    descriptionEn: 'PersonGroup class implementing the median-of-three 9-state sorting machine.',
    content: `using System;
using System.Drawing;

namespace QuickSort2Viewer
{
    public class PersonGroup
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int BaselineY = 225;

        private int aSize;
        private Person[] theArray;
        private int barWidth;
        private int barSeparation;
        private int barLeftMargin;

        private bool doneFlag;
        private int codePart;
        private int comps;
        private int swaps;
        private int initOrder;

        private int left;
        private int right;
        private int center;
        private int size;
        private int pivot;
        private int leftScan;
        private int rightScan;

        private Stack leftStack;
        private Stack rightStack;
        private string note;

        public int Size => aSize;
        public int Comparisons => comps;
        public int Swaps => swaps;
        public bool IsDone => doneFlag;
        public string Note => note;
        public int InitOrder => initOrder;
        public int Left => left;
        public int Right => right;
        public int Center => center;
        public int Pivot => pivot;
        public int LeftScan => leftScan;
        public int RightScan => rightScan;
        public int SubarraySize => size;

        public PersonGroup(int size = 10, int order = 1)
        {
            aSize = size;
            initOrder = order;
            theArray = new Person[aSize];
            leftStack = new Stack(50);
            rightStack = new Stack(50);
            note = "Press any button";
            InitBars();
        }

        public void InitBars()
        {
            barWidth = (aSize == 100) ? 2 : 16;
            barSeparation = (aSize == 100) ? 1 : 20;
            barLeftMargin = (aSize == 100) ? 10 : 35;

            var rnd = new Random();
            for (int i = 0; i < aSize; i++)
            {
                int h;
                if (initOrder == 1)
                {
                    h = rnd.Next(5, 200);
                }
                else
                {
                    h = 195 - (195 * i / aSize);
                }
                int r = rnd.Next(55, 255);
                int g = rnd.Next(55, 255);
                int b = rnd.Next(55, 255);
                theArray[i] = new Person(h, Color.FromArgb(r, g, b));
            }

            doneFlag = false;
            codePart = 0;
            comps = 0;
            swaps = 0;
            left = 0;
            right = aSize - 1;
            center = (left + right) / 2;
            size = right - left + 1;
            pivot = center;
            leftScan = left;
            rightScan = right;
            leftStack = new Stack(50);
            rightStack = new Stack(50);
            note = "Press any button";
        }

        public void ToggleOrder()
        {
            initOrder = (initOrder == 1) ? 2 : 1;
            InitBars();
        }

        public void ToggleSize()
        {
            aSize = (aSize == 10) ? 100 : 10;
            InitBars();
        }

        private void Swap(int i1, int i2)
        {
            var temp = theArray[i1];
            theArray[i1] = theArray[i2];
            theArray[i2] = temp;
            swaps++;
        }

        public bool SortStep()
        {
            if (doneFlag)
            {
                note = "Sort is complete";
                return false;
            }

            switch (codePart)
            {
                case 0:
                    size = right - left + 1;
                    if (size <= 1)
                    {
                        note = $"Array of 1 ({left}-{right}) always sorted";
                        codePart = 1;
                    }
                    else if (size == 2)
                    {
                        note = $"Will sort 2-element array ({left}-{right})";
                        codePart = 1;
                    }
                    else
                    {
                        center = (left + right) / 2;
                        note = $"Will sort left, center, right ({left}-{center}-{right})";
                        codePart = 1;
                    }
                    break;

                case 1:
                    if (size <= 1)
                    {
                        note = "No action necessary";
                        codePart = 7;
                    }
                    else if (size == 2)
                    {
                        comps++;
                        if (theArray[left].Height > theArray[right].Height)
                        {
                            Swap(left, right);
                        }
                        note = "Done 2-element sort";
                        codePart = 7;
                    }
                    else if (size == 3)
                    {
                        comps++;
                        if (theArray[left].Height > theArray[center].Height) Swap(left, center);
                        comps++;
                        if (theArray[left].Height > theArray[right].Height) Swap(left, right);
                        comps++;
                        if (theArray[center].Height > theArray[right].Height) Swap(center, right);
                        note = "Done left-center-right sort";
                        codePart = 7;
                    }
                    else
                    {
                        comps++;
                        if (theArray[left].Height > theArray[center].Height) Swap(left, center);
                        comps++;
                        if (theArray[left].Height > theArray[right].Height) Swap(left, right);
                        comps++;
                        if (theArray[center].Height > theArray[right].Height) Swap(center, right);
                        pivot = center;
                        note = $"Will partition ({left + 1}-{right - 2}); pivot will be {pivot}";
                        codePart = 15;
                    }
                    break;

                case 15:
                    note = "Will swap pivot and right-1";
                    Swap(center, right - 1);
                    pivot = right - 1;
                    leftScan = left;
                    rightScan = right - 1;
                    codePart = 2;
                    break;

                case 2:
                    note = $"Will scan ({leftScan}-{rightScan})";
                    codePart = 3;
                    break;

                case 3:
                    int pivotVal = theArray[pivot].Height;
                    while (true)
                    {
                        leftScan++;
                        comps++;
                        if (leftScan >= right || theArray[leftScan].Height >= pivotVal) break;
                    }
                    while (true)
                    {
                        rightScan--;
                        comps++;
                        if (rightScan <= left || theArray[rightScan].Height <= pivotVal) break;
                    }

                    if (leftScan >= rightScan)
                    {
                        note = "Scans have met; will swap pivot and leftScan";
                        codePart = 5;
                    }
                    else
                    {
                        note = "Will swap leftScan and rightScan";
                        codePart = 4;
                    }
                    break;

                case 4:
                    Swap(leftScan, rightScan);
                    note = "Will scan again";
                    codePart = 3;
                    break;

                case 5:
                    Swap(leftScan, pivot);
                    note = $"Array partitioned: left ({left}-{leftScan - 1}), right ({leftScan + 1}-{right})";
                    codePart = 6;
                    break;

                case 6:
                    leftStack.Push(leftScan + 1);
                    rightStack.Push(right);
                    note = $"Will sort left partition ({left}-{leftScan - 1})";
                    right = leftScan - 1;
                    leftScan = left;
                    rightScan = right;
                    pivot = right;
                    codePart = 0;
                    break;

                case 7:
                    if (leftStack.IsEmpty())
                    {
                        doneFlag = true;
                        note = "Sort is complete";
                        codePart = 8;
                    }
                    else
                    {
                        left = leftStack.Pop();
                        right = rightStack.Pop();
                        leftScan = left;
                        rightScan = right;
                        pivot = right;
                        note = $"Will call quickSort for right partition ({left}-{right})";
                        codePart = 0;
                    }
                    break;

                case 8:
                    note = "Press any button";
                    break;
            }

            return !doneFlag;
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.FromArgb(192, 192, 192));

            using (var textBrush = new SolidBrush(Color.Black))
            using (var font = new Font("Courier New", 9, FontStyle.Bold))
            {
                g.DrawString($"Swaps = {swaps}", font, textBrush, 10, 8);
                g.DrawString($"Comparisons = {comps}", font, textBrush, 10, 22);
            }

            using (var whiteBrush = new SolidBrush(Color.White))
            using (var blackPen = new Pen(Color.Black, 1))
            using (var font = new Font("Arial", 8))
            using (var textBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(whiteBrush, 135, 8, 225, 24);
                g.DrawRectangle(blackPen, 135, 8, 225, 24);

                var sf = new StringFormat
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Center
                };
                g.DrawString(note, font, textBrush, new RectangleF(135, 8, 225, 24), sf);
            }

            for (int i = 0; i < aSize; i++)
            {
                int x = barLeftMargin + i * (barWidth + barSeparation);
                int h = theArray[i].Height;
                int y = BaselineY - h;
                theArray[i].Draw(g, x, y, barWidth, h);
            }

            if (left >= 0 && right >= left && right < aSize)
            {
                int x1 = barLeftMargin + left * (barWidth + barSeparation);
                int x2 = barLeftMargin + right * (barWidth + barSeparation) + barWidth;
                using var linePen = new Pen(Color.Black, 2);
                g.DrawLine(linePen, x1, BaselineY + 2, x2, BaselineY + 2);
            }

            DrawArrow(g, left, Color.Blue, "left", 0);
            if (right != left) DrawArrow(g, right, Color.Blue, "right", 0);
            if (size >= 3 && center >= 0 && (codePart <= 1 || codePart == 15))
                DrawArrow(g, center, Color.Green, "center", 1);
            if (leftScan >= 0 && codePart >= 2 && codePart <= 6)
                DrawArrow(g, leftScan, Color.Red, "leftScan", 2);
            if (rightScan >= 0 && codePart >= 2 && codePart <= 6)
                DrawArrow(g, rightScan, Color.Magenta, "rightScan", 3);
            if (pivot >= 0 && codePart >= 15 && codePart <= 6)
                DrawArrow(g, pivot, Color.Black, "pivot", 4);
        }

        private void DrawArrow(Graphics g, int index, Color color, string label, int level)
        {
            if (index < 0 || index >= aSize) return;

            int x = barLeftMargin + index * (barWidth + barSeparation) + barWidth / 2;
            int tipY = BaselineY + 5;
            int baseY = BaselineY + 14 + level * 13;

            using var pen = new Pen(color, 1.5f);
            using var brush = new SolidBrush(color);
            using var font = new Font("Courier New", 7, FontStyle.Bold);

            g.DrawLine(pen, x, tipY, x, baseY);
            Point[] triangle = {
                new Point(x, tipY),
                new Point(x - 3, tipY + 4),
                new Point(x + 3, tipY + 4)
            };
            g.FillPolygon(brush, triangle);

            var sf = new StringFormat { Alignment = StringAlignment.Center };
            g.DrawString(label, font, brush, x, baseY + 1, sf);
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل العمود برسم ثلاثي الأبعاد واللون الخاص به.',
    descriptionEn: 'Person bar entity with 3D drawing.',
    content: `using System;
using System.Drawing;

namespace QuickSort2Viewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color BarColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            BarColor = color;
        }

        public void Draw(Graphics g, int x, int y, int width, int height)
        {
            using var brush = new SolidBrush(BarColor);
            g.FillRectangle(brush, x, y, width, height);

            if (width >= 5)
            {
                using var lightPen = new Pen(Color.White, 1);
                using var darkPen = new Pen(Color.FromArgb(80, 80, 80), 1);

                g.DrawLine(lightPen, x, y + height, x, y);
                g.DrawLine(lightPen, x, y, x + width - 1, y);

                g.DrawLine(darkPen, x + width, y, x + width, y + height);
            }
        }
    }
}`
  },
  {
    name: 'Stack.cs',
    filename: 'Stack.cs',
    language: 'csharp',
    descriptionAr: 'مكدس استدعاءات LIFO لتخزين حدود المصفوفات الجزئية.',
    descriptionEn: 'Explicit LIFO stack storing subarray bounds.',
    content: `using System;

namespace QuickSort2Viewer
{
    public class Stack
    {
        private readonly int[] stackArray;
        private int top;

        public Stack(int max)
        {
            stackArray = new int[max];
            top = -1;
        }

        public void Push(int j) => stackArray[++top] = j;
        public int Pop() => stackArray[top--];
        public bool IsEmpty() => top == -1;
        public int Count => top + 1;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق Windows Forms.',
    descriptionEn: 'Windows Forms entry point.',
    content: `using System;
using System.Windows.Forms;

namespace QuickSort2Viewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new QuickSort2Form());
        }
    }
}`
  },
  {
    name: 'QuickSort2Viewer.csproj',
    filename: 'QuickSort2Viewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 SDK.',
    descriptionEn: 'Project file for .NET 8.0 Windows Forms.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>QuickSort2Viewer</RootNamespace>
    <AssemblyName>QuickSort2Viewer</AssemblyName>
    <ApplicationTitle>Robert Lafore QuickSort2 Workshop - Median of Three</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_MERGE_SORT: CSharpSourceFile[] = [
  {
    name: 'MergeSortForm.cs',
    filename: 'MergeSortForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية للترتيب بالدمج (Merge Sort - Divide & Conquer).',
    descriptionEn: 'Main Windows Forms GUI for Merge Sort with Divide and Conquer animations.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace MergeSortViewer
{
    public partial class MergeSortForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public MergeSortForm()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup(12, 1);

            animTimer = new System.Windows.Forms.Timer
            {
                Interval = 250
            };
            animTimer.Tick += AnimTimer_Tick;

            UpdateUI();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMore = thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();

            if (!hasMore)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
        }

        private void UpdateUI()
        {
            lblStatus.Text = $"Status: {thePersonGroup.Note} | Comparisons: {thePersonGroup.Comparisons} | Copies: {thePersonGroup.Copies}";
            lblOrder.Text = thePersonGroup.InitOrder == 1 ? "Order: Random" : "Order: Inverse";
            lblSize.Text = $"Bars: {thePersonGroup.Size}";
        }

        private void btnNew_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleOrder();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnSize_Click(object? sender, EventArgs e)
        {
            animTimer.Stop();
            btnRun.Text = "Run";
            thePersonGroup.ToggleSize();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void btnDraw_Click(object? sender, EventArgs e)
        {
            pnlCanvas.Invalidate();
        }

        private void btnRun_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                if (thePersonGroup.IsDone)
                {
                    thePersonGroup.InitBars();
                }
                animTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void btnStep_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            thePersonGroup.SortStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void pnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void tbSpeed_Scroll(object? sender, EventArgs e)
        {
            animTimer.Interval = Math.Max(20, tbSpeed.Value);
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'محرك الترتيب بالدمج بآلة حالة من 10 حالات مع مصفوفة عمل مؤقتة ومكدس استدعاءات.',
    descriptionEn: 'PersonGroup class implementing the 10-state Divide & Conquer Merge Sort machine.',
    content: `using System;
using System.Drawing;

namespace MergeSortViewer
{
    public class PersonGroup
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int BaselineY = 225;

        private int aSize;
        private Person[] theArray;
        private Person[] workSpace;
        private int barWidth;
        private int barSeparation;
        private int barLeftMargin;

        private bool doneFlag;
        private int codePart;
        private int oldCodePart;
        private int comps;
        private int copies;
        private int initOrder;
        private string note;

        private Stack theStack;
        private Params theseParams;

        private int lower;
        private int upper;
        private int mid;

        private int lowPtrM;
        private int highPtrM;
        private int upperBoundM;
        private int lowerBoundM;
        private int jM;
        private int midM;
        private int nM;
        private bool mergingFlag;

        public int Size => aSize;
        public int Comparisons => comps;
        public int Copies => copies;
        public bool IsDone => doneFlag;
        public string Note => note;
        public int InitOrder => initOrder;
        public int Lower => lower;
        public int Upper => upper;
        public int Mid => mid;
        public int Ptr => lowerBoundM + jM;

        public PersonGroup(int size = 12, int order = 1)
        {
            aSize = size;
            initOrder = order;
            theArray = new Person[aSize];
            workSpace = new Person[aSize];
            theStack = new Stack(50);
            note = "Press any button";
            InitBars();
        }

        public void InitBars()
        {
            barWidth = (aSize == 100) ? 2 : 18;
            barSeparation = (aSize == 100) ? 1 : 7;
            barLeftMargin = (aSize == 100) ? 10 : 35;

            var rnd = new Random();
            for (int i = 0; i < aSize; i++)
            {
                int h;
                if (initOrder == 1)
                {
                    h = rnd.Next(5, 200);
                }
                else
                {
                    h = 195 - (195 * i / aSize);
                }
                int r = rnd.Next(55, 255);
                int g = rnd.Next(55, 255);
                int b = rnd.Next(55, 255);
                theArray[i] = new Person(h, Color.FromArgb(r, g, b));
            }

            workSpace = new Person[aSize];
            theStack = new Stack(50);
            doneFlag = false;
            codePart = 1;
            oldCodePart = 1;
            comps = 0;
            copies = 0;
            lower = 0;
            upper = aSize - 1;
            mid = 0;
            lowPtrM = 0;
            highPtrM = 0;
            upperBoundM = 0;
            lowerBoundM = 0;
            jM = 0;
            midM = 0;
            nM = 0;
            mergingFlag = false;
            note = "Press any button";
        }

        public void ToggleOrder()
        {
            initOrder = (initOrder == 1) ? 2 : 1;
            InitBars();
        }

        public void ToggleSize()
        {
            aSize = (aSize == 12) ? 100 : 12;
            InitBars();
        }

        public bool SortStep()
        {
            if (doneFlag)
            {
                note = "Sort is complete; Press New or Size";
                return false;
            }

            switch (codePart)
            {
                case 1:
                    theseParams = new Params(0, aSize - 1, 0, 6);
                    theStack.Push(theseParams);
                    note = "Initial call to mergeSort";
                    oldCodePart = codePart;
                    codePart = 2;
                    break;

                case 2:
                    theseParams = theStack.Peek();
                    lower = theseParams.Lower;
                    upper = theseParams.Upper;
                    note = $"Entering mergeSort: {lower}-{upper}";
                    oldCodePart = codePart;

                    if (lower == upper)
                    {
                        codePart = 7;
                    }
                    else
                    {
                        codePart = 4;
                    }
                    break;

                case 4:
                    mid = (lower + upper) / 2;
                    note = $"Will sort lower half: {lower}-{mid}";
                    theStack.Push(new Params(lower, mid, mid, 5));
                    oldCodePart = codePart;
                    codePart = 2;
                    break;

                case 5:
                    theseParams = theStack.Peek();
                    lower = theseParams.Lower;
                    upper = theseParams.Upper;
                    mid = (lower + upper) / 2;
                    note = $"Will sort upper half: {mid + 1}-{upper}";
                    theStack.Push(new Params(mid + 1, upper, mid, 6));
                    oldCodePart = codePart;
                    codePart = 2;
                    break;

                case 6:
                    theseParams = theStack.Peek();
                    lower = theseParams.Lower;
                    upper = theseParams.Upper;
                    mid = (lower + upper) / 2;
                    note = "Will merge ranges";
                    lowPtrM = lower;
                    highPtrM = mid + 1;
                    upperBoundM = upper;
                    oldCodePart = codePart;
                    codePart = 9;
                    break;

                case 9:
                    jM = 0;
                    lowerBoundM = lowPtrM;
                    midM = highPtrM - 1;
                    nM = upperBoundM - lowerBoundM + 1;
                    note = $"Merged {lowPtrM}-{midM} and {highPtrM}-{upperBoundM} into workspace";

                    while (lowPtrM <= midM && highPtrM <= upperBoundM)
                    {
                        comps++;
                        copies++;
                        if (theArray[lowPtrM].Height < theArray[highPtrM].Height)
                        {
                            workSpace[jM++] = theArray[lowPtrM++];
                        }
                        else
                        {
                            workSpace[jM++] = theArray[highPtrM++];
                        }
                    }

                    while (lowPtrM <= midM)
                    {
                        copies++;
                        workSpace[jM++] = theArray[lowPtrM++];
                    }

                    while (highPtrM <= upperBoundM)
                    {
                        copies++;
                        workSpace[jM++] = theArray[highPtrM++];
                    }

                    mergingFlag = false;
                    jM = 0;
                    oldCodePart = codePart;
                    codePart = 10;
                    break;

                case 10:
                    oldCodePart = codePart;
                    if (jM < nM)
                    {
                        copies++;
                        theArray[lowerBoundM + jM] = workSpace[jM];
                        note = $"Copied workspace into {lowerBoundM + jM}";
                        jM++;
                        codePart = 10;
                    }
                    else
                    {
                        note = "Merge completed";
                        codePart = 7;
                    }
                    break;

                case 7:
                    oldCodePart = codePart;
                    var popped = theStack.Pop();
                    int retCode = popped?.CodePart ?? 8;

                    if (theStack.IsEmpty())
                    {
                        note = "Exciting mergeSort; sort is complete";
                        doneFlag = true;
                        codePart = 8;
                    }
                    else
                    {
                        theseParams = theStack.Peek();
                        lower = theseParams.Lower;
                        upper = theseParams.Upper;
                        note = $"Exiting mergeSort: {lower}-{upper}";
                        codePart = retCode;
                    }
                    break;

                case 8:
                    doneFlag = true;
                    note = "Sort is complete; Press New or Size";
                    break;
            }

            return !doneFlag;
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.FromArgb(192, 192, 192));

            using (var textBrush = new SolidBrush(Color.Black))
            using (var font = new Font("Courier New", 9, FontStyle.Bold))
            {
                g.DrawString($"Comparisons = {comps}", font, textBrush, 10, 8);
                g.DrawString($"Copies = {copies}", font, textBrush, 10, 22);
            }

            using (var whiteBrush = new SolidBrush(Color.White))
            using (var blackPen = new Pen(Color.Black, 1))
            using (var font = new Font("Arial", 8))
            using (var textBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(whiteBrush, 135, 8, 225, 24);
                g.DrawRectangle(blackPen, 135, 8, 225, 24);

                var sf = new StringFormat
                {
                    Alignment = StringAlignment.Center,
                    LineAlignment = StringAlignment.Center
                };
                g.DrawString(note, font, textBrush, new RectangleF(135, 8, 225, 24), sf);
            }

            for (int i = 0; i < aSize; i++)
            {
                int x = barLeftMargin + i * (barWidth + barSeparation);
                int h = theArray[i].Height;
                int y = BaselineY - h;
                theArray[i].Draw(g, x, y, barWidth, h);
            }

            if (lower >= 0 && upper >= lower && upper < aSize)
            {
                int x1 = barLeftMargin + lower * (barWidth + barSeparation);
                int x2 = barLeftMargin + upper * (barWidth + barSeparation) + barWidth;
                using var linePen = new Pen(Color.Black, 2);
                g.DrawLine(linePen, x1, BaselineY + 2, x2, BaselineY + 2);
            }

            DrawArrow(g, lower, Color.Blue, "lower", 0);
            if (upper != lower) DrawArrow(g, upper, Color.Blue, "upper", 0);
            if (mid >= 0 && lower != upper) DrawArrow(g, mid, Color.Green, "mid", 1);
            if (codePart == 10 && Ptr >= 0 && Ptr < aSize) DrawArrow(g, Ptr, Color.Red, "ptr", 2);
        }

        private void DrawArrow(Graphics g, int index, Color color, string label, int level)
        {
            if (index < 0 || index >= aSize) return;

            int x = barLeftMargin + index * (barWidth + barSeparation) + barWidth / 2;
            int tipY = BaselineY + 5;
            int baseY = BaselineY + 14 + level * 14;

            using var pen = new Pen(color, 1.5f);
            using var brush = new SolidBrush(color);
            using var font = new Font("Courier New", 7, FontStyle.Bold);

            g.DrawLine(pen, x, tipY, x, baseY);
            Point[] triangle = {
                new Point(x, tipY),
                new Point(x - 3, tipY + 4),
                new Point(x + 3, tipY + 4)
            };
            g.FillPolygon(brush, triangle);

            var sf = new StringFormat { Alignment = StringAlignment.Center };
            g.DrawString(label, font, brush, x, baseY + 1, sf);
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل العمود برسم ثلاثي الأبعاد واللون الخاص به.',
    descriptionEn: 'Person bar entity with 3D drawing.',
    content: `using System;
using System.Drawing;

namespace MergeSortViewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color BarColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            BarColor = color;
        }

        public void Draw(Graphics g, int x, int y, int width, int height)
        {
            using var brush = new SolidBrush(BarColor);
            g.FillRectangle(brush, x, y, width, height);

            if (width >= 5)
            {
                using var lightPen = new Pen(Color.White, 1);
                using var darkPen = new Pen(Color.FromArgb(80, 80, 80), 1);

                g.DrawLine(lightPen, x, y + height, x, y);
                g.DrawLine(lightPen, x, y, x + width - 1, y);

                g.DrawLine(darkPen, x + width, y, x + width, y + height);
            }
        }
    }
}`
  },
  {
    name: 'Params.cs',
    filename: 'Params.cs',
    language: 'csharp',
    descriptionAr: 'إطار المعلمات للاستدعاء العودي مع عنوان العودة.',
    descriptionEn: 'Recursive call stack frame with return state.',
    content: `namespace MergeSortViewer
{
    public class Params
    {
        public int Lower { get; set; }
        public int Upper { get; set; }
        public int Mid { get; set; }
        public int CodePart { get; set; }

        public Params(int lower, int upper, int mid, int codePart)
        {
            Lower = lower;
            Upper = upper;
            Mid = mid;
            CodePart = codePart;
        }
    }
}`
  },
  {
    name: 'Stack.cs',
    filename: 'Stack.cs',
    language: 'csharp',
    descriptionAr: 'مكدس استدعاءات LIFO لإطارات Params.',
    descriptionEn: 'Explicit LIFO stack for Params frames.',
    content: `namespace MergeSortViewer
{
    public class Stack
    {
        private readonly Params[] stackArray;
        private int top;

        public Stack(int max)
        {
            stackArray = new Params[max];
            top = -1;
        }

        public void Push(Params p) => stackArray[++top] = p;
        public Params Pop() => stackArray[top--];
        public Params Peek() => stackArray[top];
        public bool IsEmpty() => top == -1;
        public int Count => top + 1;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق Windows Forms.',
    descriptionEn: 'Windows Forms entry point.',
    content: `using System;
using System.Windows.Forms;

namespace MergeSortViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new MergeSortForm());
        }
    }
}`
  },
  {
    name: 'MergeSortViewer.csproj',
    filename: 'MergeSortViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 SDK.',
    descriptionEn: 'Project file for .NET 8.0 Windows Forms.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>MergeSortViewer</RootNamespace>
    <AssemblyName>MergeSortViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Merge Sort Workshop - Divide and Conquer</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_TREE: CSharpSourceFile[] = [
  {
    name: 'TreeForm.cs',
    filename: 'TreeForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية لشجرة البحث الثنائية (Binary Search Tree).',
    descriptionEn: 'Main Windows Forms GUI for Binary Search Tree with animations.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace TreeViewer
{
    public partial class TreeForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer runTimer;

        public TreeForm()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();

            runTimer = new System.Windows.Forms.Timer
            {
                Interval = 350
            };
            runTimer.Tick += RunTimer_Tick;

            UpdateUI();
        }

        private void RunTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode == 0)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
                return;
            }

            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void ExecuteCurrentStep()
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);

            switch (thePersonGroup.OpMode)
            {
                case 1: thePersonGroup.Fill(isNum, num); break;
                case 2: thePersonGroup.Find(isNum, num); break;
                case 3: thePersonGroup.Insert(isNum, num); break;
                case 4: thePersonGroup.Traverse(); break;
                case 5: thePersonGroup.Remove(isNum, num); break;
            }
        }

        private void UpdateUI()
        {
            lblStatus.Text = "Nodes: " + thePersonGroup.FilledNodes + "/31 | Mode: " + thePersonGroup.OpMode + " | Step: " + thePersonGroup.CodePart + " | " + thePersonGroup.Note;
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Fill(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Find(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Insert(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnTrav_Click(object? sender, EventArgs e)
        {
            thePersonGroup.Traverse();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Remove(isNum, num);
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (runTimer.Enabled)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                runTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            runTimer.Stop();
            btnRun.Text = "Run";
            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void PnlCanvas_MouseClick(object? sender, MouseEventArgs e)
        {
            for (int i = 0; i < PersonGroup.ASIZE; i++)
            {
                if (thePersonGroup.TreeArray[i] == null) continue;
                var coords = thePersonGroup.GetNodeCoords(i);
                int dx = e.X - (coords.x + 10);
                int dy = e.Y - (coords.y + 10);
                if (dx * dx + dy * dy <= 144)
                {
                    txtNumber.Text = thePersonGroup.TreeArray[i]!.GetHeight().ToString();
                    break;
                }
            }
        }
    }
}`
  },
  {
    name: 'TreeForm.Designer.cs',
    filename: 'TreeForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر واجهة المستخدم لبريمج الشجرة الثنائية.',
    descriptionEn: 'Windows Forms control layout and bindings.',
    content: `namespace TreeViewer
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

            lblStatus.Location = new System.Drawing.Point(10, 42);
            lblStatus.Size = new System.Drawing.Size(480, 20);
            lblStatus.Font = new System.Drawing.Font("Segoe UI", 8.5F, System.Drawing.FontStyle.Regular);
            lblStatus.ForeColor = System.Drawing.Color.FromArgb(60, 60, 60);

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
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'كلاس إدارة الشجرة الثنائية بالمصفوفة والعمليات وآلة الحالات.',
    descriptionEn: 'Core binary tree array management, state machines, and graphics.',
    content: `using System;
using System.Drawing;

namespace TreeViewer
{
    public class PersonGroup
    {
        public const int ASIZE = 31;
        public const int MAX_KEY = 99;

        public int AppletWidth { get; } = 440;
        public int AppletHeight { get; } = 300;
        public int MaxHeight { get; } = 200;
        public int TopMargin { get; } = 70;
        public int LeftMargin { get; } = 10;
        public int TextHeight { get; } = 13;
        public int NodeDiameter { get; } = 20;
        public int LevelSeparation { get; } = 40;
        public int HorizSeparation { get; } = 26;

        public int NoteBoxTop { get; } = 45;
        public int NoteBoxHeight { get; } = 25;
        public int NoteBoxWidth { get; } = 200;
        public int VisitBoxTop { get; } = 280;
        public int VisitBoxHeight { get; } = 25;
        public int VisitBoxWidth { get; } = 430;

        public Person?[] TreeArray { get; } = new Person?[ASIZE];
        public Stack TheStack { get; } = new Stack();
        public int FilledNodes { get; private set; }
        public string Note { get; private set; } = "Press a button";
        public bool IsRand { get; set; } = true;
        public int Value { get; set; }
        public int CodePart { get; set; } = 1;
        public int OpMode { get; set; } = 0;
        public int CurIn { get; set; } = 0;
        public int CurInOld { get; set; } = 0;
        public int OldArrow { get; set; } = 0;
        public int[] VisitArray { get; } = new int[ASIZE];
        public int VisitIndex { get; private set; } = 0;
        public int Successor { get; set; } = 0;
        public bool DrawAll { get; set; } = true;
        public int DrawMode { get; set; } = 2;

        private static readonly Random Rng = new();

        public PersonGroup()
        {
            for (int i = 0; i < ASIZE; i++) TreeArray[i] = null;
            DoFill(10);
            Note = "Press a button";
        }

        public Person MakePerson(int height)
        {
            int r = Rng.Next(100, 255);
            int g = Rng.Next(100, 255);
            int b = Rng.Next(100, 255);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill(int count)
        {
            for (int i = 0; i < ASIZE; i++) TreeArray[i] = null;
            FilledNodes = 0;
            bool[] used = new bool[100];
            int attempts = 0;

            while (FilledNodes < count && attempts < 100)
            {
                attempts++;
                int key = Rng.Next(0, 100);
                if (used[key]) continue;

                Person p = MakePerson(key);
                int cur = 0;

                while (cur <= 30)
                {
                    if (TreeArray[cur] == null)
                    {
                        TreeArray[cur] = p;
                        used[key] = true;
                        FilledNodes++;
                        break;
                    }

                    if (key < TreeArray[cur]!.GetHeight()) cur = 2 * cur + 1;
                    else cur = 2 * cur + 2;
                }
            }
        }

        public int InorderSuccessor(int nodeIndex)
        {
            int succ = nodeIndex;
            int cur = 2 * nodeIndex + 2;
            while (cur < 31 && TreeArray[cur] != null)
            {
                succ = cur;
                cur = 2 * cur + 1;
            }
            return succ;
        }

        public void MoveUpSubTree(int direction, int nodeIndex)
        {
            if (nodeIndex < 0 || nodeIndex > 14) return;
            int srcRoot = direction == 1 ? 2 * nodeIndex + 2 : 2 * nodeIndex + 1;
            ShiftSubtreeUp(srcRoot, nodeIndex);
        }

        private void ShiftSubtreeUp(int src, int dst)
        {
            if (src >= 31) return;
            TreeArray[dst] = TreeArray[src];
            TreeArray[src] = null;

            int leftSrc = 2 * src + 1;
            int rightSrc = 2 * src + 2;
            int leftDst = 2 * dst + 1;
            int rightDst = 2 * dst + 2;

            if (leftSrc < 31 && leftDst < 31) ShiftSubtreeUp(leftSrc, leftDst);
            if (rightSrc < 31 && rightDst < 31) ShiftSubtreeUp(rightSrc, rightDst);
        }

        public void Fill(bool isNum, int num)
        {
            if (OpMode != 1) { OpMode = 1; CodePart = 1; }
            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0; Note = "Enter number of nodes (1 to 31)";
                    CurIn = 0; OldArrow = CurInOld; CurInOld = 0; DrawMode = 0; CodePart = 2; break;
                case 2:
                    if (!isNum || num < 1 || num > 31) { Note = "Inappropriate number of nodes"; CodePart = 1; }
                    else { Note = "Will create tree of " + num + " nodes"; CodePart = 3; }
                    break;
                case 3:
                    DoFill(num); DrawMode = 2; Note = "Press any button";
                    OldArrow = CurInOld; CurInOld = 0; CodePart = 1; OpMode = 0; break;
            }
        }

        public void Find(bool isNum, int num)
        {
            if (OpMode != 2) { OpMode = 2; CodePart = 1; }
            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0; Note = "Enter key of node to find";
                    CurIn = 0; OldArrow = CurInOld; CurInOld = 0; DrawMode = 0; CodePart = 2; break;
                case 2:
                    if (!isNum || num < 0 || num > 99) { Note = "Nodes have values from 0 to 99"; CodePart = 1; }
                    else { Note = "Will try to find node with key " + num; CodePart = 3; }
                    break;
                case 3:
                    if (TreeArray[CurIn] == null) { Note = "Can't find node with that value"; CodePart = 1; OpMode = 0; return; }
                    if (num == TreeArray[CurIn]!.GetHeight())
                    {
                        Note = "Have found node " + num; OldArrow = CurInOld; CurInOld = CurIn; CodePart = 4;
                    }
                    else
                    {
                        OldArrow = CurInOld; CurInOld = CurIn;
                        if (num < TreeArray[CurIn]!.GetHeight()) { CurIn = 2 * CurIn + 1; Note = "Going to left child"; }
                        else { CurIn = 2 * CurIn + 2; Note = "Going to right child"; }
                        if (CurIn > 30 || TreeArray[CurIn] == null) { Note = "Can't find node with that value"; CodePart = 1; OpMode = 0; return; }
                        CodePart = 3;
                    }
                    break;
                case 4: Note = "Search is complete"; CodePart = 5; break;
                case 5: Note = "Press any button"; OldArrow = CurInOld; CurInOld = 0; CodePart = 1; OpMode = 0; break;
            }
        }

        public void Insert(bool isNum, int num)
        {
            if (OpMode != 3) { OpMode = 3; CodePart = 1; }
            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0; Note = "Enter value of node to insert";
                    CurIn = 0; OldArrow = CurInOld; CurInOld = 0; DrawMode = 0; CodePart = 2; break;
                case 2:
                    Value = num;
                    if (!isNum || num < 0 || num > 99) { Note = "Nodes have values from 0 to 99"; CodePart = 1; }
                    else { Note = "Will insert node with key " + Value; CodePart = 3; }
                    break;
                case 3:
                    OldArrow = CurInOld; CurInOld = CurIn;
                    if (CurIn > 30) { Note = "Level is too great"; CodePart = 4; return; }
                    if (TreeArray[CurIn] == null)
                    {
                        TreeArray[CurIn] = MakePerson(Value); Note = "Have inserted node with key " + Value;
                        FilledNodes++; CurInOld = CurIn; DrawMode = 1; CodePart = 4;
                    }
                    else
                    {
                        if (Value < TreeArray[CurIn]!.GetHeight()) { CurIn = 2 * CurIn + 1; Note = "Going to left child"; }
                        else { CurIn = 2 * CurIn + 2; Note = "Going to right child"; }
                        if (CurIn > 30) { Note = "Can't insert: Level is too great"; CodePart = 1; OpMode = 0; return; }
                        DrawMode = 0; CodePart = 3;
                    }
                    break;
                case 4: Note = "Insertion completed"; DrawMode = 0; CodePart = 5; break;
                case 5: Note = "Press any button"; OldArrow = CurInOld; CurInOld = 0; CodePart = 1; OpMode = 0; break;
            }
        }

        public void Remove(bool isNum, int num)
        {
            if (OpMode != 5) { OpMode = 5; CodePart = 1; }
            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0; Note = "Enter key of node to delete";
                    CurIn = 0; OldArrow = CurInOld; CurInOld = 0; DrawMode = 0; CodePart = 2; break;
                case 2:
                    if (!isNum || num < 0 || num > 99) { Note = "Nodes have values from 0 to 99"; CodePart = 1; }
                    else { Note = "Will try to delete node " + num; CodePart = 3; }
                    break;
                case 3:
                    if (TreeArray[CurIn] == null) { Note = "Can't find node with that value"; CodePart = 1; OpMode = 0; return; }
                    if (num == TreeArray[CurIn]!.GetHeight())
                    {
                        Note = "Have found node to delete"; OldArrow = CurInOld; CurInOld = CurIn; CodePart = 4;
                    }
                    else
                    {
                        OldArrow = CurInOld; CurInOld = CurIn;
                        if (num < TreeArray[CurIn]!.GetHeight()) { CurIn = 2 * CurIn + 1; Note = "Going to left child"; }
                        else { CurIn = 2 * CurIn + 2; Note = "Going to right child"; }
                        if (CurIn > 30 || TreeArray[CurIn] == null) { Note = "Can't find node with that value"; CodePart = 1; OpMode = 0; return; }
                        CodePart = 3;
                    }
                    break;
                case 4:
                    int left = 2 * CurIn + 1;
                    int right = 2 * CurIn + 2;
                    bool hasLeft = left <= 30 && TreeArray[left] != null;
                    bool hasRight = right <= 30 && TreeArray[right] != null;
                    if (!hasLeft && !hasRight) { Note = "Will delete node without complication"; CodePart = 6; }
                    else if (!hasLeft && hasRight) { Note = "Will replace node with its right subtree"; CodePart = 7; }
                    else if (hasLeft && !hasRight) { Note = "Will replace node with its left subtree"; CodePart = 8; }
                    else { Successor = InorderSuccessor(CurIn); Note = "Will replace node with " + TreeArray[Successor]!.GetHeight(); CodePart = 9; }
                    break;
                case 6:
                    TreeArray[CurIn] = null; FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was deleted"; DrawMode = 2; CodePart = 10; break;
                case 7:
                    MoveUpSubTree(1, CurIn); FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was replaced by its right subtree"; DrawMode = 2; CodePart = 10; break;
                case 8:
                    MoveUpSubTree(0, CurIn); FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was replaced by its left subtree"; DrawMode = 2; CodePart = 10; break;
                case 9:
                    TreeArray[CurIn] = TreeArray[Successor];
                    int succRight = 2 * Successor + 2;
                    if (succRight <= 30 && TreeArray[succRight] != null)
                    {
                        int succVal = TreeArray[succRight]!.GetHeight();
                        Note = "and replace " + succVal + " with its right subtree";
                        MoveUpSubTree(1, Successor);
                        FilledNodes = Math.Max(0, FilledNodes - 1);
                        Note = "Removed node in 2-step process";
                    }
                    else
                    {
                        TreeArray[Successor] = null;
                        FilledNodes = Math.Max(0, FilledNodes - 1);
                        Note = "Node was replaced by successor";
                    }
                    DrawMode = 2; CodePart = 10; break;
                case 10:
                    Note = "Press any button"; OldArrow = CurInOld; CurInOld = 0; CodePart = 1; OpMode = 0; break;
            }
        }

        public void Traverse()
        {
            if (OpMode != 4) { OpMode = 4; CodePart = 1; }
            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0; Note = "Will traverse tree in \"inorder\"";
                    CurIn = 0; OldArrow = CurInOld; CurInOld = 0; DrawMode = 0; CodePart = 5; break;
                case 5:
                    if (TreeArray[0] == null) { Note = "Done traversal"; CodePart = 4; return; }
                    CurIn = 0; OldArrow = CurInOld; CurInOld = CurIn; Note = "Will check left child"; CodePart = 6; break;
                case 6:
                    int left = 2 * CurIn + 1;
                    if (left <= 30 && TreeArray[left] != null)
                    {
                        TheStack.Push(CurIn); CurIn = left; OldArrow = CurInOld; CurInOld = CurIn;
                        Note = "Will check left child"; CodePart = 6;
                    }
                    else { Note = "Will visit this node"; CodePart = 7; }
                    break;
                case 7:
                    if (TreeArray[CurIn] != null) VisitArray[VisitIndex++] = TreeArray[CurIn]!.GetHeight();
                    Note = "Will check for right child"; CodePart = 8; break;
                case 8:
                    int right = 2 * CurIn + 2;
                    if (right <= 30 && TreeArray[right] != null)
                    {
                        CurIn = right; OldArrow = CurInOld; CurInOld = CurIn; Note = "Will check left child"; CodePart = 6;
                    }
                    else if (!TheStack.IsEmpty())
                    {
                        Note = "Will go to root of last subtree"; CurIn = TheStack.Pop(); OldArrow = CurInOld; CurInOld = CurIn; CodePart = 7;
                    }
                    else { Note = "Done traversal"; CodePart = 4; }
                    break;
                case 4: Note = "Done traversal"; CodePart = 10; break;
                case 10: Note = "Press any button"; OldArrow = CurInOld; CurInOld = 0; CodePart = 1; OpMode = 0; break;
            }
        }

        public (int x, int y, int level, int column, int parentCol) GetNodeCoords(int index)
        {
            int level = 0, col = 15, parentCol = 0;
            if (index == 0) { level = 0; col = 15; parentCol = 0; }
            else if (index >= 1 && index <= 2) { level = 1; col = 7 + (index - 1) * 16; parentCol = 15; }
            else if (index >= 3 && index <= 6) { level = 2; col = 3 + (index - 3) * 8; parentCol = (index % 2 == 1) ? col + 4 : col - 4; }
            else if (index >= 7 && index <= 14) { level = 3; col = 1 + (index - 7) * 4; parentCol = (index % 2 == 1) ? col + 2 : col - 2; }
            else if (index >= 15 && index <= 30) { level = 4; col = (index - 15) * 2; parentCol = (index % 2 == 1) ? col + 1 : col - 1; }

            int x = LeftMargin + col * HorizSeparation / 2;
            int y = TopMargin + level * LevelSeparation;
            return (x, y, level, col, parentCol);
        }

        public void Draw(Graphics g)
        {
            using var bgBrush = new SolidBrush(Color.FromArgb(192, 192, 192));
            g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);

            using var noteBrush = new SolidBrush(Color.FromArgb(212, 208, 200));
            g.FillRectangle(noteBrush, 10, NoteBoxTop, 420, NoteBoxHeight);
            using var boxPen = new Pen(Color.FromArgb(128, 128, 128));
            g.DrawRectangle(boxPen, 10, NoteBoxTop, 420, NoteBoxHeight);
            using var textBrush = new SolidBrush(Color.Black);
            using var noteFont = new Font("SansSerif", 9, FontStyle.Bold);
            g.DrawString(Note, noteFont, textBrush, 16, NoteBoxTop + 5);

            using var linePen = new Pen(Color.Black, 1);
            for (int i = 1; i < 31; i++)
            {
                if (TreeArray[i] == null) continue;
                int pIdx = (i - 1) / 2;
                if (TreeArray[pIdx] == null) continue;
                var child = GetNodeCoords(i);
                var parent = GetNodeCoords(pIdx);
                g.DrawLine(linePen, parent.x + 10, parent.y + 10, child.x + 10, child.y + 10);
            }

            using var nodeFont = new Font("Monospace", 9, FontStyle.Bold);
            for (int i = 0; i < 31; i++)
            {
                if (TreeArray[i] == null) continue;
                var coords = GetNodeCoords(i);
                using var brush = new SolidBrush(TreeArray[i]!.GetColor());
                g.FillEllipse(brush, coords.x, coords.y, 20, 20);
                using var borderPen = new Pen(i == CurIn ? Color.Red : Color.Black, i == CurIn ? 2 : 1);
                g.DrawEllipse(borderPen, coords.x, coords.y, 20, 20);

                string keyStr = TreeArray[i]!.GetHeight().ToString();
                int textX = coords.x + (keyStr.Length == 1 ? 7 : 4);
                g.DrawString(keyStr, nodeFont, textBrush, textX, coords.y + 4);
            }

            if (CurIn >= 0 && CurIn < 31 && TreeArray[CurIn] != null)
            {
                var coords = GetNodeCoords(CurIn);
                int arrowX = coords.x + 10;
                int arrowTipY = coords.y - 4;
                using var arrowPen = new Pen(Color.Red, 2);
                g.DrawLine(arrowPen, arrowX, arrowTipY - 16, arrowX, arrowTipY);
                using var arrowBrush = new SolidBrush(Color.Red);
                Point[] head = { new(arrowX, arrowTipY), new(arrowX - 4, arrowTipY - 6), new(arrowX + 4, arrowTipY - 6) };
                g.FillPolygon(arrowBrush, head);
            }

            g.FillRectangle(noteBrush, 10, VisitBoxTop, 420, VisitBoxHeight);
            g.DrawRectangle(boxPen, 10, VisitBoxTop, 420, VisitBoxHeight);
            string visitStr = "";
            for (int i = 0; i < VisitIndex; i++) visitStr += VisitArray[i] + "  ";
            if (string.IsNullOrEmpty(visitStr)) visitStr = "(empty)";
            g.DrawString(visitStr, noteFont, textBrush, 16, VisitBoxTop + 5);
        }
    }
}
`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'كائن العقدة المخزن في الشجرة الثنائية.',
    descriptionEn: 'Node representation storing key and color.',
    content: `using System.Drawing;

namespace TreeViewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}`
  },
  {
    name: 'Stack.cs',
    filename: 'Stack.cs',
    language: 'csharp',
    descriptionAr: 'مكدس استدعاءات LIFO لتتبع فهارس العقد أثناء التجوال المرتب.',
    descriptionEn: 'Explicit LIFO stack storing node indexes during traversal.',
    content: `namespace TreeViewer
{
    public class Stack
    {
        private readonly int[] st = new int[20];
        private int top = -1;

        public void Push(int val) => st[++top] = val;
        public int Pop() => st[top--];
        public bool IsEmpty() => top == -1;
        public int Count => top + 1;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق Windows Forms.',
    descriptionEn: 'Windows Forms entry point.',
    content: `using System;
using System.Windows.Forms;

namespace TreeViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new TreeForm());
        }
    }
}`
  },
  {
    name: 'TreeViewer.csproj',
    filename: 'TreeViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 SDK.',
    descriptionEn: 'Project file for .NET 8.0 Windows Forms.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>TreeViewer</RootNamespace>
    <AssemblyName>TreeViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Binary Tree Workshop - Chapter 9</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_HASH: CSharpSourceFile[] = [
  {
    name: 'HashForm.cs',
    filename: 'HashForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية لجدول الهاش (Windows Forms)، وتفعيل الرسم المزدوج، وأحداث الأزرار والمؤقت.',
    descriptionEn: 'Main Windows Forms GUI for Hash Table handling GDI+ rendering, button events, and animation timer.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace HashViewer
{
    public partial class HashForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer runTimer;

        public HashForm()
        {
            InitializeComponent();
            SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);

            thePersonGroup = new PersonGroup();

            runTimer = new System.Windows.Forms.Timer
            {
                Interval = 350
            };
            runTimer.Tick += RunTimer_Tick;

            UpdateUI();
        }

        private void RunTimer_Tick(object? sender, EventArgs e)
        {
            if (thePersonGroup.OpMode == 0)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
                return;
            }

            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void ExecuteCurrentStep()
        {
            bool isNum = int.TryParse(txtNumber.Text.Trim(), out int num);
            thePersonGroup.Step(isNum, num);
        }

        private void UpdateUI()
        {
            double loadFactor = thePersonGroup.TotalCells > 0 
                ? (double)thePersonGroup.NPersons / thePersonGroup.TotalCells * 100.0 
                : 0.0;
            lblStatus.Text = string.Format("Cells: {0}/{1} (Load: {2:F1}%) | Mode: {3} | Step: {4} | {5}",
                thePersonGroup.NPersons,
                thePersonGroup.TotalCells,
                loadFactor,
                thePersonGroup.OpMode,
                thePersonGroup.CodePart,
                thePersonGroup.Note);
        }

        private void PnlCanvas_Paint(object sender, PaintEventArgs e)
        {
            thePersonGroup.Draw(e.Graphics);
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartNew();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnFill_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartFill();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnIns_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartInsert();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnFind_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartFind();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnDel_Click(object sender, EventArgs e)
        {
            thePersonGroup.StartDelete();
            UpdateUI();
            pnlCanvas.Invalidate();
        }

        private void BtnStep_Click(object sender, EventArgs e)
        {
            if (thePersonGroup.OpMode == 0) return;
            ExecuteCurrentStep();
            pnlCanvas.Invalidate();
            UpdateUI();
        }

        private void BtnRun_Click(object sender, EventArgs e)
        {
            if (runTimer.Enabled)
            {
                runTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                if (thePersonGroup.OpMode != 0)
                {
                    runTimer.Start();
                    btnRun.Text = "Pause";
                }
            }
        }
    }
}`
  },
  {
    name: 'HashForm.Designer.cs',
    filename: 'HashForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر التحكم الرسومية: لوحة العرض بمقاس 440×300، وحقل الإدخال، والأزرار الكلاسيكية.',
    descriptionEn: 'Designer generated code for HashForm controls and 440x300 canvas layout.',
    content: `namespace HashViewer
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
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'محرك جدول الهاش مع المسح الخطي وحساب التجزئة ومعالجة التصادم واستبدال الحذف بالقيمة المحجوزة (*Del*).',
    descriptionEn: 'Core Linear-Probe Hash Table engine matching Robert Lafore personGroup_f2c7777b.class.',
    content: `using System;
using System.Drawing;

namespace HashViewer
{
    public class PersonGroup
    {
        public const int ASIZE = 60;
        public const int MAX_KEY = 999;
        public const int AppletWidth = 440;
        public const int AppletHeight = 300;
        public const int TopMargin = 80;
        public const int LeftMargin = 10;
        public const int NCellsPerCol = 12;
        public const int ColumnWidth = 85;
        public const int CellWidth = 35;
        public const int CellHeight = 17;
        public const int NoteBoxTop = 55;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 300;

        private readonly Person[] personArray;
        private readonly Person delNode;
        private readonly Random rand = new Random();

        public int TotalCells { get; private set; } = 60;
        public int NPersons { get; private set; } = 0;
        public string Note { get; private set; } = "Press any button";
        public int OpMode { get; set; } = 0;
        public int CodePart { get; set; } = 1;
        public int CodePart2 { get; set; } = 1;
        public int CurIn { get; private set; } = -1;
        public int OldCurIn { get; private set; } = -1;

        private int insKey = 0;
        private int findKey = 0;
        private int delKey = 0;
        private int fillValue = 0;
        private int hashVal = 0;
        private int probeCount = 0;

        public PersonGroup()
        {
            personArray = new Person[ASIZE];
            delNode = new Person(-1, Color.FromArgb(212, 208, 200));
            InitDefaultTable();
        }

        private void InitDefaultTable()
        {
            TotalCells = 60;
            for (int i = 0; i < ASIZE; i++) personArray[i] = null!;
            NPersons = 0;
            FillInternal(15);
            Note = "Press any button";
        }

        public Person MakePerson(int height)
        {
            if (height == -1) return delNode;
            int r = rand.Next(100, 255);
            int g = rand.Next(100, 255);
            int b = rand.Next(100, 255);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public int HashFunc(int key)
        {
            if (TotalCells <= 0) return 0;
            return ((key % TotalCells) + TotalCells) % TotalCells;
        }

        private void FillInternal(int count)
        {
            int filled = 0;
            for (int attempt = 0; attempt < 500 && filled < count; attempt++)
            {
                int k = rand.Next(0, 1000);
                int cur = HashFunc(k);
                int p = 0;
                while (p < TotalCells)
                {
                    if (personArray[cur] == null)
                    {
                        personArray[cur] = MakePerson(k);
                        filled++;
                        break;
                    }
                    cur = (cur + 1) % TotalCells;
                    p++;
                }
            }
            NPersons = filled;
        }

        public void StartNew()
        {
            OpMode = 1;
            CodePart = 1;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Enter size of array to create";
        }

        public void StartFill()
        {
            OpMode = 2;
            CodePart = 1;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Enter number of items to fill in";
        }

        public void StartInsert()
        {
            OpMode = 3;
            CodePart = 1;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Enter key of item to insert";
        }

        public void StartFind()
        {
            OpMode = 4;
            CodePart = 1;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Enter key of item to find";
        }

        public void StartDelete()
        {
            OpMode = 5;
            CodePart = 1;
            CurIn = -1;
            OldCurIn = -1;
            Note = "Enter key of item to delete";
        }

        public void Step(bool hasInput, int inputNum)
        {
            switch (OpMode)
            {
                case 1: StepNew(hasInput, inputNum); break;
                case 2: StepFill(hasInput, inputNum); break;
                case 3: StepInsert(hasInput, inputNum); break;
                case 4: StepFind(hasInput, inputNum); break;
                case 5: StepDelete(hasInput, inputNum); break;
            }
        }

        private void StepNew(bool hasInput, int inputNum)
        {
            if (CodePart == 1)
            {
                if (!hasInput || inputNum < 0 || inputNum > ASIZE)
                {
                    Note = "ERROR: use size between 0 and " + ASIZE;
                    return;
                }
                fillValue = inputNum;
                Note = "Will create empty array with " + fillValue + " cells";
                CodePart = 2;
                return;
            }
            if (CodePart == 2)
            {
                TotalCells = fillValue;
                for (int i = 0; i < ASIZE; i++) personArray[i] = null!;
                NPersons = 0;
                CurIn = -1;
                OldCurIn = -1;
                Note = "New array created; total items = 0";
                CodePart = 3;
                return;
            }
            if (CodePart == 3)
            {
                Note = "Press any button";
                OpMode = 0;
            }
        }

        private void StepFill(bool hasInput, int inputNum)
        {
            if (CodePart == 1)
            {
                if (!hasInput || inputNum < 0 || inputNum > TotalCells)
                {
                    Note = "ERROR: can't fill more than " + TotalCells + " items";
                    return;
                }
                fillValue = inputNum;
                Note = "Will fill in " + fillValue + " items";
                CodePart = 2;
                return;
            }
            if (CodePart == 2)
            {
                for (int i = 0; i < TotalCells; i++) personArray[i] = null!;
                NPersons = 0;
                FillInternal(fillValue);
                CurIn = -1;
                Note = "Fill completed; total items = " + NPersons;
                CodePart = 3;
                return;
            }
            if (CodePart == 3)
            {
                Note = "Press any button";
                OpMode = 0;
            }
        }

        private void StepInsert(bool hasInput, int inputNum)
        {
            if (CodePart == 1)
            {
                if (!hasInput || inputNum < 0 || inputNum > MAX_KEY)
                {
                    Note = "CAN'T INSERT: need key between 0 and " + MAX_KEY;
                    return;
                }
                if (NPersons >= TotalCells)
                {
                    Note = "CAN'T INSERT: array is full";
                    return;
                }
                insKey = inputNum;
                hashVal = HashFunc(insKey);
                CurIn = hashVal;
                OldCurIn = -1;
                probeCount = 0;
                Note = "Will insert item with key " + insKey;
                CodePart = 2;
                return;
            }
            if (CodePart == 2)
            {
                if (personArray[CurIn] == null || personArray[CurIn] == delNode)
                {
                    personArray[CurIn] = MakePerson(insKey);
                    NPersons++;
                    Note = "Inserted item with key " + insKey + " at index " + CurIn;
                    CodePart = 3;
                }
                else
                {
                    Note = "Cell " + CurIn + " occupied; going to next cell";
                    OldCurIn = CurIn;
                    CurIn = (CurIn + 1) % TotalCells;
                    probeCount++;
                    if (probeCount >= TotalCells)
                    {
                        Note = "CAN'T INSERT: table is full";
                        CodePart = 3;
                    }
                }
                return;
            }
            if (CodePart == 3)
            {
                Note = "Insertion completed; total items = " + NPersons;
                CodePart = 4;
                return;
            }
            if (CodePart == 4)
            {
                Note = "Press any button";
                CurIn = -1;
                OldCurIn = -1;
                OpMode = 0;
            }
        }

        private void StepFind(bool hasInput, int inputNum)
        {
            if (CodePart == 1)
            {
                if (!hasInput || inputNum < 0 || inputNum > MAX_KEY)
                {
                    Note = "ERROR: need key between 0 and " + MAX_KEY;
                    return;
                }
                findKey = inputNum;
                hashVal = HashFunc(findKey);
                CurIn = hashVal;
                probeCount = 0;
                Note = "Looking for item with key " + findKey + " at index " + CurIn;
                CodePart = 2;
                return;
            }
            if (CodePart == 2)
            {
                if (personArray[CurIn] == null)
                {
                    Note = "Can't locate item with key " + findKey;
                    CodePart = 4;
                    return;
                }
                if (personArray[CurIn] != delNode && personArray[CurIn].Height == findKey)
                {
                    Note = "Have found item with key " + findKey;
                    CodePart = 4;
                    return;
                }
                if (probeCount == 0)
                {
                    Note = "No match; will start probe";
                }
                else
                {
                    Note = "Checking next cell; step was 1";
                }
                CodePart = 3;
                return;
            }
            if (CodePart == 3)
            {
                OldCurIn = CurIn;
                CurIn = (CurIn + 1) % TotalCells;
                probeCount++;
                if (probeCount >= TotalCells)
                {
                    Note = "Can't locate item with key " + findKey;
                    CodePart = 4;
                }
                else
                {
                    CodePart = 2;
                }
                return;
            }
            if (CodePart == 4)
            {
                Note = "Press any button";
                CurIn = -1;
                OpMode = 0;
            }
        }

        private void StepDelete(bool hasInput, int inputNum)
        {
            if (CodePart == 1)
            {
                if (!hasInput || inputNum < 0 || inputNum > MAX_KEY)
                {
                    Note = "ERROR: need key between 0 and " + MAX_KEY;
                    return;
                }
                delKey = inputNum;
                hashVal = HashFunc(delKey);
                CurIn = hashVal;
                probeCount = 0;
                Note = "Looking for item with key " + delKey + " at index " + CurIn;
                CodePart = 2;
                return;
            }
            if (CodePart == 2)
            {
                if (personArray[CurIn] == null)
                {
                    Note = "Can't locate item with key " + delKey;
                    CodePart = 4;
                    return;
                }
                if (personArray[CurIn] != delNode && personArray[CurIn].Height == delKey)
                {
                    personArray[CurIn] = delNode;
                    NPersons--;
                    Note = "Deleted item with key " + delKey + "; total persons = " + NPersons;
                    CodePart = 4;
                    return;
                }
                Note = "Checking next cell; step was 1";
                CodePart = 3;
                return;
            }
            if (CodePart == 3)
            {
                OldCurIn = CurIn;
                CurIn = (CurIn + 1) % TotalCells;
                probeCount++;
                if (probeCount >= TotalCells)
                {
                    Note = "Can't locate item with key " + delKey;
                    CodePart = 4;
                }
                else
                {
                    CodePart = 2;
                }
                return;
            }
            if (CodePart == 4)
            {
                Note = "Press any button";
                CurIn = -1;
                OpMode = 0;
            }
        }

        public void Draw(Graphics g)
        {
            g.Clear(Color.FromArgb(240, 240, 240));

            using (var noteBrush = new SolidBrush(Color.White))
            using (var borderPen = new Pen(Color.FromArgb(128, 128, 128)))
            using (var font = new Font("Courier New", 9f, FontStyle.Bold))
            using (var textBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(noteBrush, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawString(Note, font, textBrush, LeftMargin + 5, NoteBoxTop + 5);
            }

            using (var font = new Font("Arial", 8f, FontStyle.Bold))
            using (var indexFont = new Font("Arial", 7f, FontStyle.Regular))
            using (var indexBrush = new SolidBrush(Color.FromArgb(70, 70, 70)))
            using (var blackPen = new Pen(Color.Black))
            using (var redBrush = new SolidBrush(Color.Red))
            using (var grayBrush = new SolidBrush(Color.FromArgb(212, 208, 200)))
            {
                for (int i = 0; i < TotalCells; i++)
                {
                    int col = i / NCellsPerCol;
                    int row = i % NCellsPerCol;
                    int baseX = LeftMargin + ColumnWidth * col;
                    int baseY = 89 + CellHeight * row;
                    int cellX = baseX + 26;
                    int cellY = baseY - 8;

                    string indexStr = i.ToString().PadLeft(2, ' ');
                    g.DrawString(indexStr, indexFont, indexBrush, baseX, cellY + 2);

                    var p = personArray[i];
                    if (p == null)
                    {
                        g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                    }
                    else if (p == delNode || p.Height == -1)
                    {
                        g.FillRectangle(grayBrush, cellX, cellY, CellWidth, CellHeight);
                        g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                        using (var delBrush = new SolidBrush(Color.FromArgb(160, 40, 40)))
                        {
                            g.DrawString("*Del*", font, delBrush, cellX + 3, cellY + 2);
                        }
                    }
                    else
                    {
                        using (var cellBrush = new SolidBrush(p.Color))
                        using (var textBrush = new SolidBrush(Color.Black))
                        {
                            g.FillRectangle(cellBrush, cellX, cellY, CellWidth, CellHeight);
                            g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                            string keyStr = p.Height.ToString();
                            g.DrawString(keyStr, font, textBrush, cellX + 4, cellY + 2);
                        }
                    }

                    if (CurIn == i)
                    {
                        int arrowStartX = cellX + CellWidth + 20;
                        int arrowTipX = cellX + CellWidth;
                        int arrowY = cellY + CellHeight / 2;

                        using (var redPen = new Pen(Color.Red, 2f))
                        {
                            g.DrawLine(redPen, arrowStartX, arrowY, arrowTipX, arrowY);
                            Point[] arrowHead = new Point[]
                            {
                                new Point(arrowTipX, arrowY),
                                new Point(arrowTipX + 6, arrowY - 4),
                                new Point(arrowTipX + 6, arrowY + 4)
                            };
                            g.FillPolygon(redBrush, arrowHead);
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'يمثل عنصر في جدول الهاش (المفتاح واللون، مع اعتبار -1 كقيمة محذوفة).',
    descriptionEn: 'Person item storing key height and display color, matching person_563b6826.class.',
    content: `using System.Drawing;

namespace HashViewer
{
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة انطلاق تطبيق جدول الهاش بتقنية Windows Forms.',
    descriptionEn: 'Windows Forms entry point for HashViewer.',
    content: `using System;
using System.Windows.Forms;

namespace HashViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new HashForm());
        }
    }
}`
  },
  {
    name: 'HashViewer.csproj',
    filename: 'HashViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 SDK.',
    descriptionEn: 'Project file for .NET 8.0 Windows Forms.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>HashViewer</RootNamespace>
    <AssemblyName>HashViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Linear-Probe Hash Table Workshop - Chapter 11</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_HASH_CHAIN: CSharpSourceFile[] = [
  {
    name: 'HashChainForm.cs',
    filename: 'HashChainForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرئيسية لجدول الهاش بالسلاسل المنفصلة ورسم القوائم المترابطة وشريط التمرير الرأسي.',
    descriptionEn: 'Main Windows Forms GUI for Separate-Chaining Hash Table with GDI+ rendering and VScrollBar.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace HashChainViewer
{
    public partial class HashChainForm : Form
    {
        private readonly PersonGroup thePersonGroup;
        private readonly System.Windows.Forms.Timer animTimer;

        public HashChainForm()
        {
            InitializeComponent();
            this.SetStyle(ControlStyles.AllPaintingInWmPaint | ControlStyles.UserPaint | ControlStyles.OptimizedDoubleBuffer, true);
            thePersonGroup = new PersonGroup(25);
            animTimer = new System.Windows.Forms.Timer { Interval = 350 };
            animTimer.Tick += AnimTimer_Tick;
            UpdateScrollbar();
            UpdateStatus();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            bool hasMore = thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
            if (!hasMore)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
        }

        private (bool isNum, int val) ParseInput()
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int v)) return (true, v);
            return (false, 0);
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartNew(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnFill_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFill(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnIns_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartInsert(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnFind_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartFind(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnDel_Click(object? sender, EventArgs e)
        {
            var (isNum, val) = ParseInput();
            thePersonGroup.StartDelete(isNum, val);
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            thePersonGroup.Step();
            pnlCanvas.Invalidate();
            UpdateScrollbar();
            UpdateStatus();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (animTimer.Enabled)
            {
                animTimer.Stop();
                btnRun.Text = "Run";
            }
            else
            {
                animTimer.Start();
                btnRun.Text = "Pause";
            }
        }

        private void VScrollBar_Scroll(object? sender, ScrollEventArgs e)
        {
            thePersonGroup.TopDisplayLine = vScrollBar.Value;
            pnlCanvas.Invalidate();
        }

        private void UpdateScrollbar()
        {
            int maxScroll = Math.Max(0, thePersonGroup.TotalBuckets - PersonGroup.LINES_IN_VIEW);
            vScrollBar.Maximum = maxScroll + vScrollBar.LargeChange - 1;
            vScrollBar.Value = Math.Max(0, Math.Min(maxScroll, thePersonGroup.TopDisplayLine));
        }

        private void UpdateStatus()
        {
            double load = thePersonGroup.TotalBuckets > 0 ? (double)thePersonGroup.NPersons / thePersonGroup.TotalBuckets : 0;
            lblStatus.Text = $"Buckets: {thePersonGroup.TotalBuckets} | Items: {thePersonGroup.NPersons} | Load: {load:0.00}";
        }

        private void PnlCanvas_Paint(object? sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.Clear(Color.LightGray);

            using (var brush = new SolidBrush(Color.FromArgb(212, 208, 200)))
            {
                g.FillRectangle(brush, 10, 45, 320, 25);
            }
            g.DrawRectangle(Pens.Gray, 10, 45, 320, 25);
            using (var font = new Font("Courier New", 9f, FontStyle.Bold))
            {
                g.DrawString(thePersonGroup.Note, font, Brushes.Black, 16, 51);
            }

            int startList = thePersonGroup.TopDisplayLine;
            int endList = Math.Min(thePersonGroup.TotalBuckets, startList + PersonGroup.LINES_IN_VIEW);

            for (int list = startList; list < endList; list++)
            {
                int row = list - startList;
                int baseY = 79 + 24 * row;
                var bucket = thePersonGroup.BucketArray[list];
                bool isCurList = list == thePersonGroup.CurList && thePersonGroup.OpMode != PersonGroup.OperationMode.Idle;

                using (var numFont = new Font("SansSerif", 8f, FontStyle.Bold))
                {
                    Brush numBrush = isCurList ? Brushes.Red : Brushes.Black;
                    g.DrawString(list.ToString(), numFont, numBrush, 5, baseY - 3);
                }

                if (bucket.NLinks == 0)
                {
                    int cellX = 33;
                    int cellY = baseY - 5;
                    using (var br = new SolidBrush(Color.FromArgb(212, 208, 200)))
                    {
                        g.FillRectangle(br, cellX, cellY, 35, 17);
                    }
                    g.DrawRectangle(Pens.Gray, cellX, cellY, 35, 17);
                    using (var italicFont = new Font("SansSerif", 7f, FontStyle.Italic))
                    {
                        g.DrawString("null", italicFont, Brushes.DarkGray, cellX + 7, cellY + 3);
                    }
                    if (isCurList && thePersonGroup.CurLink == 0)
                    {
                        DrawArrow(g, cellX, cellY);
                    }
                }
                else
                {
                    for (int link = 0; link < bucket.NLinks; link++)
                    {
                        var item = bucket.LinkArray[link];
                        if (item == null) continue;

                        int cellX = 33 + link * 60;
                        int cellY = baseY - 5;

                        if (link > 0)
                        {
                            int prevRight = 33 + (link - 1) * 60 + 35;
                            int arrY = baseY + 3;
                            g.DrawLine(Pens.Black, prevRight, arrY, cellX, arrY);
                            g.FillPolygon(Brushes.Black, new Point[]
                            {
                                new Point(cellX, arrY),
                                new Point(cellX - 5, arrY - 3),
                                new Point(cellX - 5, arrY + 3)
                            });
                        }

                        using (var b = new SolidBrush(item.PersData.Color))
                        {
                            g.FillRectangle(b, cellX, cellY, 35, 17);
                        }
                        ControlPaint.DrawBorder3D(g, cellX, cellY, 35, 17, Border3DStyle.Raised);

                        using (var keyFont = new Font("Courier New", 8f, FontStyle.Bold))
                        {
                            g.DrawString(item.PersData.Height.ToString(), keyFont, Brushes.Black, cellX + 6, cellY + 3);
                        }

                        if (isCurList && thePersonGroup.CurLink == link)
                        {
                            DrawArrow(g, cellX, cellY);
                        }
                    }
                }
            }
        }

        private void DrawArrow(Graphics g, int cellX, int cellY)
        {
            int tipX = cellX + 17;
            int tipY = cellY - 2;
            using (var pen = new Pen(Color.Red, 2))
            {
                g.DrawLine(pen, tipX, tipY - 12, tipX, tipY);
            }
            g.FillPolygon(Brushes.Red, new Point[]
            {
                new Point(tipX, tipY),
                new Point(tipX - 4, tipY - 5),
                new Point(tipX + 4, tipY - 5)
            });
        }
    }
}`
  },
  {
    name: 'PersonGroup.cs',
    filename: 'PersonGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق جدول الهاش بالسلاسل المنفصلة وتوزيع الدلاء والعمليات الخوارزمية خطوة بخطوة.',
    descriptionEn: 'Separate-Chaining hash table logic, bucket management, and step-by-step algorithms.',
    content: `using System;
using System.Drawing;

namespace HashChainViewer
{
    public class PersonGroup
    {
        public enum OperationMode { Idle = 0, New = 1, Fill = 2, Ins = 3, Find = 4, Del = 5 }
        public const int MAX_BUCKETS = 100;
        public const int MAX_KEY = 999;
        public const int LINES_IN_VIEW = 10;

        public Bucket[] BucketArray { get; private set; }
        public int TotalBuckets { get; private set; }
        public int NPersons { get; private set; }
        public Person? TempPers { get; private set; }
        public string Note { get; private set; }
        public int FillValue { get; private set; }
        public int InsKey { get; private set; }
        public int FindKey { get; private set; }
        public int DelKey { get; private set; }
        public int CodePart { get; private set; }
        public OperationMode OpMode { get; private set; }
        public int CurList { get; private set; }
        public int CurLink { get; private set; }
        public int TopDisplayLine { get; set; }

        private readonly Random random = new Random();

        public PersonGroup(int initialBuckets = 25)
        {
            TotalBuckets = initialBuckets;
            BucketArray = new Bucket[TotalBuckets];
            for (int i = 0; i < TotalBuckets; i++) BucketArray[i] = new Bucket();
            NPersons = 0;
            Note = "Press any button";
            CodePart = 1;
            OpMode = OperationMode.Idle;
            CurList = 0;
            CurLink = 0;
            TopDisplayLine = 0;
            DoFill(25);
        }

        public int HashFunction(int key) => TotalBuckets <= 0 ? 0 : ((key % TotalBuckets) + TotalBuckets) % TotalBuckets;

        public Person MakePerson(int height)
        {
            int r = random.Next(100, 256);
            int g = random.Next(100, 256);
            int b = random.Next(100, 256);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill(int count)
        {
            int filled = 0;
            for (int attempt = 0; attempt < 500 && filled < count; attempt++)
            {
                int key = random.Next(0, 1000);
                int list = HashFunction(key);
                var bucket = BucketArray[list];
                if (bucket.NLinks < Bucket.MAX_LINKS)
                {
                    for (int k = bucket.NLinks; k > 0; k--) bucket.LinkArray[k] = bucket.LinkArray[k - 1];
                    bucket.LinkArray[0] = new Link(MakePerson(key));
                    bucket.NLinks++;
                    filled++;
                }
            }
            NPersons = filled;
        }

        public void StartNew(bool isNum, int val) { OpMode = OperationMode.New; CodePart = 1; Note = "Enter number of linked lists in array: "; FillValue = isNum ? val : 25; }
        public void StartFill(bool isNum, int val) { OpMode = OperationMode.Fill; CodePart = 1; Note = "Enter number of items to fill in"; FillValue = isNum ? val : 25; }
        public void StartInsert(bool isNum, int val) { OpMode = OperationMode.Ins; CodePart = 1; Note = "Enter key of item to insert"; InsKey = isNum ? val : 42; }
        public void StartFind(bool isNum, int val) { OpMode = OperationMode.Find; CodePart = 1; Note = "Enter key of item to find"; FindKey = isNum ? val : 42; }
        public void StartDelete(bool isNum, int val) { OpMode = OperationMode.Del; CodePart = 1; Note = "Enter key of item to delete"; DelKey = isNum ? val : 42; }

        public bool Step()
        {
            if (OpMode == OperationMode.Idle) return false;
            if (OpMode == OperationMode.New)
            {
                if (CodePart == 1)
                {
                    if (FillValue <= 0 || FillValue > MAX_BUCKETS) { Note = $"ERROR: use size between 0 and {MAX_BUCKETS}"; OpMode = OperationMode.Idle; return false; }
                    Note = $"Will create empty table with {FillValue} lists"; CodePart = 2; return true;
                }
                else if (CodePart == 2)
                {
                    TotalBuckets = FillValue;
                    BucketArray = new Bucket[TotalBuckets];
                    for (int i = 0; i < TotalBuckets; i++) BucketArray[i] = new Bucket();
                    NPersons = 0; CurList = 0; CurLink = 0; TopDisplayLine = 0;
                    Note = "New table created; total items = 0"; CodePart = 3; return true;
                }
                else { Note = "Press any button"; CodePart = 1; OpMode = OperationMode.Idle; return false; }
            }
            if (OpMode == OperationMode.Fill)
            {
                if (CodePart == 1)
                {
                    int maxFill = TotalBuckets * Bucket.MAX_LINKS;
                    if (FillValue < 0 || FillValue > maxFill) { Note = $"ERROR: can't fill more than {maxFill} items"; OpMode = OperationMode.Idle; return false; }
                    Note = $"Will fill in {FillValue} items"; CodePart = 2; return true;
                }
                else if (CodePart == 2)
                {
                    for (int i = 0; i < TotalBuckets; i++) BucketArray[i] = new Bucket();
                    DoFill(FillValue); CurList = 0; CurLink = 0; TopDisplayLine = 0;
                    Note = $"Fill completed; total items = {NPersons}"; CodePart = 3; return true;
                }
                else { Note = "Press any button"; CodePart = 1; OpMode = OperationMode.Idle; return false; }
            }
            if (OpMode == OperationMode.Ins)
            {
                if (CodePart == 1)
                {
                    if (InsKey < 0 || InsKey > MAX_KEY) { Note = $"CAN'T INSERT: need key between 0 and {MAX_KEY}"; OpMode = OperationMode.Idle; return false; }
                    TempPers = MakePerson(InsKey); Note = $"Will insert item with key {InsKey}"; CodePart = 2; return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(InsKey); ScrollIntoView(CurList); CurLink = 0;
                    Note = $"Will insert in list {CurList}"; CodePart = 3; return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks >= Bucket.MAX_LINKS) { Note = $"CAN'T INSERT: list {CurList} is full"; CodePart = 5; return true; }
                    for (int k = bucket.NLinks; k > 0; k--) bucket.LinkArray[k] = bucket.LinkArray[k - 1];
                    bucket.LinkArray[0] = new Link(TempPers!);
                    bucket.NLinks++; NPersons++; CurLink = 0;
                    Note = $"Inserted item with key {InsKey} in list {CurList}"; CodePart = 4; return true;
                }
                else if (CodePart == 4) { Note = $"Insertion completed; total items = {NPersons}"; CodePart = 5; return true; }
                else { CurList = 0; CurLink = 0; Note = "Press any button"; CodePart = 1; OpMode = OperationMode.Idle; return false; }
            }
            if (OpMode == OperationMode.Find)
            {
                if (CodePart == 1)
                {
                    if (FindKey < 0 || FindKey > MAX_KEY) { Note = $"CAN'T FIND: use key between 0 and {MAX_KEY}"; OpMode = OperationMode.Idle; return false; }
                    Note = $"Will try to find item with key {FindKey}"; CodePart = 2; return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(FindKey); ScrollIntoView(CurList); CurLink = 0;
                    Note = $"Item with key {FindKey} should be in list {CurList}"; CodePart = 3; return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks == 0) { Note = $"Can't find item with key {FindKey}"; CodePart = 5; return true; }
                    var link = bucket.LinkArray[CurLink];
                    if (link != null && link.PersData.Height == FindKey) { Note = $"Have found item with key {FindKey}"; CodePart = 5; return true; }
                    if (CurLink >= bucket.NLinks - 1) { Note = $"Can't find item with key {FindKey}"; CodePart = 5; return true; }
                    CurLink++; Note = $"Looking for item with key {FindKey} at link {CurLink}"; return true;
                }
                else { CurList = 0; CurLink = 0; Note = "Press any button"; CodePart = 1; OpMode = OperationMode.Idle; return false; }
            }
            if (OpMode == OperationMode.Del)
            {
                if (CodePart == 1)
                {
                    if (DelKey < 0 || DelKey > MAX_KEY) { Note = $"CAN'T FIND: use key between 0 and {MAX_KEY}"; OpMode = OperationMode.Idle; return false; }
                    Note = $"Will try to delete item with key {DelKey}"; CodePart = 2; return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(DelKey); ScrollIntoView(CurList); CurLink = 0;
                    Note = $"Item with key {DelKey} should be in list {CurList}"; CodePart = 3; return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks == 0) { Note = $"Can't find item with key {DelKey}"; CodePart = 5; return true; }
                    var link = bucket.LinkArray[CurLink];
                    if (link != null && link.PersData.Height == DelKey) { Note = $"Have found item with key {DelKey}"; CodePart = 4; return true; }
                    if (CurLink >= bucket.NLinks - 1) { Note = $"Can't find item with key {DelKey}"; CodePart = 5; return true; }
                    CurLink++; Note = $"Looking for item with key {DelKey} at link {CurLink}"; return true;
                }
                else if (CodePart == 4)
                {
                    var bucket = BucketArray[CurList];
                    int linkIdx = CurLink;
                    for (int k = linkIdx; k < bucket.NLinks - 1; k++) bucket.LinkArray[k] = bucket.LinkArray[k + 1];
                    bucket.LinkArray[bucket.NLinks - 1] = null;
                    bucket.NLinks--; NPersons = Math.Max(0, NPersons - 1);
                    CurLink = linkIdx > 0 ? linkIdx - 1 : 0;
                    Note = $"Deleted item with key {DelKey}"; CodePart = 5; return true;
                }
                else { CurList = 0; CurLink = 0; Note = "Press any button"; CodePart = 1; OpMode = OperationMode.Idle; return false; }
            }
            return false;
        }

        private void ScrollIntoView(int targetList)
        {
            if (targetList < TopDisplayLine) TopDisplayLine = targetList;
            else if (targetList >= TopDisplayLine + LINES_IN_VIEW) TopDisplayLine = Math.Max(0, targetList - LINES_IN_VIEW + 1);
        }
    }
}`
  },
  {
    name: 'Bucket.cs',
    filename: 'Bucket.cs',
    language: 'csharp',
    descriptionAr: 'يمثل قائمة مترابطة داخل خلية في جدول الهاش بسعة حتى 6 عناصر.',
    descriptionEn: 'Bucket class holding up to 6 links for separate chaining.',
    content: `namespace HashChainViewer
{
    public class Bucket
    {
        public const int MAX_LINKS = 6;
        public Link?[] LinkArray { get; }
        public int NLinks { get; set; }

        public Bucket()
        {
            LinkArray = new Link?[MAX_LINKS];
            NLinks = 0;
        }
    }
}`
  },
  {
    name: 'Link.cs',
    filename: 'Link.cs',
    language: 'csharp',
    descriptionAr: 'عقدة القائمة المترابطة التي تحتوي على كائن البيانات Person.',
    descriptionEn: 'Link node in the bucket chain.',
    content: `namespace HashChainViewer
{
    public class Link
    {
        public Person PersData { get; set; }
        public Link(Person persData) { PersData = persData; }
    }
}`
  },
  {
    name: 'Person.cs',
    filename: 'Person.cs',
    language: 'csharp',
    descriptionAr: 'عنصر البيانات الذي يحمل المفتاح ولون الرسم.',
    descriptionEn: 'Data item with key height and color.',
    content: `using System.Drawing;

namespace HashChainViewer
{
    public class Person
    {
        public int Height { get; }
        public Color Color { get; }
        public Person(int height, Color color) { Height = height; Color = color; }
        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة الانطلاق لتطبيق HashChainViewer.',
    descriptionEn: 'Entry point for HashChainViewer Windows Forms application.',
    content: `using System;
using System.Windows.Forms;

namespace HashChainViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new HashChainForm());
        }
    }
}`
  },
  {
    name: 'HashChainViewer.csproj',
    filename: 'HashChainViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio و .NET 8.0 SDK.',
    descriptionEn: 'Project file for .NET 8.0 Windows Forms.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>HashChainViewer</RootNamespace>
    <AssemblyName>HashChainViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Separate-Chaining Hash Table Workshop - Chapter 11</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_GRAPH_DW: CSharpSourceFile[] = [
  {
    name: 'GraphDWForm.cs',
    filename: 'GraphDWForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية ومعالجة أحداث الفأرة والأزرار (New, Path, View, Sample) وإدخال الأوزان والرسم بـ GDI+.',
    descriptionEn: 'Main Windows Forms GUI handling mouse events, double-click vertex creation, edge dragging, and button events.',
    content: `using System;
using System.Drawing;
using System.Windows.Forms;

namespace GraphDWViewer
{
    public partial class GraphDWForm : Form
    {
        private VertexGroup theVertexGroup;
        private bool wasClearPressed;
        private int gpNumber;
        private bool isNumber;

        public GraphDWForm()
        {
            InitializeComponent();
            DoubleBuffered = true;
            theVertexGroup = new VertexGroup();
            wasClearPressed = false;
            gpNumber = -1;
            isNumber = false;
        }

        private void BtnNew_Click(object sender, EventArgs e)
        {
            if (wasClearPressed)
            {
                wasClearPressed = false;
                theVertexGroup = new VertexGroup();
            }
            else
            {
                wasClearPressed = true;
                theVertexGroup.WarningNew();
            }
            canvasPanel.Invalidate();
        }

        private void BtnPath_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.Path();
            canvasPanel.Invalidate();
        }

        private void BtnView_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.ChangeView();
            canvasPanel.Invalidate();
        }

        private void BtnSample_Click(object sender, EventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup = new VertexGroup();

            theVertexGroup.MakeVertex(60, 150);  // A
            theVertexGroup.MakeVertex(160, 100); // B
            theVertexGroup.MakeVertex(280, 100); // C
            theVertexGroup.MakeVertex(370, 160); // D
            theVertexGroup.MakeVertex(210, 220); // E

            theVertexGroup.AdjMat[0, 1].Distance = 50; // A -> B
            theVertexGroup.AdjMat[0, 3].Distance = 80; // A -> D
            theVertexGroup.AdjMat[1, 2].Distance = 60; // B -> C
            theVertexGroup.AdjMat[1, 3].Distance = 90; // B -> D
            theVertexGroup.AdjMat[2, 3].Distance = 40; // C -> D
            theVertexGroup.AdjMat[3, 4].Distance = 20; // D -> E
            theVertexGroup.AdjMat[4, 1].Distance = 50; // E -> B
            theVertexGroup.AdjMat[4, 2].Distance = 30; // E -> C

            theVertexGroup.Note = "Sample graph loaded. Click Path then click vertex A to start!";
            theVertexGroup.MadeVertex = false;
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            theVertexGroup.Draw(e.Graphics);
        }

        private void CanvasPanel_MouseDown(object sender, MouseEventArgs e)
        {
            wasClearPressed = false;
            theVertexGroup.StartDrag(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            theVertexGroup.MakeVertex(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseUp(object sender, MouseEventArgs e)
        {
            string txt = txtNumber.Text.Trim();
            if (int.TryParse(txt, out int val))
            {
                isNumber = true;
                gpNumber = val;
            }
            else
            {
                isNumber = false;
            }

            theVertexGroup.EndDrag(isNumber, gpNumber, e.X, e.Y);
            isNumber = false;
            txtNumber.Text = "";
            canvasPanel.Invalidate();
        }
    }
}`
  },
  {
    name: 'GraphDWForm.Designer.cs',
    filename: 'GraphDWForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'تصميم عناصر واجهة المستخدم: شريط الأزرار وحقل الأوزان ولوحة الرسم.',
    descriptionEn: 'Form designer initializing buttons, textboxes, and canvas panel.',
    content: `namespace GraphDWViewer
{
    partial class GraphDWForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnPath;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.Button btnSample;
        private System.Windows.Forms.Label lblEnterNumber;
        private System.Windows.Forms.TextBox txtNumber;
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
            this.btnPath = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.btnSample = new System.Windows.Forms.Button();
            this.lblEnterNumber = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.topPanel.SuspendLayout();
            this.SuspendLayout();

            // topPanel
            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Height = 40;
            this.topPanel.BackColor = System.Drawing.Color.LightGray;
            this.topPanel.Controls.Add(this.btnNew);
            this.topPanel.Controls.Add(this.btnPath);
            this.topPanel.Controls.Add(this.btnView);
            this.topPanel.Controls.Add(this.btnSample);
            this.topPanel.Controls.Add(this.lblEnterNumber);
            this.topPanel.Controls.Add(this.txtNumber);

            // btnNew
            this.btnNew.Location = new System.Drawing.Point(8, 7);
            this.btnNew.Size = new System.Drawing.Size(55, 26);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            // btnPath
            this.btnPath.Location = new System.Drawing.Point(68, 7);
            this.btnPath.Size = new System.Drawing.Size(55, 26);
            this.btnPath.Text = "Path";
            this.btnPath.Click += new System.EventHandler(this.BtnPath_Click);

            // btnView
            this.btnView.Location = new System.Drawing.Point(128, 7);
            this.btnView.Size = new System.Drawing.Size(55, 26);
            this.btnView.Text = "View";
            this.btnView.Click += new System.EventHandler(this.BtnView_Click);

            // btnSample
            this.btnSample.Location = new System.Drawing.Point(188, 7);
            this.btnSample.Size = new System.Drawing.Size(65, 26);
            this.btnSample.Text = "Sample";
            this.btnSample.Click += new System.EventHandler(this.BtnSample_Click);

            // lblEnterNumber
            this.lblEnterNumber.Location = new System.Drawing.Point(260, 11);
            this.lblEnterNumber.AutoSize = true;
            this.lblEnterNumber.Text = "Enter number:";

            // txtNumber
            this.txtNumber.Location = new System.Drawing.Point(345, 8);
            this.txtNumber.Size = new System.Drawing.Size(45, 23);

            // canvasPanel
            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);
            this.canvasPanel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDown);
            this.canvasPanel.MouseUp += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseUp);
            this.canvasPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDoubleClick);

            // GraphDWForm
            this.ClientSize = new System.Drawing.Size(440, 365);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topPanel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "GraphDWForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Lafore's Directed, Weighted Graph (GraphDW)";
            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'VertexGroup.cs',
    filename: 'VertexGroup.cs',
    language: 'csharp',
    descriptionAr: 'الفئة الجوهرية المسؤولة عن خوارزمية ديكسترا ومصفوفة المجاورة ومصفوفة sPath والرسم بـ GDI+.',
    descriptionEn: 'Core engine handling Dijkstra shortest-path algorithm, adjacency matrix, and GDI+ rendering.',
    content: `using System;
using System.Drawing;

namespace GraphDWViewer
{
    public class VertexGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 325;
        public const int TopMargin = 70;
        public const int LeftMargin = 10;
        public const int TextHeight = 13;
        public const int VertexDiameter = 22;
        public const int DirDistance = 18;
        public const int DirSize = 7;
        public const int WeightBoxWidth = 17;
        public const int WeightBoxHeight = 15;
        public const int NoteBoxTop = 45;
        public const int NoteBoxHeight = 25;
        public const int NoteBoxWidth = 430;
        public const int VisitBoxTop = 305;
        public const int VisitBoxHeight = 25;
        public const int VisitBoxWidth = 430;
        public const int CharSpace = 40;
        public const int HeaderBoxTop = 280;
        public const int DrawingBoxHeight = 207;

        public const int MaxVerts = 13;
        public const int MaxWeight = 99;
        public const int Infinity = 1000000;

        public Vertex[] VertexList { get; private set; }
        public DisIs[,] AdjMat { get; private set; }
        public int NVerts { get; set; }
        public int[] Tree { get; private set; }
        public int NTree { get; set; }

        public DisP[] SPath { get; private set; }
        public int StartingVertex { get; set; }
        public int StartTree { get; set; }
        public int CurrentSrc { get; set; }
        public int CurrentDest { get; set; }
        public int StartToCurrent { get; set; }
        public int CurrentToFringe { get; set; }
        public int StartToFringe { get; set; }
        public int LoopCounter { get; set; }
        public bool WillUpdate { get; set; }

        public int DisplayVertex { get; set; }
        public int DisplayEdge1 { get; set; }
        public int DisplayEdge2 { get; set; }

        public string Note { get; set; }
        public string OldNote { get; set; }
        public bool ShowAdjm { get; set; }
        public int OpMode { get; set; }
        public int CodePart { get; set; }
        public int DrawMode { get; set; }

        public int XStartDrag { get; set; }
        public int YStartDrag { get; set; }
        public bool MadeVertex { get; set; }

        public VertexGroup()
        {
            Vertex.ClassChar = 'A';
            VertexList = new Vertex[MaxVerts];
            SPath = new DisP[MaxVerts];
            AdjMat = new DisIs[MaxVerts, MaxVerts];
            NVerts = 0;
            Tree = new int[MaxVerts];
            NTree = 0;

            for (int i = 0; i < MaxVerts; i++)
            {
                for (int j = 0; j < MaxVerts; j++)
                {
                    AdjMat[i, j] = new DisIs(Infinity, false);
                }
            }

            ShowAdjm = false;
            StartingVertex = -1;
            Note = "Double-click mouse to make vertex";
            OldNote = "";
            DrawMode = 4;
            OpMode = 0;
            CodePart = 1;
        }

        public string DtoS(int dist)
        {
            if (dist >= Infinity) return "inf";
            return dist.ToString();
        }

        public void WarningNew()
        {
            Note = "ARE YOU SURE? Press again to clear old graph";
        }

        public int CloseTo(int x, int y)
        {
            const int threshold = 11;
            for (int i = 0; i < NVerts; i++)
            {
                if (Math.Abs(VertexList[i].X - x) < threshold && Math.Abs(VertexList[i].Y - y) < threshold)
                    return i;
            }
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            MadeVertex = true;
            if (NVerts >= MaxVerts)
            {
                Note = "CAN'T INSERT more vertices";
                return;
            }

            VertexList[NVerts] = new Vertex(x, y);
            Note = "Made vertex " + VertexList[NVerts].Label;
            DisplayVertex = NVerts;
            NVerts++;
            OpMode = 0;
            DrawMode = 2;
        }

        public void StartDrag(int x, int y)
        {
            XStartDrag = x;
            YStartDrag = y;
            int vert = CloseTo(x, y);
            StartingVertex = vert;
            if (vert < 0)
                Note = "To make edge, drag from vertex to vertex";
            else
                Note = "Starting edge at vertex " + VertexList[vert].Label;
            DrawMode = 1;
        }

        public void EndDrag(bool isNumber, int weight, int x, int y)
        {
            if (MadeVertex)
            {
                MadeVertex = false;
                DrawMode = 2;
                return;
            }

            int src = CloseTo(XStartDrag, YStartDrag);
            int dest = CloseTo(x, y);

            if (OpMode > 0)
            {
                if (StartingVertex == -1)
                    Note = "Click on a VERTEX";
                else
                    Note = "You clicked on " + VertexList[StartingVertex].Label;
                DrawMode = 1;
                return;
            }

            if (src < 0 || dest < 0 || src == dest)
            {
                Note = "CAN'T MAKE EDGE: Drag from vertex to vertex";
                DrawMode = 1;
                return;
            }

            if (!isNumber || weight < 0 || weight > MaxWeight)
            {
                Note = "CAN'T MAKE EDGE: Enter a weight (0 to " + MaxWeight + ")";
                DrawMode = 1;
                return;
            }

            AdjMat[src, dest].Distance = weight;
            MadeVertex = false;
            DisplayEdge1 = src;
            DisplayEdge2 = dest;
            Note = "Made edge from " + VertexList[src].Label + " to " + VertexList[dest].Label + " with weight " + weight;
            DrawMode = 3;
        }

        public void ChangeView()
        {
            if (ShowAdjm)
            {
                Note = OldNote;
                ShowAdjm = false;
            }
            else
            {
                OldNote = Note;
                if (NVerts == 0)
                    Note = "No vertices; adjacency matrix is empty";
                else
                    Note = "Press View button again to show graph";
                ShowAdjm = true;
                DrawMode = 4;
            }
        }

        public void Path()
        {
            if (NVerts == 0) return;

            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    Note = "Single-click on starting vertex";
                    StartingVertex = -1;
                    DrawMode = 1;
                    CodePart = 2;
                    break;

                case 2:
                    if (StartingVertex == -1)
                    {
                        Note = "INVALID VERTEX";
                        CodePart = 1;
                    }
                    else
                    {
                        StartTree = StartingVertex;
                        Note = "Starting from vertex " + VertexList[StartTree].Label;
                        CodePart = 3;
                    }
                    DrawMode = 1;
                    break;

                case 3:
                    VertexList[StartTree].IsInTree = true;
                    Tree[0] = StartTree;
                    NTree = 1;
                    Note = "Added vertex " + VertexList[StartTree].Label + " to tree";
                    DisplayVertex = StartTree;
                    DrawMode = 2;
                    CodePart = 4;
                    break;

                case 4:
                    for (int i = 0; i < NVerts; i++)
                    {
                        int d = AdjMat[StartTree, i].Distance;
                        SPath[i] = new DisP(StartTree, d);
                    }
                    Note = "Copied row " + VertexList[StartTree].Label + " from adjacency matrix to shortest-path array";
                    DrawMode = 1;
                    CodePart = 5;
                    break;

                case 5:
                    int minDist = Infinity;
                    int minVert = 0;
                    for (int i = 0; i < NVerts; i++)
                    {
                        if (!VertexList[i].IsInTree)
                        {
                            if (SPath[i].Distance < minDist)
                            {
                                minDist = SPath[i].Distance;
                                minVert = i;
                            }
                        }
                    }

                    if (minDist == Infinity)
                    {
                        Note = "One or more vertices are UNREACHABLE";
                        CodePart = 12;
                    }
                    else
                    {
                        CurrentDest = minVert;
                        CurrentSrc = SPath[minVert].ParentVert;
                        StartToCurrent = SPath[minVert].Distance;
                        Note = "Minimum distance from " + VertexList[StartTree].Label + " is " + StartToCurrent + ", to vertex " + VertexList[CurrentDest].Label;
                        CodePart = 6;
                    }
                    DrawMode = 1;
                    break;

                case 6:
                    VertexList[CurrentDest].IsInTree = true;
                    Tree[NTree++] = CurrentDest;
                    Note = "Added vertex " + VertexList[CurrentDest].Label + " to tree";
                    AdjMat[CurrentSrc, CurrentDest].IsInTree = true;
                    DisplayEdge1 = CurrentSrc;
                    DisplayEdge2 = CurrentDest;

                    if (NTree == NVerts)
                        CodePart = 12;
                    else
                    {
                        LoopCounter = 0;
                        CodePart = 7;
                    }
                    DrawMode = 3;
                    break;

                case 7:
                    Note = "Will adjust values in shortest-path array";
                    DrawMode = 1;
                    CodePart = 8;
                    break;

                case 8:
                    while (LoopCounter < NVerts && VertexList[LoopCounter].IsInTree)
                    {
                        LoopCounter++;
                    }

                    if (LoopCounter == NVerts)
                    {
                        Note = "Finished all entries in shortest-path array";
                        CodePart = 5;
                    }
                    else
                    {
                        Note = "Will compare distances for column " + VertexList[LoopCounter].Label;
                        CodePart = 9;
                    }
                    DrawMode = 1;
                    break;

                case 9:
                    CurrentToFringe = AdjMat[CurrentDest, LoopCounter].Distance;
                    StartToFringe = StartToCurrent + CurrentToFringe;
                    int sPathDist = SPath[LoopCounter].Distance;

                    string str = "";
                    if (StartToFringe < sPathDist)
                    {
                        str = " less than ";
                        WillUpdate = true;
                    }
                    else
                    {
                        str = " greater than or equal to ";
                        WillUpdate = false;
                    }

                    char sLabel = VertexList[StartTree].Label;
                    char cLabel = VertexList[CurrentDest].Label;
                    char fLabel = VertexList[LoopCounter].Label;

                    Note = "To " + fLabel + ":  " + sLabel + " to " + cLabel + " (" + DtoS(StartToCurrent) + ") plus edge " + cLabel + fLabel + " (" + DtoS(CurrentToFringe) + ") " + str + sLabel + " to " + fLabel + " (" + DtoS(sPathDist) + ")";
                    CodePart = 10;
                    DrawMode = 1;
                    break;

                case 10:
                    if (WillUpdate)
                    {
                        SPath[LoopCounter].ParentVert = CurrentDest;
                        SPath[LoopCounter].Distance = StartToFringe;
                        Note = "Updated array column " + VertexList[LoopCounter].Label;
                    }
                    else
                    {
                        Note = "No need to update array column " + VertexList[LoopCounter].Label;
                    }
                    DrawMode = 1;
                    CodePart = 11;
                    break;

                case 11:
                    LoopCounter++;
                    if (LoopCounter < NVerts)
                    {
                        Note = "Will examine next non-tree column";
                        CodePart = 8;
                    }
                    else
                    {
                        Note = "Done all entries in shortest-path array";
                        CodePart = 5;
                    }
                    DrawMode = 1;
                    break;

                case 12:
                    Note = "All shortest paths from " + VertexList[StartTree].Label + " found; distances in array";
                    CodePart = 13;
                    DrawMode = 1;
                    break;

                case 13:
                    Note = "Press again to reset paths";
                    CodePart = 14;
                    DrawMode = 1;
                    break;

                case 14:
                    NTree = 0;
                    for (int i = 0; i < NVerts; i++)
                    {
                        VertexList[i].IsInTree = false;
                        for (int j = 0; j < NVerts; j++)
                            AdjMat[i, j].IsInTree = false;
                    }
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = 0;
                    DrawMode = 4;
                    break;
            }
        }

        public void Draw(Graphics g)
        {
            if (ShowAdjm)
            {
                g.FillRectangle(Brushes.Yellow, 0, 0, AppletWidth, AppletHeight);
                g.DrawString(Note, new Font("Arial", 9, FontStyle.Bold), Brushes.Black, 16, 64);
                DrawAdjm(g);
                return;
            }

            g.FillRectangle(SystemBrushes.Control, 0, 0, AppletWidth, AppletHeight);

            // Note Box
            g.FillRectangle(Brushes.White, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            g.DrawRectangle(Pens.Gray, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            g.DrawString(Note, new Font("Arial", 9, FontStyle.Bold), Brushes.Black, 16, 52);

            // Drawing Area border
            g.DrawRectangle(Pens.Black, 2, 71, 436, DrawingBoxHeight);

            // Edges
            for (int i = 0; i < NVerts; i++)
            {
                for (int j = 0; j < NVerts; j++)
                {
                    if (AdjMat[i, j].Distance < Infinity)
                    {
                        DrawEdge(g, i, j);
                    }
                }
            }

            // Vertices
            for (int i = 0; i < NVerts; i++)
            {
                DrawOneVertex(g, i);
            }

            // Bottom Shortest-Path array
            g.FillRectangle(Brushes.White, LeftMargin, VisitBoxTop, VisitBoxWidth, VisitBoxHeight);
            g.DrawRectangle(Pens.Gray, LeftMargin, VisitBoxTop, VisitBoxWidth, VisitBoxHeight);

            if (OpMode == 1 && CodePart > 4)
            {
                for (int i = 0; i < NVerts; i++)
                {
                    if (SPath[i] != null)
                    {
                        int colX = 12 + CharSpace * i;
                        int dist = SPath[i].Distance;
                        int parent = SPath[i].ParentVert;
                        char pLabel = VertexList[parent] != null ? VertexList[parent].Label : '?';
                        string cellText = DtoS(dist) + "(" + pLabel + ")";

                        g.DrawLine(Pens.Black, colX, 303, colX + 35, 303);

                        Brush labelBrush = VertexList[i].IsInTree ? Brushes.Red : Brushes.Black;
                        g.DrawString(VertexList[i].Label.ToString(), new Font("Courier New", 9, FontStyle.Bold), labelBrush, colX + 4, 288);
                        g.DrawString(cellText, new Font("Courier New", 8, FontStyle.Regular), Brushes.Black, colX, 310);
                    }
                }
            }
        }

        private void DrawOneVertex(Graphics g, int vertIdx)
        {
            if (vertIdx < 0 || vertIdx >= NVerts) return;
            Vertex v = VertexList[vertIdx];
            int vx = v.X - 11;
            int vy = v.Y - 11;

            using (Brush brush = new SolidBrush(v.VertexColor))
            {
                g.FillEllipse(brush, vx, vy, VertexDiameter, VertexDiameter);
            }
            g.DrawEllipse(Pens.Black, vx, vy, VertexDiameter, VertexDiameter);

            if (v.IsInTree)
            {
                g.DrawEllipse(Pens.Red, vx - 3, vy - 3, 28, 28);
            }

            g.DrawString(v.Label.ToString(), new Font("Arial", 10, FontStyle.Bold), Brushes.Black, vx + 6, vy + 4);
        }

        private void DrawEdge(Graphics g, int src, int dest)
        {
            Vertex v1 = VertexList[src];
            Vertex v2 = VertexList[dest];

            Pen pen = AdjMat[src, dest].IsInTree ? new Pen(Color.Red, 3) : Pens.Black;
            g.DrawLine(pen, v1.X, v1.Y, v2.X, v2.Y);

            DrawDirection(g, v1.X, v1.Y, v2.X, v2.Y, AdjMat[src, dest].IsInTree);

            int midX = (v1.X + v2.X) / 2 - 8;
            int midY = (v1.Y + v2.Y) / 2 - 7;
            g.FillRectangle(Brushes.White, midX, midY, WeightBoxWidth, WeightBoxHeight);
            g.DrawRectangle(pen, midX, midY, WeightBoxWidth, WeightBoxHeight);

            string wStr = AdjMat[src, dest].Distance.ToString();
            int offX = wStr.Length > 1 ? 2 : 5;
            g.DrawString(wStr, new Font("Courier New", 8, FontStyle.Bold), Brushes.Black, midX + offX, midY + 1);
        }

        private void DrawDirection(Graphics g, int x1, int y1, int x2, int y2, bool inTree)
        {
            int dx = x1 - x2;
            int dy = y1 - y2;
            int len = (int)Math.Sqrt(dx * dx + dy * dy);
            if (len == 0) return;

            int ox = dx * DirDistance / len;
            int oy = dy * DirDistance / len;
            Brush brush = inTree ? Brushes.Red : Brushes.Black;
            g.FillEllipse(brush, x2 + ox - 3, y2 + oy - 3, DirSize, DirSize);
        }

        private void DrawAdjm(Graphics g)
        {
            if (NVerts == 0) return;

            int startX = 90;
            int startY = 106;
            int colW = 27;
            int rowH = 18;

            g.DrawLine(Pens.Black, startX - colW, startY - rowH + 4, startX + (NVerts - 1) * colW + 8, startY - rowH + 4);
            g.DrawLine(Pens.Black, startX - colW / 2 + 2, startY - 2 * rowH + 8, startX - colW / 2 + 2, startY + (NVerts - 1) * rowH);

            Font font = new Font("Courier New", 9, FontStyle.Bold);

            for (int c = 0; c < NVerts; c++)
            {
                g.DrawString(VertexList[c].Label.ToString(), font, Brushes.Black, startX + c * colW, startY - rowH - 4);
            }

            for (int r = 0; r < NVerts; r++)
            {
                g.DrawString(VertexList[r].Label.ToString(), font, Brushes.Black, startX - colW, startY + r * rowH - 4);

                for (int c = 0; c < NVerts; c++)
                {
                    string dStr = DtoS(AdjMat[r, c].Distance);
                    g.DrawString(dStr, font, Brushes.Black, startX + c * colW, startY + r * rowH - 4);
                }
            }
        }
    }
}`
  },
  {
    name: 'Vertex.cs',
    filename: 'Vertex.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل الرأس (Vertex) بإحداثيات X, Y والحرف واسم الرأس واللون وعلامة شجرة أقصر المسارات.',
    descriptionEn: 'Vertex class with coordinates, character label, color, and tree membership flag.',
    content: `using System;
using System.Drawing;

namespace GraphDWViewer
{
    public class Vertex
    {
        public static char ClassChar = 'A';

        public int X { get; set; }
        public int Y { get; set; }
        public char Label { get; set; }
        public Color VertexColor { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y)
        {
            X = x;
            Y = y;
            Label = ClassChar++;

            Random rnd = Random.Shared;
            int r = 100 + (int)(rnd.NextDouble() * 155);
            int g = 100 + (int)(rnd.NextDouble() * 155);
            int b = 100 + (int)(rnd.NextDouble() * 155);
            VertexColor = Color.FromArgb(r, g, b);
            IsInTree = false;
        }
    }
}`
  },
  {
    name: 'DisP.cs',
    filename: 'DisP.cs',
    language: 'csharp',
    descriptionAr: 'عنصر في مصفوفة المسافات sPath يخزن الرأس الأب وأقصر مسافة حالية.',
    descriptionEn: 'Shortest-path array element tracking parent vertex and distance.',
    content: `namespace GraphDWViewer
{
    public class DisP
    {
        public int ParentVert { get; set; }
        public int Distance { get; set; }

        public DisP(int parentVert, int distance)
        {
            ParentVert = parentVert;
            Distance = distance;
        }
    }
}`
  },
  {
    name: 'DisIs.cs',
    filename: 'DisIs.cs',
    language: 'csharp',
    descriptionAr: 'خلية في مصفوفة المجاورة تخزن وزن الحافة وهل الحافة جزء من شجرة ديكسترا.',
    descriptionEn: 'Adjacency matrix cell storing edge weight and tree status.',
    content: `namespace GraphDWViewer
{
    public class DisIs
    {
        public int Distance { get; set; }
        public bool IsInTree { get; set; }

        public DisIs(int distance, bool isInTree)
        {
            Distance = distance;
            IsInTree = isInTree;
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة دخول التطبيق الرئيسية وتشغيل النموذج الأساسي.',
    descriptionEn: 'Standard C# entry point initializing and running GraphDWForm.',
    content: `using System;
using System.Windows.Forms;

namespace GraphDWViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new GraphDWForm());
        }
    }
}`
  },
  {
    name: 'GraphDWViewer.csproj',
    filename: 'GraphDWViewer.csproj',
    language: 'csharp',
    descriptionAr: 'ملف مشروع Visual Studio بصيغة SDK-style لـ .NET 8.0 Windows Forms.',
    descriptionEn: '.NET 8.0 Windows Forms project file.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>GraphDWViewer</RootNamespace>
    <AssemblyName>GraphDWViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Directed, Weighted Graph Workshop - Chapter 14</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_GRAPH_W: CSharpSourceFile[] = [
  {
    name: 'Vertex.cs',
    filename: 'Vertex.cs',
    language: 'csharp',
    descriptionAr: 'فئة تمثيل الرأس (Vertex) مع الإحداثيات والحرف اللوني وحالة الانضمام للشجرة.',
    descriptionEn: 'Vertex entity representation with label, coordinates, color, and tree flag.',
    content: `using System.Drawing;

namespace GraphWViewer
{
    public class Vertex
    {
        public char Label { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public Color Color { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y, char label, Color color)
        {
            X = x;
            Y = y;
            Label = label;
            Color = color;
            IsInTree = false;
        }
    }
}`
  },
  {
    name: 'DisIs.cs',
    filename: 'DisIs.cs',
    language: 'csharp',
    descriptionAr: 'فئة تمثيل مسافة الحافة وعلم الشجرة في مصفوفة المجاورة (disIs.class).',
    descriptionEn: 'DisIs representation for distance and tree edge status in adjacency matrix.',
    content: `namespace GraphWViewer
{
    public class DisIs
    {
        public int Distance { get; set; }
        public bool IsInTree { get; set; }

        public DisIs(int distance, bool isInTree)
        {
            Distance = distance;
            IsInTree = isInTree;
        }
    }
}`
  },
  {
    name: 'Edge.cs',
    filename: 'Edge.cs',
    language: 'csharp',
    descriptionAr: 'فئة تمثيل الحافة في طابور الأولوية مع الرأسين والوزن (edge.class).',
    descriptionEn: 'Edge entity stored in the priority queue with source, destination, and distance.',
    content: `namespace GraphWViewer
{
    public class Edge
    {
        public int SrcVert { get; set; }
        public int DestVert { get; set; }
        public int Distance { get; set; }

        public Edge(int srcVert, int destVert, int distance)
        {
            SrcVert = srcVert;
            DestVert = destVert;
            Distance = distance;
        }
    }
}`
  },
  {
    name: 'PriorityQ.cs',
    filename: 'PriorityQ.cs',
    language: 'csharp',
    descriptionAr: 'طابور الأولوية للحواف مرتب تنازلياً لسحب الحافة الصغرى بزمن O(1) (priorityQ.class).',
    descriptionEn: 'Priority queue for edges ordered by weight descending for O(1) minimum removal.',
    content: `using System.Collections.Generic;

namespace GraphWViewer
{
    public class PriorityQ
    {
        public const int SIZE = 20;
        private readonly List<Edge> _queArray = new List<Edge>();

        public void Insert(Edge item)
        {
            int j;
            for (j = 0; j < _queArray.Count; j++)
            {
                if (item.Distance >= _queArray[j].Distance)
                {
                    break;
                }
            }
            _queArray.Insert(j, item);
        }

        public Edge RemoveMin()
        {
            if (_queArray.Count == 0) return null!;
            var min = _queArray[_queArray.Count - 1];
            _queArray.RemoveAt(_queArray.Count - 1);
            return min;
        }

        public void RemoveN(int n)
        {
            if (n >= 0 && n < _queArray.Count)
            {
                _queArray.RemoveAt(n);
            }
        }

        public Edge PeekMin() => _queArray.Count > 0 ? _queArray[_queArray.Count - 1] : null!;
        public Edge PeekN(int n) => (n >= 0 && n < _queArray.Count) ? _queArray[n] : null!;
        public int Size() => _queArray.Count;
        public bool IsEmpty() => _queArray.Count == 0;

        public int Find(int findDex)
        {
            for (int j = 0; j < _queArray.Count; j++)
            {
                if (_queArray[j].DestVert == findDex)
                    return j;
            }
            return -1;
        }

        public IReadOnlyList<Edge> ToList() => _queArray.AsReadOnly();
    }
}`
  },
  {
    name: 'VertexGroup.cs',
    filename: 'VertexGroup.cs',
    language: 'csharp',
    descriptionAr: 'منطق المخطط الموزون غير الموجه وشجرة الامتداد الأصغري MSTW (خوارزمية بريم).',
    descriptionEn: 'Core graph logic with Prim algorithm state machine, priority queue, and matrix view.',
    content: `using System;
using System.Drawing;

namespace GraphWViewer
{
    public class VertexGroup
    {
        public const int AppletWidth = 440;
        public const int AppletHeight = 320;
        public const int VertexDiameter = 22;
        public const int WeightBoxWidth = 17;
        public const int WeightBoxHeight = 15;
        public const int MAX_VERTS = 13;
        public const int MAX_WEIGHT = 99;
        public const int INFINITY = 1000000;

        public Vertex[] VertexList { get; private set; }
        public DisIs[,] AdjMat { get; private set; }
        public DisIs[,] AdjMat2 { get; private set; }
        public int NVerts { get; set; }
        public PriorityQ ThePQ { get; private set; }
        public int[] Tree { get; private set; }
        public int NTree { get; set; }

        public string Note { get; set; }
        public string OldNote { get; set; }
        public int OpMode { get; set; }
        public int CodePart { get; set; }
        public int DrawMode { get; set; }
        public bool ShowAdjm { get; set; }

        public int XStartDrag { get; set; }
        public int YStartDrag { get; set; }
        public int CurrentDragX { get; set; }
        public int CurrentDragY { get; set; }
        public bool IsDragging { get; set; }
        public bool MadeVertex { get; set; }
        public bool WasClearPressed { get; set; }
        public int StartingVertex { get; set; }
        public int CurrentVert { get; set; }

        private readonly Random _rand = new Random();

        public VertexGroup()
        {
            VertexList = new Vertex[MAX_VERTS];
            AdjMat = new DisIs[MAX_VERTS, MAX_VERTS];
            AdjMat2 = new DisIs[MAX_VERTS, MAX_VERTS];
            Tree = new int[MAX_VERTS];
            ThePQ = new PriorityQ();

            for (int i = 0; i < MAX_VERTS; i++)
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat[i, j] = new DisIs(INFINITY, false);
                    AdjMat2[i, j] = new DisIs(INFINITY, false);
                }

            Note = "Double-click mouse to make vertex";
            CodePart = 1;
            DrawMode = 4;
        }

        public int CloseTo(int x, int y)
        {
            for (int i = 0; i < NVerts; i++)
                if (Math.Abs(VertexList[i].X - x) < 11 && Math.Abs(VertexList[i].Y - y) < 11)
                    return i;
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            MadeVertex = true;
            if (NVerts >= MAX_VERTS) { Note = "CAN'T INSERT more vertices"; return; }
            int cx = Math.Max(20, Math.Min(x, 420));
            int cy = Math.Max(75, Math.Min(y, 265));
            char lbl = (char)('A' + NVerts);
            VertexList[NVerts] = new Vertex(cx, cy, lbl, Color.FromArgb(100 + _rand.Next(155), 100 + _rand.Next(155), 100 + _rand.Next(155)));
            Note = $"Made vertex {lbl}";
            NVerts++;
            DrawMode = 2;
        }

        public void StartDrag(int x, int y)
        {
            XStartDrag = x; YStartDrag = y; CurrentDragX = x; CurrentDragY = y; IsDragging = true;
            int idx = CloseTo(x, y);
            Note = idx < 0 ? "To make edge, drag from vertex to vertex" : $"Starting edge at vertex {VertexList[idx].Label}";
            DrawMode = 1;
        }

        public void EndDrag(bool isNumber, int weight, int x, int y)
        {
            IsDragging = false;
            if (MadeVertex) { MadeVertex = false; DrawMode = 2; return; }
            int src = CloseTo(XStartDrag, YStartDrag);
            int dest = CloseTo(x, y);

            if (OpMode > 0)
            {
                Note = StartingVertex == -1 ? "Click on a VERTEX" : $"You clicked on {VertexList[StartingVertex].Label}";
                DrawMode = 1; return;
            }
            if (src < 0 || dest < 0 || src == dest)
            {
                Note = "CAN'T MAKE EDGE: Drag from vertex to vertex"; DrawMode = 1; return;
            }
            if (!isNumber || weight < 0 || weight > MAX_WEIGHT)
            {
                Note = $"CAN'T MAKE EDGE: Enter a weight (0 to {MAX_WEIGHT})"; DrawMode = 1; return;
            }

            AdjMat[src, dest].Distance = weight;
            AdjMat[dest, src].Distance = weight;
            Note = $"Made edge from {VertexList[src].Label} to {VertexList[dest].Label} with weight {weight}";
            DrawMode = 3;
        }

        public void ChangeView()
        {
            if (ShowAdjm) { Note = OldNote; ShowAdjm = false; }
            else { OldNote = Note; Note = NVerts == 0 ? "No vertices; adjacency matrix is empty" : "Press View button again to show graph"; ShowAdjm = true; }
            DrawMode = 4;
        }

        public void WarningNew()
        {
            if (WasClearPressed) ClearGraph();
            else { WasClearPressed = true; Note = "ARE YOU SURE? Press again to clear old graph"; }
        }

        public void ClearGraph()
        {
            NVerts = 0; NTree = 0; ThePQ = new PriorityQ();
            for (int i = 0; i < MAX_VERTS; i++)
                for (int j = 0; j < MAX_VERTS; j++)
                {
                    AdjMat[i, j] = new DisIs(INFINITY, false);
                    AdjMat2[i, j] = new DisIs(INFINITY, false);
                }
            Note = "Double-click mouse to make vertex";
            OpMode = 0; CodePart = 1; ShowAdjm = false; WasClearPressed = false; DrawMode = 4;
        }

        public void SaveState()
        {
            for (int i = 0; i < MAX_VERTS; i++)
                for (int j = 0; j < MAX_VERTS; j++)
                    AdjMat2[i, j] = new DisIs(AdjMat[i, j].Distance, AdjMat[i, j].IsInTree);
        }

        public void RestoreState()
        {
            for (int i = 0; i < MAX_VERTS; i++)
                for (int j = 0; j < MAX_VERTS; j++)
                    AdjMat[i, j] = new DisIs(AdjMat2[i, j].Distance, AdjMat2[i, j].IsInTree);
        }

        public void PutInPQ(int dest, int dist)
        {
            int qIdx = ThePQ.Find(dest);
            if (qIdx != -1)
            {
                var edge = ThePQ.PeekN(qIdx);
                if (edge.Distance > dist)
                {
                    ThePQ.RemoveN(qIdx);
                    ThePQ.Insert(new Edge(CurrentVert, dest, dist));
                }
            }
            else ThePQ.Insert(new Edge(CurrentVert, dest, dist));
        }

        public void Mst()
        {
            if (NVerts == 0) { Note = "Double-click mouse to make vertex"; return; }
            if (OpMode != 1) { OpMode = 1; CodePart = 1; }

            switch (CodePart)
            {
                case 1:
                    SaveState(); Note = "Single-click on vertex from which to start tree";
                    StartingVertex = -1; DrawMode = 1; CodePart = 2; break;
                case 2:
                    if (StartingVertex == -1) { Note = "INVALID VERTEX"; CodePart = 1; }
                    else { Note = $"Starting tree from vertex {VertexList[StartingVertex].Label}"; CurrentVert = StartingVertex; CodePart = 3; }
                    DrawMode = 1; break;
                case 3:
                    Tree[NTree] = CurrentVert; NTree++; VertexList[CurrentVert].IsInTree = true;
                    Note = $"Placed vertex {VertexList[CurrentVert].Label} in tree";
                    CodePart = (NTree == NVerts) ? 6 : 4; DrawMode = 1; break;
                case 4:
                    for (int j = 0; j < NVerts; j++)
                    {
                        if (j == CurrentVert || VertexList[j].IsInTree) continue;
                        int d = AdjMat[CurrentVert, j].Distance;
                        if (d != INFINITY) PutInPQ(j, d);
                    }
                    if (ThePQ.Size() == 0) { Note = "Graph not connected"; CodePart = 8; }
                    else { Note = $"Placed vertices adj to {VertexList[CurrentVert].Label} in priority queue"; CodePart = 5; }
                    DrawMode = 1; break;
                case 5:
                    var eMin = ThePQ.RemoveMin();
                    if (eMin != null)
                    {
                        CurrentVert = eMin.DestVert;
                        AdjMat[eMin.SrcVert, eMin.DestVert].IsInTree = true;
                        AdjMat[eMin.DestVert, eMin.SrcVert].IsInTree = true;
                        Note = $"Removed minimum-distance edge {VertexList[eMin.SrcVert].Label}{VertexList[eMin.DestVert].Label}{eMin.Distance} from priority queue";
                    }
                    DrawMode = 1; CodePart = 3; break;
                case 6:
                    Note = "Press again to delete unmarked edges"; DrawMode = 1; CodePart = 7; break;
                case 7:
                    for (int i = 0; i < NVerts; i++)
                        for (int j = 0; j < NVerts; j++)
                            if (AdjMat[i, j].Distance != INFINITY)
                            {
                                if (!AdjMat[i, j].IsInTree) AdjMat[i, j].Distance = INFINITY;
                                else AdjMat[i, j].IsInTree = false;
                            }
                    Note = "Minimum spanning tree; press again to restore tree"; DrawMode = 1; CodePart = 8; break;
                case 8:
                    RestoreState(); Note = "Press any button"; NTree = 0;
                    for (int i = 0; i < NVerts; i++) VertexList[i].IsInTree = false;
                    while (!ThePQ.IsEmpty()) ThePQ.RemoveMin();
                    CodePart = 1; OpMode = 0; DrawMode = 4; break;
            }
        }

        public void LoadSampleGraph()
        {
            ClearGraph();
            var coords = new Point[] { new Point(60, 140), new Point(140, 70), new Point(140, 210), new Point(280, 70), new Point(280, 210), new Point(360, 140) };
            for (int i = 0; i < coords.Length; i++)
                VertexList[i] = new Vertex(coords[i].X, coords[i].Y, (char)('A' + i), Color.FromArgb(100 + _rand.Next(155), 100 + _rand.Next(155), 100 + _rand.Next(155)));
            NVerts = coords.Length;
            var ed = new (int u, int v, int w)[] { (0,1,6), (0,2,4), (1,2,10), (1,3,7), (1,4,7), (2,3,8), (2,4,5), (3,4,12), (3,5,7), (4,5,7) };
            foreach (var (u, v, w) in ed) { AdjMat[u, v].Distance = w; AdjMat[v, u].Distance = w; }
            Note = "Sample graph loaded. Click Tree then click vertex A to start!"; DrawMode = 4;
        }

        public static string DtoS(int d) => d >= INFINITY ? "inf" : d.ToString();
    }
}`
  },
  {
    name: 'GraphWForm.Designer.cs',
    filename: 'GraphWForm.Designer.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم Windows Forms مع الأزرار والكانفاس وحقل الإدخال.',
    descriptionEn: 'Form layout containing controls for New, Tree, View, Sample, and interactive canvas.',
    content: `namespace GraphWViewer
{
    partial class GraphWForm
    {
        private System.ComponentModel.IContainer components = null;
        private System.Windows.Forms.Panel topPanel;
        private System.Windows.Forms.Panel canvasPanel;
        private System.Windows.Forms.Button btnNew;
        private System.Windows.Forms.Button btnTree;
        private System.Windows.Forms.Button btnView;
        private System.Windows.Forms.Button btnSample;
        private System.Windows.Forms.Button btnStep;
        private System.Windows.Forms.Button btnRun;
        private System.Windows.Forms.Label lblPrompt;
        private System.Windows.Forms.TextBox txtNumber;
        private System.Windows.Forms.Timer animTimer;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null)) components.Dispose();
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.topPanel = new System.Windows.Forms.Panel();
            this.btnNew = new System.Windows.Forms.Button();
            this.btnTree = new System.Windows.Forms.Button();
            this.btnView = new System.Windows.Forms.Button();
            this.btnSample = new System.Windows.Forms.Button();
            this.btnStep = new System.Windows.Forms.Button();
            this.btnRun = new System.Windows.Forms.Button();
            this.lblPrompt = new System.Windows.Forms.Label();
            this.txtNumber = new System.Windows.Forms.TextBox();
            this.canvasPanel = new System.Windows.Forms.Panel();
            this.animTimer = new System.Windows.Forms.Timer(this.components);

            this.topPanel.SuspendLayout();
            this.SuspendLayout();

            this.topPanel.Dock = System.Windows.Forms.DockStyle.Top;
            this.topPanel.Height = 45;
            this.topPanel.BackColor = System.Drawing.Color.FromArgb(220, 224, 230);
            this.topPanel.Controls.Add(this.btnNew);
            this.topPanel.Controls.Add(this.btnTree);
            this.topPanel.Controls.Add(this.btnView);
            this.topPanel.Controls.Add(this.btnSample);
            this.topPanel.Controls.Add(this.lblPrompt);
            this.topPanel.Controls.Add(this.txtNumber);
            this.topPanel.Controls.Add(this.btnStep);
            this.topPanel.Controls.Add(this.btnRun);

            this.btnNew.Location = new System.Drawing.Point(8, 8);
            this.btnNew.Size = new System.Drawing.Size(55, 28);
            this.btnNew.Text = "New";
            this.btnNew.Click += new System.EventHandler(this.BtnNew_Click);

            this.btnTree.Location = new System.Drawing.Point(68, 8);
            this.btnTree.Size = new System.Drawing.Size(55, 28);
            this.btnTree.Text = "Tree";
            this.btnTree.Click += new System.EventHandler(this.BtnTree_Click);

            this.btnView.Location = new System.Drawing.Point(128, 8);
            this.btnView.Size = new System.Drawing.Size(55, 28);
            this.btnView.Text = "View";
            this.btnView.Click += new System.EventHandler(this.BtnView_Click);

            this.btnSample.Location = new System.Drawing.Point(188, 8);
            this.btnSample.Size = new System.Drawing.Size(65, 28);
            this.btnSample.Text = "Sample";
            this.btnSample.Click += new System.EventHandler(this.BtnSample_Click);

            this.lblPrompt.Location = new System.Drawing.Point(260, 14);
            this.lblPrompt.Size = new System.Drawing.Size(85, 18);
            this.lblPrompt.Text = "Enter number:";

            this.txtNumber.Location = new System.Drawing.Point(348, 11);
            this.txtNumber.Size = new System.Drawing.Size(40, 23);
            this.txtNumber.Text = "6";

            this.btnStep.Location = new System.Drawing.Point(395, 8);
            this.btnStep.Size = new System.Drawing.Size(50, 28);
            this.btnStep.Text = "Step";
            this.btnStep.Click += new System.EventHandler(this.BtnStep_Click);

            this.btnRun.Location = new System.Drawing.Point(450, 8);
            this.btnRun.Size = new System.Drawing.Size(50, 28);
            this.btnRun.Text = "Run";
            this.btnRun.Click += new System.EventHandler(this.BtnRun_Click);

            this.canvasPanel.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvasPanel.BackColor = System.Drawing.Color.LightGray;
            this.canvasPanel.Paint += new System.Windows.Forms.PaintEventHandler(this.CanvasPanel_Paint);
            this.canvasPanel.MouseDown += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDown);
            this.canvasPanel.MouseMove += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseMove);
            this.canvasPanel.MouseUp += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseUp);
            this.canvasPanel.MouseDoubleClick += new System.Windows.Forms.MouseEventHandler(this.CanvasPanel_MouseDoubleClick);

            this.animTimer.Interval = 500;
            this.animTimer.Tick += new System.EventHandler(this.AnimTimer_Tick);

            this.ClientSize = new System.Drawing.Size(515, 375);
            this.Controls.Add(this.canvasPanel);
            this.Controls.Add(this.topPanel);
            this.Text = "Weighted, Undirected Graph (MSTW - Minimum Spanning Tree)";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;

            this.topPanel.ResumeLayout(false);
            this.topPanel.PerformLayout();
            this.ResumeLayout(false);
        }
    }
}`
  },
  {
    name: 'GraphWForm.cs',
    filename: 'GraphWForm.cs',
    language: 'csharp',
    descriptionAr: 'معالجة أحداث الفأرة والرسم البياني على الكانفاس ومصفوفة المجاورة وشجرة MST.',
    descriptionEn: 'Form event handling, mouse drag/double-click, and custom GDI+ graphics rendering.',
    content: `using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace GraphWViewer
{
    public partial class GraphWForm : Form
    {
        private readonly VertexGroup _group;
        private bool _isRunning = false;

        public GraphWForm()
        {
            InitializeComponent();
            _group = new VertexGroup();
            _group.LoadSampleGraph();
        }

        private void BtnNew_Click(object? sender, EventArgs e) { _group.WarningNew(); canvasPanel.Invalidate(); }
        private void BtnTree_Click(object? sender, EventArgs e) { _group.Mst(); canvasPanel.Invalidate(); }
        private void BtnView_Click(object? sender, EventArgs e) { _group.ChangeView(); btnView.Text = _group.ShowAdjm ? "Matrix" : "Graph"; canvasPanel.Invalidate(); }
        private void BtnSample_Click(object? sender, EventArgs e) { _group.LoadSampleGraph(); canvasPanel.Invalidate(); }
        private void BtnStep_Click(object? sender, EventArgs e) { _group.Mst(); canvasPanel.Invalidate(); }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            _isRunning = !_isRunning;
            btnRun.Text = _isRunning ? "Pause" : "Run";
            if (_isRunning) { if (_group.OpMode == 0) _group.Mst(); animTimer.Start(); }
            else animTimer.Stop();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            if (_group.OpMode == 1)
            {
                _group.Mst(); canvasPanel.Invalidate();
                if (_group.OpMode == 0) { _isRunning = false; btnRun.Text = "Run"; animTimer.Stop(); }
            }
            else { _isRunning = false; btnRun.Text = "Run"; animTimer.Stop(); }
        }

        private void CanvasPanel_MouseDown(object sender, MouseEventArgs e)
        {
            if (_group.OpMode == 1 && _group.CodePart == 1)
            {
                int c = _group.CloseTo(e.X, e.Y);
                if (c >= 0) { _group.StartingVertex = c; _group.Note = $"You clicked on {_group.VertexList[c].Label}"; }
                else { _group.StartingVertex = -1; _group.Note = "Click on a VERTEX"; }
                _group.DrawMode = 1; canvasPanel.Invalidate(); return;
            }
            _group.StartDrag(e.X, e.Y); canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseMove(object sender, MouseEventArgs e)
        {
            if (_group.IsDragging) { _group.CurrentDragX = e.X; _group.CurrentDragY = e.Y; canvasPanel.Invalidate(); }
        }

        private void CanvasPanel_MouseUp(object sender, MouseEventArgs e)
        {
            if (_group.IsDragging)
            {
                bool isNum = int.TryParse(txtNumber.Text.Trim(), out int w);
                _group.EndDrag(isNum, isNum ? w : -1, e.X, e.Y); canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            _group.MakeVertex(e.X, e.Y); canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object sender, PaintEventArgs e)
        {
            var g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            if (_group.ShowAdjm)
            {
                using var yb = new SolidBrush(Color.FromArgb(255, 255, 153));
                g.FillRectangle(yb, 0, 0, canvasPanel.Width, canvasPanel.Height);
                using var f = new Font("Courier New", 9f, FontStyle.Bold);
                using var tb = new SolidBrush(Color.Black);
                g.DrawString(_group.Note, f, tb, 16, 64);
                if (_group.NVerts == 0) return;

                int sx = 40, sy = 85, cw = 28, ch = 17;
                using var hb = new SolidBrush(Color.Navy);
                for (int j = 0; j < _group.NVerts; j++) g.DrawString(_group.VertexList[j].Label.ToString(), f, hb, sx + (j + 1) * cw + 4, sy);
                for (int i = 0; i < _group.NVerts; i++)
                {
                    g.DrawString(_group.VertexList[i].Label.ToString(), f, hb, sx, sy + (i + 1) * ch);
                    for (int j = 0; j < _group.NVerts; j++)
                    {
                        string dStr = VertexGroup.DtoS(_group.AdjMat[i, j].Distance);
                        using var cb = new SolidBrush(dStr == "inf" ? Color.Gray : (_group.AdjMat[i, j].IsInTree ? Color.Red : Color.Black));
                        g.DrawString(dStr, f, cb, sx + (j + 1) * cw + 2, sy + (i + 1) * ch);
                    }
                }
                return;
            }

            using (var bg = new SolidBrush(Color.FromArgb(212, 212, 212))) g.FillRectangle(bg, 0, 0, canvasPanel.Width, canvasPanel.Height);
            using (var nbg = new SolidBrush(Color.White)) g.FillRectangle(nbg, 10, 42, 420, 24);
            using (var f = new Font("Courier New", 9f, FontStyle.Bold))
            using (var b = new SolidBrush(Color.Black)) g.DrawString(_group.Note, f, b, 16, 47);

            using (var dbg = new SolidBrush(Color.FromArgb(220, 220, 220))) g.FillRectangle(dbg, 11, 71, 418, 202);
            using (var dp = new Pen(Color.FromArgb(100, 116, 139))) g.DrawRectangle(dp, 10, 70, 420, 204);

            for (int i = 0; i < _group.NVerts; i++)
                for (int j = i + 1; j < _group.NVerts; j++)
                {
                    var cell = _group.AdjMat[i, j];
                    if (cell.Distance < VertexGroup.INFINITY)
                    {
                        var v1 = _group.VertexList[i]; var v2 = _group.VertexList[j];
                        using var p = new Pen(cell.IsInTree ? Color.Red : Color.Black, cell.IsInTree ? 3f : 1.5f);
                        g.DrawLine(p, v1.X, v1.Y, v2.X, v2.Y);

                        int mx = (v1.X + v2.X) / 2, my = (v1.Y + v2.Y) / 2;
                        using var bb = new SolidBrush(Color.White);
                        g.FillRectangle(bb, mx - 8, my - 7, 17, 15);
                        using var bp = new Pen(cell.IsInTree ? Color.Red : Color.Black);
                        g.DrawRectangle(bp, mx - 8, my - 7, 17, 15);
                        using var bbf = new Font("Courier New", 8f, FontStyle.Bold);
                        using var btb = new SolidBrush(cell.IsInTree ? Color.Red : Color.Black);
                        var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                        g.DrawString(cell.Distance.ToString(), bbf, btb, new RectangleF(mx - 8, my - 7, 17, 15), sf);
                    }
                }

            if (_group.IsDragging)
            {
                using var dp = new Pen(Color.Blue, 2f) { DashStyle = DashStyle.Dash };
                g.DrawLine(dp, _group.XStartDrag, _group.YStartDrag, _group.CurrentDragX, _group.CurrentDragY);
            }

            for (int i = 0; i < _group.NVerts; i++)
            {
                var v = _group.VertexList[i];
                if (v.IsInTree) { using var rp = new Pen(Color.Red, 2.5f); g.DrawEllipse(rp, v.X - 15, v.Y - 15, 30, 30); }
                using var vb = new SolidBrush(v.Color); g.FillEllipse(vb, v.X - 11, v.Y - 11, 22, 22);
                using var vp = new Pen(Color.Black, 1.5f); g.DrawEllipse(vp, v.X - 11, v.Y - 11, 22, 22);
                using var vf = new Font("Courier New", 10f, FontStyle.Bold);
                using var tb = new SolidBrush(Color.Black);
                var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
                g.DrawString(v.Label.ToString(), vf, tb, new RectangleF(v.X - 11, v.Y - 11, 22, 22), sf);
            }

            using (var botBg = new SolidBrush(Color.White)) g.FillRectangle(botBg, 10, 278, 420, 36);
            using var bf = new Font("Courier New", 9f, FontStyle.Bold);
            string treeStr = "Tree: ";
            for (int i = 0; i < _group.NTree; i++) treeStr += _group.VertexList[_group.Tree[i]].Label + " ";
            using (var trb = new SolidBrush(Color.Red)) g.DrawString(treeStr, bf, trb, 16, 288);

            string pqStr = "PQ: ";
            var pq = _group.ThePQ.ToList();
            for (int k = 0; k < pq.Count; k++) pqStr += $"{_group.VertexList[pq[k].SrcVert].Label}{_group.VertexList[pq[k].DestVert].Label}{pq[k].Distance} ";
            using (var pqb = new SolidBrush(Color.Navy)) g.DrawString(pqStr, bf, pqb, 200, 288);
        }
    }
}`
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة دخول التطبيق وتشغيل نموذج GraphWForm.',
    descriptionEn: 'Standard Program.cs initializing and launching GraphWForm.',
    content: `using System;
using System.Windows.Forms;

namespace GraphWViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new GraphWForm());
        }
    }
}`
  },
  {
    name: 'GraphWViewer.csproj',
    filename: 'GraphWViewer.csproj',
    language: 'csharp',
    descriptionAr: 'ملف مشروع Visual Studio بصيغة SDK-style لـ .NET 8.0 Windows Forms.',
    descriptionEn: '.NET 8.0 Windows Forms project file.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>GraphWViewer</RootNamespace>
    <AssemblyName>GraphWViewer</AssemblyName>
    <ApplicationTitle>Robert Lafore Weighted, Undirected Graph Workshop - Chapter 14</ApplicationTitle>
  </PropertyGroup>

</Project>`
  }
];

export const CSHARP_FILES_GRAPH: CSharpSourceFile[] = [
  {
    name: 'GraphForm.cs',
    filename: 'GraphForm.cs',
    language: 'csharp',
    descriptionAr: 'واجهة المستخدم الرسومية لمخطط الفصل 13 ومعالجة أحداث الرسم بالنقر والسحب والبحث في العمق والعرض وشجرة الامتداد.',
    descriptionEn: 'Main Windows Forms GUI for Chapter 13 Graph workshop handling DFS, BFS, and MST execution.',
    content: `using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace GraphViewer
{
    public partial class GraphForm : Form
    {
        private readonly VertexGroup _graph;
        private bool _isRunning;

        public GraphForm()
        {
            InitializeComponent();
            _graph = new VertexGroup();
            _graph.LoadSampleGraph();
            DoubleBuffered = true;
        }

        private void BtnNew_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.WarningNew();
            canvasPanel.Invalidate();
        }

        private void BtnDFS_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartDFS(0);
            canvasPanel.Invalidate();
        }

        private void BtnBFS_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartBFS(0);
            canvasPanel.Invalidate();
        }

        private void BtnTree_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.StartTree(0);
            canvasPanel.Invalidate();
        }

        private void BtnView_Click(object? sender, EventArgs e)
        {
            _graph.ChangeView();
            canvasPanel.Invalidate();
        }

        private void BtnSample_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            _graph.LoadSampleGraph();
            canvasPanel.Invalidate();
        }

        private void BtnStep_Click(object? sender, EventArgs e)
        {
            _isRunning = false;
            animTimer.Stop();
            StepCurrent();
        }

        private void BtnRun_Click(object? sender, EventArgs e)
        {
            if (_graph.OpMode == "idle")
            {
                _graph.StartDFS(0);
            }

            _isRunning = !_isRunning;
            if (_isRunning)
            {
                btnRun.Text = "Pause";
                animTimer.Start();
            }
            else
            {
                btnRun.Text = "Run";
                animTimer.Stop();
            }
        }

        private void StepCurrent()
        {
            bool done = false;
            if (_graph.OpMode == "dfs")
            {
                done = _graph.StepDFS();
            }
            else if (_graph.OpMode == "bfs")
            {
                done = _graph.StepBFS();
            }
            else if (_graph.OpMode == "tree")
            {
                done = _graph.StepTree();
            }

            if (done)
            {
                _isRunning = false;
                btnRun.Text = "Run";
                animTimer.Stop();
            }
            canvasPanel.Invalidate();
        }

        private void AnimTimer_Tick(object? sender, EventArgs e)
        {
            StepCurrent();
        }

        private void CanvasPanel_MouseDown(object? sender, MouseEventArgs e)
        {
            _graph.StartDrag(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_MouseMove(object? sender, MouseEventArgs e)
        {
            if (_graph.IsDragging)
            {
                _graph.UpdateDrag(e.X, e.Y);
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseUp(object? sender, MouseEventArgs e)
        {
            if (_graph.IsDragging)
            {
                _graph.EndDrag(e.X, e.Y);
                canvasPanel.Invalidate();
            }
        }

        private void CanvasPanel_MouseDoubleClick(object? sender, MouseEventArgs e)
        {
            _graph.MakeVertex(e.X, e.Y);
            canvasPanel.Invalidate();
        }

        private void CanvasPanel_Paint(object? sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            int width = canvasPanel.Width;
            int height = canvasPanel.Height;

            if (_graph.ShowAdjm)
            {
                g.Clear(Color.FromArgb(255, 255, 153));
                using var noteFont = new Font("SansSerif", 10, FontStyle.Bold);
                g.DrawString(_graph.Note, noteFont, Brushes.Black, 16, 15);

                if (_graph.NVerts > 0)
                {
                    int startX = 85;
                    int startY = 60;
                    int colWidth = 24;
                    int rowHeight = 20;

                    g.DrawLine(Pens.Black, startX - colWidth, startY - rowHeight + 4, startX + (_graph.NVerts - 1) * colWidth + 12, startY - rowHeight + 4);
                    g.DrawLine(Pens.Black, startX - colWidth / 2 + 2, startY - 2 * rowHeight + 8, startX - colWidth / 2 + 2, startY + (_graph.NVerts - 1) * rowHeight);

                    using var mFont = new Font("Courier New", 10, FontStyle.Bold);
                    var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

                    for (int c = 0; c < _graph.NVerts; c++)
                        g.DrawString(_graph.VertexList[c].Label.ToString(), mFont, Brushes.Black, startX + c * colWidth, startY - rowHeight, sf);

                    for (int r = 0; r < _graph.NVerts; r++)
                    {
                        g.DrawString(_graph.VertexList[r].Label.ToString(), mFont, Brushes.Black, startX - colWidth, startY + r * rowHeight, sf);
                        for (int c = 0; c < _graph.NVerts; c++)
                        {
                            bool hasEdge = _graph.AdjMat[r, c] == 1;
                            Brush b = hasEdge ? Brushes.Crimson : Brushes.SlateGray;
                            g.DrawString(hasEdge ? "1" : "0", mFont, b, startX + c * colWidth, startY + r * rowHeight, sf);
                        }
                    }
                }
                return;
            }

            g.Clear(Color.FromArgb(192, 192, 192));
            g.FillRectangle(Brushes.White, 5, 10, width - 10, 24);
            g.DrawRectangle(Pens.Gray, 5, 10, width - 10, 24);
            using (var font = new Font("SansSerif", 9, FontStyle.Bold))
                g.DrawString(_graph.Note, font, Brushes.Black, 10, 15);

            int boxTop = 40;
            int boxHeight = 220;
            g.FillRectangle(Brushes.WhiteSmoke, 5, boxTop, width - 10, boxHeight);
            g.DrawRectangle(Pens.Black, 5, boxTop, width - 10, boxHeight);

            for (int i = 0; i < _graph.NVerts; i++)
            {
                for (int j = i + 1; j < _graph.NVerts; j++)
                {
                    if (_graph.AdjMat[i, j] == 1)
                    {
                        var v1 = _graph.VertexList[i];
                        var v2 = _graph.VertexList[j];
                        bool inTree = _graph.TreeEdges.Exists(te => (te.V1 == i && te.V2 == j) || (te.V1 == j && te.V2 == i));
                        using var pen = new Pen(inTree ? Color.Red : Color.FromArgb(50, 60, 80), inTree ? 3 : 1.5f);
                        g.DrawLine(pen, v1.X, v1.Y, v2.X, v2.Y);
                    }
                }
            }

            if (_graph.IsDragging)
            {
                using var dashPen = new Pen(Color.DodgerBlue, 2f) { DashStyle = DashStyle.Dash };
                g.DrawLine(dashPen, _graph.DragStartPos, _graph.DragCurrentPos);
            }

            const int diameter = 22;
            const int radius = 11;
            using var vFont = new Font("Courier New", 10, FontStyle.Bold);
            var centerSf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };

            for (int i = 0; i < _graph.NVerts; i++)
            {
                var v = _graph.VertexList[i];
                if (v.WasVisited)
                {
                    using var ringPen = new Pen(v.IsInTree ? Color.Red : Color.ForestGreen, 2.5f);
                    g.DrawEllipse(ringPen, v.X - radius - 3, v.Y - radius - 3, diameter + 6, diameter + 6);
                }

                using var brush = new SolidBrush(v.Color);
                g.FillEllipse(brush, v.X - radius, v.Y - radius, diameter, diameter);
                g.DrawEllipse(Pens.Black, v.X - radius, v.Y - radius, diameter, diameter);
                g.DrawString(v.Label.ToString(), vFont, Brushes.Black, v.X + 1, v.Y, centerSf);
            }

            int barY = 270;
            int barHeight = 45;
            g.FillRectangle(Brushes.White, 5, barY, width - 10, barHeight);
            g.DrawRectangle(Pens.Gray, 5, barY, width - 10, barHeight);

            using var barFont = new Font("Courier New", 9, FontStyle.Regular);
            using var boldFont = new Font("Courier New", 9, FontStyle.Bold);

            if (_graph.OpMode == "dfs")
            {
                string visitStr = string.Join(" ", _graph.VisitList.ConvertAll(idx => _graph.VertexList[idx].Label));
                string stackStr = string.Join(" ", Array.ConvertAll(_graph.TheStack.ToArray(), idx => _graph.VertexList[idx].Label));
                g.DrawString($"DFS Visit: {visitStr}", boldFont, Brushes.Black, 10, barY + 5);
                g.DrawString($"Stack: [ {stackStr} ]", barFont, Brushes.Purple, 10, barY + 24);
            }
            else if (_graph.OpMode == "bfs")
            {
                string visitStr = string.Join(" ", _graph.VisitList.ConvertAll(idx => _graph.VertexList[idx].Label));
                string queueStr = string.Join(" ", Array.ConvertAll(_graph.TheQueue.ToArray(), idx => _graph.VertexList[idx].Label));
                g.DrawString($"BFS Visit: {visitStr}", boldFont, Brushes.Black, 10, barY + 5);
                g.DrawString($"Queue: [ {queueStr} ]", barFont, Brushes.Navy, 10, barY + 24);
            }
            else if (_graph.OpMode == "tree")
            {
                string edgesStr = string.Join(" ", _graph.TreeEdges.ConvertAll(e => $"{_graph.VertexList[e.V1].Label}{_graph.VertexList[e.V2].Label}"));
                g.DrawString($"Spanning Tree: {edgesStr}", boldFont, Brushes.Red, 10, barY + 5);
                g.DrawString($"Total Tree Edges = {_graph.TreeEdges.Count} (Vertices = {_graph.NVerts})", barFont, Brushes.Black, 10, barY + 24);
            }
            else
            {
                g.DrawString($"Vertices: {_graph.NVerts}/{VertexGroup.MAX_VERTS} | Press DFS, BFS, or Tree to explore", barFont, Brushes.DarkSlateGray, 10, barY + 14);
            }
        }
    }
}
`,
  },
  {
    name: 'VertexGroup.cs',
    filename: 'VertexGroup.cs',
    language: 'csharp',
    descriptionAr: 'هيكل بيانات المخطط البياني ومصفوفة المجاورة الثنائية وخوارزميات DFS و BFS و MST.',
    descriptionEn: 'Core Graph data structure, adjacency matrix, DFS, BFS, and unweighted Minimum Spanning Tree engine.',
    content: `using System;
using System.Collections.Generic;
using System.Drawing;

namespace GraphViewer
{
    public class TreeEdge
    {
        public int V1 { get; set; }
        public int V2 { get; set; }
        public TreeEdge(int v1, int v2) { V1 = v1; V2 = v2; }
    }

    public class VertexGroup
    {
        public const int MAX_VERTS = 13;
        public int NVerts { get; set; }
        public Vertex[] VertexList { get; private set; }
        public int[,] AdjMat { get; private set; }
        public StackX TheStack { get; private set; }
        public QueueX TheQueue { get; private set; }
        public List<int> VisitList { get; private set; }
        public List<TreeEdge> TreeEdges { get; private set; }

        public string Note { get; set; }
        public string OpMode { get; set; } = "idle";
        public bool ShowAdjm { get; set; }
        public bool WasClearPressed { get; set; }

        public bool IsDragging { get; set; }
        public int DragStartVertex { get; set; } = -1;
        public Point DragStartPos { get; set; }
        public Point DragCurrentPos { get; set; }

        public VertexGroup()
        {
            VertexList = new Vertex[MAX_VERTS];
            AdjMat = new int[MAX_VERTS, MAX_VERTS];
            TheStack = new StackX(MAX_VERTS);
            TheQueue = new QueueX(MAX_VERTS);
            VisitList = new List<int>();
            TreeEdges = new List<TreeEdge>();
            NVerts = 0;
            Note = "Double-click mouse to make vertex";
        }

        public void LoadSampleGraph()
        {
            Clear();
            AddVertex(70, 110, 'A', Color.LightPink);
            AddVertex(190, 100, 'B', Color.LightGreen);
            AddVertex(320, 120, 'C', Color.LightSkyBlue);
            AddVertex(130, 220, 'D', Color.Wheat);
            AddVertex(260, 230, 'E', Color.Thistle);

            AddEdge(0, 1);
            AddEdge(1, 2);
            AddEdge(0, 3);
            AddEdge(3, 4);
            AddEdge(1, 4);
            AddEdge(2, 4);

            Note = "Sample graph loaded (A-E); press DFS, BFS, or Tree";
        }

        public void AddVertex(int x, int y, char label, Color c)
        {
            if (NVerts < MAX_VERTS)
                VertexList[NVerts++] = new Vertex(x, y, label, c);
        }

        public void AddEdge(int start, int end)
        {
            AdjMat[start, end] = 1;
            AdjMat[end, start] = 1;
        }

        public int CloseTo(int x, int y)
        {
            const int radius = 15;
            for (int i = 0; i < NVerts; i++)
            {
                int dx = VertexList[i].X - x;
                int dy = VertexList[i].Y - y;
                if (Math.Sqrt(dx * dx + dy * dy) <= radius)
                    return i;
            }
            return -1;
        }

        public void MakeVertex(int x, int y)
        {
            if (OpMode != "idle" || NVerts >= MAX_VERTS || CloseTo(x, y) >= 0) return;
            char label = (char)('A' + NVerts);
            VertexList[NVerts] = new Vertex(x, y, label, Color.LightSkyBlue);
            NVerts++;
            Note = $"Made vertex {label}";
        }

        public void StartDrag(int x, int y)
        {
            if (OpMode != "idle") return;
            int vIdx = CloseTo(x, y);
            if (vIdx >= 0)
            {
                IsDragging = true;
                DragStartVertex = vIdx;
                DragStartPos = new Point(VertexList[vIdx].X, VertexList[vIdx].Y);
                DragCurrentPos = new Point(x, y);
                Note = $"Starting edge at vertex {VertexList[vIdx].Label}";
            }
        }

        public void UpdateDrag(int x, int y) => DragCurrentPos = new Point(x, y);

        public void EndDrag(int x, int y)
        {
            if (!IsDragging) return;
            int destIdx = CloseTo(x, y);
            int srcIdx = DragStartVertex;
            IsDragging = false;
            DragStartVertex = -1;

            if (destIdx >= 0 && srcIdx >= 0 && destIdx != srcIdx)
            {
                AddEdge(srcIdx, destIdx);
                Note = $"Made edge between {VertexList[srcIdx].Label} and {VertexList[destIdx].Label}";
            }
        }

        public void WarningNew()
        {
            if (!WasClearPressed)
            {
                WasClearPressed = true;
                Note = "ARE YOU SURE? Press again to clear old graph";
            }
            else
            {
                Clear();
                Note = "Graph cleared; double-click mouse to make vertex";
            }
        }

        public void Clear()
        {
            NVerts = 0;
            for (int i = 0; i < MAX_VERTS; i++)
            {
                VertexList[i] = null!;
                for (int j = 0; j < MAX_VERTS; j++)
                    AdjMat[i, j] = 0;
            }
            ResetVisited();
            WasClearPressed = false;
        }

        public void ResetVisited()
        {
            for (int i = 0; i < NVerts; i++)
            {
                if (VertexList[i] != null)
                {
                    VertexList[i].WasVisited = false;
                    VertexList[i].IsInTree = false;
                }
            }
            TheStack = new StackX(MAX_VERTS);
            TheQueue = new QueueX(MAX_VERTS);
            VisitList.Clear();
            TreeEdges.Clear();
            OpMode = "idle";
        }

        public int GetAdjUnvisitedVertex(int v)
        {
            for (int j = 0; j < NVerts; j++)
            {
                if (AdjMat[v, j] == 1 && !VertexList[j].WasVisited)
                    return j;
            }
            return -1;
        }

        public void StartDFS(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "dfs";
            VertexList[startIdx].WasVisited = true;
            TheStack.Push(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting DFS from vertex {VertexList[startIdx].Label}; pushed on stack";
        }

        public bool StepDFS()
        {
            if (OpMode != "dfs") { StartDFS(); return false; }
            if (TheStack.IsEmpty()) { OpMode = "idle"; Note = "DFS complete"; return true; }

            int topV = TheStack.Peek();
            int v = GetAdjUnvisitedVertex(topV);
            if (v == -1)
            {
                int popped = TheStack.Pop();
                if (TheStack.IsEmpty()) { OpMode = "idle"; Note = "DFS complete!"; return true; }
                Note = $"Backtrack to {VertexList[TheStack.Peek()].Label}";
            }
            else
            {
                VertexList[v].WasVisited = true;
                TheStack.Push(v);
                VisitList.Add(v);
                Note = $"Visited {VertexList[v].Label}; pushed on stack";
            }
            return false;
        }

        public void StartBFS(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "bfs";
            VertexList[startIdx].WasVisited = true;
            TheQueue.Insert(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting BFS from vertex {VertexList[startIdx].Label}; placed in queue";
        }

        public bool StepBFS()
        {
            if (OpMode != "bfs") { StartBFS(); return false; }
            if (TheQueue.IsEmpty()) { OpMode = "idle"; Note = "BFS complete"; return true; }

            int currentV = TheQueue.ToArray()[0];
            int v = GetAdjUnvisitedVertex(currentV);
            if (v == -1)
            {
                TheQueue.Remove();
                if (TheQueue.IsEmpty()) { OpMode = "idle"; Note = "BFS complete!"; return true; }
            }
            else
            {
                VertexList[v].WasVisited = true;
                TheQueue.Insert(v);
                VisitList.Add(v);
                Note = $"Visited {VertexList[v].Label}; added to queue";
            }
            return false;
        }

        public void StartTree(int startIdx = 0)
        {
            if (NVerts == 0) return;
            ResetVisited();
            OpMode = "tree";
            VertexList[startIdx].WasVisited = true;
            VertexList[startIdx].IsInTree = true;
            TheStack.Push(startIdx);
            VisitList.Add(startIdx);
            Note = $"Starting Minimum Spanning Tree from vertex {VertexList[startIdx].Label}";
        }

        public bool StepTree()
        {
            if (OpMode != "tree") { StartTree(); return false; }
            if (TheStack.IsEmpty()) { OpMode = "idle"; Note = $"Tree complete with {TreeEdges.Count} edges"; return true; }

            int topV = TheStack.Peek();
            int v = GetAdjUnvisitedVertex(topV);
            if (v == -1)
            {
                TheStack.Pop();
                if (TheStack.IsEmpty()) { OpMode = "idle"; Note = "Tree complete!"; return true; }
            }
            else
            {
                VertexList[v].WasVisited = true;
                VertexList[v].IsInTree = true;
                TheStack.Push(v);
                VisitList.Add(v);
                TreeEdges.Add(new TreeEdge(topV, v));
                Note = $"Added tree edge {VertexList[topV].Label}-{VertexList[v].Label}";
            }
            return false;
        }

        public void ChangeView()
        {
            ShowAdjm = !ShowAdjm;
            Note = ShowAdjm ? "Adjacency matrix; press View again to show graph" : "Press any button";
        }
    }
}
`,
  },
  {
    name: 'Vertex.cs',
    filename: 'Vertex.cs',
    language: 'csharp',
    descriptionAr: 'تمثيل الرأس (Vertex) في المخطط البياني مع إحداثيات ومؤشرات الزيارة والانتماء للشجرة.',
    descriptionEn: 'Graph vertex entity with coordinates, label, and traversal state.',
    content: `using System.Drawing;

namespace GraphViewer
{
    public class Vertex
    {
        public static char ClassChar = 'A';
        public int X { get; set; }
        public int Y { get; set; }
        public char Label { get; set; }
        public Color Color { get; set; }
        public bool WasVisited { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y)
        {
            X = x; Y = y;
            Label = ClassChar++;
            Color = Color.LightSkyBlue;
            WasVisited = false;
            IsInTree = false;
        }

        public Vertex(int x, int y, char label, Color color)
        {
            X = x; Y = y;
            Label = label;
            Color = color;
            WasVisited = false;
            IsInTree = false;
        }
    }
}
`,
  },
  {
    name: 'StackX.cs',
    filename: 'StackX.cs',
    language: 'csharp',
    descriptionAr: 'مكدس LIFO صريح لعمليات البحث في العمق DFS وشجرة الامتداد MST.',
    descriptionEn: 'Explicit LIFO stack for Depth-First Search and unweighted Minimum Spanning Tree traversal.',
    content: `namespace GraphViewer
{
    public class StackX
    {
        private readonly int[] _st;
        private int _top;

        public StackX(int max = 20)
        {
            _st = new int[max];
            _top = -1;
        }

        public void Push(int val) => _st[++_top] = val;
        public int Pop() => _st[_top--];
        public int Peek() => _st[_top];
        public bool IsEmpty() => _top == -1;

        public int[] ToArray()
        {
            var arr = new int[_top + 1];
            for (int i = 0; i <= _top; i++) arr[i] = _st[i];
            return arr;
        }
    }
}
`,
  },
  {
    name: 'QueueX.cs',
    filename: 'QueueX.cs',
    language: 'csharp',
    descriptionAr: 'طابور FIFO دائري صريح لعمليات البحث في العرض BFS.',
    descriptionEn: 'Explicit circular FIFO queue for Breadth-First Search level-order traversal.',
    content: `namespace GraphViewer
{
    public class QueueX
    {
        private readonly int _size;
        private readonly int[] _queArray;
        private int _front;
        private int _rear;

        public QueueX(int s = 20)
        {
            _size = s;
            _queArray = new int[_size];
            _front = 0;
            _rear = -1;
        }

        public void Insert(int j)
        {
            if (_rear == _size - 1) _rear = -1;
            _queArray[++_rear] = j;
        }

        public int Remove()
        {
            int temp = _queArray[_front++];
            if (_front == _size) _front = 0;
            return temp;
        }

        public bool IsEmpty() => (_rear + 1 == _front || (_front + _size - 1 == _rear));

        public int[] ToArray()
        {
            if (IsEmpty()) return System.Array.Empty<int>();
            var list = new System.Collections.Generic.List<int>();
            int idx = _front;
            while (true)
            {
                list.Add(_queArray[idx]);
                if (idx == _rear) break;
                idx = (idx + 1) % _size;
            }
            return list.ToArray();
        }
    }
}
`,
  },
  {
    name: 'GraphViewer.csproj',
    filename: 'GraphViewer.csproj',
    language: 'xml',
    descriptionAr: 'ملف مشروع Visual Studio C# لـ .NET 8.0 Windows Forms.',
    descriptionEn: 'C# Windows Forms Project configuration for .NET 8.0.',
    content: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <AssemblyName>GraphViewer</AssemblyName>
    <RootNamespace>GraphViewer</RootNamespace>
  </PropertyGroup>
</Project>
`,
  },
  {
    name: 'Program.cs',
    filename: 'Program.cs',
    language: 'csharp',
    descriptionAr: 'نقطة الدخول الرئيسية للبرنامج في .NET 8.0.',
    descriptionEn: 'Main entry point initializing Windows Forms runtime.',
    content: `using System;
using System.Windows.Forms;

namespace GraphViewer
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new GraphForm());
        }
    }
}
`,
  },
];

export function getFilesForApplet(appletId: string = 'unordered-array'): CSharpSourceFile[] {
  if (appletId === 'ordered-array') {
    return CSHARP_FILES_ORDERED;
  }
  if (appletId === 'bubble-sort') {
    return CSHARP_FILES_BUBBLE;
  }
  if (appletId === 'select-sort') {
    return CSHARP_FILES_SELECT;
  }
  if (appletId === 'insert-sort') {
    return CSHARP_FILES_INSERT;
  }
  if (appletId === 'stack') {
    return CSHARP_FILES_STACK;
  }
  if (appletId === 'queue') {
    return CSHARP_FILES_QUEUE;
  }
  if (appletId === 'priority-queue') {
    return CSHARP_FILES_PRIORITY_QUEUE;
  }
  if (appletId === 'link-list') {
    return CSHARP_FILES_LINK_LIST;
  }
  if (appletId === 'towers') {
    return CSHARP_FILES_TOWERS;
  }
  if (appletId === 'quick-sort-1') {
    return CSHARP_FILES_QUICK_SORT_1;
  }
  if (appletId === 'quick-sort-2') {
    return CSHARP_FILES_QUICK_SORT_2;
  }
  if (appletId === 'merge-sort') {
    return CSHARP_FILES_MERGE_SORT;
  }
  if (appletId === 'tree') {
    return CSHARP_FILES_TREE;
  }
  if (appletId === 'hash-table') {
    return CSHARP_FILES_HASH;
  }
  if (appletId === 'hash-chain') {
    return CSHARP_FILES_HASH_CHAIN;
  }
  if (appletId === 'graph') {
    return CSHARP_FILES_GRAPH;
  }
  if (appletId === 'graph-dw') {
    return CSHARP_FILES_GRAPH_DW;
  }
  if (appletId === 'graph-w') {
    return CSHARP_FILES_GRAPH_W;
  }
  return CSHARP_FILES;
}

export async function downloadFullProjectZip(appletId: string = 'unordered-array'): Promise<void> {
  const zip = new JSZip();
  let folderName = 'UnorderedArrayViewer';
  let files = CSHARP_FILES;

  if (appletId === 'ordered-array') {
    folderName = 'OrderedArrayViewer';
    files = CSHARP_FILES_ORDERED;
  } else if (appletId === 'bubble-sort') {
    folderName = 'BubbleSortViewer';
    files = CSHARP_FILES_BUBBLE;
  } else if (appletId === 'select-sort') {
    folderName = 'SelectionSortViewer';
    files = CSHARP_FILES_SELECT;
  } else if (appletId === 'insert-sort') {
    folderName = 'InsertionSortViewer';
    files = CSHARP_FILES_INSERT;
  } else if (appletId === 'stack') {
    folderName = 'StackViewer';
    files = CSHARP_FILES_STACK;
  } else if (appletId === 'queue') {
    folderName = 'QueueViewer';
    files = CSHARP_FILES_QUEUE;
  } else if (appletId === 'priority-queue') {
    folderName = 'PriorityQueueViewer';
    files = CSHARP_FILES_PRIORITY_QUEUE;
  } else if (appletId === 'link-list') {
    folderName = 'LinkListViewer';
    files = CSHARP_FILES_LINK_LIST;
  } else if (appletId === 'towers') {
    folderName = 'TowersViewer';
    files = CSHARP_FILES_TOWERS;
  } else if (appletId === 'quick-sort-1') {
    folderName = 'QuickSort1Viewer';
    files = CSHARP_FILES_QUICK_SORT_1;
  } else if (appletId === 'quick-sort-2') {
    folderName = 'QuickSort2Viewer';
    files = CSHARP_FILES_QUICK_SORT_2;
  } else if (appletId === 'merge-sort') {
    folderName = 'MergeSortViewer';
    files = CSHARP_FILES_MERGE_SORT;
  } else if (appletId === 'tree') {
    folderName = 'TreeViewer';
    files = CSHARP_FILES_TREE;
  } else if (appletId === 'hash-table') {
    folderName = 'HashViewer';
    files = CSHARP_FILES_HASH;
  } else if (appletId === 'hash-chain') {
    folderName = 'HashChainViewer';
    files = CSHARP_FILES_HASH_CHAIN;
  } else if (appletId === 'graph') {
    folderName = 'GraphViewer';
    files = CSHARP_FILES_GRAPH;
  } else if (appletId === 'graph-dw') {
    folderName = 'GraphDWViewer';
    files = CSHARP_FILES_GRAPH_DW;
  } else if (appletId === 'graph-w') {
    folderName = 'GraphWViewer';
    files = CSHARP_FILES_GRAPH_W;
  }

  const folder = zip.folder(folderName);
  if (folder) {
    for (const file of files) {
      folder.file(file.filename, file.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}_CSharp.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllProjectsMasterZip(): Promise<void> {
  const zip = new JSZip();

  const allProjects = [
    { folderName: 'UnorderedArrayViewer', csproj: 'UnorderedArrayViewer.csproj', title: 'Chapter 2: Unordered Array', guid: '{22222222-0001-4000-8000-000000000001}', files: CSHARP_FILES },
    { folderName: 'OrderedArrayViewer', csproj: 'OrderedArrayViewer.csproj', title: 'Chapter 2: Ordered Array', guid: '{22222222-0002-4000-8000-000000000002}', files: CSHARP_FILES_ORDERED },
    { folderName: 'BubbleSortViewer', csproj: 'BubbleSortViewer.csproj', title: 'Chapter 3: Bubble Sort', guid: '{33333333-0001-4000-8000-000000000001}', files: CSHARP_FILES_BUBBLE },
    { folderName: 'SelectionSortViewer', csproj: 'SelectionSortViewer.csproj', title: 'Chapter 3: Selection Sort', guid: '{33333333-0002-4000-8000-000000000002}', files: CSHARP_FILES_SELECT },
    { folderName: 'InsertionSortViewer', csproj: 'InsertionSortViewer.csproj', title: 'Chapter 3: Insertion Sort', guid: '{33333333-0003-4000-8000-000000000003}', files: CSHARP_FILES_INSERT },
    { folderName: 'StackViewer', csproj: 'StackViewer.csproj', title: 'Chapter 4: Stack', guid: '{44444444-0001-4000-8000-000000000001}', files: CSHARP_FILES_STACK },
    { folderName: 'QueueViewer', csproj: 'QueueViewer.csproj', title: 'Chapter 4: Queue', guid: '{44444444-0002-4000-8000-000000000002}', files: CSHARP_FILES_QUEUE },
    { folderName: 'PriorityQueueViewer', csproj: 'PriorityQueueViewer.csproj', title: 'Chapter 4: Priority Queue', guid: '{44444444-0003-4000-8000-000000000003}', files: CSHARP_FILES_PRIORITY_QUEUE },
    { folderName: 'LinkListViewer', csproj: 'LinkListViewer.csproj', title: 'Chapter 5: Linked List', guid: '{55555555-0001-4000-8000-000000000001}', files: CSHARP_FILES_LINK_LIST },
    { folderName: 'TowersViewer', csproj: 'TowersViewer.csproj', title: 'Chapter 6: Towers of Hanoi', guid: '{66666666-0001-4000-8000-000000000001}', files: CSHARP_FILES_TOWERS },
    { folderName: 'MergeSortViewer', csproj: 'MergeSortViewer.csproj', title: 'Chapter 6/8: Merge Sort', guid: '{66666666-0002-4000-8000-000000000002}', files: CSHARP_FILES_MERGE_SORT },
    { folderName: 'QuickSort1Viewer', csproj: 'QuickSort1Viewer.csproj', title: 'Chapter 7: QuickSort 1', guid: '{77777777-0001-4000-8000-000000000001}', files: CSHARP_FILES_QUICK_SORT_1 },
    { folderName: 'QuickSort2Viewer', csproj: 'QuickSort2Viewer.csproj', title: 'Chapter 7: QuickSort 2', guid: '{77777777-0002-4000-8000-000000000002}', files: CSHARP_FILES_QUICK_SORT_2 },
    { folderName: 'TreeViewer', csproj: 'TreeViewer.csproj', title: 'Chapter 9: Binary Search Tree', guid: '{99999999-0001-4000-8000-000000000001}', files: CSHARP_FILES_TREE },
    { folderName: 'HashViewer', csproj: 'HashViewer.csproj', title: 'Chapter 11: Linear Probing Hash Table', guid: '{11111111-0001-4000-8000-000000000001}', files: CSHARP_FILES_HASH },
    { folderName: 'HashChainViewer', csproj: 'HashChainViewer.csproj', title: 'Chapter 11: Separate Chaining Hash Table', guid: '{11111111-0002-4000-8000-000000000002}', files: CSHARP_FILES_HASH_CHAIN },
    { folderName: 'GraphViewer', csproj: 'GraphViewer.csproj', title: 'Chapter 13: Graph Workshop (DFS, BFS, Spanning Tree)', guid: '{13131313-0001-4000-8000-000000000001}', files: CSHARP_FILES_GRAPH },
    { folderName: 'GraphDWViewer', csproj: 'GraphDWViewer.csproj', title: 'Chapter 14: Directed Weighted Graph (Dijkstra)', guid: '{14141414-0001-4000-8000-000000000001}', files: CSHARP_FILES_GRAPH_DW },
    { folderName: 'GraphWViewer', csproj: 'GraphWViewer.csproj', title: 'Chapter 14: Weighted Undirected Graph (Prim MST)', guid: '{14141414-0002-4000-8000-000000000002}', files: CSHARP_FILES_GRAPH_W },
  ];

  // 1. Add each project to its folder
  for (const proj of allProjects) {
    const pFolder = zip.folder(proj.folderName);
    if (pFolder) {
      for (const file of proj.files) {
        pFolder.file(file.filename, file.content);
      }
    }
  }

  // 2. Generate Master Unified Project Files in Root
  const masterCsproj = `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <StartupObject>RobertLafore_DSA_Studio.Program</StartupObject>
    <RootNamespace>RobertLafore_DSA_Studio</RootNamespace>
    <AssemblyName>RobertLafore_DSA_Studio</AssemblyName>
    <ApplicationTitle>روبرت لافور - ستوديو الخوارزميات وهياكل البيانات | Robert Lafore DSA Studio</ApplicationTitle>
    <Description>المشروع الشامل والموحد لجميع بريمجات روبرت لافور التفاعلية لهياكل البيانات والخوارزميات بلغة C# و .NET 8.0</Description>
  </PropertyGroup>

  <ItemGroup>
${allProjects.map(p => `    <ProjectReference Include="${p.folderName}\\${p.csproj}" />`).join('\n')}
  </ItemGroup>
</Project>
`;
  zip.file('RobertLafore_DSA_Studio.csproj', masterCsproj);

  const masterProgram = `using System;
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
`;
  zip.file('Program.cs', masterProgram);

  const masterFormDesigner = `namespace RobertLafore_DSA_Studio
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
`;
  zip.file('MainDashboardForm.Designer.cs', masterFormDesigner);

  const masterFormCs = `using System;
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

            LoadAlgorithm("unordered", "المصفوفة غير المرتبة (Unordered Array)", "الفصل 2: المصفوفات", "O(N) Search / O(1) Insert");
        }

        private void PopulateAlgorithmTree()
        {
            treeNavigation.BeginUpdate();
            treeNavigation.Nodes.Clear();

            var ch2 = treeNavigation.Nodes.Add("الفصل 2: المصفوفات (Arrays)");
            AddAlgoNode(ch2, "unordered", "المصفوفة غير المرتبة (Unordered)", "الفصل 2", "O(N) Search / O(1) Insert");
            AddAlgoNode(ch2, "ordered", "المصفوفة المرتبة (Ordered)", "الفصل 2", "O(log N) Binary Search");

            var ch3 = treeNavigation.Nodes.Add("الفصل 3: الترتيب البسيط (Sorting)");
            AddAlgoNode(ch3, "bubble", "ترتيب الفقاعة (Bubble Sort)", "الفصل 3", "O(N²)");
            AddAlgoNode(ch3, "select", "ترتيب الاختيار (Selection Sort)", "الفصل 3", "O(N²)");
            AddAlgoNode(ch3, "insert", "ترتيب الإدراج (Insertion Sort)", "الفصل 3", "O(N²) - O(N) Best");

            var ch4 = treeNavigation.Nodes.Add("الفصل 4: المكدسات والطوابير (Stacks & Queues)");
            AddAlgoNode(ch4, "stack", "المكدس (Stack - LIFO)", "الفصل 4", "O(1)");
            AddAlgoNode(ch4, "queue", "الطابور الدائري (Queue - FIFO)", "الفصل 4", "O(1)");
            AddAlgoNode(ch4, "pqueue", "طابور الأولوية (Priority Queue)", "الفصل 4", "O(N) Insert / O(1) Remove");

            var ch5 = treeNavigation.Nodes.Add("الفصل 5: القوائم المرتبطة (Linked Lists)");
            AddAlgoNode(ch5, "linklist", "القائمة المرتبطة (Link List)", "الفصل 5", "O(1) Insert / O(N) Search");

            var ch68 = treeNavigation.Nodes.Add("الفصل 6 و 8: العودية والدمج (Recursion)");
            AddAlgoNode(ch68, "towers", "أبراج هانوي (Towers of Hanoi)", "الفصل 6", "O(2ⁿ)");
            AddAlgoNode(ch68, "merge", "ترتيب الدمج (Merge Sort)", "الفصل 8", "O(N log N)");

            var ch7 = treeNavigation.Nodes.Add("الفصل 7: الترتيب السريع (QuickSort)");
            AddAlgoNode(ch7, "quick1", "الترتيب السريع 1 (QuickSort 1)", "الفصل 7", "O(N log N) Avg / O(N²) Worst");
            AddAlgoNode(ch7, "quick2", "الترتيب السريع 2 - وسيط الثلاثة", "الفصل 7", "O(N log N) Median-of-3");

            var ch9 = treeNavigation.Nodes.Add("الفصل 9: الشجرة الثنائية (Binary Trees)");
            AddAlgoNode(ch9, "tree", "شجرة البحث الثنائية (BST)", "الفصل 9", "O(log N) Avg / O(N) Worst");

            var ch11 = treeNavigation.Nodes.Add("الفصل 11: جداول الهاش (Hash Tables)");
            AddAlgoNode(ch11, "hash", "المسح الخطي (Linear Probing)", "الفصل 11", "O(1) Avg");
            AddAlgoNode(ch11, "hashchain", "السلاسل المنفصلة (Separate Chaining)", "الفصل 11", "O(1 + λ)");

            var ch13 = treeNavigation.Nodes.Add("الفصل 13: المخططات العامة (Graphs)");
            AddAlgoNode(ch13, "graph", "البحث بالعمق والعرض (DFS & BFS)", "الفصل 13", "O(V + E)");

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
                    Text = $"تعذر تحميل النموذج [{title}]:\\n{ex.Message}"
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
`;
  zip.file('MainDashboardForm.cs', masterFormCs);

  // 3. Generate Master Visual Studio Solution File (.sln) with Master Project First
  const masterGuid = '{00000000-0000-4000-8000-000000000000}';
  let slnContent = `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.8.34330.188
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "RobertLafore_DSA_Studio", "RobertLafore_DSA_Studio.csproj", "${masterGuid}"
EndProject
`;
  for (const proj of allProjects) {
    slnContent += `Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "${proj.folderName}", "${proj.folderName}\\${proj.csproj}", "${proj.guid}"
EndProject
`;
  }
  slnContent += `Global
\tGlobalSection(SolutionConfigurationPlatforms) = preSolution
\t\tDebug|Any CPU = Debug|Any CPU
\t\tRelease|Any CPU = Release|Any CPU
\tEndGlobalSection
\tGlobalSection(ProjectConfigurationPlatforms) = postSolution
\t\t${masterGuid}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
\t\t${masterGuid}.Debug|Any CPU.Build.0 = Debug|Any CPU
\t\t${masterGuid}.Release|Any CPU.ActiveCfg = Release|Any CPU
\t\t${masterGuid}.Release|Any CPU.Build.0 = Release|Any CPU
`;
  for (const proj of allProjects) {
    slnContent += `\t\t${proj.guid}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
\t\t${proj.guid}.Debug|Any CPU.Build.0 = Debug|Any CPU
\t\t${proj.guid}.Release|Any CPU.ActiveCfg = Release|Any CPU
\t\t${proj.guid}.Release|Any CPU.Build.0 = Release|Any CPU
`;
  }
  slnContent += `\tEndGlobalSection
\tGlobalSection(SolutionProperties) = preSolution
\t\tHideSolutionNode = FALSE
\tEndGlobalSection
EndGlobal
`;

  zip.file('RobertLafore_DSA_Studio.sln', slnContent);

  // 4. Add Master README
  const masterReadme = `# استوديو روبرت لافور لهياكل البيانات والخوارزميات بلغة C# (.NET 8.0)
## Robert Lafore - Data Structures & Algorithms Unified Studio (Windows Forms)

هذا هو المشروع الشامل والموحد المنفذ بنظام Windows Forms على .NET 8.0 لجميع البريمجات الـ 19:

### المشاريع المتضمنة (${allProjects.length} خوارزمية في حل واحد):
${allProjects.map((p, idx) => `${idx + 1}. **${p.folderName}**: ${p.title}`).join('\n')}

### طريقة التشغيل الفورية:
1. تأكد من تثبيت **.NET 8.0 SDK** و **Visual Studio 2022** (مع تحديد ميزة ".NET desktop development").
2. افتح ملف الحل الرئيسي الشامل: \`RobertLafore_DSA_Studio.sln\`.
3. المشروع الموحد \`RobertLafore_DSA_Studio\` هو المشروع الافتراضي (Startup Project).
4. اضغط مباشرة على **F5** (أو زر **Start** الأخضر).
5. ستفتح لك النافذة الرئيسية وبها شريط جانبي يضم جميع الفصول الـ 19 للتنقل الفوري بينها!
`;
  zip.file('README.md', masterReadme);

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RobertLafore_DSA_Studio_FullProject.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSingleFile(file: CSharpSourceFile): void {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


