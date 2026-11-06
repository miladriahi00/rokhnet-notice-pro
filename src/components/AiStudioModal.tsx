import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Image as ImageIcon,
  Send,
  Sparkles,
  CheckCircle2,
  Loader2,
  Wand2,
  Trash2,
} from 'lucide-react';
import { NoticeItem } from '../types/plugin';

interface AiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNotice: NoticeItem;
  onUpdateActiveNotice: (partial: Partial<NoticeItem>) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

const AI_ROLES = [
  {
    id: 'legal_expert',
    label: 'مشاور حقوقی و قوانین تجارت الکترونیک',
    instruction:
      'شما مشاور حقوقی ارشد در زمینه قوانین سایت‌های وردپرسی و فروشگاه‌های اینترنتی ووکامرس در ایران هستید. متن‌های رسمی، دقیق، شفاف و معتبر برای پاپ‌آپ تعهدنامه و اطلاعیه سایت رخ‌نت (توسعه یافته توسط میلاد ریاحی) بنویسید. پاسخ را به زبان فارسی روان و ساختاریافته ارائه دهید.',
  },
  {
    id: 'woo_copywriter',
    label: 'متخصص کپی‌رایتینگ و کمپین‌های ووکامرس',
    instruction:
      'شما متخصص بازاریابی و تجربه کاربری فروشگاه‌های ووکامرس هستید. متن‌های جذاب، محترمانه و متقاعدکننده برای اطلاعیه‌های مشتریان، شرایط ارسال، جشنواره فروش و قوانین خرید بنویسید.',
  },
  {
    id: 'wp_architect',
    label: 'معمار ارشد وردپرس ۷.۱ و PHP 8.1',
    instruction:
      'شما مهندس ارشد وردپرس ۷.۱ و ووکامرس ۱۱.۱ هستید و به سوالات فنی، کدهای CSS سفارشی و هوک‌های وردپرس برای افزونه RokhNet Notice Pro v2.0 پاسخ دقیق می‌دهید.',
  },
];

export const AiStudioModal: React.FC<AiStudioModalProps> = ({
  isOpen,
  onClose,
  activeNotice,
  onUpdateActiveNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');

  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'
  >('gemini-3.8-flash');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('legal_expert');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'سلام مهندس ریاحی عزیز! من دستیار هوشمند افزونه RokhNet Notice Pro v2.0 هستم. هر متنی که تولید کنم را می‌توانید با یک کلیک روی اطلاعیه در حال ویرایش اعمال کنید.',
      timestamp: 'اکنون',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [imagePrompt, setImagePrompt] = useState<string>(
    'A modern sleek abstract cybersecurity and legal trust banner with glowing blue glassmorphism shield icon on dark navy background, minimal luxury digital art'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '4:3'>('16:9');
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>(
    activeNotice.bannerImageUrl || ''
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [appliedNoticeToast, setAppliedNoticeToast] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const currentRole = AI_ROLES.find((r) => r.id === selectedRoleId) || AI_ROLES[0];

  const handleSendChat = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? chatInput).trim();
    if (!textToSend || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!customPrompt) setChatInput('');
    setIsSendingChat(true);
    setChatError(null);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          systemInstruction: currentRole.instruction,
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'خطا در ارتباط با سرور هوش مصنوعی');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: data.reply || 'پاسخی دریافت نشد.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setChatError(err.message || 'خطا در دریافت پاسخ');
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleApplyMessageToPopup = (content: string) => {
    const formattedHtml = content
      .split('\n\n')
      .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
      .join('');
    onUpdateActiveNotice({ contentHtml: formattedHtml });
    setAppliedNoticeToast(
      `متن پیشنهادی در اطلاعیه «${activeNotice.internalName}» قرار گرفت!`
    );
    setTimeout(() => setAppliedNoticeToast(null), 3000);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const response = await fetch('/api/gemini/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          size: imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'خطا در تولید تصویر با مدل gemini-3-pro-image-preview');
      }

      setGeneratedImageUrl(data.imageUrl);
    } catch (err: any) {
      setImageError(err.message || 'خطا در تولید تصویر');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSetAsPopupBanner = () => {
    if (!generatedImageUrl) return;
    onUpdateActiveNotice({ bannerImageUrl: generatedImageUrl });
    setAppliedNoticeToast(
      `تصویر تولید شده به عنوان بنر «${activeNotice.internalName}» تنظیم شد!`
    );
    setTimeout(() => setAppliedNoticeToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl h-[85vh] bg-[#0b101e] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#111827] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                استودیو هوش مصنوعی رخ‌نت (اعمال روی: {activeNotice.internalName})
              </h2>
              <p className="text-xs text-slate-400">
                تولید متن‌های حقوقی و فروشگاهی پاپ‌آپ + طراحی بنر اختصاصی با کیفیت 1K / 2K / 4K
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>چت‌بات نویسنده اطلاعیه</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'image'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>ساخت بنر پاپ‌آپ (1K/2K/4K)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {appliedNoticeToast && (
          <div className="px-6 py-2.5 bg-emerald-600/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{appliedNoticeToast}</span>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-[#0d1424] border-b border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  نقش تخصصی دستیار (System Role):
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {AI_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  انتخاب مدل پردازشی Gemini:
                </label>
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedModel === 'gemini-3.1-flash-lite'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    سریع (3.1 Flash Lite)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-3.8-flash')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedModel === 'gemini-3.8-flash'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    متعادل (3.8 Flash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-4-argon')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      selectedModel === 'gemini-4-argon'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    پیشرفته (4 Argon)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-[#090e1a] border-b border-slate-800/80">
              <span className="text-[11px] text-slate-400">درخواست‌های آماده:</span>
              <button
                type="button"
                onClick={() =>
                  handleSendChat(
                    'یک متن رسمی و حقوقی ۳ بندی برای پاپ‌آپ تایید قوانین خرید از فروشگاه ووکامرس رخ‌نت بنویس.'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                نگارش قوانین خرید ووکامرس
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendChat(
                    'یک اطلاعیه جذاب برای تغییر زمان‌بندی ارسال سفارش‌ها و پشتیبانی تلفنی 09133062388 بنویس.'
                  )
                }
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                اطلاعیه زمان‌بندی ارسال
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs md:text-sm leading-7 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] opacity-75">
                      <span>{msg.role === 'user' ? 'شما' : `هوش مصنوعی (${msg.modelUsed})`}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.role === 'model' && msg.id !== 'welcome-1' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleApplyMessageToPopup(msg.content)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>اعمال مستقیم در این پاپ‌آپ</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSendingChat && (
                <div className="flex items-center gap-2 text-xs text-blue-400 p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال نگارش پاسخ با مدل {selectedModel}...</span>
                </div>
              )}

              {chatError && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                  {chatError}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#111827] border-t border-slate-800 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      role: 'model',
                      content: 'تاریخچه گفتگو پاک شد. چطور می‌توانم کمکتان کنم؟',
                      timestamp: 'اکنون',
                      modelUsed: selectedModel,
                    },
                  ])
                }
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="پاک کردن تاریخچه"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="موضوع اطلاعیه یا سوال خود را بنویسید..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => handleSendChat()}
                disabled={isSendingChat || !chatInput.trim()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    توصیف بنر پاپ‌آپ (با مدل gemini-3-pro-image-preview):
                  </label>
                  <textarea
                    rows={4}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      رزولوشن تصویر (Image Size):
                    </label>
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                      {(['1K', '2K', '4K'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setImageSize(sz)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            imageSize === sz
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      نسبت ابعاد بنر:
                    </label>
                    <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                      {(['16:9', '4:3', '1:1'] as const).map((ar) => (
                        <button
                          key={ar}
                          type="button"
                          onClick={() => setAspectRatio(ar)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            aspectRatio === ar
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال رندر تصویر {imageSize}...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>تولید بنر اختصاصی با کیفیت {imageSize}</span>
                    </>
                  )}
                </button>

                {imageError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs leading-relaxed">
                    {imageError}
                  </div>
                )}
              </div>

              <div className="md:col-span-6 flex flex-col justify-between p-4 rounded-2xl bg-slate-900/70 border border-slate-800 min-h-[280px]">
                {generatedImageUrl ? (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-slate-700 bg-black">
                      <img
                        src={generatedImageUrl}
                        alt="Generated Popup Banner"
                        className="w-full h-56 object-cover block"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSetAsPopupBanner}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        قرار دادن به عنوان بنر این پاپ‌آپ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGeneratedImageUrl('');
                          onUpdateActiveNotice({ bannerImageUrl: '' });
                        }}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        حذف بنر
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <ImageIcon className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-xs leading-relaxed">
                      رزولوشن دلخواه (1K، 2K یا 4K) را انتخاب کرده و دکمه تولید بنر را بزنید.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
