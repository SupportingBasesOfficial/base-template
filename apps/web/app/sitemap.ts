import type { MetadataRoute } from "next";

/**
 * sitemap.ts — gera sitemap dinâmico para SEO.
 *
 * Adicione novas rotas conforme o app cresce.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
