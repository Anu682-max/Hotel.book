'use client'; // Клиент талд ажиллах компонент

import { Hotel } from '@/types/hotel'; // Зочид буудлын төрлийг импортлох
import { Language, useTranslation } from '@/lib/i18n'; // Орчуулгын функцийг импортлох
import { useState } from 'react'; // React-ийн useState хукийг импортлох
import HotelDetailsModal from './HotelDetailsModal'; // Дэлгэрэнгүй мэдээллийн модалыг импортлох

// HotelCard компонентийн пропсуудын төрлийг тодорхойлох
interface HotelCardProps {
  hotel: Hotel; // Зочид буудлын мэдээлэл
  language: Language; // Сонгогдсон хэл
}

// HotelCard компонент
export default function HotelCard({ hotel, language }: HotelCardProps) {
  const t = useTranslation(language); // Орчуулгын хувьсагч

  // Захиалга хийх товч дарахад ажиллах функц
  const handleBookingClick = () => {
    // Affiliate холбоос байвал ашиглах, үгүй бол захиалгын холбоосыг ашиглах
    const url = hotel.affiliateUrl || hotel.bookingUrl;

    if (url) {
      // Rakuten захиалгын хуудсыг шинэ цонхонд нээх
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Booking URL not available'); // Холбоос байхгүй бол анхааруулга өгөх
    }
  };

  // Зочид буудлын нэрийг хэлнээс хамаарч авах
  const getLocalizedName = () => {
    switch (language) {
      case 'jp':
        return hotel.nameJp; // Япон нэр
      case 'mn':
        return hotel.nameMn; // Монгол нэр
      default:
        return hotel.name; // Англи нэр
    }
  };

  // Зочид буудлын тайлбарыг хэлнээс хамаарч авах
  const getLocalizedDescription = () => {
    switch (language) {
      case 'jp':
        return hotel.descriptionJp; // Япон тайлбар
      case 'mn':
        return hotel.descriptionMn; // Монгол тайлбар
      default:
        return hotel.description; // Англи тайлбар
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // Модал нээлттэй эсэхийг хадгалах төлөв

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"> {/* Картын үндсэн загвар */}
        <div className="relative h-56 bg-gray-200 shrink-0 cursor-pointer" onClick={() => setIsModalOpen(true)}> {/* Зургийн хэсэг */}
          <img
            src={hotel.images[0]} // Зургийн эх сурвалж
            alt={getLocalizedName()} // Зургийн тайлбар
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" // Зургийн загвар
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'; // Зураг ачааллахад алдаа гарвал орлуулах зураг
            }}
          />
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"> {/* Үнэлгээ */}
            {hotel.rating > 0 ? hotel.rating.toFixed(1) : 'N/A'}
          </div>
          {hotel.reviewCount > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700"> {/* Сэтгэгдлийн тоо */}
              {hotel.reviewCount} {t.reviews}
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1"> {/* Мэдээллийн хэсэг */}
          <h3
            className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors" // Гарчиг загвар
            onClick={() => setIsModalOpen(true)}
          >
            {getLocalizedName()} {/* Зочид буудлын нэр */}
          </h3>

          {/* Байршил ба Станц */}
          <div className="space-y-1 mb-3">
            <p className="text-sm text-gray-600 flex items-start gap-1">
              <span className="line-clamp-1">{language === 'jp' ? hotel.locationJp : hotel.location}</span> {/* Байршил */}
            </p>
            {hotel.nearestStation && (
              <p className="text-xs text-gray-500 flex items-center gap-1 ml-5">
                <span>{hotel.nearestStation} Station</span> {/* Ойролцоох станц */}
              </p>
            )}
          </div>

          {/* Тайлбар */}
          <p className="text-sm text-gray-700 mb-3 line-clamp-2 min-h-[2.5rem]">
            {getLocalizedDescription()}
          </p>

          {/* Хандалтын мэдээлэл */}
          {hotel.access && (
            <p className="text-xs text-blue-600 mb-3 line-clamp-1 flex items-start gap-1">
              <span className="line-clamp-1">{hotel.access}</span>
            </p>
          )}

          {/* Тав тух */}
          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hotel.amenities.slice(0, 4).map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-medium">
                  +{hotel.amenities.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Доод хэсгийг түлхэх зай */}
          <div className="flex-1"></div>

          {/* Дэлгэрэнгүй үнэлгээ */}
          {hotel.detailedRatings && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-3 gap-1 text-xs">
                {hotel.detailedRatings.location && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{hotel.detailedRatings.location.toFixed(1)}</span>
                  </div>
                )}
                {hotel.detailedRatings.service && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{hotel.detailedRatings.service.toFixed(1)}</span>
                  </div>
                )}
                {hotel.detailedRatings.room && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{hotel.detailedRatings.room.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Үнэ */}
          <div className="border-t pt-3 mb-3">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-blue-800">
                ¥{hotel.price.toLocaleString()} {/* Үнэ */}
              </span>
              <span className="text-sm text-gray-600">
                {t.perNight} {/* Хоногоор */}
              </span>
            </div>
          </div>

          {/* Товчлуурууд */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-sm">{t.details || 'Details'}</span> {/* Дэлгэрэнгүй товч */}
            </button>
            <button
              onClick={handleBookingClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span className="text-sm">{t.bookNow}</span> {/* Захиалах товч */}
            </button>
          </div>

          {/* Rakuten affiliate disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-2">
            {language === 'jp' && '楽天トラベルで予約'}
            {language === 'mn' && 'Rakuten дээр захиалах'}
            {language === 'en' && 'Book on Rakuten Travel'}
          </p>
        </div>
      </div>

      <HotelDetailsModal
        hotel={hotel}
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
