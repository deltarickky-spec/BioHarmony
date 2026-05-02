import { Globe } from "lucide-react";
import { LANGUAGES, useLanguage, type Language } from "@/contexts/LanguageContext";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-[#BFA14A]/60 shrink-0" />
      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`
              text-xs px-3 py-1.5 rounded-full border transition-all duration-200
              ${language === lang.code
                ? "bg-[#BFA14A]/15 border-[#BFA14A]/50 text-[#BFA14A] font-medium"
                : "border-white/10 text-[#F4EFE6]/40 hover:border-white/20 hover:text-[#F4EFE6]/65"
              }
            `}
            aria-pressed={language === lang.code}
            title={lang.label}
          >
            {compact ? lang.code.toUpperCase() : lang.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
