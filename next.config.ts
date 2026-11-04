import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(phase === PHASE_DEVELOPMENT_SERVER && {
    async rewrites() {
      return { beforeFiles: [{ source: '/api/appointment.php', destination: 'http://127.0.0.1:8001/api/appointment.php' }] };
    }
  })
});

export default nextConfig;
