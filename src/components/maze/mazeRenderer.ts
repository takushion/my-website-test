/**
 * Canvas 描画ユーティリティ
 *
 * 迷路の描画、セルハイライト、座標変換を行う。
 * 迷路はキャンバス中央に描画し、余白は壁色で塗りつぶす。
 */

import { CellType, Position } from "./types";

/** 森テーマの色パレット */
const WALL_COLOR = "#1a3a1a";
const PATH_COLOR = "#4a6b3a";
const HIGHLIGHT_COLOR = "#e05040";
const WALL_TOP = "#2d5a27";

/**
 * 迷路全体を Canvas に描画
 * 全体を壁色で塗りつぶし → 通路を描画 → 壁の上面に立体感を追加
 */
export function drawMaze(
  ctx: CanvasRenderingContext2D,
  grid: CellType[][],
  cols: number,
  rows: number,
  cellSize: number
): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.fillStyle = WALL_COLOR;
  ctx.fillRect(0, 0, w, h);

  const mazeW = cols * cellSize;
  const mazeH = rows * cellSize;
  const ox = Math.floor((w - mazeW) / 2);
  const oy = Math.floor((h - mazeH) / 2);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === "path") {
        ctx.fillStyle = PATH_COLOR;
        ctx.fillRect(ox + x * cellSize, oy + y * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(ox + x * cellSize, oy + y * cellSize, cellSize, cellSize);
        ctx.fillStyle = WALL_TOP;
        ctx.fillRect(ox + x * cellSize, oy + y * cellSize, cellSize, 2);
        ctx.fillRect(ox + x * cellSize, oy + y * cellSize, 2, cellSize);
      }
    }
  }
}

/**
 * 単一セルをハイライト描画（ゴール表示 / 掘削中表示）
 */
export function drawCellHighlight(
  ctx: CanvasRenderingContext2D,
  pos: Position,
  cols: number,
  rows: number,
  cellSize: number
): void {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const ox = Math.floor((w - cols * cellSize) / 2);
  const oy = Math.floor((h - rows * cellSize) / 2);
  ctx.fillStyle = HIGHLIGHT_COLOR;
  ctx.fillRect(ox + pos.x * cellSize + 1, oy + pos.y * cellSize + 1, cellSize - 2, cellSize - 2);
}

/**
 * グリッド座標 → キャンバス座標（ピクセル中央）
 */
export function gridToCanvas(
  pos: Position,
  cols: number,
  rows: number,
  cellSize: number,
  canvasW: number,
  canvasH: number
): { x: number; y: number } {
  const ox = Math.floor((canvasW - cols * cellSize) / 2);
  const oy = Math.floor((canvasH - rows * cellSize) / 2);
  return {
    x: ox + pos.x * cellSize + cellSize / 2,
    y: oy + pos.y * cellSize + cellSize / 2,
  };
}

/**
 * キャンバス座標 → グリッド座標（クリック判定用）
 */
export function canvasToGrid(
  canvasX: number,
  canvasY: number,
  cols: number,
  rows: number,
  cellSize: number,
  canvasW: number,
  canvasH: number
): Position {
  const ox = Math.floor((canvasW - cols * cellSize) / 2);
  const oy = Math.floor((canvasH - rows * cellSize) / 2);
  return {
    x: Math.floor((canvasX - ox) / cellSize),
    y: Math.floor((canvasY - oy) / cellSize),
  };
}
