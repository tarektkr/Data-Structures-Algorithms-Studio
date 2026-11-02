using System;
using System.Drawing;

namespace PriorityQueueViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل طابور الأولوية (Priority Queue) المعتمد على مصفوفة مرتبة
    /// حيث يتواجد العنصر ذو الأولوية القصوى دائماً في المقدمة (Front = NPersons - 1)
    /// وتتم عملية الإدراج (Insert) بالبحث والإزاحة (Shift) بترتيب تصاعدي.
    /// متطابقة تماماً مع personGroup.class في بريمج روبرت لافور الأصلي
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
        public const int BlueShaft = 60;  // طول سهم Rear
        public const int RedShaft = 15;   // طول سهم Front
        public const int BlackShaft = 10; // طول سهم curIn أثناء البحث والإزاحة
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
        public int OldFront { get; private set; }
        public int OldCurIn { get; private set; }
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
            OldFront = -1;
            OldCurIn = -9;
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

            // تعبئة 5 عناصر عشوائية مرتبة تصاعدياً
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
                        CodePart = 4; // إدراج مباشر في الخلية الأولى
                    }
                    else
                    {
                        CurIn = NPersons - 1; // بدء البحث من قمة الطابور
                        CodePart = 3;
                    }
                    break;

                case 3:
                    // التحقق والبحث عن موضع الإدراج مع إزاحة العناصر الأكبر
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
                        // إزاحة العنصر الحالي للأعلى لإفساح المجال
                        queArray[CurIn + 1] = queArray[CurIn];
                        queArray[CurIn] = null;
                        CurIn--;
                        Note = "Shifting; searching for insertion point";
                        // البقاء في الحالة 3 لمتابعة البحث والإزاحة
                    }
                    break;

                case 4:
                    // وضع العنصر في الموضع المحدد
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
            // خلفية رمادية مطابقة لـ Java AWT
            g.Clear(Color.LightGray);

            // مربع الملاحظات في الأعلى
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

            // رسم الخلايا العشر (0 في الأسفل، 9 في الأعلى)
            for (int i = 0; i < ASIZE; i++)
            {
                int cellY = baseY - i * CellHeight;

                // رسم رقم الفهرس
                using (Font indexFont = new Font("Monospace", 8))
                using (Brush indexBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(i.ToString(), indexFont, indexBrush, cellX - 22, cellY + 2);
                }

                // إطار الخلية
                using (Pen cellPen = new Pen(Color.Black))
                {
                    g.DrawRectangle(cellPen, cellX, cellY, CellWidth, CellHeight);
                }

                // محتوى الخلية
                Person? p = queArray[i];
                if (p != null)
                {
                    using (Brush personBrush = new SolidBrush(p.Color))
                    {
                        g.FillRectangle(personBrush, cellX + 1, cellY + 1, CellWidth - 1, CellHeight - 1);
                    }

                    // تأثير التجسيم ثلاثي الأبعاد
                    using (Pen lightPen = new Pen(Color.White))
                    using (Pen darkPen = new Pen(Color.DimGray))
                    {
                        g.DrawLine(lightPen, cellX + 1, cellY + CellHeight - 1, cellX + 1, cellY + 1);
                        g.DrawLine(lightPen, cellX + 1, cellY + 1, cellX + CellWidth - 1, cellY + 1);
                        g.DrawLine(darkPen, cellX + CellWidth - 1, cellY + 1, cellX + CellWidth - 1, cellY + CellHeight - 1);
                    }

                    // رسم قيمة المفتاح
                    using (Font valFont = new Font("SansSerif", 8, FontStyle.Bold))
                    using (Brush valBrush = new SolidBrush(Color.Black))
                    {
                        string str = p.GetHeight().ToString();
                        SizeF size = g.MeasureString(str, valFont);
                        g.DrawString(str, valFont, valBrush, cellX + (CellWidth - size.Width) / 2, cellY + 2);
                    }
                }

                int centerY = cellY + CellHeight / 2;

                // رسم سهم curIn أثناء البحث والإزاحة (سهم أسود بطول 10)
                if (CurIn >= 0 && i == CurIn)
                {
                    DrawArrow(g, cellX, centerY, BlackShaft, Color.Black, "curIn");
                }

                // رسم سهم Front (سهم أحمر بطول 15)
                if (i == Front && NPersons > 0)
                {
                    DrawArrow(g, cellX, centerY, RedShaft, Color.Red, "Front");
                }

                // رسم سهم Rear (سهم أزرق بطول 60 يشير إلى الفهرس 0)
                if (i == Rear)
                {
                    DrawArrow(g, cellX, centerY, BlueShaft, Color.Blue, "Rear");
                }
            }

            // خط قاعدة الطابور
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
                // خط الساق
                g.DrawLine(arrowPen, arrowStartX, centerY, arrowEndX, centerY);

                // رأس السهم
                Point[] head = new Point[]
                {
                    new Point(arrowEndX, centerY),
                    new Point(arrowEndX + 5, centerY - 4),
                    new Point(arrowEndX + 5, centerY + 4)
                };
                g.FillPolygon(arrowBrush, head);

                // تسمية السهم
                if (!string.IsNullOrEmpty(label))
                {
                    g.DrawString(label, labelFont, arrowBrush, arrowStartX + 4, centerY - 6);
                }
            }
        }
    }
}
