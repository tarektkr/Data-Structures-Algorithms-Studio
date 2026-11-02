using System;
using System.Drawing;

namespace BubbleSortViewer
{
    /// <summary>
    /// فئة إدارة وتمثيل خوارزمية الترتيب الفقاعي ورسم الأعمدة والمؤشرات
    /// تتطابق تماماً مع groupBS.class من أبليت روبرت لافور
    /// </summary>
    public class GroupBS
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
        public PersonBS?[] TheArray { get; private set; }
        public int BarWidth { get; private set; }
        public int BarSeparation { get; private set; }
        public int Outer { get; private set; }
        public int Inner { get; private set; }
        public int InnerOld { get; private set; }
        public bool SwapFlag { get; private set; }
        public bool DoneFlag { get; private set; }
        public int Comps { get; private set; }
        public int Swaps { get; private set; }
        public int InitOrder { get; private set; } // 1: Random, 2: Inverse
        public int DrawMode { get; set; } = 2; // 1: partial update, 2: full redraw

        private static readonly Random Rng = new Random();

        public GroupBS(int size, int order)
        {
            ASize = size;
            InitOrder = order;
            TheArray = new PersonBS[ASize];

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

            Outer = ASize - 1;
            Inner = 0;
            InnerOld = 0;
            Comps = 0;
            Swaps = 0;
            SwapFlag = false;
            DoneFlag = false;
            DrawMode = 2;

            InitializeData();
        }

        private void InitializeData()
        {
            if (InitOrder == 1)
            {
                // ترتيب عشوائي (Random Order)
                for (int i = 0; i < ASize; i++)
                {
                    int height = (int)(Rng.NextDouble() * 199.0) + 1;
                    int r = (int)(Rng.NextDouble() * 254.0);
                    int g = (int)(Rng.NextDouble() * 254.0);
                    int b = (int)(Rng.NextDouble() * 254.0);
                    TheArray[i] = new PersonBS(height, Color.FromArgb(r, g, b));
                }
            }
            else
            {
                // ترتيب معكوس تنازلي (Inverse Order)
                for (int i = 0; i < ASize; i++)
                {
                    int height = Math.Max(1, 199 - (199 * i) / ASize);
                    int r = Math.Min(255, Math.Max(0, 255 - height));
                    int g = (85 * (i % 3)) % 256;
                    int b = height % 256;
                    TheArray[i] = new PersonBS(height, Color.FromArgb(r, g, b));
                }
            }
        }

        public bool SortStep()
        {
            if (DoneFlag) return false;

            Comps++;

            if (TheArray[Inner] != null && TheArray[Inner + 1] != null &&
                TheArray[Inner]!.Height > TheArray[Inner + 1]!.Height)
            {
                Swap(Inner, Inner + 1);
                SwapFlag = true;
                Swaps++;
            }
            else
            {
                SwapFlag = false;
            }

            InnerOld = Inner;
            Inner++;

            if (Inner > Outer - 1)
            {
                Inner = 0;
                Outer--;
                if (Outer <= 0)
                {
                    DoneFlag = true;
                }
            }

            return !DoneFlag;
        }

        public void Swap(int one, int two)
        {
            PersonBS? temp = TheArray[one];
            TheArray[one] = TheArray[two];
            TheArray[two] = temp;
        }

        public void Draw(Graphics g)
        {
            // خلفية الشاشة باللون الرمادي الكلاسيكي
            using (SolidBrush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            // عدادات المقارنات والتبديلات بالأعلى
            using (Font statFont = new Font("SansSerif", 9f, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.Black))
            {
                g.DrawString($"Swaps = {Swaps}", statFont, textBrush, 10, 15);
                g.DrawString($"Comparisons = {Comps}", statFont, textBrush, 10, 30);
            }

            // رسم خط القاعدة للأعمدة
            using (Pen basePen = new Pen(Color.Gray))
            {
                g.DrawLine(basePen, BarLeftMargin - 5, BarBaseY, AppletWidth - 20, BarBaseY);
            }

            // رسم جميع الأعمدة
            for (int i = 0; i < ASize; i++)
            {
                DrawOneBar(g, i);
            }

            // رسم المؤشرات والأسهم تحت الأعمدة
            if (ASize == 10)
            {
                ArrowText(g, Color.Red, "outer", Outer, 6, true, true);
                ArrowText(g, Color.Blue, "inner", Inner, 4, true, true);
                if (Inner + 1 < ASize)
                {
                    ArrowText(g, Color.Blue, "inner+1", Inner + 1, 4, true, true);
                }

                // نص القرار في الأسفل
                if (DoneFlag)
                {
                    using (Font completeFont = new Font("SansSerif", 10f, FontStyle.Bold))
                    using (SolidBrush completeBrush = new SolidBrush(Color.Black))
                    {
                        g.DrawString("Sort is complete", completeFont, completeBrush, (AppletWidth / 2) - 50, BarBaseY + 45);
                    }
                }
                else if (Inner < ASize - 1 && TheArray[Inner] != null && TheArray[Inner + 1] != null)
                {
                    string msg = TheArray[Inner]!.Height > TheArray[Inner + 1]!.Height
                        ? "Will be swapped"
                        : "Will not be swapped";

                    using (Font msgFont = new Font("SansSerif", 9f, FontStyle.Bold))
                    using (SolidBrush msgBrush = new SolidBrush(Color.Blue))
                    {
                        g.DrawString(msg, msgFont, msgBrush, (AppletWidth / 2) - 60, BarBaseY + 45);
                    }
                }
            }
            else
            {
                // عندما يكون الحجم 100
                ArrowText(g, Color.Red, "", Outer, 6, true, false);
                ArrowText(g, Color.Blue, "", Inner, 4, true, false);
            }
        }

        public void DrawOneBar(Graphics g, int index)
        {
            if (index < 0 || index >= ASize || TheArray[index] == null) return;

            PersonBS p = TheArray[index]!;
            int barX = BarLeftMargin + index * (BarWidth + BarSeparation);
            int barY = BarBaseY - p.Height;

            using (SolidBrush barBrush = new SolidBrush(p.ItemColor))
            {
                g.FillRectangle(barBrush, barX, barY, BarWidth, p.Height);
            }

            // تأثير الأبعاد الثلاثية 3D Bevel
            using (Pen lightPen = new Pen(Color.White))
            using (Pen darkPen = new Pen(Color.DarkGray))
            {
                g.DrawLine(lightPen, barX, barY + p.Height, barX, barY);
                g.DrawLine(lightPen, barX, barY, barX + BarWidth, barY);

                g.DrawLine(darkPen, barX + BarWidth, barY, barX + BarWidth, barY + p.Height);
            }

            // كتابة القيمة العددية فوق العمود إذا كان الحجم 10
            if (ASize == 10)
            {
                using (Font numFont = new Font("SansSerif", 7f, FontStyle.Bold))
                using (SolidBrush numBrush = new SolidBrush(Color.Black))
                {
                    string valStr = p.Height.ToString();
                    g.DrawString(valStr, numFont, numBrush, barX - 1, barY - 12);
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
                    // خط السهم يشير للأعلى نحو العمود
                    g.DrawLine(p, x, arrowBaseY + 14, x, arrowBaseY + 3);

                    // رأس السهم
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
