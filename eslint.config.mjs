import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
const config = [
  { ignores: ['.next/**', '.next-dev/**', '.next-stale/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Preserve full-page navigation: SiteInteractions binds to each loaded document.
      '@next/next/no-html-link-for-pages': 'off',
      // Assets are served directly by the static host, with the existing CSS sizing.
      '@next/next/no-img-element': 'off',
    },
  },
];
export default config;
