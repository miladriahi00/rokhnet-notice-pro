export type PopupStylePreset =
  | 'glassmorphism'
  | 'luxury-dark'
  | 'corporate-minimal'
  | 'cyber-neon'
  | 'woo-checkout'
  | 'emerald-light';

export type PopupPosition =
  | 'center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-sheet';

export type PopupAnimation =
  | 'zoom-bounce'
  | 'fade-up'
  | 'slide-side';

export type DisplayTargetMode =
  | 'all_pages'
  | 'homepage_only'
  | 'woo_all'
  | 'woo_shop_product'
  | 'woo_checkout_cart'
  | 'custom_selection';

export type StorageMethod =
  | 'cookie_localstorage'
  | 'session_only';

export interface StylePalette {
  primaryColor: string;
  buttonTextColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  subtitleColor: string;
  bodyBoxBg: string;
  bodyBoxText: string;
  bodyBoxBorder: string;
  checkboxBoxBg: string;
  checkboxBoxText: string;
}

export interface StylePresetInfo {
  id: PopupStylePreset;
  name: string;
  tagline: string;
  isLight: boolean;
  palette: StylePalette;
}

export const STYLE_PRESETS: StylePresetInfo[] = [
  {
    id: 'glassmorphism',
    name: 'شیشه‌ای کریستالی تیره (Glassmorphism)',
    tagline: 'پس‌زمینه بلورین سرمه‌ای با متن سفید درخشان و کنتراست عالی',
    isLight: false,
    palette: {
      primaryColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      accentColor: '#60a5fa',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      subtitleColor: '#cbd5e1',
      bodyBoxBg: '#1e293b',
      bodyBoxText: '#f1f5f9',
      bodyBoxBorder: '#334155',
      checkboxBoxBg: '#172554',
      checkboxBoxText: '#eff6ff',
    },
  },
  {
    id: 'corporate-minimal',
    name: 'مینیمال روشن رسمی (Corporate Light)',
    tagline: 'پوسته سفید، تمیز و رسمی با متون تیره بسیار خوانا ویژه قوانین و تعهدنامه‌ها',
    isLight: true,
    palette: {
      primaryColor: '#2563eb',
      buttonTextColor: '#ffffff',
      accentColor: '#1d4ed8',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      subtitleColor: '#475569',
      bodyBoxBg: '#f8fafc',
      bodyBoxText: '#1e293b',
      bodyBoxBorder: '#e2e8f0',
      checkboxBoxBg: '#eff6ff',
      checkboxBoxText: '#0f172a',
    },
  },
  {
    id: 'luxury-dark',
    name: 'دارک رویال طلایی (Luxury Gold)',
    tagline: 'ترکیب مشکی سنگی و طلایی سلطنتی با متن دکمه تیره جهت خوانایی ۱۰۰٪',
    isLight: false,
    palette: {
      primaryColor: '#eab308',
      buttonTextColor: '#09090b',
      accentColor: '#facc15',
      backgroundColor: '#09090b',
      textColor: '#fafafa',
      subtitleColor: '#d4d4d8',
      bodyBoxBg: '#18181b',
      bodyBoxText: '#f4f4f5',
      bodyBoxBorder: '#3f3f46',
      checkboxBoxBg: '#272009',
      checkboxBoxText: '#fef9c3',
    },
  },
  {
    id: 'woo-checkout',
    name: 'فروشگاهی ووکامرس روشن (WooCommerce Clean)',
    tagline: 'هماهنگ با برگه‌های محصول و تسویه‌حساب ووکامرس با خوانایی بالا',
    isLight: true,
    palette: {
      primaryColor: '#7c3aed',
      buttonTextColor: '#ffffff',
      accentColor: '#6d28d9',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      subtitleColor: '#4b5563',
      bodyBoxBg: '#f5f3ff',
      bodyBoxText: '#1f2937',
      bodyBoxBorder: '#ddd6fe',
      checkboxBoxBg: '#ede9fe',
      checkboxBoxText: '#1e1b4b',
    },
  },
  {
    id: 'cyber-neon',
    name: 'هشدار زمردی تیره (Cyber Emerald)',
    tagline: 'کنتراست بالا با حاشیه سبز نئونی ویژه اطلاعیه‌های فنی و فوری',
    isLight: false,
    palette: {
      primaryColor: '#10b981',
      buttonTextColor: '#022c22',
      accentColor: '#34d399',
      backgroundColor: '#041318',
      textColor: '#ecfdf5',
      subtitleColor: '#a7f3d0',
      bodyBoxBg: '#062229',
      bodyBoxText: '#e2f8f0',
      bodyBoxBorder: '#0f4c5c',
      checkboxBoxBg: '#063229',
      checkboxBoxText: '#d1fae5',
    },
  },
  {
    id: 'emerald-light',
    name: 'سبز مدرن روشن (Fresh Trust Light)',
    tagline: 'زمینه سفید با هایلایت سبز اعتمادبخش و خوانایی فوق‌العاده در موبایل و دسکتاپ',
    isLight: true,
    palette: {
      primaryColor: '#059669',
      buttonTextColor: '#ffffff',
      accentColor: '#047857',
      backgroundColor: '#ffffff',
      textColor: '#064e3b',
      subtitleColor: '#374151',
      bodyBoxBg: '#f0fdf4',
      bodyBoxText: '#111827',
      bodyBoxBorder: '#bbf7d0',
      checkboxBoxBg: '#ecfdf5',
      checkboxBoxText: '#064e3b',
    },
  },
];

export interface NoticeItem {
  id: string;
  internalName: string;
  enabled: boolean;
  priority: number;
  noticeVersion: string;

  // Header Element Visibility Toggles
  showIcon: boolean;
  iconType: 'shield' | 'bell' | 'alert' | 'sparkles' | 'check' | 'cart';
  showBadge: boolean;
  badgeText: string;
  showTitle: boolean;
  title: string;
  showSubtitle: boolean;
  subtitle: string;

  // Body & Controls
  contentHtml: string;
  requireCheckbox: boolean;
  checkboxLabel: string;
  checkboxRequiredError: string;
  acceptButtonText: string;
  secondaryButtonEnabled: boolean;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  bannerImageUrl: string;

  // Style & Contrast-Safe Colors
  stylePreset: PopupStylePreset;
  inheritThemeFont: boolean;
  position: PopupPosition;
  animation: PopupAnimation;
  widthPx: number;
  borderRadiusPx: number;
  backdropBlurPx: number;
  overlayOpacity: number;
  primaryColor: string;
  buttonTextColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  subtitleColor: string;
  bodyBoxBg: string;
  bodyBoxText: string;
  bodyBoxBorder: string;
  checkboxBoxBg: string;
  checkboxBoxText: string;
  customCss: string;

  // Behavior & Locks
  countdownSeconds: number;
  preventCloseOnBackdrop: boolean;
  preventEscapeKey: boolean;
  hideCloseButton: boolean;

  // Page Targeting & Conditional Loading (Zero-Speed Impact)
  displayTarget: DisplayTargetMode;
  targetWooPages: {
    shop: boolean;
    product: boolean;
    productCategory: boolean;
    cart: boolean;
    checkout: boolean;
    account: boolean;
  };
  includePageIdsOrUrls: string;
  excludePageIdsOrUrls: string;
  targetUserRoles: 'all' | 'guests_only' | 'logged_in_only';

  // Trigger & Lightweight Browser Persistence (Zero DB Bloat)
  triggerType: 'immediate' | 'delay' | 'scroll' | 'exit_intent';
  delaySeconds: number;
  scrollPercentage: number;
  storageMethod: StorageMethod;
  cookieExpireDays: number;
}

export interface PluginConfig {
  pluginVersion: string;
  developerName: string;
  developerPhone: string;
  developerUrl: string;
  wpVersion: string;
  wcVersion: string;
  phpVersion: string;
  queueMode: 'priority_sequential' | 'highest_only';
  notices: NoticeItem[];
}

export const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'notice-main-terms',
    internalName: 'تعهدنامه عمومی قوانین سایت',
    enabled: true,
    priority: 1,
    noticeVersion: '2.0.1',
    showIcon: true,
    iconType: 'shield',
    showBadge: true,
    badgeText: 'اطلاعیه رسمی و الزامی',
    showTitle: true,
    title: 'بروزرسانی قوانین و شرایط استفاده از خدمات وبسایت',
    showSubtitle: true,
    subtitle: 'لطفاً پیش از ادامه فعالیت در سایت، موارد زیر را به دقت مطالعه و تایید فرمایید',
    contentHtml: `<p>کاربر گرامی، ضمن خوش‌آمدگویی به وبسایت <strong>رخ‌نت (RokhNet)</strong>، جهت ارتقای کیفیت خدمات و امنیت کاربری، قوانین زیر لازم‌الاجرا می‌باشد:</p>
<ul>
  <li>تمامی خدمات و محصولات ارائه شده در سایت تابع قوانین تجارت الکترونیک می‌باشد.</li>
  <li>مسئولیت حفظ اطلاعات حساب کاربری و صحت اطلاعات ثبت شده بر عهده کاربر محترم است.</li>
  <li>فونت این پاپ‌آپ به صورت خودکار از قالب وردپرس شما ارث‌بری می‌شود و هیچ بار اضافی روی سایت ندارد.</li>
</ul>`,
    requireCheckbox: true,
    checkboxLabel: 'متن اطلاعیه را خواندم و متوجه شدم و تمامی شرایط را می‌پذیرم.',
    checkboxRequiredError: 'لطفاً ابتدا تیک «متن اطلاعیه را خواندم و متوجه شدم» را فعال نمایید.',
    acceptButtonText: 'تایید و ادامه مشاهده سایت',
    secondaryButtonEnabled: true,
    secondaryButtonText: 'مشاهده کامل قوانین',
    secondaryButtonUrl: 'https://rokhnet.com/terms',
    bannerImageUrl: '',
    stylePreset: 'corporate-minimal',
    inheritThemeFont: true,
    position: 'center',
    animation: 'zoom-bounce',
    widthPx: 540,
    borderRadiusPx: 20,
    backdropBlurPx: 10,
    overlayOpacity: 70,
    ...STYLE_PRESETS[1].palette,
    customCss: '',
    countdownSeconds: 0,
    preventCloseOnBackdrop: true,
    preventEscapeKey: true,
    hideCloseButton: true,
    displayTarget: 'all_pages',
    targetWooPages: {
      shop: true,
      product: true,
      productCategory: true,
      cart: false,
      checkout: false,
      account: true,
    },
    includePageIdsOrUrls: '',
    excludePageIdsOrUrls: '/wp-login.php',
    targetUserRoles: 'all',
    triggerType: 'immediate',
    delaySeconds: 1,
    scrollPercentage: 25,
    storageMethod: 'cookie_localstorage',
    cookieExpireDays: 30,
  },
  {
    id: 'notice-woo-checkout',
    internalName: 'تاییدیه شرایط ارسال در تسویه‌حساب ووکامرس',
    enabled: true,
    priority: 2,
    noticeVersion: '2.0.1',
    showIcon: true,
    iconType: 'cart',
    showBadge: true,
    badgeText: 'ویژه خریداران محترم ووکامرس',
    showTitle: true,
    title: 'شرایط پردازش، بسته‌بندی و ارسال سفارشات',
    showSubtitle: true,
    subtitle: 'پیش از پرداخت نهایی صورتحساب، لطفاً زمان‌بندی ارسال را تایید فرمایید',
    contentHtml: `<p>مشتری گرامی، از خرید شما سپاسگزاریم. لطفاً پیش از ثبت نهایی سفارش به نکات زیر دقت فرمایید:</p>
<ul>
  <li>سفارش‌های ثبت شده قبل از ساعت ۱۴ در همان روز کاری پردازش و تحویل پست می‌گردند.</li>
  <li>کد رهگیری پستی بلافاصله پس از ارسال از طریق پیامک برای شما ارسال خواهد شد.</li>
  <li>درج دقیق کد پستی ۱۰ رقمی و شماره موبایل در فرم تسویه‌حساب الزامی است.</li>
</ul>`,
    requireCheckbox: true,
    checkboxLabel: 'شرایط ارسال و قوانین خرید را خواندم و متوجه شدم.',
    checkboxRequiredError: 'برای ادامه فرآیند خرید، تیک تایید شرایط ارسال الزامی است.',
    acceptButtonText: 'می‌پذیرم و ادامه پرداخت',
    secondaryButtonEnabled: false,
    secondaryButtonText: 'راهنمای ارسال',
    secondaryButtonUrl: 'https://rokhnet.com/shipping',
    bannerImageUrl: '',
    stylePreset: 'glassmorphism',
    inheritThemeFont: true,
    position: 'center',
    animation: 'zoom-bounce',
    widthPx: 520,
    borderRadiusPx: 20,
    backdropBlurPx: 14,
    overlayOpacity: 75,
    ...STYLE_PRESETS[0].palette,
    customCss: '',
    countdownSeconds: 0,
    preventCloseOnBackdrop: true,
    preventEscapeKey: true,
    hideCloseButton: true,
    displayTarget: 'woo_checkout_cart',
    targetWooPages: {
      shop: false,
      product: false,
      productCategory: false,
      cart: true,
      checkout: true,
      account: false,
    },
    includePageIdsOrUrls: '/checkout\n/cart',
    excludePageIdsOrUrls: '',
    targetUserRoles: 'all',
    triggerType: 'immediate',
    delaySeconds: 1,
    scrollPercentage: 20,
    storageMethod: 'cookie_localstorage',
    cookieExpireDays: 7,
  },
];

export const DEFAULT_PLUGIN_CONFIG: PluginConfig = {
  pluginVersion: '2.0.0',
  developerName: 'میلاد ریاحی',
  developerPhone: '09133062388',
  developerUrl: 'https://rokhnet.com',
  wpVersion: '7.1',
  wcVersion: '11.1',
  phpVersion: '8.1',
  queueMode: 'priority_sequential',
  notices: DEFAULT_NOTICES,
};

export interface QuickContentTemplate {
  id: string;
  name: string;
  badgeText: string;
  title: string;
  subtitle: string;
  contentHtml: string;
  checkboxLabel: string;
  acceptButtonText: string;
  iconType: NoticeItem['iconType'];
  stylePreset: PopupStylePreset;
  displayTarget: DisplayTargetMode;
}

export const QUICK_CONTENT_TEMPLATES: QuickContentTemplate[] = [
  {
    id: 'terms-update',
    name: 'تعهدنامه قوانین خرید ووکامرس',
    badgeText: 'الزامی پیش از ثبت سفارش',
    title: 'شرایط و ضوابط خرید آنلاین و ارسال سفارشات',
    subtitle: 'جهت نهایی‌سازی خرید، مطالعه و تایید بندهای زیر الزامی است',
    contentHtml: `<p>مشتری گرامی، از اعتماد شما سپاسگزاریم. لطفاً پیش از ثبت سفارش به نکات زیر توجه فرمایید:</p>
<ul>
  <li>ارسال سفارشات تهران ظرف ۲۴ ساعت و شهرستان‌ها طی ۷۲ ساعت کاری انجام می‌شود.</li>
  <li>مهلت تست سلامت فیزیکی کالا تا ۷ روز پس از تحویل مرسوله معتبر است.</li>
  <li>در صورت مغایرت مشخصات، بازگشت وجه بدون کسر جریمه انجام خواهد شد.</li>
</ul>`,
    checkboxLabel: 'متن اطلاعیه و قوانین خرید را خواندم و متوجه شدم.',
    acceptButtonText: 'می‌پذیرم و ادامه خرید',
    iconType: 'cart',
    stylePreset: 'woo-checkout',
    displayTarget: 'woo_checkout_cart',
  },
  {
    id: 'corporate-legal',
    name: 'تعهدنامه رسمی با تم روشن و خوانا',
    badgeText: 'بیانیه رسمی وبسایت',
    title: 'قوانین بهره‌برداری از خدمات و سلب مسئولیت',
    subtitle: 'مطالعه این اطلاعیه برای کلیه کاربران سایت الزامی می‌باشد',
    contentHtml: `<p>کاربر گرامی، استفاده از خدمات این وبسایت به منزله پذیرش کامل شرایط زیر است:</p>
<ul>
  <li>کلیه حقوق مادی و معنوی محتوا متعلق به وبسایت رخ‌نت می‌باشد.</li>
  <li>هرگونه کپی‌برداری یا انتشار غیرمجاز پیگرد قانونی دارد.</li>
</ul>`,
    checkboxLabel: 'متن اطلاعیه رسمی را خواندم و متوجه شدم.',
    acceptButtonText: 'تایید تعهدنامه و ورود',
    iconType: 'shield',
    stylePreset: 'corporate-minimal',
    displayTarget: 'all_pages',
  },
  {
    id: 'vip-gold-notice',
    name: 'اطلاعیه ویژه مشتریان VIP (دارک طلایی)',
    badgeText: 'اطلاعیه ویژه باشگاه مشتریان',
    title: 'شرایط جدید خدمات اختصاصی و پشتیبانی VIP',
    subtitle: 'ارتقای سطح خدمات پشتیبانی برای اعضای ویژه سایت',
    contentHtml: `<p>همراهان گرامی <strong>رخ‌نت</strong>، سرویس‌های ویژه پشتیبانی و تحویل فوری برای حساب‌های کاربری فعال گردید.</p>
<p>جهت هماهنگی مستقیم می‌توانید با شماره <strong>09133062388</strong> در ارتباط باشید.</p>`,
    checkboxLabel: 'متن اطلاعیه ویژه را خواندم و متوجه شدم.',
    acceptButtonText: 'متوجه شدم، ادامه',
    iconType: 'sparkles',
    stylePreset: 'luxury-dark',
    displayTarget: 'homepage_only',
  },
  {
    id: 'server-alert',
    name: 'اطلاعیه فنی و بروزرسانی سیستم',
    badgeText: 'اطلاعیه واحد فنی',
    title: 'ارتقای زیرساخت و افزایش سرعت بارگذاری سایت',
    subtitle: 'تغییرات جدید با موفقیت روی سرورهای اصلی اعمال شد',
    contentHtml: `<p>به اطلاع کاربران گرامی می‌رساند زیرساخت سایت به نسخه جدید ارتقا یافته است.</p>
<ul>
  <li>در صورت مشاهده کش قدیمی، یک بار کلیدهای Ctrl + F5 را بفشارید.</li>
  <li>تمامی سفارش‌ها و دانلودها با بالاترین سرعت فعال هستند.</li>
</ul>`,
    checkboxLabel: 'متن اطلاعیه فنی را خواندم و متوجه شدم.',
    acceptButtonText: 'تایید و ادامه',
    iconType: 'bell',
    stylePreset: 'cyber-neon',
    displayTarget: 'all_pages',
  },
];

export function createNewNoticeItem(index: number): NoticeItem {
  const defaultPreset = STYLE_PRESETS[1]; // corporate-minimal (high-contrast light)
  return {
    id: `notice-${Date.now()}`,
    internalName: `اطلاعیه شماره ${index}`,
    enabled: true,
    priority: index,
    noticeVersion: '2.0.0',
    showIcon: true,
    iconType: 'bell',
    showBadge: true,
    badgeText: 'اطلاعیه جدید سایت',
    showTitle: true,
    title: 'عنوان اطلاعیه جدید را وارد کنید',
    showSubtitle: true,
    subtitle: 'توضیح کوتاه زیرعنوان که در صورت تمایل قابل غیرفعال‌سازی است',
    contentHtml: `<p>متن اطلاعیه جدید خود را در این بخش بنویسید. شما می‌توانید برای این پاپ‌آپ استایل، رنگ‌بندی و صفحات نمایش کاملاً مجزا تعریف کنید.</p>`,
    requireCheckbox: true,
    checkboxLabel: 'متن اطلاعیه را خواندم و متوجه شدم.',
    checkboxRequiredError: 'لطفاً ابتدا تیک «متن اطلاعیه را خواندم و متوجه شدم» را بزنید.',
    acceptButtonText: 'تایید و ادامه',
    secondaryButtonEnabled: false,
    secondaryButtonText: 'اطلاعات بیشتر',
    secondaryButtonUrl: 'https://rokhnet.com',
    bannerImageUrl: '',
    stylePreset: defaultPreset.id,
    inheritThemeFont: true,
    position: 'center',
    animation: 'zoom-bounce',
    widthPx: 520,
    borderRadiusPx: 20,
    backdropBlurPx: 10,
    overlayOpacity: 70,
    ...defaultPreset.palette,
    customCss: '',
    countdownSeconds: 0,
    preventCloseOnBackdrop: true,
    preventEscapeKey: true,
    hideCloseButton: true,
    displayTarget: 'custom_selection',
    targetWooPages: {
      shop: false,
      product: false,
      productCategory: false,
      cart: false,
      checkout: false,
      account: false,
    },
    includePageIdsOrUrls: '/sample-page',
    excludePageIdsOrUrls: '',
    targetUserRoles: 'all',
    triggerType: 'immediate',
    delaySeconds: 1,
    scrollPercentage: 25,
    storageMethod: 'cookie_localstorage',
    cookieExpireDays: 30,
  };
}
