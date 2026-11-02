namespace GraphViewer
{
    /// <summary>
    /// Explicit Circular FIFO Queue for Breadth-First Search (BFS).
    /// </summary>
    public class QueueX
    {
        private readonly int _size;
        private readonly int[] _queArray;
        private int _front;
        private int _rear;

        public QueueX(int s = 20)
        {
            _size = s;
            _queArray = new int[_size];
            _front = 0;
            _rear = -1;
        }

        public void Insert(int j)
        {
            if (_rear == _size - 1)
                _rear = -1;
            _queArray[++_rear] = j;
        }

        public int Remove()
        {
            int temp = _queArray[_front++];
            if (_front == _size)
                _front = 0;
            return temp;
        }

        public bool IsEmpty()
        {
            return (_rear + 1 == _front || (_front + _size - 1 == _rear));
        }

        public int[] ToArray()
        {
            if (IsEmpty()) return System.Array.Empty<int>();
            var list = new System.Collections.Generic.List<int>();
            int idx = _front;
            while (true)
            {
                list.Add(_queArray[idx]);
                if (idx == _rear) break;
                idx = (idx + 1) % _size;
            }
            return list.ToArray();
        }
    }
}
