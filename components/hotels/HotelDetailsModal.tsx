'use client'; // Клиент талд ажиллах компонент

import { Hotel } from '@/types/hotel'; // Зочид буудлын төрлийг импортлох
import { Language, useTranslation } from '@/lib/i18n'; // Орчуулгын функцийг импортлох
import { useEffect } from 'react'; // React-ийн useEffect хукийг импортлох

// HotelDetailsModal компонентийн пропсуудын төрлийг тодорхойлох
interface HotelDetailsModalProps {
    hotel: Hotel; // Зочид буудлын мэдээлэл
    language: Language; // Сонгогдсон хэл
    isOpen: boolean; // Модал нээлттэй эсэх
    onClose: () => void; // Модалыг хаах функц
}

// HotelDetailsModal компонент
export default function HotelDetailsModal({ hotel, language, isOpen, onClose }: HotelDetailsModalProps) {
    const t = useTranslation(language); // Орчуулгын хувьсагч

    // Модал нээлттэй үед хуудасны гүйлгэлтийг зогсоох
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Гүйлгэлтийг хаах
        } else {
            document.body.style.overflow = 'unset'; // Гүйлгэлтийг нээх
        }
        return () => {
            document.body.style.overflow = 'unset'; // Цэвэрлэх
        };
    }, [isOpen]);

    if (!isOpen) return null; // Модал хаалттай бол юу ч харуулахгүй

    // Зочид буудлын нэрийг хэлнээс хамаарч авах
    const getLocalizedName = () => {
        switch (language) {
            case 'jp': return hotel.nameJp; // Япон нэр
            case 'mn': return hotel.nameMn; // Монгол нэр
            default: return hotel.name; // Англи нэр
        }
    };

    // Зочид буудлын тайлбарыг хэлнээс хамаарч авах
    const getLocalizedDescription = () => {
        switch (language) {
            case 'jp': return hotel.descriptionJp; // Япон тайлбар
            case 'mn': return hotel.descriptionMn; // Монгол тайлбар
            default: return hotel.description; // Англи тайлбар
        }
    };

    // Захиалга хийх товч дарахад ажиллах функц
    const handleBookingClick = () => {
        const url = hotel.affiliateUrl || hotel.bookingUrl; // Холбоосыг авах
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer'); // Шинэ цонхонд нээх
        } else {
            alert('Booking URL not available'); // Холбоос байхгүй бол анхааруулга
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"> {/* Модалын гаднах хүрээ */}
            {/* Арын бүдэгрүүлсэн хэсэг */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose} // Дарахад модалыг хаах
            />

            {/* Модалын агуулга */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Толгой / Зургийн хэсэг */}
                <div className="relative h-64 sm:h-80 shrink-0">
                    <img
                        src={hotel.images[0]} // Зураг
                        alt={getLocalizedName()} // Зургийн тайлбар
                        className="w-full h-full object-cover" // Зургийн загвар
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'; // Алдаа гарвал орлуулах зураг
                        }}
                    />
                    <button
                        onClick={onClose} // Хаах товч
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 pt-20 text-white"> {/* Зургийн дээрх мэдээлэл */}
                        <h2 className="text-3xl font-bold mb-2 text-shadow">{getLocalizedName()}</h2> {/* Нэр */}
                        <div className="flex items-center gap-4 text-sm">
                            <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                {hotel.rating > 0 ? hotel.rating.toFixed(1) : 'N/A'} {/* Үнэлгээ */}
                            </span>
                            <span className="flex items-center gap-1">
                                {language === 'jp' ? hotel.locationJp : hotel.location} {/* Байршил */}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Гүйлгэх боломжтой агуулга */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Зүүн багана: Үндсэн мэдээлэл */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Тайлбар */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    {t.description || 'Description'}
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {getLocalizedDescription()}
                                </p>
                            </section>

                            {/* Тав тух */}
                            {hotel.amenities.length > 0 && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        {t.amenities || 'Amenities'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hotel.amenities.map((amenity) => (
                                            <span
                                                key={amenity}
                                                className="bg-white border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Дэлгэрэнгүй үнэлгээ */}
                            {hotel.detailedRatings && (
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        {t.ratings || 'Detailed Ratings'}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {Object.entries(hotel.detailedRatings).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key}</div>
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-xl font-bold text-gray-800">{value.toFixed(1)}</span>
                                                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full"
                                                                style={{ width: `${(value / 5) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Баруун багана: Хажуугийн мэдээлэл */}
                        <div className="space-y-6">

                            {/* Үнэ ба Захиалгын карт */}
                            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 sticky top-0">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">{t.perNight}</p>
                                    <div className="text-3xl font-bold text-blue-600">
                                        ¥{hotel.price.toLocaleString()}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookingClick}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-3 flex items-center justify-center gap-2"
                                >
                                    <span>{t.bookNow}</span>
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    Powered by Rakuten Travel
                                </p>
                            </div>

                            {/* Байршлын дэлгэрэнгүй */}
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-3">Location Details</h4>
                                <div className="space-y-3 text-sm">
                                    {hotel.postalCode && (
                                        <div className="flex gap-3">
                                            <span className="text-gray-700">{hotel.postalCode}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <span className="text-gray-700">{language === 'jp' ? hotel.locationJp : hotel.location}</span>
                                    </div>
                                    {hotel.nearestStation && (
                                        <div className="flex gap-3">
                                            <span className="text-gray-700">{hotel.nearestStation}</span>
                                        </div>
                                    )}
                                    {hotel.access && (
                                        <div className="flex gap-3">
                                            <span className="text-gray-700">{hotel.access}</span>
                                        </div>
                                    )}
                                    {hotel.parking && (
                                        <div className="flex gap-3">
                                            <span className="text-gray-700">{hotel.parking}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
