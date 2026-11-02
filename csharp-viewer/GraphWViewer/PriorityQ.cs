using System.Collections.Generic;

namespace GraphWViewer
{
    /// <summary>
    /// Priority queue of edges ordered by distance in descending order
    /// so the minimum element is at the end (O(1) removeMin via pop)
    /// (Robert Lafore - priorityQ.class)
    /// </summary>
    public class PriorityQ
    {
        public const int SIZE = 20;
        private readonly List<Edge> _queArray = new List<Edge>();

        public void Insert(Edge item)
        {
            int j;
            for (j = 0; j < _queArray.Count; j++)
            {
                if (item.Distance >= _queArray[j].Distance)
                {
                    break;
                }
            }
            _queArray.Insert(j, item);
        }

        public Edge RemoveMin()
        {
            if (_queArray.Count == 0) return null!;
            var min = _queArray[_queArray.Count - 1];
            _queArray.RemoveAt(_queArray.Count - 1);
            return min;
        }

        public void RemoveN(int n)
        {
            if (n >= 0 && n < _queArray.Count)
            {
                _queArray.RemoveAt(n);
            }
        }

        public Edge PeekMin()
        {
            return _queArray.Count > 0 ? _queArray[_queArray.Count - 1] : null!;
        }

        public Edge PeekN(int n)
        {
            return (n >= 0 && n < _queArray.Count) ? _queArray[n] : null!;
        }

        public int Size() => _queArray.Count;

        public bool IsEmpty() => _queArray.Count == 0;

        public int Find(int findDex)
        {
            for (int j = 0; j < _queArray.Count; j++)
            {
                if (_queArray[j].DestVert == findDex)
                {
                    return j;
                }
            }
            return -1;
        }

        public IReadOnlyList<Edge> ToList() => _queArray.AsReadOnly();
    }
}
