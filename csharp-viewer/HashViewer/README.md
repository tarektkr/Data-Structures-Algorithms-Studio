# Linear-Probe Hash Table Windows Forms Viewer (.NET 8.0)
## Robert Lafore's Data Structures & Algorithms in Java - Chapter 11

### Overview
This standalone C# .NET 8.0 Windows Forms application replicates Robert Lafore's classic 1998 Java applet for **Linear-Probe Hash Tables** (`Hash.class`, `personGroup.class`, `person.class`).

### Features
- **Array Size (ASIZE)**: Up to 60 cells, arranged in 5 columns of 12 cells.
- **Hash Function**: `hash = key % totalCells` (keys range from 0 to 999).
- **Collision Resolution**: Open addressing via linear probing (`curIn = (curIn + 1) % totalCells`).
- **Sentinel Deletion**: Deleted items are marked with key `-1` and displayed as `*Del*`.
- **Operations Supported**:
  - `New`: Allocate an empty hash table with N cells (0 to 60).
  - `Fill`: Populate table with N random items.
  - `Ins`: Insert key N into the first empty or `*Del*` slot encountered.
  - `Del`: Find key N and replace it with `*Del*`.
  - `Find`: Probe sequentially for key N until located or an empty slot is encountered.
  - `Step` & `Run`: Single-step or animated execution.

### How to Build & Run
```bash
dotnet restore
dotnet build -c Release
dotnet run -c Release
```
