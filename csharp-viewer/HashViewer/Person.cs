using System.Drawing;

namespace HashViewer
{
    /// <summary>
    /// Represents an item in the hash table storing the key height and display color.
    /// A height of -1 represents the deleted sentinel item (*Del*).
    /// Exactly matches Robert Lafore's person.class in Chapter 11.
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
