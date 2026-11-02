using System;
using System.Drawing;

namespace TowersViewer
{
    /// <summary>
    /// Core game group state machine and drawing manager for Towers of Hanoi.
    /// Directly decompiled and translated from gameGroup.class by Robert Lafore.
    /// </summary>
    public class GameGroup
    {
        public int MaxDiskWidth { get; } = 120;
        public int AppletWidth { get; } = 440;
        public int AppletHeight { get; } = 335;
        public int TopMargin { get; } = 70;
        public int LeftMargin { get; } = 10;
        public int TextHeight { get; } = 15;
        public int XTowerA { get; } = 80;
        public int XTowerB { get; } = 220;
        public int XTowerC { get; } = 360;
        public int NoteBoxTop { get; } = 45;
        public int NoteBoxHeight { get; } = 25;
        public int NoteBoxWidth { get; } = 420;
        public int DrawingBoxHeight { get; } = 230;

        public string Note { get; set; } = "Press any button, or drag disk to another post";
        public int OpMode { get; set; } = 0;
        public int CodePart { get; set; } = 1;
        public int DrawMode { get; set; } = 1;
        public bool DiskMoved { get; set; } = false;
        public int DdCode { get; set; } = 0;
        public Tower[] TowerArray { get; private set; }
        public int NDisks { get; set; }
        public int WidthFactor { get; set; }
        public CallStack TheStack { get; }
        public Params? TheseParams { get; set; }

        public int N { get; set; }
        public int From { get; set; }
        public int To { get; set; }
        public int Inter { get; set; }
        public bool IsDoneFlag { get; set; } = false;

        // Mouse Drag tracking
        public Disk? DraggedDisk { get; set; }
        public int DragSourceTower { get; set; } = -1;
        public int DragX { get; set; } = 0;
        public int DragY { get; set; } = 0;
        public bool IsDragging { get; set; } = false;

        public static readonly Color[] DiskPalette = new Color[]
        {
            Color.FromArgb(255, 59, 48),   // Red (Disk 1)
            Color.FromArgb(255, 149, 0),  // Orange (Disk 2)
            Color.FromArgb(255, 204, 0),  // Yellow (Disk 3)
            Color.FromArgb(52, 199, 89),   // Green (Disk 4)
            Color.FromArgb(0, 199, 190),   // Teal (Disk 5)
            Color.FromArgb(48, 176, 199),  // Cyan (Disk 6)
            Color.FromArgb(0, 122, 255),   // Blue (Disk 7)
            Color.FromArgb(88, 86, 214),   // Indigo (Disk 8)
            Color.FromArgb(175, 82, 222),  // Purple (Disk 9)
            Color.FromArgb(255, 45, 85),   // Pink (Disk 10)
        };

        public GameGroup(int nDisks)
        {
            NDisks = Math.Max(1, Math.Min(10, nDisks));
            TheStack = new CallStack(64);
            WidthFactor = MaxDiskWidth / NDisks;

            TowerArray = new Tower[3];
            TowerArray[0] = new Tower(XTowerA, 'A', NDisks);
            TowerArray[1] = new Tower(XTowerB, 'B', NDisks);
            TowerArray[2] = new Tower(XTowerC, 'C', NDisks);

            // Populate Tower A with nDisks: largest on bottom, smallest on top
            for (int i = NDisks; i >= 1; i--)
            {
                int w = MaxDiskWidth - (NDisks - i) * WidthFactor + 14;
                Color c = DiskPalette[(i - 1) % DiskPalette.Length];
                TowerArray[0].InsertDisk(new Disk(Math.Max(30, w), c, i.ToString()));
            }

            Note = "Press any button, or drag disk to another post";
            OpMode = 0;
            CodePart = 1;
            IsDoneFlag = false;
        }

        public void CreationError()
        {
            Note = "Before using New, enter number of disks (1 to 10)";
        }

        public void WarningNew()
        {
            Note = "ARE YOU SURE? Press again to reset game";
        }

        public int CloseTo(int x, int y)
        {
            if (Math.Abs(x - XTowerA) < 45) return 0;
            if (Math.Abs(x - XTowerB) < 45) return 1;
            if (Math.Abs(x - XTowerC) < 45) return 2;
            return -1;
        }

        public void StartDrag(int x, int y)
        {
            int towerIdx = CloseTo(x, y);
            if (towerIdx == -1)
            {
                Note = "Drag a colored DISK to a different black TOWER";
                return;
            }

            Tower t = TowerArray[towerIdx];
            if (t.IsEmpty())
            {
                Note = "NO DISKS on tower " + t.Label;
                return;
            }

            DraggedDisk = t.PeekDisk();
            DragSourceTower = towerIdx;
            DragX = x;
            DragY = y;
            IsDragging = true;
            Note = "Dragging from tower " + t.Label;
        }

        public void EndDrag(int x, int y)
        {
            if (!IsDragging || DraggedDisk == null || DragSourceTower == -1)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                return;
            }

            int toTower = CloseTo(x, y);
            if (toTower == -1 || toTower == DragSourceTower)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                Note = "Press any button, or drag disk to another post";
                return;
            }

            Tower target = TowerArray[toTower];
            Tower source = TowerArray[DragSourceTower];

            // Verify size rule
            if (!target.IsEmpty() && DraggedDisk.Width >= target.PeekDisk()!.Width)
            {
                IsDragging = false;
                DraggedDisk = null;
                DragSourceTower = -1;
                Note = "Must put a SMALLER disk ON a LARGER disk";
                return;
            }

            // Move the disk
            Disk? moved = source.RemoveDisk();
            if (moved != null)
            {
                target.InsertDisk(moved);
            }

            IsDragging = false;
            DraggedDisk = null;
            DragSourceTower = -1;

            if (TowerArray[2].IsFull())
            {
                Note = "Congratulations! You moved all the disks!";
                IsDoneFlag = true;
            }
            else
            {
                Note = $"Moved disk {moved?.Label} from {source.Label} to {target.Label}";
            }
        }

        /// <summary>
        /// Executes one step of the recursive resolution simulated via an explicit stack.
        /// Translates the 8-case tableswitch from gameGroup.step() bytecode.
        /// </summary>
        public void Step()
        {
            DiskMoved = false;

            if (OpMode == 0)
            {
                OpMode = 1;
                CodePart = 1;
            }

            switch (CodePart)
            {
                case 1:
                    if (!TowerArray[1].IsEmpty() || !TowerArray[2].IsEmpty())
                    {
                        Note = "You must begin with ALL DISKS ON TOWER A";
                        CodePart = 8;
                        return;
                    }
                    Note = "Will shift all disks from A to C";
                    TheseParams = new Params(NDisks, 0, 2, 1, 8);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 2:
                    TheseParams = TheStack.Peek();
                    N = TheseParams.N;
                    From = TheseParams.From;
                    To = TheseParams.To;
                    Inter = TheseParams.Inter;
                    Note = $"Entering function with {N} disks";
                    CodePart = 3;
                    break;

                case 3:
                    if (N == 1)
                    {
                        Disk? d = TowerArray[From].RemoveDisk();
                        if (d != null)
                        {
                            TowerArray[To].InsertDisk(d);
                            DiskMoved = true;
                            Note = $"Moved disk {d.Label} from {TowerArray[From].Label} to {TowerArray[To].Label}";
                        }
                        if (TowerArray[2].IsFull())
                        {
                            Note = "Congratulations! You moved all the disks!";
                        }
                        CodePart = 7;
                    }
                    else
                    {
                        Note = "More than one disk, will continue";
                        CodePart = 4;
                    }
                    break;

                case 4:
                    Note = $"Will move top {N - 1} disks from {TowerArray[From].Label} to {TowerArray[Inter].Label}";
                    TheseParams = new Params(N - 1, From, Inter, To, 5);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 5:
                    Disk? rem = TowerArray[From].RemoveDisk();
                    if (rem != null)
                    {
                        TowerArray[To].InsertDisk(rem);
                        DiskMoved = true;
                        Note = $"Moved remaining disk {N} from {TowerArray[From].Label} to {TowerArray[To].Label}";
                    }
                    CodePart = 6;
                    break;

                case 6:
                    Note = $"Will move top {N - 1} disks from {TowerArray[Inter].Label} to {TowerArray[To].Label}";
                    TheseParams = new Params(N - 1, Inter, To, From, 7);
                    TheStack.Push(TheseParams);
                    CodePart = 2;
                    break;

                case 7:
                    TheseParams = TheStack.Pop();
                    int returnCode = TheseParams.CodePart;

                    if (TheStack.IsEmpty())
                    {
                        Note = $"Returning from function with {N} disks";
                        CodePart = 8;
                    }
                    else
                    {
                        TheseParams = TheStack.Peek();
                        N = TheseParams.N;
                        From = TheseParams.From;
                        To = TheseParams.To;
                        Inter = TheseParams.Inter;
                        Note = $"Returning from function with {N} disks";
                        CodePart = returnCode;
                    }
                    break;

                case 8:
                default:
                    Note = "Press New to reset";
                    IsDoneFlag = true;
                    break;
            }
        }

        public void Draw(Graphics g)
        {
            // Background fill
            using (Brush bgBrush = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(bgBrush, 0, 0, AppletWidth, AppletHeight);
            }

            // Outline around simulation field
            using (Pen borderPen = new Pen(Color.Black))
            {
                g.DrawRectangle(borderPen, 2, 71, 436, 229);
            }

            // Draw base plate
            using (Brush groundBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(groundBrush, 15, 300, 410, 6);
            }

            // Draw towers
            for (int i = 0; i < 3; i++)
            {
                TowerArray[i].DrawTower(g, DrawMode, DdCode);
            }

            // Draw dragged disk if active
            if (IsDragging && DraggedDisk != null)
            {
                DraggedDisk.DrawDisk(g, DragX, (300 - DragY) / 20);
            }

            // Draw note message box
            using (Brush noteBg = new SolidBrush(Color.LightGray))
            {
                g.FillRectangle(noteBg, 10, NoteBoxTop, NoteBoxWidth, NoteBoxHeight);
            }

            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 9, FontStyle.Bold))
            {
                g.DrawString(Note, font, textBrush, 16, 50);
            }
        }
    }
}
