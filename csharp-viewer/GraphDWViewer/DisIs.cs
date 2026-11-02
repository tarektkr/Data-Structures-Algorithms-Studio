namespace GraphDWViewer
{
    /// <summary>
    /// Represents an edge entry in the adjacency matrix (adjMat).
    /// Stores the edge distance/weight and whether this edge is part of the shortest-path tree.
    /// Ported faithfully from Robert Lafore's disIs.class.
    /// </summary>
    public class DisIs
    {
        public int Distance { get; set; }
        public bool IsInTree { get; set; }

        public DisIs(int distance, bool isInTree)
        {
            Distance = distance;
            IsInTree = isInTree;
        }
    }
}
