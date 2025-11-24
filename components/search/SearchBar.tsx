'use client'; // Клиент талд ажиллах компонент

import { SearchFilters } from '@/types/hotel'; // Хайлтын шүүлтүүрийн төрлийг импортлох
import { Language, useTranslation } from '@/lib/i18n'; // Орчуулгын функцийг импортлох
import { RAKUTEN_AREAS } from '@/lib/api/rakuten'; // Rakuten-ийн бүс нутгийн мэдээллийг импортлох

// SearchBar компонентийн пропсуудын төрлийг тодорхойлох
interface SearchBarProps {
  filters: SearchFilters; // Хайлтын шүүлтүүрүүд
  onFilterChange: (filters: SearchFilters) => void; // Шүүлтүүр өөрчлөгдөх үед дуудагдах функц
  language: Language; // Сонгогдсон хэл
  onToggleFilters: () => void; // Шүүлтүүрийг харуулах/нуух функц
  onCityChange: (cityKey: string) => void; // Хот өөрчлөгдөх үед дуудагдах функц
  selectedCity: string; // Сонгогдсон хот
}

// SearchBar компонент
export default function SearchBar({
  filters,
  onFilterChange,
  language,
  onToggleFilters,
  onCityChange,
  selectedCity,
}: SearchBarProps) {
  const t = useTranslation(language); // Орчуулгын хувьсагч

  // Хотын нэрийг хэлнээс хамаарч авах функц
  const getCityName = (key: string) => {
    const area = RAKUTEN_AREAS[key as keyof typeof RAKUTEN_AREAS]; // Бүс нутгийн мэдээллийг авах
    if (language === 'jp') return area.nameJp; // Япон хэлээр буцаах
    if (language === 'mn') return area.nameMn; // Монгол хэлээр буцаах
    return area.name; // Англи хэлээр буцаах
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6"> {/* Гаднах хүрээ */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4"> {/* Grid бүтэц */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Очих газар шошго */}
            {t.destination}
          </label>
          <select
            value={selectedCity} // Сонгогдсон утга
            onChange={(e) => onCityChange(e.target.value)} // Өөрчлөлтийг зохицуулах
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" // Загвар
          >
            {Object.keys(RAKUTEN_AREAS).map((key) => ( // Бүх бүс нутгаар давтах
              <option key={key} value={key}>
                {getCityName(key)} {/* Хотын нэр */}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Ирэх өдөр шошго */}
            {t.checkIn}
          </label>
          <input
            type="date" // Огноо сонгох төрөл
            value={filters.checkIn || ''} // Утга
            onChange={(e) =>
              onFilterChange({ ...filters, checkIn: e.target.value }) // Шүүлтүүрийг шинэчлэх
            }
            min={new Date().toISOString().split('T')[0]} // Өнөөдрөөс өмнөх өдрийг сонгохгүй
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Загвар
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Гарах өдөр шошго */}
            {t.checkOut}
          </label>
          <input
            type="date" // Огноо сонгох төрөл
            value={filters.checkOut || ''} // Утга
            onChange={(e) =>
              onFilterChange({ ...filters, checkOut: e.target.value }) // Шүүлтүүрийг шинэчлэх
            }
            min={filters.checkIn || new Date().toISOString().split('T')[0]} // Ирэх өдрөөс өмнөх өдрийг сонгохгүй
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Загвар
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Зочид шошго */}
            {t.guests}
          </label>
          <input
            type="number" // Тоо сонгох төрөл
            min="1" // Хамгийн багадаа 1
            max="10" // Хамгийн ихдээ 10
            value={filters.guests || 1} // Утга
            onChange={(e) =>
              onFilterChange({ ...filters, guests: parseInt(e.target.value) }) // Шүүлтүүрийг шинэчлэх
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" // Загвар
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onToggleFilters} // Шүүлтүүрийг нээх/хаах
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105" // Загвар (градиентгүй)
          >
            🔍 {t.filters} {/* Товчлуурын текст */}
          </button>
        </div>
      </div>
    </div>
  );
}
