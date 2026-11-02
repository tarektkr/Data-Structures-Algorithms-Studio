using System;

namespace TowersViewer
{
    /// <summary>
    /// Represents an activation frame stored in the call stack for the recursive doTowers method.
    /// Equivalent to params.class in Robert Lafore's applet.
    /// </summary>
    public class Params
    {
        public int N { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public int Inter { get; set; }
        public int CodePart { get; set; }

        public Params(int n, int from, int to, int inter, int codePart)
        {
            N = n;
            From = from;
            To = to;
            Inter = inter;
            CodePart = codePart;
        }

        public override string ToString()
        {
            char f = (char)('A' + From);
            char t = (char)('A' + To);
            char i = (char)('A' + Inter);
            return $"doTowers(n={N}, from={f}, to={t}, inter={i}, returnTo={CodePart})";
        }
    }

    /// <summary>
    /// Explicit stack simulating the runtime method call stack.
    /// Equivalent to stack.class in Robert Lafore's applet.
    /// </summary>
    public class CallStack
    {
        private readonly Params[] stackArray;
        public int Top { get; private set; }
        public int MaxSize { get; }

        public CallStack(int maxSize)
        {
            MaxSize = maxSize;
            stackArray = new Params[maxSize];
            Top = -1;
        }

        public void Push(Params p)
        {
            stackArray[++Top] = p;
        }

        public Params Pop()
        {
            return stackArray[Top--];
        }

        public Params Peek()
        {
            return stackArray[Top];
        }

        public bool IsEmpty() => Top < 0;

        public bool IsFull() => Top == MaxSize - 1;

        public int Count => Top + 1;

        public Params? GetAt(int index)
        {
            if (index >= 0 && index <= Top)
                return stackArray[index];
            return null;
        }
    }
}
