namespace GraphViewer
{
    /// <summary>
    /// Explicit Stack for Depth-First Search (DFS) and Minimum Spanning Tree (MST).
    /// </summary>
    public class StackX
    {
        private readonly int[] _st;
        private int _top;

        public StackX(int max = 20)
        {
            _st = new int[max];
            _top = -1;
        }

        public void Push(int val)
        {
            _st[++_top] = val;
        }

        public int Pop()
        {
            return _st[_top--];
        }

        public int Peek()
        {
            return _st[_top];
        }

        public bool IsEmpty()
        {
            return _top == -1;
        }

        public int Count => _top + 1;

        public int[] ToArray()
        {
            var arr = new int[_top + 1];
            for (int i = 0; i <= _top; i++)
            {
                arr[i] = _st[i];
            }
            return arr;
        }
    }
}
