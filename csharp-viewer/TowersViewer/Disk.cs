using System;
using System.Drawing;

namespace TowersViewer
{
    /// <summary>
    /// Represents a single disk in the Towers of Hanoi simulation.
    /// Equivalent to disk.class from Robert Lafore's Java Workshop Applet.
    /// </summary>
    public class Disk
    {
        public int GroundLevel { get; } = 300;
        public int Height { get; } = 20;
        public int Width { get; set; }
        public Color DiskColor { get; set; }
        public string Label { get; set; }

        public Disk(int width, Color color, string label)
        {
            Width = width;
            DiskColor = color;
            Label = label;
        }

        /// <summary>
        /// Draws the disk centered horizontally around x, and sitting at index y (from bottom 0 upwards).
        /// Recreates exact AWT capsule rendering with rounded pill ends.
        /// </summary>
        public void DrawDisk(Graphics g, int x, int y)
        {
            int left = x - (Width / 2);
            int top = GroundLevel - (y + 1) * Height;
            int radius = Height / 2;

            // Black border outline
            using (Brush blackBrush = new SolidBrush(Color.Black))
            {
                g.FillRectangle(blackBrush, left, top, Width, Height);
                g.FillPie(blackBrush, left - radius, top, Height, Height, 90, 180);
                g.FillPie(blackBrush, left + Width - radius, top, Height, Height, 270, 180);
            }

            // Colored inner body
            using (Brush bodyBrush = new SolidBrush(DiskColor))
            {
                g.FillRectangle(bodyBrush, left, top + 1, Width, Height - 2);
                g.FillPie(bodyBrush, left - radius + 1, top + 1, Height - 2, Height - 2, 90, 180);
                g.FillPie(bodyBrush, left + Width - radius - 1, top + 1, Height - 2, Height - 2, 270, 180);
            }

            // Center numeric label
            using (Brush textBrush = new SolidBrush(Color.Black))
            using (Font font = new Font("Arial", 9, FontStyle.Bold))
            {
                SizeF size = g.MeasureString(Label, font);
                float textX = x - (size.Width / 2);
                float textY = top + (Height - size.Height) / 2;
                g.DrawString(Label, font, textBrush, textX, textY);
            }
        }
    }
}
