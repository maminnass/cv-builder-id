import { PHOTO_MAX_BYTES } from "./constants";

export function validatePhotoFile(file: File) {
  const okType = ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type);
  if (!okType) return "type" as const;
  if (file.size > PHOTO_MAX_BYTES) return "size" as const;
  return null;
}

export async function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

export async function cropToJpeg(
  image: HTMLImageElement,
  crop: { x: number; y: number; zoom: number; aspect: "square" | "portrait" },
) {
  const output = 640;
  const aspect = crop.aspect === "portrait" ? 3 / 4 : 1;
  const outW = output;
  const outH = Math.round(output / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");

  const imgAspect = image.width / image.height;
  const viewW = image.width;
  const viewH = image.height;
  const targetAspect = outW / outH;

  let baseW: number;
  let baseH: number;
  if (imgAspect > targetAspect) {
    baseH = viewH / crop.zoom;
    baseW = baseH * targetAspect;
  } else {
    baseW = viewW / crop.zoom;
    baseH = baseW / targetAspect;
  }

  const maxX = Math.max(0, viewW - baseW);
  const maxY = Math.max(0, viewH - baseH);
  const sx = Math.min(maxX, Math.max(0, crop.x * maxX));
  const sy = Math.min(maxY, Math.max(0, crop.y * maxY));

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, outW, outH);
  ctx.drawImage(image, sx, sy, baseW, baseH, 0, 0, outW, outH);
  return canvas.toDataURL("image/jpeg", 0.86);
}
