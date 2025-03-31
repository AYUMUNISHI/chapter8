/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
    serverActions: true,
  },
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname:'placehold.jp'
      },
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      }
    ]
  }
};



export default nextConfig;
