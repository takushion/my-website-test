/**
 * MazeCanvas — 迷路背景の全画面 Canvas コンポーネント
 *
 * フェーズ遷移:
 *   INIT     : 黒画面 + 充電プログレスバー
 *   BUILDING : DFS 迷路生成アニメーション
 *   ENTERING : キャラクター入場演出
 *   EXPLORING: 右手法による自律探索 + ゴール到達で BUILDING に戻る
 *
 * 毎フレーム requestAnimationFrame で状態更新と描画を行う。
 * 状態は useRef で保持し、描画関数はコンポーネント外の純粋関数として実装。
 */

import React, { useRef, useEffect, useCallback } from "react";
import { AppPhase, Position, AgentState, Direction } from "../maze/types";
import { MazeGenerator, calcMazeDimensions } from "../maze/useMazeGenerator";
import {
  drawMaze,
  drawCellHighlight,
  gridToCanvas,
} from "../maze/mazeRenderer";
import {
  CHARACTERS,
  pickRandomCharacters,
  CharacterDrawFn,
} from "../maze/characters";
import styles from "./MazeCanvas.module.scss";

/** 全フェーズ共通の tick 間隔（フレーム数） */
const TICK = 20;
/** 掘削用 tick（TICKの半分＝倍速） */
const BUILD_TICK = Math.floor(TICK / 2);
/** 充電ステップ数 */
const INIT_STEPS = 25;

interface MazeCanvasProps {
  onPhaseChange: (phase: AppPhase) => void;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({ onPhaseChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    phase: AppPhase; generator: MazeGenerator | null;
    grid: ("wall" | "path")[][]; agents: AgentState[];
    selectedChars: CharacterDrawFn[]; history: Position[];
    enterTimer: number; enteredCount: number; enterStartPos: Position;
    tick: number; initTick: number; initStep: number;
    buildTick: number; buildStep: number;
    cols: number; rows: number; cellSize: number; goal: Position;
  }>({
    phase: "INIT", generator: null, grid: [], agents: [], selectedChars: [],
    history: [], enterTimer: 0, enteredCount: 0, enterStartPos: { x: 0, y: 0 },
    tick: 0, initTick: 0, initStep: 0,
    buildTick: 0, buildStep: 0,
    cols: 21, rows: 15, cellSize: 40, goal: { x: 0, y: 0 },
  });

  const onPhaseChangeRef = useRef(onPhaseChange);
  onPhaseChangeRef.current = onPhaseChange;

/** 迷路全体をリセットして再生成する。skipInit=true なら INIT をスキップ */
  const resetMaze = useCallback((skipInit: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width || window.innerWidth;
    const h = canvas.height || window.innerHeight;
    const { cols, rows } = calcMazeDimensions(w, h);
    const cellSize = Math.floor(Math.min(w / cols, h / rows));

    const gen = new MazeGenerator(cols, rows);
    const charIndices = pickRandomCharacters();
    const startPos = gen.getStartPosition();
    const chars = [charIndices[0], charIndices[1], charIndices[2]].map((i) => CHARACTERS[i]);
    const agents: AgentState[] = charIndices.map((ci) => ({
      pos: { ...startPos }, direction: "right" as const, characterIndex: ci,
    }));

    Object.assign(stateRef.current, {
      phase: skipInit ? "BUILDING" as const : "INIT" as const,
      generator: gen, grid: gen.getGrid(), agents,
      selectedChars: chars, history: [{ ...startPos }],
      enterTimer: 0, enteredCount: 0, enterStartPos: startPos,
      tick: 0, initTick: 0, initStep: 0,
      buildTick: 0, buildStep: 0,
      cols, rows, cellSize, goal: { x: 0, y: 0 },
    });

    if (skipInit) {
      onPhaseChangeRef.current("BUILDING");
    } else {
      onPhaseChangeRef.current("INIT");
    }
  }, []);

  useEffect(() => {
    resetMaze(false);
    let animId: number;
    const loop = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      update(ctx);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback((ctx: CanvasRenderingContext2D) => {
    const st = stateRef.current;
    const prevPhase = st.phase;

    switch (st.phase) {
      case "INIT":
        updateInit(st, ctx);
        break;
      case "BUILDING":
        // 迷路描画
        drawMaze(ctx, st.grid, st.cols, st.rows, st.cellSize);
        updateBuilding(st, ctx);
        break;
      case "ENTERING":
        drawMaze(ctx, st.grid, st.cols, st.rows, st.cellSize);
        if (st.goal.x > 0 || st.goal.y > 0) {
          drawCellHighlight(ctx, st.goal, st.cols, st.rows, st.cellSize);
        }
        updateEntering(st, ctx);
        break;
      case "EXPLORING":
        drawMaze(ctx, st.grid, st.cols, st.rows, st.cellSize);
        if (st.goal.x > 0 || st.goal.y > 0) {
          drawCellHighlight(ctx, st.goal, st.cols, st.rows, st.cellSize);
        }
        updateExploring(st, ctx);
        break;
    }

    if (st.phase !== prevPhase) {
      if (st.phase === "ENTERING" && st.generator) {
        st.goal = st.generator.getLastPosition();
      }
      onPhaseChangeRef.current(st.phase);
    }
  }, []);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

// ---- types ----
type St = ReturnType<typeof getSt>;
function getSt() {
  return {} as {
    phase: AppPhase; generator: MazeGenerator | null;
    grid: ("wall" | "path")[][]; agents: AgentState[];
    selectedChars: CharacterDrawFn[]; history: Position[];
    enterTimer: number; enteredCount: number; enterStartPos: Position;
    tick: number; initTick: number; initStep: number;
    buildTick: number; buildStep: number;
    cols: number; rows: number; cellSize: number; goal: Position;
  };
}

// ━━━ フェーズ別の更新関数 ━━━

/** INIT: 黒画面 + 充電プログレスバー。所定ステップで BUILDING へ */
function updateInit(st: St, ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  st.tick++;
  if (st.tick >= TICK) {
    st.tick = 0;
    st.initStep++;
    if (st.initStep >= INIT_STEPS) {
      st.phase = "BUILDING"; return;
    }
  }
  drawProgress(ctx, st.initStep, INIT_STEPS);
}

// ---- BUILDING: DFS step-by-step で迷路を掘る ----
function updateBuilding(st: St, ctx: CanvasRenderingContext2D): void {
  if (!st.generator) return;
  st.tick++;
  if (st.tick >= BUILD_TICK) {
    st.tick = 0;
    const done = st.generator.nextStep();
    st.grid = st.generator.getGrid();
    st.buildStep++;
    if (done) { st.phase = "ENTERING"; st.enterTimer = 0; st.enteredCount = 0; return; }
  }
  const current = st.generator.getCurrent();
  drawCellHighlight(ctx, current, st.cols, st.rows, st.cellSize);
}

// ---- ENTERING: 3体のキャラクター入場演出 ----
function updateEntering(st: St, ctx: CanvasRenderingContext2D): void {
  st.enterTimer++;
  const totalFrames = 40, gapFrames = 15;
  for (let i = 0; i < 3; i++) {
    const startFrame = i * (totalFrames + gapFrames);
    if (st.enterTimer <= startFrame) continue;
    const localT = Math.min(1, (st.enterTimer - startFrame) / totalFrames);
    if (localT >= 1) {
      if (i >= st.enteredCount) st.enteredCount = i + 1;
      const cp = gridToCanvas(st.enterStartPos, st.cols, st.rows, st.cellSize, ctx.canvas.width, ctx.canvas.height);
      ctx.save(); ctx.translate(cp.x, cp.y);
      st.selectedChars[i](ctx, -st.cellSize / 2, -st.cellSize / 2, st.cellSize, st.agents[i].direction);
      ctx.restore();
      continue;
    }
    const t = easeOut(localT);
    const startX = -st.cellSize;
    const cp = gridToCanvas(st.enterStartPos, st.cols, st.rows, st.cellSize, ctx.canvas.width, ctx.canvas.height);
    ctx.save(); ctx.translate(startX + (cp.x - startX) * t, cp.y);
    ctx.scale(0.5 + t * 0.5, 0.5 + t * 0.5);
    st.selectedChars[i](ctx, -st.cellSize / 2, -st.cellSize / 2, st.cellSize, "right");
    ctx.restore();
  }
  if (st.enteredCount >= 3) st.phase = "EXPLORING";
}

// ---- EXPLORING: 右手法で自律探索 + ゴールチェック + 再生成 ----
function updateExploring(st: St, ctx: CanvasRenderingContext2D): void {
  st.tick++;
  if (st.tick >= TICK) {
    st.tick = 0;
    moveAgents(st);
  }
  // ゴール到達
  if (st.agents[0].pos.x === st.goal.x && st.agents[0].pos.y === st.goal.y) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const { cols, rows } = calcMazeDimensions(w, h);
    const cellSize = Math.floor(Math.min(w / cols, h / rows));
    const gen = new MazeGenerator(cols, rows);
    const ci = pickRandomCharacters();
    const sp = gen.getStartPosition();
    const chars = [ci[0], ci[1], ci[2]].map((x) => CHARACTERS[x]);
    const ags: AgentState[] = ci.map((ci2) => ({
      pos: { ...sp }, direction: "right" as const, characterIndex: ci2,
    }));
    Object.assign(st, {
      phase: "BUILDING" as const, generator: gen, grid: gen.getGrid(), agents: ags,
      selectedChars: chars, history: [{ ...sp }],
      enterTimer: 0, enteredCount: 0, enterStartPos: sp,
      tick: 0, initTick: 0, initStep: 0, buildTick: 0, buildStep: 0,
      cols, rows, cellSize, goal: { x: 0, y: 0 },
    });
    return;
  }
  for (let i = 2; i >= 0; i--) {
    const cp = gridToCanvas(st.agents[i].pos, st.cols, st.rows, st.cellSize, ctx.canvas.width, ctx.canvas.height);
    ctx.save(); ctx.translate(cp.x, cp.y);
    st.selectedChars[i](ctx, -st.cellSize / 2, -st.cellSize / 2, st.cellSize, st.agents[i].direction);
    ctx.restore();
  }
}

/** 右手法でエージェントを1歩移動 + フォロワー追従 */
function moveAgents(st: St): void {
  if (st.agents.length < 1) return;
  const l = st.agents[0];
  const nd = rightHandMove(l.pos, l.direction, st.grid, st.cols, st.rows);
  const np = moveInDir(l.pos, nd); l.pos = np; l.direction = nd;
  st.history.push({ ...np }); if (st.history.length > 256) st.history.shift();
  followLeader(st.agents[1], st.history, 1, st.agents[0].direction);
  followLeader(st.agents[2], st.history, 2, st.agents[0].direction);
}

/** 右手法: 右→前→左→後ろ の順で最初に見つかった通路方向を返す */
function rightHandMove(pos: Position, dir: Direction, grid: ("wall" | "path")[][], cols: number, rows: number): Direction {
  for (const d of getPriorities(dir)) { const n = moveInDir(pos, d); if (isPath(n, grid, cols, rows)) return d; }
  return dir;
}
function getPriorities(dir: Direction): Direction[] { switch (dir) { case "up": return ["right","up","left","down"]; case "right": return ["down","right","up","left"]; case "down": return ["left","down","right","up"]; case "left": return ["up","left","down","right"]; default: return ["right","up","left","down"]; } }
function moveInDir(pos: Position, dir: Direction): Position { switch (dir) { case "up": return { x: pos.x, y: pos.y - 1 }; case "right": return { x: pos.x + 1, y: pos.y }; case "down": return { x: pos.x, y: pos.y + 1 }; case "left": return { x: pos.x - 1, y: pos.y }; } }
function isPath(pos: Position, grid: ("wall" | "path")[][], cols: number, rows: number): boolean { return pos.x >= 0 && pos.x < cols && pos.y >= 0 && pos.y < rows && grid[pos.y][pos.x] === "path"; }
function followLeader(f: AgentState | undefined, h: Position[], d: number, dir: Direction): void { if (!f || h.length === 0) return; const i = Math.max(0, h.length - 1 - d); f.pos = { ...h[i] }; f.direction = dir; }
function easeOut(t: number): number { return 1 - Math.pow(1 - t, 3); }

/** 充電風プログレスバーを Canvas に描画 */
function drawProgress(ctx: CanvasRenderingContext2D, step: number, total: number): void {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const barW = Math.min(w * 0.7, 500), barH = 28;
  const x = (w - barW) / 2, y = h * 0.85;
  const ratio = Math.min(1, step / total);
  const pct = Math.floor(ratio * 100);
  ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(x - 4, y - 4, barW + 8, barH + 8);
  ctx.strokeStyle = "#4a9"; ctx.lineWidth = 3; ctx.strokeRect(x, y, barW, barH);
  ctx.fillStyle = "#4a9"; ctx.fillRect(x + 2, y + 2, (barW - 4) * ratio, barH - 4);
  ctx.fillStyle = "#fff"; ctx.font = "bold 16px 'Press Start 2P', monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(`${pct}%`, w / 2, y + barH / 2);
  ctx.font = "12px 'Press Start 2P', monospace";
  ctx.fillText("CHARGING...", w / 2, y - 18);
}

export default MazeCanvas;
