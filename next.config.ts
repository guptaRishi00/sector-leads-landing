import type { NextConfig } from 'next';

// The main app adds security headers, a per-request CSP and a standalone build here. None of
// that matters for designing the page, so this preview keeps the config minimal.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
