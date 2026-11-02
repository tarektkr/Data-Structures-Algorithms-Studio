# GraphW - Weighted, Undirected Graph (MSTW) C# .NET 8.0 Windows Forms

مشروع C# .NET 8.0 تفاعلي متكامل يحاكي بريمج **GraphW** الكلاسيكي من **الفصل 14** لكتاب روبرت لافور (*Robert Lafore*):
*Data Structures & Algorithms in Java (1998)*.

## مميزات المشروع
- **شجرة الامتداد الأصغري (Minimum Spanning Tree)** عبر خوارزمية بريم (Prim's Algorithm) مع طابور أولوية (Priority Queue) للحواف.
- **إنشاء الرؤوس بالنقر المزدوج (Double-Click)** حتى 13 رأساً (A إلى M).
- **إنشاء حواف غير موجهة بالسحب (Drag & Drop)** مع تحديد وزن مخصص (0 إلى 99).
- **شاشة مصفوفة المجاورة الصفراء (Yellow Adjacency Matrix)** عبر زر `View`.
- **مخطط نموذجي جاهز (Sample Graph)** بستة رؤوس وعشر حواف لاختبار الخوارزمية فوراً.
- شريط سفلي يعرض الرؤوس المضافة للشجرة `Tree: A B C...` ومحتويات طابور الأولوية `PQ: AB6 AC4...`.

## متطلبات التشغيل
- .NET 8.0 SDK أو Visual Studio 2022 (مع حزمة .NET Desktop Development).

## التشغيل عبر الطرفية:
```bash
dotnet build
dotnet run
```
