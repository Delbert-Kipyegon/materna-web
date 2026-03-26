/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  async redirects() {
    return [
      { source: '/ask', destination: '/video', permanent: false },
      { source: '/ask/video', destination: '/video', permanent: false },
      { source: '/ask/chat', destination: '/', permanent: false },
      { source: '/affirmations', destination: '/', permanent: false },
      { source: '/tips', destination: '/', permanent: false },
      { source: '/prime', destination: '/', permanent: false },
      { source: '/notes', destination: '/', permanent: false },
    ]
  },
}

module.exports = nextConfig