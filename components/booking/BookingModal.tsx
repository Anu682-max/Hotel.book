'use client';

import { useState } from 'react';
import { Hotel } from '@/types/hotel';
import { Language, useTranslation } from '@/lib/i18n';

interface BookingModalProps {
  hotel: Hotel;
  language: Language;
  onClose: () => void;
}

export default function BookingModal({
  hotel,
  language,
  onClose,
}: BookingModalProps) {
  const t = useTranslation(language);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [guests, setGuests] = useState(1);

  const getLocalizedName = () => {
    switch (language) {
      case 'jp':
        return hotel.nameJp;
      case 'mn':
        return hotel.nameMn;
      default:
        return hotel.name;
    }
  };

  const getLocalizedRoomName = (roomId: string) => {
    const room = hotel.roomTypes.find((r) => r.id === roomId);
    if (!room) return '';
    switch (language) {
      case 'jp':
        return room.nameJp;
      case 'mn':
        return room.nameMn;
      default:
        return room.name;
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const room = hotel.roomTypes.find((r) => r.id === selectedRoomId);
    if (!room) return 0;
    return room.price * calculateNights();
  };

  const handleBooking = () => {
    alert(
      `${t.bookingDetails}:\n\n` +
      `Hotel: ${getLocalizedName()}\n` +
      `Room: ${getLocalizedRoomName(selectedRoomId)}\n` +
      `Check-in: ${checkIn}\n` +
      `Check-out: ${checkOut}\n` +
      `Guests: ${guests}\n` +
      `Nights: ${calculateNights()}\n` +
      `Total: ¥${calculateTotal().toLocaleString()}\n\n` +
      `(This is a demo - no actual booking is made)`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {t.bookNow}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <img
              src={hotel.images[0]}
              alt={getLocalizedName()}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-bold mt-3">{getLocalizedName()}</h3>
            <p className="text-gray-600">
              {language === 'jp' ? hotel.locationJp : hotel.location}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.checkIn}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.checkOut}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.guests}
              </label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.roomType}
              </label>
              <div className="space-y-2">
                {hotel.roomTypes.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRoomId === room.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {language === 'jp'
                            ? room.nameJp
                            : language === 'mn'
                            ? room.nameMn
                            : room.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {t.capacity}: {room.capacity} {t.people}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ¥{room.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">{t.perNight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {checkIn && checkOut && selectedRoomId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">
                    {calculateNights()} {t.nightsStay}
                  </span>
                  <span className="font-semibold">
                    ¥{calculateTotal().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>{t.totalPrice}</span>
                  <span className="text-primary-600">
                    ¥{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!checkIn || !checkOut || !selectedRoomId}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold"
            >
              {t.completeBooking}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
