/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    TAVUS_API_KEY: process.env.VITE_TAVUS_API_KEY,
    TAVUS_REPLICA_ID: process.env.VITE_TAVUS_REPLICA_ID,
    OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY,
    ELEVENLABS_API_KEY: process.env.VITE_ELEVENLABS_API_KEY,
  },
  images: {
    domains: ['images.pexels.com'],
  },
}

module.exports = nextConfig