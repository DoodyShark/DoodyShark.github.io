import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp ships a native binary — bundling it (the default) can break the binary's runtime
  // resolution in the traced serverless function, even when it installs without error.
  serverExternalPackages: ['sharp'],
  // Next's file tracer has a known gap with sharp 0.35.x: it doesn't reliably detect the
  // @img/sharp-*/libvips native files, so the deployed function silently ships without them
  // even though `npm install` succeeded and serverExternalPackages is set. Force-include them.
  outputFileTracingIncludes: {
    '/api/upload/**/*': ['./node_modules/sharp/**/*', './node_modules/@img/**/*'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
