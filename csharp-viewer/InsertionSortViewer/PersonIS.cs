using System.Drawing;

namespace InsertionSortViewer
{
    public class PersonIS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonIS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}
