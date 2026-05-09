/**
 * 迷路生成エンジン
 *
 * DFS（深さ優先探索）再帰バックトラック法で迷路を生成する。
 * nextStep() を呼ぶたびに1手ずつ掘り進むイテレータ方式。
 * 外周は壁固定。奇数座標に通路セルを置き、間の偶数座標は通路か壁。
 */

import { CellType, Position } from "./types";

/**
 * DFS 再帰バックトラックによる迷路生成器
 *
 * アルゴリズム:
 *   1. 全セルを壁で初期化
 *   2. 外周内のランダム奇数座標を開始地点に
 *   3. 現在地から「2マス先」の未訪問セルをランダムに選ぶ
 *   4. 選んだセルと間の壁を通路に変更
 *   5. 未訪問が尽きたらスタックをポップして戻る
 *   6. スタック空で全セル訪問＝迷路完成
 */
export class MazeGenerator {
  private grid: CellType[][];
  private visited: boolean[][];
  private stack: Position[];
  private current: Position;
  private startPos: Position;
  private lastCarved: Position;
  private _done: boolean;
  private _cols: number;
  private _rows: number;

  /**
   * @param cols 列数（外周込みの奇数）
   * @param rows 行数（外周込みの奇数）
   */
  constructor(cols: number, rows: number) {
    this._cols = cols;
    this._rows = rows;
    this.grid = Array.from({ length: rows }, () =>
      Array(cols).fill("wall" as const)
    );
    this.visited = Array.from({ length: rows }, () =>
      Array(cols).fill(false)
    );

    const startX = randomOdd(1, cols - 2);
    const startY = randomOdd(1, rows - 2);
    this.current = { x: startX, y: startY };
    this.startPos = { x: startX, y: startY };
    this.lastCarved = { x: startX, y: startY };
    this.grid[startY][startX] = "path";
    this.visited[startY][startX] = true;
    this.stack = [];
    this._done = false;
  }

  /** 1ステップ掘り進める。完了したら true */
  nextStep(): boolean {
    if (this._done) return true;

    const neighbors = this.getUnvisitedNeighbors(this.current);
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.stack.push(this.current);
      const midX = (this.current.x + next.x) / 2;
      const midY = (this.current.y + next.y) / 2;
      this.grid[midY][midX] = "path";
      this.grid[next.y][next.x] = "path";
      this.visited[next.y][next.x] = true;
      this.current = next;
      this.lastCarved = { ...next };
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop()!;
    } else {
      this._done = true;
    }
    return this._done;
  }

  getGrid(): CellType[][] { return this.grid; }
  /** DFSが現在いる座標 */
  getCurrent(): Position { return this.current; }
  /** 迷路生成の開始地点 */
  getStartPosition(): Position { return this.startPos; }
  /** 最後に掘った通路セル（ゴールとして使用） */
  getLastPosition(): Position { return this.lastCarved; }
  isComplete(): boolean { return this._done; }
  getCols(): number { return this._cols; }
  getRows(): number { return this._rows; }

  /** 現在地から2マス先の未訪問セル一覧（外周内のみ） */
  private getUnvisitedNeighbors(pos: Position): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { dx: 0, dy: -2 }, { dx: 2, dy: 0 }, { dx: 0, dy: 2 }, { dx: -2, dy: 0 },
    ];
    for (const d of directions) {
      const nx = pos.x + d.dx;
      const ny = pos.y + d.dy;
      if (
        nx >= 1 && nx < this._cols - 1 &&
        ny >= 1 && ny < this._rows - 1 &&
        !this.visited[ny][nx]
      ) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    return neighbors;
  }
}

/** 範囲 [min, max] 内のランダムな奇数を返す */
function randomOdd(min: number, max: number): number {
  let n = min + Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2;
  if (n % 2 === 0) n++;
  if (n > max) n = max - (max % 2 === 0 ? 1 : 0);
  return n;
}

/**
 * ビューポートサイズから迷路の列数・行数を計算
 *
 * 短辺 ÷ 9 を基準セルサイズとし、そこから列数・行数を決める。
 * 縦長画面なら縦長迷路、横長画面なら横長迷路になる。
 * 列数・行数は常に奇数（外周壁込み）。
 */
export function calcMazeDimensions(
  viewW: number,
  viewH: number
): { cols: number; rows: number } {
  const short = Math.min(viewW, viewH);
  const cellSize = Math.floor(short / 9);
  let cols = Math.floor(viewW / cellSize);
  let rows = Math.floor(viewH / cellSize);
  if (cols % 2 === 0) cols++;
  if (rows % 2 === 0) rows++;
  if (cols < 7) cols = 7;
  if (rows < 7) rows = 7;
  return { cols, rows };
}
