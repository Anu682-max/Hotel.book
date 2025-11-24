import { useState } from 'react'; // React-ийн useState хукийг импортлох
import { fetchHotelsFromRakuten, RAKUTEN_AREAS } from '@/lib/api/rakuten'; // Rakuten API функц болон бүс нутгийн мэдээллийг импортлох
import { Hotel, SearchFilters } from '@/types/hotel'; // Төрлүүдийг импортлох

// Зочид буудал хайх хук
export function useHotelSearch() {
    const [hotels, setHotels] = useState<Hotel[]>([]); // Одоогийн харуулж буй зочид буудлууд
    const [allHotels, setAllHotels] = useState<Hotel[]>([]); // Бүх татсан зочид буудлууд (шүүлтүүргүй)
    const [loading, setLoading] = useState(true); // Ачаалж буй эсэх төлөв
    const [error, setError] = useState<string | null>(null); // Алдааны мэдээлэл

    // Зочид буудал хайх функц
    const searchHotels = async (city: string, filters: SearchFilters) => {
        setLoading(true); // Ачаалж эхлэх
        setError(null); // Алдааг цэвэрлэх
        try {
            const area = RAKUTEN_AREAS[city as keyof typeof RAKUTEN_AREAS]; // Сонгогдсон хотын мэдээллийг авах
            if (!area) {
                throw new Error('Invalid city selected'); // Хот буруу бол алдаа шидэх
            }

            const allHotelsFromAPI: Hotel[] = []; // Бүх зочид буудлыг хадгалах түр хувьсагч

            // Илүү сайн гүйцэтгэлтэй байхын тулд олон хуудсыг зэрэг татах
            const pages = [1, 2, 3]; // Татах хуудасны дугаарууд
            const promises = pages.map(page =>
                fetchHotelsFromRakuten({
                    latitude: area.latitude, // Өргөрөг
                    longitude: area.longitude, // Уртраг
                    searchRadius: area.searchRadius, // Радиус
                    adultNum: filters.guests || 1, // Зочдын тоо
                    hits: 30, // Нэг хуудсанд ирэх илэрц
                    page: page, // Хуудасны дугаар
                    checkinDate: filters.checkIn, // Ирэх огноо
                    checkoutDate: filters.checkOut, // Гарах огноо
                })
            );

            const results = await Promise.all(promises); // Бүх хүсэлтийг зэрэг ажиллуулах
            results.forEach(pageHotels => allHotelsFromAPI.push(...pageHotels)); // Үр дүнг нэгтгэх

            if (allHotelsFromAPI.length > 0) {
                setHotels(allHotelsFromAPI); // Зочид буудлуудыг хадгалах
                setAllHotels(allHotelsFromAPI); // Бүх зочид буудлуудыг хадгалах
            } else {
                setHotels([]); // Хоосон жагсаалт
                setAllHotels([]); // Хоосон жагсаалт
            }
        } catch (err) {
            console.error('Error loading hotels:', err); // Алдааг лог хийх
            setError('Failed to load hotels. Please try again.'); // Хэрэглэгчид харуулах алдаа
            setHotels([]); // Хоосон жагсаалт
            setAllHotels([]); // Хоосон жагсаалт
        } finally {
            setLoading(false); // Ачаалж дуусах
        }
    };

    return { hotels, allHotels, loading, error, searchHotels, setHotels }; // Хукийн буцаах утгууд
}
