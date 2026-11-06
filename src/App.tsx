/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Code2,
  Sparkles,
  FileText,
  Palette,
  Sliders,
  Database,
  Check,
  Phone,
  Globe,
  ShieldCheck,
  RefreshCw,
  Layers,
  Plus,
  Copy,
  Trash2,
  Power,
  Zap,
  Eye,
} from 'lucide-react';
import {
  PluginConfig,
  NoticeItem,
  DEFAULT_PLUGIN_CONFIG,
  STYLE_PRESETS,
  QUICK_CONTENT_TEMPLATES,
  PopupStylePreset,
  createNewNoticeItem,
} from './types/plugin';
import { downloadPluginZip } from './utils/wpPluginGenerator';
import { LivePopupPreview } from './components/LivePopupPreview';
import { CodeViewerModal } from './components/CodeViewerModal';
import { AiStudioModal } from './components/AiStudioModal';

type SettingsTab = 'content' | 'style' | 'targeting' | 'storage';

export default function App() {
  const [config, setConfig] = useState<PluginConfig>(DEFAULT_PLUGIN_CONFIG);
  const [activeNoticeId, setActiveNoticeId] = useState<string>(
    DEFAULT_PLUGIN_CONFIG.notices[0].id
  );
  const [activeTab, setActiveTab] = useState<SettingsTab>('content');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const activeNotice: NoticeItem =
    config.notices.find((n) => n.id === activeNoticeId) || config.notices[0];

  const updateActiveNotice = (partial: Partial<NoticeItem>) => {
    setConfig((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === activeNotice.id ? { ...n, ...partial } : n
      ),
    }));
  };

  const updatePluginConfig = (partial: Partial<PluginConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  // Multi-Notice CRUD Handlers
  const handleAddNewNotice = () => {
    const newItem = createNewNoticeItem(config.notices.length + 1);
    setConfig((prev) => ({
      ...prev,
      notices: [...prev.notices, newItem],
    }));
    setActiveNoticeId(newItem.id);
  };

  const handleDuplicateNotice = (notice: NoticeItem) => {
    const copy: NoticeItem = {
      ...notice,
      id: `notice-${Date.now()}`,
      internalName: `${notice.internalName} (کپی)`,
      priority: config.notices.length + 1,
    };
    setConfig((prev) => ({
      ...prev,
      notices: [...prev.notices, copy],
    }));
    setActiveNoticeId(copy.id);
  };

  const handleDeleteNotice = (id: string) => {
    if (config.notices.length <= 1) return;
    const remaining = config.notices.filter((n) => n.id !== id);
    setConfig((prev) => ({
      ...prev,
      notices: remaining,
    }));
    if (activeNotice.id === id) {
      setActiveNoticeId(remaining[0].id);
    }
  };

  const handleToggleNoticeEnabled = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      ),
    }));
  };

  // Contrast-Safe Style Preset Switcher
  const handleSelectStylePreset = (presetId: PopupStylePreset) => {
    const found = STYLE_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    updateActiveNotice({
      stylePreset: presetId,
      ...found.palette,
    });
  };

  const handleApplyQuickTemplate = (tplId: string) => {
    const tpl = QUICK_CONTENT_TEMPLATES.find((t) => t.id === tplId);
    if (!tpl) return;
    const presetInfo = STYLE_PRESETS.find((p) => p.id === tpl.stylePreset);
    updateActiveNotice({
      badgeText: tpl.badgeText,
      title: tpl.title,
      subtitle: tpl.subtitle,
      contentHtml: tpl.contentHtml,
      checkboxLabel: tpl.checkboxLabel,
      acceptButtonText: tpl.acceptButtonText,
      iconType: tpl.iconType,
      stylePreset: tpl.stylePreset,
      displayTarget: tpl.displayTarget,
      ...(presetInfo ? presetInfo.palette : {}),
    });
  };

  const handleExportZip = async () => {
    setIsDownloading(true);
    try {
      await downloadPluginZip(config);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } finally {
      setIsDownloading(false);
    }
  };

  const bumpNoticeVersion = () => {
    const parts = activeNotice.noticeVersion.split('.');
    const last = parseInt(parts[parts.length - 1] || '0', 10) + 1;
    parts[parts.length - 1] = String(last);
    updateActiveNotice({ noticeVersion: parts.join('.') });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-[#0c1220]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base md:text-lg font-extrabold text-white tracking-tight">
                  RokhNet Notice Pro v2.0
                </h1>
                <span className="text-xs text-emerald-400 font-bold">
                  نسخه چندگانه فوق‌سبک · بدون بار دیتابیس
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>توسعه‌دهنده: {config.developerName}</span>
                <span aria-hidden="true">·</span>
                <a
                  href={`tel:${config.developerPhone}`}
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span dir="ltr">{config.developerPhone}</span>
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href={config.developerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span dir="ltr">{config.developerUrl}</span>
                </a>
                <span aria-hidden="true">·</span>
                <span>وردپرس {config.wpVersion}</span>
                <span aria-hidden="true">·</span>
                <span>ووکامرس {config.wcVersion}</span>
                <span aria-hidden="true">·</span>
                <span>PHP {config.phpVersion}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>هوش مصنوعی و بنر (1K/2K/4K)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>مشاهده سورس‌کد PHP نسخه ۲.۰</span>
            </button>

            <button
              type="button"
              onClick={handleExportZip}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>فایل ZIP نسخه ۲.۰ دانلود شد!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'در حال ساخت ZIP...'
                      : 'دانلود افزونه آماده نصب (rokhnet-notice-pro-v2.zip)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Multi-Notice Manager Bar (Create, Switch, Duplicate, Toggle, Delete) */}
      <section className="bg-[#0b111e] border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs md:text-sm font-extrabold text-white">
                مدیریت چندگانه اطلاعیه‌ها و پاپ‌آپ‌ها ({config.notices.length} اطلاعیه مجزا)
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                هر پاپ‌آپ استایل، رنگ‌بندی و صفحات هدف مستقل دارد و فقط در صفحات خودش لود می‌شود.
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddNewNotice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن اطلاعیه و پاپ‌آپ جدید</span>
            </button>
          </div>

          {/* Horizontal Notice Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {config.notices.map((item) => {
              const isSelected = item.id === activeNotice.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveNoticeId(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-blue-950/30 border-blue-500 shadow-lg shadow-blue-950/30'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: item.primaryColor }}
                      />
                      <span className="text-xs font-extrabold text-white truncate">
                        {item.internalName}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      اولویت #{item.priority}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    {item.title || 'بدون عنوان'}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleNoticeEnabled(item.id);
                        }}
                        className={`flex items-center gap-1 font-bold cursor-pointer ${
                          item.enabled ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{item.enabled ? 'فعال' : 'غیرفعال'}</span>
                      </button>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">
                        {item.displayTarget === 'all_pages'
                          ? 'کل سایت'
                          : item.displayTarget === 'homepage_only'
                          ? 'صفحه اصلی'
                          : item.displayTarget === 'woo_checkout_cart'
                          ? 'تسویه‌حساب ووکامرس'
                          : item.displayTarget === 'woo_shop_product'
                          ? 'فروشگاه و محصول'
                          : 'صفحات انتخابی'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateNotice(item);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        title="کپی کردن این اطلاعیه"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {config.notices.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotice(item.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="حذف این اطلاعیه"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Split Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: Settings Editor for Selected Notice (5 Cols) */}
        <section className="lg:col-span-5 bg-[#0c1220] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          {/* Active Notice Bar */}
          <div className="px-5 py-3 bg-[#11192c] border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: activeNotice.primaryColor }}
              />
              <span className="text-xs font-extrabold text-white truncate">
                ویرایش: {activeNotice.internalName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="text-slate-400">اولویت:</label>
              <input
                type="number"
                min={1}
                max={99}
                value={activeNotice.priority}
                onChange={(e) =>
                  updateActiveNotice({ priority: Number(e.target.value) || 1 })
                }
                className="w-14 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center font-mono text-white"
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-[#090e1a] border-b border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>محتوا و عناوین</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('style')}
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'style'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>استایل و رنگ خوانا</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('targeting')}
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'targeting'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>صفحات و سرعت</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('storage')}
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'storage'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>کوکی و دیتابیس</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-5 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* TAB 1: CONTENT & HEADER VISIBILITY TOGGLES */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    نام داخلی این اطلاعیه (فقط جهت نمایش در لیست مدیریت):
                  </label>
                  <input
                    type="text"
                    value={activeNotice.internalName}
                    onChange={(e) => updateActiveNotice({ internalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Quick Templates */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-bold text-slate-300 mb-2">
                    قالب‌های آماده برای جایگذاری سریع در این پاپ‌آپ:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_CONTENT_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleApplyQuickTemplate(tpl.id)}
                        className="text-right p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header Elements Enable/Disable Toggles */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <Eye className="w-4 h-4" />
                    <span>کنترل فعال / غیرفعال‌سازی اجزای هدر و آیکون:</span>
                  </div>

                  {/* Icon Toggle & Type */}
                  <div className="space-y-2 pb-3 border-b border-slate-800">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-200">
                        نمایش آیکون برداری (Inline SVG) در سایت
                      </span>
                      <input
                        type="checkbox"
                        checked={activeNotice.showIcon}
                        onChange={(e) => updateActiveNotice({ showIcon: e.target.checked })}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                    </label>
                    {activeNotice.showIcon && (
                      <select
                        value={activeNotice.iconType}
                        onChange={(e) =>
                          updateActiveNotice({
                            iconType: e.target.value as NoticeItem['iconType'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      >
                        <option value="shield">سپر امنیتی و قوانین (Shield SVG)</option>
                        <option value="bell">زنگوله اطلاع‌رسانی (Bell SVG)</option>
                        <option value="cart">سبد خرید ووکامرس (Cart SVG)</option>
                        <option value="alert">هشدار مهم (Alert SVG)</option>
                        <option value="check">تاییدیه رسمی (Check SVG)</option>
                        <option value="sparkles">ستاره ویژه (Sparkles SVG)</option>
                      </select>
                    )}
                  </div>

                  {/* Badge / Kicker Toggle */}
                  <div className="space-y-2 pb-3 border-b border-slate-800">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-200">
                        نمایش سوتیتر بالای عنوان (Badge)
                      </span>
                      <input
                        type="checkbox"
                        checked={activeNotice.showBadge}
                        onChange={(e) => updateActiveNotice({ showBadge: e.target.checked })}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                    </label>
                    {activeNotice.showBadge && (
                      <input
                        type="text"
                        value={activeNotice.badgeText}
                        onChange={(e) => updateActiveNotice({ badgeText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    )}
                  </div>

                  {/* Main Title Toggle */}
                  <div className="space-y-2 pb-3 border-b border-slate-800">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-200">
                        نمایش عنوان اصلی پاپ‌آپ
                      </span>
                      <input
                        type="checkbox"
                        checked={activeNotice.showTitle}
                        onChange={(e) => updateActiveNotice({ showTitle: e.target.checked })}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                    </label>
                    {activeNotice.showTitle && (
                      <input
                        type="text"
                        value={activeNotice.title}
                        onChange={(e) => updateActiveNotice({ title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    )}
                  </div>

                  {/* Subtitle Toggle */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-slate-200">
                        نمایش زیرعنوان توضیحی
                      </span>
                      <input
                        type="checkbox"
                        checked={activeNotice.showSubtitle}
                        onChange={(e) => updateActiveNotice({ showSubtitle: e.target.checked })}
                        className="w-4 h-4 accent-blue-500 rounded"
                      />
                    </label>
                    {activeNotice.showSubtitle && (
                      <input
                        type="text"
                        value={activeNotice.subtitle}
                        onChange={(e) => updateActiveNotice({ subtitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      متن کامل اطلاعیه (HTML):
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAiModalOpen(true)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>نگارش با هوش مصنوعی</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={activeNotice.contentHtml}
                    onChange={(e) => updateActiveNotice({ contentHtml: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Mandatory Checkbox Text */}
                <div className="p-3.5 rounded-xl bg-blue-950/25 border border-blue-500/30 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-blue-300">
                      الزام به تیک زدن چک‌باکس پیش از ادامه
                    </span>
                    <input
                      type="checkbox"
                      checked={activeNotice.requireCheckbox}
                      onChange={(e) =>
                        updateActiveNotice({ requireCheckbox: e.target.checked })
                      }
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </label>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      متن چک‌باکس تایید:
                    </label>
                    <input
                      type="text"
                      value={activeNotice.checkboxLabel}
                      onChange={(e) => updateActiveNotice({ checkboxLabel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      پیام خطای عدم زدن تیک:
                    </label>
                    <input
                      type="text"
                      value={activeNotice.checkboxRequiredError}
                      onChange={(e) =>
                        updateActiveNotice({ checkboxRequiredError: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      متن دکمه تایید اصلی:
                    </label>
                    <input
                      type="text"
                      value={activeNotice.acceptButtonText}
                      onChange={(e) => updateActiveNotice({ acceptButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      متن دکمه فرعی (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={activeNotice.secondaryButtonText}
                      onChange={(e) =>
                        updateActiveNotice({ secondaryButtonText: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTRAST-SAFE STYLES & THEME FONT INHERITANCE */}
            {activeTab === 'style' && (
              <div className="space-y-5">
                {/* Theme Font Inheritance Notice */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeNotice.inheritThemeFont}
                      onChange={(e) =>
                        updateActiveNotice({ inheritThemeFont: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-emerald-500 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-emerald-300">
                        خواندن خودکار فونت از تنظیمات قالب وردپرس (font-family: inherit)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        افزونه هیچ فونت اضافی به سایت تحمیل نمی‌کند و دقیقاً با فونت قالب فعال وردپرس شما نمایش داده می‌شود.
                      </div>
                    </div>
                  </label>
                </div>

                {/* 6 Contrast-Verified Presets */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2.5">
                    انتخاب استایل (تغییر خودکار رنگ پس‌زمینه، کادرها و متون جهت خوانایی ۱۰۰٪):
                  </label>
                  <div className="space-y-2">
                    {STYLE_PRESETS.map((preset) => {
                      const isSelected = activeNotice.stylePreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectStylePreset(preset.id)}
                          className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">{preset.name}</span>
                              <span className="text-[10px] text-slate-400">
                                {preset.isLight ? '(تم روشن)' : '(تم تیره)'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {preset.tagline}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className="w-5 h-5 rounded-full border border-slate-500/40"
                              style={{ backgroundColor: preset.palette.backgroundColor }}
                              title="پس‌زمینه"
                            />
                            <span
                              className="w-5 h-5 rounded-full border border-slate-500/40"
                              style={{ backgroundColor: preset.palette.primaryColor }}
                              title="رنگ اصلی"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Full Contrast-Safe Color Controls */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      پس‌زمینه اصلی پاپ‌آپ:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.backgroundColor}
                        onChange={(e) =>
                          updateActiveNotice({ backgroundColor: e.target.value })
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.backgroundColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رنگ عنوان اصلی:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.textColor}
                        onChange={(e) => updateActiveNotice({ textColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.textColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      پس‌زمینه کادر متن اطلاعیه:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.bodyBoxBg}
                        onChange={(e) => updateActiveNotice({ bodyBoxBg: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.bodyBoxBg}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رنگ متن داخل کادر اطلاعیه:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.bodyBoxText}
                        onChange={(e) => updateActiveNotice({ bodyBoxText: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.bodyBoxText}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      پس‌زمینه کادر چک‌باکس:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.checkboxBoxBg}
                        onChange={(e) =>
                          updateActiveNotice({ checkboxBoxBg: e.target.value })
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.checkboxBoxBg}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رنگ متن چک‌باکس تایید:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.checkboxBoxText}
                        onChange={(e) =>
                          updateActiveNotice({ checkboxBoxText: e.target.value })
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.checkboxBoxText}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رنگ دکمه تایید و آیکون:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.primaryColor}
                        onChange={(e) => updateActiveNotice({ primaryColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.primaryColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رنگ نوشته روی دکمه تایید:
                    </label>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                      <input
                        type="color"
                        value={activeNotice.buttonTextColor}
                        onChange={(e) =>
                          updateActiveNotice({ buttonTextColor: e.target.value })
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span dir="ltr" className="text-xs font-mono text-slate-300">
                        {activeNotice.buttonTextColor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Geometry & Position */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      موقعیت نمایش در صفحه:
                    </label>
                    <select
                      value={activeNotice.position}
                      onChange={(e) =>
                        updateActiveNotice({
                          position: e.target.value as NoticeItem['position'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    >
                      <option value="center">وسط صفحه (Modal Center)</option>
                      <option value="bottom-right">شناور پایین راست</option>
                      <option value="bottom-left">شناور پایین چپ</option>
                      <option value="bottom-sheet">کشویی پایین صفحه (Bottom Sheet)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-300">حداکثر عرض پاپ‌آپ:</span>
                      <span className="text-blue-400 font-mono">{activeNotice.widthPx}px</span>
                    </div>
                    <input
                      type="range"
                      min={360}
                      max={760}
                      step={10}
                      value={activeNotice.widthPx}
                      onChange={(e) =>
                        updateActiveNotice({ widthPx: Number(e.target.value) })
                      }
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONDITIONAL PAGE TARGETING & PERFORMANCE */}
            {activeTab === 'targeting' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-200 leading-relaxed">
                    <strong>تضمین عدم افت سرعت سایت:</strong> افزونه ابتدا در سمت سرور (PHP) شروط زیر را بررسی می‌کند؛ اگر کاربری در صفحه‌ای باشد که شامل این پاپ‌آپ نیست، هیچ فایل CSS یا JS در آن صفحه لود نمی‌شود.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    صفحات هدف برای نمایش این پاپ‌آپ:
                  </label>
                  <select
                    value={activeNotice.displayTarget}
                    onChange={(e) =>
                      updateActiveNotice({
                        displayTarget: e.target.value as NoticeItem['displayTarget'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="all_pages">تمامی صفحات سایت (عمومی)</option>
                    <option value="homepage_only">فقط صفحه اصلی سایت (Homepage)</option>
                    <option value="woo_all">تمامی برگه‌های ووکامرس (فروشگاه، محصول، سبد، پرداخت)</option>
                    <option value="woo_shop_product">فقط صفحات فروشگاه، دسته‌ها و محصولات ووکامرس</option>
                    <option value="woo_checkout_cart">فقط برگه سبد خرید و تسویه‌حساب ووکامرس</option>
                    <option value="custom_selection">
                      انتخاب ترکیبی سفارشی (برگه‌های ووکامرس + آدرس یا آیدی خاص)
                    </option>
                  </select>
                </div>

                {activeNotice.displayTarget === 'custom_selection' && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-blue-300">
                      انتخاب برگه‌های ووکامرس:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.shop}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                shop: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>صفحه اصلی فروشگاه</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.product}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                product: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>صفحات تکی محصولات</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.productCategory}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                productCategory: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>دسته‌بندی محصولات</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.cart}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                cart: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>سبد خرید (Cart)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.checkout}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                checkout: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>تسویه‌حساب (Checkout)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetWooPages.account}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetWooPages: {
                                ...activeNotice.targetWooPages,
                                account: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>حساب کاربری من</span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    آدرس URL یا آیدی برگه‌های شامل (Include - هر خط یک مورد):
                  </label>
                  <textarea
                    rows={3}
                    dir="ltr"
                    value={activeNotice.includePageIdsOrUrls}
                    onChange={(e) =>
                      updateActiveNotice({ includePageIdsOrUrls: e.target.value })
                    }
                    placeholder="/checkout&#10;/rules&#10;142"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    آدرس URL یا آیدی برگه‌های مستثنی (Exclude - عدم نمایش):
                  </label>
                  <textarea
                    rows={2}
                    dir="ltr"
                    value={activeNotice.excludePageIdsOrUrls}
                    onChange={(e) =>
                      updateActiveNotice({ excludePageIdsOrUrls: e.target.value })
                    }
                    placeholder="/contact-us&#10;215"
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2.5">
                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span className="font-bold text-slate-200">
                      جلوگیری از بسته شدن با کلیک روی فضای خالی اطراف
                    </span>
                    <input
                      type="checkbox"
                      checked={activeNotice.preventCloseOnBackdrop}
                      onChange={(e) =>
                        updateActiveNotice({ preventCloseOnBackdrop: e.target.checked })
                      }
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer text-xs">
                    <span className="font-bold text-slate-200">
                      مخفی کردن دکمه ضربدر (X) بالای پاپ‌آپ
                    </span>
                    <input
                      type="checkbox"
                      checked={activeNotice.hideCloseButton}
                      onChange={(e) =>
                        updateActiveNotice({ hideCloseButton: e.target.checked })
                      }
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 4: ZERO-DB-BLOAT COOKIE & QUEUE SETTINGS */}
            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">
                    معماری بدون بار دیتابیس (Zero Database Bloat) فعال است
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    وضعیت تایید هر اطلاعیه بدون ایجاد جدول اضافه در دیتابیس وردپرس و بدون درخواست AJAX، صرفاً در کوکی و حافظه مرورگر کاربر ذخیره می‌شود.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">
                      نسخه این اطلاعیه: {activeNotice.noticeVersion}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      با ارتقای نسخه، این پاپ‌آپ مجدداً به کاربرانی که قبلاً تایید کرده‌اند نمایش داده می‌شود.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={bumpNoticeVersion}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ارتقای نسخه</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    نحوه ذخیره تاییدیه در مرورگر کاربر:
                  </label>
                  <select
                    value={activeNotice.storageMethod}
                    onChange={(e) =>
                      updateActiveNotice({
                        storageMethod: e.target.value as NoticeItem['storageMethod'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="cookie_localstorage">
                      ذخیره در کوکی و LocalStorage مرورگر بر اساس زمان انقضا (پیشنهادی)
                    </option>
                    <option value="session_only">
                      فقط در همان نشست مرورگر (Session Storage)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    مدت اعتبار کوکی تایید این اطلاعیه (روز):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={activeNotice.cookieExpireDays}
                    onChange={(e) =>
                      updateActiveNotice({ cookieExpireDays: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رفتار نمایش در صورت تطابق چند پاپ‌آپ در یک صفحه:
                  </label>
                  <select
                    value={config.queueMode}
                    onChange={(e) =>
                      updatePluginConfig({
                        queueMode: e.target.value as PluginConfig['queueMode'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="priority_sequential">
                      نمایش بر اساس اولویت و نوبت (پس از تایید اولی، نوبت به بعدی می‌رسد)
                    </option>
                    <option value="highest_only">
                      نمایش فقط بالاترین اولویت در هر بار بازدید صفحه
                    </option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Left Column: Sticky Live Interactive Simulator (7 Cols) */}
        <section className="lg:col-span-7 lg:sticky lg:top-20">
          <LivePopupPreview
            config={config}
            activeNotice={activeNotice}
            onSelectNoticeId={(id) => setActiveNoticeId(id)}
          />
        </section>
      </main>

      {/* Modals */}
      <CodeViewerModal
        config={config}
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <AiStudioModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeNotice={activeNotice}
        onUpdateActiveNotice={updateActiveNotice}
      />
    </div>
  );
}
