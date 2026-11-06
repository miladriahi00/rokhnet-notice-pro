import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  BellRing,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  Monitor,
  Smartphone,
  RotateCcw,
  ExternalLink,
  X,
  Lock,
  Store,
  CreditCard,
  Globe,
  Zap,
  Layers,
} from 'lucide-react';
import { PluginConfig, NoticeItem } from '../types/plugin';

interface LivePopupPreviewProps {
  config: PluginConfig;
  activeNotice: NoticeItem;
  onSelectNoticeId: (id: string) => void;
}

export const LivePopupPreview: React.FC<LivePopupPreviewProps> = ({
  config,
  activeNotice,
  onSelectNoticeId,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [simulatedPage, setSimulatedPage] = useState<'home' | 'product' | 'checkout'>('home');
  const [previewMode, setPreviewMode] = useState<'single' | 'queue'>('single');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(activeNotice.countdownSeconds);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);

  // Check if a notice matches the current simulated page
  const doesNoticeMatchPage = (n: NoticeItem, page: 'home' | 'product' | 'checkout'): boolean => {
    if (!n.enabled) return false;
    if (n.displayTarget === 'all_pages') return true;
    if (n.displayTarget === 'homepage_only') return page === 'home';
    if (n.displayTarget === 'woo_all') return page === 'product' || page === 'checkout';
    if (n.displayTarget === 'woo_shop_product') return page === 'product';
    if (n.displayTarget === 'woo_checkout_cart') return page === 'checkout';
    if (n.displayTarget === 'custom_selection') {
      if (page === 'product' && (n.targetWooPages.shop || n.targetWooPages.product)) return true;
      if (page === 'checkout' && (n.targetWooPages.cart || n.targetWooPages.checkout)) return true;
      if (page === 'home' && n.includePageIdsOrUrls.includes('/')) return true;
      return false;
    }
    return true;
  };

  // Matched notices sorted by priority
  const matchedQueue = config.notices
    .filter((n) => doesNoticeMatchPage(n, simulatedPage))
    .sort((a, b) => a.priority - b.priority);

  const pendingInQueue = matchedQueue.filter((n) => !acceptedIds.includes(n.id));

  // Determine which notice is currently rendered in the modal
  const displayedNotice: NoticeItem | null =
    previewMode === 'single'
      ? activeNotice
      : pendingInQueue.length > 0
      ? pendingInQueue[0]
      : null;

  useEffect(() => {
    if (displayedNotice) {
      setRemainingSeconds(displayedNotice.countdownSeconds);
      setIsChecked(false);
      setShowError(false);
    }
  }, [displayedNotice?.id, displayedNotice?.countdownSeconds]);

  useEffect(() => {
    if (!isPopupOpen || remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPopupOpen, remainingSeconds]);

  const triggerShake = () => {
    setIsShaking(false);
    setTimeout(() => setIsShaking(true), 10);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleAcceptClick = () => {
    if (!displayedNotice || remainingSeconds > 0) return;

    if (displayedNotice.requireCheckbox && !isChecked) {
      setShowError(true);
      triggerShake();
      return;
    }

    setShowError(false);
    setIsChecked(false);

    if (previewMode === 'queue') {
      setAcceptedIds((prev) => [...prev, displayedNotice.id]);
    } else {
      setAcceptedIds((prev) => Array.from(new Set([...prev, displayedNotice.id])));
      setIsPopupOpen(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!displayedNotice) return;
    if (e.target === e.currentTarget) {
      if (displayedNotice.preventCloseOnBackdrop) {
        triggerShake();
      } else {
        setIsPopupOpen(false);
      }
    }
  };

  const handleCloseX = () => {
    if (!displayedNotice) return;
    if (displayedNotice.requireCheckbox && !isChecked) {
      setShowError(true);
      triggerShake();
      return;
    }
    setIsPopupOpen(false);
  };

  const handleResetSimulation = () => {
    setIsChecked(false);
    setShowError(false);
    setAcceptedIds([]);
    if (displayedNotice) {
      setRemainingSeconds(displayedNotice.countdownSeconds);
    }
    setIsPopupOpen(true);
  };

  const renderIcon = (n: NoticeItem) => {
    if (!n.showIcon) return null;
    const iconProps = { className: 'w-6 h-6', style: { color: n.primaryColor } };
    switch (n.iconType) {
      case 'shield':
        return <ShieldCheck {...iconProps} />;
      case 'bell':
        return <BellRing {...iconProps} />;
      case 'alert':
        return <AlertTriangle {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'check':
        return <CheckCircle2 {...iconProps} />;
      case 'cart':
        return <ShoppingCart {...iconProps} />;
      default:
        return <ShieldCheck {...iconProps} />;
    }
  };

  const getCardStyle = (n: NoticeItem): React.CSSProperties => {
    const base: React.CSSProperties = {
      maxWidth: viewport === 'mobile' ? '100%' : `${n.widthPx}px`,
      borderRadius: `${n.borderRadiusPx}px`,
      backgroundColor: n.backgroundColor,
      color: n.textColor,
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.22)',
    };

    if (n.stylePreset === 'luxury-dark') {
      return {
        ...base,
        border: `1.5px solid ${n.primaryColor}66`,
        boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 35px ${n.primaryColor}20`,
      };
    }

    if (n.stylePreset === 'cyber-neon') {
      return {
        ...base,
        border: `1.5px solid ${n.primaryColor}`,
        boxShadow: `0 0 35px ${n.primaryColor}35`,
      };
    }

    if (n.stylePreset === 'woo-checkout') {
      return {
        ...base,
        borderTop: `5px solid ${n.primaryColor}`,
      };
    }

    return base;
  };

  const getPositionClasses = (n: NoticeItem) => {
    switch (n.position) {
      case 'bottom-right':
        return 'items-end justify-start p-5';
      case 'bottom-left':
        return 'items-end justify-end p-5';
      case 'bottom-sheet':
        return 'items-end justify-center p-0';
      default:
        return 'items-center justify-center p-5';
    }
  };

  const showAnyHeader =
    displayedNotice &&
    (displayedNotice.showIcon ||
      (displayedNotice.showBadge && displayedNotice.badgeText) ||
      (displayedNotice.showTitle && displayedNotice.title) ||
      (displayedNotice.showSubtitle && displayedNotice.subtitle));

  return (
    <div className="flex flex-col h-full bg-[#0b101d] border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Preview Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-3 bg-[#111827] border-b border-slate-800">
        {/* Mode Switcher: Single Editing vs Priority Queue */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setPreviewMode('single');
              setIsPopupOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              previewMode === 'single'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>پیش‌نمایش پاپ‌آپ در حال ویرایش</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPreviewMode('queue');
              setAcceptedIds([]);
              setIsPopupOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              previewMode === 'queue'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>تست نوبت و اولویت در صفحات ({matchedQueue.length})</span>
          </button>
        </div>

        {/* Simulated Page Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setSimulatedPage('home');
              setAcceptedIds([]);
              setIsPopupOpen(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              simulatedPage === 'home'
                ? 'bg-slate-800 text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>صفحه اصلی</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSimulatedPage('product');
              setAcceptedIds([]);
              setIsPopupOpen(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              simulatedPage === 'product'
                ? 'bg-slate-800 text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>محصول ووکامرس</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSimulatedPage('checkout');
              setAcceptedIds([]);
              setIsPopupOpen(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              simulatedPage === 'checkout'
                ? 'bg-slate-800 text-blue-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>تسویه‌حساب</span>
          </button>
        </div>

        {/* Viewport & Reset Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === 'desktop' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
              title="نمای دسکتاپ"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === 'mobile' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
              title="نمای موبایل"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ریست و نمایش مجدد</span>
          </button>
        </div>
      </div>

      {/* Conditional Asset Loading Status Bar */}
      <div className="px-4 py-2 bg-[#0d1424] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">
            وضعیت لود شرطی در صفحه «
            {simulatedPage === 'home'
              ? 'صفحه اصلی'
              : simulatedPage === 'product'
              ? 'فروشگاه و محصول'
              : 'تسویه‌حساب ووکامرس'}
            »:
          </span>
          {matchedQueue.length > 0 ? (
            <span className="text-emerald-400 font-bold">
              {matchedQueue.length} پاپ‌آپ منطبق (اسکریپت لود شد · فونت ارث‌بری از قالب)
            </span>
          ) : (
            <span className="text-amber-300 font-bold">
              بدون پاپ‌آپ فعال در این صفحه (حجم فایل لود شده: ۰ کیلوبایت - بدون افت سرعت!)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">در حال ویرایش:</span>
          <span className="font-bold text-blue-400">{activeNotice.internalName}</span>
        </div>
      </div>

      {/* Simulated Browser Canvas */}
      <div className="relative flex-1 flex items-center justify-center bg-[#070a12] p-4 overflow-hidden min-h-[590px]">
        <div
          className={`relative h-full min-h-[550px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner transition-all duration-300 flex flex-col ${
            viewport === 'mobile' ? 'w-[375px]' : 'w-full'
          }`}
        >
          {/* Simulated Browser URL Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span dir="ltr" className="font-mono text-slate-300">
                {config.developerUrl}
                {simulatedPage === 'checkout'
                  ? '/checkout/'
                  : simulatedPage === 'product'
                  ? '/product/rokhnet-pro/'
                  : '/'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              قالب وردپرس ۷.۱ · فونت قالب فعال
            </div>
          </div>

          {/* Simulated Storefront Background Content */}
          <div className="flex-1 p-6 bg-slate-900/60 overflow-y-auto space-y-4 select-none">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                  RN
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-200">وبسایت و فروشگاه رخ‌نت (RokhNet)</div>
                  <div className="text-xs text-slate-500">
                    توسعه‌دهنده: {config.developerName} · {config.developerPhone}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {config.notices.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      onSelectNoticeId(n.id);
                      setPreviewMode('single');
                      setIsPopupOpen(true);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      activeNotice.id === n.id
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    #{n.priority} {n.internalName}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="text-sm font-bold text-slate-200">
                {simulatedPage === 'checkout'
                  ? 'برگه تسویه‌حساب ووکامرس ۱۱.۱ (Checkout)'
                  : simulatedPage === 'product'
                  ? 'برگه محصول و فروشگاه ووکامرس'
                  : 'صفحه اصلی سایت وردپرس ۷.۱'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                در نسخه ۲.۰، وضعیت تایید هر پاپ‌آپ بدون ایجاد هیچ بار اضافی روی دیتابیس، مستقیماً در کوکی و حافظه مرورگر کاربر ذخیره می‌شود و فایل‌های افزونه تنها در صفحات هدف لود می‌گردند.
              </p>
              {acceptedIds.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-400">
                  <span>
                    ✓ تعداد {acceptedIds.length} پاپ‌آپ توسط کاربر تیک زده شد و در کوکی مرورگر ذخیره گردید.
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSimulation}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                  >
                    پاک کردن کوکی تست و نمایش مجدد
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* LIVE POPUP OVERLAY */}
          {isPopupOpen && displayedNotice && (
            <div
              onClick={handleBackdropClick}
              className={`absolute inset-0 z-30 flex transition-all duration-300 ${getPositionClasses(
                displayedNotice
              )}`}
              style={{
                backgroundColor: `rgba(8, 12, 22, ${displayedNotice.overlayOpacity / 100})`,
                backdropFilter: `blur(${displayedNotice.backdropBlurPx}px)`,
                WebkitBackdropFilter: `blur(${displayedNotice.backdropBlurPx}px)`,
              }}
            >
              <div
                style={getCardStyle(displayedNotice)}
                className={`relative w-full p-6 md:p-7 overflow-hidden ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                {/* Close Button */}
                {!displayedNotice.hideCloseButton && (
                  <button
                    type="button"
                    onClick={handleCloseX}
                    className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(148, 163, 184, 0.18)',
                      color: displayedNotice.textColor,
                    }}
                    aria-label="بستن پاپ‌آپ"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Optional Top Banner */}
                {displayedNotice.bannerImageUrl && (
                  <div className="-mx-7 -mt-7 mb-5 max-h-44 overflow-hidden border-b border-slate-500/20">
                    <img
                      src={displayedNotice.bannerImageUrl}
                      alt={displayedNotice.title}
                      className="w-full h-44 object-cover block"
                    />
                  </div>
                )}

                {/* Dynamic Header with Independent Element Toggles */}
                {showAnyHeader && (
                  <div className="flex items-start gap-3.5 mb-4">
                    {displayedNotice.showIcon && (
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: displayedNotice.checkboxBoxBg,
                          border: `1px solid ${displayedNotice.bodyBoxBorder}`,
                        }}
                      >
                        {renderIcon(displayedNotice)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {displayedNotice.showBadge && displayedNotice.badgeText && (
                        <div
                          className="text-xs font-bold mb-1"
                          style={{ color: displayedNotice.accentColor }}
                        >
                          {displayedNotice.badgeText}
                        </div>
                      )}
                      {displayedNotice.showTitle && displayedNotice.title && (
                        <h3
                          className="text-lg md:text-xl font-extrabold leading-snug"
                          style={{ color: displayedNotice.textColor }}
                        >
                          {displayedNotice.title}
                        </h3>
                      )}
                      {displayedNotice.showSubtitle && displayedNotice.subtitle && (
                        <p
                          className="text-xs md:text-sm mt-1 leading-relaxed"
                          style={{ color: displayedNotice.subtitleColor }}
                        >
                          {displayedNotice.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Scrollable Body Box with Contrast-Safe Palette */}
                <div
                  className="max-h-48 overflow-y-auto rounded-xl p-4 mb-4 text-xs md:text-sm leading-7"
                  style={{
                    backgroundColor: displayedNotice.bodyBoxBg,
                    color: displayedNotice.bodyBoxText,
                    border: `1px solid ${displayedNotice.bodyBoxBorder}`,
                  }}
                  dangerouslySetInnerHTML={{ __html: displayedNotice.contentHtml }}
                />

                {/* Mandatory Agreement Checkbox with Contrast-Safe Palette */}
                {displayedNotice.requireCheckbox && (
                  <div className="mb-4">
                    <label
                      htmlFor="live-agree-checkbox-v2"
                      className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer select-none transition-all"
                      style={{
                        backgroundColor: displayedNotice.checkboxBoxBg,
                        color: displayedNotice.checkboxBoxText,
                        border: isChecked
                          ? `1.5px solid ${displayedNotice.primaryColor}`
                          : showError
                          ? '1.5px solid #dc2626'
                          : `1px solid ${displayedNotice.bodyBoxBorder}`,
                      }}
                    >
                      <input
                        id="live-agree-checkbox-v2"
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setIsChecked(e.target.checked);
                          if (e.target.checked) setShowError(false);
                        }}
                        className="w-5 h-5 mt-0.5 rounded cursor-pointer shrink-0"
                        style={{ accentColor: displayedNotice.primaryColor }}
                      />
                      <span
                        className="text-xs md:text-sm font-bold leading-relaxed"
                        style={{ color: displayedNotice.checkboxBoxText }}
                      >
                        {displayedNotice.checkboxLabel}
                      </span>
                    </label>

                    {showError && (
                      <div className="text-rose-500 bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-lg text-xs font-bold mt-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{displayedNotice.checkboxRequiredError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleAcceptClick}
                    disabled={remainingSeconds > 0}
                    className="flex-1 py-3 px-5 rounded-xl font-extrabold text-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: displayedNotice.primaryColor,
                      color: displayedNotice.buttonTextColor,
                      boxShadow: `0 10px 25px -5px ${displayedNotice.primaryColor}66`,
                    }}
                  >
                    {remainingSeconds > 0
                      ? `${displayedNotice.acceptButtonText} (${remainingSeconds} ثانیه)`
                      : displayedNotice.acceptButtonText}
                  </button>

                  {displayedNotice.secondaryButtonEnabled &&
                    displayedNotice.secondaryButtonText && (
                      <a
                        href={displayedNotice.secondaryButtonUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 py-3 px-4 rounded-xl text-xs md:text-sm font-bold transition-colors"
                        style={{
                          color: displayedNotice.textColor,
                          border: `1px solid ${displayedNotice.bodyBoxBorder}`,
                        }}
                      >
                        <span>{displayedNotice.secondaryButtonText}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-75" />
                      </a>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
