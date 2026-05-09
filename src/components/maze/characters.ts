/**
 * 9種のドット絵キャラクター（かわいい人型）
 *
 * 各キャラは 8×8 ドットで描画。cellSize 内に収まる。
 * 進行方向に応じて向きを変える（前後左右の4パターン）。
 */

import { Direction } from "./types";

/** キャラ描画関数: (ctx, x, y, cellSize, direction) */
export type CharacterDrawFn = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  direction: Direction
) => void;

/* ── ドット描画ヘルパー ── */
const D = 1 / 8;
function d(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, s: number,
  px: number, py: number, color: string
): void {
  ctx.fillStyle = color;
  ctx.fillRect(x + px * s * D, y + py * s * D, s * D + 1, s * D + 1);
}

/* ── 方向別の座標変換テーブル（8×8→回転） ── */
type RotFn = (px: number, py: number) => [number, number];
function rotUp(px: number, py: number): [number, number] { return [px, py]; }
function rotDown(px: number, py: number): [number, number] { return [7 - px, 7 - py]; }
function rotLeft(px: number, py: number): [number, number] { return [py, 7 - px]; }
function rotRight(px: number, py: number): [number, number] { return [7 - py, px]; }

function getRot(dir: Direction): RotFn {
  switch (dir) {
    case "up": return rotUp;
    case "down": return rotDown;
    case "left": return rotLeft;
    case "right": return rotRight;
  }
}

/** 同じ色のドットをまとめて描く */
function dots(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, s: number, dir: Direction,
  color: string,
  ...coords: [number, number][]
): void {
  const rot = getRot(dir);
  for (const [px, py] of coords) {
    const [rx, ry] = rot(px, py);
    d(ctx, x, y, s, rx, ry, color);
  }
}

/* ────────────────────────────────────────
   9 キャラクター定義（上向き基準）
   ──────────────────────────────────────── */

function drawGirl(
  ctx: CanvasRenderingContext2D, x: number, y: number, s: number, dir: Direction,
  hair: string, skin: string, dress: string, ribbon: string
): void {
  // 髪
  dots(ctx, x, y, s, dir, hair,
    [2,0],[3,0],[4,0],[5,0],
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
    [0,2],[1,2],[6,2],[7,2],
  );
  // 顔
  dots(ctx, x, y, s, dir, skin, [2,2],[3,2],[4,2],[5,2]);
  // 目
  dots(ctx, x, y, s, dir, "#222", [2,3],[5,3]);
  // ほっぺ
  dots(ctx, x, y, s, dir, "#f8a4a4", [1,3],[6,3]);
  // 口
  dots(ctx, x, y, s, dir, "#d66", [3,4],[4,4]);
  // リボン
  dots(ctx, x, y, s, dir, ribbon, [2,1],[5,1]);
  // ワンピース
  dots(ctx, x, y, s, dir, dress,
    [2,5],[3,5],[4,5],[5,5],
    [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
    [1,7],[2,7],[5,7],[6,7],
  );
  // 足
  dots(ctx, x, y, s, dir, skin, [2,7],[5,7]);
}

function drawBoy(
  ctx: CanvasRenderingContext2D, x: number, y: number, s: number, dir: Direction,
  hair: string, skin: string, top: string, bottom: string
): void {
  // 髪
  dots(ctx, x, y, s, dir, hair,
    [2,0],[3,0],[4,0],[5,0],
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],
  );
  // 顔
  dots(ctx, x, y, s, dir, skin, [2,2],[3,2],[4,2],[5,2]);
  // 目
  dots(ctx, x, y, s, dir, "#222", [2,3],[5,3]);
  // 口
  dots(ctx, x, y, s, dir, "#888", [3,4],[4,4]);
  // 上半身
  dots(ctx, x, y, s, dir, top,
    [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],
    [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],
  );
  // 下半身
  dots(ctx, x, y, s, dir, bottom,
    [2,7],[3,7],[4,7],[5,7],
  );
}

export const CHARACTERS: CharacterDrawFn[] = [
  // 0: 茶髪おさげの女の子（ピンクワンピ）
  (ctx, x, y, s, dir) => drawGirl(ctx, x, y, s, dir, "#8B5E3C", "#FDDCB5", "#F8BBD0", "#E91E63"),
  // 1: 黒髪ボブの女の子（赤ワンピ）
  (ctx, x, y, s, dir) => drawGirl(ctx, x, y, s, dir, "#2c2c2c", "#FFE0BD", "#EF5350", "#B71C1C"),
  // 2: 金髪ツインテの女の子（水色ワンピ）
  (ctx, x, y, s, dir) => drawGirl(ctx, x, y, s, dir, "#F4D03F", "#FFF3E0", "#81D4FA", "#F4D03F"),
  // 3: 赤毛ショートの女の子（緑ワンピ）
  (ctx, x, y, s, dir) => drawGirl(ctx, x, y, s, dir, "#C0392B", "#FFCCBC", "#A5D6A7", "#C0392B"),
  // 4: 銀髪ロングの女の子（紫ワンピ）
  (ctx, x, y, s, dir) => drawGirl(ctx, x, y, s, dir, "#B0BEC5", "#F5F5F5", "#CE93D8", "#9C27B0"),
  // 5: 茶髪の男の子（青トップス）
  (ctx, x, y, s, dir) => drawBoy(ctx, x, y, s, dir, "#6D4C41", "#FFE0BD", "#42A5F5", "#37474F"),
  // 6: 黒髪の男の子（緑トップス）
  (ctx, x, y, s, dir) => drawBoy(ctx, x, y, s, dir, "#1a1a1a", "#FFCCBC", "#66BB6A", "#33691E"),
  // 7: 金髪の男の子（オレンジトップス）
  (ctx, x, y, s, dir) => drawBoy(ctx, x, y, s, dir, "#FFD54F", "#FFF3E0", "#FF7043", "#BF360C"),
  // 8: 白髪の男の子（グレートップス）
  (ctx, x, y, s, dir) => drawBoy(ctx, x, y, s, dir, "#CFD8DC", "#F5F5F5", "#78909C", "#455A64"),
];

/** ランダムに3体のキャラインデックスを選出（重複なし） */
export function pickRandomCharacters(): number[] {
  const indices = Array.from({ length: CHARACTERS.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, 3);
}
