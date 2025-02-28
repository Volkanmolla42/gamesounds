/** @type {import('next').NextConfig} */
const nextConfig = {
  // API anahtarı gibi hassas bilgilerin sadece API route gibi sunucu bileşenlerinde
  // kullanılabilmesini sağlar, client-side'a gönderilmez
  env: {},
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
  }
};

export default nextConfig;
