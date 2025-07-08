import { useSetLocale, useLocale } from "react-admin";
import { useState, useRef, useEffect } from "react";
import { LanguageIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const TailwindLanguageSwitcher = () => {
  const setLocale = useSetLocale();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const currentLanguage = locale === "en" ? "English" : "Français";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <LanguageIcon className="w-5 h-5" />
        <span className="text-sm font-medium">{currentLanguage}</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-gray-50 ${
              locale === "en" 
                ? "text-project-green-800 bg-project-green-50 font-medium" 
                : "text-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>English</span>
              {locale === "en" && (
                <div className="w-2 h-2 bg-project-green-800 rounded-full"></div>
              )}
            </div>
          </button>
          
          <button
            onClick={() => handleLanguageChange("fr")}
            className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-gray-50 ${
              locale === "fr" 
                ? "text-project-green-800 bg-project-green-50 font-medium" 
                : "text-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Français</span>
              {locale === "fr" && (
                <div className="w-2 h-2 bg-project-green-800 rounded-full"></div>
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
