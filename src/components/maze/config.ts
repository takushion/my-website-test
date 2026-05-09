/**
 * アプリケーション全体の設定定数
 *
 * 調整が必要な値はここに集約し、各モジュールから import する。
 */

/** 全フェーズ共通の tick 間隔（フレーム数） */
export const TICK = 20;

/** 掘削用 tick（TICKの1/2＝倍速） */
export const BUILD_TICK = Math.floor(TICK / 2);

/** 充電完了までのステップ数（TICK × この値 フレームで完了） */
export const INIT_STEPS = 25;

/** フォロワーの遅延歩数 */
export const FOLLOWER1_DELAY = 1;
export const FOLLOWER2_DELAY = 2;

/** 入場アニメーション: 1体あたりのフレーム数 */
export const ENTER_TOTAL_FRAMES = 40;
/** 入場アニメーション: キャラ間の間隔フレーム数 */
export const ENTER_GAP_FRAMES = 15;

/** 履歴バッファの最大長 */
export const HISTORY_MAX = 256;

/** 迷路生成の最低セル数（短辺に確保するセル数） */
export const MAZE_MIN_CELLS_SHORT_SIDE = 9;
/** 迷路の最低列数/行数 */
export const MAZE_MIN_DIM = 7;

/** 迷路の色（森テーマ） */
export const COLOR_WALL = "#1a3a1a";
export const COLOR_PATH = "#4a6b3a";
export const COLOR_GOAL = "#e05040";
export const COLOR_WALL_TOP = "#2d5a27";
export const COLOR_HIGHLIGHT = "#e8a838";
