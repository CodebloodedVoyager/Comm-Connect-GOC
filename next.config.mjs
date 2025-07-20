
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    allowedDevOrigins: [
      "https://3003-firebase-comconnect-ai-1752948674666.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev"
    ]
  }
}

export default nextConfig
