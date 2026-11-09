import { CHARACTERS } from "./characters";
import { Direction } from "./types";

function renderCharacter(index: number, direction: Direction): number[][] {
  const rects: number[][] = [];
  const context = {
    fillStyle: "",
    fillRect: (...args: number[]) => rects.push(args),
  } as unknown as CanvasRenderingContext2D;

  CHARACTERS[index](context, 0, 0, 96, direction);
  return rects;
}

test("9種類のチンチラを16×16相当のドット密度で描画する", () => {
  expect(CHARACTERS).toHaveLength(9);

  for (let i = 0; i < CHARACTERS.length; i++) {
    expect(renderCharacter(i, "up").length).toBeGreaterThan(64);
  }
});

test("キャラクターは進行方向に応じて向きが変わる", () => {
  const up = renderCharacter(0, "up");
  const right = renderCharacter(0, "right");

  expect(right).not.toEqual(up);
});
