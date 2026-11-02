using System;

namespace HashChainViewer
{
    /// <summary>
    /// يمثل دلاء أو خلايا جدول التجزئة (Bucket)، ويحتوي على قائمة مترابطة تستوعب حتى 6 عناصر.
    /// </summary>
    public class Bucket
    {
        public const int MAX_LINKS = 6;
        public Link?[] LinkArray { get; }
        public int NLinks { get; set; }

        public Bucket()
        {
            LinkArray = new Link?[MAX_LINKS];
            NLinks = 0;
        }
    }
}
