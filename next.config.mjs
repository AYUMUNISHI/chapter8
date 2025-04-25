/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
    serverActions: true,
  },
  images:{
    remotePatterns:[
      {
        protocol: 'http',
        hostname:'placehold.jp'
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      },
      {
        protocol: 'https',
        hostname: 'with-the-dog.com',
      },
      {
        protocol: 'https',
        hostname: 'i.gyazo.com',
      }
    ]
  }
};



export default nextConfig;
