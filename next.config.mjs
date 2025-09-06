// import type {NextConfig}  from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: ['cdn.dummyjson.com', 'i.dummyjson.com'],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',

      },
      
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // <-- This is the new addition
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos', // <-- This is the new addition
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;