/**
 * 型定義
 *
 * 迷路のセル種別、座標、進行方向、エージェント状態、アプリ全体のフェーズを定義する。
 */

/** 迷路のセル種別: 壁か通路か */
export type CellType = "wall" | "path";

/** 迷路のグリッド座標 (0-indexed) */
export interface Position {
  x: number;
  y: number;
}

/** エージェントの進行方向 */
export type Direction = "up" | "right" | "down" | "left";

/** エージェント単体の状態 */
export interface AgentState {
  pos: Position;
  direction: Direction;
  /** キャラクター種別 (0-8) */
  characterIndex: number;
}

/**
 * アプリ全体のフェーズ遷移:
 *   INIT → BUILDING → ENTERING → EXPLORING
 *   EXPLORING でゴール到達 → BUILDING に戻る（再生成）
 */
export type AppPhase =
  | "INIT"
  | "BUILDING"
  | "ENTERING"
  | "EXPLORING";
