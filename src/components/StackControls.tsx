import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
} from 'lucide-react';

interface StackControlsProps {
  onNew: () => void;
  onPush: (val: number) => void;
  onPop: () => void;
  onPeek: () => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  stepByStep: boolean;
  onToggleStepByStep: (enabled: boolean) => void;
  nPersons: number;
  inputValue: string;
  setInputValue: (val: string) => void;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const StackControls: React.FC<StackControlsProps> = ({
  onNew,
  onPush,
  onPop,
  onPeek,
  onStep,
  onTogglePlay,
  onReset,
  onSpeedChange,
  isRunning,
  stepByStep,
  onToggleStepByStep,
  nPersons,
  inputValue,
  setInputValue,
  classicTheme,
  setClassicTheme,
}) => {
  const [speedVal, setSpeedVal] = useState<number>(350);

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeedVal(val);
    onSpeedChange(val);
  };

  const handlePushClick = () => {
    const parsed = parseInt(inputValue, 10);
    const valid = !isNaN(parsed);
    onPush(valid ? parsed : -1);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* Top Toolbar matching Original Applet Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* New Button */}
          <button
            type="button"
            onClick={onNew}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            title="إنشاء مكدس جديد فارغ (New Stack)"
          >
            New
          </button>

          {/* Push Button */}
          <button
            type="button"
            onClick={handlePushClick}
            disabled={nPersons >= 10 && !isRunning}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
            }`}
            title="إدراج عنصر في قمة المكدس (Push)"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            Push
          </button>

          {/* Pop Button */}
          <button
            type="button"
            onClick={onPop}
            disabled={nPersons <= 0 && !isRunning}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50'
            }`}
            title="سحب وحذف العنصر من قمة المكدس (Pop)"
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" />
            Pop
          </button>

          {/* Peek Button */}
          <button
            type="button"
            onClick={onPeek}
            disabled={nPersons <= 0 && !isRunning}
            className={`px-3.5 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50'
            }`}
            title="معاينة العنصر في قمة المكدس دون حذفه (Peek)"
          >
            <Eye className="w-3.5 h-3.5" />
            Peek
          </button>
        </div>

        {/* Number Input Field */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700">Number:</label>
          <div className="relative flex items-center" dir="ltr">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePushClick();
                }
              }}
              placeholder="0-999"
              className="w-24 px-3 py-1 text-sm font-mono text-left font-bold border border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Secondary Controls: Step-by-Step, Auto-Run, Speed & Theme */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {/* Step Button */}
          <button
            type="button"
            onClick={onStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold shadow-xs"
            title="التقدم خطوة بخطوة"
          >
            <SkipForward className="w-3.5 h-3.5" />
            خطوة (Step)
          </button>

          {/* Run Toggle */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shadow-xs transition ${
              isRunning
                ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
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
                تشغيل تلقائي
              </>
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg"
            title="إعادة تعيين الحالة الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Slider & Theme Switch */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">السرعة:</span>
            <input
              type="range"
              min="100"
              max="800"
              step="50"
              value={speedVal}
              onChange={handleSpeedSlider}
              className="w-24 accent-blue-600 cursor-pointer"
              title={`${speedVal}ms`}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-200/80 p-0.5 rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => setClassicTheme(true)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                classicTheme ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Classic AWT
            </button>
            <button
              type="button"
              onClick={() => setClassicTheme(false)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                !classicTheme ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
