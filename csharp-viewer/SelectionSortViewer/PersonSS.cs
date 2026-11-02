using System.Drawing;

namespace SelectionSortViewer
{
    /// <summary>
    /// يمثل عنصر البيانات (العمود الرأسي) في خوارزمية ترتيب الاختيار (Selection Sort)
    /// يتطابق تماماً مع personSS.class من أبليت روبرت لافور
    /// </summary>
    public class PersonSS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonSS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}
