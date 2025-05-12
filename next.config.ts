// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // disable AMD parsing in dragonBones.js so define([...]) is ignored
    config.module.rules.push({
      test: /node_modules[\\/]pixi5-dragonbones[\\/]dragonBones\.js$/,
      parser: { amd: false },
    });
    return config;
  },
};

export default nextConfig;

