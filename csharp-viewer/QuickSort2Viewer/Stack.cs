using System;

namespace QuickSort2Viewer
{
    /// <summary>
    /// مكدس LIFO صريح لتخزين حدود المصفوفات الجزئية أثناء الترتيب السريع العودي
    /// متطابق مع stack.class
    /// </summary>
    public class Stack
    {
        private readonly int[] stackArray;
        private int top;

        public Stack(int max)
        {
            stackArray = new int[max];
            top = -1;
        }

        public void Push(int j)
        {
            stackArray[++top] = j;
        }

        public int Pop()
        {
            return stackArray[top--];
        }

        public bool IsEmpty()
        {
            return top == -1;
        }

        public int Count => top + 1;
    }
}
