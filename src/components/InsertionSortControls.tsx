import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
} from 'lucide-react';

interface InsertionSortControlsProps {
  onNew: () => void;
  onSize: () => void;
  onDraw: () => void;
  onRun: () => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  aSize: number;
  initOrder: number;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const InsertionSortControls: React.FC<InsertionSortControlsProps> = ({
  onNew,
  onSize,
  onDraw,
  onRun,
  onStep,
  onTogglePlay,
  onReset,
  onSpeedChange,
  isRunning,
  aSize,
  initOrder,
  classicTheme,
  setClassicTheme,
}) => {
  const [speedVal, setSpeedVal] = useState<number>(aSize === 10 ? 250 : 75);

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeedVal(val);
    onSpeedChange(val);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onNew}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            title="تبديل ترتيب البيانات بين عشوائي ومعكوس"
          >
            New ({initOrder === 1 ? 'Random' : 'Inverse'})
          </button>

          <button
            type="button"
            onClick={onSize}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="التبديل بين 10 أعمدة و 100 عمود"
          >
            Size ({aSize} Bars)
          </button>

          <button
            type="button"
            onClick={onDraw}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-slate-700 hover:bg-slate-800 text-white'
            }`}
            title="إعادة رسم الأعمدة والشاشة"
          >
            Draw
          </button>

          <button
            type="button"
            onClick={onRun}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-blue-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            title="تشغيل الترتيب تلقائياً"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run'}
          </button>

          <button
            type="button"
            onClick={onStep}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
            title="تنفيذ خطوة واحدة من خوارزمية ترتيب الإدراج"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Step
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">الحجم:</span>
          <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
            {aSize} عمود
          </span>
          <span className="font-semibold text-slate-500">النمط:</span>
          <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
            {initOrder === 1 ? 'عشوائي (Random)' : 'معكوس (Inverse)'}
          </span>
        </div>
      </div>

      {/* Helper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            {isRunning ? 'إيقاف مؤقت' : 'تشغيل مستمر'}
          </button>

          <button
            type="button"
            onClick={onStep}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
          >
            <SkipForward className="w-3.5 h-3.5 text-blue-600" />
            خطوة واحدة
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة تعيين
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[11px] text-slate-500">سرعة التحريك:</span>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={speedVal}
              onChange={handleSpeedSlider}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-slate-500 w-10 text-left">
              {speedVal}ms
            </span>
          </div>

          <button
            type="button"
            onClick={() => setClassicTheme(!classicTheme)}
            className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-medium text-slate-700 transition"
          >
            {classicTheme ? '🖥️ مظهر Java AWT الكلاسيكي' : '✨ مظهر حديث'}
          </button>
        </div>
      </div>
    </div>
  );
};
