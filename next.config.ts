import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.modules.rules.push({
        test: /\.worker\.(ts|js)$/,
        loader: 'worker-loader',
        options: {
          filename: 'static/[hash].worker.js',
          publicPath: '/_next/',
        }
      })
    }
    
    return config;
  }
};

export default nextConfig;
