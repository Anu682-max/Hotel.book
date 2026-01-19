import { Hotel } from '@/types/hotel';

const RAKUTEN_API_BASE = 'https://app.rakuten.co.jp/services/api';
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

interface RakutenHotelSearchParams {
  latitude?: number;
  longitude?: number;
  searchRadius?: number;
  checkinDate?: string;
  checkoutDate?: string;
}

export async function fetchRakutenHotels(params: RakutenHotelSearchParams) {
  const url = new URL(`${RAKUTEN_API_BASE}/Travel/SimpleHotelSearch/20170426`);
  
  url.searchParams.append('applicationId', APP_ID || '');
  url.searchParams.append('latitude', params.latitude?.toString() || '35.6895');
  url.searchParams.append('longitude', params.longitude?.toString() || '139.6917');
  url.searchParams.append('searchRadius', params.searchRadius?.toString() || '3');
  url.searchParams.append('datumType', '1');
  url.searchParams.append('format', 'json');
  url.searchParams.append('responseType', 'large');
  
  if (params.checkinDate) {
    url.searchParams.append('checkinDate', params.checkinDate);
  }
  if (params.checkoutDate) {
    url.searchParams.append('checkoutDate', params.checkoutDate);
  }

  try {
    console.log('Fetching from Rakuten API:', url.toString());
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Rakuten API Response:', data);
    
    if (data.error) {
      throw new Error(`Rakuten API Error: ${data.error_description || data.error}`);
    }
    
    return transformRakutenData(data);
  } catch (error) {
    console.error('Rakuten API Error:', error);
    throw error;
  }
}

// Rakuten-ийн өгөгдлийг таны Hotel type руу хөрвүүлэх
function transformRakutenData(data: any): Hotel[] {
  if (!data.hotels || !Array.isArray(data.hotels)) {
    return [];
  }

  return data.hotels.map((item: any, index: number) => {
    const hotel = item.hotel?.[0]?.hotelBasicInfo;
    
    if (!hotel) return null;
    
    return {
      id: hotel?.hotelNo?.toString() || `rakuten-${index}`,
      name: hotel?.hotelName || 'Unknown Hotel',
      nameJp: hotel?.hotelName || '',
      nameMn: hotel?.hotelName || '',
      location: `${hotel?.address1 || ''} ${hotel?.address2 || ''}`.trim(),
      locationJp: `${hotel?.address1 || ''} ${hotel?.address2 || ''}`.trim(),
      city: hotel?.address2 || '',
      prefecture: hotel?.address1 || '',
      description: hotel?.hotelSpecial || hotel?.hotelName || '',
      descriptionJp: hotel?.hotelSpecial || '',
      descriptionMn: hotel?.hotelSpecial || '',
      price: hotel?.hotelMinCharge || 0,
      currency: 'JPY',
      rating: hotel?.userReview ? parseFloat(hotel.userReview) / 20 : 0, // Rakuten 0-100 scale → 0-5
      reviewCount: hotel?.reviewCount || 0,
      images: [
        hotel?.hotelImageUrl,
        hotel?.hotelThumbnailUrl,
      ].filter(Boolean),
      amenities: parseAmenities(hotel),
      roomTypes: [
        {
          id: `r-${hotel?.hotelNo}`,
          name: 'Standard Room',
          nameJp: 'スタンダードルーム',
          nameMn: 'Энгийн өрөө',
          price: hotel?.hotelMinCharge || 0,
          capacity: 2,
          available: true,
        },
      ],
      coordinates: {
        lat: parseFloat(hotel?.latitude) || 0,
        lng: parseFloat(hotel?.longitude) || 0,
      },
    };
  }).filter(Boolean) as Hotel[];
}

function parseAmenities(hotel: any): string[] {
  const amenities: string[] = [];
  
  // Rakuten API-аас ирж болох зарим мэдээлэл
  if (hotel?.parkingInformation) amenities.push('Parking');
  if (hotel?.nearestStation) amenities.push('Train Access');
  
  // Үндсэн편의시설
  amenities.push('WiFi'); // Ихэнх зочид буудалд байдаг
  
  return amenities;
}
