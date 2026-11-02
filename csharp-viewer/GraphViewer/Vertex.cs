using System.Drawing;

namespace GraphViewer
{
    /// <summary>
    /// Represents a graph vertex (A-M) with coordinates, visit flag, and display color.
    /// Replicated from Robert Lafore's Java Data Structures & Algorithms (Chapter 13).
    /// </summary>
    public class Vertex
    {
        public static char ClassChar = 'A';

        public int X { get; set; }
        public int Y { get; set; }
        public char Label { get; set; }
        public Color Color { get; set; }
        public bool WasVisited { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y)
        {
            X = x;
            Y = y;
            Label = ClassChar++;
            Color = Color.LightSkyBlue;
            WasVisited = false;
            IsInTree = false;
        }

        public Vertex(int x, int y, char label, Color color)
        {
            X = x;
            Y = y;
            Label = label;
            Color = color;
            WasVisited = false;
            IsInTree = false;
        }
    }
}
