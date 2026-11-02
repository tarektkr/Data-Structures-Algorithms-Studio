import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Shuffle, Eye, Route, Trash2 } from 'lucide-react';

interface GraphDWControlsProps {
  onNew: () => void;
  onPath: () => void;
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

export const GraphDWControls: React.FC<GraphDWControlsProps> = ({
  onNew,
  onPath,
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
          onClick={onPath}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
          }`}
          title="بدء أو متابعة خوارزمية ديكسترا لأقصر المسارات"
        >
          <Route className="w-3.5 h-3.5" />
          <span>Path</span>
        </button>

        <button
          onClick={onView}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            showAdjm
              ? 'bg-amber-600 text-white border border-amber-700'
              : classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
          }`}
          title="التبديل بين المخطط الرسومي ومصفوفة المجاورة (Adjacency Matrix)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View {showAdjm ? '(Graph)' : '(Matrix)'}</span>
        </button>

        <button
          onClick={onSample}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            classicTheme
              ? 'bg-neutral-100 border border-neutral-400 shadow active:translate-y-0.5'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
          title="تحميل مخطط عينة جاهز (5 رؤوس و 8 حواف من كتاب لافور)"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>مخطط جاهز (Sample)</span>
        </button>
      </div>

      {/* Edge Weight Input Field */}
      <div className="flex items-center gap-2">
        <label className="text-slate-700 font-semibold text-[11px] flex items-center gap-1">
          <span>وزن الحافة (0-99):</span>
        </label>
        <input
          type="number"
          min="0"
          max="99"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="وزن"
          className="w-16 px-2 py-1 border border-slate-300 rounded font-mono text-center font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="اكتب وزن الحافة قبل سحب الماوس بين الرأسين"
        />
      </div>

      {/* Animation & Step Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onStep}
          disabled={isRunning || nVerts === 0}
          className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 transition ${
            isRunning || nVerts === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="خطوة واحدة في خوارزمية ديكسترا (Step)"
        >
          <StepForward className="w-3.5 h-3.5" />
          <span>Step</span>
        </button>

        <button
          onClick={onToggleRun}
          disabled={nVerts === 0}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${
            isRunning
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
          title="تشغيل آلي مستمر / إيقاف مؤقت"
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'إيقاف' : 'تشغيل (Run)'}</span>
        </button>

        <button
          onClick={onReset}
          className="px-2.5 py-1.5 rounded-lg font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
          title="إعادة ضبط المسارات والشجرة"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Speed Slider */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mr-2">
          <span>السرعة:</span>
          <input
            type="range"
            min="100"
            max="1200"
            step="100"
            defaultValue="600"
            onChange={(e) => onSpeedChange(1300 - Number(e.target.value))}
            className="w-16 accent-blue-600 cursor-pointer"
            title="التحكم بسرعة التحريك"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setClassicTheme(!classicTheme)}
          className="px-2 py-1 text-[11px] rounded border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600"
          title="التبديل بين الثيم الكلاسيكي AWT 1998 والحديث"
        >
          {classicTheme ? 'ثيم كلاسيكي 1998' : 'ثيم حديث'}
        </button>
      </div>
    </div>
  );
};
