import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderArchive,
  Search,
  Code2,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import {
  CSHARP_FILES,
  getFilesForApplet,
  downloadFullProjectZip,
  downloadAllProjectsMasterZip,
  downloadSingleFile,
} from '../utils/csharpCode';
import { CSharpSourceFile } from '../types/applet';

interface CSharpCodeViewerProps {
  appletId?: string;
}

export const CSharpCodeViewer: React.FC<CSharpCodeViewerProps> = ({
  appletId = 'unordered-array',
}) => {
  const currentFiles = getFilesForApplet(appletId);
  const [selectedFile, setSelectedFile] = useState<CSharpSourceFile>(currentFiles[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isMasterZipping, setIsMasterZipping] = useState<boolean>(false);

  // Sync selectedFile when appletId changes
  React.useEffect(() => {
    setSelectedFile(currentFiles[0]);
  }, [appletId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadFullProjectZip(appletId);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadMasterZip = async () => {
    try {
      setIsMasterZipping(true);
      await downloadAllProjectsMasterZip();
    } finally {
      setIsMasterZipping(false);
    }
  };

  const codeLines = selectedFile.content.split('\n');

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded-md border border-blue-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              مشروع C# Windows Forms المتكامل (.NET 8.0)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                جاهز للتشغيل
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              كود سي شارب نقي مع محرك GDI+ يحاكي بالكامل مخرجات كلاسات جافا الأصلية
            </p>
          </div>
        </div>

        {/* Global Actions: Download Current Chapter ZIP or All Projects Master ZIP */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold rounded-lg shadow transition transform active:scale-95 disabled:opacity-50"
            title="تحميل مشروع C# الخاص بهذا الفصل فقط"
          >
            <FolderArchive className="w-4 h-4 text-blue-400" />
            {isZipping ? 'جارٍ التحميل...' : 'تحميل الفصل الحالي (ZIP)'}
          </button>

          <button
            type="button"
            onClick={handleDownloadMasterZip}
            disabled={isMasterZipping}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95 disabled:opacity-50"
            title="تحميل كافة الفصول الـ 19 مجتمعة في ملف Solution واحد"
          >
            <Download className="w-4 h-4 text-amber-200" />
            {isMasterZipping ? 'جارٍ تجميع كافة الفصول...' : 'تحميل جميع الفصول كاملة (Master ZIP)'}
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="flex items-center overflow-x-auto bg-slate-900/90 border-b border-slate-800 px-2 py-1 gap-1">
        {currentFiles.map((file) => {
          const isActive = selectedFile.filename === file.filename;
          return (
            <button
              key={file.filename}
              type="button"
              onClick={() => setSelectedFile(file)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-blue-400 border border-slate-700 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
              <span>{file.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active File Metadata Header */}
      <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 font-semibold">{selectedFile.filename}</span>
          <span className="text-slate-400">— {selectedFile.descriptionAr}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1.5" />
            <input
              type="text"
              placeholder="بحث في الكود..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs pl-7 pr-2 py-0.5 rounded border border-slate-800 focus:outline-none focus:border-blue-500 w-32"
            />
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
            title="نسخ محتوى هذا الملف"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الكود</span>
              </>
            )}
          </button>

          {/* Download Single File */}
          <button
            type="button"
            onClick={() => downloadSingleFile(selectedFile)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
            title="تحميل هذا الملف بشكل منفصل"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>تحميل</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative overflow-x-auto max-h-[550px] bg-slate-950 font-mono text-xs p-4 selection:bg-blue-600 selection:text-white">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isMatch = searchTerm.trim() !== '' && line.toLowerCase().includes(searchTerm.toLowerCase());

              return (
                <tr
                  key={lineNum}
                  className={`hover:bg-slate-900/60 ${isMatch ? 'bg-amber-950/40 text-amber-200' : ''}`}
                >
                  <td className="w-12 select-none text-right pr-4 text-slate-600 font-mono text-[11px] align-top">
                    {lineNum}
                  </td>
                  <td className="pl-2 pr-4 text-slate-300 whitespace-pre">
                    {highlightCSharp(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Terminal Command Helper Footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>لتشغيل المشروع على جهازك مباشرة باستخدام سطر الأوامر:</span>
          <code className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
            dotnet run
          </code>
        </div>
        <div className="text-[11px] text-slate-500">
          متوافق مع Visual Studio 2022 و VS Code على ويندوز
        </div>
      </div>
    </div>
  );
};

/**
 * Highlighting helper for C# keywords and tokens
 */
function highlightCSharp(line: string): React.ReactNode {
  // Check comments
  const commentIdx = line.indexOf('//');
  if (commentIdx !== -1) {
    const codePart = line.substring(0, commentIdx);
    const commentPart = line.substring(commentIdx);
    return (
      <>
        {renderHighlightedKeywords(codePart)}
        <span className="text-slate-500 italic">{commentPart}</span>
      </>
    );
  }

  return renderHighlightedKeywords(line);
}

function renderHighlightedKeywords(text: string): React.ReactNode {
  const keywords = new Set([
    'using', 'namespace', 'class', 'public', 'private', 'protected', 'internal',
    'static', 'readonly', 'const', 'void', 'int', 'string', 'bool', 'override',
    'return', 'if', 'else', 'for', 'while', 'do', 'new', 'get', 'set', 'true',
    'false', 'null', 'this', 'base', 'enum', 'partial', 'event', 'object', 'var'
  ]);

  const tokens = text.split(/(\b[a-zA-Z_]\w*\b|"[^"]*")/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (keywords.has(token)) {
          return (
            <span key={i} className="text-purple-400 font-semibold">
              {token}
            </span>
          );
        }
        if (token.startsWith('"') && token.endsWith('"')) {
          return (
            <span key={i} className="text-amber-300">
              {token}
            </span>
          );
        }
        if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
          // Class or Type names like Person, PersonGroup, Graphics, Color, Form
          return (
            <span key={i} className="text-teal-300">
              {token}
            </span>
          );
        }
        return token;
      })}
    </>
  );
}
