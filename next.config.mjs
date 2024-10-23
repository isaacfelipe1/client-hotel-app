/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Ativa o modo estrito do React
  experimental: {
    reactRefresh: false, // Desativa o Fast Refresh (Hot Reloading)
  },
};

export default nextConfig;
