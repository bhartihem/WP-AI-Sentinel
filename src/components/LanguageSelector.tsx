import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { Languages, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const LanguageSelector = ({ className }: { className?: string }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [, setTick] = React.useState(0);

  const currentLangCode = (i18n.language || 'en').split('-')[0];
  const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === currentLangCode) || SUPPORTED_LANGUAGES[0];

  const changeLanguage = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      try {
        localStorage.setItem('i18nextLng', code);
      } catch (e) {
        console.warn('LocalStorage not available for language persistence');
      }
      setTick(t => t + 1); // Force re-render
    } catch (err) {
      console.error('Failed to change language:', err);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-all w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-blue-400" />
          <span>{currentLanguage.native}</span>
        </div>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto">
            <div className="p-2 border-bottom border-zinc-800 bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3">
              {t('select_lang')}
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs hover:bg-zinc-800 transition-all flex items-center justify-between",
                  (i18n.language || '').split('-')[0] === lang.code ? "text-blue-400 bg-blue-400/5" : "text-zinc-400"
                )}
              >
                <span>{lang.native}</span>
                <span className="text-[10px] opacity-40">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
