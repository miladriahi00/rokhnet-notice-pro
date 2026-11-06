import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FolderTree } from 'lucide-react';
import { PluginConfig } from '../types/plugin';
import { generateWordPressPluginFiles, downloadPluginZip } from '../utils/wpPluginGenerator';

interface CodeViewerModalProps {
  config: PluginConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ config, isOpen, onClose }) => {
  const files = generateWordPressPluginFiles(config);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = files[selectedIdx] || files[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadPluginZip(config);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-6xl h-[86vh] bg-[#0c1221] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#111827] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                سورس‌کد کامل افزونه وردپرس (اطلاع رسانی پاپ آپ - popup-notice-pro v3.0)
              </h2>
              <p className="text-xs text-slate-400">
                سازگار با وردپرس {config.wpVersion} · ووکامرس {config.wcVersion} · PHP {config.phpVersion} · توسعه‌دهنده: {config.developerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'در حال ساخت ZIP...' : 'دانلود پکیج آماده نصب (ZIP)'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Tree + Code Viewer */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Sidebar File List */}
          <div className="md:col-span-4 lg:col-span-3 bg-[#090d18] border-l border-slate-800 p-4 overflow-y-auto space-y-2">
            <div className="text-xs font-bold text-slate-400 px-2 mb-3">
              ساختار فایل‌های پلاگین (۶ فایل استاندارد)
            </div>
            {files.map((file, idx) => (
              <button
                key={file.path}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-blue-600/15 border-blue-500/50 text-white'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span dir="ltr" className="font-mono text-xs font-bold text-blue-400 truncate">
                    {file.filename}
                  </span>
                  <FileCode className="w-4 h-4 shrink-0 opacity-70" />
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">{file.description}</p>
              </button>
            ))}
          </div>

          {/* Code Content Area */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col overflow-hidden bg-[#060911]">
            <div className="flex items-center justify-between px-5 py-3 bg-[#0d1322] border-b border-slate-800">
              <span dir="ltr" className="font-mono text-xs text-slate-300">
                {currentFile.path}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی محتوای فایل</span>
                  </>
                )}
              </button>
            </div>

            <pre
              dir="ltr"
              className="flex-1 p-5 overflow-auto text-xs leading-relaxed text-slate-200 font-mono select-all"
            >
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
