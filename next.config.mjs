/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    authInterrupts: true, // Enable experimental auth interrupt APIs
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.v0.dev',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
