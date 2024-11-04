import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.stubhubstatic.com","lh3.googleusercontent.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
