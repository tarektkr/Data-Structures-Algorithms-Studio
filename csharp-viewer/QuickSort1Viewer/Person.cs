using System.Drawing;

namespace QuickSort1Viewer;

/// <summary>
/// Direct translation of Robert Lafore's person.class (Chapter 8: Advanced Sorting)
/// Represents a bar element with height and display color.
/// </summary>
public class Person
{
    public int Height { get; set; }
    public Color Color { get; set; }

    public Person(int height, Color color)
    {
        Height = height;
        Color = color;
    }

    public int GetHeight() => Height;
    public Color GetColor() => Color;
}
