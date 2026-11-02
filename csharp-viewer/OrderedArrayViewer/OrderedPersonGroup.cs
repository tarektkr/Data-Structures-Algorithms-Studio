using System;
using System.Drawing;

namespace OrderedArrayViewer
{
    /// <summary>
    /// كلاس إدارة المصفوفة المرتبة (Ordered Array) لـ Robert Lafore
    /// يدعم خوارزمية البحث الثنائي (Binary Search O(log N)) والبحث الخطي (Linear Search).
    /// الإدراج المرتب مع إزاحة العناصر لليمين، والحذف مع الإزاحة لليسار.
    /// </summary>
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

        public bool IsLinear { get; private set; } = false; // افتراضياً البحث الثنائي Binary Search
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

            // توليد قيم عشوائية فريدة وترتيبها تصاعدياً
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

            // تحديد موقع الإدراج المرتب
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
                    return false; // توقف فوري عند إيجاد العنصر
                }

                if (personArray[CurIn] != null && personArray[CurIn]!.Height > findKey)
                {
                    // في المصفوفة المرتبة، إذا تجاوزت القيمة المستهدفة فهذا يعني عدم وجودها!
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
                // خوارزمية البحث الثنائي (Binary Search)
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
                    return false; // توقف فوري عند إيجاد العنصر
                }

                if (personArray[CurIn] != null && findKey < personArray[CurIn]!.Height)
                {
                    UpperBound = CurIn - 1; // البحث في النصف الأيسر
                }
                else
                {
                    LowerBound = CurIn + 1; // البحث في النصف الأيمن
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

            // بحث ثنائي سريع لتحديد موقع الحذف
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

            // صندوق الملاحظات
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

            // رسم الخلايا
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

            // رقم الفهرس
            using (Font idxFont = new Font("SansSerif", 8f, FontStyle.Regular))
            using (SolidBrush idxBrush = new SolidBrush(Color.DarkSlateGray))
            {
                string idxText = index.ToString();
                int xOffset = index >= 10 ? 16 : 10;
                g.DrawString(idxText, idxFont, idxBrush, cellX - xOffset - 2, cellY + 2);
            }

            // إطار الخلية
            using (Pen cellPen = new Pen(Color.Black))
            {
                g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
            }

            // تمييز نطاق البحث الثنائي (Binary Search Range)
            if (ShowRange && index >= LowerBound && index <= UpperBound)
            {
                using (Pen rangePen = new Pen(Color.Blue, 2f))
                {
                    g.DrawRectangle(rangePen, cellX - 1, cellY - 1, CellWidth + 2, CellHeight + 2);
                }
            }

            // رسم العنصر
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

            // السهم الأحمر لمؤشر الفحص الحالي
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
}
