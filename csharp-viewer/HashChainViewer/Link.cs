using System;

namespace HashChainViewer
{
    /// <summary>
    /// يمثل عقدة في القائمة المترابطة (Link).
    /// </summary>
    public class Link
    {
        public Person PersData { get; set; }

        public Link(Person persData)
        {
            PersData = persData;
        }
    }
}
