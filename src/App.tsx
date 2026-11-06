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
  Eye,
  LayoutDashboard,
  ListFilter,
  Save,
  ArrowRight,
  Clock,
  Tag,
  Terminal,
} from 'lucide-react';
import {
  PluginConfig,
  NoticeItem,
  DEFAULT_PLUGIN_CONFIG,
  STYLE_PRESETS,
  QUICK_CONTENT_TEMPLATES,
  PopupStylePreset,
  StylePalette,
  createNewNoticeItem,
} from './types/plugin';
import { downloadPluginZip } from './utils/wpPluginGenerator';
import { LivePopupPreview } from './components/LivePopupPreview';
import { CodeViewerModal } from './components/CodeViewerModal';
import { AiStudioModal } from './components/AiStudioModal';

type AdminSubmenuView = 'dashboard' | 'list' | 'editor';
type SettingsTab = 'content' | 'style' | 'timing_session' | 'targeting';

export default function App() {
  const [config, setConfig] = useState<PluginConfig>(DEFAULT_PLUGIN_CONFIG);
  const [submenuView, setSubmenuView] = useState<AdminSubmenuView>('editor');
  const [activeNoticeId, setActiveNoticeId] = useState<string>(
    DEFAULT_PLUGIN_CONFIG.notices[0].id
  );
  const [activeTab, setActiveTab] = useState<SettingsTab>('content');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [ajaxToast, setAjaxToast] = useState<string | null>(null);

  const activeNotice: NoticeItem =
    config.notices.find((n) => n.id === activeNoticeId) || config.notices[0];

  const currentStylePresetInfo =
    STYLE_PRESETS.find((p) => p.id === activeNotice.stylePreset) || STYLE_PRESETS[0];

  const triggerAjaxToast = (msg: string) => {
    setAjaxToast(msg);
    setTimeout(() => setAjaxToast(null), 3200);
  };

  const updateActiveNotice = (partial: Partial<NoticeItem>) => {
    setConfig((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === activeNotice.id ? { ...n, ...partial } : n
      ),
    }));
  };

  const handleAjaxSaveCurrentNotice = () => {
    // Stays right on the current editor screen without redirecting back to list!
    triggerAjaxToast(
      `✓ تنظیمات «${activeNotice.internalName}» به صورت ایجکس ذخیره شد (بدون خروج از صفحه).`
    );
  };

  const handleAddNewNotice = () => {
    const newItem = createNewNoticeItem(config.notices.length + 1);
    setConfig((prev) => ({
      ...prev,
      notices: [...prev.notices, newItem],
    }));
    setActiveNoticeId(newItem.id);
    setSubmenuView('editor');
    triggerAjaxToast('✓ اطلاعیه جدید ایجاد شد و آماده ویرایش است.');
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
    triggerAjaxToast(`✓ یک کپی از «${notice.internalName}» به صورت ایجکس ایجاد شد.`);
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
    triggerAjaxToast('✓ اطلاعیه انتخاب شده به صورت ایجکس حذف گردید.');
  };

  const handleToggleNoticeEnabled = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      notices: prev.notices.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      ),
    }));
    triggerAjaxToast('✓ وضعیت فعال/غیرفعال اطلاعیه به صورت ایجکس بروزرسانی شد.');
  };

  const handleSelectStylePreset = (presetId: PopupStylePreset) => {
    const found = STYLE_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    updateActiveNotice({
      stylePreset: presetId,
      ...found.palette,
    });
    triggerAjaxToast(
      `✓ استایل «${found.name}» انتخاب شد و پروفایل‌های رنگی پیشنهادی بارگذاری شدند.`
    );
  };

  const handleApplyRecommendedHarmony = (harmony: StylePalette) => {
    updateActiveNotice({
      primaryColor: harmony.primaryColor,
      buttonTextColor: harmony.buttonTextColor,
      accentColor: harmony.accentColor,
      backgroundColor: harmony.backgroundColor,
      textColor: harmony.textColor,
      subtitleColor: harmony.subtitleColor,
      bodyBoxBg: harmony.bodyBoxBg,
      bodyBoxText: harmony.bodyBoxText,
      bodyBoxBorder: harmony.bodyBoxBorder,
      checkboxBoxBg: harmony.checkboxBoxBg,
      checkboxBoxText: harmony.checkboxBoxText,
    });
    triggerAjaxToast(`✓ پالت رنگی پیشنهادی «${harmony.name || ''}» با خوانایی کامل اعمال شد.`);
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
    triggerAjaxToast(`✓ قالب متنی «${tpl.name}» جایگذاری شد.`);
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
    triggerAjaxToast('✓ نسخه اطلاعیه ارتقا یافت (نمایش مجدد برای تمام کاربران).');
  };

  // Dashboard Stats Calculation
  const totalNoticesCount = config.notices.length;
  const activeNoticesCount = config.notices.filter((n) => n.enabled).length;
  const inactiveNoticesCount = totalNoticesCount - activeNoticesCount;
  const sessionNoticesCount = config.notices.filter(
    (n) => n.sessionMode === 'every_session'
  ).length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Floating AJAX Toast Notification */}
      {ajaxToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900/95 border-r-4 border-emerald-500 border border-slate-700 text-white px-5 py-3.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2.5 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{ajaxToast}</span>
        </div>
      )}

      {/* Top Application Header ("اطلاع رسانی پاپ آپ") */}
      <header className="sticky top-0 z-30 bg-[#0c1220]/95 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base md:text-lg font-extrabold text-white tracking-tight">
                  افزونه {config.adminMenuTitle} (نسخه ۳.۰ ایجکس)
                </h1>
                <span className="text-xs text-emerald-400 font-bold">
                  داشبورد آماری · سشن و اسکرول پیکسلی · پست‌تایپ و تکسونومی
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

          {/* Primary Actions */}
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
              <span>مشاهده کدهای PHP نسخه ۳.۰</span>
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
                  <span>فایل ZIP نسخه ۳.۰ دانلود شد!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? 'در حال ساخت ZIP...'
                      : 'دانلود افزونه آماده نصب (popup-notice-pro-v3.zip)'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* WordPress Admin Submenu Navigation Bar ("اطلاع رسانی پاپ آپ" -> پیشخوان و آمار / همه اطلاعیه‌ها / ویرایشگر ایجکس) */}
      <div className="bg-[#0b111e] border-b border-slate-800 px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 ml-2">
              منوی پیشخوان وردپرس ({config.adminMenuTitle}):
            </span>

            <button
              type="button"
              onClick={() => setSubmenuView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                submenuView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>۱. پیشخوان و آمار</span>
            </button>

            <button
              type="button"
              onClick={() => setSubmenuView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                submenuView === 'list'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>۲. زیرمنوی همه اطلاعیه‌ها ({totalNoticesCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setSubmenuView('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                submenuView === 'editor'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>۳. ویرایشگر ایجکس اطلاعیه</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNewNotice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ افزودن اطلاعیه جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: DASHBOARD & STATISTICS SUBMENU */}
      {submenuView === 'dashboard' && (
        <div className="max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-2">تعداد کل اطلاعیه‌ها</div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {totalNoticesCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                تعریف شده در زیرمنوی اطلاعیه‌ها
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1220] border border-emerald-500/30">
              <div className="text-xs font-bold text-emerald-400 mb-2">
                اطلاعیه‌های فعال در سایت
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {activeNoticesCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                در حال نمایش با لود شرطی هوشمند
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1220] border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-2">اطلاعیه‌های غیرفعال</div>
              <div className="text-3xl font-extrabold text-slate-300 font-mono">
                {inactiveNoticesCount}
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                آماده فعال‌سازی با یک کلیک ایجکس
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1220] border border-blue-500/30">
              <div className="text-xs font-bold text-blue-400 mb-2">
                نمایش در هر سشن (Session)
              </div>
              <div className="text-3xl font-extrabold text-blue-400 font-mono">
                {sessionNoticesCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                ذخیره سبک در مرورگر بدون بار دیتابیس
              </div>
            </div>
          </div>

          {/* Quick Overview Table in Dashboard */}
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-white">
                  خلاصه وضعیت اطلاعیه‌ها و کدهای فراخوانی (Shortcode / PHP)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  روی هر اطلاعیه کلیک کنید تا بدون رفرش صفحه وارد ویرایشگر ایجکس آن شوید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmenuView('list')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
              >
                مشاهده زیرمنوی همه اطلاعیه‌ها &larr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">اولویت</th>
                    <th className="py-3 px-4">نام اطلاعیه</th>
                    <th className="py-3 px-4">وضعیت (ایجکس)</th>
                    <th className="py-3 px-4">نحوه و زمان نمایش</th>
                    <th className="py-3 px-4">شورت‌کد فراخوانی در هر مکان</th>
                    <th className="py-3 px-4">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {config.notices.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-900/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        #{n.priority}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{n.internalName}</td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleNoticeEnabled(n.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                            n.enabled
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {n.enabled ? '● فعال' : '○ غیرفعال'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {n.sessionMode === 'every_session'
                          ? 'در هر سشن'
                          : n.sessionMode === 'every_pageload'
                          ? 'هر بار لود'
                          : `کوکی (${n.cookieExpireDays} روز)`}{' '}
                        ·{' '}
                        {n.triggerType === 'delay_seconds'
                          ? `بعد از ${n.delaySeconds} ثانیه`
                          : n.triggerType === 'scroll_pixels'
                          ? `اسکرول ${n.scrollPixels} پیکسل`
                          : n.triggerType === 'exit_intent'
                          ? 'قصد خروج'
                          : 'فوری'}
                      </td>
                      <td className="py-3.5 px-4">
                        <code
                          dir="ltr"
                          className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-blue-300 font-mono text-[11px]"
                        >
                          [popup_notice id="{n.id}"]
                        </code>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveNoticeId(n.id);
                            setSubmenuView('editor');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                        >
                          ویرایش ایجکس
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ALL NOTICES AJAX LIST SUBMENU */}
      {submenuView === 'list' && (
        <div className="max-w-[1440px] w-full mx-auto px-6 py-6 space-y-4">
          <div className="bg-[#0c1220] border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-extrabold text-white">
                  زیرمنوی همه اطلاعیه‌ها (مدیریت ایجکس بدون رفرش صفحه)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  امکان فعال/غیرفعال‌سازی آنی، کپی، حذف و کپی شورت‌کد برای هر اطلاعیه
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddNewNotice}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ افزودن اطلاعیه جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.notices.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: item.primaryColor }}
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-white">
                          {item.internalName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{item.title}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-blue-400 font-bold">
                      اولویت #{item.priority}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                    <span>
                      تکرار:{' '}
                      <strong>
                        {item.sessionMode === 'every_session'
                          ? 'در هر سشن'
                          : item.sessionMode === 'every_pageload'
                          ? 'هر بار لود'
                          : `کوکی ${item.cookieExpireDays} روز`}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      زمان باز شدن:{' '}
                      <strong>
                        {item.triggerType === 'delay_seconds'
                          ? `بعد از ${item.delaySeconds} ثانیه`
                          : item.triggerType === 'scroll_pixels'
                          ? `بعد از ${item.scrollPixels}px اسکرول`
                          : 'فوری'}
                      </strong>
                    </span>
                    <span>·</span>
                    <code dir="ltr" className="text-blue-400 font-mono">
                      [popup_notice id="{item.id}"]
                    </code>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleToggleNoticeEnabled(item.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                        item.enabled ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      <Power className="w-4 h-4" />
                      <span>{item.enabled ? 'فعال در سایت' : 'غیرفعال'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveNoticeId(item.id);
                          setSubmenuView('editor');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                      >
                        ویرایش کامل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateNotice(item)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="کپی"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {config.notices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(item.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AJAX NOTICE EDITOR + LIVE PREVIEW */}
      {submenuView === 'editor' && (
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Right Column: AJAX Notice Editor (5 Cols) */}
          <section className="lg:col-span-5 bg-[#0c1220] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Top Editor Action Bar: Stays on page when saving + Back Button! */}
            <div className="px-4 py-3 bg-[#11192c] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSubmenuView('list')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به لیست اطلاعیه‌ها</span>
              </button>

              <button
                type="button"
                onClick={handleAjaxSaveCurrentNotice}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره تغییرات (ایجکس - ماندن در صفحه)</span>
              </button>
            </div>

            {/* Notice Selector Strip */}
            <div className="px-4 py-2.5 bg-[#0a0f1c] border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-400">در حال ویرایش:</span>
                <select
                  value={activeNotice.id}
                  onChange={(e) => setActiveNoticeId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                >
                  {config.notices.map((n) => (
                    <option key={n.id} value={n.id}>
                      #{n.priority} - {n.internalName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-slate-400">اولویت:</label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={activeNotice.priority}
                  onChange={(e) =>
                    updateActiveNotice({ priority: Number(e.target.value) || 1 })
                  }
                  className="w-12 px-1.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center font-mono text-white"
                />
              </div>
            </div>

            {/* Editor Tabs */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-[#090e1a] border-b border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>محتوا و سرتیتر</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'style'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>پروفایل رنگی</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('timing_session')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'timing_session'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>سشن و اسکرول</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('targeting')}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'targeting'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>پست‌تایپ و مکان</span>
              </button>
            </div>

            {/* Editor Form Body */}
            <div className="p-5 space-y-5 max-h-[68vh] overflow-y-auto">
              {/* TAB 1: CONTENT & HEADER VISIBILITY TOGGLES ("سرتیتر") */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      نام داخلی این اطلاعیه (در لیست مدیریت):
                    </label>
                    <input
                      type="text"
                      value={activeNotice.internalName}
                      onChange={(e) => updateActiveNotice({ internalName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Quick Content Templates */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-xs font-bold text-slate-300 mb-2">
                      قالب‌های متنی آماده (اعمال فوری):
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
                      <span>فعال / غیرفعال‌سازی آیکون، سرتیتر، عنوان و زیرعنوان:</span>
                    </div>

                    {/* Icon Toggle */}
                    <div className="space-y-2 pb-3 border-b border-slate-800">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-slate-200">
                          نمایش آیکون برداری (Inline SVG) در سایت
                        </span>
                        <input
                          type="checkbox"
                          checked={activeNotice.showIcon}
                          onChange={(e) =>
                            updateActiveNotice({ showIcon: e.target.checked })
                          }
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

                    {/* Kicker / سرتیتر Toggle */}
                    <div className="space-y-2 pb-3 border-b border-slate-800">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs font-bold text-slate-200">
                          نمایش سرتیتر بالای عنوان
                        </span>
                        <input
                          type="checkbox"
                          checked={activeNotice.showBadge}
                          onChange={(e) =>
                            updateActiveNotice({ showBadge: e.target.checked })
                          }
                          className="w-4 h-4 accent-blue-500 rounded"
                        />
                      </label>
                      {activeNotice.showBadge && (
                        <input
                          type="text"
                          value={activeNotice.badgeText}
                          onChange={(e) => updateActiveNotice({ badgeText: e.target.value })}
                          placeholder="متن سرتیتر بالای عنوان..."
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
                          onChange={(e) =>
                            updateActiveNotice({ showTitle: e.target.checked })
                          }
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
                          onChange={(e) =>
                            updateActiveNotice({ showSubtitle: e.target.checked })
                          }
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

                  {/* Mandatory Checkbox */}
                  <div className="p-3.5 rounded-xl bg-blue-950/25 border border-blue-500/30 space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-blue-300">
                        الزام به تیک زدن «متن اطلاعیه را خواندم و متوجه شدم»
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
                        onChange={(e) =>
                          updateActiveNotice({ checkboxLabel: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        متن دکمه تایید اصلی:
                      </label>
                      <input
                        type="text"
                        value={activeNotice.acceptButtonText}
                        onChange={(e) =>
                          updateActiveNotice({ acceptButtonText: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STYLE PROFILES & RECOMMENDED COLOR HARMONIES */}
              {activeTab === 'style' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      ۱. انتخاب پروفایل استایل پایه:
                    </label>
                    <div className="space-y-2">
                      {STYLE_PRESETS.map((preset) => {
                        const isSelected = activeNotice.stylePreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectStylePreset(preset.id)}
                            className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/15 border-blue-500 text-white'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold">{preset.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  {preset.isLight ? '(روشن)' : '(تیره)'}
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
                              />
                              <span
                                className="w-5 h-5 rounded-full border border-slate-500/40"
                                style={{ backgroundColor: preset.palette.primaryColor }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommended Color Harmonies for Selected Style Profile */}
                  <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2.5">
                    <div className="text-xs font-bold text-blue-300">
                      ۲. ترکیب رنگ‌های پیشنهادی مکمل برای «{currentStylePresetInfo.name}»:
                    </div>
                    <p className="text-[11px] text-slate-400">
                      با کلیک روی هر پیشنهاد، تمام رنگ‌های پس‌زمینه، کادر متن، سرتیتر و دکمه به صورت هماهنگ و خوانا تغییر می‌کنند:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {currentStylePresetInfo.recommendedHarmonies.map((harmony, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyRecommendedHarmony(harmony)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-blue-400 flex items-center gap-2 text-right transition-all cursor-pointer"
                        >
                          <div className="flex items-center -space-x-1.5 shrink-0">
                            <span
                              className="w-4 h-4 rounded-full border border-white/30"
                              style={{ backgroundColor: harmony.primaryColor }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-slate-500"
                              style={{ backgroundColor: harmony.backgroundColor }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200 truncate">
                            {harmony.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fine-Grained Color Pickers */}
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
                        پس‌زمینه کادر متن:
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
                        رنگ متن داخل کادر:
                      </label>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                        <input
                          type="color"
                          value={activeNotice.bodyBoxText}
                          onChange={(e) =>
                            updateActiveNotice({ bodyBoxText: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span dir="ltr" className="text-xs font-mono text-slate-300">
                          {activeNotice.bodyBoxText}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        رنگ دکمه و آیکون:
                      </label>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                        <input
                          type="color"
                          value={activeNotice.primaryColor}
                          onChange={(e) =>
                            updateActiveNotice({ primaryColor: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span dir="ltr" className="text-xs font-mono text-slate-300">
                          {activeNotice.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        رنگ سرتیتر بالای عنوان:
                      </label>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-700">
                        <input
                          type="color"
                          value={activeNotice.accentColor}
                          onChange={(e) =>
                            updateActiveNotice({ accentColor: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span dir="ltr" className="text-xs font-mono text-slate-300">
                          {activeNotice.accentColor}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SESSION DISPLAY, DELAY N SECONDS & SCROLL N PIXELS */}
              {activeTab === 'timing_session' && (
                <div className="space-y-4">
                  {/* Session / Cookie Control */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <label className="block text-xs font-bold text-blue-300">
                      ۱. نحوه تکرار نمایش (نمایش در هر سشن / کوکی):
                    </label>
                    <select
                      value={activeNotice.sessionMode}
                      onChange={(e) =>
                        updateActiveNotice({
                          sessionMode: e.target.value as NoticeItem['sessionMode'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="every_session">
                        نمایش در هر سشن (Session - با بستن و باز کردن مجدد مرورگر نمایش داده شود)
                      </option>
                      <option value="cookie_days">
                        ذخیره در کوکی تا N روز (عدم نمایش مجدد تا پایان انقضای کوکی)
                      </option>
                      <option value="every_pageload">
                        نمایش در هر بار رفرش یا باز شدن صفحه
                      </option>
                    </select>

                    {activeNotice.sessionMode === 'cookie_days' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          تعداد روز اعتبار کوکی:
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={activeNotice.cookieExpireDays}
                          onChange={(e) =>
                            updateActiveNotice({
                              cookieExpireDays: Number(e.target.value) || 30,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Trigger Control: Immediate vs N Seconds vs N Pixels Scroll */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
                    <label className="block text-xs font-bold text-emerald-300">
                      ۲. زمان باز شدن پاپ‌آپ (بعد از N ثانیه یا بعد از N پیکسل اسکرول):
                    </label>
                    <select
                      value={activeNotice.triggerType}
                      onChange={(e) =>
                        updateActiveNotice({
                          triggerType: e.target.value as NoticeItem['triggerType'],
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="immediate">نمایش فوری به محض بارگذاری صفحه</option>
                      <option value="delay_seconds">
                        نمایش بعد از N ثانیه (مثلاً ۳ ثانیه)
                      </option>
                      <option value="scroll_pixels">
                        نمایش بعد از N پیکسل اسکرول صفحه (مثلاً ۳۰۰ پیکسل)
                      </option>
                      <option value="exit_intent">
                        نمایش هنگام قصد خروج کاربر از صفحه (Exit Intent)
                      </option>
                    </select>

                    {activeNotice.triggerType === 'delay_seconds' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/40">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-200">
                            نمایش بعد از چند ثانیه؟
                          </span>
                          <span className="font-mono font-bold text-blue-400">
                            {activeNotice.delaySeconds} ثانیه
                          </span>
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={activeNotice.delaySeconds}
                          onChange={(e) =>
                            updateActiveNotice({
                              delaySeconds: Number(e.target.value) || 3,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    )}

                    {activeNotice.triggerType === 'scroll_pixels' && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-200">
                            نمایش بعد از چند پیکسل اسکرول؟
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {activeNotice.scrollPixels}px
                          </span>
                        </div>
                        <input
                          type="number"
                          min={50}
                          max={5000}
                          step={50}
                          value={activeNotice.scrollPixels}
                          onChange={(e) =>
                            updateActiveNotice({
                              scrollPixels: Number(e.target.value) || 300,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    )}
                  </div>

                  {/* Version Reset */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">
                        نسخه اطلاعیه: {activeNotice.noticeVersion}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ریست وضعیت تایید برای تمامی کاربران
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={bumpNoticeVersion}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>ارتقای نسخه</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: POST TYPES, TAXONOMIES, URLS & SHORTCODE */}
              {activeTab === 'targeting' && (
                <div className="space-y-4">
                  {/* Shortcode & PHP Function Box */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                      <Terminal className="w-4 h-4" />
                      <span>فراخوانی مستقیم در هر مکان دلخواه (شورت‌کد و تابع PHP):</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-[11px] font-mono" dir="ltr">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-blue-300 select-all">
                        [popup_notice id="{activeNotice.id}"]
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 select-all">
                        {`<?php popup_notice_render('${activeNotice.id}'); ?>`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      حالت کلی مکان نمایش:
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
                      <option value="all_pages">تمامی صفحات سایت</option>
                      <option value="homepage_only">فقط صفحه اصلی سایت (Homepage)</option>
                      <option value="woo_all">تمامی برگه‌های ووکامرس</option>
                      <option value="woo_shop_product">فقط فروشگاه و محصولات ووکامرس</option>
                      <option value="woo_checkout_cart">فقط سبد خرید و تسویه‌حساب ووکامرس</option>
                      <option value="advanced_rules">
                        انتخاب پیشرفته بر اساس پست‌تایپ، تکسونومی، آدرس و آیدی
                      </option>
                      <option value="shortcode_only">
                        فقط فراخوانی با شورت‌کد در مکان دلخواه
                      </option>
                    </select>
                  </div>

                  {/* Post Types Selection */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-blue-300">
                      انتخاب بر اساس پست‌تایپ (Post Types):
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetPostTypes.post}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetPostTypes: {
                                ...activeNotice.targetPostTypes,
                                post: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>نوشته‌ها (post)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetPostTypes.page}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetPostTypes: {
                                ...activeNotice.targetPostTypes,
                                page: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>برگه‌ها (page)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetPostTypes.product}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetPostTypes: {
                                ...activeNotice.targetPostTypes,
                                product: e.target.checked,
                              },
                            })
                          }
                          className="accent-blue-500"
                        />
                        <span>محصولات (product)</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={activeNotice.targetPostTypes.customPostTypes}
                      onChange={(e) =>
                        updateActiveNotice({
                          targetPostTypes: {
                            ...activeNotice.targetPostTypes,
                            customPostTypes: e.target.value,
                          },
                        })
                      }
                      placeholder="پست‌تایپ‌های سفارشی (مثلاً: portfolio, course)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  {/* Taxonomies Selection */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-emerald-300">
                      انتخاب بر اساس تکسونومی و دسته‌بندی (Taxonomies):
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetTaxonomies.category}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetTaxonomies: {
                                ...activeNotice.targetTaxonomies,
                                category: e.target.checked,
                              },
                            })
                          }
                          className="accent-emerald-500"
                        />
                        <span>دسته‌بندی نوشته‌ها</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetTaxonomies.postTag}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetTaxonomies: {
                                ...activeNotice.targetTaxonomies,
                                postTag: e.target.checked,
                              },
                            })
                          }
                          className="accent-emerald-500"
                        />
                        <span>برچسب نوشته‌ها</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetTaxonomies.productCat}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetTaxonomies: {
                                ...activeNotice.targetTaxonomies,
                                productCat: e.target.checked,
                              },
                            })
                          }
                          className="accent-emerald-500"
                        />
                        <span>دسته‌بندی محصولات ووکامرس</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeNotice.targetTaxonomies.productTag}
                          onChange={(e) =>
                            updateActiveNotice({
                              targetTaxonomies: {
                                ...activeNotice.targetTaxonomies,
                                productTag: e.target.checked,
                              },
                            })
                          }
                          className="accent-emerald-500"
                        />
                        <span>برچسب محصولات ووکامرس</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={activeNotice.targetTaxonomies.specificTerms}
                      onChange={(e) =>
                        updateActiveNotice({
                          targetTaxonomies: {
                            ...activeNotice.targetTaxonomies,
                            specificTerms: e.target.value,
                          },
                        })
                      }
                      placeholder="اسلاگ یا آیدی دسته‌های خاص (مثلاً: mobile, 14)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  {/* URLs & IDs Include / Exclude */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      آدرس URL یا آیدی برگه‌های خاص (Include):
                    </label>
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={activeNotice.includePageIdsOrUrls}
                      onChange={(e) =>
                        updateActiveNotice({ includePageIdsOrUrls: e.target.value })
                      }
                      placeholder="/checkout&#10;145"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky Editor Action Bar */}
            <div className="px-5 py-3.5 bg-[#090e1a] border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSubmenuView('list')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به لیست اطلاعیه‌ها</span>
              </button>

              <button
                type="button"
                onClick={handleAjaxSaveCurrentNotice}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات اطلاعیه (AJAX)</span>
              </button>
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
      )}

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
