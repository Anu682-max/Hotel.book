'use client';

import { useEffect, useState } from 'react';
import { fetchRakutenHotels } from '@/services/rakutenApi';
import { Hotel } from '@/types/hotel';

export default function TestApiPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHotels() {
      try {
        setLoading(true);
        console.log('Starting to fetch hotels...');
        const data = await fetchRakutenHotels({
          latitude: 35.6895, // Tokyo coordinates
          longitude: 139.6917,
          searchRadius: 3, // 3km radius
        });
        console.log('Fetched hotels:', data);
        setHotels(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading hotels:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadHotels();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading Rakuten hotels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">API Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Rakuten Hotels API Test</h1>
          <p className="text-gray-600">Found {hotels.length} hotels near Tokyo</p>
        </div>

        {hotels.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">No hotels found. API might not be returning data.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {hotel.images[0] && (
                  <img 
                    src={hotel.images[0]} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-bold text-lg mb-2">{hotel.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-semibold">{hotel.rating.toFixed(1)}</span>
                      <span className="ml-1 text-xs text-gray-500">({hotel.reviewCount})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        ¥{hotel.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>

                  {hotel.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities.slice(0, 3).map((amenity) => (
                        <span 
                          key={amenity}
                          className="px-2 py-1 bg-gray-100 text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
