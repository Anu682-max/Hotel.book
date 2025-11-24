/* eslint-disable */
import { Hotel } from '@/types/hotel'; // Зочид буудлын төрлийг импортлох

const RAKUTEN_APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID; // Rakuten App ID-г орчны хувьсагчаас авах
const RAKUTEN_AFFILIATE_ID = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID; // Rakuten Affiliate ID-г орчны хувьсагчаас авах

/**
 * Rakuten Affiliate URL үүсгэх
 * Зочид буудлын захиалгын URL дээр affiliate tracking параметрүүдийг нэмнэ
 *
 * Формат: {hotelUrl}?scid=af_{affiliateId}
 * Жишээ: https://hb.afl.rakuten.co.jp/hgc/...?scid=af_1234567
 */
function buildAffiliateUrl(hotelUrl: string): string {
  if (!hotelUrl) return ''; // URL байхгүй бол хоосон буцаах

  // Хэрэв affiliate ID тохируулагдсан бол tracking параметрүүдийг нэмэх
  if (RAKUTEN_AFFILIATE_ID && RAKUTEN_AFFILIATE_ID !== 'YOUR_AFFILIATE_ID') {
    const separator = hotelUrl.includes('?') ? '&' : '?'; // URL-д ? байгаа эсэхийг шалгах
    return `${hotelUrl}${separator}scid=af_${RAKUTEN_AFFILIATE_ID}`; // Affiliate ID-г нэмэх
  }

  // Affiliate ID байхгүй бол анхны URL-г буцаах
  return hotelUrl;
}

// Rakuten хайлтын параметрүүдийн интерфэйс
interface RakutenSearchParams {
  largeClassCode?: string; // Бүсийн код
  middleClassCode?: string; // Мужийн код
  smallClassCode?: string; // Хотын код
  latitude?: number; // Өргөрөг (координатаар хайхад)
  longitude?: number; // Уртраг (координатаар хайхад)
  searchRadius?: number; // Хайлтын радиус км-ээр (1, 2, эсвэл 3)
  checkinDate?: string; // Ирэх огноо
  checkoutDate?: string; // Гарах огноо
  adultNum?: number; // Насанд хүрэгчдийн тоо
  responseType?: string; // Хариуны төрөл
  hits?: number; // Илэрцийн тоо
  page?: number; // Хуудасны дугаар
}

/**
 * Rakuten Travel API-аас зочид буудал хайх
 * Албан ёсны баримт бичиг: https://webservice.rakuten.co.jp/documentation
 * 
 * Үнэгүй эрх: Өдөрт 10,000 хүсэлт
 * Кредит карт шаардлагагүй!
 */
export async function fetchHotelsFromRakuten(
  params: RakutenSearchParams = {}
): Promise<Hotel[]> {
  if (!RAKUTEN_APP_ID || RAKUTEN_APP_ID === 'your_rakuten_app_id') {
    // console.warn('⚠️ Rakuten App ID not configured.'); // App ID тохируулагдаагүй бол анхааруулга (одоогоор коммент болгосон)
    return []; // Хоосон жагсаалт буцаах
  }

  try {
    // Rakuten Travel Simple Hotel Search API endpoint
    const url = new URL('https://app.rakuten.co.jp/services/api/Travel/SimpleHotelSearch/20170426');

    // Параметрүүдийг бэлтгэх - Rakuten тодорхой формат шаарддаг
    const searchParams: Record<string, string | number> = {
      applicationId: RAKUTEN_APP_ID, // App ID
      formatVersion: 2, // Форматын хувилбар
    };

    // Бүсийн код өгөгдсөн бол нэмэх
    if (params.largeClassCode) {
      searchParams.largeClassCode = params.largeClassCode;
    }
    if (params.middleClassCode) {
      searchParams.middleClassCode = params.middleClassCode;
    }
    if (params.smallClassCode) {
      searchParams.smallClassCode = params.smallClassCode;
    }

    // Координат өгөгдсөн бол нэмэх
    if (params.latitude && params.longitude) {
      searchParams.latitude = params.latitude;
      searchParams.longitude = params.longitude;
      searchParams.searchRadius = params.searchRadius || 3; // Радиус (анхдагч нь 3км)
    }
    // Хэрэв бүсийн код болон координат байхгүй бол Токиог анхдагчаар хайх
    else if (!params.largeClassCode && !params.middleClassCode && !params.smallClassCode) {
      // Токиогийн координат
      searchParams.latitude = 35.6812;
      searchParams.longitude = 139.7671;
      searchParams.searchRadius = 3; // 3км радиус
    }

    // Бусад хайлтын параметрүүдийг нэмэх
    if (params.checkinDate) searchParams.checkinDate = params.checkinDate;
    if (params.checkoutDate) searchParams.checkoutDate = params.checkoutDate;
    if (params.adultNum) searchParams.adultNum = params.adultNum;

    searchParams.hits = params.hits || 30; // Илэрцийн тоо (анхдагч нь 30)
    searchParams.page = params.page || 1; // Хуудасны дугаар (анхдагч нь 1)
    searchParams.datumType = 1; // WGS84 координат систем

    // URL дээр параметрүүдийг нэмэх
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    // console.log('🔄 Calling Rakuten Travel API:', url.toString().replace(RAKUTEN_APP_ID, '***')); // API дуудаж буйг лог хийх

    const response = await fetch(url.toString(), {
      method: 'GET', // GET хүсэлт
    });

    // console.log('📡 API Response Status:', response.status); // Хариуны статусыг лог хийх

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Rakuten API Error:', errorText); // Алдааг лог хийх
      throw new Error(`API request failed: ${response.status}`); // Алдаа шидэх
    }

    const data = await response.json(); // JSON өгөгдлийг авах
    // console.log('📦 Rakuten API Response:', data); // Өгөгдлийг лог хийх

    return transformRakutenResponse(data); // Өгөгдлийг хөрвүүлж буцаах
  } catch (error) {
    console.error('❌ Error fetching from Rakuten Travel API:', error); // Алдаа гарвал лог хийх
    return []; // Хоосон жагсаалт буцаах
  }
}

/**
 * Rakuten API-ийн хариуг манай Hotel интерфэйс рүү хөрвүүлэх
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRakutenResponse(data: any): Hotel[] {
  if (!data.hotels || !Array.isArray(data.hotels)) {
    // console.log('⚠️ No hotels found in Rakuten response'); // Зочид буудал олдоогүй бол
    return [];
  }

  // console.log(`✅ Found ${data.hotels.length} hotels from Rakuten Travel!`); // Олдсон зочид буудлын тоо

  return data.hotels.map((hotelArray: any) => {
    // Зочид буудал бүр [hotelBasicInfo, hotelRatingInfo] гэсэн массив байна
    const hotelData = hotelArray[0];
    const ratingData = hotelArray[1];
    const hotel = hotelData?.hotelBasicInfo;
    const ratings = ratingData?.hotelRatingInfo;

    if (!hotel) {
      return null; // Мэдээлэл дутуу бол алгасах
    }

    // Захиалгын URL-г авах
    const bookingUrl = hotel.hotelInformationUrl || '';
    const affiliateUrl = buildAffiliateUrl(bookingUrl); // Affiliate URL үүсгэх

    // Дэлгэрэнгүй үнэлгээг задлах
    const detailedRatings = ratings ? {
      service: parseFloat(ratings.serviceAverage) || undefined,
      location: parseFloat(ratings.locationAverage) || undefined,
      room: parseFloat(ratings.roomAverage) || undefined,
      equipment: parseFloat(ratings.equipmentAverage) || undefined,
      bath: parseFloat(ratings.bathAverage) || undefined,
      meal: parseFloat(ratings.mealAverage) || undefined,
    } : undefined;

    // Hotel объект руу хөрвүүлэх
    const transformedHotel: Hotel = {
      id: hotel.hotelNo?.toString() || '', // ID
      name: hotel.hotelName || 'Hotel', // Нэр
      nameJp: hotel.hotelName || '', // Япон нэр
      nameMn: hotel.hotelName || '', // Монгол нэр (API-аас ирэхгүй тул япон нэрийг ашиглав)
      location: `${hotel.address1 || ''} ${hotel.address2 || ''}`.trim(), // Байршил
      locationJp: hotel.address1 || '', // Япон байршил
      city: hotel.address1 || 'Tokyo', // Хот
      prefecture: hotel.address1 || 'Tokyo', // Муж
      description: hotel.hotelSpecial || hotel.hotelName || '', // Тайлбар
      descriptionJp: hotel.hotelSpecial || '', // Япон тайлбар
      descriptionMn: hotel.hotelSpecial || '', // Монгол тайлбар
      price: parseFloat(hotel.hotelMinCharge || 0), // Үнэ
      currency: 'JPY', // Валют
      rating: parseFloat(hotel.reviewAverage || 0), // Үнэлгээ
      reviewCount: parseInt(hotel.reviewCount || 0), // Сэтгэгдлийн тоо
      images: extractRakutenImages(hotel), // Зургууд
      amenities: extractRakutenAmenities(hotel), // Тав тух
      roomTypes: [
        {
          id: 'default',
          name: 'Standard Room',
          nameJp: 'スタンダードルーム',
          nameMn: 'Энгийн өрөө',
          price: parseFloat(hotel.hotelMinCharge || 0),
          capacity: 2,
          available: true,
        },
      ],
      coordinates: hotel.latitude && hotel.longitude
        ? {
          lat: parseFloat(hotel.latitude),
          lng: parseFloat(hotel.longitude),
        }
        : undefined, // Координат
      bookingUrl: bookingUrl, // Анхны URL
      affiliateUrl: affiliateUrl, // Affiliate URL

      // Нэмэлт талбарууд
      access: hotel.access || undefined, // Хандалт
      nearestStation: hotel.nearestStation || undefined, // Ойролцоох станц
      phone: hotel.telephoneNo || undefined, // Утас
      postalCode: hotel.postalCode || undefined, // Шуудангийн код
      parking: hotel.parkingInformation || undefined, // Зогсоол
      detailedRatings: detailedRatings, // Дэлгэрэнгүй үнэлгээ
    };

    return transformedHotel;
  }).filter((hotel: Hotel | null): hotel is Hotel => hotel !== null); // Null утгуудыг шүүх
}

/**
 * Rakuten хариунаас зураг задлах
 * Өндөр чанартай зургийг эхэнд нь тавина
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRakutenImages(hotel: any): string[] {
  const images: string[] = [];

  // Үндсэн зураг (хамгийн өндөр чанартай)
  if (hotel.hotelImageUrl) {
    images.push(hotel.hotelImageUrl);
  }

  // Өрөөний зураг
  if (hotel.roomImageUrl) {
    images.push(hotel.roomImageUrl);
  }

  // Жижиг зургууд (fallback)
  if (hotel.hotelThumbnailUrl && images.length < 2) {
    images.push(hotel.hotelThumbnailUrl);
  }

  if (hotel.roomThumbnailUrl && images.length < 3) {
    images.push(hotel.roomThumbnailUrl);
  }

  // Зураг олдоогүй бол default зураг ашиглах
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800');
  }

  return images;
}

/**
 * Rakuten хариунаас тав тухыг задлах
 * Зочид буудлын тайлбар, зогсоолын мэдээлэл зэргээс хайлт хийнэ
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractRakutenAmenities(hotel: any): string[] {
  const amenities: string[] = [];
  const text = `${hotel.hotelSpecial || ''} ${hotel.parkingInformation || ''}`.toLowerCase(); // Хайх текст

  // Зогсоол
  if (hotel.parkingInformation && hotel.parkingInformation.includes('有')) {
    amenities.push('🅿️ Parking');
  }

  // Халуун рашаан / Онсен
  if (text.includes('温泉') || text.includes('大浴場') || text.includes('風呂')) {
    amenities.push('♨️ Onsen');
  }

  // WiFi
  if (text.includes('wifi') || text.includes('wi-fi') || text.includes('インターネット')) {
    amenities.push('📶 WiFi');
  }

  // Өглөөний цай
  if (text.includes('朝食') || text.includes('breakfast') || text.includes('ビュッフェ')) {
    amenities.push('🍳 Breakfast');
  }

  // Ресторан
  if (text.includes('レストラン') || text.includes('restaurant') || text.includes('食事')) {
    amenities.push('🍽️ Restaurant');
  }

  // Фитнесс / Спорт заал
  if (text.includes('ジム') || text.includes('fitness') || text.includes('フィットネス')) {
    amenities.push('🏋️ Gym');
  }

  // Усан сан
  if (text.includes('プール') || text.includes('pool')) {
    amenities.push('🏊 Pool');
  }

  // Спа
  if (text.includes('スパ') || text.includes('spa') || text.includes('エステ')) {
    amenities.push('💆 Spa');
  }

  // Бар
  if (text.includes('バー') || text.includes('bar') || text.includes('ラウンジ')) {
    amenities.push('🍸 Bar');
  }

  // Хурлын өрөө
  if (text.includes('会議') || text.includes('conference') || text.includes('ミーティング')) {
    amenities.push('📊 Conference');
  }

  // Тав тух олдоогүй бол default утга нэмэх
  if (amenities.length === 0) {
    amenities.push('🏨 Standard');
  }

  return amenities;
}

/**
 * Rakuten Travel-ийн гол хотууд/бүс нутгууд
 * Найдвартай хайлт хийхийн тулд координатыг ашигладаг
 */
export const RAKUTEN_AREAS = {
  // Токио (координат ашиглан - хамгийн найдвартай)
  tokyo: {
    latitude: 35.6812,
    longitude: 139.7671,
    searchRadius: 3,
    name: 'Tokyo',
    nameJp: '東京',
    nameMn: 'Токио'
  },
  // Осака
  osaka: {
    latitude: 34.6937,
    longitude: 135.5023,
    searchRadius: 3,
    name: 'Osaka',
    nameJp: '大阪',
    nameMn: 'Осака'
  },
  // Киото
  kyoto: {
    latitude: 35.0116,
    longitude: 135.7681,
    searchRadius: 3,
    name: 'Kyoto',
    nameJp: '京都',
    nameMn: 'Киото'
  },
  // Саппоро (Хоккайдо)
  hokkaido: {
    latitude: 43.0642,
    longitude: 141.3469,
    searchRadius: 3,
    name: 'Sapporo',
    nameJp: '札幌',
    nameMn: 'Хоккайдо (Саппоро)'
  },
  // Наха (Окинава)
  okinawa: {
    latitude: 26.2124,
    longitude: 127.6809,
    searchRadius: 3,
    name: 'Okinawa',
    nameJp: '沖縄',
    nameMn: 'Окинава'
  },
  // Фукуока
  fukuoka: {
    latitude: 33.5904,
    longitude: 130.4017,
    searchRadius: 3,
    name: 'Fukuoka',
    nameJp: '福岡',
    nameMn: 'Фукуока'
  },
};
