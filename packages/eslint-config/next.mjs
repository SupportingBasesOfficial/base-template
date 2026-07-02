import baseConfig from './base.mjs'
import nextPlugin from '@next/eslint-plugin-next'

/**
 * @repo/eslint-config/next
 *
 * Configuração ESLint para apps Next.js.
 * Estende @repo/eslint-config/base + regras específicas do Next.js.
 *
 * Uso em apps/web/eslint.config.mjs:
 *   import nextConfig from '@repo/eslint-config/next'
 *   export default nextConfig
 */
const nextConfig = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
]

export default nextConfig
