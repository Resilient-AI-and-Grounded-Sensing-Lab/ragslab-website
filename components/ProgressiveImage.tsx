"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { assetPath } from "@/lib/assets";
import type { ProgressiveImageAsset, ProgressiveImageVariant } from "@/lib/progressive-images";

export type ProgressiveImageProps = {
  asset: ProgressiveImageAsset;
  alt: string;
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  objectFit?: CSSProperties["objectFit"];
};

type LoadState = "loading" | "loaded" | "error";

function srcSet(variants: ProgressiveImageVariant[]) {
  return variants.map((variant) => `${assetPath(variant.src)} ${variant.width}w`).join(", ");
}

export function ProgressiveImage({
  asset,
  alt,
  sizes,
  loading = "lazy",
  fetchPriority = "auto",
  className = "",
  objectFit = "cover"
}: ProgressiveImageProps) {
  const fallback = asset.formats.jpeg.at(-1);

  if (!fallback) {
    throw new Error("Progressive image assets require at least one JPEG fallback.");
  }

  const imageRef = useRef<HTMLImageElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  const revealWhenDecoded = useCallback((image: HTMLImageElement) => {
    if (!image.complete || image.naturalWidth === 0) return;

    const reveal = () => {
      if (image.complete && image.naturalWidth > 0) setLoadState("loaded");
    };
    if (typeof image.decode === "function") {
      image.decode().then(reveal).catch(reveal);
    } else {
      reveal();
    }
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image?.complete) return;
    if (image.naturalWidth === 0) {
      setLoadState("error");
      return;
    }
    revealWhenDecoded(image);
  }, [revealWhenDecoded]);

  return (
    <span
      className={`progressive-image ${className}`.trim()}
      data-load-state={loadState}
      style={{
        aspectRatio: `${asset.width} / ${asset.height}`,
        backgroundImage: `url(${JSON.stringify(asset.placeholder)})`
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(asset.formats.avif)} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(asset.formats.webp)} sizes={sizes} />
        <img
          ref={imageRef}
          src={assetPath(fallback.src)}
          srcSet={srcSet(asset.formats.jpeg)}
          sizes={sizes}
          width={asset.width}
          height={asset.height}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          style={{ objectFit }}
          onLoad={(event) => revealWhenDecoded(event.currentTarget)}
          onError={() => setLoadState("error")}
        />
      </picture>
      <noscript>
        <style>{`.progressive-image img { opacity: 1 !important; }`}</style>
      </noscript>
    </span>
  );
}
