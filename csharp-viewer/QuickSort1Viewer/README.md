# QuickSort1 Viewer (Robert Lafore Data Structures & Algorithms in Java)

A complete modern C# (.NET 8 Windows Forms) implementation of Robert Lafore's classic **QuickSort1 Applet** from Chapter 8: Advanced Sorting.

## Features
- **Rightmost Pivot Partitioning**: Visual demonstration of Hoare/Lomuto style scanning from both ends until meeting at the pivot.
- **8-State Machine Simulation**: Faithfully reproduces `personGroup.sortStep()` from original Java bytecode without recursion freezing the UI.
- **Explicit Call Stack**: `Stack.cs` stores left and right subarray boundaries.
- **Full Controls**: `New` (toggles Random/Inverse), `Size` (10 or 100 bars), `Draw`, `Run`, `Step`.
- **Live Arrows**: Color-coded arrows for `left`, `right`, `leftScan`, `rightScan`, and `pivot`.

## How to Run
```bash
dotnet build
dotnet run
```
