# Robert Lafore QuickSort 2 Workshop (Median-of-Three Partitioning)
# مشروع الترتيب السريع 2 - تجزيء وسيط الثلاثة بلغة C# .NET 8 Windows Forms

مشروع تطبيقي كامل بلغة C# (.NET 8.0 Windows Forms) يُحاكي بدقة متناهية بريمج جافا التعليمي الكلاسيكي لروبرت لافور من الفصل الثامن (**Data Structures and Algorithms in Java - Chapter 8: QuickSort 2**).

## المميزات الفنية المطبقة:
1. **خوارزمية وسيط الثلاثة (Median-of-Three Partitioning):**
   - فحص وترتيب العناصر: `left` و `center` و `right`.
   - وضع الوسيط عند `right - 1` كمحور ارتكاز (Pivot).
   - حراس طبيعيون (Sentinels) تمنع المؤشرات من الخروج عن الحدود دون الحاجة لفحص إضافي.
2. **معالجة الحالات الصغرى يدوياً (Manual Sorting for Small Subarrays):**
   - مصفوفة بحجم 1 أو 2 أو 3 تُرتب فورياً وبأقل عدد من المقارنات.
3. **مكدس استدعاءات صريح (Explicit LIFO Stack):**
   - حفظ حدود المصفوفات الجزئية لاسترجاعها دون استدعاء عودي يفيض بالذاكرة.
4. **رسم ثلاثي الأبعاد وإشارات المؤشرات:**
   - رسم الأعمدة بأسلوب AWT 3D الكلاسيكي مع مؤشرات ملونة (`left`, `right`, `center`, `leftScan`, `rightScan`, `pivot`).
5. **إحصائيات فورية:**
   - عداد المقارنات (Comparisons) وعداد التبديلات (Swaps).

## كيفية التشغيل عبر سطر الأوامر:
```bash
cd QuickSort2Viewer
dotnet run
```
