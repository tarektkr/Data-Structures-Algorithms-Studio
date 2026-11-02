namespace GraphDWViewer
{
    /// <summary>
    /// Represents an entry in the shortest-path array (sPath).
    /// Stores the parent vertex and current total distance from start vertex.
    /// Ported faithfully from Robert Lafore's disP.class.
    /// </summary>
    public class DisP
    {
        public int ParentVert { get; set; }
        public int Distance { get; set; }

        public DisP(int parentVert, int distance)
        {
            ParentVert = parentVert;
            Distance = distance;
        }
    }
}
