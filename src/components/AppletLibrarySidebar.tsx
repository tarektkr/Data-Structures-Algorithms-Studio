import React, { useState, useEffect } from 'react';
import {
  APPLET_CATALOG,
  AppletMetadata,
  AppletChapter,
} from '../types/appletCatalog';
import {
  Folder,
  FolderOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Send,
  HelpCircle,
  FileCode,
  Layers,
} from 'lucide-react';

interface AppletLibrarySidebarProps {
  currentAppletId: string;
  onSelectApplet: (applet: AppletMetadata) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AppletLibrarySidebar: React.FC<AppletLibrarySidebarProps> = ({
  currentAppletId,
  onSelectApplet,
  isOpen,
  onToggle,
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = { 11: true };
    const currentChapter = APPLET_CATALOG.find((ch) =>
      ch.applets.some((a) => a.id === currentAppletId)
    );
    if (currentChapter) {
      initial[currentChapter.chapterNum] = true;
    }
    return initial;
  });

  useEffect(() => {
    const currentChapter = APPLET_CATALOG.find((ch) =>
      ch.applets.some((a) => a.id === currentAppletId)
    );
    if (currentChapter) {
      setExpandedChapters((prev) => ({
        ...prev,
        [currentChapter.chapterNum]: true,
      }));
    }
  }, [currentAppletId]);

  const toggleChapter = (chapterNum: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterNum]: !prev[chapterNum],
    }));
  };

  const totalApplets = APPLET_CATALOG.reduce((acc, ch) => acc + ch.applets.length, 0);
  const activeCount = APPLET_CATALOG.reduce(
    (acc, ch) => acc + ch.applets.filter((a) => a.status === 'active').length,
    0
  );

  return (
    <aside
      className={`bg-white border-l border-slate-200 transition-all duration-300 flex flex-col shrink-0 shadow-sm ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        {isOpen ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <Layers className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <h2 className="text-xs font-bold truncate">مكتبة البريمجات (Applet Suite)</h2>
              <p className="text-[10px] text-slate-400">
                {activeCount} نشط من أصل {totalApplets} بريمج
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto" title="مكتبة البريمجات">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          className="p-1 hover:bg-slate-800 text-slate-300 rounded transition"
          title={isOpen ? 'طي القائمة' : 'توسيع مكتبة البريمجات'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Chapters & Applets List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 text-xs">
          {/* Quick Info Box */}
          <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-lg text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              منصة بريمجات روبرت لافور
            </div>
            <p className="text-[10px] text-blue-800 leading-relaxed">
              اختر أي بريمج لعرض محاكاته المباشرة وكود C# الجاهز، أو اختر بريمجاً بانتظار الملفات لمعرفة الملفات المطلوبة.
            </p>
          </div>

          {APPLET_CATALOG.map((chapter) => {
            const isExpanded = !!expandedChapters[chapter.chapterNum];

            return (
              <div key={chapter.chapterNum} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                {/* Chapter Header */}
                <button
                  type="button"
                  onClick={() => toggleChapter(chapter.chapterNum)}
                  className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-between font-bold text-[11px] transition"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">{chapter.nameAr}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Applet Items */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 bg-white">
                    {chapter.applets.map((applet) => {
                      const isSelected = currentAppletId === applet.id;
                      const isActive = applet.status === 'active';

                      return (
                        <button
                          key={applet.id}
                          type="button"
                          onClick={() => onSelectApplet(applet)}
                          className={`w-full text-right p-2.5 flex items-start justify-between gap-2 transition ${
                            isSelected
                              ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5 truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-semibold">{applet.titleAr}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">
                              {applet.classFiles[0]}
                            </div>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                متاح
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                                <Clock className="w-3 h-3 text-slate-400" />
                                بانتظار الملفات
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Instructions */}
      {isOpen && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Send className="w-3.5 h-3.5 text-blue-600" />
            كيف ترسل بقية البريمجات؟
          </div>
          <p className="text-[10px] leading-relaxed">
            يمكنك إرسال ملفات أي بريمج (<code className="font-mono">.class</code> و <code className="font-mono">.html</code>) في رسائلك القادمة وسأقوم ببرمجته وإضافته فوراً!
          </p>
        </div>
      )}
    </aside>
  );
};
