import nextConfig from "@repo/eslint-config/next";

export default [
  ...nextConfig,
  {
    ignores: [".next/**", "next-env.d.ts", "out/**"],
  },
];
