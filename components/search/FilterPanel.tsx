'use client'; // Клиент талд ажиллах компонент

import { SearchFilters } from '@/types/hotel'; // Хайлтын шүүлтүүрийн төрлийг импортлох
import { Language, useTranslation } from '@/lib/i18n'; // Орчуулгын функцийг импортлох
import { mockHotels } from '@/data/hotels'; // Туршилтын өгөгдлийг импортлох

// FilterPanel компонентийн пропсуудын төрлийг тодорхойлох
interface FilterPanelProps {
  filters: SearchFilters; // Хайлтын шүүлтүүрүүд
  onFilterChange: (filters: SearchFilters) => void; // Шүүлтүүр өөрчлөгдөх үед дуудагдах функц
  language: Language; // Сонгогдсон хэл
}

// FilterPanel компонент
export default function FilterPanel({
  filters,
  onFilterChange,
  language,
}: FilterPanelProps) {
  const t = useTranslation(language); // Орчуулгын хувьсагч

  // Хотуудын жагсаалтыг давхардалгүй авч эрэмбэлэх
  const cities = Array.from(new Set(mockHotels.map((h) => h.city))).sort();
  // Мужуудын жагсаалтыг давхардалгүй авч эрэмбэлэх
  const prefectures = Array.from(new Set(mockHotels.map((h) => h.prefecture))).sort();
  // Бүх тав тухыг давхардалгүй авч эрэмбэлэх
  const allAmenities = Array.from(
    new Set(mockHotels.flatMap((h) => h.amenities))
  ).sort();

  // Тав тухыг сонгох/болиулах функц
  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = filters.amenities || []; // Одоогийн сонгогдсон тав тух
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity) // Хэрэв сонгогдсон бол хасах
      : [...currentAmenities, amenity]; // Сонгогдоогүй бол нэмэх
    onFilterChange({ ...filters, amenities: newAmenities }); // Шүүлтүүрийг шинэчлэх
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4"> {/* Гаднах хүрээ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid бүтэц */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Хот шошго */}
            {t.city}
          </label>
          <select
            value={filters.city || ''} // Сонгогдсон хот
            onChange={(e) =>
              onFilterChange({ ...filters, city: e.target.value || undefined }) // Хот өөрчлөгдөх үед
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" // Загвар
          >
            <option value="">{t.allCities}</option> {/* Бүх хот сонголт */}
            {cities.map((city) => ( // Хотуудаар давтах
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Муж шошго */}
            {t.prefecture}
          </label>
          <select
            value={filters.prefecture || ''} // Сонгогдсон муж
            onChange={(e) =>
              onFilterChange({ ...filters, prefecture: e.target.value || undefined }) // Муж өөрчлөгдөх үед
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" // Загвар
          >
            <option value="">{t.selectPrefecture}</option> {/* Муж сонгох сонголт */}
            {prefectures.map((prefecture) => ( // Мужуудаар давтах
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Үнэлгээ шошго */}
            {t.minRating}
          </label>
          <select
            value={filters.minRating || ''} // Сонгогдсон үнэлгээ
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minRating: e.target.value ? parseFloat(e.target.value) : undefined, // Үнэлгээг тоонд хөрвүүлэх
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" // Загвар
          >
            <option value="">Any</option> {/* Дурын үнэлгээ */}
            <option value="4.0">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.7">4.7+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Доод үнэ шошго */}
            {t.price} (Min)
          </label>
          <input
            type="number" // Тоо оруулах
            value={filters.minPrice || ''} // Доод үнэ
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minPrice: e.target.value ? parseInt(e.target.value) : undefined, // Үнийг тоонд хөрвүүлэх
              })
            }
            placeholder="¥0" // Жишээ утга
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" // Загвар
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2"> {/* Дээд үнэ шошго */}
            {t.price} (Max)
          </label>
          <input
            type="number" // Тоо оруулах
            value={filters.maxPrice || ''} // Дээд үнэ
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxPrice: e.target.value ? parseInt(e.target.value) : undefined, // Үнийг тоонд хөрвүүлэх
              })
            }
            placeholder="¥100,000" // Жишээ утга
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" // Загвар
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3"> {/* Тав тух шошго */}
          {t.amenities}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2"> {/* Тав тухын жагсаалт */}
          {allAmenities.map((amenity) => ( // Бүх тав тухаар давтах
            <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox" // Checkbox
                checked={(filters.amenities || []).includes(amenity)} // Сонгогдсон эсэх
                onChange={() => handleAmenityToggle(amenity)} // Өөрчлөлтийг зохицуулах
                className="rounded text-primary-500 focus:ring-primary-500" // Загвар
              />
              <span className="text-sm text-gray-700">{amenity}</span> {/* Тав тухын нэр */}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
