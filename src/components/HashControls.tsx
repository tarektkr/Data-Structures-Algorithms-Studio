import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Monitor, Sparkles } from 'lucide-react';
import { HashOpMode } from '../utils/hashLogic';

interface HashControlsProps {
  onNew: () => void;
  onFill: () => void;
  onIns: () => void;
  onDel: () => void;
  onFind: () => void;
  onStep: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  opMode: HashOpMode;
  inputValue: string;
  setInputValue: (val: string) => void;
  totalCells: number;
  nPersons: number;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const HashControls: React.FC<HashControlsProps> = ({
  onNew,
  onFill,
  onIns,
  onDel,
  onFind,
  onStep,
  onToggleRun,
  onReset,
  onSpeedChange,
  isRunning,
  opMode,
  inputValue,
  setInputValue,
  totalCells,
  nPersons,
  classicTheme,
  setClassicTheme,
}) => {
  const loadFactor = totalCells > 0 ? ((nPersons / totalCells) * 100).toFixed(1) : '0';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top Header Row with Theme Toggle and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            جدول الهاش بالفحص الخطي (Linear-Probe Hash Table)
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">
            الفصل 11
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500">العناصر:</span>
            <span className="font-mono font-bold text-slate-800">{nPersons}/{totalCells}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">معامل الامتلاء (α):</span>
            <span
              className={`font-mono font-bold ${
                parseFloat(loadFactor) > 75
                  ? 'text-rose-600'
                  : parseFloat(loadFactor) > 50
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              %{loadFactor}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setClassicTheme(!classicTheme)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            title="تبديل مظهر العرض بين نمط AWT 1998 والنمط العصري"
          >
            {classicTheme ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-600" />
                <span>ثيم AWT (1998)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>ثيم Modern</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Operation Buttons & Number Input */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Buttons matching Java Applet: New, Fill, Ins, Del, Find */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onNew}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 active:scale-95'
            }`}
            title="إنشاء جدول هاش جديد بالحجم المكتوب في خانة الإدخال (حتى 60 خلية)"
          >
            New
          </button>

          <button
            type="button"
            onClick={onFill}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 active:scale-95'
            }`}
            title="تعبئة الجدول بعدد N من العناصر بمفاتيح عشوائية فريدة"
          >
            Fill
          </button>

          <button
            type="button"
            onClick={onIns}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 active:scale-95'
            }`}
            title="إدراج عنصر جديد بالمفتاح N وفق دالة الهاش والفحص الخطي عند التصادم"
          >
            Ins
          </button>

          <button
            type="button"
            onClick={onDel}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 active:scale-95'
            }`}
            title="حذف العنصر صاحب المفتاح N واستبداله بالعلامة الحارسة *Del*"
          >
            Del
          </button>

          <button
            type="button"
            onClick={onFind}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 active:scale-95'
            }`}
            title="البحث عن العنصر صاحب المفتاح N وتتبع الفحص الخطي خطوة بخطوة"
          >
            Find
          </button>
        </div>

        {/* Enter Number Box */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="hash-number-input" className="text-xs font-medium text-slate-700">
            Enter number:
          </label>
          <input
            id="hash-number-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-16 px-2 py-1 text-xs font-mono font-bold text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            placeholder="Key"
          />
        </div>

        {/* Runner & Stepper Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onStep}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg shadow-xs transition active:scale-95"
            title="تنفيذ خطوة فحص/إدراج/حذف واحدة فقط (Step)"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            type="button"
            onClick={onToggleRun}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs transition active:scale-95 ${
              isRunning ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title={isRunning ? 'إيقاف مؤقت للتشغيل الآلي' : 'تشغيل الخطوات تلقائياً'}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
            title="إعادة تعيين الجدول إلى الحالة الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speed Slider Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span>سرعة المحاكاة:</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            defaultValue="350"
            onChange={(e) => onSpeedChange(1100 - parseInt(e.target.value, 10))}
            className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          دالة التجزئة: <span className="font-bold text-slate-700">Index = Key % {totalCells}</span>
        </div>
      </div>
    </div>
  );
};
