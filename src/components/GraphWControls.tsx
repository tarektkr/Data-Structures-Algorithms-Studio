import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Shuffle, Eye, GitBranch, Trash2 } from 'lucide-react';

interface GraphWControlsProps {
  onNew: () => void;
  onTree: () => void;
  onView: () => void;
  onSample: () => void;
  onStep: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  showAdjm: boolean;
  opMode: number;
  inputValue: string;
  setInputValue: (v: string) => void;
  classicTheme: boolean;
  setClassicTheme: (v: boolean) => void;
  nVerts: number;
}

export const GraphWControls: React.FC<GraphWControlsProps> = ({
  onNew,
  onTree,
  onView,
  onSample,
  onStep,
  onToggleRun,
  onReset,
  onSpeedChange,
  isRunning,
  showAdjm,
  opMode,
  inputValue,
  setInputValue,
  classicTheme,
  setClassicTheme,
  nVerts,
}) => {
  return (
    <div
      className={`p-3 rounded-xl border mb-3 flex flex-wrap items-center justify-between gap-3 text-xs ${
        classicTheme
          ? 'bg-neutral-300 border-neutral-400 font-sans'
          : 'bg-white/80 backdrop-blur-md border-slate-200/80 shadow-sm'
      }`}
    >
      {/* Primary Action Buttons matching Robert Lafore's AWT Applet */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={onNew}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
          title="مسح المخطط القديم (اضغط مرتين للتأكيد)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>New</span>
        </button>

        <button
          onClick={onTree}
          disabled={nVerts === 0}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          } ${nVerts === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="بناء شجرة الامتداد الأصغري (Minimum Spanning Tree - Prim's Algorithm)"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Tree</span>
        </button>

        <button
          onClick={onView}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            showAdjm
              ? 'bg-amber-400 text-amber-950 border border-amber-500 font-black'
              : classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
          }`}
          title="التبديل بين المخطط ومصفوفة المجاورة الصفراء"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View {showAdjm ? '(Matrix)' : '(Graph)'}</span>
        </button>

        <button
          onClick={onSample}
          className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
          }`}
          title="تحميل المخطط النموذجي (6 رؤوس من كتاب روبرت لافور)"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Sample Graph</span>
        </button>
      </div>

      {/* Input Number for Edge Weight */}
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] font-bold text-slate-700">Enter number:</label>
        <input
          type="number"
          min="0"
          max="99"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="0-99"
          className="w-16 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
          title="اكتب وزن الحافة قبل السحب بين رأسين"
        />
      </div>

      {/* Execution Stepper / Automatic Play Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onStep}
          disabled={nVerts === 0}
          className="px-2.5 py-1.5 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1 transition disabled:opacity-50"
          title="تنفيذ خطوة واحدة"
        >
          <StepForward className="w-3.5 h-3.5" />
          <span>Step</span>
        </button>

        <button
          onClick={onToggleRun}
          disabled={nVerts === 0}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition text-white ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          } disabled:opacity-50`}
          title={isRunning ? 'إيقاف مؤقت' : 'تشغيل تلقائي متواصل'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Run'}</span>
        </button>

        <button
          onClick={onReset}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition"
          title="إعادة ضبط المخطط بالكامل"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Speed Slider */}
        <div className="flex items-center gap-1 border-s ps-2 border-slate-300">
          <span className="text-[10px] text-slate-500">Speed</span>
          <input
            type="range"
            min="100"
            max="1200"
            step="100"
            defaultValue="500"
            onChange={(e) => onSpeedChange(1300 - Number(e.target.value))}
            className="w-14 accent-blue-600 cursor-pointer"
            title="سرعة المحاكاة"
          />
        </div>

        {/* Classic Theme Switch */}
        <button
          onClick={() => setClassicTheme(!classicTheme)}
          className={`text-[10px] px-2 py-1 rounded border font-mono transition ${
            classicTheme
              ? 'bg-neutral-800 text-neutral-100 border-neutral-900'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
          }`}
          title="تبديل مظهر 1998 الكلاسيكي"
        >
          {classicTheme ? '1998 AWT' : 'Modern'}
        </button>
      </div>
    </div>
  );
};
