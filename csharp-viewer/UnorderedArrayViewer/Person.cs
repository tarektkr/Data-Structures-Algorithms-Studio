using System.Drawing;

namespace UnorderedArrayViewer
{
    /// <summary>
    /// يمثل عنصر البيانات المخزن في المصفوفة غير المرتبة (Person / Item)
    /// يحتوي على القيمة العددية (Key / Height) ولون العرض الخاص به.
    /// Replicates the original person.class from Robert Lafore's Java Workshop Applet.
    /// </summary>
    public class Person
    {
        /// <summary>
        /// القيمة العددية للعنصر (مفتاح البحث / الارتفاع) بين 0 و 999
        /// </summary>
        public int Height { get; }

        /// <summary>
        /// لون العنصر في واجهة الرسم GDI+
        /// </summary>
        public Color ItemColor { get; }

        /// <summary>
        /// منشئ كائن العنصر
        /// </summary>
        /// <param name="height">القيمة العددية</param>
        /// <param name="color">اللون</param>
        public Person(int height, Color color)
        {
            Height = height;
            ItemColor = color;
        }

        public override string ToString()
        {
            return Height.ToString();
        }
    }
}
