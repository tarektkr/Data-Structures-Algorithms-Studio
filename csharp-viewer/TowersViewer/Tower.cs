using System;
using System.Drawing;

namespace TowersViewer
{
    /// <summary>
    /// Represents one of the three vertical peg towers ('A', 'B', 'C').
    /// Equivalent to tower.class in Robert Lafore's applet.
    /// </summary>
    public class Tower
    {
        public int GroundLevel { get; } = 300;
        public int DiskHeight { get; } = 20;
        public int MaxDiskWidth { get; } = 120;
        public int TowerWidth { get; } = 15;
        public int TowerTop { get; } = 80;
        public int TowerHeight { get; } = 220; // 300 - 80
        public int NDisks { get; set; }
        public int XCtr { get; set; }
        public char Label { get; set; }

        public Disk[] DiskArray { get; private set; }
        public int ArrayTop { get; private set; } = -1;

        public Tower(int xCtr, char label, int nDisks)
        {
            XCtr = xCtr;
            Label = label;
            NDisks = nDisks;
            DiskArray = new Disk[10];
            ArrayTop = -1;
        }

        public void InsertDisk(Disk d)
        {
            DiskArray[++ArrayTop] = d;
        }

        public Disk? RemoveDisk()
        {
            if (ArrayTop < 0) return null;
            Disk d = DiskArray[ArrayTop];
            DiskArray[ArrayTop] = null!;
            ArrayTop--;
            return d;
        }

        public Disk? PeekDisk()
        {
            if (ArrayTop < 0) return null;
            return DiskArray[ArrayTop];
        }

        public bool IsEmpty() => ArrayTop < 0;

        public bool IsFull() => ArrayTop == NDisks - 1;

        public void DrawTower(Graphics g, int drawMode, int ddCode)
        {
            int poleX = XCtr - (TowerWidth / 2);

            // Draw vertical pole
            using (Brush poleBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(poleBrush, poleX, TowerTop, TowerWidth, TowerHeight);
            }

            // Draw tower letter label below ground
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 11, FontStyle.Bold))
            {
                string s = Label.ToString();
                SizeF size = g.MeasureString(s, font);
                g.DrawString(s, font, textBrush, XCtr - (size.Width / 2), GroundLevel + 16);
            }

            // Draw disks currently residing on this tower
            for (int i = 0; i <= ArrayTop; i++)
            {
                if (DiskArray[i] != null)
                {
                    DiskArray[i].DrawDisk(g, XCtr, i);
                }
            }
        }
    }
}
