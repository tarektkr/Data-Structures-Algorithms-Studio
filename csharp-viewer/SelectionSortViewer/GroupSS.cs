using System;
using System.Drawing;

namespace SelectionSortViewer
{
    /// <summary>
    /// فئة إدارة خوارزمية ترتيب الاختيار ورسم الأعمدة والمؤشرات
    /// تتطابق مع groupSS.class من أبليت روبرت لافور
    /// </summary>
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
        public int InitOrder { get; private set; } // 1: Random, 2: Inverse
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
}
