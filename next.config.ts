/** @type {import('next').NextConfig} */
const nextConfig = {

  swcMinify: true,
  compress: true,

  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
}

module.exports = nextConfig