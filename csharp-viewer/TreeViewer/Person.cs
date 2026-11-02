using System.Drawing;

namespace TreeViewer
{
    /// <summary>
    /// Represents a person node in the binary tree storing the key height and display color.
    /// Exactly matches Robert Lafore's person.class.
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
