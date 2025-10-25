/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    domains: [
      "i.ibb.co",
      "i.ibb.com",
      "i.ibb.co.com",
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
