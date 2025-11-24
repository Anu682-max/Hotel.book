import { NextResponse } from 'next/server';
import { mockHotels } from '@/data/hotels';

/**
 * Local Hotel API - Always works, no external dependencies!
 * This simulates a real API using our mock data
 *
 * Usage: GET /api/hotels?city=Tokyo
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const city = searchParams.get('city');
  const prefecture = searchParams.get('prefecture');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');

  let hotels = [...mockHotels];

  // Apply filters
  if (city) {
    hotels = hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
  }

  if (prefecture) {
    hotels = hotels.filter(h => h.prefecture.toLowerCase() === prefecture.toLowerCase());
  }

  if (minPrice) {
    hotels = hotels.filter(h => h.price >= parseInt(minPrice));
  }

  if (maxPrice) {
    hotels = hotels.filter(h => h.price <= parseInt(maxPrice));
  }

  if (minRating) {
    hotels = hotels.filter(h => h.rating >= parseFloat(minRating));
  }

  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    success: true,
    count: hotels.length,
    data: hotels,
  });
}
