using System;
using System.Drawing;

namespace QuickSort2Viewer
{
    /// <summary>
    /// محرك خوارزمية الترتيب السريع 2 بمبدأ وسيط الثلاثة (Median-of-Three Partitioning)
    /// مستخرج بدقة من بايت كود جافا personGroup_cc1bc240.class
    /// </summary>
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
        private int initOrder; // 1: Random, 2: Inverse

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

            // Stats
            using (var textBrush = new SolidBrush(Color.Black))
            using (var font = new Font("Courier New", 9, FontStyle.Bold))
            {
                g.DrawString($"Swaps = {swaps}", font, textBrush, 10, 8);
                g.DrawString($"Comparisons = {comps}", font, textBrush, 10, 22);
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

            // Horizontal Partition Line
            if (left >= 0 && right >= left && right < aSize)
            {
                int x1 = barLeftMargin + left * (barWidth + barSeparation);
                int x2 = barLeftMargin + right * (barWidth + barSeparation) + barWidth;
                using var linePen = new Pen(Color.Black, 2);
                g.DrawLine(linePen, x1, BaselineY + 2, x2, BaselineY + 2);
            }

            // Pointer Arrows
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
}
