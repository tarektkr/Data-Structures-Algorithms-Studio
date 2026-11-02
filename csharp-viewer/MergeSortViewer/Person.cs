using System;
using System.Drawing;

namespace MergeSortViewer
{
    /// <summary>
    /// يمثل عمود شخص (Person Bar) ذو ارتفاع ولون مخصص
    /// متطابق مع كلاس person.class الأصلي في كتاب روبرت لافور
    /// </summary>
    public class Person
    {
        public int Height { get; set; }
        public Color BarColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            BarColor = color;
        }

        public void Draw(Graphics g, int x, int y, int width, int height)
        {
            using var brush = new SolidBrush(BarColor);
            g.FillRectangle(brush, x, y, width, height);

            if (width >= 5)
            {
                using var lightPen = new Pen(Color.White, 1);
                using var darkPen = new Pen(Color.FromArgb(80, 80, 80), 1);

                g.DrawLine(lightPen, x, y + height, x, y);
                g.DrawLine(lightPen, x, y, x + width - 1, y);

                g.DrawLine(darkPen, x + width, y, x + width, y + height);
            }
        }
    }
}
