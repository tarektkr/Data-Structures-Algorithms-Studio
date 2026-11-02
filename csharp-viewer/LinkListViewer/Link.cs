namespace LinkListViewer
{
    /// <summary>
    /// كائن العقدة (Link Node) في القائمة المترابطة
    /// يطابق link.class في بريمج روبرت لافور
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
