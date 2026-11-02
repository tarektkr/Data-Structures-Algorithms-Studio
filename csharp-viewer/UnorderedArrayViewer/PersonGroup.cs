using System;
using System.Drawing;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل المصفوفة غير المرتبة (PersonGroup)
    /// تطابق منطق وخوارزميات personGroup.class في كتاب خوارزميات وهياكل البيانات لـ Robert Lafore.
    /// تدعم العمليات: New, Fill, Ins, Find, Del بالإضافة إلى التكرار (Duplicates OK / No dups)
    /// والتحريك خطوة بخطوة (Step-by-step animation).
    /// </summary>
    public class PersonGroup
    {
        // الثوابت الأساسية للأبعاد والحدود
        public const int ASIZE = 60;      // الحد الأقصى لحجم المصفوفة
        public const int MAX_KEY = 999;   // الحد الأقصى لقيمة المفتاح
        public const int N_COLUMNS = 6;   // عدد الأعمدة في شاشة العرض
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

        // وضع العملية الحالي (Operation Mode & Code Part State Machine)
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

        /// <summary>
        /// إنشاء كائن جديد بقيمة عددية ولون عشوائي مميز
        /// </summary>
        public Person MakePerson(int height)
        {
            int r = 100 + rand.Next(156);
            int g = 100 + rand.Next(156);
            int b = 100 + rand.Next(156);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        /// <summary>
        /// تغيير خيار السماح بالتكرار (Duplicates OK)
        /// </summary>
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

        /// <summary>
        /// إنشاء مصفوفة جديدة بحجم محدد
        /// </summary>
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

        /// <summary>
        /// ملء المصفوفة بعدد من العناصر العشوائية
        /// </summary>
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
                    // تأكد من عدم تكرار المفتاح
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

        /// <summary>
        /// إدراج عنصر جديد في المصفوفة
        /// </summary>
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

        /// <summary>
        /// بدء عملية البحث (Find)
        /// </summary>
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

        /// <summary>
        /// تنفيذ خطوة واحدة من خوارزمية البحث الخطي (Linear Search Step)
        /// </summary>
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

        /// <summary>
        /// بدء عملية الحذف (Delete)
        /// </summary>
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
            CodePart = 1; // 1: Searching, 2: Shifting
            Note = $"Enter key of item to delete: {delKey}";
        }

        /// <summary>
        /// تنفيذ خطوة واحدة من خوارزمية الحذف والإزاحة (Delete & Shift Step)
        /// </summary>
        public bool StepDelete()
        {
            if (CurrentOp != OperationMode.Del) return false;

            if (CodePart == 1) // مرحلة البحث عن العنصر المطلوب حذفه
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
                    // تم العثور على العنصر -> البدء في إزاحة العناصر اللاحقة
                    nDeleted++;
                    wasJustFound = true;
                    LastDeletion = CurIn;
                    Note = $"Have found and deleted item with key {delKey}";
                    CodePart = 2; // الانتقال لمرحلة الإزاحة
                    return true;
                }
                else
                {
                    Note = $"Checking index = {CurIn}";
                    CurIn++;
                    return true;
                }
            }
            else if (CodePart == 2) // مرحلة إزاحة العناصر المتبقية نحو اليسار
            {
                if (CurIn < NPersons - 1)
                {
                    // إزاحة العنصر من CurIn+1 إلى CurIn
                    personArray[CurIn] = personArray[CurIn + 1];
                    Note = $"Will shift item {CurIn + 1} to {CurIn}";
                    CurIn++;
                    return true;
                }
                else
                {
                    // إفراغ الخلية الأخيرة وتقليص العدد
                    personArray[NPersons - 1] = null;
                    NPersons--;
                    Note = $"Shifting completed. Total items = {NPersons}";

                    if (DupsOK)
                    {
                        // فحص إذا كان هناك تكرار آخر لنفس القيمة يبدأ من موقع الحذف الأخير
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

        /// <summary>
        /// رسم واجهة الأبليت بالكامل باستخدام GDI+
        /// </summary>
        public void Draw(Graphics g)
        {
            // 1. رسم خلفية الأبليت باللون الرمادي الفاتح الكلاسيكي
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            // 2. رسم صندوق الملاحظات / الرسائل (Note Box)
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

            // 3. رسم خلايا المصفوفة (TotalCells)
            for (int i = 0; i < TotalCells; i++)
            {
                DrawPersonCell(g, i);
            }
        }

        /// <summary>
        /// رسم خلية محددة من المصفوفة (المربع، شريط القيمة، رقم الفهرس، ومؤشر الفحص)
        /// </summary>
        private void DrawPersonCell(Graphics g, int index)
        {
            int col = index / 10;
            int row = index % 10;
            int cellX = LeftMargin + col * ColumnWidth + 20;
            int cellY = TopMargin + row * (CellHeight + 2);

            // أ. رسم رقم الفهرس (Index) على يسار الخلية
            using (Font idxFont = new Font("SansSerif", 8f, FontStyle.Regular))
            using (SolidBrush idxBrush = new SolidBrush(Color.DarkSlateGray))
            {
                string idxText = index.ToString();
                int xOffset = index >= 10 ? 16 : 10;
                g.DrawString(idxText, idxFont, idxBrush, cellX - xOffset - 2, cellY + 2);
            }

            // ب. إطار الخلية
            using (Pen cellPen = new Pen(Color.Black))
            {
                g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
            }

            // ج. رسم العنصر داخل الخلية إن وجد
            if (index < NPersons && personArray[index] != null)
            {
                Person p = personArray[index]!;
                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    // تعبئة المستطيل بلون العنصر ثلاثي الأبعاد
                    g.FillRectangle(barBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }

                // كتابة القيمة العددية داخل الخلية بشكل متوسط وواضح
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
                // خلية فارغة
                using (SolidBrush emptyBrush = new SolidBrush(Color.WhiteSmoke))
                {
                    g.FillRectangle(emptyBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                }
            }

            // د. رسم مؤشر المؤشر الحالي (السهم الأحمر Red Arrow)
            if (index == CurIn)
            {
                int arrowX = cellX + CellWidth + 5;
                int arrowY = cellY + (CellHeight / 2);

                using (Pen redPen = new Pen(Color.Red, 2f))
                using (SolidBrush redBrush = new SolidBrush(Color.Red))
                {
                    // رسم خط السهم
                    g.DrawLine(redPen, arrowX + 12, arrowY, arrowX, arrowY);
                    // رسم رأس السهم المثلث
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

        /// <summary>
        /// الحصول على العنصر في موقع محدد
        /// </summary>
        public Person? GetPerson(int index)
        {
            if (index >= 0 && index < NPersons)
                return personArray[index];
            return null;
        }
    }
}
