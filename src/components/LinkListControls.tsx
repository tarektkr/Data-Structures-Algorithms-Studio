import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Plus,
  Trash2,
  Search,
  Sparkles,
} from 'lucide-react';

interface LinkListControlsProps {
  onNew: () => void;
  onInsert: (val: number) => void;
  onFind: (val: number) => void;
  onDelete: (val: number) => void;
  onSetSortStatus: (notSorted: boolean) => void;
  onStep: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onSpeedChange: (speedMs: number) => void;
  isRunning: boolean;
  stepByStep: boolean;
  onToggleStepByStep: (enabled: boolean) => void;
  notSorted: boolean;
  totalLinks: number;
  inputValue: string;
  setInputValue: (val: string) => void;
  classicTheme: boolean;
  setClassicTheme: (classic: boolean) => void;
}

export const LinkListControls: React.FC<LinkListControlsProps> = ({
  onNew,
  onInsert,
  onFind,
  onDelete,
  onSetSortStatus,
  onStep,
  onTogglePlay,
  onReset,
  onSpeedChange,
  isRunning,
  stepByStep,
  onToggleStepByStep,
  notSorted,
  totalLinks,
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

  const parseNumber = (): number => {
    const parsed = parseInt(inputValue, 10);
    return !isNaN(parsed) ? parsed : -1;
  };

  const handleInsertClick = () => {
    onInsert(parseNumber());
  };

  const handleFindClick = () => {
    onFind(parseNumber());
  };

  const handleDeleteClick = () => {
    onDelete(parseNumber());
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* Top Toolbar matching Original Applet Buttons and Radio options */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {/* New Button */}
          <button
            type="button"
            onClick={onNew}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition shadow-sm ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            title="إنشاء قائمة جديدة بحجم N (حد أقصى 28)"
          >
            New
          </button>

          {/* Ins Button */}
          <button
            type="button"
            onClick={handleInsertClick}
            disabled={totalLinks >= 28 && !isRunning}
            className={`px-3 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
            }`}
            title="إدراج عنصر جديد بالمفتاح N"
          >
            <Plus className="w-3.5 h-3.5" />
            Ins
          </button>

          {/* Find Button */}
          <button
            type="button"
            onClick={handleFindClick}
            disabled={totalLinks <= 0 && !isRunning}
            className={`px-3 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
            title="البحث عن عنصر بالمفتاح N"
          >
            <Search className="w-3.5 h-3.5" />
            Find
          </button>

          {/* Del Button */}
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={totalLinks <= 0 && !isRunning}
            className={`px-3 py-1.5 text-xs font-bold rounded transition shadow-sm flex items-center gap-1 ${
              classicTheme
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-900 border-2 border-t-white border-l-white border-b-slate-600 border-r-slate-600 active:border-t-slate-600 active:border-l-slate-600 active:border-b-white active:border-r-white font-mono disabled:opacity-50'
                : 'bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50'
            }`}
            title="حذف عنصر بالمفتاح N وتجاوز المؤشر"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Del
          </button>

          {/* Unsorted / Sorted Radio Buttons */}
          <div className="flex items-center gap-3 mr-2 px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-xs font-bold text-slate-700">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="sortGroup"
                checked={notSorted}
                onChange={() => onSetSortStatus(true)}
                className="accent-blue-600 cursor-pointer"
              />
              <span>Unsorted</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="sortGroup"
                checked={!notSorted}
                onChange={() => onSetSortStatus(false)}
                className="accent-blue-600 cursor-pointer"
              />
              <span>Sorted</span>
            </label>
          </div>
        </div>

        {/* Enter number Input Field */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Enter number:</label>
          <div className="relative flex items-center" dir="ltr">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInsertClick();
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
