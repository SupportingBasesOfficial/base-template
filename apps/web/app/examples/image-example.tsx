import Image from "next/image";

/**
 * Exemplo de next/image — otimização automática de imagens.
 *
 * next/image fornece:
 * - Lazy loading automático
 * - Redimensionamento responsivo (srcset)
 * - Otimização de formato (WebP/AVIF)
 * - Prevenção de Cumulative Layout Shift (CLS)
 *
 * Substitua <img> por <Image> em toda a aplicação.
 */
export function ImageOptimizationExample() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Exemplo: next/image
      </h3>

      {/* Imagem remota — configure next.config.mjs > images > remotePatterns */}
      <Image
        src="https://images.unsplash.com/photo-1707343843598-3971a9b83071"
        alt="Exemplo de imagem otimizada"
        width={800}
        height={400}
        className="rounded-lg"
        priority={false}
        placeholder="empty"
      />

      {/* Imagem local — coloque em apps/web/public/ */}
      {/* <Image
        src="/my-image.png"
        alt="Imagem local"
        width={400}
        height={300}
        className="rounded-lg"
      /> */}
    </div>
  );
}
