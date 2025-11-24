'use client'; // Клиент талд ажиллах компонент

import { Language } from '@/lib/i18n'; // Хэлний төрлийг импортлох

// Header компонентийн пропсуудын төрлийг тодорхойлох
interface HeaderProps {
  language: Language; // Сонгогдсон хэл
  onLanguageChange: (lang: Language) => void; // Хэл солих функц
}

// Header компонент
export default function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="bg-white shadow-md border-b border-gray-200"> {/* Толгой хэсгийн загвар */}
      <div className="container mx-auto px-4 py-5"> {/* Агуулгын хэсэг */}
        <div className="flex items-center justify-between"> {/* Зүүн ба баруун хэсгийг тусгаарлах */}
          <div className="flex items-center space-x-3"> {/* Лого болон нэр */}
            <div>
              <h1 className="text-2xl font-bold text-blue-800">
                JapanStay {/* Сайтын нэр */}
              </h1>
              <p className="text-xs text-gray-500">Powered by Rakuten Travel</p> {/* Тайлбар */}
            </div>
          </div>

          <div className="flex items-center space-x-3"> {/* Хэл солих товчлуурууд */}
            <span className="text-sm font-medium text-gray-700 mr-1">Language:</span>
            <button
              onClick={() => onLanguageChange('en')} // Англи хэл сонгох
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${language === 'en'
                ? 'bg-blue-600 text-white shadow-md' // Идэвхтэй үеийн загвар
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Идэвхгүй үеийн загвар
                }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('mn')} // Монгол хэл сонгох
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${language === 'mn'
                ? 'bg-blue-600 text-white shadow-md' // Идэвхтэй үеийн загвар
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Идэвхгүй үеийн загвар
                }`}
            >
              MN
            </button>
            <button
              onClick={() => onLanguageChange('jp')} // Япон хэл сонгох
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${language === 'jp'
                ? 'bg-blue-600 text-white shadow-md' // Идэвхтэй үеийн загвар
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Идэвхгүй үеийн загвар
                }`}
            >
              JP
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
