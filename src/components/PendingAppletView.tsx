import React from 'react';
import { AppletMetadata } from '../types/appletCatalog';
import {
  Clock,
  UploadCloud,
  FileCode,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface PendingAppletViewProps {
  applet: AppletMetadata;
  onReturnToActive: () => void;
}

export const PendingAppletView: React.FC<PendingAppletViewProps> = ({
  applet,
  onReturnToActive,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
        <div className="p-2.5 bg-amber-200/80 rounded-lg text-amber-800">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono">
            {applet.chapterAr}
          </span>
          <h2 className="text-lg font-bold mt-1 text-slate-900">{applet.titleAr}</h2>
          <p className="text-xs text-amber-800 font-mono mt-0.5" dir="ltr">
            {applet.titleEn}
          </p>
        </div>
      </div>

      {/* Description & Overview */}
      <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          نبذة عن هذا البريمج (Algorithm Overview):
        </h3>
        <p>{applet.descriptionAr}</p>
        <p className="text-slate-500 font-mono text-[11px]" dir="ltr">
          {applet.descriptionEn}
        </p>
      </div>

      {/* Expected Files Box */}
      <div className="border border-slate-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-600" />
          الملفات المرفقة المطلوبة لبناء هذا البريمج:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {applet.classFiles.map((file) => (
            <div
              key={file}
              className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700"
              dir="ltr"
            >
              <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{file}</span>
            </div>
          ))}
          <div
            className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700"
            dir="ltr"
          >
            <FileCode className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{applet.htmlFile}</span>
          </div>
        </div>
      </div>

      {/* How to add it instructions */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-xs space-y-2 text-blue-950">
        <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          طريقة إضافة هذا البريمج:
        </div>
        <p className="leading-relaxed">
          فقط أرسل الملفات المرفقة الخاصة به في رسالتك التالية (ملف <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">.html</code> وملفات <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">.class</code>)، وسأقوم فوراً بـ:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pr-2">
          <li>تحليل ملفات البايت كود واستخراج كافة الخوارزميات والمعادلات الرياضية.</li>
          <li>برمجة كود C# Windows Forms كامل لها وإضافته لمشروع Visual Studio.</li>
          <li>تفعيل شاشة المحاكاة التفاعلية المباشرة لها في هذا التطبيق ليصبح متاحاً بنقرة واحدة!</li>
        </ul>
      </div>

      {/* Back Button */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={onReturnToActive}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة إلى البريمج النشط (المصفوفة غير المرتبة - Unordered Array)
        </button>
      </div>
    </div>
  );
};
