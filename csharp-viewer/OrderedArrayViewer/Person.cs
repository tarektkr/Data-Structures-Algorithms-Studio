using System.Drawing;

namespace OrderedArrayViewer
{
    public class Person
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public override string ToString() => Height.ToString();
    }
}
