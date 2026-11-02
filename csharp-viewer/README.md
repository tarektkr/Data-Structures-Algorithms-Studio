# استوديو روبرت لافور لهياكل البيانات والخوارزميات بلغة C# (.NET 8.0)
## Robert Lafore - Data Structures & Algorithms Unified Studio (Windows Forms)

هذا هو **المشروع الشامل والموحد** المكتوب بلغة **C#** باستخدام **Windows Forms (.NET 8.0)** ورسوميات **GDI+** التفاعلية، ويضم جميع البريمجات الـ 19 من كتاب:
**Data Structures & Algorithms in Java (Robert Lafore)**.

---

### ملفات المشروع الرئيسي:
1. **`RobertLafore_DSA_Studio.sln`**: ملف الحل الرئيسي الشامل لـ Visual Studio 2022.
2. **`RobertLafore_DSA_Studio.csproj`**: ملف إعدادات المشروع الرئيسي المستهدف لـ .NET 8.0.
3. **`MainDashboardForm.cs` & `.Designer.cs`**: نافذة التحكم والتشغيل المركزية المزودة بشريط جانبي (Sidebar) يتيح التنقل المباشر والتبديل الفوري بين جميع الخوارزميات الـ 19 دون الحاجة لفتح نوافذ متعددة.
4. **`Program.cs`**: نقطة انطلاق التطبيق الموحد.

---

### الفصول والخوارزميات الـ 19 المتضمنة:
* **الفصل 2: المصفوفات (Arrays)**:
  - `UnorderedArrayViewer`: مصفوفة غير مرتبة مع بحث خطي وحذف وإدراج وتكرار.
  - `OrderedArrayViewer`: مصفوفة مرتبة مع بحث ثنائي O(log N).
* **الفصل 3: الترتيب البسيط (Simple Sorting)**:
  - `BubbleSortViewer`: ترتيب الفقاعة مع مؤشرات ملونة.
  - `SelectionSortViewer`: ترتيب الاختيار مع مؤشر min.
  - `InsertionSortViewer`: ترتيب الإدراج مع إزاحة ونسخ العناصر.
* **الفصل 4: المكدسات والطوابير (Stacks & Queues)**:
  - `StackViewer`: المكدس LIFO مع مؤشر top.
  - `QueueViewer`: الطابور الدائري FIFO مع التفاف المؤشرات.
  - `PriorityQueueViewer`: طابور الأولوية.
* **الفصل 5: القوائم المرتبطة (Linked Lists)**:
  - `LinkListViewer`: القوائم المترابطة مع روابط وعقد متحركة.
* **الفصل 6 و 8: العودية وترتيب الدمج (Recursion & Merge Sort)**:
  - `TowersViewer`: أبراج هانوي مع مكدس الاستدعاء العودي.
  - `MergeSortViewer`: ترتيب الدمج مع مصفوفة العمل workSpace.
* **الفصل 7: الترتيب السريع (QuickSort)**:
  - `QuickSort1Viewer`: الترتيب السريع التقليدي.
  - `QuickSort2Viewer`: الترتيب السريع بأسلوب وسيط الثلاثة (Median-of-Three).
* **الفصل 9: الشجرة الثنائية (Binary Trees)**:
  - `TreeViewer`: شجرة البحث الثنائية (BST) مع الحذف وإيجاد الخلف (Successor).
* **الفصل 11: جداول الهاش (Hash Tables)**:
  - `HashViewer`: جدول الهاش بالمسح الخطي Linear Probing.
  - `HashChainViewer`: جدول الهاش بالسلاسل المنفصلة Separate Chaining.
* **الفصل 13: المخططات العامة (Graphs)**:
  - `GraphViewer`: المخطط غير الموجه مع البحث بالعمق DFS والبحث بالعرض BFS وشجرة الامتداد.
* **الفصل 14: المخططات الموزونة (Weighted Graphs)**:
  - `GraphWViewer`: شجرة الامتداد الصغرى بريم (Prim's MST).
  - `GraphDWViewer`: أقصر مسار دكسترا (Dijkstra Shortest Path).

---

### طريقة التشغيل على الحاسب (Windows):

#### المتطلبات الأساسية:
1. نظام تشغيل **Windows 10 أو 11**.
2. برنامج **Visual Studio 2022** (النسخة المجانية Community كافية تماماً)، مع التأكد من تحديد حزمة:
   `".NET desktop development"` أثناء التثبيت.
3. أو تثبيت **.NET 8.0 SDK** المستقل.

#### خطوات التشغيل:
1. انقر مرتين على ملف الحل الرئيسي:
   ```text
   RobertLafore_DSA_Studio.sln
   ```
2. سيفتح الحل في Visual Studio متضمناً المشروع الموحد `RobertLafore_DSA_Studio`.
3. اضغط على مفتاح **F5** (أو زر **Start / التشغيل الاخضر**).
4. ستظهر لك النافذة الرئيسية مع شريط التنقل الجانبي، ويمكنك تجربة أي خوارزمية فوراً!

#### التشغيل عبر سطر الأوامر (PowerShell / Command Prompt):
```powershell
cd csharp-viewer
dotnet run --project RobertLafore_DSA_Studio.csproj
```
