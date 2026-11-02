using System.Drawing;

namespace LinkListViewer
{
    /// <summary>
    /// كائن البيانات المخزن داخل كل عقدة (Link) في القائمة المترابطة
    /// يطابق person.class في بريمج روبرت لافور
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
