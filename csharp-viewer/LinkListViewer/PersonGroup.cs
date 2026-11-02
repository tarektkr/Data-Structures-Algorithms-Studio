using System;
using System.Drawing;

namespace LinkListViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل القائمة المترابطة (Linked List) بشكليها المرتب وغير المرتب
    /// ورسم العقد ومؤشرات الربط ومؤشر الفحص curIn ورسوم التحويل وإعادة التوجيه
    /// تتطابق تماماً مع personGroup.class في بريمج روبرت لافور
    /// </summary>
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
        public int OpMode { get; private set; } // 1: new, 2: ins, 3: find, 4: del
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
                        CodePart = 4; // إدراج في رأس القائمة مباشرة
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

            // مربع الملاحظات في الأعلى
            using (Brush backBrush = new SolidBrush(Color.LightGray))
            using (Pen borderPen = new Pen(Color.DarkGray))
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Monospace", 9, FontStyle.Bold))
            {
                g.FillRectangle(backBrush, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawString(Note, noteFont, textBrush, LeftMargin + 6, NoteBoxTop + 5);
            }

            // مؤشر First
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

            // رسم العقد والروابط
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

                // رسم سهم الرابط التالي
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
                        // سهم الالتفاف الثعباني للسطر التالي
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
                    // العقدة الأخيرة تشير إلى Null (تأريض)
                    using (Pen nullPen = new Pen(Color.DarkSlateGray, 2))
                    {
                        g.DrawLine(nullPen, x + LinkWidth, y + 8, x + LinkWidth + 12, y + 8);
                        g.DrawLine(nullPen, x + LinkWidth + 12, y + 3, x + LinkWidth + 12, y + 13);
                        g.DrawLine(nullPen, x + LinkWidth + 15, y + 5, x + LinkWidth + 15, y + 11);
                        g.DrawLine(nullPen, x + LinkWidth + 18, y + 7, x + LinkWidth + 18, y + 9);
                    }
                }

                // سهم curIn الأحمر فوق العقدة المفحوصة
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

            // رسم العقدة المؤقتة وإعادة توجيه المؤشرات أثناء الإدراج
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
}
