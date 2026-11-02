using System;

namespace MergeSortViewer
{
    /// <summary>
    /// مكدس LIFO صريح لتخزين إطارات استدعاء params أثناء التقسيم والدمج العودي
    /// متطابق مع stack.class
    /// </summary>
    public class Stack
    {
        private readonly Params[] stackArray;
        private int top;

        public Stack(int max)
        {
            stackArray = new Params[max];
            top = -1;
        }

        public void Push(Params p)
        {
            stackArray[++top] = p;
        }

        public Params Pop()
        {
            return stackArray[top--];
        }

        public Params Peek()
        {
            return stackArray[top];
        }

        public bool IsEmpty()
        {
            return top == -1;
        }

        public int Count => top + 1;
    }
}
