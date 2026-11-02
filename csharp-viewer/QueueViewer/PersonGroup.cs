using System;
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

        private void DrawArrow(Graphics g, int shaftLength, int startX, int centerY)
        {
            int endX = startX - shaftLength; // Points left toward cell
            g.DrawLine(Pens.Black, startX, centerY, endX, centerY);
            g.DrawLine(Pens.Black, startX, centerY + 1, endX, centerY + 1);

            // Arrow head
            g.DrawLine(Pens.Black, endX, centerY, endX + 5, centerY - 5);
            g.DrawLine(Pens.Black, endX, centerY, endX + 5, centerY + 5);
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
}
