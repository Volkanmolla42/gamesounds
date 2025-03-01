/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // API anahtarı gibi hassas bilgilerin sadece API route gibi sunucu bileşenlerinde
  // kullanılabilmesini sağlar, client-side'a gönderilmez
  env: {
    // Public environment variables that can be used in the browser
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // External image domains that are allowed
  images: {
    domains: ['randomuser.me',"images.unsplash.com"],
  },
  // API rotasına yapılan isteklerde CORS hatalarını önlemek için
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  // Ensure middleware works correctly
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
