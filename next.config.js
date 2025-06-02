/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: [
      "@opentelemetry/auto-instrumentations-node",
      "@opentelemetry/sdk-node",
      "@opentelemetry/api"
    ],
  },
};

export default config;
