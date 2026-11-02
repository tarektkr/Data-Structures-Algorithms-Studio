# Lafore's Directed, Weighted Graph (GraphDW) - C# .NET 8.0 Windows Forms

This is a complete, faithful C# .NET 8.0 Windows Forms desktop port of Robert Lafore's **Directed, Weighted Graph (GraphDW)** applet from Chapter 14 of *Data Structures and Algorithms in Java*.

## Features

- **Double-Click Vertex Creation**: Double-click on the canvas to create a new vertex (A, B, C, ... up to 13 vertices).
- **Directed Weighted Edge Dragging**: Type a number (0-99) into the "Enter number:" box, then drag from a source vertex to a destination vertex to establish a directed weighted edge with midpoint weight badge.
- **Dijkstra's Shortest Path Algorithm (Path button)**:
  - Single-click to select a source vertex.
  - Step-by-step tree expansion with red ring markers.
  - Calculation and updates of the shortest-path array `sPath` with parent tracking `distance(parent)`.
  - Detection and notification of unreachable vertices.
- **Adjacency Matrix View (View button)**:
  - Instant toggle between the graphical representation and the classic yellow AWT adjacency matrix grid showing distances and `inf`.
- **Sample Graph**:
  - One-click loading of the classic 5-vertex sample graph from Chapter 14.

## How to Build and Run

1. Open this folder in **Visual Studio 2022** or run via command line:
   ```bash
   dotnet build
   dotnet run
   ```
2. Requires **.NET 8.0 SDK** (Windows desktop workload).
