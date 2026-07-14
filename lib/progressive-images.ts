import fs from "node:fs";
import path from "node:path";

export type ProgressiveImageVariant = {
  src: string;
  width: number;
};

export type ProgressiveImageAsset = {
  width: number;
  height: number;
  placeholder: string;
  formats: {
    avif: ProgressiveImageVariant[];
    webp: ProgressiveImageVariant[];
    jpeg: ProgressiveImageVariant[];
  };
};

type ProgressiveImageManifest = {
  version: 1;
  assets: Record<string, ProgressiveImageAsset & { sourceHash: string }>;
};

let manifestCache: ProgressiveImageManifest | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isVariant(value: unknown): value is ProgressiveImageVariant {
  return (
    isRecord(value) &&
    typeof value.src === "string" &&
    value.src.startsWith("/_generated/images/") &&
    Number.isInteger(value.width) &&
    Number(value.width) > 0
  );
}

function isAsset(value: unknown): value is ProgressiveImageAsset & { sourceHash: string } {
  if (!isRecord(value) || !isRecord(value.formats)) return false;
  const formats = value.formats;
  return (
    Number.isInteger(value.width) &&
    Number(value.width) > 0 &&
    Number.isInteger(value.height) &&
    Number(value.height) > 0 &&
    typeof value.placeholder === "string" &&
    value.placeholder.startsWith("data:image/") &&
    typeof value.sourceHash === "string" &&
    [formats.avif, formats.webp, formats.jpeg].every(
      (variants) => Array.isArray(variants) && variants.length > 0 && variants.every(isVariant)
    )
  );
}

function readManifest(): ProgressiveImageManifest {
  if (manifestCache) return manifestCache;

  const manifestPath = path.join(process.cwd(), ".generated", "images-manifest.json");
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(
      `Could not read generated image manifest at ${manifestPath}. Run \"npm run images:generate\" first. ${String(error)}`
    );
  }

  if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.assets)) {
    throw new Error(`Generated image manifest at ${manifestPath} has an unsupported structure.`);
  }
  for (const [key, asset] of Object.entries(parsed.assets)) {
    if (!isAsset(asset)) {
      throw new Error(`Generated image manifest contains an invalid record for \"${key}\".`);
    }
  }

  manifestCache = parsed as ProgressiveImageManifest;
  return manifestCache;
}

export function getProgressiveImageAsset(key: string): ProgressiveImageAsset {
  const asset = readManifest().assets[key];
  if (!asset) {
    throw new Error(
      `No generated people image matches \"${key}\". Add the source to assets/people and run \"npm run images:generate\".`
    );
  }

  return {
    width: asset.width,
    height: asset.height,
    placeholder: asset.placeholder,
    formats: asset.formats
  };
}
