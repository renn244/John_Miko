import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

const frontendRoot = path.resolve(import.meta.dirname, "..");
const publicTourRoot = path.join(frontendRoot, "public", "virtual-tour");

const usage = `
Usage:
  npm run generate:tour-assets -- --input <panorama.jpg> --scene <scene-id>

Options:
  --cols <number>          Tile columns (default: 8)
  --rows <number>          Tile rows (default: 4)
  --preview-width <pixels> Preview image width (default: 2048)
`;

const parseArgs = (args) => {
    const values = {};

    for (let index = 0; index < args.length; index += 2) {
        const key = args[index];
        const value = args[index + 1];

        if (!key?.startsWith("--") || !value) {
            throw new Error("Arguments must use --name value pairs.");
        }

        values[key.slice(2)] = value;
    }

    return values;
};

const parsePositiveInteger = (value, name, fallback) => {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);

    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
        throw new Error(`${name} must be a positive integer.`);
    }

    return parsed;
};

const isPowerOfTwo = (value) => (value & (value - 1)) === 0;

const main = async () => {
    const args = parseArgs(process.argv.slice(2));
    const input = args.input ? path.resolve(frontendRoot, args.input) : null;
    const sceneId = args.scene;
    const cols = parsePositiveInteger(args.cols, "--cols", 8);
    const rows = parsePositiveInteger(args.rows, "--rows", 4);
    const previewWidth = parsePositiveInteger(args["preview-width"], "--preview-width", 2048);

    if (!input || !sceneId) {
        throw new Error("Both --input and --scene are required.");
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sceneId)) {
        throw new Error("--scene must use lowercase letters, numbers, and hyphens only.");
    }

    if (!isPowerOfTwo(cols) || !isPowerOfTwo(rows) || cols !== rows * 2) {
        throw new Error("Equirectangular tiles require power-of-two columns and rows with a 2:1 grid, such as 8x4.");
    }

    const source = sharp(input, { limitInputPixels: false });
    const metadata = await source.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error("The input image dimensions could not be read.");
    }

    if (Math.abs(metadata.width / metadata.height - 2) > 0.01) {
        throw new Error("The input must be a 2:1 equirectangular panorama.");
    }

    const tileSize = Math.ceil(metadata.width / cols);
    const panoramaWidth = tileSize * cols;
    const panoramaHeight = tileSize * rows;
    const sceneDirectory = path.join(publicTourRoot, "scenes", sceneId);
    const tilesDirectory = path.join(sceneDirectory, "tiles");

    await rm(sceneDirectory, { recursive: true, force: true });
    await mkdir(tilesDirectory, { recursive: true });

    const { data, info } = await source
        .resize({ width: panoramaWidth, height: panoramaHeight, fit: "fill" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const rawImage = () =>
        sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels,
            },
        });

    const actualPreviewWidth = Math.min(previewWidth, panoramaWidth);

    await rawImage()
        .resize({ width: actualPreviewWidth, height: actualPreviewWidth / 2, fit: "fill" })
        .jpeg({ quality: 70, chromaSubsampling: "4:2:0" })
        .toFile(path.join(sceneDirectory, "preview.jpg"));

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
            await rawImage()
                .extract({ left: col * tileSize, top: row * tileSize, width: tileSize, height: tileSize })
                .jpeg({ quality: 82, chromaSubsampling: "4:2:0" })
                .toFile(path.join(tilesDirectory, `${row}_${col}.jpg`));
        }
    }

    const manifest = {
        projection: "equirectangular",
        width: panoramaWidth,
        height: panoramaHeight,
        cols,
        rows,
        tileSize,
        preview: "preview.jpg",
        tilePattern: "tiles/{row}_{col}.jpg",
    };

    await writeFile(path.join(sceneDirectory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

    console.log(`Generated ${sceneId}: ${cols * rows} tiles and a ${actualPreviewWidth}px preview.`);
    console.log(`Output: ${path.relative(frontendRoot, sceneDirectory)}`);
};

main().catch((error) => {
    console.error(`Could not generate virtual-tour assets: ${error.message}`);
    console.error(usage);
    process.exitCode = 1;
});
