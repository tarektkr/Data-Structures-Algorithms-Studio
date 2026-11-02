<div align="center">

# 📘 Robert Lafore: Data Structures & Algorithms Studio (1998 → 2026 Modernized)

[![.NET](https://img.shields.io/badge/.NET-8.0_Windows_Forms-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

A comprehensive modern rebuild and update of the Interactive Workshop Applets originally released in 1998 alongside the globally renowned reference book: 
**"Data Structures & Algorithms in Java"** by Robert Lafore.

This project provides two fully integrated versions: an interactive hybrid Web Application (React + 60FPS Canvas) and a unified native C# Desktop Application (.NET 8.0 Windows Forms & GDI+).

---

## 🌟 Key Highlights

- 🎨 **19 Fully Implemented Algorithms & Data Structures:** Matches the classic reference exactly.
- ⚡ **Interactive Execution Control:** Continuous play, step-by-step execution, speed slider, and reset functionalities.
- 📊 **Big-O Complexity Analysis:** Informative cards explaining the time and space complexity for each algorithm.
- 🖥️ **Unified Ready-to-Run C# App:** A comprehensive solution (`RobertLafore_DSA_Studio.sln`) combining all chapters into a single window with an elegant sidebar.
- 📦 **Instant ZIP Exporter:** Download the code of any specific chapter or the entire project as a ZIP file with a single click.
- 🌐 **Full Arabic Language Support:** A carefully designed comfortable UI featuring comprehensive scientific explanations.

---

## 📚 Included Chapters & Algorithms (19 Modules)

| Chapter | Topic | Included Algorithms | Time Complexity |
| :---: | :--- | :--- | :--- |
| **Ch 02** | Arrays | • UnorderedArray<br>• OrderedArray | `O(n)` Linear search<br>`O(log n)` Binary search |
| **Ch 03** | Simple Sorting | • BubbleSort<br>• SelectionSort<br>• InsertionSort | `O(n²)` Worst case<br>`O(n)` Best case (Insertion) |
| **Ch 04** | Stacks & Queues | • Stack (LIFO)<br>• Circular Queue (FIFO)<br>• PriorityQueue | `O(1)` Stack & Queue<br>`O(n)` Priority Queue Insert |
| **Ch 05** | Linked Lists | • Singly Linked List (LinkList) | `O(1)` Insert at head<br>`O(n)` Search & Delete |
| **Ch 06 & 08** | Recursion & MergeSort | • Towers of Hanoi<br>• MergeSort | `O(2ⁿ)` Towers of Hanoi<br>`O(n log n)` MergeSort |
| **Ch 07** | QuickSort | • QuickSort1<br>• Median-of-Three (QuickSort2) | `O(n log n)` Average case |
| **Ch 09** | Binary Trees | • Binary Search Tree (BST - Inorder & Deletion) | `O(log n)` Balanced |
| **Ch 11** | Hash Tables | • Linear Probing<br>• Separate Chaining | `O(1)` Average search & insert |
| **Ch 13** | Graphs | • Depth-First Search (DFS)<br>• Breadth-First Search (BFS)<br>• Spanning Tree | `O(V + E)` with mouse edge dragging |
| **Ch 14** | Weighted Graphs | • Prim's MST<br>• Dijkstra's Shortest Path | `O(E log V)` Prim's<br>`O(V²)` Dijkstra's |

---

## 🚀 Getting Started

### 1) Running the Web App (React)
Requires [Node.js (LTS)](https://nodejs.org/) installed on your machine.

**On Windows (Easiest Way):**
Simply double-click the following file:
```text
start.bat
```
Or via Terminal / CMD:
```text
bash
npm install --legacy-peer-deps
npm run dev
```
Then open your browser and navigate to: http://localhost:3000

2) Running the C# Desktop App (.NET 8.0 Windows Forms)
Requires Visual Studio 2022 with the .NET Desktop Development workload installed.

Open the following folder:

text
csharp-viewer/
Double-click the main solution file:

text
```
RobertLafore_DSA_Studio.sln
```
Press F5 (or click the Start button).
The unified main dashboard window will open instantly, featuring a sidebar to navigate through all algorithms.

## 📁 Project Structure

```text
├── src/                          # Interactive Web UI code (React 19 + TypeScript)
│   ├── components/               # UI components and algorithm simulators
│   ├── utils/                    # Calculation logic and direct C# file exporter
│   └── types/                    # Type definitions and applet data
│
├── csharp-viewer/                # Complete C# Desktop Application (.NET 8.0)
│   ├── RobertLafore_DSA_Studio.sln     # Unified solution file for all chapters
│   ├── RobertLafore_DSA_Studio.csproj  # Main project configuration file
│   ├── MainDashboardForm.cs            # Main window and navigation sidebar
│   ├── Program.cs                      # Desktop application entry point
│   ├── UnorderedArrayViewer/           # Chapter 2
│   ├── OrderedArrayViewer/             # Chapter 2
│   ├── BubbleSortViewer/               # Chapter 3
│   ├── SelectionSortViewer/            # Chapter 3
│   ├── InsertionSortViewer/            # Chapter 3
│   ├── StackViewer/                    # Chapter 4
│   ├── QueueViewer/                    # Chapter 4
│   ├── PriorityQueueViewer/            # Chapter 4
│   ├── LinkListViewer/                 # Chapter 5
│   ├── TowersViewer/                   # Chapter 6
│   ├── MergeSortViewer/                # Chapter 8
│   ├── QuickSort1Viewer/               # Chapter 7
│   ├── QuickSort2Viewer/               # Chapter 7
│   ├── TreeViewer/                     # Chapter 9
│   ├── HashViewer/                     # Chapter 11
│   ├── HashChainViewer/                # Chapter 11
│   ├── GraphViewer/                    # Chapter 13
│   ├── GraphDWViewer/                  # Chapter 14
│   └── GraphWViewer/                   # Chapter 14
│
├── start.bat                     # One-click instant launch script for the Web App
└── HOW_TO_RUN_LOCALLY_AR.md      # Detailed Arabic guide for running and troubleshooting
```


📜 Credits & Attribution
Original Concept & Algorithms: Entirely inspired by the classic computer science reference by Robert Lafore (Data Structures and Algorithms in Java, Waite Group / Sams Publishing, 1998).

Modernization & Development: The project was rebuilt and ported to contemporary technologies using an AI-Assisted Software Engineering workflow.

📄 License
This project is licensed under the MIT License - free and available for educational use and personal development.