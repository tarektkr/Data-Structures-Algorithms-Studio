using System.Drawing;

namespace BubbleSortViewer
{
    /// <summary>
    /// يمثل عنصر البيانات (العمود الرأسي) في خوارزمية الترتيب الفقاعي
    /// يتطابق بدقة مع كلاس personBS.class من أبليت روبرت لافور
    /// </summary>
    public class PersonBS
    {
        public int Height { get; }
        public Color ItemColor { get; }

        public PersonBS(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public int GetHeight() => Height;
        public Color GetColor() => ItemColor;
    }
}
