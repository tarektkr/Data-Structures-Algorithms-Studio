using System;
using System.Drawing;

namespace TreeViewer
{
    /// <summary>
    /// PersonGroup manages the 31-node array-based Binary Search Tree,
    /// state machines for Fill, Find, Insert, Delete, and Traverse,
    /// and faithful AWT 1998 graphics rendering.
    /// </summary>
    public class PersonGroup
    {
        public const int ASIZE = 31;
        public const int MAX_KEY = 99;

        public int AppletWidth { get; } = 440;
        public int AppletHeight { get; } = 300;
        public int MaxHeight { get; } = 200;
        public int TopMargin { get; } = 70;
        public int LeftMargin { get; } = 10;
        public int TextHeight { get; } = 13;
        public int NodeDiameter { get; } = 20;
        public int LevelSeparation { get; } = 40;
        public int HorizSeparation { get; } = 26;

        public int NoteBoxTop { get; } = 45;
        public int NoteBoxHeight { get; } = 25;
        public int NoteBoxWidth { get; } = 200;
        public int VisitBoxTop { get; } = 280;
        public int VisitBoxHeight { get; } = 25;
        public int VisitBoxWidth { get; } = 430;

        public Person?[] TreeArray { get; } = new Person?[ASIZE];
        public Stack TheStack { get; } = new Stack();
        public int FilledNodes { get; private set; }
        public string Note { get; private set; } = "Press a button";
        public bool IsRand { get; set; } = true;
        public int Value { get; set; }
        public int CodePart { get; set; } = 1;
        public int OpMode { get; set; } = 0; // 1: Fill, 2: Find, 3: Ins, 4: Trav, 5: Del
        public int CurIn { get; set; } = 0;
        public int CurInOld { get; set; } = 0;
        public int OldArrow { get; set; } = 0;
        public int[] VisitArray { get; } = new int[ASIZE];
        public int VisitIndex { get; private set; } = 0;
        public int Successor { get; set; } = 0;
        public bool DrawAll { get; set; } = true;
        public int DrawMode { get; set; } = 2;

        private static readonly Random Rng = new();

        public PersonGroup()
        {
            for (int i = 0; i < ASIZE; i++)
            {
                TreeArray[i] = null;
            }
            DoFill(10);
            Note = "Press a button";
        }

        public Person MakePerson(int height)
        {
            int r = Rng.Next(100, 255);
            int g = Rng.Next(100, 255);
            int b = Rng.Next(100, 255);
            return new Person(height, Color.FromArgb(r, g, b));
        }

        public void DoFill(int count)
        {
            for (int i = 0; i < ASIZE; i++)
            {
                TreeArray[i] = null;
            }
            FilledNodes = 0;

            bool[] used = new bool[100];
            int attempts = 0;

            while (FilledNodes < count && attempts < 100)
            {
                attempts++;
                int key = Rng.Next(0, 100);
                if (used[key]) continue;

                Person p = MakePerson(key);
                int cur = 0;

                while (cur <= 30)
                {
                    if (TreeArray[cur] == null)
                    {
                        TreeArray[cur] = p;
                        used[key] = true;
                        FilledNodes++;
                        break;
                    }

                    if (key < TreeArray[cur]!.GetHeight())
                    {
                        cur = 2 * cur + 1;
                    }
                    else
                    {
                        cur = 2 * cur + 2;
                    }
                }
            }
        }

        public int InorderSuccessor(int nodeIndex)
        {
            int succ = nodeIndex;
            int cur = 2 * nodeIndex + 2;
            while (cur < 31 && TreeArray[cur] != null)
            {
                succ = cur;
                cur = 2 * cur + 1;
            }
            return succ;
        }

        public void MoveUpSubTree(int direction, int nodeIndex)
        {
            if (nodeIndex < 0 || nodeIndex > 14) return;
            int srcRoot = direction == 1 ? 2 * nodeIndex + 2 : 2 * nodeIndex + 1;
            ShiftSubtreeUp(srcRoot, nodeIndex);
        }

        private void ShiftSubtreeUp(int src, int dst)
        {
            if (src >= 31) return;
            TreeArray[dst] = TreeArray[src];
            TreeArray[src] = null;

            int leftSrc = 2 * src + 1;
            int rightSrc = 2 * src + 2;
            int leftDst = 2 * dst + 1;
            int rightDst = 2 * dst + 2;

            if (leftSrc < 31 && leftDst < 31)
            {
                ShiftSubtreeUp(leftSrc, leftDst);
            }
            if (rightSrc < 31 && rightDst < 31)
            {
                ShiftSubtreeUp(rightSrc, rightDst);
            }
        }

        public void Fill(bool isNum, int num)
        {
            if (OpMode != 1)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0;
                    Note = "Enter number of nodes (1 to 31)";
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    DrawMode = 0;
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNum || num < 1 || num > 31)
                    {
                        Note = "Inappropriate number of nodes";
                        CodePart = 1;
                    }
                    else
                    {
                        Note = $"Will create tree of {num} nodes";
                        CodePart = 3;
                    }
                    break;

                case 3:
                    DoFill(num);
                    DrawMode = 2;
                    Note = "Press any button";
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Find(bool isNum, int num)
        {
            if (OpMode != 2)
            {
                OpMode = 2;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0;
                    Note = "Enter key of node to find";
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    DrawMode = 0;
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNum || num < 0 || num > 99)
                    {
                        Note = "Nodes have values from 0 to 99";
                        CodePart = 1;
                    }
                    else
                    {
                        Note = $"Will try to find node with key {num}";
                        CodePart = 3;
                    }
                    break;

                case 3:
                    if (TreeArray[CurIn] == null)
                    {
                        Note = "Can't find node with that value";
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }

                    if (num == TreeArray[CurIn]!.GetHeight())
                    {
                        Note = $"Have found node {num}";
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        CodePart = 4;
                    }
                    else
                    {
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        if (num < TreeArray[CurIn]!.GetHeight())
                        {
                            CurIn = 2 * CurIn + 1;
                            Note = "Going to left child";
                        }
                        else
                        {
                            CurIn = 2 * CurIn + 2;
                            Note = "Going to right child";
                        }

                        if (CurIn > 30 || TreeArray[CurIn] == null)
                        {
                            Note = "Can't find node with that value";
                            CodePart = 1;
                            OpMode = 0;
                            return;
                        }
                        CodePart = 3;
                    }
                    break;

                case 4:
                    Note = "Search is complete";
                    CodePart = 5;
                    break;

                case 5:
                    Note = "Press any button";
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Insert(bool isNum, int num)
        {
            if (OpMode != 3)
            {
                OpMode = 3;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0;
                    Note = "Enter value of node to insert";
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    DrawMode = 0;
                    CodePart = 2;
                    break;

                case 2:
                    Value = num;
                    if (!isNum || num < 0 || num > 99)
                    {
                        Note = "Nodes have values from 0 to 99";
                        CodePart = 1;
                    }
                    else
                    {
                        Note = $"Will insert node with key {Value}";
                        CodePart = 3;
                    }
                    break;

                case 3:
                    OldArrow = CurInOld;
                    CurInOld = CurIn;

                    if (CurIn > 30)
                    {
                        Note = "Level is too great";
                        CodePart = 4;
                        return;
                    }

                    if (TreeArray[CurIn] == null)
                    {
                        TreeArray[CurIn] = MakePerson(Value);
                        Note = $"Have inserted node with key {Value}";
                        FilledNodes++;
                        CurInOld = CurIn;
                        DrawMode = 1;
                        CodePart = 4;
                    }
                    else
                    {
                        if (Value < TreeArray[CurIn]!.GetHeight())
                        {
                            CurIn = 2 * CurIn + 1;
                            Note = "Going to left child";
                        }
                        else
                        {
                            CurIn = 2 * CurIn + 2;
                            Note = "Going to right child";
                        }

                        if (CurIn > 30)
                        {
                            Note = "Can't insert: Level is too great";
                            CodePart = 1;
                            OpMode = 0;
                            return;
                        }
                        DrawMode = 0;
                        CodePart = 3;
                    }
                    break;

                case 4:
                    Note = "Insertion completed";
                    DrawMode = 0;
                    CodePart = 5;
                    break;

                case 5:
                    Note = "Press any button";
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Remove(bool isNum, int num)
        {
            if (OpMode != 5)
            {
                OpMode = 5;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0;
                    Note = "Enter key of node to delete";
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    DrawMode = 0;
                    CodePart = 2;
                    break;

                case 2:
                    if (!isNum || num < 0 || num > 99)
                    {
                        Note = "Nodes have values from 0 to 99";
                        CodePart = 1;
                    }
                    else
                    {
                        Note = $"Will try to delete node {num}";
                        CodePart = 3;
                    }
                    break;

                case 3:
                    if (TreeArray[CurIn] == null)
                    {
                        Note = "Can't find node with that value";
                        CodePart = 1;
                        OpMode = 0;
                        return;
                    }

                    if (num == TreeArray[CurIn]!.GetHeight())
                    {
                        Note = "Have found node to delete";
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        CodePart = 4;
                    }
                    else
                    {
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        if (num < TreeArray[CurIn]!.GetHeight())
                        {
                            CurIn = 2 * CurIn + 1;
                            Note = "Going to left child";
                        }
                        else
                        {
                            CurIn = 2 * CurIn + 2;
                            Note = "Going to right child";
                        }

                        if (CurIn > 30 || TreeArray[CurIn] == null)
                        {
                            Note = "Can't find node with that value";
                            CodePart = 1;
                            OpMode = 0;
                            return;
                        }
                        CodePart = 3;
                    }
                    break;

                case 4:
                    int left = 2 * CurIn + 1;
                    int right = 2 * CurIn + 2;
                    bool hasLeft = left <= 30 && TreeArray[left] != null;
                    bool hasRight = right <= 30 && TreeArray[right] != null;

                    if (!hasLeft && !hasRight)
                    {
                        Note = "Will delete node without complication";
                        CodePart = 6;
                    }
                    else if (!hasLeft && hasRight)
                    {
                        Note = "Will replace node with its right subtree";
                        CodePart = 7;
                    }
                    else if (hasLeft && !hasRight)
                    {
                        Note = "Will replace node with its left subtree";
                        CodePart = 8;
                    }
                    else
                    {
                        Successor = InorderSuccessor(CurIn);
                        Note = $"Will replace node with {TreeArray[Successor]!.GetHeight()}";
                        CodePart = 9;
                    }
                    break;

                case 6:
                    TreeArray[CurIn] = null;
                    FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was deleted";
                    DrawMode = 2;
                    CodePart = 10;
                    break;

                case 7:
                    MoveUpSubTree(1, CurIn);
                    FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was replaced by its right subtree";
                    DrawMode = 2;
                    CodePart = 10;
                    break;

                case 8:
                    MoveUpSubTree(0, CurIn);
                    FilledNodes = Math.Max(0, FilledNodes - 1);
                    Note = "Node was replaced by its left subtree";
                    DrawMode = 2;
                    CodePart = 10;
                    break;

                case 9:
                    TreeArray[CurIn] = TreeArray[Successor];
                    int succRight = 2 * Successor + 2;
                    if (succRight <= 30 && TreeArray[succRight] != null)
                    {
                        int succVal = TreeArray[succRight]!.GetHeight();
                        Note = $"and replace {succVal} with its right subtree";
                        MoveUpSubTree(1, Successor);
                        FilledNodes = Math.Max(0, FilledNodes - 1);
                        Note = "Removed node in 2-step process";
                    }
                    else
                    {
                        TreeArray[Successor] = null;
                        FilledNodes = Math.Max(0, FilledNodes - 1);
                        Note = "Node was replaced by successor";
                    }
                    DrawMode = 2;
                    CodePart = 10;
                    break;

                case 10:
                    Note = "Press any button";
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public void Traverse()
        {
            if (OpMode != 4)
            {
                OpMode = 4;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    VisitIndex = 0;
                    Note = "Will traverse tree in \"inorder\"";
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    DrawMode = 0;
                    CodePart = 5;
                    break;

                case 5:
                    if (TreeArray[0] == null)
                    {
                        Note = "Done traversal";
                        CodePart = 4;
                        return;
                    }
                    CurIn = 0;
                    OldArrow = CurInOld;
                    CurInOld = CurIn;
                    Note = "Will check left child";
                    CodePart = 6;
                    break;

                case 6:
                    int left = 2 * CurIn + 1;
                    if (left <= 30 && TreeArray[left] != null)
                    {
                        TheStack.Push(CurIn);
                        CurIn = left;
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        Note = "Will check left child";
                        CodePart = 6;
                    }
                    else
                    {
                        Note = "Will visit this node";
                        CodePart = 7;
                    }
                    break;

                case 7:
                    if (TreeArray[CurIn] != null)
                    {
                        VisitArray[VisitIndex++] = TreeArray[CurIn]!.GetHeight();
                    }
                    Note = "Will check for right child";
                    CodePart = 8;
                    break;

                case 8:
                    int right = 2 * CurIn + 2;
                    if (right <= 30 && TreeArray[right] != null)
                    {
                        CurIn = right;
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        Note = "Will check left child";
                        CodePart = 6;
                    }
                    else if (!TheStack.IsEmpty())
                    {
                        Note = "Will go to root of last subtree";
                        CurIn = TheStack.Pop();
                        OldArrow = CurInOld;
                        CurInOld = CurIn;
                        CodePart = 7;
                    }
                    else
                    {
                        Note = "Done traversal";
                        CodePart = 4;
                    }
                    break;

                case 4:
                    Note = "Done traversal";
                    CodePart = 10;
                    break;

                case 10:
                    Note = "Press any button";
                    OldArrow = CurInOld;
                    CurInOld = 0;
                    CodePart = 1;
                    OpMode = 0;
                    break;
            }
        }

        public (int x, int y, int level, int column, int parentCol) GetNodeCoords(int index)
        {
            int level = 0;
            int col = 15;
            int parentCol = 0;

            if (index == 0)
            {
                level = 0;
                col = 15;
                parentCol = 0;
            }
            else if (index >= 1 && index <= 2)
            {
                level = 1;
                col = 7 + (index - 1) * 16;
                parentCol = 15;
            }
            else if (index >= 3 && index <= 6)
            {
                level = 2;
                col = 3 + (index - 3) * 8;
                parentCol = (index % 2 == 1) ? col + 4 : col - 4;
            }
            else if (index >= 7 && index <= 14)
            {
                level = 3;
                col = 1 + (index - 7) * 4;
                parentCol = (index % 2 == 1) ? col + 2 : col - 2;
            }
            else if (index >= 15 && index <= 30)
            {
                level = 4;
                col = (index - 15) * 2;
                parentCol = (index % 2 == 1) ? col + 1 : col - 1;
            }

            int x = LeftMargin + col * HorizSeparation / 2;
            int y = TopMargin + level * LevelSeparation;
            return (x, y, level, col, parentCol);
        }

        public void Draw(Graphics g)
        {
            // Background
            using var bgBrush = new SolidBrush(Color.FromArgb(192, 192, 192));
            g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);

            // Note Box
            using var noteBrush = new SolidBrush(Color.FromArgb(212, 208, 200));
            g.FillRectangle(noteBrush, 10, NoteBoxTop, 420, NoteBoxHeight);
            using var boxPen = new Pen(Color.FromArgb(128, 128, 128));
            g.DrawRectangle(boxPen, 10, NoteBoxTop, 420, NoteBoxHeight);
            using var textBrush = new SolidBrush(Color.Black);
            using var noteFont = new Font("SansSerif", 9, FontStyle.Bold);
            g.DrawString(Note, noteFont, textBrush, 16, NoteBoxTop + 5);

            // Connecting Lines
            using var linePen = new Pen(Color.Black, 1);
            for (int i = 1; i < 31; i++)
            {
                if (TreeArray[i] == null) continue;
                int pIdx = (i - 1) / 2;
                if (TreeArray[pIdx] == null) continue;

                var child = GetNodeCoords(i);
                var parent = GetNodeCoords(pIdx);
                g.DrawLine(linePen, parent.x + 10, parent.y + 10, child.x + 10, child.y + 10);
            }

            // Draw Nodes
            using var nodeFont = new Font("Monospace", 9, FontStyle.Bold);
            for (int i = 0; i < 31; i++)
            {
                if (TreeArray[i] == null) continue;
                var coords = GetNodeCoords(i);
                using var brush = new SolidBrush(TreeArray[i]!.GetColor());
                g.FillEllipse(brush, coords.x, coords.y, 20, 20);
                using var borderPen = new Pen(i == CurIn ? Color.Red : Color.Black, i == CurIn ? 2 : 1);
                g.DrawEllipse(borderPen, coords.x, coords.y, 20, 20);

                string keyStr = TreeArray[i]!.GetHeight().ToString();
                int textX = coords.x + (keyStr.Length == 1 ? 7 : 4);
                g.DrawString(keyStr, nodeFont, textBrush, textX, coords.y + 4);
            }

            // Draw Arrow
            if (CurIn >= 0 && CurIn < 31 && TreeArray[CurIn] != null)
            {
                var coords = GetNodeCoords(CurIn);
                int arrowX = coords.x + 10;
                int arrowTipY = coords.y - 4;
                using var arrowPen = new Pen(Color.Red, 2);
                g.DrawLine(arrowPen, arrowX, arrowTipY - 16, arrowX, arrowTipY);
                using var arrowBrush = new SolidBrush(Color.Red);
                Point[] head = {
                    new(arrowX, arrowTipY),
                    new(arrowX - 4, arrowTipY - 6),
                    new(arrowX + 4, arrowTipY - 6)
                };
                g.FillPolygon(arrowBrush, head);
            }

            // Visit Box
            g.FillRectangle(noteBrush, 10, VisitBoxTop, 420, VisitBoxHeight);
            g.DrawRectangle(boxPen, 10, VisitBoxTop, 420, VisitBoxHeight);
            string visitStr = "";
            for (int i = 0; i < VisitIndex; i++)
            {
                visitStr += VisitArray[i] + "  ";
            }
            if (string.IsNullOrEmpty(visitStr)) visitStr = "(empty)";
            g.DrawString(visitStr, noteFont, textBrush, 16, VisitBoxTop + 5);
        }
    }
}
