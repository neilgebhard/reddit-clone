/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['frwqvmguatavxorvfhlx.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
