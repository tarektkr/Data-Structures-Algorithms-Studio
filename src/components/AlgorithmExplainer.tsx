import React from 'react';
import {
  BookOpen,
  Zap,
  Search,
  Trash2,
  Plus,
  RefreshCw,
  Layers,
  CheckCircle2,
  ShieldAlert,
  Binary,
  ArrowRightLeft,
  Timer,
  CheckCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
} from 'lucide-react';

interface AlgorithmExplainerProps {
  appletId?: string;
}

export const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({
  appletId = 'ordered-array',
}) => {
  const isGraph = appletId === 'graph';
  const isGraphW = appletId === 'graph-w';
  const isGraphDW = appletId === 'graph-dw';
  const isHash = appletId === 'hash-table';
  const isHashChain = appletId === 'hash-chain';
  const isTree = appletId === 'tree';
  const isMergeSort = appletId === 'merge-sort';
  const isQuickSort2 = appletId === 'quick-sort-2';
  const isQuickSort1 = appletId === 'quick-sort-1';
  const isTowers = appletId === 'towers';
  const isLinkList = appletId === 'link-list';
  const isPriorityQueue = appletId === 'priority-queue';
  const isQueue = appletId === 'queue';
  const isStack = appletId === 'stack';
  const isSelect = appletId === 'select-sort';
  const isBubble = appletId === 'bubble-sort';
  const isOrdered = appletId === 'ordered-array';

  if (isGraph) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold">
              المخططات والبحث في العمق والعرض (Graphs: DFS, BFS & Spanning Tree) - الفصل 13
            </h2>
          </div>
          <p className="text-sm text-sky-100 leading-relaxed">
            يُحاكي هذا البريمج التفاعلي هياكل بيانات <strong className="text-amber-300">المخططات العامة غير الموجهة وغير الموزونة (Undirected, Unweighted Graphs)</strong> وفق الفصل الثالث عشر من مرجع روبرت لافور (Robert Lafore). يتيح لك بناء مخطط مخصص عبر <strong className="text-emerald-300">النقر المزدوج لإنشاء الرؤوس (A-M)</strong> وسحب الحواف بينها، ومقارنة أعظم خوارزميتين لاجتياز المخططات: <strong className="text-purple-300">البحث في العمق (DFS)</strong> بالاعتماد على <span className="font-mono text-purple-200">المكدس (Stack)</span>، و<strong className="text-cyan-300">البحث في العرض (BFS)</strong> بالاعتماد على <span className="font-mono text-cyan-200">الطابور (Queue)</span>، بالإضافة إلى توليد <strong className="text-rose-300">شجرة الامتداد (Spanning Tree)</strong> واستعراض <strong className="text-amber-200">مصفوفة المجاورة (Adjacency Matrix)</strong>.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">التعقيد الزمني</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">O(V + E) / O(V²)</div>
            <p className="text-xs text-slate-500 mt-1">
              O(V + E) مع قوائم المجاورة، أو O(V²) مع مصفوفة المجاورة المعتمدة هنا (بحد أقصى 13 رأساً)
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-sky-600 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">التعقيد المكاني</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">O(V²)</div>
            <p className="text-xs text-slate-500 mt-1">
              مصفوفة المجاورة 13×13 لتخزين الحواف (0/1)، بالإضافة إلى مكدس وطابور مساعدين بسعة 20 عنصراً
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">استراتيجية الاجتياز</span>
            </div>
            <div className="text-sm font-bold text-slate-900">Stack (LIFO) vs Queue (FIFO)</div>
            <p className="text-xs text-slate-500 mt-1">
              DFS يغوص لأعمق مسار ويتراجع عند الطرق المسدودة، بينما BFS يمسح الجيران مستوى بمستوى
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">شجرة الامتداد</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">E = V - 1</div>
            <p className="text-xs text-slate-500 mt-1">
              تحتوي الشجرة بالضبط على V-1 حافة تربط جميع الرؤوس المتصلة بدون أي دورات أو حلقات (Cycles)
            </p>
          </div>
        </div>

        {/* Traversal Deep Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DFS Section */}
          <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold border-b border-purple-100 pb-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>البحث في العمق (Depth-First Search - DFS)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تعتمد خوارزمية DFS على هيكل بيانات <strong className="text-purple-700">المكدس (Stack)</strong> لاستكشاف مسار واحد بأقصى عمق ممكن قبل الرجوع والتراجع (Backtracking). ترتكز الخوارزمية على <strong>ثلاث قواعد ذهبية</strong>:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-900">القاعدة 1 (التقدم):</span> إذا كان ذلك ممكناً، قم بزيارة رأس مجاور غير مزار، وعلّمه كـ "تمت زيارته" (<code className="font-mono text-purple-800">wasVisited = true</code>)، ثم ادفعه إلى أعلى المكدس (<code className="font-mono text-purple-800">push</code>).
              </div>
              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-900">القاعدة 2 (التراجع):</span> إذا لم تتمكن من تطبيق القاعدة 1 (لا يوجد جيران غير مزارين)، فاسحب رأساً من أعلى المكدس (<code className="font-mono text-purple-800">pop</code>) للرجوع خطوة إلى الخلف.
              </div>
              <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-900">القاعدة 3 (النهاية):</span> إذا أصبح المكدس فارغاً ولم تعد هناك رؤوس للتراجع إليها، فقد انتهت عملية البحث في العمق بنجاح.
              </div>
            </div>
          </div>

          {/* BFS Section */}
          <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sky-700 font-bold border-b border-sky-100 pb-2">
              <Zap className="w-5 h-5 text-sky-600" />
              <span>البحث في العرض (Breadth-First Search - BFS)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تعتمد خوارزمية BFS على هيكل بيانات <strong className="text-sky-700">الطابور (Queue)</strong> لمسح المخطط على شكل طبقات دائرية متحدة المركز (Concentric Rings)، وهو مثالي لإيجاد أقصر مسار بعدد الحواف:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-900">القاعدة 1 (الزيارة والجدولة):</span> قم بزيارة الرأس المجاور التالي غير المزار للرأس الموجود حالياً في مقدمة الطابور، علّمه كـ "تمت زيارته"، ثم أدرجه في نهاية الطابور (<code className="font-mono text-sky-800">insert</code>).
              </div>
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-900">القاعدة 2 (الاستبدال):</span> إذا استنفدت جميع الجيران غير المزارين للرأس في مقدمة الطابور، فقم بإخراجه من الطابور (<code className="font-mono text-sky-800">remove</code>) ليصبح الرأس الذي يليه هو الرأس النشط.
              </div>
              <div className="p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                <span className="font-bold text-sky-900">القاعدة 3 (النهاية):</span> إذا أصبح الطابور فارغاً بالكامل، فقد تمت زيارة كامل المكون المتصل وانتهى البحث بالعرض.
              </div>
            </div>
          </div>
        </div>

        {/* Tree & Representation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spanning Tree */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-5 h-5 text-rose-600" />
              <span>شجرة الامتداد (Spanning Tree)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              شجرة الامتداد هي مخطط جزئي يربط جميع رؤوس المخطط الأصلي بأقل عدد ممكن من الحواف ودون احتواء أي حلقة مغلقة.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>تُبنى الشجرة هنا بتتبع حواف الاكتشاف أثناء اجتياز <strong className="text-slate-800">DFS</strong>.</li>
              <li>كل حافة تنقل الخوارزمية إلى رأس جديد غير مزار تصبح جزءاً أساسياً من الشجرة وتُلون باللون الأحمر.</li>
              <li>في الخطوة قبل الأخيرة، تُحذف جميع الحواف غير المشاركة في الشجرة ليظهر المخطط الهيكلي الصافي.</li>
              <li>عند النقر على زر <span className="font-mono bg-slate-100 px-1 rounded">Tree</span> مرة أخرى، يستعيد البريمج المخطط الأصلي كاملاً من النسخة الاحتياطية <code className="font-mono text-slate-700">adjMat2</code>.</li>
            </ul>
          </div>

          {/* Adjacency Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold border-b border-slate-100 pb-2">
              <Binary className="w-5 h-5 text-amber-600" />
              <span>مصفوفة المجاورة (Adjacency Matrix)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              تمثيل جدولي ثنائي الأبعاد بأبعاد <code className="font-mono bg-slate-100 px-1 rounded">13 × 13</code> يمثل الاتصال بين الرؤوس:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>إذا كانت الخلية <code className="font-mono text-amber-700">adjMat[i][j] = 1</code>، فهذا يعني وجود حافة تربط الرأس i بالرأس j.</li>
              <li>بما أن المخطط غير موجه (Undirected)، تكون المصفوفة متناظرة دائماً حول القطر الرئيسي: <code className="font-mono text-amber-700">adjMat[i][j] == adjMat[j][i]</code>.</li>
              <li>زر <strong className="text-slate-800">View (عرض)</strong> يسمح لك بالتبديل الفوري بين الرسم البياني ومصفوفة المجاورة الصفراء ذات التنسيق الهندسي المتناسق.</li>
            </ul>
          </div>
        </div>

        {/* How to Use Guide */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            <span>دليل الاستخدام التفاعلي للبريمج</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">1. بناء المخطط</div>
              <p className="text-slate-500">
                انقر نقراً مزدوجاً في مساحة الرسم لإنشاء رأس جديد (A-M)، واسحب من رأس لآخر لإنشاء حافة غير موجهة.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-purple-700 mb-1">2. تشغيل DFS</div>
              <p className="text-slate-500">
                اضغط <span className="font-semibold text-purple-600">DFS</span> ثم اختر رأس البداية بنقرة واحدة، واستخدم <span className="font-semibold">Step</span> أو <span className="font-semibold">Run</span> لتتبع المكدس.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-sky-700 mb-1">3. تشغيل BFS</div>
              <p className="text-slate-500">
                اضغط <span className="font-semibold text-sky-600">BFS</span> ثم اختر رأس البداية لمراقبة الطابور واكتشاف الرؤوس طبقة بعد طبقة.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-bold text-rose-700 mb-1">4. استخراج الشجرة</div>
              <p className="text-slate-500">
                اضغط <span className="font-semibold text-rose-600">Tree</span> لاكتشاف شجرة الامتداد بالأحمر ثم عزلها وحذف الحواف الفائضة.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isGraphW) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">
              المخططات غير الموجهة الموزونة وشجرة الامتداد الأصغري (Prim's MST) - الفصل 14
            </h2>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed">
            يُحاكي هذا البريمج خوارزمية <strong className="text-amber-300">بريم (Prim's Algorithm)</strong> لبناء <strong className="text-emerald-300">شجرة الامتداد الأصغري (Minimum Spanning Tree - MSTW)</strong> في المخططات غير الموجهة والموزونة (Weighted, Undirected Graphs). تتيح لك الأداة إنشاء الرؤوس بالنقر المزدوج وسحب حواف ذات أوزان محددة، والتبديل إلى <strong className="text-cyan-300">مصفوفة المجاورة المتناظرة (Adjacency Matrix)</strong>، ومراقبة عمل طابور الأولوية <span className="font-mono text-purple-300">thePQ</span> أثناء اختيار الحافة الأقل كلفة لإدماج كل رأس جديد في الشجرة خطوة بخطوة!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Timer className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">التعقيد الزمني</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">O(V² + E log V)</div>
            <p className="text-xs text-slate-500 mt-1">
              باستخدام مصفوفة المجاورة وطابور أولوية الحواف، أو O(E log V) مع قوائم المجاورة
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">التعقيد المكاني</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">O(V²) + O(E)</div>
            <p className="text-xs text-slate-500 mt-1">
              مصفوفة المجاورة المتناظرة 13×13 وطابور الأولوية بسعة 20 حافة
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">الاستراتيجية</span>
            </div>
            <div className="text-xl font-black text-slate-900">Greedy Approach</div>
            <p className="text-xs text-slate-500 mt-1">
              خوارزمية جشعة تختار محلياً الحافة الأرخص عبر حد الفصل (Cut Property)
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">شروط شجرة MST</span>
            </div>
            <div className="text-xl font-black text-slate-900 font-mono">E = V - 1</div>
            <p className="text-xs text-slate-500 mt-1">
              شجرة متصلة تغطي جميع الرؤوس بأقل تكلفة ودون أي حلقات (Acyclic)
            </p>
          </div>
        </div>

        {/* Detailed Explanation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: What is MST */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              ما هي شجرة الامتداد الأصغري (Minimum Spanning Tree)؟
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              في المخطط المتصل غير الموجه والموزون:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-800">شجرة الامتداد (Spanning Tree):</strong> هي مخطط جزئي شجري يربط جميع رؤوس المخطط معاً بدون أي دورات أو حلقات (Acyclic). إذا كان المخطط يحتوي على <span className="font-mono font-bold">V</span> رأساً، فإن أي شجرة امتداد تضم تماماً <span className="font-mono font-bold">V - 1</span> حافة.
              </li>
              <li>
                <strong className="text-slate-800">شجرة الامتداد الأصغري (MST):</strong> هي شجرة الامتداد التي يكون مجموع أوزان حوافها هو <span className="text-emerald-700 font-bold">الأقل على الإطلاق</span> من بين جميع أشجار الامتداد الممكنة للمخطط.
              </li>
              <li>
                <strong className="text-slate-800">التطبيقات العملية:</strong> مد خطوط وشبكات الألياف الضوئية، شبكات الكهرباء والمياه، تخطيط شبكات الطرق والسكك الحديدية بأقل تكلفة، وتصميم الدوائر المتكاملة (VLSI).
              </li>
            </ul>
          </div>

          {/* Card 2: Prim's Algorithm Mechanics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                <Zap className="w-4 h-4" />
              </span>
              كيف تعمل خوارزمية بريم (Prim's Algorithm)؟
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              تنمو الشجرة تدريجياً بدءاً من رأس ابتدائي واحد (Starting Vertex):
            </p>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside">
              <li>يتم اختيار رأس البداية وإدراجه في الشجرة (<span className="font-mono text-emerald-700">isInTree = true</span>).</li>
              <li>يتم فحص جميع الرؤوس المجاورة للرأس الجديد، وإذا كان الرأس المجاور خارج الشجرة، تُضاف الحافة الرابطة إليه في <strong className="text-purple-700">طابور الأولوية (Priority Queue)</strong>.</li>
              <li>إذا كانت هناك حافة سابقة لنفس الرأس في الطابور بوزن أكبر، يتم استبدالها بالحافة ذات الوزن الأصغر (<span className="font-mono">putInPQ</span>).</li>
              <li>يتم استخراج الحافة الأرخص وزناً من الطابور (<span className="font-mono">removeMin()</span>)، ويُضاف الرأس المتصل بها إلى الشجرة وتُلون الحافة بالأحمر.</li>
              <li>تتكرر الخطوات حتى ينضم جميع الرؤوس إلى الشجرة (<span className="font-mono">nTree == nVerts</span>).</li>
            </ol>
          </div>

          {/* Card 3: Prim vs Kruskal vs Dijkstra */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <ArrowRightLeft className="w-4 h-4" />
              </span>
              مقارنة: بريم vs كروسكال vs ديكسترا
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b">
                    <th className="p-2">الخاصية</th>
                    <th className="p-2 text-emerald-700">بريم (Prim)</th>
                    <th className="p-2 text-blue-700">كروسكال (Kruskal)</th>
                    <th className="p-2 text-purple-700">ديكسترا (Dijkstra)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-semibold">الهدف</td>
                    <td className="p-2">شجرة امتداد أصغري (MST)</td>
                    <td className="p-2">شجرة امتداد أصغري (MST)</td>
                    <td className="p-2">أقصر مسارات من منبع واحد</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">بناء الشجرة</td>
                    <td className="p-2">تنمو كشجرة واحدة متصلة</td>
                    <td className="p-2">تدمج غابات وأشجار منفصلة</td>
                    <td className="p-2">شجرة أقصر مسارات متصلة</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">معيار الجشع</td>
                    <td className="p-2">وزن الحافة المباشرة w(u,v)</td>
                    <td className="p-2">أصغر حافة في المخطط ككل</td>
                    <td className="p-2">المسافة التراكمية dist[u] + w</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">هيكل البيانات</td>
                    <td className="p-2">طابور أولوية الحواف</td>
                    <td className="p-2">فرز الحواف + مجموعات DSU</td>
                    <td className="p-2">طابور أولوية الرؤوس (sPath)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 4: How to interact */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                <Search className="w-4 h-4" />
              </span>
              دليل التفاعل واستخدام عناصر التحكم
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">Double-Click:</span>
                <span>انقر مرتين على أي مساحة فارغة لإنشاء رأس جديد بحرف أبجدي (A-M).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">Weight + Drag:</span>
                <span>اكتب وزن الحافة (0 إلى 99) في خانة الوزن أولاً، ثم اسحب بالماوس بين رأسين لإنشاء حافة غير موجهة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">Tree / Step:</span>
                <span>انقر فوق رأس البداية لمشاهدة بناء شجرة الامتداد خطوة بخطوة، ثم انقر مجدداً لحذف الحواف الزائدة غير المنتمية للشجرة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">View:</span>
                <span>بدّل لعرض مصفوفة المجاورة الصفراء التناظرية التي تُظهر الأوزان ورمز الـ Infinity (1000000).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (isGraphDW) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">
              المخططات الموجهة الموزونة وخوارزمية ديكسترا لأقصر المسارات (Dijkstra Shortest Path) - الفصل 14
            </h2>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            يُقدم هذا البريمج محاكاة بصرية تفاعلية لأحد أعظم الإنجازات في علوم الحاسوب: <strong className="text-amber-300">خوارزمية ديكسترا (Dijkstra's Algorithm)</strong> لحساب <strong className="text-emerald-300">أقصر المسارات من منبع واحد (Single-Source Shortest Paths)</strong> في المخططات الموجهة والموزونة (Directed, Weighted Graphs). تتيح لك الواجهة إنشاء الرؤوس بالنقر المزدوج، وسحب حواف موجهة بأوزان محددة، والتبديل إلى <strong className="text-cyan-300">مصفوفة المجاورة (Adjacency Matrix)</strong>، وتتبع نمو شجرة المسارات وحساب مصفوفة <span className="font-mono text-amber-300">sPath</span> خطوة بخطوة!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <div className="text-xs text-slate-500 mb-1">التعقيد الزمني الإجمالي</div>
            <div className="text-xl font-black text-blue-700 font-mono">O(V²)</div>
            <div className="text-[11px] text-slate-600 mt-1">باستخدام مصفوفة المجاورة (أو O((V+E)log V) مع min-heap)</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <div className="text-xs text-slate-500 mb-1">إنشاء رأس وحافة</div>
            <div className="text-xl font-black text-emerald-700 font-mono">O(1)</div>
            <div className="text-[11px] text-slate-600 mt-1">نقر مزدوج للرأس وسحب مباشر للحافة بالوزن</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <div className="text-xs text-slate-500 mb-1">التعقيد المكاني (مصفوفة المجاورة)</div>
            <div className="text-xl font-black text-purple-700 font-mono">O(V²)</div>
            <div className="text-[11px] text-slate-600 mt-1">مصفوفة 13×13 لتخزين أوزان الحواف وحالة الشجرة</div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
            <div className="text-xs text-slate-500 mb-1">الذاكرة الإضافية لمصفوفة sPath</div>
            <div className="text-xl font-black text-amber-700 font-mono">O(V)</div>
            <div className="text-[11px] text-slate-600 mt-1">تخزن لكل رأس أقصر مسافة ورقم الرأس الأب</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            آلية عمل خوارزمية ديكسترا خطوة بخطوة (Dijkstra's Algorithm Walkthrough)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <span className="font-bold text-blue-900 block text-sm">1. اختيار رأس البداية والتهيئة:</span>
              <p>
                يختار المستخدم رأس البداية (Source Vertex مثل A). يتم نسخ صف رأس البداية من مصفوفة المجاورة إلى مصفوفة المسافات <span className="font-mono bg-blue-100 text-blue-800 px-1 rounded">sPath</span>، ويضاف رأس البداية إلى <strong className="text-emerald-700">شجرة أقصر المسارات (Tree)</strong> بمسافة 0.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <span className="font-bold text-purple-900 block text-sm">2. الاختيار الجشع (Greedy Selection):</span>
              <p>
                في كل دورة، تبحث الخوارزمية في مصفوفة <span className="font-mono">sPath</span> عن الرأس غير الموجود في الشجرة والذي يمتلك <strong className="text-purple-700">أقل مسافة تراكمية (Minimum Distance)</strong> من منبع البداية، ويتم ضمه رسمياً للشجرة ويُحاط بدائرة حمراء.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <span className="font-bold text-amber-900 block text-sm">3. استرخاء الحواف وتحديث المسافات (Relaxation):</span>
              <p>
                يقوم البريمج بفحص كل رأس مجاور (Fringe) للرأس المضاف حديثاً: إذا كان المسار عبر الرأس الجديد أقصر من المسار المسجل سابقاً:
                <br />
                <code className="font-mono bg-amber-50 text-amber-900 p-1 rounded mt-1 block border border-amber-200 text-left" dir="ltr">
                  startToCurrent + currentToFringe &lt; sPath[col].distance
                </code>
                يتم تحديث المسافة وتعيين الرأس الحالي كأب جديد <span className="font-mono text-emerald-700">parentVert</span>!
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2">
              <span className="font-bold text-emerald-900 block text-sm">4. اكتمال المسارات أو الرؤوس المنعزلة:</span>
              <p>
                تتكرر الخطوات حتى تنضم جميع الرؤوس للشجرة أو تكون الرؤوس المتبقية غير قابلة للوصول (<span className="font-mono text-rose-600 font-bold">inf / Unreachable</span>). في النهاية، تحتوي كل خلية في الصندوق السفلي على أقصر مسافة مع الرأس السابق مثل <span className="font-mono bg-emerald-100 text-emerald-800 px-1 rounded font-bold">50(A)</span> أو <span className="font-mono bg-emerald-100 text-emerald-800 px-1 rounded font-bold">80(C)</span>!
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            مقارنة بين خوارزميات المخططات (Dijkstra vs Prim's MST vs BFS)
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse text-right">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <th className="p-2.5">الخاصية</th>
                  <th className="p-2.5 text-blue-800 font-bold">خوارزمية ديكسترا (Dijkstra - GraphDW)</th>
                  <th className="p-2.5 text-emerald-800 font-bold">شجرة الامتداد الأصغري (Prim MST)</th>
                  <th className="p-2.5 text-purple-800 font-bold">البحث بالعرض (BFS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-700">الهدف الأساسي</td>
                  <td className="p-2.5 text-blue-900 font-bold">أقصر مسافة تراكمية من رأس محدد لجميع الرؤوس</td>
                  <td className="p-2.5">ربط جميع الرؤوس بأقل تكلفة إجمالية للحواف</td>
                  <td className="p-2.5">أقصر مسار بعدد الحواف (بدون أوزان)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-700">نوع المخطط المدعوم</td>
                  <td className="p-2.5 text-blue-900 font-bold">موجه أو غير موجه بأوزان موجبة (Non-negative)</td>
                  <td className="p-2.5">غير موجه متصل بأوزان</td>
                  <td className="p-2.5">غير موزون (جميع الحواف متساوية الوزن 1)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-700">معيار اختيار الرأس التالي</td>
                  <td className="p-2.5 text-blue-900 font-bold">أقل مسافة إجمالية تراكمية من رأس البداية start</td>
                  <td className="p-2.5">أقل وزن حافة مباشرة تربط الرأس بالشجرة الحالية</td>
                  <td className="p-2.5">أول رأس يدخل طابور FIFO</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-700">التعقيد الزمني</td>
                  <td className="p-2.5 font-mono text-blue-900 font-bold">O(V²) بمصفوفة المجاورة</td>
                  <td className="p-2.5 font-mono">O(V²) بمصفوفة المجاورة</td>
                  <td className="p-2.5 font-mono">O(V + E)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-700">أبرز التطبيقات العملية</td>
                  <td className="p-2.5 text-blue-900 font-bold">أنظمة الملاحة وتطبيقات الخرائط GPS وبروتوكول OSPF</td>
                  <td className="p-2.5">تصميم شبكات الكهرباء وأنابيب المياه والاتصالات</td>
                  <td className="p-2.5">البحث في الشبكات الاجتماعية وتدرجات الصداقة</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real World Applications */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            التطبيقات الهندسية الواقعية للمخططات الموجهة الموزونة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">🗺️ أنظمة الملاحة وتطبيقات الخرائط (GPS):</span>
              <p className="text-slate-600">
                تمثل تقاطعات الشوارع كرؤوس والشوارع ذات الاتجاه الواحد كحواف موجهة، والمسافة أو زمن الرحلة كوزن للحافة، حيث تحدد خوارزمية ديكسترا المسار الأسرع لوجهتك.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">🌐 بروتوكولات توجيه الإنترنت (OSPF / IS-IS):</span>
              <p className="text-slate-600">
                تستخدم أجهزة التوجيه (Routers) في شبكات الإنترنت خوارزمية ديكسترا لحساب أقصر وأسرع مسار لإرسال حزم البيانات عبر الموجهات بكفاءة فائقة وتفادي الاختناقات.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block text-xs">✈️ شبكات الطيران واللوجستيات:</span>
              <p className="text-slate-600">
                حساب التكلفة الأقل أو زمن الرحلة الأدنى بين المطارات والموانئ حول العالم مع الأخذ في الحسبان اتجاهات الرحلات والترانزيت.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isHashChain) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-teal-400" />
            <h2 className="text-xl font-bold">
              شرح جداول الهاش بالسلاسل المنفصلة (Separate-Chaining Hash Tables) - الفصل 11
            </h2>
          </div>
          <p className="text-sm text-teal-100 leading-relaxed">
            تُعد طريقة <strong className="text-amber-300">السلاسل المنفصلة (Separate Chaining)</strong> الاستراتيجية البديلة والأكثر مرونة لحل تصادمات التجزئة، حيث يتم تمثيل جدول الهاش كمصفوفة من <strong className="text-emerald-300">الدلاء (Buckets)</strong>، وكل دلو يحتوي على <strong className="text-cyan-300">قائمة مترابطة (Linked List)</strong>. عندما تتصادم عدة مفاتيح في نفس المؤشر <span className="font-mono text-amber-300">list = key % totalBuckets</span>، يتم إدراج العنصر الجديد فوراً في <strong className="text-emerald-300">رأس القائمة المترابطة (Head)</strong> بزمن <span className="font-mono text-cyan-300">O(1)</span> دون الحاجة للبحث عن خلايا مجاورة، مما يقضي تماماً على مشكلة <strong className="text-rose-300">التكتل الأولي (Primary Clustering)</strong>!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">الإدراج (Insert)</span>
                <Plus className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              إدراج مباشر وفوري في رأس القائمة المترابطة الخاصة بالدلو المحسوب دون أي مسح.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">البحث (Search/Find)</span>
                <Search className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1 + λ)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              متوسط الفحص يساوي 1 + λ/2 حيث λ هو معامل التحميل (نسبة العناصر إلى الدلاء).
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">الحذف (Delete)</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1 + λ)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              حذف العقدة من السلسلة مباشرة دون ترك وسم *Del* المحجوز، حيث لا تتأثر مسارات باقي العناصر.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">معامل التحميل (λ)</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">λ &gt; 1 مسموح</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              على عكس المسح الخطي الذي يفشل عند 100%، تقبل السلاسل المنفصلة تخزين أضعاف حجم المصفوفة!
            </p>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
            مقارنة جوهرية: المسح الخطي (Linear Probing) مقابل السلاسل المنفصلة (Separate Chaining)
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-bold">وجه المقارنة</th>
                  <th className="p-2.5 font-bold">المسح الخطي (Linear Probing)</th>
                  <th className="p-2.5 font-bold">السلاسل المنفصلة (Separate Chaining)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-800">هيكل البيانات</td>
                  <td className="p-2.5 text-slate-600">مصفوفة مسطحة واحدة مغلقة (Open Addressing)</td>
                  <td className="p-2.5 text-slate-600 font-medium text-emerald-700">مصفوفة دلاء وكل دلو يحتوي على قائمة مترابطة</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-800">طريقة حل التصادم</td>
                  <td className="p-2.5 text-slate-600">البحث المتتالي في الخلايا المجاورة (x+1, x+2)</td>
                  <td className="p-2.5 text-slate-600 font-medium text-emerald-700">ربط العنصر في نفس الدلو داخل السلسلة</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-800">مشكلة التكتل (Clustering)</td>
                  <td className="p-2.5 text-rose-600 font-medium">معرضة بشدة للتكتل الأولي (Primary Clustering)</td>
                  <td className="p-2.5 text-emerald-600 font-medium">معدومة تماماً؛ لا يؤثر دلو على الدلاء الأخرى</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-800">معامل التحميل الأقصى (λ)</td>
                  <td className="p-2.5 text-rose-600">أقل من 1.0 (عملياً ينهار الأداء بعد 0.7)</td>
                  <td className="p-2.5 text-emerald-600 font-medium">يمكن أن يتجاوز 1.0 و 2.0 دون أي انهيار</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-800">آلية الحذف</td>
                  <td className="p-2.5 text-slate-600">تتطلب وضع علامة حارسة (*Del*) لمنع انقطاع البحث</td>
                  <td className="p-2.5 text-emerald-600 font-medium">حذف فيزيائي مباشر للعقدة وإعادة ربط المؤشرات</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Algorithm Highlights */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            نقاط بارزة في تطبيق روبرت لافور للسلاسل المنفصلة (1998):
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 leading-relaxed pr-2">
            <li><strong>شريط التمرير الرأسي (VScrollBar):</strong> يعرض التطبيق 10 دلاء فقط في نافذة العرض لتوفير المساحة، مع شريط تمرير للتنقل بين كل الدلاء (حتى 100 قائمة).</li>
            <li><strong>التمرير التلقائي:</strong> عند إجراء بحث أو إدراج أو حذف على دلو خارج نافذة العرض، يقوم التطبيق بتمرير اللوحة تلقائياً ليظهر الدلو النشط أمام المستخدم.</li>
            <li><strong>سعة الدلو (Bucket Capacity):</strong> حدد روبرت لافور سعة كل قائمة بـ 6 عقد رسومياً لضمان وضوح الرسم الأفقي على الشاشة.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (isHash) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-sky-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold">
              شرح جداول الهاش بالمسح الخطي (Linear-Probe Hash Tables) - الفصل 11
            </h2>
          </div>
          <p className="text-sm text-sky-100 leading-relaxed">
            تُعد <strong className="text-amber-300">جداول الهاش (Hash Tables)</strong> من أسرع وأكفأ هياكل البيانات لاسترجاع المعلومات، حيث تقدم سرعة بحث وإدراج مذهلة تقترب من <span className="font-mono text-cyan-300">O(1)</span> بغض النظر عن حجم البيانات المخزنة! في هذا البريمج التاريخي من <strong className="text-amber-300">الفصل 11 من كتاب روبرت لافور</strong>، يتم تمثيل جدول تجزئة بالعنونة المفتوحة (Open Addressing) بسعة تصل إلى 60 خلية مرتبة في 5 أعمدة، وتوضيح كيفية حساب مؤشر الخلية عبر دالة التجزئة <span className="font-mono text-cyan-300">hash = key % totalCells</span>، وكيفية حل التصادمات بالمسح الخطي، ولماذا تتطلب عمليات الحذف وضع علامة خاصة <span className="font-mono text-rose-300">*Del*</span>!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">البحث (Search/Find)</span>
                <Search className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              متوسط الوصول فوري عند انخفاض عامل التحميل، وينحدر لـ O(N) عند الامتلاء وتشكل العناقيد.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">الإدراج (Insert)</span>
                <Plus className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              تحديد موضع الخلية بالقسمة Modulo، ثم البحث عن أول خلية فارغة أو مميزة بـ *Del*.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">الحذف (Delete)</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">O(1)</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              يستبدل العنصر بعقدة محجوزة دلالية (*Del*) دون إفراغ الخلية لمنع انقطاع سلاسل البحث.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">عامل التحميل (Load Factor α)</span>
                <Layers className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">α = N / M</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              نسبة العناصر للسعة؛ يُفضل إبقاؤها أقل من 60% لتجنب بطء المسح وتراكم العناقيد.
            </p>
          </div>
        </div>

        {/* Detailed Explanation Sections */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-5 h-5 text-amber-500" />
            المفاهيم الجوهرية لجدول الهاش في بريمج روبرت لافور
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-sky-600" />
                  1. دالة التجزئة (The Hash Function)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  تأخذ الدالة المفتاح الرقمي (0 إلى 999) وتقوم بتقليصه ليناسب نطاق فهارس المصفوفة (0 إلى totalCells - 1):
                  <br />
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800 text-[11px] block my-1">
                    hashVal = key % totalCells;
                  </code>
                  هذه العملية تمنح كل عنصر موضعاً أولياً مثالياً في زمن قياسي O(1).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
                  2. حل التصادم بالمسح الخطي (Linear Probing)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  عندما يمتلك عنصران مختلفان نفس ناتج الهاش (Collision)، لا يمكن وضعهما معاً في نفس الخلية. يقوم المسح الخطي بالتقدم خلية واحدة للأمام:
                  <br />
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800 text-[11px] block my-1">
                    curIn = (curIn + 1) % totalCells;
                  </code>
                  يستمر الفحص حتى العثور على أول خلية فارغة أو مميزة كعنصر محذوف.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  3. سر العقدة المحجوزة (*Del*) في الحذف
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  <strong>لماذا لا نضع null عند حذف عنصر؟</strong>
                  <br />
                  إذا قمنا بمسح الخلية وجعلها null، سيتوقف البحث اللاحق فوراً عند هذه الخلية! وبالتالي لن نتمكن من الوصول للعناصر التي اصطدمت سابقاً وتم تخزينها بعدها في مسار المسح. لذا نضع علامة <span className="text-rose-600 font-mono font-bold">*Del*</span> (بقيمة key = -1) التي تعني: <em className="text-slate-700">"هذه الخلية محذوفة، استمر في البحث عند Find، ولكن يمكنك الكتابة فوقها عند Ins"</em>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  4. مشكلة التجميع الأولي (Primary Clustering)
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  أحد أهم عيوب المسح الخطي؛ بمجرد أن تتجاور بضع خلايا مشغولة، تزداد احتمالية سقوط العناصر الجديدة بجوارها، مما يؤدي إلى نمو كتل متصلة تسمى <strong>العناقيد (Clusters)</strong>. كلما كبر العنقود، طالت مسافة المسح وازدادت المقارنات.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Steps in Robert Lafore's Applet */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="font-bold text-slate-900 mb-3 text-sm">
              أزرار التحكم وآلية التفاعل في بريمج روبرت لافور:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-slate-800 font-mono block mb-1">New</span>
                <span className="text-slate-600">إنشاء جدول جديد بسعة مخصصة N من 0 حتى 60 خلية.</span>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-slate-800 font-mono block mb-1">Fill</span>
                <span className="text-slate-600">ملء الجدول تلقائياً بعدد N من العناصر العشوائية (0–999).</span>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-slate-800 font-mono block mb-1">Ins</span>
                <span className="text-slate-600">إدراج مفتاح جديد N وحساب موضعه والمسح عند التصادم.</span>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-slate-800 font-mono block mb-1">Del</span>
                <span className="text-slate-600">البحث عن المفتاح N واستبداله برمز الحذف الدلالي (*Del*).</span>
              </div>
              <div className="border border-slate-200 p-3 rounded-lg bg-slate-50">
                <span className="font-bold text-slate-800 font-mono block mb-1">Find</span>
                <span className="text-slate-600">تتبع خطوات المسح الخطي حتى إيجاد المفتاح N أو التوقف.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTree) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">
              شرح شجرة البحث الثنائية (Binary Search Tree - BST) - الفصل التاسع
            </h2>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed">
            تُعد <strong className="text-amber-300">الأشجار الثنائية (Binary Trees)</strong> من أهم وأقوى هياكل البيانات في علوم الحاسوب، حيث تجمع بين سرعة البحث في المصفوفات المرتبة <span className="font-mono text-cyan-300">O(log N)</span> ومرونة وسرعة الإدراج والحذف في القوائم المرتبطة. في هذا البريمج التاريخي من <strong className="text-amber-300">الفصل التاسع من كتاب روبرت لافور</strong>، يتم تمثيل شجرة بحث ثنائية كاملة مكونة من 31 موضعاً (بعمق 5 مستويات: 0 إلى 4) باستخدام مصفوفة أحادية البعد <span className="font-mono text-cyan-300">treeArray[31]</span> عبر علاقات فهرسية جبرية دقيقة!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>البحث (Find)</span>
                <Search className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-blue-600">O(log N)</div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              في الشجرة المتوازنة، يتم استبعاد نصف الشجرة المتبقية في كل خطوة مقارنة حتى بلوغ العقدة أو الفراغ.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>الإدراج (Insert)</span>
                <Plus className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-600">O(log N)</div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              تحديد المسار حتى موضع فارغ صالح (عمق 4 كحد أقصى وفهرس ≤ 30)، ثم إنشاء العقدة مباشرة.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>الحذف (Delete)</span>
                <Trash2 className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-600">O(log N)</div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              تحديد موقع العقدة ثم معالجة إحدى الحالات الثلاث (ورقة، ابن وحيد، أو استبدال بالخليفة المتصاعد Successor).
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>الاجتياز المتصاعد (Inorder)</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-600">O(N)</div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              زيارة كافة عقد الشجرة البالغ عددها N عقدة بالترتيب التصاعدي الصارم باستخدام مكدس LIFO غير عودي.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Array Representation Mathematics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Binary className="w-5 h-5 text-indigo-600" />
              1. التمثيل الرياضي للشجرة بالمصفوفة (Array Representation)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              على عكس التنفيذ الشائع باستخدام المؤشرات البرمجية (Pointers/References)، استخدم روبرت لافور في هذا البريمج <strong className="text-slate-800">مصفوفة ثابتة بحجم 31 عنصراً</strong> (<span className="font-mono text-indigo-600">treeArray[0..30]</span>). تعتمد هذه الطريقة على معادلات حسابية رياضية للتحرك بين المستويات:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span>الجذر (Root):</span>
                <span className="font-bold text-indigo-700">الفهرس 0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الابن الأيسر (Left Child للعقدة i):</span>
                <span className="font-bold text-emerald-700">2 × i + 1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الابن الأيمن (Right Child للعقدة i):</span>
                <span className="font-bold text-blue-700">2 × i + 2</span>
              </div>
              <div className="flex items-center justify-between">
                <span>العقدة الأب (Parent للعقدة i):</span>
                <span className="font-bold text-amber-700">(i - 1) / 2</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs leading-relaxed border border-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>شرط سعة المستويات:</strong> تتسع الشجرة لـ 5 مستويات (المستوى 0 يتسع لعقدة 1، المستوى 1 لعقدتين، المستوى 2 لـ 4 عقد، المستوى 3 لـ 8 عقد، والمستوى 4 لـ 16 عقدة = إجمالي 31 عقدة). إذا تطلبت عملية إدراج النزول للمستوى 5 (فهرس &gt; 30)، يُظهر النظام رسالة: <code className="bg-amber-100 px-1 rounded text-rose-700 font-mono">"Can't insert: level is too great"</code>.
              </div>
            </div>
          </div>

          {/* Card 2: BST Property */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Zap className="w-5 h-5 text-amber-500" />
              2. خاصية شجرة البحث الثنائية (BST Invariant)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              تتميز شجرة البحث الثنائية بقاعدة ترتيب جوهرية تنطبق على كل عقدة في الشجرة:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                <span className="font-bold text-emerald-800">الشجرة الفرعية اليسرى (Left Subtree):</span> جميع المفاتيح فيها تكون <strong className="text-emerald-700">أصغر قطعاً</strong> من مفتاح العقدة الأب (<span className="font-mono">key &lt; parent.key</span>).
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded border border-blue-200">
                <span className="font-bold text-blue-800">الشجرة الفرعية اليمنى (Right Subtree):</span> جميع المفاتيح فيها تكون <strong className="text-blue-700">أكبر قطعاً</strong> من مفتاح العقدة الأب (<span className="font-mono">key &gt; parent.key</span>).
              </div>
              <div className="p-2.5 bg-slate-50 text-slate-800 rounded border border-slate-200">
                <span className="font-bold">عدم تكرار المفاتيح (No Duplicates):</span> في تصميم لافور، المفاتيح فريدة ومحصورة تماماً في المجال من <span className="font-mono text-purple-700">0 إلى 99</span>.
              </div>
            </div>
            <p className="text-xs text-slate-500">
              هذه الخاصية تُمكّن خوارزميات البحث والإدراج من اتخاذ قرار حاسم في كل خطوة: الذهاب يساراً أو يميناً، مما يقلص فضاء البحث إلى النصف في كل مستوى.
            </p>
          </div>

          {/* Card 3: Non-Recursive Inorder Traversal */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Layers className="w-5 h-5 text-purple-600" />
              3. الاجتياز المتصاعد غير العودي (Inorder Traversal via Stack)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              عادة ما يتم شرح الاجتياز المتصاعد (يسار $\leftarrow$ جذر $\leftarrow$ يمين) بطريقة الاستدعاء الذاتي (Recursion). لكن لتمكين المستخدم من متابعة العملية خطوة بخطوة بالزر <strong className="text-purple-700">Step</strong>، اعتمد لافور على <strong className="text-slate-800">مكدس صريح (Explicit LIFO Stack)</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
              <li>نبدأ من الجذر، ونتحرك نحو أقصى اليسار مع دفع (<span className="font-mono text-purple-700">push</span>) كل عقدة نمر بها في المكدس.</li>
              <li>عندما نصل لعقدة ليس لها ابن أيسر، نسحب (<span className="font-mono text-purple-700">pop</span>) العقدة من المكدس ونزورها بإضافتها إلى صندوق الزيارة (<span className="font-mono text-blue-700">visitBox</span>).</li>
              <li>نتحرك نحو الابن الأيمن للعقدة المسحوبة، ونكرر العملية.</li>
              <li>تنتهي العملية عندما يصبح المكدس فارغاً ولا توجد عقدة حالية.</li>
            </ol>
            <div className="p-2.5 bg-purple-50 text-purple-900 rounded border border-purple-200 text-xs">
              <strong>النتيجة الرياضية:</strong> قراءة الشجرة بطريقة Inorder تنتج دائماً قائمة مرتبة تصاعدياً بدقة متناهية!
            </div>
          </div>

          {/* Card 4: The 3 Deletion Cases */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <Trash2 className="w-5 h-5 text-rose-600" />
              4. خوارزمية الحذف وحالاتها الثلاث (The 3 Deletion Cases)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              عملية الحذف هي الجزء الأكثر تحدياً في أشجار البحث الثنائية لأنها يجب أن تحافظ على تماسك الشجرة وخاصية الـ BST:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                <strong className="text-emerald-800">الحالة 1 (ورقة Leaf - بدون أبناء):</strong>
                <p className="text-emerald-950 mt-1">تُحذف العقدة ببساطة وتُفرّغ خانتها في المصفوفة (<span className="font-mono">treeArray[curIn] = null</span>).</p>
              </div>
              <div className="p-2.5 bg-blue-50 rounded border border-blue-200">
                <strong className="text-blue-800">الحالة 2 (ابن وحيد Single Child):</strong>
                <p className="text-blue-950 mt-1">يحل الابن الوحيد محل العقدة المحذوفة، وتُزاح كامل الشجرة الفرعية التابعة له نحو الأعلى (<span className="font-mono">moveUpSubTree</span>).</p>
              </div>
              <div className="p-2.5 bg-rose-50 rounded border border-rose-200">
                <strong className="text-rose-800">الحالة 3 (ابنان Two Children - الخليفة Inorder Successor):</strong>
                <p className="text-rose-950 mt-1">
                  نبحث عن <strong className="text-purple-700">الخليفة المتصاعد (Inorder Successor)</strong> وهو أصغر مفتاح في الشجرة الفرعية اليمنى (خطوة يمين ثم يسار حتى النهاية). يتم استبدال العقدة بالخليفة، ثم إزاحة أبناء الخليفة إن وُجدوا.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Practical Summary */}
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 leading-relaxed flex items-center justify-between gap-4">
          <div>
            <strong className="text-slate-900 block mb-1">خلاصة تعليمية لطلاب هياكل البيانات:</strong>
            تُجسد شجرة البحث الثنائية التوازن المثالي بين سرعة القراءة وسرعة التعديل. من خلال تجربة الأزرار بالأعلى (Fill, Find, Ins, Trav, Del)، يمكنك رؤية كيف يقفز مؤشر السهم الأحمر (<span className="font-mono text-rose-600">curIn</span>) عبر الشجرة بمعدل زمني لا يتجاوز 5 خطوات كحد أقصى للوصول لأي عقدة من بين الـ 31 عقداً!
          </div>
        </div>
      </div>
    );
  }

  if (isMergeSort) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">
              شرح خوارزمية ترتيب الدمج (Merge Sort) ومبدأ فرّق تسد (Divide & Conquer)
            </h2>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            يُعد ترتيب الدمج حجر الأساس في <strong className="text-amber-300">الفصل الثامن من كتاب روبرت لافور</strong>.
            تعتمد الخوارزمية استراتيجية <strong className="text-cyan-300">فرّق تَسُد (Divide and Conquer)</strong>، حيث تُقسّم المصفوفة بالتنصيف العودي حتى الوصول إلى عناصر مفردة، ثم تُعيد دمج المصفوفات الجزئية المرتبة تباعاً داخل مصفوفة مساعدة <span className="font-mono text-emerald-300">workSpace</span>.
            أهم ميزة تاريخية وعملية لترتيب الدمج هي <strong className="text-amber-300">الضمان الرياضي الصارم</strong> لزمن تنفيذ <span className="font-mono text-emerald-300">O(N log N)</span> في أسوأ الحالات كما في أفضلها!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الحالة الفضلى (Best)
                </span>
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                O(N log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                شجرة تقسيم ثنائية متوازنة بارتفاع log₂ N مع دمج خطي عند كل مستوى.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
              مقارنات = N log₂ N
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الحالة المتوسطة (Average)
                </span>
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Timer className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-blue-600 font-mono">
                O(N log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                سلوك زمني فائق الاستقرار والتنبؤ لا يتأثر بطبيعة توزيع المدخلات.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-blue-700 font-medium">
              أداء منتظم وموثوق
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الأسوأ (Worst)
                </span>
                <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-indigo-600 font-mono">
                O(N log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                مضمون بالكامل! لا يوجد أي سيناريو مدخلات يُسبب التدهور إلى O(N²).
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-indigo-700 font-medium">
              أقصى مقارنات: N log₂ N - N + 1
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  التعقيد المكاني (Space)
                </span>
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                O(N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                يتطلب مصفوفة مساعدة workSpace بحجم N لدمج العناصر قبل إعادتها.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
              المقايضة الرئيسية: ذاكرة إضافية
            </div>
          </div>
        </div>

        {/* The 10-State Machine Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Binary className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              هندسة بريمج روبرت لافور: آلة الحالات العشر (10-State Divide & Conquer Machine)
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            نظراً لأن واجهات المستخدم الرسومية أحادية المسار (Single-threaded Event Loops) لا تسمح بالاستدعاء العودي المباشر (Recursion) مع إمكانية التوقف خطوة بخطوة (Step-by-step Execution)، قام لافور في كلاس <code className="font-mono text-blue-700 font-bold">personGroup.class</code> ببناء مكدس استدعاءات صريح <code className="font-mono text-purple-700 font-bold">theStack</code> يحمل كائنات <code className="font-mono text-emerald-700 font-bold">params(lower, upper, mid, returnCode)</code> ويدير 10 حالات دقيقة:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-blue-800 flex items-center justify-between">
                <span>الحالة 1: الاستدعاء الأولي (Initial Call)</span>
                <span className="font-mono text-[10px] bg-blue-100 px-1.5 py-0.5 rounded">codePart = 1</span>
              </div>
              <p className="text-slate-600">
                دفع أول إطار تفعيل لكامل المصفوفة <code className="font-mono text-blue-600">params(0, aSize - 1, 0, 6)</code> إلى المكدس مع الانتقال إلى فحص الحالة الأساسية (codePart = 2).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-indigo-800 flex items-center justify-between">
                <span>الحالة 2: فحص شرط التوقف (Base Case Check)</span>
                <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded">codePart = 2</span>
              </div>
              <p className="text-slate-600">
                معاينة قمة المكدس. إذا كان <code className="font-mono text-indigo-600">lower == upper</code> (نطاق من عنصر واحد مرتب بذاته)، ينتقل إلى العودة (codePart = 7). وإلا ينتقل إلى التنصيف (codePart = 4).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-cyan-800 flex items-center justify-between">
                <span>الحالة 4: فرز النصف السفلي (Lower Half)</span>
                <span className="font-mono text-[10px] bg-cyan-100 px-1.5 py-0.5 rounded">codePart = 4</span>
              </div>
              <p className="text-slate-600">
                حساب المنتصف <code className="font-mono text-cyan-600">mid = (lower + upper) / 2</code>، ودفع الإطار <code className="font-mono">params(lower, mid, mid, 5)</code>، ثم العودة عودياً إلى الحالة 2.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-teal-800 flex items-center justify-between">
                <span>الحالة 5: فرز النصف العلوي (Upper Half)</span>
                <span className="font-mono text-[10px] bg-teal-100 px-1.5 py-0.5 rounded">codePart = 5</span>
              </div>
              <p className="text-slate-600">
                عند اكتمال فرز النصف السفلي، يتم استدعاء النصف العلوي بدفع <code className="font-mono text-teal-600">params(mid + 1, upper, mid, 6)</code>، والعودة للحالة 2.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-amber-800 flex items-center justify-between">
                <span>الحالة 6: تهيئة الدمج (Setup Merge)</span>
                <span className="font-mono text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">codePart = 6</span>
              </div>
              <p className="text-slate-600">
                كلا النصفين مرتبان الآن! يتم تجهيز مؤشرات الدمج: <code className="font-mono text-amber-700">lowPtrM = lower</code> و <code className="font-mono text-amber-700">highPtrM = mid + 1</code> ثم الانتقال للدمج (codePart = 9).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-purple-800 flex items-center justify-between">
                <span>الحالة 9: الدمج في مساحة العمل (Merge to WorkSpace)</span>
                <span className="font-mono text-[10px] bg-purple-100 px-1.5 py-0.5 rounded">codePart = 9</span>
              </div>
              <p className="text-slate-600">
                مقارنة أصغر العناصر المتبقية في النصفين ونسخ الأصغر إلى <code className="font-mono text-purple-700">workSpace</code> خطوة بخطوة مع زيادة عداد المقارنات والنسخ.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-emerald-800 flex items-center justify-between">
                <span>الحالة 10: النسخ العكسي (Copy Back to Array)</span>
                <span className="font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">codePart = 10</span>
              </div>
              <p className="text-slate-600">
                نسخ العناصر المرتبة من <code className="font-mono text-emerald-700">workSpace</code> إلى موضعها الحقيقي في المصفوفة الأصلية <code className="font-mono">theArray</code> باستخدام المؤشر الأحمر ptr.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
              <div className="font-bold text-rose-800 flex items-center justify-between">
                <span>الحالتان 7 و 8: تفريغ المكدس والاكتمال</span>
                <span className="font-mono text-[10px] bg-rose-100 px-1.5 py-0.5 rounded">codePart = 7, 8</span>
              </div>
              <p className="text-slate-600">
                سحب الإطار الحالي <code className="font-mono text-rose-700">pop()</code>. إذا فرغ المكدس يُعلن اكتمال الترتيب (codePart = 8)، وإلا يستأنف تنفيذ الإطار السابق بحسب كود العودة (5 أو 6).
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              مقارنة هندسية معمقة: Merge Sort مقابل QuickSort 1 و QuickSort 2
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3">الخاصية الهندسية</th>
                  <th className="p-3 text-blue-700">ترتيب الدمج (Merge Sort)</th>
                  <th className="p-3 text-slate-700">الترتيب السريع 1 (QuickSort 1)</th>
                  <th className="p-3 text-emerald-700">الترتيب السريع 2 (Median-of-Three)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">التعقيد في أسوأ حالة</td>
                  <td className="p-3 text-emerald-700 font-mono font-bold">O(N log N) مضمون</td>
                  <td className="p-3 text-rose-600 font-mono font-bold">O(N²) (بيانات مرتبة/معكوسة)</td>
                  <td className="p-3 text-emerald-700 font-mono font-bold">O(N log N) عملياً</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">استقرار الترتيب (Stability)</td>
                  <td className="p-3 text-emerald-700 font-semibold">مستقر (Stable) تماماً</td>
                  <td className="p-3 text-amber-700 font-semibold">غير مستقر (Unstable)</td>
                  <td className="p-3 text-amber-700 font-semibold">غير مستقر (Unstable)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">الذاكرة الإضافية (Memory)</td>
                  <td className="p-3 text-rose-600 font-mono font-bold">O(N) (workSpace إضافية)</td>
                  <td className="p-3 text-emerald-700 font-mono font-bold">O(log N) (فقط المكدس)</td>
                  <td className="p-3 text-emerald-700 font-mono font-bold">O(log N) (فقط المكدس)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">عدد عمليات النسخ</td>
                  <td className="p-3 text-amber-700 font-mono">2N log₂ N عملية نسخ</td>
                  <td className="p-3 text-emerald-700 font-mono">أقل بكثير (فقط Swaps)</td>
                  <td className="p-3 text-emerald-700 font-mono">أقل بكثير (فقط Swaps)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">الاستخدام الأمثل</td>
                  <td className="p-3 text-slate-600">القوائم المرتبطة والفرز الخارجي (External Sort)</td>
                  <td className="p-3 text-slate-600">المصفوفات في الذاكرة العشوائية العامة</td>
                  <td className="p-3 text-slate-600">المكتبات القياسية للغات (مثل Arrays.sort)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (isQuickSort2) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">
              شرح خوارزمية الترتيب السريع 2: تجزيء وسيط الثلاثة (Median-of-Three Partitioning)
            </h2>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed">
            يُمثل هذا البريمج الذروة الهندسية في <strong className="text-amber-300">الفصل الثامن من كتاب روبرت لافور</strong>.
            يعالج هذا البريمج نقطة الضعف القاتلة في الترتيب السريع التقليدي (QuickSort 1): وهي تدهور زمن التنفيذ إلى <strong className="text-rose-300 font-mono">O(N²)</strong> عندما تكون البيانات مرتبة مسبقاً أو مرتبة عكسياً.
            باستخدام أسلوب <strong className="text-emerald-300">وسيط الثلاثة (Median-of-Three)</strong>، تختار الخوارزمية العناصر الثلاثة عند البداية والوسط والنهاية، ترتبها، وتضع الوسيط كمحور ارتكاز عند <span className="font-mono text-cyan-300">right - 1</span>، محققة أداءً فائق الاستقرار يقارب <span className="font-mono text-amber-300">O(N log N)</span> في جميع الحالات العملية!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الحالة الفضلى (Best)
                </span>
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                O(N log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                تقسيم مثالي ومتوازن تماماً للمصفوفة إلى نصفين متساويين في كل مرحلة تجزيء.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
              مقارنات = N log₂ N
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الحالة المتوسطة (Average)
                </span>
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                  <Timer className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-blue-600 font-mono">
                O(N log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                في التوزيعات العشوائية، تكون المقارنات أقل بنسبة 20% إلى 30% من QuickSort 1.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-blue-700 font-medium">
              أداء قياسي في لغات الإنتاج
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الحالة الأسوأ (Worst)
                </span>
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">
                O(N log N)*
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                تم القضاء عملياً على أسوأ حالة في المصفوفات المرتبة والمعكوسة بفضل اختيار الوسيط.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
              محمية ضد التدهور الشائع
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  الذاكرة الإضافية (Space)
                </span>
                <span className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Layers className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-purple-600 font-mono">
                O(log N)
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                فرز موضعي بالكامل (In-place)؛ الذاكرة تقتصر على حدود مكدس الاستدعاءات العودي.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-purple-700 font-medium">
              مكدس صريح (Explicit Stack)
            </div>
          </div>
        </div>

        {/* Detailed Mechanics: Median of Three */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Zap className="w-5 h-5 text-emerald-600" />
            كيف يعمل مبدأ وسيط الثلاثة (Median-of-Three Partitioning)؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px]">1</span>
                فحص وترتيب الأطراف والوسط
              </span>
              <p className="text-slate-600 leading-relaxed">
                تقوم الخوارزمية باختيار ثلاثة عناصر من المصفوفة الجزئية:
                <br /><code className="font-mono text-emerald-700">theArray[left]</code>،
                <br /><code className="font-mono text-blue-700">theArray[center]</code> حيث <code className="font-mono">center=(left+right)/2</code>،
                <br /><code className="font-mono text-purple-700">theArray[right]</code>.
                يتم ترتيب هذه العناصر الثلاثة يدوياً عبر 3 مقارنات فقط:
                بحيث يصبح <code className="font-mono">theArray[left] &le; theArray[center] &le; theArray[right]</code>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-teal-800 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 flex items-center justify-center text-[10px]">2</span>
                إخفاء المحور عند right - 1 كحارس طبيعي
              </span>
              <p className="text-slate-600 leading-relaxed">
                بعد ترتيب الثلاثة عناصر، يتم تبديل الوسيط <code className="font-mono">center</code> مع العنصر قبل الأخير <code className="font-mono">right - 1</code> ليصبح المحور (Pivot).
                الميزة العبقرية هنا:
                <br />• العنصر <code className="font-mono">theArray[left]</code> أصغر من المحور (حارس أيسر يمنع تجاوز المؤشر لليسار).
                <br />• العنصر <code className="font-mono">theArray[right]</code> أكبر من المحور (حارس أيمن يمنع تجاوز المؤشر لليمين).
                وبالتالي لا نحتاج لفحص حدود المصفوفة داخل حلقة المسح السريع!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-indigo-800 text-sm flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-200 text-indigo-900 flex items-center justify-center text-[10px]">3</span>
                معالجة المصفوفات الصغيرة (Base Cases)
              </span>
              <p className="text-slate-600 leading-relaxed">
                عندما يكون حجم المصفوفة الجزئية صغيراً جداً:
                <br />• <strong>حجم 1:</strong> مرتبة تلقائياً، لا تتطلب أي إجراء.
                <br />• <strong>حجم 2:</strong> مقارنة واحدة وتبديل مباشر إن لزم الأمر.
                <br />• <strong>حجم 3:</strong> ترتيب العناصر الثلاثة مباشرة وإنهاء العملية.
                هذا التبسيط يعفي الخوارزمية من عبء استدعاءات التجزيء للمصفوفات المتناهية في الصغر.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table: QuickSort 1 vs QuickSort 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            مقارنة جوهرية: QuickSort 1 مقابل QuickSort 2
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <th className="p-3 font-bold">وجه المقارنة</th>
                  <th className="p-3 font-bold text-blue-900">الترتيب السريع 1 (QuickSort 1)</th>
                  <th className="p-3 font-bold text-emerald-900">الترتيب السريع 2 (QuickSort 2 - وسيط الثلاثة)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">اختيار المحور (Pivot)</td>
                  <td className="p-3 text-slate-600">العنصر الأقصى يميناً دائماً (<code className="font-mono">theArray[right]</code>)</td>
                  <td className="p-3 text-emerald-700 font-semibold">وسيط الثلاثة: ترتيب (left, center, right) ووضعه عند <code className="font-mono">right - 1</code></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">الأداء على مصفوفة مرتبة أو معكوسة</td>
                  <td className="p-3 text-rose-600 font-bold">يتدهور إلى O(N²) بسبب التقسيم غير المتوازن (0 و N-1)</td>
                  <td className="p-3 text-emerald-700 font-bold">يحافظ على O(N log N) لأن المحور هو العنصر الأوسط الفعلي</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">فحص حدود المؤشرات (Sentinels)</td>
                  <td className="p-3 text-slate-600">يتطلب فحوصات إضافية لتفادي الخروج عن حدود المصفوفة</td>
                  <td className="p-3 text-emerald-700 font-semibold">العنصران left و right يعملان كحراس طبيعيين (Sentinels) بدون فحص</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-800">المصفوفات الصغيرة (حجم &le; 3)</td>
                  <td className="p-3 text-slate-600">تستمر في استدعاءات التجزيء حتى حجم 1</td>
                  <td className="p-3 text-emerald-700 font-semibold">تُرتب يدوياً بخطوة واحدة مباشرة دون تقسيم إضافي</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* State Machine Steps */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Binary className="w-5 h-5 text-teal-600" />
            حالات آلة الحالة المنطقية المستخرجة من بايت كود جافا (codePart)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-blue-700">codePart = 0:</span>
              <p className="text-slate-600 font-sans mt-1">نقطة الدخول إلى quickSort؛ حساب size، وتحديد نوع المعالجة (1 أو 2 أو 3 أو أكثر من 3 عناصر).</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-teal-700">codePart = 1:</span>
              <p className="text-slate-600 font-sans mt-1">ترتيب عناصر وسيط الثلاثة (left, center, right)، وتعيين pivot = center للتقسيم.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-purple-700">codePart = 15:</span>
              <p className="text-slate-600 font-sans mt-1">تبديل المحور pivot مع right-1 ووضع المؤشرات: leftScan = left, rightScan = right-1.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-rose-700">codePart = 2 & 3:</span>
              <p className="text-slate-600 font-sans mt-1">حلقة المسح المزدوج: تحريك leftScan لليمين و rightScan لليسار وتحديث عداد المقارنات.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-amber-700">codePart = 4 & 5:</span>
              <p className="text-slate-600 font-sans mt-1">تبديل leftScan مع rightScan إذا لم يلتقيا، أو تبديل leftScan مع المحور عند التقائهما.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-bold text-emerald-700">codePart = 6 & 7:</span>
              <p className="text-slate-600 font-sans mt-1">دفع الجزء الأيمن للمكدس، ومعالجة الجزء الأيسر، ثم استرجاع الأجزاء من المكدس حتى اكتمال الترتيب.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isQuickSort1) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold">
              شرح خوارزمية الترتيب السريع 1 (Robert Lafore's QuickSort 1)
            </h2>
          </div>
          <p className="text-sm text-sky-100 leading-relaxed">
            يفتتح <strong className="text-amber-300">الفصل الثامن: خوارزميات الفرز المتقدمة ومبدأ فرّق تسد (Advanced Sorting)</strong> من كتاب روبرت لافور بهذا البريمج التوضيحي البديع.
            تُعد خوارزمية <strong className="text-cyan-300">الترتيب السريع (QuickSort)</strong> التي اخترعها السير توني هور عام 1959 الخوارزمية الأكثر استخداماً في المكتبات القياسية عالمياً.
            يعتمد هذا البريمج على <strong className="text-yellow-300">اختيار العنصر الأقصى يميناً كمحور ارتكاز (Pivot at Right)</strong>، ثم تقسيم المصفوفة إلى قسمين عبر مؤشري مسح متقابلين <span className="text-rose-300 font-mono">leftScan</span> و <span className="text-fuchsia-300 font-mono">rightScan</span>.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <Zap className="w-3.5 h-3.5" /> التعقيد المتوسط
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">O(N log N)</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">O(N log N)</p>
              <p className="text-xs text-slate-600 mt-2">
                في معظم الحالات العشوائية، تحقق الخوارزمية أداءً فائق السرعة متفوقة على الترتيب بالدمج وترتيب الكومة بفضل الحلقات الداخلية المضغوطة وتوافق الذاكرة الخبيئة (Cache Locality).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              أسرع خوارزمية فرز مقارنات عملية
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  <Timer className="w-3.5 h-3.5" /> الحالة الأسوأ (Worst Case)
                </span>
                <span className="text-xs font-mono font-bold text-rose-600">O(N^2)</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">O(N^2)</p>
              <p className="text-xs text-slate-600 mt-2">
                تحدث إذا كانت المصفوفة مرتبة مسبقاً (تصاعدياً أو تنازلياً)، حيث يكون المحور الأيمن دائماً هو الأكبر أو الأصغر مما يجعل التقسيم غير متوازن بتاتاً (1 عنصر مقابل N-1).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              لهذا السبب تم ابتكار QuickSort 2 (وسيط الثلاثة)
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  <Layers className="w-3.5 h-3.5" /> استهلاك الذاكرة (Stack)
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600">O(log N)</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">O(log N)</p>
              <p className="text-xs text-slate-600 mt-2">
                الترتيب السريع يتم في نفس المكان (<span className="font-semibold">In-place</span>) ولا يحتاج مصفوفة مساعدة مثل Merge Sort، ويقتصر استهلاك الذاكرة على مكدس الاستدعاءات العودي فقط.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              توفير هائل للذاكرة مقارنة بـ Merge Sort
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <ShieldAlert className="w-3.5 h-3.5" /> الاستقرار (Stability)
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">Unstable</span>
              </div>
              <p className="text-lg font-bold text-slate-900">غير مستقرة</p>
              <p className="text-xs text-slate-600 mt-2">
                قد تُغير الخوارزمية الترتيب النسبي للعناصر المتساوية في القيمة نتيجة التبديلات البعيدة المدى عبر مؤشري leftScan و rightScan.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              تضحية مقبولة مقابل السرعة القصوى
            </div>
          </div>
        </div>

        {/* The 4-Stage Partitioning Mechanism */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600" />
            آلية التقسيم بمحور الارتكاز الأيمن (Rightmost Pivot Partitioning)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            العمود الفقري للترتيب السريع هو دالة التقسيم <span className="font-mono font-bold text-indigo-600">partition()</span>. في هذا البريمج (QuickSort 1) تُنفذ الخطوات الأربع التالية:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-mono">1</span>
                تحديد المحور (Pivot)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                يتم اختيار العنصر في الطرف الأيمن للمصفوفة الجزئية <span className="font-mono font-bold">theArray[right]</span> ليكون هو المحور (Pivot) الذي ستُقارن به جميع العناصر.
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-cyan-300 p-2 rounded">
                pivot = theArray[right];
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs font-mono">2</span>
                المسح المتقابل
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                يتحرك <strong className="text-rose-600">leftScan</strong> لليمين باحثاً عن عنصر أكبر من المحور، بينما يتحرك <strong className="text-fuchsia-600">rightScan</strong> لليسار باحثاً عن عنصر أصغر.
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-rose-300 p-2 rounded">
                while(arr[++leftScan] &lt; pivot);
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-mono">3</span>
                تبديل الشواذ
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                طالما لم يتقاطع المؤشران (<span className="font-mono">leftScan &lt; rightScan</span>)، يتم تبديل العنصرين لإعادة كل منهما إلى جهته الصحيحة، ثم يُستأنف المسح.
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-amber-300 p-2 rounded">
                swap(leftScan, rightScan);
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-mono">4</span>
                استقرار المحور
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                عند تقاطع المؤشرين، يتم تبديل المحور من موقعه في <span className="font-mono">right</span> مع <span className="font-mono">leftScan</span>. الآن أصبح المحور في مكانه النهائي النهائي المؤكد!
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-emerald-300 p-2 rounded">
                swap(leftScan, right);
              </div>
            </div>
          </div>
        </div>

        {/* How Robert Lafore's 8-State Simulation Works */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            كيف صمم روبرت لافور محاكاة الترتيب السريع بدون تجميد الواجهة (8-State Machine)؟
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            الاستدعاء العودي المباشر لدالة <span className="font-mono text-indigo-600 font-bold">recQuickSort()</span> ينفذ ملايين العمليات في أجزاء من الثانية دون إمكانية إيقاف الشاشة لكل خطوة أو تحريك المؤشرات تدريجياً. ولحل هذه المعضلة صمم روبرت لافور في بايت كود <span className="font-mono font-bold">personGroup.class</span> آلة حالات تتكون من 8 مراحل دقيقة:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                مكدس الحدود اليدوي (leftStack & rightStack)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                بدلاً من ترك النظام يدفع إطارات الاستدعاء العودي في مكدس نظام التشغيل، تستخدم الخوارزمية كائني مكدس <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">stack</span> لحفظ حدود المصفوفات الجزئية التي ستُفرز لاحقاً (<span className="font-mono text-slate-700">leftScan + 1</span> و <span className="font-mono text-slate-700">right</span>).
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                التحول السلس بين الخطوات (codePart = 1..8)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                كل استدعاء لدالة <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">sortStep()</span> ينفذ حالة واحدة فقط: (1) فحص الطول، (2) تهيئة المسح، (3) البحث عن الشواذ، (4) تبديل الشواذ، (5) تبديل المحور، (6) دفع القسم الأيمن للمكدس وفرز الأيسر، (7) سحب القسم التالي من المكدس، (8) إعلان اكتمال الفرز!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTowers) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-fuchsia-400" />
            <h2 className="text-xl font-bold">
              شرح أبراج هانوي والعودية (Robert Lafore's Towers of Hanoi & Recursion)
            </h2>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            يُعد لغز <strong className="text-amber-300">أبراج هانوي (Towers of Hanoi)</strong> المثال الأبرز والأكثر إبهاراً في <strong className="text-fuchsia-300">الفصل السادس: العودية (Recursion)</strong> من كتاب روبرت لافور.
            يطلب اللغز نقل برج كامل مكون من <span className="font-mono text-emerald-300">N</span> قرصاً من العمود الأول (A) إلى العمود الأخير (C) باستخدام العمود الأوسط (B) كمحطة وسيطة،
            مع التقيد بشرطين جوهريين: <strong className="text-yellow-300">تحريك قرص واحد فقط في كل خطوة</strong>، و<strong className="text-rose-300">عدم وضع قرص أكبر فوق قرص أصغر منه نهائياً</strong>.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  <Zap className="w-3.5 h-3.5" /> عدد الحركات الإجمالي
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">2^N - 1</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">2^N - 1</p>
              <p className="text-xs text-slate-600 mt-2">
                لـ 3 أقراص: 7 حركات، لـ 5 أقراص: 31 حركة، ولـ 64 قرصاً يحتاج الرهبان إلى 18.4 كوينتيليون حركة (نحو 584 مليار سنة)!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              الحد الأدنى الدقيق للحل الأمثل
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  <Timer className="w-3.5 h-3.5" /> التعقيد الزمني
                </span>
                <span className="text-xs font-mono font-bold text-purple-600">O(2^N)</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">O(2^N)</p>
              <p className="text-xs text-slate-600 mt-2">
                نمو أسي يتضاعف مع إضافة كل قرص جديد، مما يجعل الخوارزمية العودية حلّاً مثالياً للأعداد الصغيرة ولكنه يفيض زمنياً للأعداد الكبيرة.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              دالة التكرار: T(N) = 2T(N-1) + 1
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <Layers className="w-3.5 h-3.5" /> عمق مكدس الاستدعاءات
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">O(N)</span>
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono">O(N)</p>
              <p className="text-xs text-slate-600 mt-2">
                أقصى عمق يصل إليه مكدس الاستدعاءات (Call Stack) يساوي عدد الأقراص N فقط، لأن الخوارزمية تنفذ فرعاً عودياً واحداً وتنهيه قبل بدء الآخر.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              استهلاك اقتصادي جداً لذاكرة المكدس
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <ShieldAlert className="w-3.5 h-3.5" /> التحقق من صحة القواعد
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">Strict</span>
              </div>
              <p className="text-lg font-bold text-slate-900">حماية فيزيائية</p>
              <p className="text-xs text-slate-600 mt-2">
                عند السحب والإفلات بالماوس (Drag & Drop)، يمنع البريمج أي حركة تخالف القاعدة ويعيد القرص إلى موضعه الأصلي فوراً مع تنبيه باللون الأحمر.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              محاكاة واقعية للعبة التعليمية
            </div>
          </div>
        </div>

        {/* The 3-Step Recursive Algorithm */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600" />
            استراتيجية الخوارزمية العودية الثلاثية (The 3-Step Recursive Strategy)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            تعتمد عبقرية الحل العودي على تبسيط المسألة المعقدة لنقل <span className="font-mono font-bold">N</span> قرصاً إلى 3 خطوات بديهية ومكررة:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-mono">1</span>
                نقل الأقراص العلوية (N-1)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                استدعاء عودي لنقل الـ <span className="font-mono font-bold">N-1</span> قرص العلوية من البرج المصدري (<strong className="text-slate-900">from</strong>) إلى البرج الوسيط (<strong className="text-slate-900">inter</strong>) باستخدام البرج الهدف (<strong className="text-slate-900">to</strong>) كمحطة مساعدة.
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-indigo-300 p-2 rounded">
                doTowers(n-1, from, inter, to);
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-mono">2</span>
                نقل القرص الأكبر الوحيد
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                الآن أصبح البرج المصدري لا يحتوي إلا على القرص السفلي الأكبر (رقم <span className="font-mono font-bold">N</span>)، والبرج الهدف فارغ أو يحتوي أقراصاً أكبر، فيتم نقله مباشرة إلى الهدف.
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-emerald-300 p-2 rounded">
                moveDisk(from, to); // نواتج النقل
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col">
              <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-mono">3</span>
                إعادة الأقراص (N-1) فوقه
              </div>
              <p className="text-xs text-slate-600 leading-relaxed flex-1">
                استدعاء عودي ثانٍ لنقل الـ <span className="font-mono font-bold">N-1</span> قرص التي تركناها في البرج الوسيط (<strong className="text-slate-900">inter</strong>) ووضعها فوق القرص الأكبر في الهدف (<strong className="text-slate-900">to</strong>).
              </p>
              <div className="mt-3 pt-2 font-mono text-[11px] bg-slate-900 text-purple-300 p-2 rounded">
                doTowers(n-1, inter, to, from);
              </div>
            </div>
          </div>
        </div>

        {/* How Robert Lafore Simulated the Call Stack */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            كيف صمم روبرت لافور آلة الحالات لمحاكاة مكدس الاستدعاءات (Call Stack Simulation)؟
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            في بريمجات جافا الرسومية الكلاسيكية، لا يمكن كتابة دالة عودية تقليدية تتوقف في منتصفها لانتظار ضغطة زر <strong className="text-slate-900">Step</strong> أو الانتظار الزمني لزر <strong className="text-slate-900">Run</strong>، لأن ذلك سيجمد خيط واجهة المستخدم (Event Dispatch Thread). لذلك قام لافور بابتكار بنية عبقرية:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                سجل التفعيل اليدوي (Explicit Stack Frame)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                استخدم لافور كلاس <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">params</span> لتخزين متغيرات كل استدعاء (<span className="font-mono text-slate-700">nDisks, fromTower, toTower, interTower, returnCode</span>) داخل كائن مكدس يدوي <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">stack</span> بدلاً من مكدس نظام التشغيل.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                آلة الحالات الثمانية (8-State Machine)
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                قسّم دالة <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-indigo-600 font-bold">step()</span> إلى 8 أجزاء (<span className="font-mono text-slate-700">codePart = 1..8</span>)، حيث يقوم كل استدعاء عودي بدفع المعاملات مع عنوان العودة <span className="font-mono text-slate-700">returnCode</span> (مثل 5 أو 7 أو 8)، ثم الانتقال للحالة 2. عند الانتهاء يُسحب السجل ويُستأنف الكود من نقطة العودة بدقة متناهية.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLinkList) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold">
              شرح القوائم المرتبطة (Robert Lafore's Linked List)
            </h2>
          </div>
          <p className="text-sm text-sky-100 leading-relaxed">
            يمثل هذا البريمج البنية التعليمية الأساسية في <strong className="text-amber-300">الفصل الخامس: القوائم المرتبطة (Linked Lists)</strong> من كتاب روبرت لافور الشهير.
            على خلاف المصفوفات التي تتطلب كتلة ذاكرة متصلة وحجماً ثابتاً، تتكون <strong className="text-cyan-300">القائمة المرتبطة</strong> من عقد مستقلة (<span className="text-amber-300 font-mono">Link / Node</span>) مبعثرة في الذاكرة العشوائية،
            ترتبط ببعضها بواسطة <strong className="text-emerald-300">مؤشرات الإحالة (next references)</strong>، وتوفر ميزة حاسمة: <strong className="text-yellow-300">إدراج وحذف فوري دون الحاجة لإزاحة أي بيانات!</strong>
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Unsorted Insertion */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <Zap className="w-3.5 h-3.5" /> إدراج غير مرتب (Unsorted)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتم الإدراج دائماً في رأس القائمة (<strong className="text-emerald-700">First</strong>) بخطوتين فقط: توجيه المؤشر <code className="bg-slate-100 px-1 rounded">newLink.next = first</code> ثم جعل <code className="bg-slate-100 px-1 rounded">first = newLink</code> في زمن فوري مطلق!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              إدراج مباشر في المقدمة دون مسح
            </div>
          </div>

          {/* Sorted Insertion */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  <Plus className="w-3.5 h-3.5" /> إدراج مرتب (Sorted)
                </span>
                <span className="font-mono text-sm font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  O(N)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتحرك المؤشر <strong className="text-blue-700">curIn</strong> خطوة بخطوة حتى يجد الموضع المناسب بحيث تكون العقدة السابقة أصغر والعقدة اللاحقة أكبر، ثم يتم تشبيك الروابط (<span className="text-emerald-600 font-semibold">Splice</span>) في زمن $O(1)$.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              بحث خطي O(N) وتشبيك روابط O(1)
            </div>
          </div>

          {/* Find Complexity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  <Search className="w-3.5 h-3.5" /> البحث (Find)
                </span>
                <span className="font-mono text-sm font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  O(N)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                لا يمكن تطبيق البحث الثنائي في القوائم المرتبطة لعدم توفر الوصول العشوائي (No Indexing). يتم الانتقال عبر الرابط <code className="bg-slate-100 px-1 rounded">current = current.next</code> حتى مطابقة المفتاح.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              مسح تتابعي متسلسل Linear Traversal
            </div>
          </div>

          {/* Delete Complexity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  <Trash2 className="w-3.5 h-3.5" /> الحذف (Delete)
                </span>
                <span className="font-mono text-sm font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  O(N)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتطلب البحث عن العقدة والعقدة السابقة لها $O(N)$، بينما عملية الحذف الفعلية تتم بمجرد تحويل المؤشر (<span className="text-rose-700 font-semibold">Bypass</span>): <code className="bg-slate-100 px-1 rounded">prev.next = cur.next</code> دون أي إزاحة للخلايا!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              تجاوز المؤشر Bypass بدون إزاحة Shift
            </div>
          </div>
        </div>

        {/* Visual Architecture and Grid Mechanics */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-600" />
            هندسة العرض البصري وشبكة العقد في بريمج لافور (7 أعمدة × 4 صفوف = 28 عقدة كحد أقصى)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-1">
              <span className="font-bold text-blue-700 block">
                🔷 مؤشر الرأس First (أزرق - Top-Left)
              </span>
              <p className="text-slate-600">
                يشير دائماً إلى أول عقدة في السلسلة. إذا كانت القائمة فارغة يشير إلى علامة الأرضية (Null Ground).
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-700 block">
                ↪ الأسهم الأفقية والالتفاف المتعرج (Serpentine Wrap)
              </span>
              <p className="text-slate-600">
                تربط الأسهم كل عقدة بالعقدة التالية أفقياً. وعند الوصول لنهاية الصف (العمود 7)، يلتف السهم بشكل منحني متعرج ليدخل إلى بداية الصف التالي من اليسار!
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200 space-y-1">
              <span className="font-bold text-rose-700 block">
                🔻 مؤشر البحث والتتبع curIn (أحمر)
              </span>
              <p className="text-slate-600">
                سهم رأسي أحمر يتحرك فوق العقد أثناء عمليات الإدراج المرتب، البحث، والحذف؛ يوضح بدقة مسار تتبع المعالج.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Operations Guide */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            دليل العمليات وخوارزمية لافور التفصيلية (Step-by-Step Operations)
          </h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-100 space-y-1">
              <span className="font-bold text-sky-900 block">
                1. إنشاء قائمة جديدة (New - With N items):
              </span>
              <p className="text-slate-700">
                يقبل البريمج عدداً بين 0 و 28. يقوم بتوليد عقد عشوائية بقيم مفاتيح من 0 إلى 999. إذا كان خيار <code className="font-mono font-bold text-sky-800">Unsorted</code> مفعلاً تُدرج العقد في الرأس بترتيب الوصول، أما إذا كان <code className="font-mono font-bold text-indigo-800">Sorted</code> فترتب العقد تصاعدياً تلقائياً.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-900 block">
                2. عملية الإدراج والتشبيك (Ins - Insert Splice):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><strong>في الوضع غير المرتب (Unsorted):</strong> تُنشأ العقدة وتوضع فوراً في رأس القائمة <code className="font-mono">first = newLink</code> في زمن $O(1)$.</li>
                <li><strong>في الوضع المرتب (Sorted):</strong> يتم تتبع السلسلة خطوة بخطوة ومقارنة قيمة المفتاح الجديد مع كل عقدة.</li>
                <li>عند الوصول للموضع المناسب، تظهر حركة التشبيك البصرية (<span className="text-emerald-700 font-bold">Splice</span>)، حيث تُعرض العقدة المؤقتة وترسم خطوط التوصيل الخضراء الجديدة لإعادة ربط المؤشرات.</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100 space-y-1">
              <span className="font-bold text-purple-900 block">
                3. البحث التتابعي (Find):
              </span>
              <p className="text-slate-700">
                يبدأ المؤشر الأحمر <code className="font-mono">curIn</code> من العقدة الأولى <code className="font-mono">first</code> ويتحرك للأمام. في القائمة المرتبة، إذا تجاوزت قيمة العقدة الحالية قيمة المفتاح المطلوب، يتوقف البحث مبكراً لعدم إمكانية وجود المفتاح لاحقاً!
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100 space-y-1">
              <span className="font-bold text-rose-900 block">
                4. الحذف وتجاوز الرابط (Del - Delete Bypass):
              </span>
              <p className="text-slate-700">
                يحدد موقع العقدة المراد حذفها، ثم يعرض البريمج حركة التجاوز (<span className="text-rose-700 font-bold">Bypass</span>): تظهر العقدة المحذوفة بإطار متقطع أحمر، ويرسم قوس أحمر يربط العقدة السابقة بالعقدة اللاحقة مباشرة متجاوزاً العقدة المحذوفة، مما يعزلها ليتم جمعها لاحقاً عبر Garbage Collector!
              </p>
            </div>
          </div>
        </div>

        {/* Arrays vs Linked Lists Comparison */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
            <ArrowRightLeft className="w-4 h-4 text-sky-600" />
            مقارنة معمارية حاسمة: القوائم المرتبطة مقابل المصفوفات (Linked Lists vs Arrays)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold">
                  <th className="p-2.5 border border-slate-300">المعيار الهندسي</th>
                  <th className="p-2.5 border border-slate-300 text-sky-800">القائمة المرتبطة (Linked List)</th>
                  <th className="p-2.5 border border-slate-300 text-slate-800">المصفوفة (Array)</th>
                  <th className="p-2.5 border border-slate-300">التقييم العملي</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">حجم الذاكرة وتخصيصها</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">ديناميكي بالكامل (تنمو وتتقلص عند الطلب)</td>
                  <td className="p-2 border border-slate-300 text-amber-700 font-bold">ثابت ومحدد مسبقاً (Fixed Capacity)</td>
                  <td className="p-2 border border-slate-300 text-slate-600">تفوق للقوائم المرتبطة بعدم إهدار الذاكرة مسبقاً</td>
                </tr>
                <tr className="bg-emerald-50/50 text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">الإدراج في البداية</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1) فوري مطلق</td>
                  <td className="p-2 border border-slate-300 text-rose-700 font-bold">O(N) يتطلب إزاحة كل العناصر</td>
                  <td className="p-2 border border-slate-300 text-slate-600">فارق سرعة هائل في التطبيقات ذات الإدخال المستمر</td>
                </tr>
                <tr className="bg-white text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">الحذف الفعلي لعقدة معروفة</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1) بمجرد تعديل المؤشر Bypass</td>
                  <td className="p-2 border border-slate-300 text-rose-700 font-bold">O(N) يتطلب ردم الفجوة بإزاحة العناصر</td>
                  <td className="p-2 border border-slate-300 text-slate-600">حذف نظيف بدون نسخ أو نقل فيزيائي للبيانات</td>
                </tr>
                <tr className="bg-amber-50/50 text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">الوصول العشوائي (Indexing)</td>
                  <td className="p-2 border border-slate-300 text-rose-700 font-bold">غير ممكن، يتطلب مسح O(N)</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1) عبر حساب العنوان المباشر</td>
                  <td className="p-2 border border-slate-300 text-slate-600">المصفوفات أسرع في القراءة العشوائية والبحث الثنائي</td>
                </tr>
                <tr className="bg-white text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">استهلاك الذاكرة الإضافي (Overhead)</td>
                  <td className="p-2 border border-slate-300 text-amber-700 font-bold">مؤشر إضافي (next pointer) لكل عقدة</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">صفر ذاكرة إضافية (البيانات فقط)</td>
                  <td className="p-2 border border-slate-300 text-slate-600">تستهلك القوائم 4 إلى 8 بايت إضافية لكل عنصر للمؤشر</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-World Engineering Applications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-600" />
            أين تُستخدم القوائم المرتبطة في الأنظمة الحقيقية؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-sky-900 block">1. إدارة كتل الذاكرة الشاغرة (Free Lists):</span>
              <p className="text-slate-600">
                تستخدم أنظمة التشغيل ومجمعات النفايات (Garbage Collectors) قوائم مرتبطة لحفظ عناوين كتل الذاكرة الشاغرة المتاحة للتخصيص الفوري.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-sky-900 block">2. جداول تخصيص الملفات (FAT File Systems):</span>
              <p className="text-slate-600">
                نظام الملفات الشهير FAT32 يخزن أجزاء الملف (Clusters) الموزعة على القرص كسلسلة مرتبطة، بحيث يشير كل عنقود إلى العنقود التالي.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-sky-900 block">3. بناء هياكل البيانات المتقدمة (Stacks, Queues, Graphs):</span>
              <p className="text-slate-600">
                القوائم المرتبطة هي الأساس لتنفيذ المكدسات والطوابير غير محدودة السعة، وقوائم التجاور (Adjacency Lists) في الرسوم البيانية.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-sky-900 block">4. سجلات التراجع والتاريخ (Navigation & Undo Chains):</span>
              <p className="text-slate-600">
                قوائم التصفح للأمام والخلف في متصفحات الويب وقوائم التراجع في تطبيقات التحرير تعتمد على القوائم المرتبطة ثنائياً (Doubly Linked Lists).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPriorityQueue) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <h2 className="text-xl font-bold">
              شرح طابور الأولويات (Robert Lafore's Priority Queue)
            </h2>
          </div>
          <p className="text-sm text-emerald-100 leading-relaxed">
            يمثل هذا البريمج النموذج التعليمي الثالث في <strong className="text-amber-300">الفصل الرابع: المكدسات وطوابير الانتظار (Stacks & Queues)</strong> من كتاب روبرت لافور.
            على عكس طابور الانتظار العادي (FIFO Queue) الذي يعتمد على أسبقية الوصول الزمني، فإن <strong className="text-cyan-300">طابور الأولويات (Priority Queue)</strong> يربط كل عنصر بمفتاح أولوية (Priority Key)، بحيث يُستخرج دائماً العنصر ذو <strong className="text-yellow-300">الأولوية القصوى</strong> أولاً بغض النظر عن وقت دخوله.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insert Complexity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <Zap className="w-3.5 h-3.5" /> الإدراج (Insert)
                </span>
                <span className="font-mono text-sm font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  O(N)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                تعتمد خوارزمية لافور على مصفوفة مرتبة تصاعدياً. عند إدراج عنصر، يبدأ البحث من القمة (<strong className="text-emerald-700">curIn</strong>)، وتتم إزاحة جميع العناصر الأكبر خطوة للأعلى لإفساح المجال، مما يستغرق في أسوأ الحالات $O(N)$ إزاحة.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              بحث خطي وإزاحة متسلسلة Shifting
            </div>
          </div>

          {/* Remove Complexity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  <Trash2 className="w-3.5 h-3.5" /> الحذف (Remove Max)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                لأن المصفوفة مرتبة تصاعدياً دوماً، فإن العنصر ذو الأولوية القصوى يتواجد دائماً في المقدمة (<strong className="text-rose-700">Front = NPersons - 1</strong>)، لذا يتم استخراجه وحذفه فورا في زمن ثابت بدون تحريك أي عناصر أخرى.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              استخراج فوري مباشر لأعلى عنصر أولوية
            </div>
          </div>

          {/* Peek Complexity */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  <Eye className="w-3.5 h-3.5" /> المعاينة (Peek)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                قراءة قيمة العنصر المتواجد في موقع <strong className="text-purple-700">Front</strong> وعرضها في صندوق الرقم دون حذف العنصر أو تعديل مؤشرات المصفوفة.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              قراءة فورية في زمن ثابت O(1)
            </div>
          </div>
        </div>

        {/* Pointer Architecture */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
            هندسة المؤشرات وترتيب البيانات في بريمج لافور (Pointers Architecture)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <span className="font-bold text-blue-700 block mb-1">
                سهم Rear (أزرق - طول 60)
              </span>
              <p className="text-slate-600">
                يشير دائماً وبشكل ثابت إلى الفهرس 0 في أسفل المصفوفة، وهو موقع العنصر الأصغر (أدنى أولوية).
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <span className="font-bold text-rose-700 block mb-1">
                سهم Front (أحمر - طول 15)
              </span>
              <p className="text-slate-600">
                يشير إلى الفهرس <code className="bg-slate-100 px-1 rounded">nPersons - 1</code> عند قمة العناصر المشغولة، وهو موقع العنصر الأكبر (أعلى أولوية).
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-300">
              <span className="font-bold text-slate-800 block mb-1">
                سهم curIn (أسود - طول 10)
              </span>
              <p className="text-slate-600">
                مؤشر البحث والإزاحة التنازلي؛ يتحرك من Front نزولاً لمقارنة المفتاح وإزاحة العناصر الأكبر للأعلى.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Operations Guide */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            دليل العمليات وخوارزمية التنفيذ خطوة بخطوة (Step-by-Step Execution)
          </h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">
                1. الإدراج بالترتيب والإزاحة (Ins - Insert with Shifting):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>إذا كان الطابور ممتلئاً (<code className="font-mono">nPersons == 10</code>)، تظهر رسالة <code className="font-mono text-rose-700 font-bold">CAN'T INSERT: queue is full</code>.</li>
                <li>إذا كان الطابور فارغاً، يوضع العنصر مباشرة في الخلية 0، ويصبح <code className="font-mono">Front = 0</code>.</li>
                <li>إذا احتوى عناصر سابقة، يبدأ المؤشر <code className="font-mono text-emerald-700">curIn = nPersons - 1</code> من أعلى عنصر.</li>
                <li>في كل خطوة: إذا كان المفتاح الجديد أصغر من العنصر الحالي، يُزاح العنصر للأعلى إلى <code className="font-mono">curIn + 1</code> ويتناقص <code className="font-mono">curIn</code>.</li>
                <li>عندما يصبح المفتاح الجديد أكبر من العنصر الحالي (أو نصل إلى الفهرس 0)، يتوقف المؤشر ويُدرج العنصر في موضعه الصحيح، ثم يزداد <code className="font-mono">Front</code> و <code className="font-mono">nPersons</code> بمقدار 1.</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100">
              <span className="font-bold text-rose-900 block mb-1">
                2. إزالة العنصر ذو الأولوية القصوى (Rem - Remove Maximum):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>إذا كان الطابور فارغاً، تظهر رسالة <code className="font-mono text-rose-700 font-bold">CAN'T REMOVE: queue is empty</code>.</li>
                <li>يتم استخراج العنصر المتواجد عند <code className="font-mono">queArray[nPersons - 1]</code> وإفراغ الخلية.</li>
                <li>يتراجع مؤشر المقدمة <code className="font-mono">Front--</code> وينقص عدد العناصر <code className="font-mono">nPersons--</code> في زمن قياسي فوري $O(1)$.</li>
                <li>تُعاد القيمة المستخرجة وتُعرض في حقل <code className="font-mono">Number:</code>.</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">
                3. معاينة العنصر الأكبر (Peek):
              </span>
              <p className="text-slate-700">
                يقرأ قيمة الخلية <code className="font-mono">queArray[Front]</code> دون حذفها أو تعديل المؤشرات، ويعيدها إلى حقل الرقم في زمن $O(1)$.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison: Array PQ vs Heap PQ */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
            المقارنة بين طابور الأولويات المعتمد على مصفوفة وطابور الأولويات الشجري (Heaps)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-200 text-slate-800 font-bold">
                  <th className="p-2 border border-slate-300">نوع البنية</th>
                  <th className="p-2 border border-slate-300">الإدراج (Insert)</th>
                  <th className="p-2 border border-slate-300">الحذف (Remove Max/Min)</th>
                  <th className="p-2 border border-slate-300">المعاينة (Peek)</th>
                  <th className="p-2 border border-slate-300">التعقيد البرمجي والاستخدام</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-emerald-50/60 font-semibold text-slate-900">
                  <td className="p-2 border border-slate-300">المصفوفة المرتبة (طريقة لافور الحالية)</td>
                  <td className="p-2 border border-slate-300 text-amber-700 font-bold">O(N)</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1)</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1)</td>
                  <td className="p-2 border border-slate-300 text-slate-600">بسيطة جداً ومثالية للبيانات صغيرة الحجم والتطبيقات ذات عمليات السحب الكثيفة</td>
                </tr>
                <tr className="bg-white text-slate-800">
                  <td className="p-2 border border-slate-300 font-semibold">المصفوفة غير المرتبة (Unordered Array)</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1)</td>
                  <td className="p-2 border border-slate-300 text-amber-700 font-bold">O(N)</td>
                  <td className="p-2 border border-slate-300 text-amber-700 font-bold">O(N)</td>
                  <td className="p-2 border border-slate-300 text-slate-600">إدراج فوري لكن يتطلب فحص كامل المصفوفة للبحث عن العنصر الأكبر</td>
                </tr>
                <tr className="bg-slate-100/60 font-semibold text-slate-900">
                  <td className="p-2 border border-slate-300">كومة الأولويات الثنائية (Binary Heap - الفصل 12)</td>
                  <td className="p-2 border border-slate-300 text-blue-700 font-bold">O(log N)</td>
                  <td className="p-2 border border-slate-300 text-blue-700 font-bold">O(log N)</td>
                  <td className="p-2 border border-slate-300 text-emerald-700 font-bold">O(1)</td>
                  <td className="p-2 border border-slate-300 text-slate-600">البنية المعيارية للأنظمة الضخمة؛ توازن مثالي بين سرعة الإدراج وسرعة الحذف</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Real World Applications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-600" />
            أهم التطبيقات العملية لطوابير الأولويات (Real-World Applications)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-emerald-800 block mb-1">
                1. جدولة مهام أنظمة التشغيل (OS Task Scheduling):
              </span>
              <p className="text-slate-600">
                منح العمليات الحرجة ومقاطعات العتاد (Hardware Interrupts) الأولوية قبل البرامج العادية.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-emerald-800 block mb-1">
                2. خوارزميات المسار الأقصر (Dijkstra & A* Search):
              </span>
              <p className="text-slate-600">
                اختيار العقدة ذات المسافة الأقصر دائماً لتوليد مسارات الملاحة والشبكات في أسرع وقت.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-emerald-800 block mb-1">
                3. ضغط البيانات (Huffman Coding Compression):
              </span>
              <p className="text-slate-600">
                دمج الرموز الأقل تكراراً لبناء شجرة التشفير المثالية المستخدمة في ملفات ZIP و JPEG.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-emerald-800 block mb-1">
                4. محاكاة الأحداث المتقطعة (Discrete Event Simulation):
              </span>
              <p className="text-slate-600">
                ترتيب الأحداث المستقبلية حسب الطابع الزمني لمعالجتها بالتتابع الصحيح.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isQueue) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-300" />
            <h2 className="text-xl font-bold">
              شرح طابور الانتظار الدائري (Robert Lafore's Circular Queue - FIFO)
            </h2>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            يمثل هذا البريمج النموذج التعليمي الثاني في <strong className="text-amber-300">الفصل الرابع: المكدسات وطوابير الانتظار (Stacks and Queues)</strong> من مرجع روبرت لافور الشهير.
            طابور الانتظار (Queue) هو هيكل بيانات يعمل وفق مبدأ <strong className="text-cyan-300">FIFO (First-In, First-Out)</strong> — أي أن العنصر الذي يدخل أولاً يخرج أولاً،
            تماماً كطابور الزبائن أمام شباك التذاكر؛ الإدراج يحدث دائماً عند المؤخرة (<span className="text-blue-300 font-bold">Rear</span>)، بينما الحذف يتم من المقدمة (<span className="text-rose-300 font-bold">Front</span>).
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Insert */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  <Zap className="w-3.5 h-3.5" /> الإدراج (Insert / Enqueue)
                </span>
                <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتم إدراج العنصر الجديد عند مؤشر المؤخرة (<strong className="text-blue-700">Rear</strong>) مباشرة بدون إزاحة بقية العناصر، مع زيادة Rear بمقدار 1.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              زمن ثابت وفوري في أسوأ وأفضل الحالات
            </div>
          </div>

          {/* Remove */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  <Trash2 className="w-3.5 h-3.5" /> الحذف (Remove / Dequeue)
                </span>
                <span className="font-mono text-sm font-extrabold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتم سحب العنصر من موقع المقدمة (<strong className="text-rose-700">Front</strong>)، وتمرير قيمته للخارج، ثم تقدم Front بمقدار 1 دون تحريك أي عناصر أخرى.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              حذف سريع ومباشر O(1) بفضل استخدام المؤشرات
            </div>
          </div>

          {/* Circular Wrap-around */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  <RefreshCw className="w-3.5 h-3.5" /> الالتفاف الدائري (Wrap-around)
                </span>
                <span className="font-mono text-sm font-extrabold text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded">
                  Circular
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                عند وصول Rear أو Front إلى نهاية المصفوفة (الفهرس 9)، يلتف المؤشر تلقائياً ليعود إلى البداية (الفهرس 0) لاستغلال المساحات الشاغرة!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              يمنع هدر الذاكرة ويجعل المصفوفة حلقة مستمرة
            </div>
          </div>
        </div>

        {/* Detailed Mechanics Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            كيف يعمل طابور الانتظار الدائري خطوة بخطوة؟
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700 leading-relaxed">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm text-blue-700">
                1. المؤشرات المتمايزة (Front و Rear)
              </h4>
              <p>
                - <strong>Front (المقدمة)</strong>: سهم أحمر قصير يشير إلى أول عنصر دخل الطابور وهو المؤهل للخروج تالياً.
              </p>
              <p>
                - <strong>Rear (المؤخرة)</strong>: سهم أزرق طويل يشير إلى آخر عنصر تم إدراجه.
              </p>
              <p>
                - اختلاف طول السهمين (15 بكسل لـ Front مقابل 60 بكسل لـ Rear) يضمن ظهور كلا السهمين بوضوح حتى عندما يكونان في نفس الفهرس!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm text-purple-700">
                2. عبقرية الالتفاف الدائري (Circular Wrap-around)
              </h4>
              <p>
                في الطابور الخطي العادي، عند حذف عناصر من المقدمة تظل المواقع السابقة فارغة ولا يمكن استخدامها، مما يؤدي لامتلاء وهمي!
              </p>
              <p>
                حل روبرت لافور العبقري: عندما يصل <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">Rear == 9</code> ويوجد متسع، يلتف Rear إلى <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">-1</code> ثم <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">0</code>، مشكلاً حلقة مستمرة.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              حالات الحدود المهمة (Boundary Conditions):
            </div>
            <p>
              • <strong>امتلاء الطابور (Full Queue)</strong>: عندما يبلغ عدد العناصر <code className="font-mono font-bold">nPersons == 10</code>، ترفض عملية الإدراج برسالة: <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-red-700">CAN'T INSERT: queue is full</code>.
            </p>
            <p>
              • <strong>فراغ الطابور (Empty Queue)</strong>: عندما يكون <code className="font-mono font-bold">nPersons == 0</code>، ترفض عمليتا الحذف والمعاينة برسالة: <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-red-700">CAN'T REMOVE: queue is empty</code>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isStack) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-teal-900 to-emerald-950 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-teal-300" />
            <h2 className="text-xl font-bold">
              شرح هيكل بيانات المكدس (Robert Lafore's Stack - LIFO)
            </h2>
          </div>
          <p className="text-sm text-teal-100 leading-relaxed">
            هذا البريمج يمثل النموذج التعليمي الأساسي في <strong className="text-amber-300">الفصل الرابع: المكدسات والأرتال (Stacks and Queues)</strong> من كتاب{' '}
            <strong>Data Structures & Algorithms in Java</strong> لمؤلفه <strong>Robert Lafore</strong>.
            المكدس هو هيكل بيانات خاضع لقاعدة <strong className="text-cyan-300">LIFO (Last-In, First-Out)</strong> — أي أن العنصر الذي يدخل آخراً هو أول من يخرج،
            تماماً كرزمة الصحون في المطعم؛ لا يمكنك وضع أو سحب أي عنصر إلا من القمة (Top)!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Push */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <ArrowDownToLine className="w-3.5 h-3.5" /> الدفع / الإدراج (Push)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                إيداع العنصر في موقع القمة (Top) فوراً دون الحاجة لإزاحة أي من العناصر السابقة إطلاقاً!
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              يتم زيادة مؤشر Top بواحد ثم وضع القيمة في الخلية الجديدة.
            </div>
          </div>

          {/* Pop */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                  <ArrowUpFromLine className="w-3.5 h-3.5" /> السحب / الحذف (Pop)
                </span>
                <span className="font-mono text-sm font-extrabold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                حذف العنصر الأخير من القمة وإرجاع قيمته إلى حقل Number مباشرة بزمن قياسي ثابت.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              يتم قراءة العنصر وتفريغ الخلية ثم خفض مؤشر Top بواحد.
            </div>
          </div>

          {/* Peek */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                  <Eye className="w-3.5 h-3.5" /> المعاينة (Peek)
                </span>
                <span className="font-mono text-sm font-extrabold text-purple-600 bg-purple-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                قراءة قيمة العنصر الموجود على قمة المكدس دون حذفه ودون تحريك مؤشر Top إطلاقاً.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              مفيدة جداً للتحقق من قمة المكدس قبل اتخاذ قرار سحبه.
            </div>
          </div>
        </div>

        {/* Pointer & Boundaries */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            مؤشر القمة (Top Pointer) وحدود المكدس في كتاب روبرت لافور:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                📍 مؤشر Top (السهم الأحمر)
              </span>
              <p className="text-slate-600 leading-relaxed">
                يشير دائماً إلى موضع العنصر التالي الذي سيتم إدراجه (أو عدد العناصر الحالية). عندما يكون المكدس فارغاً تكون قيمته 0، وعند امتلائه بالكامل تكون 10.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
              <span className="font-bold text-rose-800 flex items-center gap-1">
                ⚠️ طفحان المكدس (Stack Overflow)
              </span>
              <p className="text-slate-600 leading-relaxed">
                عندما يصل المكدس إلى سعته القصوى (10 عناصر في الأبليت)، ترفض دالة Push أي إدراج جديد مع رسالة التحذير الشهيرة: <code className="bg-white px-1 py-0.5 rounded text-rose-700 font-bold">CAN'T PUSH: stack is full</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-1.5">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                ⚠️ تفريغ المكدس الفارغ (Stack Underflow)
              </span>
              <p className="text-slate-600 leading-relaxed">
                إذا كان المكدس فارغاً تماماً وحاول المستخدم إجراء Pop أو Peek، يرفض الأبليت العملية مع رسالة: <code className="bg-white px-1 py-0.5 rounded text-amber-800 font-bold">CAN'T POP: stack is empty</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Applications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            أهم التطبيقات العملية للمكدس في هندسة البرمجيات:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">1. مكدس استدعاء الدوال (Call Stack & Recursion):</span>
              <p className="text-slate-600">
                يقوم مفسر أو مجمع لغات البرمجة (مثل CLR في C# أو JVM في Java) بتخزين عناوين العودة والمتغيرات المحلية لكل دالة في Call Stack وتفريغها عند انتهاء الدالة.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">2. مطابقة الأقواس (Delimiter Matching):</span>
              <p className="text-slate-600">
                التحقق من صحة إغلاق الأقواس البرمجية مثل <code>()</code>, <code>[]</code>, <code>{}</code> في برامج التحليل النحوي والمترجمات (Compilers).
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">3. تقييم التعبيرات الحسابية (Postfix Parsing):</span>
              <p className="text-slate-600">
                تحويل المعادلات من الصيغة المألوفة (Infix) إلى الصيغة اللاحقة (Postfix - Reverse Polish Notation) وحساب نتيجتها بمسحة واحدة.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">4. سجل التراجع وزر الرجوع (Undo / Back):</span>
              <p className="text-slate-600">
                تنفيذ عمليات التراجع (Ctrl+Z) في محررات النصوص وتاريخ التنقل للخلف في متصفحات الويب عبر تكديس الصفحات السابقة.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSelect) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-purple-300" />
            <h2 className="text-xl font-bold">
              شرح خوارزمية ترتيب الاختيار (Robert Lafore's Selection Sort)
            </h2>
          </div>
          <p className="text-sm text-purple-100 leading-relaxed">
            هذا البريمج يمثل الخوارزمية الثانية في <strong className="text-amber-300">الفصل الثالث: خوارزميات الترتيب البسيطة (Simple Sorting)</strong> من كتاب{' '}
            <strong>Data Structures & Algorithms in Java</strong> لمؤلفه <strong>Robert Lafore</strong>.
            تم تصميم ترتيب الاختيار لتحسين أداء الترتيب الفقاعي من خلال <strong className="text-emerald-300">تقليل عدد التبديلات (Swaps) من O(N²) إلى O(N) فقط</strong>،
            بحيث يتم تبديل عنصر واحد فقط على الأكثر في نهاية كل دورة!
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Comparisons */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  <Search className="w-3.5 h-3.5" /> المقارنات (Comparisons)
                </span>
                <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                  O(N²)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                تماماً كالترتيب الفقاعي، عدد المقارنات هو N*(N-1)/2. في مصفوفة من 10 عناصر نحتاج 45 مقارنة، وفي 100 عنصر نحتاج 4,950 مقارنة.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              المؤشر inner يمسح باقي المصفوفة بحثاً عن أصغر قيمة.
            </div>
          </div>

          {/* Swaps */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <ArrowRightLeft className="w-3.5 h-3.5" /> التبديلات (Swaps)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                  O(N) فقط!
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>الميزة الجوهرية:</strong> يتم إجراء عملية تبديل واحدة على الأكثر لكل دورة خارجية (Outer)، أي أقل من N تبديل لكامل الفرز!
              </p>
            </div>
            <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100 font-semibold">
              أسرع بكثير من الفقاعي عندما تكون عمليات التبديل باهظة التكلفة.
            </div>
          </div>

          {/* Space */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                  <Layers className="w-3.5 h-3.5" /> الذاكرة الإضافية (Space)
                </span>
                <span className="font-mono text-sm font-extrabold text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded">
                  O(1)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                الترتيب يتم في نفس المصفوفة (In-Place Sorting) دون استهلاك أي ذاكرة إضافية، مع الاحتفاظ بمتغير min فقط.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              خوارزمية موفرة جداً لموارد الذاكرة العشوائية RAM.
            </div>
          </div>
        </div>

        {/* Pointer Mechanics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600" />
            آلية عمل المؤشرات البصرية الثلاثة في أبليت روبرت لافور:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 space-y-1">
              <span className="font-bold text-red-700 flex items-center gap-1">
                🔴 مؤشر outer (أحمر)
              </span>
              <p className="text-slate-600">
                يشير إلى بداية الجزء غير المرتب من المصفوفة، والمكان الذي سيستقر فيه العنصر الأصغر القادم.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 space-y-1">
              <span className="font-bold text-purple-700 flex items-center gap-1">
                🟣 مؤشر min (أرجواني/Magenta)
              </span>
              <p className="text-slate-600">
                يحدد موقع أصغر عنصر تم اكتشافه حتى اللحظة أثناء مسح الدورة الحالية.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
              <span className="font-bold text-blue-700 flex items-center gap-1">
                🔵 مؤشر inner (أزرق)
              </span>
              <p className="text-slate-600">
                يتحرك خطوة بخطوة من <code>outer + 1</code> حتى نهاية المصفوفة لمقارنة كل عنصر مع <code>min</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison with Bubble Sort */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
            مقارنة دقيقة: ترتيب الاختيار مقابل الترتيب الفقاعي (Lafore Analysis)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-2.5 font-bold">المعيار</th>
                  <th className="p-2.5 font-bold">الترتيب الفقاعي (Bubble Sort)</th>
                  <th className="p-2.5 font-bold text-purple-700">ترتيب الاختيار (Selection Sort)</th>
                  <th className="p-2.5 font-bold">الفرق الجوهري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">المقارنات (Comparisons)</td>
                  <td className="p-2.5 font-mono text-slate-700">N*(N-1)/2 = O(N²)</td>
                  <td className="p-2.5 font-mono text-purple-700">N*(N-1)/2 = O(N²)</td>
                  <td className="p-2.5 text-slate-600">متساويان تماماً في عدد المقارنات.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">التبديلات (Swaps)</td>
                  <td className="p-2.5 font-mono text-rose-700 font-bold">O(N²) — حتى N²/2</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">O(N) — أقل من N</td>
                  <td className="p-2.5 text-emerald-700 font-medium">تفوق ساحق لاختيار العناصر!</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">حركة البيانات</td>
                  <td className="p-2.5 text-slate-600">تبديل مستمر لكل عنصر غير مرتب في كل خطوة</td>
                  <td className="p-2.5 text-purple-700">تبديل واحد فقط عند انتهاء فحص السطر كاملاً</td>
                  <td className="p-2.5 text-slate-600">تقليل إجهاد الذاكرة وعمليات الكتابة.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">الاستقرار (Stability)</td>
                  <td className="p-2.5 text-emerald-700 font-semibold">مستقرة (Stable)</td>
                  <td className="p-2.5 text-amber-700 font-semibold">غير مستقرة عموماً (Unstable)</td>
                  <td className="p-2.5 text-slate-600">قد يتغير الترتيب النسبي للعناصر المتساوية بسبب القفز.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (isBubble) {
    return (
      <div className="space-y-6 text-slate-800">
        {/* Intro Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-6 h-6 text-blue-300" />
            <h2 className="text-xl font-bold">
              شرح خوارزمية الترتيب الفقاعي (Robert Lafore's Bubble Sort)
            </h2>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            هذا البريمج يمثل النموذج التعليمي الأساسي في <strong className="text-amber-300">الفصل الثالث: خوارزميات الترتيب البسيطة (Simple Sorting)</strong> من كتاب{' '}
            <strong>Data Structures & Algorithms in Java</strong> لمؤلفه <strong>Robert Lafore</strong>.
            سميت الخوارزمية بالترتيب "الفقاعي" لأن العناصر الأكبر حجماً تطفو تدريجياً نحو الأعلى أو اليمين تماماً كفقاعات الهواء في الماء، عبر مقارنة كل زوج من العناصر المتجاورة وتبديلهما إذا لزم الأمر.
          </p>
        </div>

        {/* Complexity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Comparisons */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  <Search className="w-3.5 h-3.5" /> عدد المقارنات (Comparisons)
                </span>
                <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                  O(N²)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                في الدورة الأولى تتم (N-1) مقارنة، ثم (N-2)، وهكذا حتى 1.
                المجموع الدقيق هو: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">N(N-1) / 2</code>.
                عند 10 عناصر: 45 مقارنة. وعند 100 عنصر: 4,950 مقارنة!
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
              عدد المقارنات ثابت بغض النظر عن ترتيب البيانات الأولي.
            </div>
          </div>

          {/* Swaps */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <RefreshCw className="w-3.5 h-3.5" /> عدد التبديلات (Swaps)
                </span>
                <span className="font-mono text-sm font-extrabold text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded">
                  O(N²)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                في أسوأ حالة (الترتيب المعكوس Inverse Order)، يتطلب كل فحص تبديلاً: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">N(N-1) / 2</code> تبديل (45 تبديلاً لـ 10 أعمدة).
                في المتوسط: N²/4 تبديل.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
              في حالة المصفوفة المرتبة مسبقاً: 0 تبديل (Best Case).
            </div>
          </div>

          {/* Efficiency & Memory */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <Layers className="w-3.5 h-3.5" /> الذاكرة والاستقرار (Properties)
                </span>
                <span className="font-mono text-sm font-extrabold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                  O(1) In-Place
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                خوارزمية موضعية (In-Place Sort) لا تحتاج لذاكرة إضافية.
                كما أنها خوارزمية مستقرة (Stable Sort)، حيث لا يتم تغيير الترتيب النسبي للعناصر المتساوية في القيمة.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
              تصلح للمجموعات الصغيرة جداً وكنموذج تعليمي لفهم الترتيب.
            </div>
          </div>
        </div>

        {/* Algorithm Walkthrough */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            كيف تعمل خوارزمية روبرت لافور خطوة بخطوة مع مؤشرات outer و inner:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-rose-700">1. مؤشر النهاية الخارجية (outer):</span>
              <p>
                يبدأ من أقصى اليمين عند الفهرس <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300">outer = aSize - 1</code>.
                في كل جولة يضمن أن أكبر عنصر قد استقر في موقعه النهائي، فينقص مؤشر outer بمقدار 1 متحركاً نحو اليسار.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-blue-700">2. مؤشر الفحص الداخلي (inner):</span>
              <p>
                يبدأ من الفهرس 0 ويتحرك لليمين حتى يصل إلى <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300">outer - 1</code>.
                في كل خطوة يقارن العنصر الحالي <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300">inner</code> مع مجاوره <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-300">inner + 1</code>، ويبدلهما إذا كان الأول أكبر.
              </p>
            </div>
          </div>
        </div>

        {/* Java Applet vs C# WinForms Conversion Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            جدول تحويل مكونات أبليت جافا إلى تطبيق C# Windows Forms لـ Bubble Sort
          </h3>

          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th className="p-2.5 font-bold">المفهوم / المكون</th>
                <th className="p-2.5 font-bold">في أبليت جافا الأصلي (BubbleSort.java)</th>
                <th className="p-2.5 font-bold">في تطبيق C# المقابل (Windows Forms)</th>
                <th className="p-2.5 font-bold">التفسير البرمجي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">حاوية البريمج والواجهة</td>
                <td className="p-2.5 font-mono text-purple-700">BubbleSort extends Applet</td>
                <td className="p-2.5 font-mono text-blue-700">BubbleSortForm : Form</td>
                <td className="p-2.5 text-slate-600">نافذة مستقلة خفيفة الوزن مع عناصر تحكم مدمجة.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">رسم الأعمدة الرأسية الملونة</td>
                <td className="p-2.5 font-mono text-purple-700">g.fill3DRect(x, y, w, h, true)</td>
                <td className="p-2.5 font-mono text-blue-700">g.FillRectangle() + Pen 3D lines</td>
                <td className="p-2.5 text-slate-600">رسم الأعمدة بلون عشوائي مع إطار مجسم 3D مريح للعين.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">خيط التنفيذ التلقائي (Thread)</td>
                <td className="p-2.5 font-mono text-purple-700">implements Runnable + sleep(250)</td>
                <td className="p-2.5 font-mono text-blue-700">System.Windows.Forms.Timer</td>
                <td className="p-2.5 text-slate-600">تحديث منتظم بتردد 250ms (لـ 10 أعمدة) و 75ms (لـ 100 عمود).</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">مؤشرات الأسهم (outer و inner)</td>
                <td className="p-2.5 font-mono text-purple-700">arrowText(g, color, text, ...)</td>
                <td className="p-2.5 font-mono text-blue-700">ArrowText(Graphics g, ...)</td>
                <td className="p-2.5 text-slate-600">رسم أسهم حمراء وزرقاء تشير مباشرة للأعمدة الجاري فحصها.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      {/* Intro Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-blue-300" />
          <h2 className="text-xl font-bold">
            {isOrdered
              ? 'شرح مصفوفة لافور المرتبة والبحث الثنائي (Robert Lafore\'s Ordered Array)'
              : 'شرح مصفوفة لافور غير المرتبة (Robert Lafore\'s Unordered Array)'}
          </h2>
        </div>
        <p className="text-sm text-blue-100 leading-relaxed">
          {isOrdered ? (
            <>
              هذا الأبليت هو النموذج المتقدم في الفصل الثاني من كتاب{' '}
              <strong className="text-amber-300">Data Structures & Algorithms in Java</strong> لمؤلفه{' '}
              <strong>Robert Lafore</strong>. يوضح مزايا وعيوب المصفوفة المرتبة تصاعدياً (Sorted in Ascending Order)،
              حيث تتيح خوارزمية <strong className="text-cyan-300">البحث الثنائي (Binary Search)</strong> فائقة السرعة{' '}
              <code className="bg-blue-800/80 px-1.5 py-0.5 rounded font-mono">O(log N)</code>، مقابل كلفة إزاحة العناصر
              لليمين عند الإدراج.
            </>
          ) : (
            <>
              هذا الأبليت هو النموذج التعليمي الكلاسيكي في الفصل الثاني من كتاب{' '}
              <strong className="text-amber-300">Data Structures & Algorithms in Java</strong> لمؤلفه{' '}
              <strong>Robert Lafore</strong>. يوضح كيف تعمل المصفوفة البسيطة غير المرتبة، وكيف تتم عمليات
              البحث الخطي، والإدراج الفوري في نهاية المصفوفة، والحذف مع إزاحة العناصر، وتأثير خيار السماح بالتكرار (Duplicates).
            </>
          )}
        </p>
      </div>

      {/* Complexity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                <Search className="w-3.5 h-3.5" />{' '}
                {isOrdered ? 'البحث الثنائي (Binary Search)' : 'البحث الخطي (Linear Search)'}
              </span>
              <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                {isOrdered ? 'O(log N)' : 'O(N)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isOrdered ? (
                <>
                  يقوم بتقسيم مجال البحث إلى النصف في كل خطوة (Divide and Conquer). في مصفوفة تحوي 60 عنصراً،
                  لا يتطلب البحث أكثر من <strong>6 مقارنات</strong> كحد أقصى (log₂ 60 ≈ 6)، مقارنة بـ 60 مقارنة في البحث الخطي!
                </>
              ) : (
                <>
                  نظراً لأن العناصر غير مرتبة، يجب فحص العناصر واحداً تلو الآخر من الفهرس 0. في حال وجود العنصر
                  يتوقف فوراً عند إيجاده، ومتوسط المقارنات هو N/2.
                </>
              )}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            {isOrdered ? (
              <span className="text-emerald-700 font-medium">✓ سرعة فائقة في قواعد البيانات وأنظمة الفهرسة.</span>
            ) : (
              <span>يتطلب N مقارنة في أسوأ الحالات (عند غياب العنصر).</span>
            )}
          </div>
        </div>

        {/* Insertion */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">
                <Plus className="w-3.5 h-3.5" /> الإدراج (Insertion)
              </span>
              <span className="font-mono text-sm font-extrabold text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded">
                {isOrdered ? 'O(N)' : 'O(1)'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isOrdered ? (
                <>
                  يجب أولاً العثور على المكان المناسب للعنصر للحفاظ على الترتيب، ثم إزاحة جميع العناصر الأكبر منه
                  خطوة واحدة نحو اليمين لإفساح المجال له، مما يجعله أبطأ من المصفوفة غير المرتبة.
                </>
              ) : (
                <>
                  في المصفوفة غير المرتبة، يوضع العنصر الجديد مباشرة في أول خلية فارغة{' '}
                  <code className="text-emerald-800 font-mono">personArray[nPersons++]</code> بزمن O(1) ثابت وفوري.
                </>
              )}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            {isOrdered ? (
              <span>المتوسط: إزاحة N/2 عنصر في كل عملية إدراج.</span>
            ) : (
              <span>إدراج فوري دون أي إزاحة للعناصر.</span>
            )}
          </div>
        </div>

        {/* Deletion */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded">
                <Trash2 className="w-3.5 h-3.5" /> الحذف (Deletion)
              </span>
              <span className="font-mono text-sm font-extrabold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                O(N)
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isOrdered ? (
                <>
                  يتم إيجاد العنصر بسرعة بواسطة البحث الثنائي O(log N)، ولكن بعد حذفه يجب إزاحة جميع العناصر التالية
                  خطوة نحو اليسار لسد الفراغ، مما يجعل العملية الإجمالية O(N).
                </>
              ) : (
                <>
                  يتم البحث خطياً عن العنصر O(N)، ثم تُزاح كافة العناصر التي تليه خطوة لليسار لتفادي ترك ثغرات فارغة.
                </>
              )}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
            متوسط عدد الإزاحات: N/2 خطوة لتغطية الفراغ.
          </div>
        </div>
      </div>

      {/* Comparison: Unordered Array vs Ordered Array */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
          مقارنة علمية شاملة: المصفوفة غير المرتبة مقابل المصفوفة المرتبة (Robert Lafore)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                <th className="p-2.5 font-bold">العملية / المعيار</th>
                <th className="p-2.5 font-bold">المصفوفة غير المرتبة (Unordered)</th>
                <th className="p-2.5 font-bold">المصفوفة المرتبة (Ordered)</th>
                <th className="p-2.5 font-bold">الفائز والأفضلية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">البحث (Search)</td>
                <td className="p-2.5 text-amber-700 font-mono">بطيء O(N) — فحص خطي</td>
                <td className="p-2.5 text-emerald-700 font-mono font-bold">سريع جداً O(log N) — بحث ثنائي</td>
                <td className="p-2.5 text-emerald-800 font-medium">المصفوفة المرتبة (فارق هائل مع كبر البيانات)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">الإدراج (Insertion)</td>
                <td className="p-2.5 text-emerald-700 font-mono font-bold">فوري O(1) — إضافة في النهاية</td>
                <td className="p-2.5 text-rose-700 font-mono">بطيء O(N) — يتطلب إزاحة لليمين</td>
                <td className="p-2.5 text-emerald-800 font-medium">المصفوفة غير المرتبة (ممتازة للتسجيل السريع)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">الحذف (Deletion)</td>
                <td className="p-2.5 text-slate-700 font-mono">O(N) — بحث خطي ثم إزاحة</td>
                <td className="p-2.5 text-slate-700 font-mono">O(N) — بحث ثنائي ثم إزاحة</td>
                <td className="p-2.5 text-slate-600">متساويان تقريباً بسبب مرحلة الإزاحة لليسار</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold text-slate-900">أفضل سيناريو للاستخدام</td>
                <td className="p-2.5 text-slate-700">التطبيقات التي تغلب فيها عمليات الكتابة والإضافة على القراءة</td>
                <td className="p-2.5 text-slate-700">التطبيقات التي تقرأ وتبحث بكثرة وتعدل نادراً (مثل القواميس)</td>
                <td className="p-2.5 text-blue-700 font-semibold">حسب طبيعة الاستخدام (Workload)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Java Applet vs C# WinForms Conversion Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          جدول تحويل مكونات أبليت جافا إلى تطبيق C# Windows Forms
        </h3>

        <table className="w-full text-xs text-right border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
              <th className="p-2.5 font-bold">المفهوم / المكون</th>
              <th className="p-2.5 font-bold">في أبليت جافا الأصلي (Java AWT)</th>
              <th className="p-2.5 font-bold">في تطبيق C# المقابل (Windows Forms)</th>
              <th className="p-2.5 font-bold">التفسير البرمجي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-2.5 font-semibold text-slate-900">حاوية العرض الرئيسية</td>
              <td className="p-2.5 font-mono text-purple-700">java.applet.Applet</td>
              <td className="p-2.5 font-mono text-blue-700">System.Windows.Forms.Form</td>
              <td className="p-2.5 text-slate-600">تحول كلاس الأبليت إلى نافذة ويندوز مستقلة مع دورة حياة كاملة.</td>
            </tr>
            <tr>
              <td className="p-2.5 font-semibold text-slate-900">محرك الرسم والمستطيلات</td>
              <td className="p-2.5 font-mono text-purple-700">Graphics.fill3DRect()</td>
              <td className="p-2.5 font-mono text-blue-700">Graphics.FillRectangle() + Pen 3D</td>
              <td className="p-2.5 text-slate-600">استخدام مكتبة GDI+ لرسم المستطيلات والمؤشرات ثلاثية الأبعاد.</td>
            </tr>
            <tr>
              <td className="p-2.5 font-semibold text-slate-900">التحريك البصري (Animation)</td>
              <td className="p-2.5 font-mono text-purple-700">Thread.sleep(100) داخل Runnable</td>
              <td className="p-2.5 font-mono text-blue-700">System.Windows.Forms.Timer</td>
              <td className="p-2.5 text-slate-600">المؤقت المؤتمت لا يجمد واجهة المستخدم (UI Freeze) ويحدث الشاشة بسلاسة.</td>
            </tr>
            <tr>
              <td className="p-2.5 font-semibold text-slate-900">تحديد نطاق البحث الثنائي</td>
              <td className="p-2.5 font-mono text-purple-700">Graphics.drawRect(blue)</td>
              <td className="p-2.5 font-mono text-blue-700">Pen rangePen = new Pen(Color.Blue, 2f)</td>
              <td className="p-2.5 text-slate-600">رسم إطار أزرق حول النطاق الفعّال بين LowerBound و UpperBound.</td>
            </tr>
            <tr>
              <td className="p-2.5 font-semibold text-slate-900">منع وميض الشاشة</td>
              <td className="p-2.5 font-mono text-purple-700">update(Graphics g) override</td>
              <td className="p-2.5 font-mono text-blue-700">DoubleBuffered = true</td>
              <td className="p-2.5 text-slate-600">تفعيل الرسم المزدوج لتقديم تجربة رسومية ناعمة وخالية من التقطيع.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
