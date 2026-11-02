import React, { useState } from 'react';
import { FileArchive, ExternalLink } from 'lucide-react';

interface OriginalFilesViewerProps {
  appletId?: string;
}

export const OriginalFilesViewer: React.FC<OriginalFilesViewerProps> = ({
  appletId = 'unordered-array',
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
  const isInsert = appletId === 'insert-sort';
  const isBubble = appletId === 'bubble-sort';
  const isOrdered = appletId === 'ordered-array';
  const [activeFile, setActiveFile] = useState<'html' | 'mainClass' | 'groupClass' | 'personClass' | 'linkClass' | 'paramsClass' | 'stackClass'>('html');

  const filesInfo = isGraph
    ? {
        title: 'Graph Workshop Applet (ملفات بريمج المخططات البيانية والبحث DFS و BFS - الفصل 13)',
        htmlPath: '/public/assets/aistudio/GraphN_cee0cae3.html',
        htmlName: 'GraphN.html',
        mainClassPath: '/public/assets/aistudio/GraphN_274bfee4.class',
        mainClassName: 'GraphN.class',
        groupClassPath: '/public/assets/aistudio/vertexGroup_f4653e27.class',
        groupClassName: 'vertexGroup.class',
        personClassPath: '/public/assets/aistudio/vertex_043aba93.class',
        personClassName: 'vertex.class',
        linkClassPath: '/public/assets/aistudio/Queue_8cb245a7.class',
        linkClassName: 'Queue.class',
        paramsClassPath: undefined,
        paramsClassName: undefined,
        stackClassPath: '/public/assets/aistudio/stack_07e007d3.class',
        stackClassName: 'stack.class',
      }
    : isGraphW
    ? {
        title: 'Weighted, Undirected Graph Applet (ملفات بريمج المخطط غير الموجه الموزون - الفصل 14)',
        htmlPath: '/public/assets/aistudio/GraphW_3d535574.html',
        htmlName: 'GraphW.html',
        mainClassPath: '/public/assets/aistudio/GraphW_28a674c0.class',
        mainClassName: 'GraphW.class',
        groupClassPath: '/public/assets/aistudio/vertexGroup_ece8926e.class',
        groupClassName: 'vertexGroup.class',
        personClassPath: '/public/assets/aistudio/vertex_77f9429a.class',
        personClassName: 'vertex.class',
        linkClassPath: '/public/assets/aistudio/edge_e2798e15.class',
        linkClassName: 'edge.class',
        paramsClassPath: '/public/assets/aistudio/priorityQ_e9ae4c3c.class',
        paramsClassName: 'priorityQ.class',
        stackClassPath: '/public/assets/aistudio/disIs_be23055b.class',
        stackClassName: 'disIs.class',
      }
    : isGraphDW
    ? {
        title: 'Directed, Weighted Graph Applet (ملفات بريمج المخطط الموجه الموزون - الفصل 14)',
        htmlPath: '/public/assets/aistudio/GraphDW_31c7d5e0.html',
        htmlName: 'GraphDW.html',
        mainClassPath: '/public/assets/aistudio/GraphDW_6073539a.class',
        mainClassName: 'GraphDW.class',
        groupClassPath: '/public/assets/aistudio/vertexGroup_c6414524.class',
        groupClassName: 'vertexGroup.class',
        personClassPath: '/public/assets/aistudio/vertex_148a2199.class',
        personClassName: 'vertex.class',
        linkClassPath: '/public/assets/aistudio/disP_568de71e.class',
        linkClassName: 'disP.class',
        paramsClassPath: '/public/assets/aistudio/disIs_d6da50c7.class',
        paramsClassName: 'disIs.class',
        stackClassPath: undefined,
        stackClassName: undefined,
      }
    : isHashChain
    ? {
        title: 'Separate-Chaining Hash Table Applet (ملفات بريمج جدول الهاش بالسلاسل المنفصلة - الفصل 11)',
        htmlPath: '/public/assets/aistudio/HashChain_2156fae4.html',
        htmlName: 'HashChain.html',
        mainClassPath: '/public/assets/aistudio/HashChain_9126496e.class',
        mainClassName: 'HashChain.class',
        groupClassPath: '/public/assets/aistudio/personGroup_1a35b143.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_15b7172a.class',
        personClassName: 'person.class',
        linkClassPath: '/public/assets/aistudio/link_5d76c154.class',
        linkClassName: 'link.class',
        paramsClassPath: '/public/assets/aistudio/bucket_1601ef86.class',
        paramsClassName: 'bucket.class',
        stackClassPath: undefined,
        stackClassName: undefined,
      }
    : isHash
    ? {
        title: 'Linear-Probe Hash Table Applet (ملفات بريمج جدول الهاش بالمسح الخطي - الفصل 11)',
        htmlPath: '/public/assets/aistudio/Hash_1f6c4a5e.html',
        htmlName: 'Hash.html',
        mainClassPath: '/public/assets/aistudio/Hash_14d4a580.class',
        mainClassName: 'Hash.class',
        groupClassPath: '/public/assets/aistudio/personGroup_f2c7777b.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_563b6826.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
        paramsClassPath: undefined,
        paramsClassName: undefined,
        stackClassPath: undefined,
        stackClassName: undefined,
      }
    : isTree
    ? {
        title: 'Binary Tree Applet (ملفات بريمج الشجرة الثنائية - الفصل التاسع)',
        htmlPath: '/public/assets/aistudio/Tree_524fdeff.html',
        htmlName: 'Tree.html',
        mainClassPath: '/public/assets/aistudio/Tree_77f83d03.class',
        mainClassName: 'Tree.class',
        groupClassPath: '/public/assets/aistudio/personGroup_8ef00881.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_3005aeb9.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
        paramsClassPath: undefined,
        paramsClassName: undefined,
        stackClassPath: '/public/assets/aistudio/stack_79803ef1.class',
        stackClassName: 'stack.class',
      }
    : isMergeSort
    ? {
        title: 'Merge Sort Applet (ملفات بريمج ترتيب الدمج - فرّق تسد الفصل الثامن)',
        htmlPath: '/public/assets/aistudio/MergeSort_2fc20007.html',
        htmlName: 'MergeSort.html',
        mainClassPath: '/public/assets/aistudio/MergeSort_10fe2f08.class',
        mainClassName: 'MergeSort.class',
        groupClassPath: '/public/assets/aistudio/personGroup_6d26aa9c.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_7693fac1.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
        paramsClassPath: '/public/assets/aistudio/params_32dbe5bb.class',
        paramsClassName: 'params.class',
        stackClassPath: '/public/assets/aistudio/stack_591abdf8.class',
        stackClassName: 'stack.class',
      }
    : isQuickSort2
    ? {
        title: 'Quicksort2 Applet (ملفات بريمج الترتيب السريع 2 - وسيط الثلاثة)',
        htmlPath: '/public/assets/aistudio/QuickSort2_ff23276f.html',
        htmlName: 'QuickSort2.html',
        mainClassPath: '/public/assets/aistudio/QuickSort2_3a0666a6.class',
        mainClassName: 'QuickSort2.class',
        groupClassPath: '/public/assets/aistudio/personGroup_cc1bc240.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_e98abcde.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
        paramsClassPath: undefined,
        paramsClassName: undefined,
        stackClassPath: '/public/assets/aistudio/stack_474d5a6b.class',
        stackClassName: 'stack.class',
      }
    : isQuickSort1
    ? {
        title: 'Quicksort1 Applet (ملفات بريمج الترتيب السريع 1 - الفصل الثامن)',
        htmlPath: '/public/assets/aistudio/QuickSort1_c75e198e.html',
        htmlName: 'QuickSort1.html',
        mainClassPath: '/public/assets/aistudio/QuickSort1_918cb9a4.class',
        mainClassName: 'QuickSort1.class',
        groupClassPath: '/public/assets/aistudio/personGroup_9b4bb0ef.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_9577cde9.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
        paramsClassPath: undefined,
        paramsClassName: undefined,
        stackClassPath: '/public/assets/aistudio/stack_35aefc25.class',
        stackClassName: 'stack.class',
      }
    : isTowers
    ? {
        title: 'Towers of Hanoi Applet (ملفات بريمج أبراج هانوي - الفصل السادس)',
        htmlPath: '/public/assets/aistudio/Towers_24856c78.html',
        htmlName: 'Towers.html',
        mainClassPath: '/public/assets/aistudio/Towers_ae1b3803.class',
        mainClassName: 'Towers.class',
        groupClassPath: '/public/assets/aistudio/gameGroup_37ac082e.class',
        groupClassName: 'gameGroup.class',
        personClassPath: '/public/assets/aistudio/tower_634e71e2.class',
        personClassName: 'tower.class',
        linkClassPath: '/public/assets/aistudio/disk_ebac85be.class',
        linkClassName: 'disk.class',
        paramsClassPath: '/public/assets/aistudio/params_b582fed3.class',
        paramsClassName: 'params.class',
        stackClassPath: '/public/assets/aistudio/stack_a94dd59c.class',
        stackClassName: 'stack.class',
      }
    : isLinkList
    ? {
        title: 'Linked List Applet (ملفات بريمج القائمة المرتبطة - الفصل الخامس)',
        htmlPath: '/public/assets/aistudio/LinkList_b6263292.html',
        htmlName: 'LinkList.html',
        mainClassPath: '/public/assets/aistudio/LinkList_5f95e201.class',
        mainClassName: 'LinkList.class',
        groupClassPath: '/public/assets/aistudio/personGroup_213fa105.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_549e30e1.class',
        personClassName: 'person.class',
        linkClassPath: '/public/assets/aistudio/link_c95c3a84.class',
        linkClassName: 'link.class',
      }
    : isPriorityQueue
    ? {
        title: 'Priority Queue Applet (ملفات بريمج طابور الأولويات - الفصل الرابع)',
        htmlPath: '/public/assets/aistudio/PriorityQ_59cb2825.html',
        htmlName: 'PriorityQ.html',
        mainClassPath: '/public/assets/aistudio/PriorityQ_df674a00.class',
        mainClassName: 'PriorityQ.class',
        groupClassPath: '/public/assets/aistudio/personGroup_626f73bd.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_55e5c2cd.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isQueue
    ? {
        title: 'Queue Applet (ملفات بريمج طابور الانتظار الدائري - الفصل الرابع)',
        htmlPath: '/public/assets/aistudio/Queue_a569d234.html',
        htmlName: 'Queue.html',
        mainClassPath: '/public/assets/aistudio/Queue_6257f738.class',
        mainClassName: 'Queue.class',
        groupClassPath: '/public/assets/aistudio/personGroup_43bf1af4.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_9c40b38b.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isStack
    ? {
        title: 'Stack Applet (ملفات بريمج المكدس - الفصل الرابع)',
        htmlPath: '/public/assets/aistudio/Stack_6af69a51.html',
        htmlName: 'Stack.html',
        mainClassPath: '/public/assets/aistudio/Stack_fce2b5de.class',
        mainClassName: 'Stack.class',
        groupClassPath: '/public/assets/aistudio/personGroup_3c7678d7.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_66230bce.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isSelect
    ? {
        title: 'Selection Sort Applet (ملفات بريمج ترتيب الاختيار)',
        htmlPath: '/public/assets/aistudio/SelectSort_daecb35e.html',
        htmlName: 'SelectSort.html',
        mainClassPath: '/public/assets/aistudio/SelectSort_dfdadf37.class',
        mainClassName: 'SelectSort.class',
        groupClassPath: '/public/assets/aistudio/groupSS_dd20f9ab.class',
        groupClassName: 'groupSS.class',
        personClassPath: '/public/assets/aistudio/personSS_f86e0b49.class',
        personClassName: 'personSS.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isInsert
    ? {
        title: 'Insertion Sort Applet (ملفات بريمج ترتيب الإدراج)',
        htmlPath: '/public/assets/aistudio/InsertSort_e8323703.html',
        htmlName: 'InsertSort.html',
        mainClassPath: '/public/assets/aistudio/InsertSort_22d63914.class',
        mainClassName: 'InsertSort.class',
        groupClassPath: '/public/assets/aistudio/groupIS_6c819913.class',
        groupClassName: 'groupIS.class',
        personClassPath: '/public/assets/aistudio/personIS_5f0929f8.class',
        personClassName: 'personIS.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isBubble
    ? {
        title: 'Bubble Sort Applet (ملفات بريمج الترتيب الفقاعي)',
        htmlPath: '/public/assets/aistudio/BubbleSort_453927e5.html',
        htmlName: 'BubbleSort.html',
        mainClassPath: '/public/assets/aistudio/BubbleSort_be45333d.class',
        mainClassName: 'BubbleSort.class',
        groupClassPath: '/public/assets/aistudio/groupBS_09357bd9.class',
        groupClassName: 'groupBS.class',
        personClassPath: '/public/assets/aistudio/personBS_b770c02f.class',
        personClassName: 'personBS.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : isOrdered
    ? {
        title: 'Ordered Array Applet (ملفات البريمج المرتب)',
        htmlPath: '/public/assets/aistudio/Ordered_6c5b8082.html',
        htmlName: 'Ordered.html',
        mainClassPath: '/public/assets/aistudio/Ordered_6e63e0a9.class',
        mainClassName: 'Ordered.class',
        groupClassPath: '/public/assets/aistudio/personGroup_7f189401.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_e84e779f.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      }
    : {
        title: 'Unordered Array Applet (ملفات البريمج غير المرتب)',
        htmlPath: '/public/assets/aistudio/Array_efd25549.html',
        htmlName: 'Array.html',
        mainClassPath: '/public/assets/aistudio/Array_6d9b19ba.class',
        mainClassName: 'Array.class',
        groupClassPath: '/public/assets/aistudio/personGroup_f26220f5.class',
        groupClassName: 'personGroup.class',
        personClassPath: '/public/assets/aistudio/person_56abbb90.class',
        personClassName: 'person.class',
        linkClassPath: undefined,
        linkClassName: undefined,
      };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              ملفات أبليت جافا الأصلية: {filesInfo.title}
            </h3>
            <p className="text-xs text-slate-500">
              الملفات الثنائية وHTML التي تم تزويدها وتحليلها لإعادة بنائها بلغة C#
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveFile('html')}
            className={`px-3 py-1 rounded transition ${
              activeFile === 'html'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {filesInfo.htmlName}
          </button>
          <button
            type="button"
            onClick={() => setActiveFile('mainClass')}
            className={`px-3 py-1 rounded transition ${
              activeFile === 'mainClass'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {filesInfo.mainClassName}
          </button>
          <button
            type="button"
            onClick={() => setActiveFile('groupClass')}
            className={`px-3 py-1 rounded transition ${
              activeFile === 'groupClass'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {filesInfo.groupClassName}
          </button>
          <button
            type="button"
            onClick={() => setActiveFile('personClass')}
            className={`px-3 py-1 rounded transition ${
              activeFile === 'personClass'
                ? 'bg-white text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {filesInfo.personClassName}
          </button>
          {filesInfo.linkClassName && (
            <button
              type="button"
              onClick={() => setActiveFile('linkClass')}
              className={`px-3 py-1 rounded transition ${
                activeFile === 'linkClass'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filesInfo.linkClassName}
            </button>
          )}
          {'paramsClassName' in filesInfo && filesInfo.paramsClassName && (
            <button
              type="button"
              onClick={() => setActiveFile('paramsClass')}
              className={`px-3 py-1 rounded transition ${
                activeFile === 'paramsClass'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filesInfo.paramsClassName}
            </button>
          )}
          {'stackClassName' in filesInfo && filesInfo.stackClassName && (
            <button
              type="button"
              onClick={() => setActiveFile('stackClass')}
              className={`px-3 py-1 rounded transition ${
                activeFile === 'stackClass'
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filesInfo.stackClassName}
            </button>
          )}
        </div>
      </div>

      {/* Content depending on active tab */}
      {activeFile === 'html' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>مسار الملف: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.htmlPath}</code></span>
            <a
              href={filesInfo.htmlPath.replace('/public', '')}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1 font-sans"
            >
              فتح الملف المرفق <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <pre className="bg-slate-950 text-emerald-400 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800">
{isGraph
? `<HTML>
<HEAD>
<TITLE>Graph Workshop</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Graph Workshop</STRONG></CAPTION>
      <TH>Graph
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Graph.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>Double-click</STRONG> to create new vertex.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Drag</STRONG> from vertex to vertex to create
edge.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>New</STRONG> clears an old graph.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>DFS</STRONG> carries out depth-first search.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>BFS</STRONG> carries out breadth-first search.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Tree</STRONG> creates minimum spanning tree.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>View</STRONG> toggles between graph and adjacency
matrix.
            </FONT>
   </TABLE>
</BODY>
</HTML>`
: isGraphW
? `<HTML>
<HEAD>
<TITLE>Weighted, Undirected Graph</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Weighted,
Undirected Graph</STRONG></CAPTION>
      <TH>Graph
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=GraphW.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>Double-click</STRONG> to create new vertex.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Drag</STRONG> from vertex to vertex to create
edge. (Enter weight first.)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>New</STRONG> clears an old graph.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Tree</STRONG> creates minimum spanning tree.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>View</STRONG> toggles between graph and adjacency
matrix.
            </FONT>
   </TABLE>
</BODY>
</HTML>`
: isGraphDW
? `<HTML>
<HEAD>
<TITLE>Directed, Weighted Graph</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Directed,
Weighted Graph</STRONG></CAPTION>
      <TH>Graph
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=GraphDW.class
            WIDTH=440
            HEIGHT=345>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>Double-click</STRONG> to create new vertex.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Type number</STRONG> to specify weight of an edge
(before drag).
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Drag</STRONG> from vertex to vertex to create
edge.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>New</STRONG> clears old graph.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Path</STRONG> finds all Shortest Paths from a vertex.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>View</STRONG> toggles between graph and adjacency
matrix.<P>
            </FONT>
   </TABLE>
</BODY>
</HTML>`
: isHashChain
? `<HTML>
<HEAD>
<TITLE>Separate-Chaining Hash Table</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Separate-Chaining Hash Table</STRONG></CAPTION>
      <TH>Hash Table
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=HashChain.class
            WIDTH=440
            HEIGHT=340>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates new hash table
containing N linked lists.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Fill</STRONG> inserts N items into
table.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts new item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> finds item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes item with
value N.
            </FONT><P>
            <FONT SIZE=2>
(Type number N into text box.)
            </FONT>
   </TABLE>
</BODY>
</HTML>`
: isHash
? `<HTML>
<HEAD>
<TITLE>Linear-Probe Hash Table</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Linear-Probe Hash Table</STRONG></CAPTION>
      <TH>Hash Table
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Hash.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
           <BR>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates hash table
with N cells (60 max)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Fill</STRONG> inserts N items into
table.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts new item with
key N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes item with
key N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> finds item with
key N.
            </FONT><P>
            <FONT SIZE=2>
(Type N into "Enter number" box.)
            </FONT>
   </TABLE>
</BODY>
</HTML>`
: isTree
? `<HTML>
<HEAD>
<TITLE>Binary Tree</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Binary Tree</STRONG></CAPTION>
      <TH>Binary Tree
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Tree.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>Fill</STRONG> creates a new tree
with N nodes.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> searches for a node with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts a new node with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Trav</STRONG> traverses the tree
in ascending order.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes the node with value N.
            </FONT><P>
            <FONT SIZE=2>
(Type N into "Enter number" box.)
            </FONT><P>
   </TABLE>

</BODY>
</HTML>`
: isMergeSort
? `<HTML>
<HEAD>
<TITLE>Merge Sort</TITLE>
</HEAD>

<BODY>
   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Merge Sort</STRONG></CAPTION>
      <TH>Merge Sort
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=MergeSort.class
            WIDTH=370
            HEIGHT=320>
         </APPLET>
      <TD>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates new data and initializes sort;
toggles between random and inverse order.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Size</STRONG> toggles between 12 bars and 100 bars;
also creates new data and initializes sort.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Draw</STRONG> redraws bars.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Run</STRONG> starts sorting process
running automatically. (Push Step to pause, Run to resume.)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Step</STRONG> executes one step of sorting
process.
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: isQuickSort2
? `<HTML>
<HEAD>
<TITLE>Quicksort2</TITLE>
</HEAD>

<BODY>
   <TABLE BORDER UNITS=PIXELS COLSPEC="L370 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Quicksort2</STRONG></CAPTION>
      <TH>Quicksort2
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=QuickSort2.class
            WIDTH=370
            HEIGHT=320>
         </APPLET>
      <TD>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates new data and initializes sort;
toggles between random and inverse order.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Size</STRONG> toggles between 10 bars and 100 bars;
also creates new data and initializes sort.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Draw</STRONG> redraws bars.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Run</STRONG> starts sorting process
running automatically. (Push Step to pause, Run to resume.)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Step</STRONG> executes one step of sorting
process.
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: isQuickSort1
? `<HTML>
<HEAD>
<TITLE>Quicksort1</TITLE>
</HEAD>

<BODY>
   <TABLE BORDER UNITS=PIXELS COLSPEC="L370 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Quicksort1</STRONG></CAPTION>
      <TH>Quicksort1
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=QuickSort1.class
            WIDTH=370
            HEIGHT=320>
         </APPLET>
      <TD>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates new data and initializes sort;
toggles between random and inverse order.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Size</STRONG> toggles between 10 bars and 100 bars;
also creates new data and initializes sort.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Draw</STRONG> redraws bars.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Run</STRONG> starts sorting process
running automatically. (Push Step to pause, Run to resume.)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Step</STRONG> executes one step of sorting
process.
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: isTowers
? `<HTML>
<HEAD>
<TITLE>Towers of Hanoi</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Towers of Hanoi</STRONG></CAPTION>
      <TH>Towers
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Towers.class
            WIDTH=440
            HEIGHT=335>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>Drag</STRONG> disk to another post.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Type number</STRONG> to specify number of disks
for New.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates a new game with N disks.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Step</STRONG> carries out one step of
solution algorithm.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Run</STRONG> starts the solution algorithm running.
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: isLinkList
? `<HTML>
<HEAD>
<TITLE>Linked List</TITLE>
</HEAD>

<BODY>

   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Linked List</STRONG></CAPTION>
      <TH>Linked List
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=LinkList.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates linked list
with N items (28 max)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts new item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> finds item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes item with
value N.
            </FONT><P>
            <FONT SIZE=2>
(Type N into "Enter number" box.)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Unsorted/Sorted</STRONG> buttons are
used with New.
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: isOrdered
? `<HTML>
<HEAD>
<TITLE>Ordered Array</TITLE>
</HEAD>
<BODY>
   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Ordered Array</STRONG></CAPTION>
      <TH>Ordered Array
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Ordered.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates array
with N cells (60 max)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Fill</STRONG> inserts N items into
array.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts new item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> finds item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes item with
value N.
            </FONT><P>
            <FONT SIZE=2>
(Type N into "Enter number" box.)
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`
: `<HTML>
<HEAD>
<TITLE>Unordered Array</TITLE>
</HEAD>
<BODY>
   <TABLE BORDER UNITS=PIXELS COLSPEC="L330 L250" CELLPADDING=7>
   <CAPTION><STRONG>Lafore's Unordered Array</STRONG></CAPTION>
      <TH>Unordered Array
      <TH>Operation
      <TR>
      <TD>
         <APPLET
            CODE=Array.class
            WIDTH=440
            HEIGHT=320>
         </APPLET>
      <TD>
            <BR>
            <FONT SIZE=2>
<STRONG>New</STRONG> creates array
with N cells (60 max)
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Fill</STRONG> inserts N items into
array.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Ins</STRONG> inserts new item with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Find</STRONG> finds item(s) with
value N.
            </FONT><P>
            <FONT SIZE=2>
<STRONG>Del</STRONG> deletes item(s) with
value N.
            </FONT><P>
            <FONT SIZE=2>
(Type N into "Enter number" box.)
            </FONT><P>
   </TABLE>
</BODY>
</HTML>`}
          </pre>
        </div>
      )}

      {activeFile === 'mainClass' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.mainClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-blue-400 font-bold">// كلاس {isGraph ? 'GraphN' : isGraphW ? 'GraphW' : isGraphDW ? 'GraphDW' : isHashChain ? 'HashChain' : isHash ? 'Hash' : isTree ? 'Tree' : isMergeSort ? 'MergeSort' : isQuickSort2 ? 'QuickSort2' : isQuickSort1 ? 'QuickSort1' : isTowers ? 'Towers' : isLinkList ? 'LinkList' : isOrdered ? 'Ordered' : 'Array'} الرئيسي المستخرج من بايت كود جافا:</div>
            <div>public class {isGraph ? 'GraphN' : isGraphW ? 'GraphW' : isGraphDW ? 'GraphDW' : isHashChain ? 'HashChain' : isHash ? 'Hash' : isTree ? 'Tree' : isMergeSort ? 'MergeSort' : isQuickSort2 ? 'QuickSort2' : isQuickSort1 ? 'QuickSort1' : isTowers ? 'Towers' : isLinkList ? 'LinkList' : isOrdered ? 'Ordered' : 'Array'} extends java.applet.Applet implements java.awt.event.ActionListener, {isGraph || isGraphW || isGraphDW ? 'java.awt.event.MouseListener, ' : isTowers || isQuickSort1 || isQuickSort2 || isMergeSort || isTree || isHash || isHashChain ? '' : 'java.awt.event.ItemListener, '}java.lang.Runnable {'{'}</div>
            <div className="pl-4 text-slate-400">// الحقول (Fields):</div>
            <div className="pl-4">Thread runner;</div>
            <div className="pl-4">{isGraph || isGraphW || isGraphDW ? 'vertexGroup theVertexGroup;' : isTowers ? 'gameGroup theGameGroup;' : 'personGroup thePersonGroup;'}</div>
            {!isQuickSort1 && !isQuickSort2 && !isMergeSort && !isGraph && <div className="pl-4">int GPNumber;</div>}
            {!isQuickSort1 && !isQuickSort2 && !isMergeSort && !isGraph && <div className="pl-4">boolean isNumber;</div>}
            {!isQuickSort1 && !isQuickSort2 && !isMergeSort && !isGraph && <div className="pl-4">TextField tf;</div>}
            {(isGraph || isGraphW || isGraphDW) && <div className="pl-4">boolean wasClearPressed;</div>}
            {isHashChain && <div className="pl-4">Scrollbar sbar;</div>}
            {!isTowers && !isQuickSort1 && !isQuickSort2 && !isMergeSort && !isTree && !isHash && !isHashChain && !isGraphDW && !isGraphW && !isGraph && (
              <div className="pl-4">{isLinkList ? 'Checkbox unsorted, sorted; CheckboxGroup sortGroup;' : isOrdered ? 'Checkbox lin, bin;' : 'Checkbox dups, nodups;'}</div>
            )}
            <div className="pl-4">{isGraph ? 'Button newButton, dfsButton, bfsButton, treeButton, viewButton;' : isGraphW ? 'Button newButton, treeButton, viewButton;' : isGraphDW ? 'Button newButton, pathButton, viewButton;' : isHashChain ? 'Button newButton, fillButton, insButton, findButton, delButton;' : isTree ? 'Button fillButton, findButton, insButton, travButton, delButton;' : isQuickSort1 || isQuickSort2 || isMergeSort ? 'Button newButton, sizeButton, drawButton, runButton, stepButton;' : isTowers ? 'Button newButton, stepButton, runButton;' : isLinkList ? 'Button newButton, insButton, findButton, delButton;' : 'Button newButton, fillButton, insButton, findButton, delButton;'}</div>
            <div className="pl-4 text-slate-400 mt-2">// الدوال (Methods):</div>
            <div className="pl-4">public void init();</div>
            <div className="pl-4">public void paint(Graphics g);</div>
            <div className="pl-4">public void update(Graphics g);</div>
            <div className="pl-4">public void actionPerformed(ActionEvent e);</div>
            {(isGraph || isGraphW || isGraphDW) && <div className="pl-4">public void mousePressed(MouseEvent e); public void mouseReleased(MouseEvent e);</div>}
            {!isTowers && !isQuickSort1 && !isQuickSort2 && !isMergeSort && !isTree && !isHash && !isHashChain && !isGraphDW && !isGraphW && !isGraph && <div className="pl-4">public void itemStateChanged(ItemEvent e);</div>}
            <div className="pl-4">public void start();</div>
            <div className="pl-4">public void stop();</div>
            <div className="pl-4">public void run();</div>
            <div>{'}'}</div>
          </div>
        </div>
      )}

      {activeFile === 'groupClass' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.groupClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-teal-400 font-bold">// كلاس إدارة وهيكل بيانات {isGraph ? 'المخطط العام والبحث DFS و BFS وشجرة الامتداد (vertexGroup مع theStack و theQueue)' : isGraphW ? 'المخطط غير الموجه الموزون (vertexGroup مع adjMat وطابور الأولوية thePQ وخوارزمية بريم)' : isGraphDW ? 'المخطط الموجه الموزون (vertexGroup مع adjMat و sPath وخوارزمية ديكسترا)' : isHashChain ? 'جدول الهاش بالسلاسل المنفصلة (personGroup مع bucketArray و VScrollBar)' : isHash ? 'جدول الهاش بالمسح الخطي (personGroup مع personArray[60] و delNode)' : isTree ? 'الشجرة الثنائية (personGroup مع treeArray[31] و theStack)' : isMergeSort ? 'ترتيب الدمج (personGroup مع workSpace و theStack)' : isQuickSort2 ? 'الترتيب السريع 2 - وسيط الثلاثة (personGroup)' : isQuickSort1 ? 'الترتيب السريع 1 (personGroup)' : isTowers ? 'أبراج هانوي (gameGroup)' : isLinkList ? 'القائمة المرتبطة (Linked List)' : isOrdered ? 'المصفوفة المرتبة (Ordered Array)' : 'المصفوفة غير المرتبة (Unordered Array)'}:</div>
            <div>public class {isGraph || isGraphW || isGraphDW ? 'vertexGroup' : isTowers ? 'gameGroup' : 'personGroup'} {'{'}</div>
            <div className="pl-4 text-slate-400">// الثوابت والأبعاد:</div>
            {isGraph ? (
              <>
                <div className="pl-4">int MAX_VERTS = 13, appletWidth = 440, appletHeight = 320, drawingBoxHeight = 207;</div>
                <div className="pl-4 text-emerald-300">vertex[] vertexList = new vertex[13]; // مصفوفة الرؤوس المتاحة</div>
                <div className="pl-4 text-amber-300">int[][] adjMat = new int[13][13]; // مصفوفة المجاورة الثنائية (0 / 1)</div>
                <div className="pl-4 text-amber-300">int[][] adjMat2 = new int[13][13]; // لحفظ واستعادة المخطط في وضع الشجرة</div>
                <div className="pl-4 text-purple-300">stack theStack = new stack(); // مكدس البحث في العمق DFS</div>
                <div className="pl-4 text-blue-300">Queue theQueue = new Queue(); // طابور البحث في العرض BFS</div>
                <div className="pl-4 text-rose-300">int[] visitArray = new int[13]; int nVisits = 0, nVerts = 0, startingVertex = -1, currentVert = 0;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Graph & Traversal Operations):</div>
                <div className="pl-4 text-emerald-400">public void makeVertex(int x, int y); // إنشاء رأس جديد بالنقر المزدوج (A-M)</div>
                <div className="pl-4 text-emerald-400">public void startDrag(int x, int y); // بدء سحب حافة غير موجهة</div>
                <div className="pl-4 text-emerald-400">public void endDrag(int x, int y); // إتمام ربط الحافة غير الموجهة</div>
                <div className="pl-4 text-emerald-400">public void dfs(); // خوارزمية البحث في العمق بالاعتماد على المكدس (7 حالات)</div>
                <div className="pl-4 text-emerald-400">public void bfs(); // خوارزمية البحث في العرض بالاعتماد على الطابور (7 حالات)</div>
                <div className="pl-4 text-emerald-400">public void tree(); // شجرة الامتداد الأصغري غير الموزونة مع حذف الحواف الزائدة</div>
                <div className="pl-4 text-emerald-400">public void changeView(); // التبديل بين رسم المخطط ومصفوفة المجاورة</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isGraphW ? (
              <>
                <div className="pl-4">int MAX_VERTS = 13, MAX_WEIGHT = 99, INFINITY = 1000000;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 320, drawingBoxHeight = 207;</div>
                <div className="pl-4 text-emerald-300">vertex[] vertexList = new vertex[13]; // مصفوفة الرؤوس</div>
                <div className="pl-4 text-amber-300">disIs[][] adjMat = new disIs[13][13]; // مصفوفة المجاورة (الأوزان)</div>
                <div className="pl-4 text-amber-300">disIs[][] adjMat2 = new disIs[13][13]; // لحفظ واستعادة المخطط الأصلي</div>
                <div className="pl-4 text-purple-300">priorityQ thePQ = new priorityQ(); // طابور أولوية الحواف</div>
                <div className="pl-4 text-rose-300">int[] tree = new int[13]; int nTree = 0, nVerts = 0, startingVertex = -1, currentVert = 0;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Graph & Prim's MST Operations):</div>
                <div className="pl-4 text-emerald-400">public void makeVertex(int x, int y); // إنشاء رأس جديد بالنقر المزدوج (A-M)</div>
                <div className="pl-4 text-emerald-400">public void startDrag(int x, int y); // بدء سحب حافة غير موجهة</div>
                <div className="pl-4 text-emerald-400">public void endDrag(boolean isNum, int w, int x, int y); // إتمام حافة غير موجهة بالوزن</div>
                <div className="pl-4 text-emerald-400">public void putInPQ(int newEdgeDest, int newEdgeDist); // إدراج/تحديث الحافة في طابور الأولوية</div>
                <div className="pl-4 text-emerald-400">public void mst(); // آلة حالات شجرة الامتداد الأصغري (8 حالات)</div>
                <div className="pl-4 text-emerald-400">public void changeView(); // التبديل بين المخطط ومصفوفة المجاورة الصفراء</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isGraphDW ? (
              <>
                <div className="pl-4">int MAX_VERTS = 13, MAX_WEIGHT = 99, INFINITY = 1000000;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 325, drawingBoxHeight = 207;</div>
                <div className="pl-4 text-emerald-300">vertex[] vertexList = new vertex[13]; // مصفوفة الرؤوس</div>
                <div className="pl-4 text-amber-300">disIs[][] adjMat = new disIs[13][13]; // مصفوفة المجاورة (الأوزان)</div>
                <div className="pl-4 text-blue-300">disP[] sPath = new disP[13]; // مصفوفة أقصر المسارات (Parent & Distance)</div>
                <div className="pl-4 text-rose-300">int[] tree = new int[13]; int nTree = 0, nVerts = 0, startingVertex = -1;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Graph & Dijkstra Operations):</div>
                <div className="pl-4 text-emerald-400">public void makeVertex(int x, int y); // إنشاء رأس جديد بالنقر المزدوج (A-M)</div>
                <div className="pl-4 text-emerald-400">public void startDrag(int x, int y); // بدء سحب حافة موجهة</div>
                <div className="pl-4 text-emerald-400">public void endDrag(boolean isNum, int w, int x, int y); // إتمام حافة موجهة بالوزن</div>
                <div className="pl-4 text-emerald-400">public void path(); // آلة حالات خوارزمية ديكسترا لأقصر المسارات (14 حالة)</div>
                <div className="pl-4 text-emerald-400">public void changeView(); // التبديل بين المخطط ومصفوفة المجاورة الصفراء</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isHashChain ? (
              <>
                <div className="pl-4">int MAX_BUCKETS = 100, MAX_KEY = 999, linesInView = 10;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 320;</div>
                <div className="pl-4">int topMargin = 70, leftMargin = 10, columnWidth = 60, rowHeight = 24;</div>
                <div className="pl-4">int cellWidth = 35, cellHeight = 17, arrowLen = 22;</div>
                <div className="pl-4 text-emerald-300">bucket[] bucketArray; // مصفوفة القوائم المترابطة (الدلاء)</div>
                <div className="pl-4 text-amber-300">int totalBuckets = 25, nPersons = 0, curList = 0, curLink = 0;</div>
                <div className="pl-4 text-blue-300">public int hashFunction(int key) {'{ return key % totalBuckets; }'}</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Separate Chaining Operations):</div>
                <div className="pl-4 text-emerald-400">public void newArray(boolean isNum, int size); // إنشاء جدول بعدد 1-100 قائمة</div>
                <div className="pl-4 text-emerald-400">public void fill(boolean isNum, int count); // ملء الجدول بعناصر عشوائية 0-999</div>
                <div className="pl-4 text-emerald-400">public void insert(boolean isNum, int key); // إدراج فوري O(1) في رأس القائمة المحسوبة</div>
                <div className="pl-4 text-emerald-400">public void find(boolean isNum, int key); // بحث متتابع بالسهم عبر روابط السلسلة</div>
                <div className="pl-4 text-emerald-400">public void delete(boolean isNum, int key); // حذف العقدة مع إزاحة روابط السلسلة</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isHash ? (
              <>
                <div className="pl-4">int ASIZE = 60, MAX_KEY = 999;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 300;</div>
                <div className="pl-4">int topMargin = 80, leftMargin = 10, columnWidth = 85;</div>
                <div className="pl-4">int nCellsPerCol = 12, cellWidth = 35, cellHeight = 17;</div>
                <div className="pl-4 text-emerald-300">person[] personArray = new person[60];</div>
                <div className="pl-4 text-rose-300">person delNode = new person(-1, new Color(212, 208, 200)); // رمز الحذف المحجوز *Del*</div>
                <div className="pl-4 text-amber-300">int totalCells = 60, nPersons = 0, curIn = -1, oldCurIn = -1;</div>
                <div className="pl-4 text-blue-300">public int hashFunction(int key) {'{ return key % totalCells; }'}</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Hash Table Operations):</div>
                <div className="pl-4 text-emerald-400">public void newArray(boolean isNum, int size); // إنشاء جدول بسعة مخصصة 0-60</div>
                <div className="pl-4 text-emerald-400">public void fill(boolean isNum, int count); // ملء الجدول بعناصر عشوائية 0-999</div>
                <div className="pl-4 text-emerald-400">public void insert(boolean isNum, int key); // إدراج بمؤشر أحمر في أول خلية فارغة أو *Del*</div>
                <div className="pl-4 text-emerald-400">public void find(boolean isNum, int key); // بحث خطي متتابع مع تخطي خلايا *Del*</div>
                <div className="pl-4 text-emerald-400">public void delete(boolean isNum, int key); // استبدال العنصر بالعقدة المحجوزة delNode</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isTree ? (
              <>
                <div className="pl-4">int aSize = 31, MAX_KEY = 99;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 320;</div>
                <div className="pl-4">int topMargin = 70, leftMargin = 10, nodeDiameter = 20;</div>
                <div className="pl-4 text-emerald-300">person[] treeArray = new person[31]; // مصفوفة الشجرة المكتملة</div>
                <div className="pl-4 text-amber-300">stack theStack; // مكدس اجتياز الشجرة غير العودي (Inorder Stack)</div>
                <div className="pl-4 text-blue-300">int[] visitArray = new int[31]; // مصفوفة ترتيب الزيارة</div>
                <div className="pl-4 text-rose-300">int curIn = -1, successor = -1, root = 0, nNodes = 0;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (BST Operations):</div>
                <div className="pl-4 text-emerald-400">public void fill(boolean isNum, int n); // توليد عشوائي لشجرة ثنائية متوازنة</div>
                <div className="pl-4 text-emerald-400">public void find(boolean isNum, int key); // بحث متتالي مع سهم أحمر</div>
                <div className="pl-4 text-emerald-400">public void insert(boolean isNum, int key); // إدراج عقدة مع فحص تجاوز العمق 4</div>
                <div className="pl-4 text-emerald-400">public void traverse(); // اجتياز متصاعد Inorder باستخدام المكدس</div>
                <div className="pl-4 text-emerald-400">public void delete(boolean isNum, int key); // حذف عقدة مع حالاتها الثلاث</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isMergeSort ? (
              <>
                <div className="pl-4">int aSize, maxHeight = 200, topMargin = 30, leftMargin = 10;</div>
                <div className="pl-4">int barWidth, barSeparation, barLeftMargin;</div>
                <div className="pl-4 text-emerald-300">person[] workSpace; // مصفوفة مساحة العمل المساعدة O(N)</div>
                <div className="pl-4 text-amber-300">stack theStack; // مكدس استدعاءات الدمج</div>
                <div className="pl-4 text-rose-300">int comps, copies; boolean doneFlag; int codePart = 1;</div>
                <div className="pl-4 text-blue-300">int lower, upper, mid, lowPtrM, highPtrM, upperBoundM, lowerBoundM, nM, jM;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (10-State Divide & Conquer Machine):</div>
                <div className="pl-4 text-emerald-400">public void sortStep(); // آلة حالات الدمج والنسخ العكسي</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isQuickSort2 ? (
              <>
                <div className="pl-4">int aSize, maxHeight = 200, topMargin = 30, leftMargin = 10;</div>
                <div className="pl-4">int barWidth, barSeparation, barLeftMargin;</div>
                <div className="pl-4 text-amber-300">stack leftStack, rightStack;</div>
                <div className="pl-4 text-rose-300">int comps, swaps; boolean doneFlag; int codePart = 0;</div>
                <div className="pl-4 text-blue-300">int left, right, center, size, pivot, leftScan, rightScan;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Median-of-Three Partitioning):</div>
                <div className="pl-4 text-emerald-400">public void sortStep(); // 9-state machine with median sort</div>
                <div className="pl-4">public void swap(int i, int j);</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isQuickSort1 ? (
              <>
                <div className="pl-4">int aSize, maxHeight = 200, topMargin = 30, leftMargin = 10;</div>
                <div className="pl-4">int barWidth, barSeparation, barLeftMargin;</div>
                <div className="pl-4 text-amber-300">stack leftStack, rightStack;</div>
                <div className="pl-4 text-rose-300">int comps, swaps; boolean doneFlag; int codePart = 1;</div>
                <div className="pl-4 text-blue-300">int left, right, pivot, leftScan, rightScan;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (Operations):</div>
                <div className="pl-4 text-emerald-400">public void sortStep(); // 8-state partition machine</div>
                <div className="pl-4">public void swap(int i, int j);</div>
                <div className="pl-4">public void draw(Graphics g);</div>
              </>
            ) : isTowers ? (
              <>
                <div className="pl-4">int nDisks, nDisksOld;</div>
                <div className="pl-4">tower[] theTowers = new tower[3];</div>
                <div className="pl-4 text-amber-300">stack theStack;</div>
                <div className="pl-4">int diskInFlight, fromTower, toTower, codePart = 1;</div>
                <div className="pl-4">boolean isDoneFlag, runFlag;</div>
                <div className="pl-4 text-slate-400 mt-2">// العمليات (State Machine & Drag):</div>
                <div className="pl-4">public void newGame(boolean isNum, int n);</div>
                <div className="pl-4 text-emerald-400">public void step(); // 8-state recursion machine</div>
                <div className="pl-4">public void startDrag(int x, int y);</div>
                <div className="pl-4">public void drag(int x, int y);</div>
                <div className="pl-4">public void endDrag(int x, int y);</div>
              </>
            ) : (
              <>
                <div className="pl-4">int ASIZE = {isLinkList ? '28' : '60'}, MAX_KEY = 999;</div>
                <div className="pl-4">int appletWidth = 440, appletHeight = 320;</div>
                {isLinkList ? (
                  <>
                    <div className="pl-4">int nColumns = 7, nRows = 4;</div>
                    <div className="pl-4 text-amber-300">link first; int curIn, insDex, delDex;</div>
                    <div className="pl-4 text-amber-300">boolean notSorted, areInserting, areDeleting;</div>
                  </>
                ) : (
                  <>
                    <div className="pl-4">int topMargin = 89, leftMargin = 10, columnWidth = 85;</div>
                    <div className="pl-4">int cellWidth = 35, cellHeight = 17, noteBoxTop = 55;</div>
                    {isOrdered && <div className="pl-4 text-amber-300">int lowerBound, upperBound, insertPoint; boolean isLinear, showRange;</div>}
                  </>
                )}
                <div className="pl-4 text-slate-400 mt-2">// العمليات:</div>
                <div className="pl-4">public person makePerson(int height);</div>
                {isLinkList ? (
                  <>
                    <div className="pl-4">public void newLinkList(boolean isNum, int size);</div>
                    <div className="pl-4">public void insert(boolean isNum, int key);</div>
                    <div className="pl-4">public void find(boolean isNum, int key);</div>
                    <div className="pl-4">public void delete(boolean isNum, int key);</div>
                    <div className="pl-4">public void setSortStatus(boolean notSorted);</div>
                  </>
                ) : (
                  <>
                    <div className="pl-4">public void newArray(boolean isNum, int size);</div>
                    <div className="pl-4">public void fill(boolean isNum, int count);</div>
                    <div className="pl-4">public void insert(boolean isNum, int key);</div>
                    <div className="pl-4">public void find(boolean isNum, int key);</div>
                    <div className="pl-4">public void delete(boolean isNum, int key);</div>
                  </>
                )}
              </>
            )}
            <div className="pl-4">public void draw(Graphics g);</div>
            <div>{'}'}</div>
          </div>
        </div>
      )}

      {activeFile === 'personClass' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.personClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold">// كلاس {isGraph || isGraphW || isGraphDW ? 'vertex (الرأس في المخطط)' : isTowers ? 'tower (عمود هانوي)' : 'person المخزن في الخلايا'}:</div>
            {isGraph || isGraphW || isGraphDW ? (
              <div>
                <div>public class vertex {'{'}</div>
                <div className="pl-4">public static char classChar = 'A';</div>
                <div className="pl-4">int x, y; // إحداثيات الرأس على اللوحة</div>
                <div className="pl-4">char label; // حرف التسمية (A, B, C...)</div>
                <div className="pl-4">Color color; // لون الرأس العشوائي</div>
                <div className="pl-4">{isGraph ? 'boolean wasVisited; // هل تمت زيارة الرأس في البحث' : 'boolean isInTree; // هل الرأس جزء من الشجرة (Tree)'}</div>
                <div className="pl-4 mt-2">public vertex(int x, int y) {'{'} ... {'}'}</div>
                <div>{'}'}</div>
              </div>
            ) : isTowers ? (
              <div>
                <div>public class tower {'{'}</div>
                <div className="pl-4">int towerNum;</div>
                <div className="pl-4">int xC; // إحداثي المركز الأفقي (80, 220, 360)</div>
                <div className="pl-4">disk[] theDisks;</div>
                <div className="pl-4">int nDisks;</div>
                <div className="pl-4 mt-2">public tower(int num, int x) {'{'} ... {'}'}</div>
                <div className="pl-4">public void push(disk d);</div>
                <div className="pl-4">public disk pop();</div>
                <div className="pl-4">public disk peek();</div>
                <div className="pl-4">public void draw(Graphics g);</div>
                <div>{'}'}</div>
              </div>
            ) : (
              <div>
                <div>public class person {'{'}</div>
                <div className="pl-4">int height; // القيمة العددية المفتاحية</div>
                <div className="pl-4">Color color; // لون الرسم في واجهة AWT</div>
                <div className="pl-4 mt-2">public person(int h, Color c) {'{'} this.height = h; this.color = c; {'}'}</div>
                <div className="pl-4">public int getHeight() {'{'} return this.height; {'}'}</div>
                <div className="pl-4">public Color getColor() {'{'} return this.color; {'}'}</div>
                <div>{'}'}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeFile === 'linkClass' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.linkClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold">// كلاس {isGraph ? 'Queue (طابور البحث في العرض BFS)' : isGraphW ? 'edge (حافة المخطط الموزونة)' : isGraphDW ? 'disP (عنصر مصفوفة أقصر المسارات sPath)' : isTowers ? 'disk (قرص البرج)' : 'link (عقدة القائمة المرتبطة Node)'}:</div>
            {isGraph ? (
              <div>
                <div>public class Queue {'{'}</div>
                <div className="pl-4 text-slate-400">// طابور دائري لحفظ فهارس الرؤوس في BFS:</div>
                <div className="pl-4">private final int SIZE = 20;</div>
                <div className="pl-4">private int[] queArray = new int[20];</div>
                <div className="pl-4">private int front = 0;</div>
                <div className="pl-4">private int rear = -1;</div>
                <div className="pl-4">private int numItems = 0;</div>
                <div className="pl-4 mt-2">// العمليات (Operations):</div>
                <div className="pl-4 text-emerald-300">public void insert(int j); // إدراج في نهاية الطابور</div>
                <div className="pl-4 text-emerald-300">public int remove(); // سحب من مقدمة الطابور</div>
                <div className="pl-4">public boolean isEmpty(); public int size(); public int peekN(int n);</div>
                <div>{'}'}</div>
              </div>
            ) : isGraphW ? (
              <div>
                <div>public class edge {'{'}</div>
                <div className="pl-4 text-slate-400">// الحقول (Fields):</div>
                <div className="pl-4">public int srcVert; // فهرس رأس البداية (Source Vertex)</div>
                <div className="pl-4">public int destVert; // فهرس رأس النهاية (Destination Vertex)</div>
                <div className="pl-4">public int distance; // وزن أو طول الحافة (Weight/Distance)</div>
                <div className="pl-4 mt-2">// الباني (Constructor):</div>
                <div className="pl-4">public edge(int src, int dest, int dist) {'{'}</div>
                <div className="pl-8">this.srcVert = src; this.destVert = dest; this.distance = dist;</div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            ) : isGraphDW ? (
              <div>
                <div>public class disP {'{'}</div>
                <div className="pl-4 text-slate-400">// عنصر مصفوفة أقصر المسارات (sPath):</div>
                <div className="pl-4">public int parentVert; // الرأس الأب السابق في أقصر مسار</div>
                <div className="pl-4">public int distance; // أقصر مسافة تراكمية من رأس البداية</div>
                <div className="pl-4 mt-2">public disP(int p, int d) {'{'} this.parentVert = p; this.distance = d; {'}'}</div>
                <div>{'}'}</div>
              </div>
            ) : isTowers ? (
              <div>
                <div>public class disk {'{'}</div>
                <div className="pl-4 text-slate-400">// الحقول:</div>
                <div className="pl-4">int diskNum;</div>
                <div className="pl-4">int width, height = 20;</div>
                <div className="pl-4">Color color;</div>
                <div className="pl-4 mt-2">public disk(int num, int totalDisks);</div>
                <div className="pl-4">public void draw(Graphics g, int x, int y);</div>
                <div>{'}'}</div>
              </div>
            ) : (
              <div>
                <div>public class link {'{'}</div>
                <div className="pl-4 text-slate-400">// الحقول (Fields):</div>
                <div className="pl-4">public person persData; // كائن البيانات والمفتاح</div>
                <div className="pl-4">public link next; // مؤشر العقدة التالية (Reference to Next Node)</div>
                <div className="pl-4 text-slate-400 mt-2">// الباني (Constructor):</div>
                <div className="pl-4">public link(person p) {'{'}</div>
                <div className="pl-8">this.persData = p;</div>
                <div className="pl-8">this.next = null;</div>
                <div className="pl-4">{'}'}</div>
                <div className="pl-4 text-slate-400 mt-2">// الدوال (Methods):</div>
                <div className="pl-4">public void displayLink() {'{'}</div>
                <div className="pl-8">System.out.print("{"{"}" + persData.height + "{"}"} ");</div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeFile === 'paramsClass' && 'paramsClassPath' in filesInfo && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.paramsClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-purple-400 font-bold">// كلاس {isGraphW ? 'priorityQ (طابور الأولوية لحواف بريم)' : isGraphDW ? 'disIs (عنصر مصفوفة المجاورة adjMat)' : 'params (سجل تفعيل الاستدعاء العودي Activation Record)'}:</div>
            <div>public class {isGraphW ? 'priorityQ' : isGraphDW ? 'disIs' : 'params'} {'{'}</div>
            {isGraphW ? (
              <>
                <div className="pl-4 text-slate-400">// طابور أولوية الحواف المرتب تنازلياً لسرعة الإخراج O(1):</div>
                <div className="pl-4">private final int SIZE = 20;</div>
                <div className="pl-4">private edge[] queArray = new edge[20];</div>
                <div className="pl-4">private int size = 0;</div>
                <div className="pl-4 mt-2">// العمليات (Operations):</div>
                <div className="pl-4 text-emerald-300">public void insert(edge item); // إدراج مرتب حسب distance</div>
                <div className="pl-4 text-emerald-300">public edge removeMin(); // استخراج الحافة الأقل مسافة من النهاية O(1)</div>
                <div className="pl-4 text-emerald-300">public void removeN(int n); // إزالة الحافة عند الفهرس n</div>
                <div className="pl-4">public edge peekMin(); public int size(); public boolean isEmpty();</div>
                <div className="pl-4">public edge peekN(int n); public int find(int destVert);</div>
              </>
            ) : isGraphDW ? (
              <>
                <div className="pl-4 text-slate-400">// عنصر مصفوفة المجاورة (adjMat):</div>
                <div className="pl-4">public int distance; // وزن الحافة الموجهة أو INFINITY (1000000)</div>
                <div className="pl-4">public boolean isInTree; // هل الحافة تنتمي لشجرة أقصر المسارات المعروضة</div>
                <div className="pl-4 mt-2">// الباني (Constructor):</div>
                <div className="pl-4">public disIs(int d, boolean inTree) {'{'} this.distance = d; this.isInTree = inTree; {'}'}</div>
              </>
            ) : isMergeSort ? (
              <>
                <div className="pl-4 text-slate-400">// معاملات استدعاء دالة recMergeSort:</div>
                <div className="pl-4">int lower; // الحد الأدنى للنطاق الحالي</div>
                <div className="pl-4">int upper; // الحد الأقصى للنطاق الحالي</div>
                <div className="pl-4">int mid; // نقطة المنتصف</div>
                <div className="pl-4 text-amber-300">int returnCode; // نقطة استئناف التنفيذ (5 أو 6)</div>
                <div className="pl-4 mt-2">// الباني (Constructor):</div>
                <div className="pl-4">public params(int low, int up, int m, int ret) {'{'}</div>
                <div className="pl-8">this.lower = low; this.upper = up; this.mid = m; this.returnCode = ret;</div>
                <div className="pl-4">{'}'}</div>
              </>
            ) : (
              <>
                <div className="pl-4 text-slate-400">// معاملات استدعاء دالة doTowers:</div>
                <div className="pl-4">int nDisks;</div>
                <div className="pl-4">int fromTower;</div>
                <div className="pl-4">int toTower;</div>
                <div className="pl-4">int interTower;</div>
                <div className="pl-4 text-amber-300">int returnCode; // نقطة استئناف التنفيذ (5, 7, 8)</div>
                <div className="pl-4 mt-2">// الباني:</div>
                <div className="pl-4">public params(int n, int from, int to, int inter, int ret) {'{'}</div>
                <div className="pl-8">this.nDisks = n; this.fromTower = from; this.toTower = to; this.interTower = inter; this.returnCode = ret;</div>
                <div className="pl-4">{'}'}</div>
              </>
            )}
            <div>{'}'}</div>
          </div>
        </div>
      )}

      {activeFile === 'stackClass' && 'stackClassPath' in filesInfo && (
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            مسار الملف الثنائي: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{filesInfo.stackClassPath}</code>
          </div>
          <div className="bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
            <div className="text-rose-400 font-bold">// كلاس {isGraph ? 'stack (مكدس البحث في العمق DFS)' : isGraphW ? 'disIs (عنصر مصفوفة المجاورة adjMat في المخطط غير الموجه)' : isTree ? 'مكدس اجتياز الشجرة الثنائية غير العودي (Inorder Traversal Stack)' : isQuickSort1 || isQuickSort2 ? 'مكدس حفظ حدود التقسيم Partition Stack' : isMergeSort ? 'مكدس استدعاءات الدمج Activation Stack' : 'مكدس استدعاءات العودية لمحاكاة استدعاء النظام Call Stack'}:</div>
            {isGraphW ? (
              <div>
                <div>public class disIs {'{'}</div>
                <div className="pl-4 text-slate-400">// عنصر مصفوفة المجاورة (adjMat):</div>
                <div className="pl-4">public int distance; // وزن الحافة غير الموجهة أو INFINITY (1000000)</div>
                <div className="pl-4">public boolean isInTree; // هل الحافة تنتمي لشجرة الامتداد الأصغري MST</div>
                <div className="pl-4 mt-2">// الباني (Constructor):</div>
                <div className="pl-4">public disIs(int d, boolean inTree) {'{'} this.distance = d; this.isInTree = inTree; {'}'}</div>
                <div>{'}'}</div>
              </div>
            ) : (
              <div>
                <div>public class stack {'{'}</div>
                <div className="pl-4 text-slate-400">// الحقول والمصفوفة:</div>
                <div className="pl-4">{isGraph ? 'private int[] st = new int[20]; // مصفوفة فهارس رؤوس المكدس' : isQuickSort1 || isQuickSort2 ? 'private int[] st = new int[50];' : isTree ? 'private int[] st = new int[31]; // مصفوفة فهارس العقد' : 'private params[] stackArray;'}</div>
                <div className="pl-4">private int top = -1;</div>
                <div className="pl-4 mt-2">// العمليات الأساسية:</div>
                {isGraph || isQuickSort1 || isQuickSort2 || isTree ? (
                  <>
                    <div className="pl-4">public void push(int val) {'{'} st[++top] = val; {'}'}</div>
                    <div className="pl-4">public int pop() {'{'} return st[top--]; {'}'}</div>
                    {(isGraph || isTree) && <div className="pl-4">public int peek() {'{'} return st[top]; {'}'}</div>}
                    {isGraph && <div className="pl-4">public int peekN(int n) {'{'} return st[n]; {'}'} public int size() {'{'} return top + 1; {'}'}</div>}
                    <div className="pl-4">public boolean isEmpty() {'{'} return (top == -1); {'}'}</div>
                  </>
                ) : (
                  <>
                    <div className="pl-4">public stack(int max) {'{'} stackArray = new params[max]; top = -1; {'}'}</div>
                    <div className="pl-4">public void push(params p) {'{'} stackArray[++top] = p; {'}'}</div>
                    <div className="pl-4">public params pop() {'{'} return stackArray[top--]; {'}'}</div>
                    <div className="pl-4">public params peek() {'{'} return stackArray[top]; {'}'}</div>
                    <div className="pl-4">public boolean isEmpty() {'{'} return (top == -1); {'}'}</div>
                  </>
                )}
                <div>{'}'}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
