import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const brandDir = path.join(publicDir, "brand");
const peopleDir = path.join(publicDir, "people");

const decorativeImages = [
  "aperture.png",
  "line-drawing.png",
  "pattern.png"
];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function optimizeDecorativeImage(fileName) {
  const source = path.join(brandDir, fileName);
  if (!(await exists(source))) return;

  const { name } = path.parse(fileName);
  const pipeline = sharp(source)
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true
    });

  await Promise.all([
    pipeline.clone().avif({ effort: 6, quality: 58 }).toFile(path.join(brandDir, `${name}.avif`)),
    pipeline.clone().webp({ effort: 6, quality: 78 }).toFile(path.join(brandDir, `${name}.webp`))
  ]);
}

async function optimizePeopleImage(fileName) {
  const source = path.join(peopleDir, fileName);
  const extension = path.extname(fileName).toLowerCase();
  const image = sharp(source).rotate();
  const metadata = await image.metadata();
  const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);

  if (longestEdge <= 640) return false;

  const tempPath = `${source}.tmp${extension}`;
  const resized = image.resize({
    width: 640,
    height: 640,
    fit: "inside",
    withoutEnlargement: true
  });

  if (extension === ".png") {
    await resized.png({ compressionLevel: 9, palette: true }).toFile(tempPath);
  } else if (extension === ".webp") {
    await resized.webp({ effort: 6, quality: 82 }).toFile(tempPath);
  } else {
    await resized.jpeg({ mozjpeg: true, progressive: true, quality: 82 }).toFile(tempPath);
  }

  await fs.rename(tempPath, source);
  return true;
}

async function optimizePeopleImages() {
  if (!(await exists(peopleDir))) return;

  const files = await fs.readdir(peopleDir);
  const imageFiles = files.filter((file) => /\.(jpe?g|png|webp)$/i.test(file));
  const optimized = await Promise.all(imageFiles.map(optimizePeopleImage));
  const count = optimized.filter(Boolean).length;

  if (count > 0) {
    console.log(`Resized ${count} people image${count === 1 ? "" : "s"} to 640px max.`);
  }
}

await Promise.all(decorativeImages.map(optimizeDecorativeImage));
await optimizePeopleImages();
