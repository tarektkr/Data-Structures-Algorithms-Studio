import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Grid,
  Layers,
  Sparkles,
  Search,
  Network,
  GitFork,
} from 'lucide-react';
import { GraphOpMode } from '../utils/graphLogic';

interface GraphControlsProps {
  onNew: () => void;
  onDFS: () => void;
  onBFS: () => void;
  onTree: () => void;
  onView: () => void;
  onSample: () => void;
  onStep: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  showAdjm: boolean;
  opMode: GraphOpMode;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
  nVerts: number;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  onNew,
  onDFS,
  onBFS,
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
  classicTheme,
  setClassicTheme,
  nVerts,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
      {/* Top row: Primary Operations */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* New Button */}
          <button
            type="button"
            onClick={onNew}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New
          </button>

          {/* DFS Button */}
          <button
            type="button"
            onClick={onDFS}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              opMode === 1
                ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            DFS (عمق)
          </button>

          {/* BFS Button */}
          <button
            type="button"
            onClick={onBFS}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              opMode === 2
                ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                : 'bg-sky-100 text-sky-900 hover:bg-sky-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            BFS (عرض)
          </button>

          {/* Tree Button */}
          <button
            type="button"
            onClick={onTree}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              opMode === 3
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Tree (شجرة)
          </button>

          {/* View Button */}
          <button
            type="button"
            onClick={onView}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
              showAdjm
                ? 'bg-amber-400 text-amber-950 border-amber-500'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {showAdjm ? 'عرض المخطط' : 'مصفوفة المجاورة (View)'}
          </button>

          {/* Sample Button */}
          <button
            type="button"
            onClick={onSample}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            نموذج جاهز (Sample)
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setClassicTheme(true)}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              classicTheme
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AWT كلاسيكي
          </button>
          <button
            type="button"
            onClick={() => setClassicTheme(false)}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              !classicTheme
                ? 'bg-white text-slate-900 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            حديث
          </button>
        </div>
      </div>

      {/* Execution controls: Step, Run, Reset, Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Step Button */}
          <button
            type="button"
            onClick={onStep}
            disabled={opMode === 0}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <StepForward className="w-3.5 h-3.5" />
            خطوة (Step)
          </button>

          {/* Run/Pause Button */}
          <button
            type="button"
            onClick={onToggleRun}
            disabled={opMode === 0}
            className={`px-3 py-1.5 font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                إيقاف مؤقت
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                تشغيل مستمر
              </>
            )}
          </button>

          {/* Reset Visited Button */}
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition border border-slate-300"
          >
            إعادة تعيين الزيارات
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">السرعة:</span>
          <input
            type="range"
            min="100"
            max="1200"
            step="100"
            defaultValue="500"
            onChange={(e) => onSpeedChange(1300 - Number(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
