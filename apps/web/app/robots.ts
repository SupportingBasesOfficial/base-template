import type { MetadataRoute } from "next";

/**
 * robots.ts — controla o crawling de motores de busca.
 *
 * Em produção, permite tudo. Em staging/desenvolvimento, bloqueia.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    rules: {
      userAgent: "*",
      allow: isProduction ? "/" : "",
      disallow: isProduction ? ["/api/"] : ["/"],
    },
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}
