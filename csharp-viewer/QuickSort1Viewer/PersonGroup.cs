using System;
using System.Drawing;

namespace QuickSort1Viewer;

/// <summary>
/// Direct translation of Robert Lafore's personGroup.class (Chapter 8: Advanced Sorting)
/// Implements the exact 8-state machine simulation of QuickSort with right-pivot partitioning.
/// </summary>
public class PersonGroup
{
    public const int AppletWidth = 370;
    public const int AppletHeight = 320;
    public const int MaxHeight = 200;
    public const int TopMargin = 30;
    public const int LeftMargin = 10;
    public const int BaselineY = 230;

    public int ASize { get; private set; }
    public Person[] TheArray { get; private set; } = null!;
    public int BarWidth { get; private set; }
    public int BarSeparation { get; private set; }
    public int BarLeftMargin { get; private set; }

    public bool DoneFlag { get; private set; }
    public int CodePart { get; private set; }
    public int Comps { get; private set; }
    public int Swaps { get; private set; }
    public int InitOrder { get; private set; } // 1: Random, 2: Inverse

    public int Left { get; private set; }
    public int Right { get; private set; }
    public int Pivot { get; private set; }
    public int LeftScan { get; private set; }
    public int RightScan { get; private set; }

    public Stack LeftStack { get; private set; } = null!;
    public Stack RightStack { get; private set; } = null!;
    public string Note { get; private set; } = "Press any button";

    public PersonGroup(int aSize = 10, int initOrder = 1)
    {
        Init(aSize, initOrder);
    }

    public void Init(int aSize, int initOrder)
    {
        ASize = aSize;
        InitOrder = initOrder;
        TheArray = new Person[ASize];

        if (ASize == 100)
        {
            BarWidth = 2;
            BarSeparation = 1;
            BarLeftMargin = 10;
        }
        else
        {
            BarWidth = 18;
            BarSeparation = 7;
            BarLeftMargin = 35;
        }

        Comps = 0;
        Swaps = 0;
        DoneFlag = false;
        CodePart = 1;

        Left = 0;
        Right = ASize - 1;
        Pivot = -1;
        LeftScan = -1;
        RightScan = -1;

        LeftStack = new Stack(50);
        RightStack = new Stack(50);
        Note = "Press any button";

        var rand = new Random();
        if (InitOrder == 1)
        {
            // Random
            for (int i = 0; i < ASize; i++)
            {
                int h = rand.Next(5, 200);
                Color c = Color.FromArgb(rand.Next(60, 255), rand.Next(60, 255), rand.Next(60, 255));
                TheArray[i] = new Person(h, c);
            }
        }
        else
        {
            // Inverse
            for (int i = 0; i < ASize; i++)
            {
                int h = 195 - (195 * i / ASize);
                int r = Math.Min(255, 255 - (150 * i / ASize));
                int g = Math.Min(255, 100 + (100 * i / ASize));
                int b = Math.Min(255, 50 + (180 * i / ASize));
                TheArray[i] = new Person(h, Color.FromArgb(r, g, b));
            }
        }

        Pivot = TheArray[Right].Height;
    }

    public void SortStep()
    {
        if (DoneFlag)
        {
            Note = "Sort is complete";
            return;
        }

        switch (CodePart)
        {
            case 1:
                if (Right - Left <= 0)
                {
                    Note = $"Entering quickSort(); partition ({Left}-{Right}) too small to sort";
                    CodePart = 7;
                }
                else
                {
                    Pivot = TheArray[Right].Height;
                    Note = $"Entering quickSort(); will partition ({Left}-{Right})";
                    CodePart = 2;
                }
                break;

            case 2:
                LeftScan = Left - 1;
                RightScan = Right;
                Note = $"leftScan={LeftScan}, rightScan={RightScan}; will scan";
                CodePart = 3;
                break;

            case 3:
                while (true)
                {
                    LeftScan++;
                    Comps++;
                    if (LeftScan >= Right || TheArray[LeftScan].Height >= Pivot)
                        break;
                }

                while (true)
                {
                    RightScan--;
                    if (RightScan <= Left)
                        break;
                    Comps++;
                    if (TheArray[RightScan].Height <= Pivot)
                        break;
                }

                if (LeftScan >= RightScan)
                {
                    Note = "Scans have met; will swap pivot and leftScan";
                    CodePart = 5;
                }
                else
                {
                    Note = "Will swap leftScan and rightScan";
                    CodePart = 4;
                }
                break;

            case 4:
                Swap(LeftScan, RightScan);
                Note = "Will scan again";
                CodePart = 3;
                break;

            case 5:
                Swap(LeftScan, Right);
                Note = $"Array partitioned: left ({Left}-{LeftScan - 1}), right ({LeftScan + 1}-{Right})";
                CodePart = 6;
                break;

            case 6:
                LeftStack.Push(LeftScan + 1);
                RightStack.Push(Right);
                Note = $"Will sort left partition ({Left}-{LeftScan - 1})";
                Right = LeftScan - 1;
                LeftScan = -1;
                RightScan = -1;
                Pivot = -1;
                CodePart = 1;
                break;

            case 7:
                if (LeftStack.IsEmpty())
                {
                    DoneFlag = true;
                    Note = "Sort is complete";
                    CodePart = 8;
                }
                else
                {
                    Left = LeftStack.Pop();
                    Right = RightStack.Pop();
                    LeftScan = -1;
                    RightScan = -1;
                    Pivot = -1;
                    Note = $"Will sort right partition ({Left}-{Right})";
                    CodePart = 1;
                }
                break;

            case 8:
            default:
                Note = "Sort is complete - Press any button";
                DoneFlag = true;
                break;
        }
    }

    private void Swap(int i, int j)
    {
        var temp = TheArray[i];
        TheArray[i] = TheArray[j];
        TheArray[j] = temp;
        Swaps++;
    }

    public void Draw(Graphics g)
    {
        g.Clear(Color.FromArgb(192, 192, 192));

        // Stats
        using var font = new Font("Monospace", 9, FontStyle.Bold);
        using var blackBrush = new SolidBrush(Color.Black);
        g.DrawString($"Swaps = {Swaps}", font, blackBrush, 10, 8);
        g.DrawString($"Comparisons = {Comps}", font, blackBrush, 10, 22);

        // Note Box
        g.FillRectangle(Brushes.White, 140, 8, 220, 24);
        g.DrawRectangle(Pens.Black, 140, 8, 220, 24);
        using var noteFont = new Font("SansSerif", 8);
        using var sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center };
        g.DrawString(Note, noteFont, blackBrush, new RectangleF(140, 8, 220, 24), sf);

        // Draw Bars
        for (int i = 0; i < ASize; i++)
        {
            var p = TheArray[i];
            int x = BarLeftMargin + i * (BarWidth + BarSeparation);
            int y = BaselineY - p.Height;

            using var barBrush = new SolidBrush(p.Color);
            g.FillRectangle(barBrush, x, y, BarWidth, p.Height);

            if (BarWidth >= 5)
            {
                g.DrawLine(Pens.White, x, y + p.Height, x, y);
                g.DrawLine(Pens.White, x, y, x + BarWidth - 1, y);
                g.DrawLine(Pens.Gray, x + BarWidth, y, x + BarWidth, y + p.Height);
            }
        }

        // Horizontal Line for partition [Left, Right]
        if (Left >= 0 && Right >= Left && Right < ASize)
        {
            int leftX = BarLeftMargin + Left * (BarWidth + BarSeparation);
            int rightX = BarLeftMargin + Right * (BarWidth + BarSeparation) + BarWidth;
            using var linePen = new Pen(Color.Black, 2);
            g.DrawLine(linePen, leftX, BaselineY + 2, rightX, BaselineY + 2);
        }

        // Pointer Arrows
        if (Left >= 0) DrawArrow(g, Left, Color.Blue, "left", 0);
        if (Right >= 0 && Right != Left) DrawArrow(g, Right, Color.Blue, "right", 0);
        if (LeftScan >= 0) DrawArrow(g, LeftScan, Color.Red, "leftScan", 1);
        if (RightScan >= 0) DrawArrow(g, RightScan, Color.Magenta, "rightScan", 2);
        if (CodePart >= 2 && CodePart <= 6 && Right >= 0) DrawArrow(g, Right, Color.Black, "pivot", 3);
    }

    private void DrawArrow(Graphics g, int index, Color color, string label, int level)
    {
        if (index < 0 || index >= ASize) return;
        int xCenter = BarLeftMargin + index * (BarWidth + BarSeparation) + BarWidth / 2;
        int tipY = BaselineY + 5;
        int baseY = BaselineY + 14 + level * 14;

        using var pen = new Pen(color, 1.5f);
        using var brush = new SolidBrush(color);
        using var font = new Font("Monospace", 7, FontStyle.Bold);

        g.DrawLine(pen, xCenter, tipY, xCenter, baseY);
        Point[] arrowHead = {
            new Point(xCenter, tipY),
            new Point(xCenter - 3, tipY + 4),
            new Point(xCenter + 3, tipY + 4)
        };
        g.FillPolygon(brush, arrowHead);

        using var sf = new StringFormat { Alignment = StringAlignment.Center };
        g.DrawString(label, font, brush, xCenter, baseY + 2, sf);
    }
}
