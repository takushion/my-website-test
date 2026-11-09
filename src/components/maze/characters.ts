/**
 * 16×16ドット絵のチンチラキャラクター。
 * 共通の丸耳・ふっくらした輪郭に、毛色と小物を加えて9種類に描き分ける。
 */
import { Direction } from "./types";

export type CharacterDrawFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: Direction
) => void;

const PIXEL_SIZE = 16;
const SPRITE = [
  "....DD....DD....",
  "...DPPD..DPPD...",
  "..DFFFFDDFFFFD..",
  ".DFFFFFFFFFFFFD.",
  "DFFFFFFFFFFFFFFD",
  "DFFFFFFFFFFFFFFD",
  "DFFEEFFFFFFFFEED",
  "DFFFFFFFFFFFFFFD",
  "DFFLLLNNLLLLLFFD",
  "DFFCCFFFFFFCCFFD",
  ".DFFFFFFFFFFFFD.",
  "..DFFFFFFFFFFD..",
  "...DFFFFFFFFD...",
  "...DFFFFFFFFD...",
  "...DD......DD...",
  ".....DFFFFD.....",
];

type Palette = Record<"D" | "F" | "L" | "P" | "E" | "C" | "N", string>;
type Pixel = readonly [x: number, y: number];

interface CharacterStyle {
  palette: Palette;
  accessory: string;
  accessoryPixels: readonly Pixel[];
}

const STYLES: CharacterStyle[] = [
  { palette: { D: "#57483e", F: "#b98d69", L: "#f5e2c8", P: "#d9959b", E: "#292222", C: "#ed9ba6", N: "#c86c78" }, accessory: "#e95878", accessoryPixels: [[7, 4], [8, 4], [7, 5], [8, 5]] },
  { palette: { D: "#55423d", F: "#cfb99f", L: "#f7eddd", P: "#c9858c", E: "#211c1a", C: "#e88e98", N: "#b96c77" }, accessory: "#75aadb", accessoryPixels: [[7, 4], [8, 4], [6, 5], [9, 5]] },
  { palette: { D: "#66502f", F: "#e7c978", L: "#fff0c7", P: "#e3a0a0", E: "#30251e", C: "#f0a1a5", N: "#d77d86" }, accessory: "#f2d35e", accessoryPixels: [[7, 3], [8, 3], [6, 4], [9, 4], [7, 5], [8, 5]] },
  { palette: { D: "#543f3a", F: "#b56d54", L: "#f5d9c4", P: "#d98f83", E: "#281c1a", C: "#e89491", N: "#bf6c67" }, accessory: "#8abf69", accessoryPixels: [[7, 4], [8, 4], [7, 5]] },
  { palette: { D: "#55525b", F: "#d6d5d8", L: "#fffafa", P: "#e6a6b0", E: "#25232b", C: "#efabb8", N: "#c87f90" }, accessory: "#b58bd1", accessoryPixels: [[7, 4], [8, 4], [6, 5], [9, 5]] },
  { palette: { D: "#51443d", F: "#d9b995", L: "#fff0dc", P: "#cf9290", E: "#29201d", C: "#e69c98", N: "#bd7774" }, accessory: "#4c92d1", accessoryPixels: [[7, 12], [8, 12], [6, 12], [9, 12]] },
  { palette: { D: "#383838", F: "#96918b", L: "#eee9e2", P: "#bb8388", E: "#181818", C: "#d98b91", N: "#ae626b" }, accessory: "#79b879", accessoryPixels: [[7, 4], [8, 4], [7, 5], [8, 5]] },
  { palette: { D: "#72563c", F: "#e9c28e", L: "#fff1d8", P: "#e79b9c", E: "#30231b", C: "#f0a0a5", N: "#cf777c" }, accessory: "#e87a42", accessoryPixels: [[7, 3], [8, 3], [6, 4], [9, 4]] },
  { palette: { D: "#706d69", F: "#b7b9bb", L: "#f3f3f0", P: "#d29a9e", E: "#282828", C: "#e6a0a3", N: "#bb7f86" }, accessory: "#e6c84e", accessoryPixels: [[7, 4], [8, 4], [7, 5]] },
];

/** 16×16座標を進行方向に回転し、ドットをセル内に描画する */
function rotatePixel(x: number, y: number, direction: Direction): Pixel {
  switch (direction) {
    case "up": return [x, y];
    case "right": return [PIXEL_SIZE - 1 - y, x];
    case "down": return [PIXEL_SIZE - 1 - x, PIXEL_SIZE - 1 - y];
    case "left": return [y, PIXEL_SIZE - 1 - x];
  }
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number,
  direction: Direction,
  palette: Palette,
  px: number,
  py: number,
  symbol: keyof Palette
): void {
  const [rx, ry] = rotatePixel(px, py, direction);
  ctx.fillStyle = palette[symbol];
  ctx.fillRect(x + rx * pixelSize, y + ry * pixelSize, pixelSize, pixelSize);
}

function drawChinchilla(
  style: CharacterStyle,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: Direction
): void {
  const pixelSize = size / PIXEL_SIZE;

  SPRITE.forEach((row, py) => {
    row.split("").forEach((symbol, px) => {
      if (symbol !== ".") {
        drawPixel(ctx, x, y, pixelSize, direction, style.palette, px, py, symbol as keyof Palette);
      }
    });
  });

  // 種類ごとのリボン・帽子・スカーフなどを追加
  style.accessoryPixels.forEach(([px, py]) => {
    const [rx, ry] = rotatePixel(px, py, direction);
    ctx.fillStyle = style.accessory;
    ctx.fillRect(x + rx * pixelSize, y + ry * pixelSize, pixelSize, pixelSize);
  });
}
export const CHARACTERS: CharacterDrawFn[] = STYLES.map((style) => (
  ctx, x, y, size, direction
) => drawChinchilla(style, ctx, x, y, size, direction));

/** ランダムに3体のキャラインデックスを重複なしで選ぶ */
export function pickRandomCharacters(): number[] {
  const indices = Array.from({ length: CHARACTERS.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, 3);
}
