/**
 * 9種の人間キャラクター描画関数
 * 丸（頭）+ 三角（体、進行方向を指す）
 * 遠目でも識別できるシルエット
 */

import { Direction } from "./types";

export type CharacterDrawFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: Direction
) => void;

/** カラーパレット */
const PALETTE = [
  { body: "#e74c3c", head: "#c0392b" }, // 赤
  { body: "#3498db", head: "#2471a3" }, // 青
  { body: "#2ecc71", head: "#1e8449" }, // 緑
  { body: "#f39c12", head: "#d68910" }, // オレンジ
  { body: "#9b59b6", head: "#7d3c98" }, // 紫
  { body: "#f1c40f", head: "#d4ac0d" }, // 黄
  { body: "#1abc9c", head: "#148f77" }, // ターコイズ
  { body: "#e91e63", head: "#ad1457" }, // ピンク
  { body: "#795548", head: "#5d4037" }, // 茶
];

/** 方向ベクトル */
const DIR_VEC: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

function drawHuman(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: Direction,
  bodyColor: string,
  headColor: string
): void {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.38; // 半径
  const vec = DIR_VEC[direction];

  // 体（進行方向に伸びる三角）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(cx + vec.dx * r * 0.8, cy + vec.dy * r * 0.8); // 先端
  ctx.lineTo(cx - vec.dy * r * 0.55, cy + vec.dx * r * 0.55); // 左肩
  ctx.lineTo(cx + vec.dy * r * 0.55, cy - vec.dx * r * 0.55); // 右肩
  ctx.closePath();
  ctx.fill();

  // 輪郭線でシルエット強調
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = size * 0.04;
  ctx.stroke();

  // 頭（丸）
  ctx.fillStyle = headColor;
  ctx.beginPath();
  ctx.arc(cx - vec.dx * r * 0.3, cy - vec.dy * r * 0.3, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 足（小さな丸2つ）
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(cx - vec.dy * r * 0.35 + vec.dx * r * 0.7, cy + vec.dx * r * 0.35 + vec.dy * r * 0.7, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + vec.dy * r * 0.35 + vec.dx * r * 0.7, cy - vec.dx * r * 0.35 + vec.dy * r * 0.7, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

export const CHARACTERS: CharacterDrawFn[] = PALETTE.map((c) => {
  return (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, direction: Direction) => {
    drawHuman(ctx, x, y, size, direction, c.body, c.head);
  };
});

/** ランダムに3体のキャラインデックスを選出（重複なし） */
export function pickRandomCharacters(): number[] {
  const indices = Array.from({ length: CHARACTERS.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, 3);
}
