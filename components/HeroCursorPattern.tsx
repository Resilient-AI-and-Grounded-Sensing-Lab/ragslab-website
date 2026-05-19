"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";

const cellSize = 72;
const gridColumns = 16;
const gridRows = 10;
const gridCells = Array.from({ length: gridColumns * gridRows }, (_, index) => {
  const column = index % gridColumns;
  const row = Math.floor(index / gridColumns);

  return {
    column,
    fragment: (column * 13 + row * 17 + (column * row) % 7) % 8,
    row
  };
});

export function HeroCursorPattern() {
  const patternRef = useRef<HTMLDivElement>(null);
  const [activeCell, setActiveCell] = useState<{ column: number; row: number } | null>(null);

  useEffect(() => {
    const hero = patternRef.current?.closest<HTMLElement>(".hero");
    if (!hero) return;
    const heroElement = hero;

    function handlePointerMove(event: PointerEvent) {
      const bounds = heroElement.getBoundingClientRect();
      setActiveCell({
        column: Math.max(0, Math.min(gridColumns - 1, Math.floor((event.clientX - bounds.left) / cellSize))),
        row: Math.max(0, Math.min(gridRows - 1, Math.floor((event.clientY - bounds.top) / cellSize)))
      });
    }

    function handleFocus() {
      setActiveCell({ column: 7, row: 4 });
    }

    function handleMouseEnter() {
      setActiveCell((current) => current ?? { column: 7, row: 4 });
    }

    function handleMouseLeave() {
      setActiveCell(null);
    }

    heroElement.addEventListener("focusin", handleFocus);
    heroElement.addEventListener("mouseenter", handleMouseEnter);
    heroElement.addEventListener("mouseleave", handleMouseLeave);
    heroElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      heroElement.removeEventListener("focusin", handleFocus);
      heroElement.removeEventListener("mouseenter", handleMouseEnter);
      heroElement.removeEventListener("mouseleave", handleMouseLeave);
      heroElement.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  function getCellState(column: number, row: number) {
    if (!activeCell) return "";

    const dx = column - activeCell.column;
    const dy = row - activeCell.row;
    const distance = Math.hypot(dx, dy);
    const noise = Math.abs(Math.sin((column + 1) * 12.9898 + (row + 1) * 78.233 + activeCell.column * 7.13 + activeCell.row * 3.91));
    const brokenColumn = Math.abs(dx) < 1 && Math.abs(dy) > 1;

    if (distance === 0) return " is-active is-near";
    if (distance <= 2.2 && noise > 0.32 && !brokenColumn) return " is-active";
    if (distance <= 3.8 && noise > 0.77 && !brokenColumn) return " is-active is-far";
    return "";
  }

  return (
    <div ref={patternRef} className={`cursor-pattern${activeCell ? " is-hovered" : ""}`} aria-hidden="true">
      {gridCells.map((cell) => (
        <span
          className={`cursor-cell${getCellState(cell.column, cell.row)}`}
          data-fragment={cell.fragment}
          key={`${cell.column}-${cell.row}`}
          style={
            {
              "--cell-column": cell.column,
              "--cell-row": cell.row
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
