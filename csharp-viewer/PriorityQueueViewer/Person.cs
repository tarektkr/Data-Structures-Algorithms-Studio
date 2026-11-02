using System.Drawing;

namespace PriorityQueueViewer
{
    /// <summary>
    /// فئة العنصر المخزن داخل طابور الأولوية (يمثل الشخص/العنصر بمفتاحه ولونه)
    /// متطابقة مع person.class في بريمج روبرت لافور
    /// </summary>
    public class Person
    {
        public int Height { get; set; }
        public Color Color { get; set; }

        public Person(int height, Color color)
        {
            Height = height;
            Color = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => Color;
    }
}
