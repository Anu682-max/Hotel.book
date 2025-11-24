export interface Hotel {
  id: string; // Зочид буудлын ID
  name: string; // Нэр (Англи)
  nameJp: string; // Нэр (Япон)
  nameMn: string; // Нэр (Монгол)
  location: string; // Байршил (Англи)
  locationJp: string; // Байршил (Япон)
  city: string; // Хот
  prefecture: string; // Муж
  description: string; // Тайлбар (Англи)
  descriptionJp: string; // Тайлбар (Япон)
  descriptionMn: string; // Тайлбар (Монгол)
  price: number; // Үнэ
  currency: string; // Валют
  rating: number; // Үнэлгээ
  reviewCount: number; // Сэтгэгдлийн тоо
  images: string[]; // Зургууд
  amenities: string[]; // Тав тух
  roomTypes: RoomType[]; // Өрөөний төрлүүд
  coordinates?: {
    lat: number; // Өргөрөг
    lng: number; // Уртраг
  };
  bookingUrl?: string; // Rakuten захиалгын хуудасны URL (affiliate параметртэй)
  affiliateUrl?: string; // Tracking хийх бүрэн affiliate URL

  // Rakuten-ийн нэмэлт талбарууд
  access?: string; // Хэрхэн очих (Жишээ нь: "JR Токио станцаас 3 мин алхана")
  nearestStation?: string; // Ойролцоох галт тэрэгний станц
  phone?: string; // Холбоо барих утасны дугаар
  postalCode?: string; // Шуудангийн код
  parking?: string; // Зогсоолын мэдээлэл
  detailedRatings?: {
    service?: number; // Үйлчилгээ
    location?: number; // Байршил
    room?: number; // Өрөө
    equipment?: number; // Тоног төхөөрөмж
    bath?: number; // Усанд орох
    meal?: number; // Хоол
  };
}

export interface RoomType {
  id: string; // Өрөөний ID
  name: string; // Нэр (Англи)
  nameJp: string; // Нэр (Япон)
  nameMn: string; // Нэр (Монгол)
  price: number; // Үнэ
  capacity: number; // Багтаамж
  available: boolean; // Боломжтой эсэх
}

export interface SearchFilters {
  city?: string; // Хот
  prefecture?: string; // Муж
  minPrice?: number; // Доод үнэ
  maxPrice?: number; // Дээд үнэ
  minRating?: number; // Доод үнэлгээ
  amenities?: string[]; // Тав тух
  checkIn?: string; // Ирэх огноо
  checkOut?: string; // Гарах огноо
  guests?: number; // Зочдын тоо
}

export interface Booking {
  hotelId: string; // Зочид буудлын ID
  roomTypeId: string; // Өрөөний төрлийн ID
  checkIn: string; // Ирэх огноо
  checkOut: string; // Гарах огноо
  guests: number; // Зочдын тоо
  totalPrice: number; // Нийт үнэ
}
