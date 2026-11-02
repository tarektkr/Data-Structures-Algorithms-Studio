namespace QuickSort1Viewer;

/// <summary>
/// Direct translation of Robert Lafore's stack.class
/// Used by personGroup to store partition subarray boundaries (left and right) explicitly.
/// </summary>
public class Stack
{
    private readonly int[] _st;
    private int _top;

    public Stack(int max = 50)
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

    public bool IsEmpty()
    {
        return _top == -1;
    }
}
