using System;
using System.Drawing;

namespace GraphDWViewer
{
    /// <summary>
    /// Represents a single vertex in the directed weighted graph.
    /// Ported faithfully from Robert Lafore's vertex.class.
    /// </summary>
    public class Vertex
    {
        public static char ClassChar = 'A';

        public int X { get; set; }
        public int Y { get; set; }
        public char Label { get; set; }
        public Color VertexColor { get; set; }
        public bool IsInTree { get; set; }

        public Vertex(int x, int y)
        {
            X = x;
            Y = y;
            Label = ClassChar++;

            Random rnd = Random.Shared;
            int r = 100 + (int)(rnd.NextDouble() * 155);
            int g = 100 + (int)(rnd.NextDouble() * 155);
            int b = 100 + (int)(rnd.NextDouble() * 155);
            VertexColor = Color.FromArgb(r, g, b);
            IsInTree = false;
        }
    }
}
