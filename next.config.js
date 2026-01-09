/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.rakuten.co.jp',
      },
      {
        protocol: 'https',
        hostname: 'img.travel.rakuten.co.jp',
      },
    ],
  },
  // Environment variables шалгах debug mode
  env: {
    RAKUTEN_APP_ID_CONFIGURED: process.env.NEXT_PUBLIC_RAKUTEN_APP_ID ? 'YES' : 'NO',
  },
}

module.exports = nextConfig
