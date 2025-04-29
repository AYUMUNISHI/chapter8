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

    ],
    domains: ['hzokaprypkbeexsdrjle.supabase.co'],
  }
};



export default nextConfig;
