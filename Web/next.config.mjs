import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  webpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());

    config.resolve.fallback = {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      // Add other polyfills if needed
    };

    return config;
  },
};

export default nextConfig;
