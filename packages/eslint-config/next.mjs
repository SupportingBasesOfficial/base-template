import baseConfig from './base.mjs'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11y from 'eslint-plugin-jsx-a11y'

/**
 * @repo/eslint-config/next
 *
 * Configuração ESLint para apps Next.js.
 * Estende @repo/eslint-config/base + regras específicas do Next.js + jsx-a11y.
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
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
]

export default nextConfig
