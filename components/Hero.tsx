"use client";

import Link from "next/link";
import { CSSProperties, PointerEvent, useState } from "react";
import { assetPath } from "@/lib/assets";

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

export function Hero() {
  const [activeCell, setActiveCell] = useState<{ column: number; row: number } | null>(null);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setActiveCell({
      column: Math.max(0, Math.min(gridColumns - 1, Math.floor((event.clientX - bounds.left) / cellSize))),
      row: Math.max(0, Math.min(gridRows - 1, Math.floor((event.clientY - bounds.top) / cellSize)))
    });
  }

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
    <section
      className={`hero pattern-field${activeCell ? " is-hovered" : ""}`}
      onFocus={() => setActiveCell({ column: 7, row: 4 })}
      onMouseEnter={() => setActiveCell((current) => current ?? { column: 7, row: 4 })}
      onMouseLeave={() => setActiveCell(null)}
      onPointerMove={handlePointerMove}
    >
      <div className="cursor-pattern" aria-hidden="true">
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
      <div className="hero-copy">
        <div className="hero-title">
          <p className="eyebrow">Resilient AI and Grounded Sensing Lab</p>
          <h1>AI for chaos.</h1>
        </div>
        <div className="hero-summary">
          <p className="lede">
            The RAGS Lab builds artificial intelligence that actually works in
            moments of crisis: chaotic, unpredictable, and unforgiving
            environments where information is incomplete and lives depend on
            systems that cannot afford to fail.
          </p>
          <div className="button-row">
            <Link className="button" href="/publications">
              Publications
            </Link>
            <Link className="button secondary" href="/collaborate">
              Collaborate
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={assetPath("/brand/logo-no-text.svg")}
        >
          <source src={assetPath("/brand/rags-lab-hero.mp4")} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
