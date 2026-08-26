import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp ships a native binary — bundling it (the default) can break the binary's runtime
  // resolution in the traced serverless function, even when it installs without error.
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
