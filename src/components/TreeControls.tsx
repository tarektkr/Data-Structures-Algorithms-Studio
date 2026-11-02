import React from 'react';
import { Play, Pause, StepForward, RotateCcw, Monitor, Sparkles } from 'lucide-react';
import { TreeOpMode } from '../utils/treeLogic';

interface TreeControlsProps {
  onFill: () => void;
  onFind: () => void;
  onIns: () => void;
  onTrav: () => void;
  onDel: () => void;
  onStep: () => void;
  onToggleRun: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  opMode: TreeOpMode;
  inputValue: string;
  setInputValue: (val: string) => void;
  filledNodes: number;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  onFill,
  onFind,
  onIns,
  onTrav,
  onDel,
  onStep,
  onToggleRun,
  onReset,
  onSpeedChange,
  isRunning,
  opMode,
  inputValue,
  setInputValue,
  filledNodes,
  classicTheme,
  setClassicTheme,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top Header Row with Theme Toggle and Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800">
            شجرة البحث الثنائية (Binary Search Tree)
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">
            {filledNodes} / 31 عقدة
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
              opMode !== 'idle' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {opMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setClassicTheme(!classicTheme)}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium flex items-center gap-1.5 transition ${
              classicTheme
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
            title="تبديل بين واجهة AWT 1998 الأصلية والمظهر العصري"
          >
            {classicTheme ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-700" />
                <span>واجهة جافا AWT الأصلية</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>الواجهة العصرية</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Buttons Row (Fill, Find, Ins, Trav, Del + Input) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Fill */}
        <button
          type="button"
          onClick={onFill}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold font-mono shadow-sm transition active:scale-95"
          title="إنشاء شجرة جديدة بعدد N من العقد"
        >
          Fill
        </button>

        {/* Find */}
        <button
          type="button"
          onClick={onFind}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold font-mono shadow-sm transition active:scale-95"
          title="البحث عن عقدة ذات المفتاح N"
        >
          Find
        </button>

        {/* Ins */}
        <button
          type="button"
          onClick={onIns}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-mono shadow-sm transition active:scale-95"
          title="إدراج عقدة جديدة بقيمة N"
        >
          Ins
        </button>

        {/* Trav */}
        <button
          type="button"
          onClick={onTrav}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold font-mono shadow-sm transition active:scale-95"
          title="التجوال المرتب في الشجرة (Inorder Traversal)"
        >
          Trav
        </button>

        {/* Del */}
        <button
          type="button"
          onClick={onDel}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold font-mono shadow-sm transition active:scale-95"
          title="حذف العقدة ذات القيمة N"
        >
          Del
        </button>

        {/* Enter Number Input */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
          <label htmlFor="tree-input" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Enter number:
          </label>
          <input
            id="tree-input"
            type="number"
            min="0"
            max="99"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-center text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block" />

        {/* Step */}
        <button
          type="button"
          onClick={onStep}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-300 shadow-sm transition active:scale-95"
          title="تنفيذ خطوة واحدة"
        >
          <StepForward className="w-3.5 h-3.5 text-blue-600" />
          <span>Step</span>
        </button>

        {/* Run / Pause */}
        <button
          type="button"
          onClick={onToggleRun}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 text-white shadow-sm transition active:scale-95 ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title={isRunning ? 'إيقاف مؤقت' : 'تشغيل تلقائي مستمر'}
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

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          title="إعادة ضبط الشجرة"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Speed Slider */}
      <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
        <span className="whitespace-nowrap">سرعة الحركة:</span>
        <input
          type="range"
          min="100"
          max="800"
          step="50"
          defaultValue="350"
          onChange={(e) => onSpeedChange(900 - parseInt(e.target.value, 10))}
          className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-[11px] text-slate-400">سريع ↔ بطيء</span>
      </div>
    </div>
  );
};
