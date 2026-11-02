using System;

namespace TreeViewer
{
    /// <summary>
    /// Explicit LIFO stack for integer node indexes used during inorder traversal.
    /// Exactly matches Robert Lafore's stack.class.
    /// </summary>
    public class Stack
    {
        private readonly int[] st;
        private int top;

        public Stack()
        {
            st = new int[20];
            top = -1;
        }

        public void Push(int val)
        {
            st[++top] = val;
        }

        public int Pop()
        {
            return st[top--];
        }

        public bool IsEmpty()
        {
            return top == -1;
        }

        public int Count => top + 1;
    }
}
