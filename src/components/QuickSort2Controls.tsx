import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  BarChart3,
} from 'lucide-react';

interface QuickSort2ControlsProps {
  onNew: () => void;
  onSize: () => void;
  onDraw: () => void;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  aSize: number;
  initOrder: number; // 1: Random, 2: Inverse
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const QuickSort2Controls: React.FC<QuickSort2ControlsProps> = ({
  onNew,
  onSize,
  onDraw,
  onRun,
  onStep,
  onReset,
  onSpeedChange,
  isRunning,
  aSize,
  initOrder,
  classicTheme,
  setClassicTheme,
}) => {
  const [speedVal, setSpeedVal] = useState<number>(250);

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeedVal(val);
    onSpeedChange(val);
  };

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 shadow-sm space-y-4">
      {/* Top Header Row with Classic AWT Toggle & Order Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            أزرار تحكم الترتيب السريع 2 - تجزيء الوسيط من ثلاثة (Quicksort 2)
          </span>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold">
            {aSize} عمود
          </span>
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
              initOrder === 1
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {initOrder === 1 ? 'عشوائي (Random)' : 'معكوس (Inverse)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setClassicTheme(!classicTheme)}
            className={`text-xs px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 border ${
              classicTheme
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {classicTheme ? 'مظهر AWT الأصلي (1998)' : 'المظهر العصري (Modern)'}
          </button>
        </div>
      </div>

      {/* Button Toolbar matching Robert Lafore Java Applet */}
      <div className="flex flex-wrap items-center gap-2">
        {/* New Button */}
        <button
          type="button"
          onClick={onNew}
          title="إنشاء بيانات جديدة والتبديل بين الترتيب العشوائي والمعكوس"
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg shadow-sm active:scale-95 transition"
        >
          New (بيانات جديدة)
        </button>

        {/* Size Button */}
        <button
          type="button"
          onClick={onSize}
          title="التبديل بين حجم 10 أعمدة و 100 عمود"
          className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm active:scale-95 transition"
        >
          Size (تبديل الحجم: {aSize === 10 ? '100 عمود' : '10 أعمدة'})
        </button>

        {/* Draw Button */}
        <button
          type="button"
          onClick={onDraw}
          title="إعادة رسم اللوحة بالكامل"
          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg shadow-sm active:scale-95 transition"
        >
          Draw (إعادة رسم)
        </button>

        {/* Run / Pause Button */}
        <button
          type="button"
          onClick={onRun}
          title="تشغيل الترتيب السريع آلياً وبشكل مستمر"
          className={`px-4 py-1.5 font-bold text-xs rounded-lg shadow-sm active:scale-95 transition flex items-center gap-1.5 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> إيقاف مؤقت (Pause)
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Run (تشغيل تلقائي)
            </>
          )}
        </button>

        {/* Step Button */}
        <button
          type="button"
          onClick={onStep}
          disabled={isRunning}
          title="تنفيذ خطوة تجزيء ومقارنة واحدة"
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm active:scale-95 transition flex items-center gap-1.5"
        >
          <SkipForward className="w-3.5 h-3.5" />
          Step (خطوة واحدة)
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          title="إعادة ضبط نفس الترتيب الحالي"
          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-lg shadow-sm active:scale-95 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة تعيين
        </button>
      </div>

      {/* Speed Slider Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-slate-600 font-medium">سرعة التحريك (Run Speed):</span>
          <input
            type="range"
            min="20"
            max="800"
            step="20"
            value={speedVal}
            onChange={handleSpeedSlider}
            className="w-36 accent-emerald-600 cursor-pointer"
          />
          <span className="font-mono text-slate-500 text-[11px] min-w-[50px]">
            {speedVal} ms
          </span>
        </div>

        <div className="text-slate-500 text-[11px]">
          🎯 مبدأ وسيط الثلاثة (Median-of-Three): يختار وسيط (Left, Center, Right) كمحور لتفادي أسوأ أداء O(N²)!
        </div>
      </div>
    </div>
  );
};
