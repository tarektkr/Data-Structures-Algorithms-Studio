using System;
using System.Drawing;

namespace InsertionSortViewer
{
    public class GroupIS
    {
        public const int AppletWidth = 370;
        public const int AppletHeight = 320;
        public const int MaxHeight = 200;
        public const int TopMargin = 30;
        public const int LeftMargin = 10;
        public const int BarLeftMargin = 20;
        public const int TextHeight = 13;
        public const int BarBaseY = 230;

        public int ASize { get; private set; }
        public PersonIS?[] TheArray { get; private set; }
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int Outer { get; private set; }
        public int Inner { get; private set; }
        public int OuterOld { get; private set; }
        public int InnerOld { get; private set; }
        public bool DoneFlag { get; private set; }
        public int CodePart { get; private set; }
        public int Comps { get; private set; }
        public int Copies { get; private set; }
        public int InitOrder { get; private set; }
        public int DrawMode { get; set; } = 2;

        private static readonly Random Rng = new Random();

        public GroupIS(int size, int order)
        {
            ASize = size;
            InitOrder = order;
            TheArray = new PersonIS[ASize + 1]; // Extra slot at ASize for temp

            if (ASize == 100)
            {
                BarWidth = 2;
                BarSeparation = 1;
            }
            else
            {
                BarWidth = 18;
                BarSeparation = 8;
            }

            Outer = 1;
            Inner = 1;
            OuterOld = 0;
            InnerOld = 0;
            DoneFlag = false;
            CodePart = 1;
            Comps = 0;
            Copies = 0;
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
                    TheArray[i] = new PersonIS(height, Color.FromArgb(r, g, b));
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
                    TheArray[i] = new PersonIS(height, Color.FromArgb(r, g, b));
                }
            }
            TheArray[ASize] = null; // Temp slot
        }

        public bool SortStep()
        {
            if (DoneFlag) return false;

            if (CodePart == 1)
            {
                TheArray[ASize] = TheArray[Outer];
                TheArray[Outer] = null;
                Copies++;
                InnerOld = Inner;
                Inner = Outer;
                CodePart = 2;
            }
            else if (CodePart == 2)
            {
                Comps++;
                if (Inner > 0 && TheArray[Inner - 1] != null && TheArray[ASize] != null &&
                    TheArray[Inner - 1]!.Height >= TheArray[ASize]!.Height)
                {
                    TheArray[Inner] = TheArray[Inner - 1];
                    TheArray[Inner - 1] = null;
                    Copies++;
                    InnerOld = Inner;
                    Inner--;
                }
                else
                {
                    CodePart = 3;
                }
            }
            else if (CodePart == 3)
            {
                TheArray[Inner] = TheArray[ASize];
                TheArray[ASize] = null;
                Copies++;
                OuterOld = Outer;
                Outer++;

                if (Outer >= ASize)
                {
                    DoneFlag = true;
                }
                else
                {
                    CodePart = 1;
                }
            }

            return !DoneFlag;
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
                g.DrawString($"Copies = {Copies}", statFont, textBrush, 10, 15);
                g.DrawString($"Comparisons = {Comps}", statFont, textBrush, 10, 30);
            }

            using (Pen basePen = new Pen(Color.Gray))
            {
                g.DrawLine(basePen, BarLeftMargin - 5, BarBaseY, AppletWidth - 15, BarBaseY);
            }

            for (int i = 0; i < ASize; i++)
            {
                DrawOneBar(g, i);
            }

            // Draw Temp Bar
            int tempX = AppletWidth - (ASize == 10 ? 45 : 30);
            using (Font labelFont = new Font("SansSerif", 8f, FontStyle.Bold))
            using (SolidBrush b = new SolidBrush(Color.Black))
            {
                g.DrawString("temp", labelFont, b, tempX - 2, BarBaseY + 5);
            }

            if (TheArray[ASize] != null)
            {
                PersonIS p = TheArray[ASize]!;
                int tempY = BarBaseY - p.Height;
                using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
                {
                    g.FillRectangle(barBrush, tempX, tempY, BarWidth, p.Height);
                }
            }

            if (ASize == 10)
            {
                ArrowText(g, Color.Red, "outer", Outer, 4, true, true);
                ArrowText(g, Color.Blue, "inner", Inner, 5, true, true);

                using (Font msgFont = new Font("SansSerif", 9f, FontStyle.Bold))
                using (SolidBrush msgBrush = new SolidBrush(Color.Black))
                {
                    string msg = DoneFlag ? "Sort is complete" :
                                 CodePart == 1 ? "Will copy outer to temp" :
                                 CodePart == 2 ? "Have compared inner-1 & temp" : "Will copy temp to inner";
                    g.DrawString(msg, msgFont, msgBrush, (AppletWidth / 2) - 70, BarBaseY + 45);
                }
            }
            else
            {
                ArrowText(g, Color.Red, "", Outer, 4, true, false);
                ArrowText(g, Color.Blue, "", Inner, 5, true, false);
            }
        }

        public void DrawOneBar(Graphics g, int index)
        {
            if (index < 0 || index >= ASize) return;

            int barX = BarLeftMargin + index * (BarWidth + BarSeparation);
            if (TheArray[index] != null)
            {
                PersonIS p = TheArray[index]!;
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
