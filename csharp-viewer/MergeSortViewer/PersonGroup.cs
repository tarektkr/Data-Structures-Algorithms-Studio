using System;
using System.Drawing;

namespace MergeSortViewer
{
    /// <summary>
    /// محرك خوارزمية الترتيب بالدمج (Merge Sort)
    /// مستخرج بدقة من بايت كود جافا personGroup_6d26aa9c.class
    /// </summary>
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
        private int initOrder; // 1: Random, 2: Inverse
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
        public int CodePart => codePart;

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

            // Stats
            using (var textBrush = new SolidBrush(Color.Black))
            using (var font = new Font("Courier New", 9, FontStyle.Bold))
            {
                g.DrawString($"Comparisons = {comps}", font, textBrush, 10, 8);
                g.DrawString($"Copies = {copies}", font, textBrush, 10, 22);
            }

            // Note Box
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

            // Draw Bars
            for (int i = 0; i < aSize; i++)
            {
                int x = barLeftMargin + i * (barWidth + barSeparation);
                int h = theArray[i].Height;
                int y = BaselineY - h;
                theArray[i].Draw(g, x, y, barWidth, h);
            }

            // Horizontal Subarray Line
            if (lower >= 0 && upper >= lower && upper < aSize)
            {
                int x1 = barLeftMargin + lower * (barWidth + barSeparation);
                int x2 = barLeftMargin + upper * (barWidth + barSeparation) + barWidth;
                using var linePen = new Pen(Color.Black, 2);
                g.DrawLine(linePen, x1, BaselineY + 2, x2, BaselineY + 2);
            }

            // Pointer Arrows
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
}
