using System;
using System.Drawing;

namespace HashChainViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في عقد السلاسل المترابطة (Data Item).
    /// يحمل المفتاح الرقمي ولون العرض العشوائي.
    /// </summary>
    public class Person
    {
        public int Height { get; }
        public Color Color { get; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}
