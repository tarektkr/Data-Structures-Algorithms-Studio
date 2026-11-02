import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface TowersControlsProps {
  onNew: (disksCount: number) => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  stepByStep: boolean;
  onToggleStepByStep: (enabled: boolean) => void;
  nDisks: number;
  inputValue: string;
  setInputValue: (val: string) => void;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const TowersControls: React.FC<TowersControlsProps> = ({
  onNew,
  onStep,
  onTogglePlay,
  onReset,
  onSpeedChange,
  isRunning,
  stepByStep,
  onToggleStepByStep,
  nDisks,
  inputValue,
  setInputValue,
  classicTheme,
  setClassicTheme,
}) => {
  const [speedVal, setSpeedVal] = useState<number>(400);

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeedVal(val);
    onSpeedChange(val);
  };

  const handleNewClick = () => {
    const count = parseInt(inputValue, 10);
    if (!isNaN(count) && count >= 1 && count <= 10) {
      onNew(count);
    } else {
      onNew(nDisks);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
      {/* Top Bar: Title & Theme Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">
              أبراج هانوي (Towers of Hanoi - Robert Lafore)
            </h2>
            <p className="text-xs text-slate-500">
              الفصل السادس: العودية ومحاكاة مكدس الاستدعاءات (Recursion & Call Stack)
            </p>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setClassicTheme(true)}
            className={`px-2.5 py-1 rounded transition ${
              classicTheme
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            واجهة AWT الأصلية
          </button>
          <button
            type="button"
            onClick={() => setClassicTheme(false)}
            className={`px-2.5 py-1 rounded transition ${
              !classicTheme
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            واجهة حديثة
          </button>
        </div>
      </div>

      {/* Main Buttons Toolbar matching Lafore's Java Applet Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* New Button */}
        <button
          type="button"
          onClick={handleNewClick}
          disabled={isRunning}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1"
          title="إنشاء لعبة جديدة بعدد الأقراص المدخل"
        >
          <span>New</span>
        </button>

        {/* Enter number Input */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1">
          <label htmlFor="towers-input" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Enter number (1-10):
          </label>
          <input
            id="towers-input"
            type="number"
            min={1}
            max={10}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isRunning}
            className="w-14 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" />

        {/* Step Button */}
        <button
          type="button"
          onClick={onStep}
          disabled={isRunning}
          className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 disabled:opacity-50 font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5"
          title="تنفيذ خطوة حل واحدة في خوارزمية العودية"
        >
          <SkipForward className="w-3.5 h-3.5 text-amber-700" />
          <span>Step</span>
        </button>

        {/* Run / Pause Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={`px-4 py-1.5 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 ${
            isRunning
              ? 'bg-rose-600 hover:bg-rose-700'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
          title={isRunning ? 'إيقاف مؤقت' : 'تشغيل الحل التلقائي'}
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
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1"
          title="إعادة التعيين للوضع الافتراضي"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs mr-auto">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">السرعة:</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={speedVal}
            onChange={handleSpeedSlider}
            className="w-20 accent-blue-600 cursor-pointer"
          />
          <span className="font-mono text-[10px] text-slate-600 w-12 text-left">
            {speedVal}ms
          </span>
        </div>
      </div>
    </div>
  );
};
