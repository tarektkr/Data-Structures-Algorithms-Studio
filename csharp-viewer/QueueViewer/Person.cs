using System.Drawing;

namespace QueueViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في الطابور (Queue)
    /// يتطابق تماماً مع person.class في بريمج روبرت لافور الأصلي
    /// </summary>
    public class Person
    {
        public int Height { get; set; }
        public Color ItemColor { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}
