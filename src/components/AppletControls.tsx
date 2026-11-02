import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  PlusCircle,
  Search,
  Trash2,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface AppletControlsProps {
  onNew: (isNum: boolean, val: number) => void;
  onFill: (isNum: boolean, val: number) => void;
  onIns: (isNum: boolean, val: number) => void;
  onFind: (isNum: boolean, val: number) => void;
  onDel: (isNum: boolean, val: number) => void;
  onSetDups: (dupsOK: boolean) => void;
  onNextStep: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speedMs: number) => void;
  onReset: () => void;
  dupsOK: boolean;
  isRunning: boolean;
  stepByStep: boolean;
  onToggleStepByStep: (enabled: boolean) => void;
  currentOp: string;
  inputValue: string;
  setInputValue: (val: string) => void;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
  searchTypeOption?: 'duplicates' | 'searchMode';
  isLinear?: boolean;
  onSetLinear?: (linear: boolean) => void;
}

export const AppletControls: React.FC<AppletControlsProps> = ({
  onNew,
  onFill,
  onIns,
  onFind,
  onDel,
  onSetDups,
  onNextStep,
  onTogglePlay,
  onSpeedChange,
  onReset,
  dupsOK,
  isRunning,
  stepByStep,
  onToggleStepByStep,
  currentOp,
  inputValue,
  setInputValue,
  classicTheme,
  setClassicTheme,
  searchTypeOption = 'duplicates',
  isLinear = false,
  onSetLinear,
}) => {
  const [speedVal, setSpeedVal] = useState<number>(250);

  const parseInput = (): { isNum: boolean; val: number } => {
    const trimmed = inputValue.trim();
    if (trimmed === '') return { isNum: false, val: 0 };
    const num = parseInt(trimmed, 10);
    return { isNum: !isNaN(num), val: isNaN(num) ? 0 : num };
  };

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSpeedVal(val);
    onSpeedChange(val);
  };

  const isBusy = isRunning && !stepByStep;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* Top Main Toolbar Matching Java / C# Form */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        {/* Buttons matching Original Applet */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const { isNum, val } = parseInput();
              onNew(isNum, val);
            }}
            disabled={isBusy}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
            }`}
            title="إنشاء مصفوفة فارغة بحجم N (الحد الأقصى 60)"
          >
            New
          </button>

          <button
            type="button"
            onClick={() => {
              const { isNum, val } = parseInput();
              onFill(isNum, val);
            }}
            disabled={isBusy}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
            }`}
            title="تعبئة N عنصر عشوائي داخل المصفوفة"
          >
            Fill
          </button>

          <button
            type="button"
            onClick={() => {
              const { isNum, val } = parseInput();
              onIns(isNum, val);
            }}
            disabled={isBusy}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
            title="إدراج عنصر جديد بالقيمة N في نهاية المصفوفة"
          >
            Ins
          </button>

          <button
            type="button"
            onClick={() => {
              const { isNum, val } = parseInput();
              onFind(isNum, val);
            }}
            disabled={isBusy}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50'
            }`}
            title="البحث الخطي عن عنصر بالقيمة N"
          >
            Find
          </button>

          <button
            type="button"
            onClick={() => {
              const { isNum, val } = parseInput();
              onDel(isNum, val);
            }}
            disabled={isBusy}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50'
            }`}
            title="حذف عنصر بالقيمة N مع إزاحة العناصر اللاحقة"
          >
            Del
          </button>
        </div>

        {/* Radio Options: Duplicates OK / No Dups OR Linear / Binary Search */}
        {searchTypeOption === 'searchMode' ? (
          <div className="flex items-center gap-3 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                checked={isLinear}
                onChange={() => onSetLinear && onSetLinear(true)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Linear</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="searchType"
                checked={!isLinear}
                onChange={() => onSetLinear && onSetLinear(false)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Binary</span>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 text-xs font-medium text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="dupsOption"
                checked={dupsOK}
                onChange={() => onSetDups(true)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Dups OK</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="dupsOption"
                checked={!dupsOK}
                onChange={() => onSetDups(false)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>No dups</span>
            </label>
          </div>
        )}

        {/* Number Input - Shifted clearly to the left inside the box */}
        <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-300" dir="ltr">
          <label htmlFor="numInput" className="text-xs font-bold text-slate-700 select-none">
            Number:
          </label>
          <input
            id="numInput"
            type="number"
            min="0"
            max="999"
            dir="ltr"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const { isNum, val } = parseInput();
                onIns(isNum, val);
              }
            }}
            placeholder="0-999"
            className="w-24 px-3 py-1 text-xs font-mono font-bold text-left text-slate-900 bg-white border border-slate-300 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ textAlign: 'left', paddingLeft: '14px' }}
            title="أدخل رقماً بين 0 و 999"
          />
        </div>
      </div>

      {/* Educational & Animation Helper Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          {/* Step-by-Step Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={stepByStep}
              onChange={(e) => onToggleStepByStep(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>خطوة بخطوة (Step-by-Step)</span>
          </label>

          {/* Next Step Button */}
          {stepByStep && currentOp !== 'idle' && (
            <button
              type="button"
              onClick={onNextStep}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 font-medium transition"
            >
              <SkipForward className="w-3.5 h-3.5" />
              الخطوة التالية
            </button>
          )}

          {/* Pause / Resume Button for continuous running */}
          {!stepByStep && currentOp !== 'idle' && (
            <button
              type="button"
              onClick={onTogglePlay}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 font-medium transition"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> إيقاف مؤقت
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> استئناف
                </>
              )}
            </button>
          )}
        </div>

        {/* Speed Slider & Reset */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">السرعة:</span>
            <input
              type="range"
              min="50"
              max="600"
              step="25"
              value={speedVal}
              onChange={handleSpeedSlider}
              className="w-24 accent-blue-600 cursor-pointer"
              title={`${speedVal}ms`}
            />
            <span className="font-mono text-[10px] text-slate-500 w-10">
              {speedVal <= 100 ? 'سريع' : speedVal <= 300 ? 'متوسط' : 'بطيء'}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setClassicTheme(!classicTheme)}
            className="flex items-center gap-1 px-2 py-1 text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-100 transition"
            title="التبديل بين مظهر جافا 1998 ومظهر ويندوز الحديث"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            {classicTheme ? 'مظهر كلاسيكي 1998' : 'مظهر حديث'}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded hover:bg-slate-100 transition"
            title="إعادة ضبط التطبيق"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );
};
