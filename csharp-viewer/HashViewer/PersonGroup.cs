using System;
using System.Drawing;

namespace HashViewer
{
    /// <summary>
    /// PersonGroup manages the open-addressing Linear-Probe Hash Table.
    /// Reverse-engineered from Robert Lafore's Chapter 11 personGroup_f2c7777b.class.
    /// </summary>
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
        public int OpMode { get; set; } = 0; // 0=idle, 1=new, 2=fill, 3=ins, 4=find, 5=del
        public int CodePart { get; set; } = 1;
        public int CodePart2 { get; set; } = 1;
        public int CurIn { get; private set; } = -1;
        public int OldCurIn { get; private set; } = -1;
        public bool IsCollision { get; private set; } = false;

        private int insKey = 0;
        private int findKey = 0;
        private int delKey = 0;
        private int fillValue = 0;
        private int searchKey = 0;
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
            for (int i = 0; i < ASIZE; i++)
            {
                personArray[i] = null!;
            }
            NPersons = 0;
            // Seed initial items with ~25% load factor
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

        public Person? GetPerson(int index)
        {
            if (index < 0 || index >= TotalCells) return null;
            return personArray[index];
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

        // ================= Operations =================

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

        // ================= GDI+ Drawing =================

        public void Draw(Graphics g)
        {
            g.Clear(Color.FromArgb(240, 240, 240));

            // Draw Note Box
            using (var noteBrush = new SolidBrush(Color.White))
            using (var borderPen = new Pen(Color.FromArgb(128, 128, 128)))
            using (var font = new Font("Courier New", 9f, FontStyle.Bold))
            using (var textBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(noteBrush, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawRectangle(borderPen, LeftMargin, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
                g.DrawString(Note, font, textBrush, LeftMargin + 5, NoteBoxTop + 5);
            }

            // Draw Hash Table Cells (5 cols x 12 rows)
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

                    // Draw index
                    string indexStr = i.ToString().PadLeft(2, ' ');
                    g.DrawString(indexStr, indexFont, indexBrush, baseX, cellY + 2);

                    var p = personArray[i];
                    if (p == null)
                    {
                        // Empty cell
                        g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                    }
                    else if (p == delNode || p.Height == -1)
                    {
                        // Deleted cell (*Del*)
                        g.FillRectangle(grayBrush, cellX, cellY, CellWidth, CellHeight);
                        g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                        using (var delBrush = new SolidBrush(Color.FromArgb(160, 40, 40)))
                        {
                            g.DrawString("*Del*", font, delBrush, cellX + 3, cellY + 2);
                        }
                    }
                    else
                    {
                        // Occupied cell
                        using (var cellBrush = new SolidBrush(p.Color))
                        using (var textBrush = new SolidBrush(Color.Black))
                        {
                            g.FillRectangle(cellBrush, cellX, cellY, CellWidth, CellHeight);
                            g.DrawRectangle(blackPen, cellX, cellY, CellWidth, CellHeight);
                            string keyStr = p.Height.ToString();
                            g.DrawString(keyStr, font, textBrush, cellX + 4, cellY + 2);
                        }
                    }

                    // Pointer Arrow (Red horizontal arrow pointing left into active cell)
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
}
