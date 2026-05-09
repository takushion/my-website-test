/**
 * エージェント移動ロジック
 *
 * 右手法による迷路探索とフォロワー追従を提供する。
 * MazeCanvas から呼ばれる純粋関数群。
 */

import { Position, Direction, AgentState } from "./types";

/** 右手法の優先順テーブル（現在方向 → [右, 前, 左, 後]） */
const RIGHT_HAND_PRIORITIES: Record<Direction, Direction[]> = {
  up:    ["right", "up",    "left",  "down"],
  right: ["down",  "right", "up",    "left"],
  down:  ["left",  "down",  "right", "up"],
  left:  ["up",    "left",  "down",  "right"],
};

/** 方向ベクトル */
const DIR_VECTORS: Record<Direction, Position> = {
  up:    { x:  0, y: -1 },
  right: { x:  1, y:  0 },
  down:  { x:  0, y:  1 },
  left:  { x: -1, y:  0 },
};

/**
 * 右手法で次の進行方向を決定する
 * 現在の方向を基準に右→前→左→後ろの順で通路を探す
 */
export function rightHandMove(
  pos: Position,
  dir: Direction,
  grid: ("wall" | "path")[][],
  cols: number,
  rows: number
): Direction {
  for (const d of RIGHT_HAND_PRIORITIES[dir]) {
    const n = moveInDirection(pos, d);
    if (isPath(n, grid, cols, rows)) return d;
  }
  return dir;
}

/** 指定方向に1歩進んだ座標を返す */
export function moveInDirection(pos: Position, dir: Direction): Position {
  const v = DIR_VECTORS[dir];
  return { x: pos.x + v.x, y: pos.y + v.y };
}

/** 座標が迷路内の通路か判定 */
export function isPath(
  pos: Position,
  grid: ("wall" | "path")[][],
  cols: number,
  rows: number
): boolean {
  return (
    pos.x >= 0 && pos.x < cols &&
    pos.y >= 0 && pos.y < rows &&
    grid[pos.y][pos.x] === "path"
  );
}

/**
 * エージェント全員を1歩移動させる
 * リーダーは右手法、フォロワーは履歴を追従
 */
export function moveAgents(
  agents: AgentState[],
  history: Position[],
  grid: ("wall" | "path")[][],
  cols: number,
  rows: number
): void {
  if (agents.length < 1) return;

  // リーダー移動（右手法）
  const leader = agents[0];
  const nd = rightHandMove(leader.pos, leader.direction, grid, cols, rows);
  const np = moveInDirection(leader.pos, nd);
  leader.pos = np;
  leader.direction = nd;
  history.push({ ...np });
  if (history.length > 256) history.shift();

  // フォロワー追従
  followLeader(agents[1], history, 1, leader.direction);
  followLeader(agents[2], history, 2, leader.direction);
}

/** フォロワーを履歴の指定遅延位置に移動 */
function followLeader(
  follower: AgentState | undefined,
  history: Position[],
  delay: number,
  direction: Direction
): void {
  if (!follower || history.length === 0) return;
  const idx = Math.max(0, history.length - 1 - delay);
  follower.pos = { ...history[idx] };
  follower.direction = direction;
}
