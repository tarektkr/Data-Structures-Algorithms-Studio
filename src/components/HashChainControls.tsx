import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Monitor, Sparkles } from 'lucide-react';
import { HashChainOpMode } from '../utils/hashChainLogic';

interface HashChainControlsProps {
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
  opMode: HashChainOpMode;
  inputValue: string;
  setInputValue: (val: string) => void;
  totalBuckets: number;
  nPersons: number;
  topDisplayLine: number;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const HashChainControls: React.FC<HashChainControlsProps> = ({
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
  totalBuckets,
  nPersons,
  topDisplayLine,
  classicTheme,
  setClassicTheme,
}) => {
  const loadFactor = totalBuckets > 0 ? (nPersons / totalBuckets).toFixed(2) : '0';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top Header Row with Theme Toggle and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            جدول الهاش بالسلاسل المنفصلة (Separate-Chaining Hash Table)
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">
            الفصل 11
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500">القوائم (Buckets):</span>
            <span className="font-mono font-bold text-slate-800">{totalBuckets}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">العناصر:</span>
            <span className="font-mono font-bold text-indigo-700">{nPersons}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">معامل التحميل (λ = N/M):</span>
            <span
              className={`font-mono font-bold ${
                parseFloat(loadFactor) > 2.0
                  ? 'text-rose-600'
                  : parseFloat(loadFactor) > 1.0
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {loadFactor}
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
            title="إنشاء جدول هاش جديد بعدد N من القوائم المترابطة (حتى 100 قائمة)"
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
            title="تعبئة الجدول بـ N عنصر عشوائي في السلاسل المناسبة"
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
            title="إدراج عنصر جديد بالمفتاح N في رأس القائمة list = key % totalBuckets"
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
            title="حذف العنصر صاحب المفتاح N من سلسلته المترابطة"
          >
            Del
          </button>

          <button
            type="button"
            onClick={onFind}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
              classicTheme
                ? 'bg-[#d4d0c8] hover:bg-[#c0c0c0] active:bg-[#b0b0b0] text-black border-slate-400'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 active:scale-95'
            }`}
            title="البحث عن المفتاح N داخل قائمته المحسوبة بدالة الهاش"
          >
            Find
          </button>
        </div>

        {/* Enter Number Input matching AWT TextField */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="hash-chain-num-input" className="text-xs text-slate-600 font-medium">
            Enter number:
          </label>
          <input
            id="hash-chain-num-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-20 px-2 py-1 text-xs font-mono font-bold text-center border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            placeholder="0-999"
          />
        </div>
      </div>

      {/* Execution Stepper, Automatic Runner, Speed & Reset Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Step Button */}
          <button
            type="button"
            onClick={onStep}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition active:scale-95 shadow-xs"
            title="تنفيذ الخطوة التالية من العملية الحالية"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          {/* Run / Pause Button */}
          <button
            type="button"
            onClick={onToggleRun}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition active:scale-95 shadow-xs ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="تشغيل الخوارزمية آلياً أو إيقافها مؤقتاً"
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

          {/* Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
            title="إعادة تعيين جدول الهاش إلى 25 قائمة و 25 عنصراً"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>السرعة:</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            defaultValue="350"
            onChange={(e) => onSpeedChange(1100 - parseInt(e.target.value, 10))}
            className="w-24 accent-blue-600 cursor-pointer"
            title="التحكم بسرعة التحريك في الوضع التلقائي"
          />
        </div>
      </div>
    </div>
  );
};
