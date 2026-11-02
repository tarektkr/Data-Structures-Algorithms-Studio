# Graph Workshop Applet - C# Windows Forms (.NET 8.0)
**Robert Lafore - Data Structures & Algorithms in Java (Chapter 13: Graphs)**

مشروع كامل مبني بلغة C# وواجهات Windows Forms يحاكي بريمج المخططات البيانية (Graphs) لروبرت لافور:

### الميزات المدعومة:
1. **إنشاء الرؤوس (Vertices)**: النقر المزدوج بالفأرة لإنشاء رؤوس A إلى M.
2. **إنشاء الحواف (Edges)**: السحب بالفأرة بين أي رأسين لإنشاء حافة غير موجهة.
3. **البحث في العمق (DFS - Depth-First Search)**: باستخدام مكدس صريح (LIFO Stack) وتطبيق القواعد الثلاث.
4. **البحث في العرض (BFS - Breadth-First Search)**: باستخدام طابور دائري صريح (FIFO Queue).
5. **شجرة الامتداد الأصغري (Minimum Spanning Tree - MST)**: بناء شجرة امتداد للمخطط غير الموزون بـ $V-1$ حافة.
6. **مصفوفة المجاورة (Adjacency Matrix)**: التبديل لعرض مصفوفة المجاورة الثنائية الصفراء (0 و 1).

### متطلبات التشغيل:
- .NET 8.0 SDK
- Visual Studio 2022 أو Visual Studio Code
- أمر التشغيل: `dotnet run`
