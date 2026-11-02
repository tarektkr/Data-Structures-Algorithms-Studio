using System;
using System.Drawing;

namespace HashChainViewer
{
    /// <summary>
    /// المحرك المنطقي وجدول الهاش بالسلاسل المنفصلة (Separate-Chaining Hash Table).
    /// يطابق كلاس personGroup الأصلي لروبرت لافور في الفصل 11.
    /// </summary>
    public class PersonGroup
    {
        public enum OperationMode
        {
            Idle = 0,
            New = 1,
            Fill = 2,
            Ins = 3,
            Find = 4,
            Del = 5
        }

        public const int MAX_BUCKETS = 100;
        public const int MAX_KEY = 999;
        public const int LINES_IN_VIEW = 10;

        public Bucket[] BucketArray { get; private set; }
        public int TotalBuckets { get; private set; }
        public int NPersons { get; private set; }
        public Person? TempPers { get; private set; }
        public string Note { get; private set; }

        public int FillValue { get; private set; }
        public int InsKey { get; private set; }
        public int FindKey { get; private set; }
        public int DelKey { get; private set; }
        public int CodePart { get; private set; }
        public OperationMode OpMode { get; private set; }
        public int CurList { get; private set; }
        public int CurLink { get; private set; }
        public int OldCurList { get; private set; }
        public int OldCurLink { get; private set; }
        public int DrawMode { get; private set; }
        public int TopDisplayLine { get; set; }

        private readonly Random random = new Random();

        public PersonGroup(int initialBuckets = 25)
        {
            TotalBuckets = initialBuckets;
            BucketArray = new Bucket[TotalBuckets];
            for (int i = 0; i < TotalBuckets; i++)
            {
                BucketArray[i] = new Bucket();
            }

            NPersons = 0;
            Note = "Press any button";
            CodePart = 1;
            OpMode = OperationMode.Idle;
            CurList = 0;
            CurLink = 0;
            OldCurList = -1;
            OldCurLink = -1;
            DrawMode = 2;
            TopDisplayLine = 0;

            DoFill(25);
        }

        public int HashFunction(int key)
        {
            if (TotalBuckets <= 0) return 0;
            return ((key % TotalBuckets) + TotalBuckets) % TotalBuckets;
        }

        public Person MakePerson(int height)
        {
            int r = random.Next(100, 256);
            int g = random.Next(100, 256);
            int b = random.Next(100, 256);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill(int count)
        {
            int filled = 0;
            for (int attempt = 0; attempt < 500 && filled < count; attempt++)
            {
                int key = random.Next(0, 1000);
                int list = HashFunction(key);
                var bucket = BucketArray[list];
                if (bucket.NLinks < Bucket.MAX_LINKS)
                {
                    for (int k = bucket.NLinks; k > 0; k--)
                    {
                        bucket.LinkArray[k] = bucket.LinkArray[k - 1];
                    }
                    bucket.LinkArray[0] = new Link(MakePerson(key));
                    bucket.NLinks++;
                    filled++;
                }
            }
            NPersons = filled;
        }

        public void StartNew(bool isNum, int val)
        {
            OpMode = OperationMode.New;
            CodePart = 1;
            Note = "Enter number of linked lists in array: ";
            FillValue = isNum ? val : 25;
        }

        public void StartFill(bool isNum, int val)
        {
            OpMode = OperationMode.Fill;
            CodePart = 1;
            Note = "Enter number of items to fill in";
            FillValue = isNum ? val : 25;
        }

        public void StartInsert(bool isNum, int val)
        {
            OpMode = OperationMode.Ins;
            CodePart = 1;
            Note = "Enter key of item to insert";
            InsKey = isNum ? val : 42;
        }

        public void StartFind(bool isNum, int val)
        {
            OpMode = OperationMode.Find;
            CodePart = 1;
            Note = "Enter key of item to find";
            FindKey = isNum ? val : 42;
        }

        public void StartDelete(bool isNum, int val)
        {
            OpMode = OperationMode.Del;
            CodePart = 1;
            Note = "Enter key of item to delete";
            DelKey = isNum ? val : 42;
        }

        public bool Step()
        {
            if (OpMode == OperationMode.Idle) return false;

            if (OpMode == OperationMode.New)
            {
                if (CodePart == 1)
                {
                    if (FillValue <= 0 || FillValue > MAX_BUCKETS)
                    {
                        Note = $"ERROR: use size between 0 and {MAX_BUCKETS}";
                        OpMode = OperationMode.Idle;
                        return false;
                    }
                    Note = $"Will create empty table with {FillValue} lists";
                    CodePart = 2;
                    return true;
                }
                else if (CodePart == 2)
                {
                    TotalBuckets = FillValue;
                    BucketArray = new Bucket[TotalBuckets];
                    for (int i = 0; i < TotalBuckets; i++)
                    {
                        BucketArray[i] = new Bucket();
                    }
                    NPersons = 0;
                    CurList = 0;
                    CurLink = 0;
                    TopDisplayLine = 0;
                    Note = "New table created; total items = 0";
                    CodePart = 3;
                    return true;
                }
                else
                {
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = OperationMode.Idle;
                    return false;
                }
            }

            if (OpMode == OperationMode.Fill)
            {
                if (CodePart == 1)
                {
                    int maxFill = TotalBuckets * Bucket.MAX_LINKS;
                    if (FillValue < 0 || FillValue > maxFill)
                    {
                        Note = $"ERROR: can't fill more than {maxFill} items";
                        OpMode = OperationMode.Idle;
                        return false;
                    }
                    Note = $"Will fill in {FillValue} items";
                    CodePart = 2;
                    return true;
                }
                else if (CodePart == 2)
                {
                    for (int i = 0; i < TotalBuckets; i++)
                    {
                        BucketArray[i] = new Bucket();
                    }
                    DoFill(FillValue);
                    CurList = 0;
                    CurLink = 0;
                    TopDisplayLine = 0;
                    Note = $"Fill completed; total items = {NPersons}";
                    CodePart = 3;
                    return true;
                }
                else
                {
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = OperationMode.Idle;
                    return false;
                }
            }

            if (OpMode == OperationMode.Ins)
            {
                if (CodePart == 1)
                {
                    if (InsKey < 0 || InsKey > MAX_KEY)
                    {
                        Note = $"CAN'T INSERT: need key between 0 and {MAX_KEY}";
                        OpMode = OperationMode.Idle;
                        return false;
                    }
                    TempPers = MakePerson(InsKey);
                    Note = $"Will insert item with key {InsKey}";
                    CodePart = 2;
                    return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(InsKey);
                    ScrollIntoView(CurList);
                    CurLink = 0;
                    Note = $"Will insert in list {CurList}";
                    CodePart = 3;
                    return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks >= Bucket.MAX_LINKS)
                    {
                        Note = $"CAN'T INSERT: list {CurList} is full";
                        CodePart = 5;
                        return true;
                    }
                    for (int k = bucket.NLinks; k > 0; k--)
                    {
                        bucket.LinkArray[k] = bucket.LinkArray[k - 1];
                    }
                    bucket.LinkArray[0] = new Link(TempPers!);
                    bucket.NLinks++;
                    NPersons++;
                    CurLink = 0;
                    Note = $"Inserted item with key {InsKey} in list {CurList}";
                    CodePart = 4;
                    return true;
                }
                else if (CodePart == 4)
                {
                    Note = $"Insertion completed; total items = {NPersons}";
                    CodePart = 5;
                    return true;
                }
                else
                {
                    CurList = 0;
                    CurLink = 0;
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = OperationMode.Idle;
                    return false;
                }
            }

            if (OpMode == OperationMode.Find)
            {
                if (CodePart == 1)
                {
                    if (FindKey < 0 || FindKey > MAX_KEY)
                    {
                        Note = $"CAN'T FIND: use key between 0 and {MAX_KEY}";
                        OpMode = OperationMode.Idle;
                        return false;
                    }
                    Note = $"Will try to find item with key {FindKey}";
                    CodePart = 2;
                    return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(FindKey);
                    ScrollIntoView(CurList);
                    CurLink = 0;
                    Note = $"Item with key {FindKey} should be in list {CurList}";
                    CodePart = 3;
                    return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks == 0)
                    {
                        Note = $"Can't find item with key {FindKey}";
                        CodePart = 5;
                        return true;
                    }
                    var link = bucket.LinkArray[CurLink];
                    if (link != null && link.PersData.Height == FindKey)
                    {
                        Note = $"Have found item with key {FindKey}";
                        CodePart = 5;
                        return true;
                    }
                    if (CurLink >= bucket.NLinks - 1)
                    {
                        Note = $"Can't find item with key {FindKey}";
                        CodePart = 5;
                        return true;
                    }
                    CurLink++;
                    Note = $"Looking for item with key {FindKey} at link {CurLink}";
                    return true;
                }
                else
                {
                    CurList = 0;
                    CurLink = 0;
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = OperationMode.Idle;
                    return false;
                }
            }

            if (OpMode == OperationMode.Del)
            {
                if (CodePart == 1)
                {
                    if (DelKey < 0 || DelKey > MAX_KEY)
                    {
                        Note = $"CAN'T FIND: use key between 0 and {MAX_KEY}";
                        OpMode = OperationMode.Idle;
                        return false;
                    }
                    Note = $"Will try to delete item with key {DelKey}";
                    CodePart = 2;
                    return true;
                }
                else if (CodePart == 2)
                {
                    CurList = HashFunction(DelKey);
                    ScrollIntoView(CurList);
                    CurLink = 0;
                    Note = $"Item with key {DelKey} should be in list {CurList}";
                    CodePart = 3;
                    return true;
                }
                else if (CodePart == 3)
                {
                    var bucket = BucketArray[CurList];
                    if (bucket.NLinks == 0)
                    {
                        Note = $"Can't find item with key {DelKey}";
                        CodePart = 5;
                        return true;
                    }
                    var link = bucket.LinkArray[CurLink];
                    if (link != null && link.PersData.Height == DelKey)
                    {
                        Note = $"Have found item with key {DelKey}";
                        CodePart = 4;
                        return true;
                    }
                    if (CurLink >= bucket.NLinks - 1)
                    {
                        Note = $"Can't find item with key {DelKey}";
                        CodePart = 5;
                        return true;
                    }
                    CurLink++;
                    Note = $"Looking for item with key {DelKey} at link {CurLink}";
                    return true;
                }
                else if (CodePart == 4)
                {
                    var bucket = BucketArray[CurList];
                    int linkIdx = CurLink;
                    for (int k = linkIdx; k < bucket.NLinks - 1; k++)
                    {
                        bucket.LinkArray[k] = bucket.LinkArray[k + 1];
                    }
                    bucket.LinkArray[bucket.NLinks - 1] = null;
                    bucket.NLinks--;
                    NPersons = Math.Max(0, NPersons - 1);
                    CurLink = linkIdx > 0 ? linkIdx - 1 : 0;
                    Note = $"Deleted item with key {DelKey}";
                    CodePart = 5;
                    return true;
                }
                else
                {
                    CurList = 0;
                    CurLink = 0;
                    Note = "Press any button";
                    CodePart = 1;
                    OpMode = OperationMode.Idle;
                    return false;
                }
            }

            return false;
        }

        private void ScrollIntoView(int targetList)
        {
            if (targetList < TopDisplayLine)
            {
                TopDisplayLine = targetList;
            }
            else if (targetList >= TopDisplayLine + LINES_IN_VIEW)
            {
                TopDisplayLine = Math.Max(0, targetList - LINES_IN_VIEW + 1);
            }
        }
    }
}
