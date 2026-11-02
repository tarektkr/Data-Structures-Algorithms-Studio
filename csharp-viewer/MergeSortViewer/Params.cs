using System;

namespace MergeSortViewer
{
    /// <summary>
    /// إطار تفعيل الاستدعاء العودي لخوارزمية الترتيب بالدمج
    /// متطابق مع كلاس params.class الأصلي
    /// </summary>
    public class Params
    {
        public int Lower { get; set; }
        public int Upper { get; set; }
        public int Mid { get; set; }
        public int CodePart { get; set; } // عنوان العودة في آلة الحالة

        public Params(int lower, int upper, int mid, int codePart)
        {
            Lower = lower;
            Upper = upper;
            Mid = mid;
            CodePart = codePart;
        }
    }
}
