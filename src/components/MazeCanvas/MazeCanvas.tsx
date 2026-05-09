/**
 * MazeCanvas — 迷路背景の全画面 Canvas コンポーネント
 *
 * フェーズ:
 *   INIT → BUILDING → ENTERING → EXPLORING (ループ)
 *
 * 責務: Canvas 要素管理、状態保持（useRef）、アニメーションループ、
 *       フェーズ別更新の振り分け。
 * 描画/移動/生成の詳細ロジックは各モジュールに委譲。
 */

import React, { useRef, useEffect, useCallback } from "react";
import { AppPhase, Position, AgentState } from "../maze/types";
import { MazeGenerator, calcMazeDimensions } from "../maze/useMazeGenerator";
import { drawMaze, drawCellHighlight, gridToCanvas } from "../maze/mazeRenderer";
import { CHARACTERS, pickRandomCharacters, CharacterDrawFn } from "../maze/characters";
import { moveAgents as moveAgentsFn } from "../maze/movement";
import {
  TICK, BUILD_TICK, INIT_STEPS,
  ENTER_TOTAL_FRAMES, ENTER_GAP_FRAMES,
} from "../maze/config";
import styles from "./MazeCanvas.module.scss";

// ── 型 ────────────────────────────────────────────
interface MazeCanvasProps { onPhaseChange: (phase: AppPhase) => void; }

interface MazeState {
  phase: AppPhase; generator: MazeGenerator | null;
  grid: ("wall" | "path")[][]; agents: AgentState[];
  selectedChars: CharacterDrawFn[]; history: Position[];
  enterTimer: number; enteredCount: number; enterStartPos: Position;
  tick: number; initStep: number; cols: number; rows: number;
  cellSize: number; goal: Position;
}

// ── コンポーネント ───────────────────────────────
const MazeCanvas: React.FC<MazeCanvasProps> = ({ onPhaseChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<MazeState>({
    phase: "INIT", generator: null, grid: [], agents: [], selectedChars: [],
    history: [], enterTimer: 0, enteredCount: 0, enterStartPos: { x: 0, y: 0 },
    tick: 0, initStep: 0, cols: 21, rows: 15, cellSize: 40, goal: { x: 0, y: 0 },
  });

  const onPCRef = useRef(onPhaseChange);
  onPCRef.current = onPhaseChange;

  // ----- 迷路初期化 -----
  const resetMaze = useCallback((skipInit: boolean) => {
    const c = canvasRef.current; if (!c) return;
    const w = c.width || window.innerWidth, h = c.height || window.innerHeight;
    const { cols, rows } = calcMazeDimensions(w, h);
    const cellSize = Math.floor(Math.min(w / cols, h / rows));
    const gen = new MazeGenerator(cols, rows);
    const ci = pickRandomCharacters();
    const sp = gen.getStartPosition();
    const ch = [ci[0], ci[1], ci[2]].map((i) => CHARACTERS[i]);
    const ag: AgentState[] = ci.map((c2) => ({
      pos: { ...sp }, direction: "right" as const, characterIndex: c2,
    }));
    Object.assign(stateRef.current, {
      phase: skipInit ? "BUILDING" : "INIT", generator: gen, grid: gen.getGrid(),
      agents: ag, selectedChars: ch, history: [{ ...sp }],
      enterTimer: 0, enteredCount: 0, enterStartPos: sp,
      tick: 0, initStep: 0, cols, rows, cellSize, goal: { x: 0, y: 0 },
    });
    onPCRef.current(skipInit ? "BUILDING" : "INIT");
  }, []);

  // ----- アニメーションループ -----
  useEffect(() => {
    resetMaze(false);
    let id: number;
    const loop = () => { const ctx = canvasRef.current?.getContext("2d"); if (ctx) update(ctx); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- リサイズ -----
  useEffect(() => {
    const rs = () => { const c = canvasRef.current; if (c) { c.width = window.innerWidth; c.height = window.innerHeight; } };
    rs(); window.addEventListener("resize", rs); return () => window.removeEventListener("resize", rs);
  }, []);

  // ----- メイン更新 -----
  const update = useCallback((ctx: CanvasRenderingContext2D) => {
    const st = stateRef.current;
    const prev = st.phase;
    const { cols, rows, cellSize } = st;

    switch (st.phase) {
      case "INIT":
        initTick(st, ctx);
        break;
      case "BUILDING":
        drawMaze(ctx, st.grid, cols, rows, cellSize);
        buildingTick(st, ctx);
        break;
      case "ENTERING":
        drawMaze(ctx, st.grid, cols, rows, cellSize);
        if (st.goal.x > 0) drawCellHighlight(ctx, st.goal, cols, rows, cellSize);
        enteringTick(st, ctx);
        break;
      case "EXPLORING":
        drawMaze(ctx, st.grid, cols, rows, cellSize);
        if (st.goal.x > 0) drawCellHighlight(ctx, st.goal, cols, rows, cellSize);
        exploringTick(st, ctx);
        break;
    }

    if (st.phase !== prev) {
      if (st.phase === "ENTERING" && st.generator) st.goal = st.generator.getLastPosition();
      onPCRef.current(st.phase);
    }
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

// ═══════════════════════════════════════════════════
//  フェーズ別更新関数
// ═══════════════════════════════════════════════════

/** INIT: 黒背景 + バッテリーメーター。所定ステップで BUILDING へ */
function initTick(st: MazeState, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  st.tick++;
  if (st.tick >= TICK) { st.tick = 0; st.initStep++; }
  if (st.initStep >= INIT_STEPS) { st.phase = "BUILDING"; return; }
  drawBattery(ctx, st.initStep, INIT_STEPS);
}

/** BUILDING: DFS step-by-step 迷路掘削 */
function buildingTick(st: MazeState, ctx: CanvasRenderingContext2D): void {
  if (!st.generator) return;
  st.tick++;
  if (st.tick >= BUILD_TICK) {
    st.tick = 0;
    if (st.generator.nextStep()) { st.phase = "ENTERING"; st.enterTimer = 0; st.enteredCount = 0; return; }
    st.grid = st.generator.getGrid();
  }
  drawCellHighlight(ctx, st.generator.getCurrent(), st.cols, st.rows, st.cellSize);
}

/** ENTERING: 3体のキャラクター入場演出 */
function enteringTick(st: MazeState, ctx: CanvasRenderingContext2D): void {
  st.enterTimer++;
  const tf = ENTER_TOTAL_FRAMES, gf = ENTER_GAP_FRAMES;
  const { cols, rows, cellSize, enterStartPos: sp } = st;
  const cw = ctx.canvas.width, ch = ctx.canvas.height;

  for (let i = 0; i < 3; i++) {
    const sf = i * (tf + gf);
    if (st.enterTimer <= sf) continue;
    const lt = Math.min(1, (st.enterTimer - sf) / tf);

    if (lt >= 1) {
      if (i >= st.enteredCount) st.enteredCount = i + 1;
      const cp = gridToCanvas(sp, cols, rows, cellSize, cw, ch);
      ctx.save(); ctx.translate(cp.x, cp.y);
      st.selectedChars[i](ctx, -cellSize / 2, -cellSize / 2, cellSize, st.agents[i].direction);
      ctx.restore();
      continue;
    }
    const t = easeOut(lt);
    const cp = gridToCanvas(sp, cols, rows, cellSize, cw, ch);
    const sx = -cellSize + (cp.x + cellSize) * t;
    ctx.save(); ctx.translate(sx, cp.y);
    ctx.scale(0.5 + t * 0.5, 0.5 + t * 0.5);
    st.selectedChars[i](ctx, -cellSize / 2, -cellSize / 2, cellSize, "right");
    ctx.restore();
  }
  if (st.enteredCount >= 3) st.phase = "EXPLORING";
}

/** EXPLORING: 右手法探索 + ゴールチェック + 再生成 */
function exploringTick(st: MazeState, ctx: CanvasRenderingContext2D): void {
  st.tick++;
  if (st.tick >= TICK) { st.tick = 0; moveAgentsFn(st.agents, st.history, st.grid, st.cols, st.rows); }

  // ゴール到達 → 迷路再生成
  if (st.agents[0].pos.x === st.goal.x && st.agents[0].pos.y === st.goal.y) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const { cols, rows } = calcMazeDimensions(w, h);
    const cellSize = Math.floor(Math.min(w / cols, h / rows));
    const gen = new MazeGenerator(cols, rows);
    const ci = pickRandomCharacters(), sp = gen.getStartPosition();
    const ch = [ci[0], ci[1], ci[2]].map((x) => CHARACTERS[x]);
    const ag: AgentState[] = ci.map((c2) => ({
      pos: { ...sp }, direction: "right" as const, characterIndex: c2,
    }));
    Object.assign(st, {
      phase: "BUILDING", generator: gen, grid: gen.getGrid(), agents: ag,
      selectedChars: ch, history: [{ ...sp }],
      enterTimer: 0, enteredCount: 0, enterStartPos: sp,
      tick: 0, initStep: 0, cols, rows, cellSize, goal: { x: 0, y: 0 },
    });
    return;
  }

  // キャラ描画（後ろから）
  const cw = ctx.canvas.width, ch = ctx.canvas.height;
  for (let i = 2; i >= 0; i--) {
    const a = st.agents[i];
    const cp = gridToCanvas(a.pos, st.cols, st.rows, st.cellSize, cw, ch);
    ctx.save(); ctx.translate(cp.x, cp.y);
    st.selectedChars[i](ctx, -st.cellSize / 2, -st.cellSize / 2, st.cellSize, a.direction);
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════
//  バッテリーメーター描画
// ═══════════════════════════════════════════════════

function drawBattery(ctx: CanvasRenderingContext2D, step: number, total: number): void {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const ratio = Math.min(1, step / total);
  const pct = Math.floor(ratio * 100);
  const bw = 160, bh = 70, bx = (w - bw) / 2, by = (h - bh) / 2;
  const capW = 20, capH = 10, pad = 6;

  // 突起
  ctx.fillStyle = "#aaa";
  ctx.fillRect(bx + bw - capW - 4, by - capH, capW + 8, capH + 4);
  // 枠
  ctx.fillStyle = "#222"; ctx.fillRect(bx - 3, by - 3, bw + 6, bh + 6);
  ctx.fillStyle = "#111"; ctx.fillRect(bx, by, bw, bh);
  // 内部
  ctx.fillStyle = "#1a1a1a"; ctx.fillRect(bx + pad, by + pad, bw - pad * 2, bh - pad * 2);
  // 充填
  const fw = (bw - pad * 2) * ratio;
  let fc = "#4CAF50"; if (ratio < 0.3) fc = "#f44336"; else if (ratio < 0.7) fc = "#FF9800";
  ctx.fillStyle = fc; ctx.fillRect(bx + pad, by + pad, fw, bh - pad * 2);
  // セグメント線
  ctx.fillStyle = "#111";
  for (let i = 1; i < 5; i++) ctx.fillRect(bx + pad + (bw - pad * 2) * (i / 5) - 1, by + pad, 2, bh - pad * 2);
  // テキスト
  ctx.fillStyle = "#fff"; ctx.font = "bold 22px 'Press Start 2P', monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(`${pct}%`, bx + bw / 2, by + bh / 2);
  ctx.font = "11px 'Press Start 2P', monospace";
  ctx.fillText("CHARGING", w / 2, by - capH - 18);
}

// ═══════════════════════════════════════════════════
//  ユーティリティ
// ═══════════════════════════════════════════════════

function easeOut(t: number): number { return 1 - Math.pow(1 - t, 3); }

export default MazeCanvas;
