using System.Drawing;

namespace GraphWViewer
{
    /// <summary>
    /// Represents a graph vertex (Robert Lafore - vertex.class)
    /// </summary>
    public class Vertex
    {
        public char Label { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public Color Color { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y, char label, Color color)
        {
            X = x;
            Y = y;
            Label = label;
            Color = color;
            IsInTree = false;
        }
    }
}
