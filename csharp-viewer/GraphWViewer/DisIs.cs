namespace GraphWViewer
{
    /// <summary>
    /// Represents an edge distance and its tree membership flag in the adjacency matrix (disIs.class)
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
