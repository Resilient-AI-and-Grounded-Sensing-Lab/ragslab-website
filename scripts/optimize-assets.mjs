import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "assets", "people");
const outputDir = path.join(root, "public", "_generated", "images", "people");
const manifestDir = path.join(root, ".generated");
const manifestPath = path.join(manifestDir, "images-manifest.json");
const widths = [72, 144, 216];
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readPreviousManifest() {
  try {
    return JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {
    return null;
  }
}

function variantUrl(fileName) {
  return `/_generated/images/people/${fileName}`;
}

function fileNameFor(name, hash, width, extension) {
  return `${name}-${hash}-${width}.${extension}`;
}

function expectedOutputNames(name, hash) {
  return widths.flatMap((width) => [
    fileNameFor(name, hash, width, "avif"),
    fileNameFor(name, hash, width, "webp"),
    fileNameFor(name, hash, width, "jpg")
  ]);
}

async function canReuse(record, outputNames) {
  if (!record || !record.placeholder || !record.formats) return false;
  const checks = await Promise.all(outputNames.map((file) => pathExists(path.join(outputDir, file))));
  return checks.every(Boolean);
}

function buildVariants(name, hash, extension) {
  return widths.map((width) => ({
    src: variantUrl(fileNameFor(name, hash, width, extension)),
    width
  }));
}

async function generateAsset(sourcePath, sourceFile, hash) {
  const name = path.parse(sourceFile).name;
  let normalized;

  try {
    normalized = await sharp(sourcePath)
      .rotate()
      .resize(216, 216, { fit: "cover", position: "centre" })
      .jpeg({ quality: 95, mozjpeg: true })
      .toBuffer();
  } catch (error) {
    throw new Error(`Could not process people image ${sourceFile}: ${error.message}`);
  }

  await Promise.all(
    widths.flatMap((width) => {
      const resized = sharp(normalized).resize(width, width, { fit: "fill" });
      return [
        resized
          .clone()
          .avif({ effort: 6, quality: 55 })
          .toFile(path.join(outputDir, fileNameFor(name, hash, width, "avif"))),
        resized
          .clone()
          .webp({ effort: 6, quality: 78 })
          .toFile(path.join(outputDir, fileNameFor(name, hash, width, "webp"))),
        resized
          .clone()
          .jpeg({ quality: 82, mozjpeg: true, progressive: true })
          .toFile(path.join(outputDir, fileNameFor(name, hash, width, "jpg")))
      ];
    })
  );

  const placeholder = await sharp(normalized)
    .resize(10, 10, { fit: "fill" })
    .blur(0.8)
    .webp({ quality: 45 })
    .toBuffer();

  return {
    width: 216,
    height: 216,
    placeholder: `data:image/webp;base64,${placeholder.toString("base64")}`,
    formats: {
      avif: buildVariants(name, hash, "avif"),
      webp: buildVariants(name, hash, "webp"),
      jpeg: buildVariants(name, hash, "jpg")
    }
  };
}

async function main() {
  if (!(await pathExists(sourceDir))) {
    throw new Error(`People image source directory does not exist: ${sourceDir}`);
  }

  const directoryEntries = (await fs.readdir(sourceDir, { withFileTypes: true }))
    .filter((entry) => !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name));

  const unsupported = directoryEntries.filter(
    (entry) => !entry.isFile() || !supportedExtensions.has(path.extname(entry.name).toLowerCase())
  );
  if (unsupported.length > 0) {
    throw new Error(`Unsupported entry in assets/people: ${unsupported.map((entry) => entry.name).join(", ")}`);
  }
  if (directoryEntries.length === 0) {
    throw new Error("No people images were found in assets/people.");
  }
  const sourceNames = directoryEntries.map((entry) => path.parse(entry.name).name);
  const duplicateNames = sourceNames.filter((name, index) => sourceNames.indexOf(name) !== index);
  if (duplicateNames.length > 0) {
    throw new Error(
      `People image filenames must have unique names regardless of extension: ${[...new Set(duplicateNames)].join(", ")}`
    );
  }

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(manifestDir, { recursive: true });

  const previousManifest = await readPreviousManifest();
  const assets = {};
  const expectedFiles = new Set();
  let generatedCount = 0;

  for (const entry of directoryEntries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const source = await fs.readFile(sourcePath);
    const hash = createHash("sha256").update(source).digest("hex").slice(0, 12);
    const name = path.parse(entry.name).name;
    const outputNames = expectedOutputNames(name, hash);
    outputNames.forEach((file) => expectedFiles.add(file));

    const previousRecord = previousManifest?.assets?.[entry.name];
    if (previousRecord?.sourceHash === hash && (await canReuse(previousRecord, outputNames))) {
      assets[entry.name] = previousRecord;
      continue;
    }

    assets[entry.name] = {
      sourceHash: hash,
      ...(await generateAsset(sourcePath, entry.name, hash))
    };
    generatedCount += 1;
  }

  const generatedFiles = await fs.readdir(outputDir);
  await Promise.all(
    generatedFiles
      .filter((file) => !expectedFiles.has(file))
      .map((file) => fs.rm(path.join(outputDir, file), { force: true }))
  );

  const manifest = { version: 1, assets };
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    generatedCount > 0
      ? `Generated responsive variants for ${generatedCount} people image${generatedCount === 1 ? "" : "s"}.`
      : "People image variants are up to date."
  );
}

await main();
