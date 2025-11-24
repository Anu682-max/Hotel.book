'use client'; // Клиент талд ажиллах компонент

import { useState, useEffect } from 'react'; // React-ийн хукуудыг импортлох
import { RAKUTEN_AREAS } from '@/lib/api/rakuten'; // Rakuten-ийн бүс нутгийн мэдээллийг импортлох
import { SearchFilters } from '@/types/hotel'; // Хайлтын шүүлтүүрийн төрлийг импортлох
import { Language, useTranslation } from '@/lib/i18n'; // Орчуулгын функцийг импортлох
import HotelCard from '@/components/hotels/HotelCard'; // Зочид буудлын картын компонентийг импортлох
import SearchBar from '@/components/search/SearchBar'; // Хайлтын талбарын компонентийг импортлох
import FilterPanel from '@/components/search/FilterPanel'; // Шүүлтүүрийн самбарын компонентийг импортлох
import Header from '@/components/Header'; // Толгой хэсгийн компонентийг импортлох
import { useHotelSearch } from '@/lib/hooks/useHotelSearch'; // Зочид буудал хайх хукийг импортлох

// Нүүр хуудасны компонент
export default function Home() {
  const [language, setLanguage] = useState<Language>('mn'); // Хэлний төлөв (анхдагч нь монгол)
  const [filters, setFilters] = useState<SearchFilters>({}); // Шүүлтүүрийн төлөв
  const [showFilters, setShowFilters] = useState(false); // Шүүлтүүр харуулах эсэх төлөв
  const [selectedCity, setSelectedCity] = useState('tokyo'); // Сонгогдсон хот (анхдагч нь Токио)
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all'); // Сонгогдсон үнийн хүрээ

  const { hotels, allHotels, loading, searchHotels } = useHotelSearch(); // Зочид буудал хайх хукийг ашиглах
  const t = useTranslation(language); // Орчуулгын хувьсагч

  // Rakuten Travel API-аас зочид буудлын мэдээллийг татах
  useEffect(() => {
    searchHotels(selectedCity, filters); // Хайлт хийх
  }, [selectedCity, filters.checkIn, filters.checkOut, filters.guests]); // Эдгээр утгууд өөрчлөгдөхөд дахин ажиллана

  // Хот өөрчлөгдөх үед дуудагдах функц
  const handleCityChange = (cityKey: string) => {
    setSelectedCity(cityKey); // Сонгогдсон хотыг шинэчлэх
  };

  // Үнийн хүрээгээр шүүх функц
  const getFilteredHotels = () => {
    let filtered = [...allHotels]; // Бүх зочид буудлыг хуулж авах

    // Үнийн хүрээгээр шүүх
    if (selectedPriceRange !== 'all') {
      const ranges: { [key: string]: [number, number] } = {
        '0-10000': [0, 10000],
        '10000-20000': [10000, 20000],
        '20000-30000': [20000, 30000],
        '30000-50000': [30000, 50000],
        '50000+': [50000, Infinity],
      };
      const [min, max] = ranges[selectedPriceRange] || [0, Infinity]; // Харгалзах min, max утгыг авах
      filtered = filtered.filter(h => h.price >= min && h.price <= max); // Шүүлт хийх
    }

    return filtered; // Шүүгдсэн жагсаалтыг буцаах
  };

  const displayedHotels = getFilteredHotels(); // Дэлгэцэд харуулах зочид буудлууд

  // Шүүлтүүр өөрчлөгдөх үед дуудагдах функц
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters); // Шүүлтүүрийг шинэчлэх
  };

  return (
    <div className="min-h-screen bg-gray-50"> {/* Үндсэн хүрээ */}
      <Header language={language} onLanguageChange={setLanguage} /> {/* Толгой хэсэг */}

      <main className="container mx-auto px-4 py-8"> {/* Үндсэн агуулга */}
        <div className="mb-8 text-center"> {/* Гарчиг хэсэг */}
          <h1 className="text-5xl font-bold text-blue-800 mb-3">
            {t.title} {/* Гарчиг */}
          </h1>
          <p className="text-xl text-gray-700">
            {t.subtitle} {/* Дэд гарчиг */}
          </p>
        </div>

        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          language={language}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onCityChange={handleCityChange}
          selectedCity={selectedCity}
        /> {/* Хайлтын хэсэг */}

        {/* Үнийн ангилалаар шүүх */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Price Range (JPY)</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPriceRange('all')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedPriceRange('0-10000')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === '0-10000'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ¥0 - ¥10,000
            </button>
            <button
              onClick={() => setSelectedPriceRange('10000-20000')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === '10000-20000'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ¥10,000 - ¥20,000
            </button>
            <button
              onClick={() => setSelectedPriceRange('20000-30000')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === '20000-30000'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ¥20,000 - ¥30,000
            </button>
            <button
              onClick={() => setSelectedPriceRange('30000-50000')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === '30000-50000'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ¥30,000 - ¥50,000
            </button>
            <button
              onClick={() => setSelectedPriceRange('50000+')}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedPriceRange === '50000+'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ¥50,000+
            </button>
          </div>
        </div>

        {showFilters && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            language={language}
          />
        )} {/* Шүүлтүүрийн самбар */}

        <div className="mt-8">
          {loading ? ( // Ачаалж байх үед
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-2xl font-semibold text-gray-800 mt-6">{t.loading}</p>
              <p className="text-md text-gray-600 mt-2">
                {RAKUTEN_AREAS[selectedCity as keyof typeof RAKUTEN_AREAS].name} {language === 'jp' && `(${RAKUTEN_AREAS[selectedCity as keyof typeof RAKUTEN_AREAS].nameJp})`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-lg font-semibold text-gray-800">
                  Нийт {displayedHotels.length} зочид буудал {/* Зочид буудлын тоо */}
                </p>
                <p className="text-sm text-gray-600">
                  {RAKUTEN_AREAS[selectedCity as keyof typeof RAKUTEN_AREAS].name} {/* Хотын нэр */}
                </p>
              </div>

              {displayedHotels.length === 0 ? ( // Илэрц байхгүй үед
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <p className="text-2xl text-gray-500">{t.noResults}</p>
                  <p className="text-gray-400 mt-2">Try selecting a different city or adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Зочид буудлын жагсаалт */}
                  {displayedHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      language={language}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
