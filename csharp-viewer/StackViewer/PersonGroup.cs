using System;
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
        public int NP同学 { get; set; } // nPersons
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
            NP同学 = 0;
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
            NP同学 = INIT_NUM;
            OldCurIn = NP同学;
            CurIn = NP同学;
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
                    NP同学 = 0;
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
                    if (NP同学 >= ASIZE)
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
                    NP同学++;
                    OldCurIn = CurIn;
                    CurIn = NP同学;
                    Note = "Incremented top";
                    CodePart = 3;
                    break;
                case 3:
                    StackArray[NP同学 - 1] = TempPers;
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
                    if (NP同学 <= 0)
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
                    int val = StackArray[NP同学 - 1]?.GetHeight() ?? 0;
                    ReturnString = val.ToString();
                    StackArray[NP同学 - 1] = null;
                    Note = "Item removed; value returned in Number";
                    CodePart = 3;
                    break;
                case 3:
                    NP同学--;
                    OldCurIn = CurIn;
                    CurIn = NP同学;
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
                    if (NP同学 <= 0)
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
                    int val = StackArray[NP同学 - 1]?.GetHeight() ?? 0;
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
            // Background
            g.FillRectangle(SystemBrushes.Control, 0, 0, AppletWidth, AppletHeight);

            // Note Box at Top
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font noteFont = new Font("Courier New", 10, FontStyle.Bold))
            {
                g.DrawString(Note, noteFont, textBrush, 16, 55);
            }

            // Draw all cells
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
                // Index label
                using (Font idxFont = new Font("Courier New", 9, FontStyle.Bold))
                using (Brush idxBrush = new SolidBrush(Color.Black))
                {
                    g.DrawString(i.ToString(), idxFont, idxBrush, cellX - 18, cellY + 2);
                }

                // Cell border
                g.DrawRectangle(Pens.Black, cellX, cellY, CellWidth, CellHeight);
            }

            // Cell content
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

            // Top arrow
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
}
