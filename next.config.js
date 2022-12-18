/** @type {import('next').NextConfig} */


const API_KEY = process.env.API_KEY;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  async redirects() {
    return [
      {
        source: "/old-path/:path*",
        destination: "/new-path/:path*",
        permanent: false
      }
    ]
  },
  async rewrites() {
    return [
      // redirected but not showed
      {
        source: "/api/movies",
        destination: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
      },
      {
        source: "/api/movies/:id",
        destination: `https://api.themoviedb.org/3/movie/:id?api_key=${API_KEY}`
      }
    ]
  }
}

module.exports = nextConfig
