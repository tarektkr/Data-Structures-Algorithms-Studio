namespace GraphWViewer
{
    /// <summary>
    /// Represents an edge stored in the priority queue (edge.class)
    /// </summary>
    public class Edge
    {
        public int SrcVert { get; set; }
        public int DestVert { get; set; }
        public int Distance { get; set; }

        public Edge(int srcVert, int destVert, int distance)
        {
            SrcVert = srcVert;
            DestVert = destVert;
            Distance = distance;
        }
    }
}
